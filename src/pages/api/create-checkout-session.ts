export const prerender = false;

import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { getStripeClient } from '@/lib/stripe';
import { getProductBySlug, getVariant } from '@/data/products';
import { SHIPPING } from '@/data/shipping';

interface CartPayload {
  variantId: string;
  productSlug: string;
  quantity: number;
}

// Cold Vercel function starts / momentary Stripe API blips shouldn't turn
// into a hard failure for the customer — retry once on errors that look
// transient (network/rate-limit), not on errors that would fail identically
// every time (bad price ID, invalid params, etc).
async function createSessionWithRetry(
  stripe: Stripe,
  params: Stripe.Checkout.SessionCreateParams,
): Promise<Stripe.Checkout.Session> {
  try {
    return await stripe.checkout.sessions.create(params);
  } catch (err) {
    const type = (err as { type?: string })?.type;
    const retryable = type === 'StripeConnectionError' || type === 'StripeAPIError' || type === 'StripeRateLimitError';
    if (!retryable) throw err;
    await new Promise((r) => setTimeout(r, 400));
    return stripe.checkout.sessions.create(params);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const items: CartPayload[] = body.items ?? [];

    if (!items.length) {
      return new Response(JSON.stringify({ error: 'Warenkorb ist leer.' }), { status: 400 });
    }

    const stripe = getStripeClient();
    const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://carlucci.store';

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let subtotalEUR = 0;

    for (const item of items) {
      const product = getProductBySlug(item.productSlug);
      if (!product) return new Response(JSON.stringify({ error: 'Unbekanntes Produkt.' }), { status: 400 });

      const variant = getVariant(product, item.variantId);
      if (!variant) return new Response(JSON.stringify({ error: 'Unbekannte Variante.' }), { status: 400 });

      if (variant.stripePriceId.startsWith('price_REPLACE_ME')) {
        return new Response(JSON.stringify({ error: 'Shop ist noch nicht eingerichtet (fehlende Stripe Price IDs).' }), { status: 503 });
      }

      subtotalEUR += variant.priceEUR * item.quantity;
      lineItems.push({
        price: variant.stripePriceId,
        quantity: item.quantity,
      });
    }

    const shippingEUR = subtotalEUR >= SHIPPING.freeAboveEUR ? 0 : SHIPPING.flatRateEUR;

    const session = await createSessionWithRetry(stripe, {
      mode: 'payment',
      // payment_method_types intentionally omitted: Stripe then shows every method
      // enabled in the Dashboard (Settings > Payment methods) automatically, filtered
      // by currency/customer country. An explicit list here would fail the whole
      // session if one listed method isn't activated on the account yet.
      line_items: lineItems,
      shipping_options: shippingEUR === 0
        ? [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 0, currency: 'eur' }, display_name: 'Kostenloser Versand' } }]
        : [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: Math.round(shippingEUR * 100), currency: 'eur' }, display_name: `Versand (${SHIPPING.carrier})` } }],
      shipping_address_collection: {
        allowed_countries: [...SHIPPING.countries],
      },
      invoice_creation: { enabled: true },
      success_url: `${siteUrl}/checkout/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/abbruch`,
      locale: 'de',
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    // Surface the actual reason (Stripe's own error messages are written to
    // be shown to end users, e.g. "No such price: ...") instead of a bare
    // "Interner Fehler." — a specific message here is the difference between
    // a instantly-diagnosable report and having to dig through Vercel logs
    // blind every time this happens again.
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return new Response(
      JSON.stringify({ error: `Zahlung konnte nicht gestartet werden (${message}). Bitte versuche es erneut oder kontaktiere uns.` }),
      { status: 500 },
    );
  }
};
