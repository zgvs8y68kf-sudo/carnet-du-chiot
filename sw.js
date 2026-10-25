/* Service worker : rappels (push) et fonctionnement hors ligne. */
const CACHE="carnet-v2";
const SHELL=["/","/shared.js","/manifest.webmanifest","/icon-192.png","/icon-512.png","/apple-touch-icon.png"];

self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// Réseau d'abord (pour toujours avoir la dernière version), cache si hors ligne.
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin||u.pathname.startsWith("/api/")) return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match("/"))));
});

self.addEventListener("push",e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={title:"Carnet du Chiot",body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||"Carnet du Chiot",{
    body:d.body||"",tag:d.tag,icon:"/icon-192.png",badge:"/badge-96.png",data:{url:d.url||"/"}
  }));
});
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||"/";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if("focus" in c){c.navigate(url).catch(()=>{});return c.focus()}}
    return self.clients.openWindow(url);
  }));
});
