export default defineNuxtConfig({
  ssr: true,
  srcDir: "src/",
  css: ["~/app/styles/main.css"],
  devtools: { enabled: false },
  nitro: {
    preset: "node-server"
  },
  runtimeConfig: {
    public: {
      appName: "Curs Admin",
      siteUrl: "http://localhost:3001"
    }
  }
});
