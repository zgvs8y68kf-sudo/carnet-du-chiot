/* Appelé toutes les 5 minutes (GitHub Actions, voir .github/workflows/rappels.yml).
   Envoie à chaque téléphone les étapes du planning dont l'heure est passée depuis le dernier envoi.
   Idempotent : un appel en trop n'envoie rien de plus. */
const { dayPlan } = require("../shared.js");
const { load, save } = require("./_store");
const { send } = require("./_push");
const { localToUtc, localDate } = require("./_util");

const ICO = { repas: "🍽️", pipi: "🌿", educ: "🎾", sieste: "💤", nuit: "🌙" };
const LATE = 30 * 60 * 1000; // au-delà de 30 min de retard, un rappel ne sert plus à rien

function dueEvents(s, from, to) {
  const out = [];
  for (const back of [1, 0]) {
    const ld = localDate(to - back * 86400000, s.tz);
    const date = new Date(ld.y, ld.m - 1, ld.d);
    for (const e of dayPlan(date, s.pup).events) {
      if (e.quiet || s.prefs[e.cat] === false) continue;
      const at = localToUtc(ld.y, ld.m, ld.d, e.m, s.tz);
      if (at > from && at <= to) out.push(Object.assign({ at, day: ld }, e));
    }
  }
  return out.sort((a, b) => a.at - b.at);
}

module.exports = async (req, res) => {
  try {
    const now = Date.now();
    const state = await load();
    let changed = false, sent = 0;
    for (const [id, s] of Object.entries(state.subs)) {
      const from = Math.max(s.sentUntil || now - 10 * 60000, now - LATE);
      const evs = dueEvents(s, from, now);
      if (!evs.length) continue;
      for (const e of evs) {
        const r = await send(s.sub, {
          title: ICO[e.cat] + " " + e.ti,
          body: e.tx,
          tag: e.day.y + "-" + e.day.m + "-" + e.day.d + "-" + e.id,
          url: "/#planning"
        });
        if (r === "gone") { delete state.subs[id]; break; }
        if (r === "ok") sent++;
      }
      if (state.subs[id]) state.subs[id].sentUntil = now;
      changed = true;
    }
    if (changed) await save(state);
    res.status(200).json({ ok: true, subs: Object.keys(state.subs).length, sent });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
