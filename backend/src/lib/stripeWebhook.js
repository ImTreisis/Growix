import Stripe from 'stripe';
import Registration from '../models/Registration.js';
import Seminar from '../models/Seminar.js';
import User from '../models/User.js';
import { sendRegistrationConfirmationEmail, sendOrganizerNotificationEmail } from './email.js';

export async function handleStripeWebhook(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY );
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET is missing');
    return res.status(500).send('Webhook secret not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { seminarId, userId, guestEmail, firstName, lastName } = session.metadata || {};
    const normalizedGuestEmail = typeof guestEmail === 'string' ? guestEmail.trim().toLowerCase() : '';
    if (!seminarId || (!userId && !normalizedGuestEmail)) {
      console.error('❌ Webhook missing metadata');
      return res.status(400).send('Missing metadata');
    }

    try {
      const existing = userId
        ? await Registration.findOne({ seminar: seminarId, user: userId })
        : await Registration.findOne({ seminar: seminarId, guestEmail: normalizedGuestEmail });
      if (existing) {
        console.log('Registration already exists, skipping');
        return res.json({ received: true });
      }

      const amountTotal = session.amount_total || 0;
      const platformFeeCents = Math.round(amountTotal * 0.06);

      const reg = await Registration.create({
        seminar: seminarId,
        user: userId || null,
        guestEmail: userId ? '' : normalizedGuestEmail,
        firstName: firstName || '',
        lastName: lastName || '',
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent || '',
        amountCents: amountTotal,
        platformFeeCents,
      });

      const seminar = await Seminar.findById(seminarId).populate('createdBy', 'email firstName lastName');
      const user = userId ? await User.findById(userId) : null;
      const recipientEmail = user?.email || normalizedGuestEmail;
      if (recipientEmail && seminar) {
        await sendRegistrationConfirmationEmail({
          to: recipientEmail,
          firstName: firstName || user?.firstName || '',
          lastName: lastName || user?.lastName || '',
          seminarTitle: seminar.title,
          seminarDate: seminar.localDateTime,
          venue: seminar.venue,
        });
        const organizer = seminar.createdBy;
        if (organizer?.email) {
          await sendOrganizerNotificationEmail({
            to: organizer.email,
            organizerName: organizer.firstName || organizer.lastName || 'Organizer',
            registrantName: `${firstName || ''} ${lastName || ''}`.trim() || user?.firstName || user?.lastName || 'A participant',
            seminarTitle: seminar.title,
          });
        }
      }
      console.log('✅ Registration created from webhook:', reg._id);
    } catch (err) {
      // Stripe may retry the same webhook; treat duplicate registration inserts as success.
      if (err?.code === 11000) {
        console.warn('⚠️ Duplicate registration insert ignored:', err?.keyValue);
        return res.json({ received: true });
      }
      console.error('❌ Webhook handler error:', err);
      return res.status(500).send('Webhook handler failed');
    }
  }

  res.json({ received: true });
}
