const CACHE = "racine-v21";
const SHELL = ["./", "index.html", "app.css", "app.js", "config.js", "compte.js", "generateurs.js", "generateurs_plus.js", "generateurs_lettres.js", "exos_gen.js", "assistant.js", "agenda.js", "ecole.js", "vie-scolaire.js", "notes.js", "emploi.js", "registres.js", "demandes.js", "communication.js", "eleves-plus.js", "proprio.js", "qrcode.js", "vie.js", "apprendre.js", "chapitres.js", "manifest.webmanifest", "data/questions.json", "data/config.json", "icons/icon-192.png", "icons/logo.svg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("racine-") && k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
// Réseau d'abord (dernières questions), cache si hors ligne : l'appli marche sans connexion.
// En économie de données (drapeau « eco » dans le cache racine_prefs), tout est lu dans le cache ; « ?fresh » force la mise à jour.
const keyOf = (req) => { const u = new URL(req.url); return u.origin + u.pathname; };
// « no-cache » : on redemande toujours au serveur s'il y a du nouveau, sinon une mise à jour peut mettre 10 min à arriver
const fresh = (req) => (req.mode === "navigate" ? fetch(req.url, { cache: "no-cache", credentials: "same-origin" }) : fetch(req, { cache: "no-cache" }));
const net = (req) => fresh(req).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(keyOf(req), copy)); } return r; }).catch(() => caches.match(keyOf(req)));
const eco = () => caches.open("racine_prefs").then((c) => c.match("eco")).then((r) => (r ? r.text() : "0")).catch(() => "0");
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  // polices : gardées une fois pour toutes
  if (/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) { e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; }))); return; }
  if (u.origin !== self.location.origin) return;
  e.respondWith(eco().then((on) => (on === "1" && !u.search.includes("fresh") ? caches.match(keyOf(e.request)).then((r) => r || net(e.request)) : net(e.request))));
});
