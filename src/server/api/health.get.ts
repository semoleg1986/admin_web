export default defineEventHandler(() => {
  return {
    ok: true,
    service: "admin_app",
    timestamp: new Date().toISOString()
  };
});
