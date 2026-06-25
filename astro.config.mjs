import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: 'https://what-michael-did-next.co.uk',
	integrations: [
		sitemap()
	]
});