const CACHE = "racine-v6";
const SHELL = ["./", "index.html", "app.css", "app.js", "compte.js", "generateurs.js", "assistant.js", "agenda.js", "ecole.js", "manifest.webmanifest", "data/questions.json", "data/config.json", "icons/icon-192.png", "icons/logo.svg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("racine-") && k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
// Réseau d'abord (dernières questions), cache si hors ligne : l'appli marche sans connexion
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
