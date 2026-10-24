/* État des abonnements : un seul fichier JSON dans Vercel Blob, à un chemin secret (STATE_KEY).
   Lecture par l'URL publique (1 « simple operation »), écriture uniquement quand quelque chose change
   (1 « advanced operation ») : on reste dans le quota gratuit Hobby (10k simples, 2k avancées par mois). */
const { put } = require("@vercel/blob");

function path() {
  const key = process.env.STATE_KEY;
  if (!key) throw new Error("STATE_KEY manquant");
  return "state/" + key + ".json";
}
function url() {
  // Jeton : vercel_blob_rw_<storeId>_<secret> ; URL publique : https://<storeid>.public.blob.vercel-storage.com/<chemin>
  const id = (process.env.BLOB_READ_WRITE_TOKEN || "").split("_")[3];
  if (!id) throw new Error("BLOB_READ_WRITE_TOKEN manquant");
  return "https://" + id.toLowerCase() + ".public.blob.vercel-storage.com/" + path();
}
async function load() {
  const r = await fetch(url() + "?t=" + Date.now(), { cache: "no-store" });
  if (r.status === 404) return { subs: {} };
  if (!r.ok) throw new Error("lecture Blob : " + r.status);
  const s = await r.json();
  s.subs = s.subs || {};
  return s;
}
async function save(state) {
  await put(path(), JSON.stringify(state), {
    access: "public", addRandomSuffix: false, allowOverwrite: true,
    contentType: "application/json", cacheControlMaxAge: 60
  });
}
module.exports = { load, save };
