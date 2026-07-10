// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'https://www.wlanklar.de';
const noIndexPaths = new Set(['/impressum/', '/datenschutz/', '/quiz/']);

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !noIndexPaths.has(new URL(page).pathname),
    }),
  ],
});
