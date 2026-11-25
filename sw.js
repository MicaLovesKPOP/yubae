// SPDX-License-Identifier: GPL-3.0-or-later
// Each build has a unique cache. Activation of an update requires explicit approval.
const CACHE='yubae-studio-292557b5ec53bfaf';
const BASE=self.registration.scope;
const assets=['index.html','manifest.webmanifest','icon-192.png','icon-512.png','Yubae_Studio.html'];
const url=p=>new URL(p,BASE).href;
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(assets.map(p=>new Request(url(p),{cache:'reload'})))));
});
self.addEventListener('message',event=>{
 if(event.data?.type==='ACTIVATE')self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith('yubae-studio-')&&key!==CACHE)await caches.delete(key);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request,u=new URL(req.url);
 if(req.method!=='GET'||!u.href.startsWith(BASE))return;
 const relative=u.pathname.slice(new URL(BASE).pathname.length);
 if(req.mode==='navigate'&&(relative===''||relative==='index.html')){
  event.respondWith(caches.open(CACHE).then(c=>c.match(url('index.html'))).then(r=>r||fetch(req)));
 }else if(assets.includes(relative)){
  event.respondWith(caches.open(CACHE).then(c=>c.match(url(relative))).then(r=>r||fetch(req)));
 }
});
