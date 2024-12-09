// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import icon from 'astro-icon';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind({
    // Isso permite o override do base.css do Astro e aplicar layers de estilos do Tailwind
    applyBaseStyles: false,
  }), icon(), react()],
  site: 'https://devpedrorocha.github.io/engenharia-usabilidade/',
  base: '/engenharia-usabilidade/',
});