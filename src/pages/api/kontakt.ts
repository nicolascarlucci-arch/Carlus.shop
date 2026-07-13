export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();

  // Honeypot
  if (data.get('website')) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const name = String(data.get('name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const message = String(data.get('message') ?? '').trim();

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Bitte alle Felder ausfüllen.' }), { status: 400 });
  }

  const brevoKey = import.meta.env.BREVO_API_KEY;
  const toEmail = import.meta.env.CONTACT_TO_EMAIL ?? 'support@cartana.de';

  if (brevoKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: "Carlu's Shop", email: toEmail },
          to: [{ email: toEmail }],
          replyTo: { email, name },
          subject: `Kontaktanfrage von ${name}`,
          textContent: `Name: ${name}\nE-Mail: ${email}\n\n${message}`,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      console.error('Brevo send failed:', err);
      return new Response(JSON.stringify({ error: 'E-Mail konnte nicht gesendet werden.' }), { status: 500 });
    }
  } else {
    console.log('Contact form submission (no BREVO_API_KEY):', { name, email, message });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
