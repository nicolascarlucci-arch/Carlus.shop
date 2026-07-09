import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://carlus.shop',
  output: 'server',
  adapter: vercel(),
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
