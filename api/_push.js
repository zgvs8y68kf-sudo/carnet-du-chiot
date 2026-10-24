const webpush = require("web-push");
let ready = false;
function init() {
  if (ready) return;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "https://carnet-du-chiot.vercel.app",
    process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  ready = true;
}
// Renvoie "ok", "gone" (abonnement expiré : à supprimer) ou "error".
async function send(subscription, payload) {
  init();
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload), { TTL: 1800, urgency: "high" });
    return "ok";
  } catch (e) {
    if (e.statusCode === 404 || e.statusCode === 410) return "gone";
    console.error("push", e.statusCode, e.body || e.message);
    return "error";
  }
}
module.exports = { send };
