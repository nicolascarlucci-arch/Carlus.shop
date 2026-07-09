import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-06-24.dahlia',
    });
  }
  return _stripe;
}
