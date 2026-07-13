export const prerender = false;

import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { getStripeClient } from '@/lib/stripe';

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new Response('Missing signature', { status: 400 });
  }

  let event;
  try {
    const body = await request.text();
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  async function notifyOrder(session: Stripe.Checkout.Session, note: string) {
    console.log(note, {
      sessionId: session.id,
      customer: session.customer_details?.email,
      amount: session.amount_total,
    });

    const brevoKey = import.meta.env.BREVO_API_KEY;
    const toEmail = import.meta.env.CONTACT_TO_EMAIL ?? 'support@cartana.de';
    if (brevoKey) {
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: "Carlu's Shop", email: toEmail },
            to: [{ email: toEmail }],
            subject: `Neue Bestellung – ${session.id}`,
            textContent: `Neue Bestellung eingegangen!\n\nSession: ${session.id}\nKunde: ${session.customer_details?.email}\nBetrag: ${((session.amount_total ?? 0) / 100).toFixed(2)} EUR`,
          }),
        });
      } catch (err) {
        console.error('Failed to send order notification email:', err);
      }
    }
  }

  // Some payment methods (e.g. SEPA-Lastschrift) settle asynchronously: the session
  // completes right away but payment_status stays 'unpaid' until the debit clears days
  // later. Only notify immediately for methods that confirm on the spot; delayed ones
  // are notified via the async_payment_succeeded event instead.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      await notifyOrder(session, 'Order completed:');
    }
  } else if (event.type === 'checkout.session.async_payment_succeeded') {
    await notifyOrder(event.data.object, 'Delayed payment cleared:');
  } else if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object;
    console.log('Delayed payment failed:', { sessionId: session.id, customer: session.customer_details?.email });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
