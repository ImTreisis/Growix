import express from 'express';
import Stripe from 'stripe';
import Registration from '../models/Registration.js';
import Seminar from '../models/Seminar.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { sendRegistrationConfirmationEmail, sendOrganizerNotificationEmail } from '../lib/email.js';

const router = express.Router();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

const PLATFORM_FEE_PERCENT = 6;

// Parse price string to cents (e.g. "15" or "15.50" -> 1500 or 1550)
function priceToCents(priceStr) {
  if (!priceStr || priceStr === '0' || priceStr === '0.00') return 0;
  const num = parseFloat(String(priceStr).replace(',', '.').replace(/[^\d.-]/g, ''));
  if (Number.isNaN(num) || num <= 0) return 0;
  return Math.round(num * 100);
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

// Create checkout session (paid) or register directly (free)
router.post('/checkout', async (req, res) => {
  try {
    const { seminarId, firstName, lastName, email } = req.body;
    const guestEmail = normalizeEmail(email);
    const userId = req.session?.userId || null;

    if (!seminarId || !firstName?.trim() || !lastName?.trim() || (!userId && !guestEmail)) {
      return res.status(400).json({ message: 'Seminar, first name, last name, and email are required' });
    }

    const seminar = await Seminar.findById(seminarId).populate('createdBy', 'email firstName lastName');
    if (!seminar) return res.status(404).json({ message: 'Seminar not found' });
    if (seminar.type === 'event') return res.status(400).json({ message: 'Registration is only available for workshops' });
    if (!seminar.registrationEnabled) return res.status(400).json({ message: 'Registration is not available for this workshop' });

    const priceCents = priceToCents(seminar.price);
    const isFree = priceCents === 0;

    // Check if already registered
    const existing = userId
      ? await Registration.findOne({ seminar: seminarId, user: userId })
      : await Registration.findOne({ seminar: seminarId, guestEmail });
    if (existing) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    const user = userId ? await User.findById(userId) : null;
    const recipientEmail = user?.email || guestEmail;
    const appUrl = process.env.APP_BASE_URL || 'https://www.growix.lt';
    const baseUrl = appUrl.replace(/\/$/, '');

    if (isFree) {
      const reg = await Registration.create({
        seminar: seminarId,
        user: userId || null,
        guestEmail: userId ? '' : guestEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        paidAt: new Date(),
      });
      await sendRegistrationConfirmationEmail({
        to: recipientEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        seminarTitle: seminar.title,
        seminarDate: seminar.localDateTime,
        venue: seminar.venue,
      });
      const organizer = seminar.createdBy;
      if (organizer?.email) {
        await sendOrganizerNotificationEmail({
          to: organizer.email,
          organizerName: organizer.firstName || organizer.lastName || 'Organizer',
          registrantName: `${firstName.trim()} ${lastName.trim()}`,
          seminarTitle: seminar.title,
        });
      }
      return res.json({ success: true, registrationId: reg._id, free: true });
    }

    const stripe = getStripe();
    if (!stripe) return res.status(500).json({ message: 'Payment is not configured' });

    const feeCents = Math.round(priceCents * (PLATFORM_FEE_PERCENT / 100));
    const lineItems = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: seminar.title,
            description: `${seminar.venue} • ${seminar.localDateTime || seminar.date}`,
          },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ];
    if (feeCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Platform fee (${PLATFORM_FEE_PERCENT}%)`,
            description: 'Service fee',
          },
          unit_amount: feeCents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/register/${seminarId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/register/${seminarId}`,
      metadata: {
        seminarId,
        userId: userId || '',
        guestEmail: userId ? '' : guestEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: err.message || 'Checkout failed' });
  }
});

// Get registrations for a seminar (organizer only)
router.get('/seminar/:seminarId', requireAuth, async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.seminarId);
    if (!seminar) return res.status(404).json({ message: 'Seminar not found' });
    if (String(seminar.createdBy) !== req.userId) {
      return res.status(403).json({ message: 'Only the organizer can view registrations' });
    }
    const registrations = await Registration.find({ seminar: req.params.seminarId })
      .populate('user', 'email firstName lastName')
      .sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (err) {
    console.error('Get registrations error:', err);
    res.status(500).json({ message: 'Failed to load registrations' });
  }
});

export default router;
