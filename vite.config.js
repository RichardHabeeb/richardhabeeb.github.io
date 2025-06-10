import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { setupPlugins } from '@responsive-image/vite-plugin';

export default defineConfig({
  plugins: [
	solidPlugin(),
    // all your other plugins ...
    setupPlugins({
      include: /^[^?]+\.(?:jpg|JPG|png|PNG)\?.*responsive.*$/,
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});

