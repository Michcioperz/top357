import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // server: {
  //   proxy: {
  //     '/samples': {
  //       target: "https://radio357.s3.eu-central-1.amazonaws.com",
  //       headers: {
  //         Host: "radio357.s3.eu-central-1.amazonaws.com",
  //       },
  //       configure(proxy, options) {
  //           proxy.on("proxyRes", (proxyRes) => {
  //             proxyRes.headers['cache-control'] = "public, immutable, max-age=604800";
  //           })
  //       },
  //     },
  //   },
  // },
})
