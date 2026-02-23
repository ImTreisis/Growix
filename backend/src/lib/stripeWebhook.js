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
    const { seminarId, userId, firstName, lastName } = session.metadata || {};
    if (!seminarId || !userId) {
      console.error('❌ Webhook missing metadata');
      return res.status(400).send('Missing metadata');
    }

    try {
      const existing = await Registration.findOne({ seminar: seminarId, user: userId });
      if (existing) {
        console.log('Registration already exists, skipping');
        return res.json({ received: true });
      }

      const amountTotal = session.amount_total || 0;
      const platformFeeCents = Math.round(amountTotal * 0.10);

      const reg = await Registration.create({
        seminar: seminarId,
        user: userId,
        firstName: firstName || '',
        lastName: lastName || '',
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent || '',
        amountCents: amountTotal,
        platformFeeCents,
      });

      const seminar = await Seminar.findById(seminarId).populate('createdBy', 'email firstName lastName');
      const user = await User.findById(userId);
      if (user?.email && seminar) {
        await sendRegistrationConfirmationEmail({
          to: user.email,
          firstName: firstName || user.firstName || '',
          lastName: lastName || user.lastName || '',
          seminarTitle: seminar.title,
          seminarDate: seminar.localDateTime,
          venue: seminar.venue,
        });
        const organizer = seminar.createdBy;
        if (organizer?.email) {
          await sendOrganizerNotificationEmail({
            to: organizer.email,
            organizerName: organizer.firstName || organizer.lastName || 'Organizer',
            registrantName: `${firstName || ''} ${lastName || ''}`.trim() || user.firstName || user.lastName || 'A participant',
            seminarTitle: seminar.title,
          });
        }
      }
      console.log('✅ Registration created from webhook:', reg._id);
    } catch (err) {
      console.error('❌ Webhook handler error:', err);
      return res.status(500).send('Webhook handler failed');
    }
  }

  res.json({ received: true });
}
