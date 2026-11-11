const CACHE="fr-studio-3ee2de3b745b";const FILES=["./","./index.html","./app.js","./reference-extraction.js","./style.css","./cad-workspace.css","./standalone.css","./manifest.webmanifest","./assets/favicon.svg","./assets/icon-192.png","./assets/icon-512.png","./assets/forms/curvo.webp","./assets/forms/ovalado.webp","./assets/forms/recto.webp","./assets/forms/redondo.webp"];
// CACHE and FILES are generated from the exact compiled release by build-fr.
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('fr-studio-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.location).pathname))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const cached=await cache.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  return fetch(event.request);
 }));
});
