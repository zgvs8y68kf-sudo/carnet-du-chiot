const crypto = require("crypto");
function idOf(endpoint) { return crypto.createHash("sha256").update(endpoint).digest("hex").slice(0, 24); }
async function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString() || "{}");
}
// Décalage du fuseau (ms) à l'instant `ms`.
function tzOffset(ms, tz) {
  const p = {};
  new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(ms)).forEach(x => p[x.type] = x.value);
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(ms / 1000) * 1000;
}
// Instant UTC d'une heure locale (minutes depuis minuit, éventuellement > 1440) du jour y-m-d dans le fuseau tz.
function localToUtc(y, m, d, min, tz) {
  const guess = Date.UTC(y, m - 1, d, 0, min);
  let t = guess - tzOffset(guess, tz);
  const o2 = tzOffset(t, tz);
  if (t + o2 !== guess) t = guess - o2;
  return t;
}
// Date locale (y, m, d) dans le fuseau tz à l'instant ms.
function localDate(ms, tz) {
  const p = {};
  new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date(ms)).forEach(x => p[x.type] = x.value);
  return { y: +p.year, m: +p.month, d: +p.day };
}
module.exports = { idOf, body, localToUtc, localDate };
