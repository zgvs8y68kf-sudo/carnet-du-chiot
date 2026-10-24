/* POST : enregistre ou met à jour l'abonnement d'un téléphone (avec les réglages du chiot et les rappels choisis).
   DELETE : supprime l'abonnement. */
const { load, save } = require("./_store");
const { send } = require("./_push");
const { idOf, body } = require("./_util");

const CATS = ["repas", "pipi", "educ", "sieste", "nuit"];
const MAX_SUBS = 20;

module.exports = async (req, res) => {
  try {
    const b = await body(req);
    const sub = b.subscription;
    if (!sub || typeof sub.endpoint !== "string" || !/^https:\/\//.test(sub.endpoint)) {
      return res.status(400).json({ error: "abonnement invalide" });
    }
    const id = idOf(sub.endpoint);
    const state = await load();

    if (req.method === "DELETE") {
      if (state.subs[id]) { delete state.subs[id]; await save(state); }
      return res.status(200).json({ ok: true });
    }
    if (req.method !== "POST") return res.status(405).end();

    const p = b.pup || {};
    const clean = s => String(s || "").slice(0, 20);
    const prefs = {};
    CATS.forEach(c => prefs[c] = !(b.prefs && b.prefs[c] === false));
    const isNew = !state.subs[id];
    if (isNew && Object.keys(state.subs).length >= MAX_SUBS) return res.status(429).json({ error: "trop d'abonnements" });
    state.subs[id] = {
      sub: { endpoint: sub.endpoint, keys: { p256dh: String(sub.keys && sub.keys.p256dh || ""), auth: String(sub.keys && sub.keys.auth || "") } },
      pup: { name: clean(p.name), birth: clean(p.birth), arrival: clean(p.arrival), wake: clean(p.wake), bed: clean(p.bed) },
      prefs,
      tz: clean(b.tz) || "Europe/Paris",
      sentUntil: (state.subs[id] && state.subs[id].sentUntil) || Date.now(),
      updated: Date.now()
    };
    await save(state);
    if (isNew || b.test) {
      await send(state.subs[id].sub, {
        title: "Rappels activés 🐾",
        body: "Ce téléphone recevra les rappels de la journée de " + (state.subs[id].pup.name || "ton chiot") + ".",
        tag: "test", url: "/#planning"
      });
    }
    return res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "erreur serveur" });
  }
};
