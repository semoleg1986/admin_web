export default defineNuxtConfig({
  ssr: true,
  srcDir: "src/",
  dir: {
    public: "../public"
  },
  css: ["~/app/styles/main.css"],
  devtools: { enabled: false },
  nitro: {
    preset: "node-server"
  },
  runtimeConfig: {
    authServiceBaseUrl: "http://localhost:8000",
    paymentsServiceBaseUrl: "http://localhost:8004",
    public: {
      apiBaseUrl: "/api",
      appName: "Curs Admin",
      siteUrl: "http://localhost:3001"
    }
  }
});
