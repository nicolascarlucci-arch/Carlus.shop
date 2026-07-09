/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
  readonly STRIPE_TAX_RATE_ID?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly BREVO_API_KEY?: string;
  readonly CONTACT_TO_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
