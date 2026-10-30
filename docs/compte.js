"use strict";
// Comptes élèves : connexion Google (Firebase Auth), essai et premium enregistrés en ligne (Firestore).
// Sans configuration Firebase, l'appli garde le fonctionnement local (Compte.enabled = false).
// Configuration publique du projet Firebase propre à Racine School (pas secrète : la sécurité vient des règles Firestore).
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAmnY2Pg6JUVsEcbTcVLT6csGKy4jNlYxQ",
  authDomain: "racine-school-c7395.firebaseapp.com",
  projectId: "racine-school-c7395",
  storageBucket: "racine-school-c7395.firebasestorage.app",
  messagingSenderId: "844843150303",
  appId: "1:844843150303:web:092035ec1e23816432326a",
};

// Espace propriétaire : réservé au compte du vendeur de l'appli. On ne publie que le SHA-256 de son e-mail ;
// les règles Firestore font la même vérification (e-mail vérifié), donc personne d'autre ne lit ces données.
const PROPRIO_HASH = "5b8002b6edb3c6b43af5a05915211af5663f8a33404dca218b03e6d72441bbf1";

const Compte = (() => {
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  const enabled = !!FIREBASE_CONFIG;
  let auth = null, db = null, user = null, doc = null, timer = null, ready = false, proprio = false;

  const load = (src) => new Promise((ok, ko) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });

  // Résout avec le profil en ligne ({ created, premium, data }) ou null si l'élève n'est pas connecté
  async function start() {
    if (!enabled) return null;
    await load(SDK + "firebase-app-compat.js");
    await Promise.all([load(SDK + "firebase-auth-compat.js"), load(SDK + "firebase-firestore-compat.js")]);
    firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth(); db = firebase.firestore();
    // tests en local avec l'émulateur Firebase : http://localhost:5000/?emu
    if (location.hostname === "localhost" && /[?&]emu\b/.test(location.search)) { auth.useEmulator("http://localhost:9099"); db.useEmulator("localhost", 8080); }
    surveiller();
    await auth.getRedirectResult().catch(() => null);
    user = await new Promise((ok) => { const off = auth.onAuthStateChanged((u) => { off(); ok(u); }); });
    ready = true;
    return user ? profile() : null;
  }

  async function profile() {
    const ref = db.collection("users").doc(user.uid);
    let snap = await ref.get();
    if (!snap.exists) {
      // la date de création vient du serveur : effacer le téléphone ne relance pas l'essai
      await ref.set({ created: firebase.firestore.FieldValue.serverTimestamp(), premium: false, name: user.displayName || "", data: {} });
      snap = await ref.get();
    }
    doc = snap.data();
    proprio = !!(user.email && user.emailVerified) && (await sha(user.email.toLowerCase())) === PROPRIO_HASH;
    envoyerErreurs();
    return { created: doc.created ? doc.created.toDate() : new Date(), premium: !!doc.premium, suspendu: doc.suspendu === true, data: doc.data || {}, name: user.displayName || "", email: user.email || "" };
  }

  async function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try { await auth.signInWithPopup(provider); }
    catch (e) {
      if (/popup|operation-not-supported/.test(e.code || "")) return auth.signInWithRedirect(provider);
      throw e;
    }
    user = auth.currentUser;
    return profile();
  }

  // Connexion par e-mail et mot de passe (utile sur iPhone si la fenêtre Google ne s'ouvre pas)
  async function signInEmail(email, pass, create) {
    const r = create ? await auth.createUserWithEmailAndPassword(email, pass) : await auth.signInWithEmailAndPassword(email, pass);
    user = r.user;
    return profile();
  }
  const resetPassword = (email) => auth.sendPasswordResetEmail(email);

  async function signOut() { if (auth) await auth.signOut(); user = null; }

  // Un code premium ne sert qu'une fois : la règle Firestore refuse de recréer claims/{code}
  async function claim(code) {
    const batch = db.batch();
    batch.set(db.collection("claims").doc(code), { uid: user.uid, at: firebase.firestore.FieldValue.serverTimestamp() });
    batch.update(db.collection("users").doc(user.uid), { premium: true, code });
    await batch.commit();
  }

  // Sauvegarde des progrès : au plus une écriture par minute, et tout de suite quand l'élève quitte l'appli.
  // Cela garde 10 000 élèves dans le quota gratuit de Firestore (20 000 écritures par jour).
  let pending = null;
  function flush() {
    if (!pending || !user || !db) return;
    const state = pending; pending = null; clearTimeout(timer); timer = null;
    const last = (o, n) => Object.fromEntries(Object.entries(o || {}).sort().slice(-n));
    const data = { level: state.level || null, stats: state.stats, sessions: state.sessions.slice(-50), days: state.days.slice(-120), daily: last(state.daily, 60), challenges: last(state.challenges, 60), done: last(state.done, 14), edt: state.edt || {}, todo: (state.todo || []).slice(-100) };
    db.collection("users").doc(user.uid).update({ data }).catch(() => {});
  }
  function save(state) {
    if (!user || !db) return;
    pending = state;
    if (!timer) timer = setTimeout(flush, 60000);
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });

  // Session de groupe : chaque élève publie sa note, tout le groupe voit le classement se remplir en direct
  function postScore(code, rec) {
    if (!user || !db) return Promise.reject(new Error("hors ligne"));
    return db.collection("sessions").doc(code).collection("scores").doc(user.uid)
      .set({ ...rec, at: firebase.firestore.FieldValue.serverTimestamp() });
  }
  function listenScores(code, cb, err) {
    if (!user || !db) return () => {};
    return db.collection("sessions").doc(code).collection("scores").limit(50)
      .onSnapshot((snap) => cb(snap.docs.map((d) => ({ ...d.data(), me: d.id === user.uid }))), err);
  }

  const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map((x) => x.toString(16).padStart(2, "0")).join("");

  // Dernière activité, vue par le propriétaire : au plus une écriture par heure et par téléphone
  function activite(info) {
    if (!user || !db) return;
    const k = "racine-vu-" + user.uid, last = +localStorage.getItem(k) || 0;
    if (Date.now() - last < 36e5) return;
    try { localStorage.setItem(k, String(Date.now())); } catch {}
    db.collection("users").doc(user.uid).update({ vu: firebase.firestore.FieldValue.serverTimestamp(), email: user.email || "", nom: String(info.nom || user.displayName || "").slice(0, 60), role: info.role || "" }).catch(() => {});
  }

  // Journal des erreurs : plantages et actions refusées par le serveur, envoyés au propriétaire (au plus 20 par ouverture)
  const FILE = "racine-erreurs";
  let envoyees = 0;
  const vues = new Set();
  function erreur(type, message) {
    message = String(message || "").slice(0, 500);
    const cle = type + message;
    if (!message || vues.has(cle) || envoyees >= 20) return;
    vues.add(cle); envoyees++;
    const e = { type, message, page: (location.hash || "#accueil").slice(0, 100), quand: Date.now() };
    let file = [];
    try { file = JSON.parse(localStorage.getItem(FILE) || "[]"); } catch {}
    try { localStorage.setItem(FILE, JSON.stringify([...file, e].slice(-20))); } catch {}
    envoyerErreurs();
  }
  function envoyerErreurs() {
    if (!user || !db || !add) return;
    let file = [];
    try { file = JSON.parse(localStorage.getItem(FILE) || "[]"); localStorage.removeItem(FILE); } catch {}
    const compte = String(user.email || user.displayName || user.uid).slice(0, 100);
    for (const e of file) {
      add.call(db.collection("erreurs"), { uid: user.uid, compte, type: e.type, message: e.message, page: e.page,
        tel: navigator.userAgent.slice(0, 200), at: firebase.firestore.FieldValue.serverTimestamp() }).catch(() => {});
    }
  }
  // Toute lecture ou écriture refusée par les règles Firestore est notée, même quand l'appli l'ignore
  let add = null;
  function surveiller() {
    const fs = firebase.firestore, refus = (e) => { if (e && e.code === "permission-denied") erreur("refus", e.message); throw e; };
    add = fs.CollectionReference.prototype.add;
    const wrap = (cls, names) => cls && names.forEach((n) => { const proto = cls.prototype, f = proto[n]; if (f) proto[n] = function (...a) { return f.apply(this, a).catch(refus); }; });
    wrap(fs.DocumentReference, ["get", "set", "update", "delete"]);
    wrap(fs.CollectionReference, ["add"]);
    wrap(fs.Query, ["get"]);
    wrap(fs.WriteBatch, ["commit"]);
  }
  window.addEventListener("error", (e) => erreur("plantage", `${e.message} (${String(e.filename || "").split("/").pop()}:${e.lineno})`));
  window.addEventListener("unhandledrejection", (e) => { const r = e.reason || {}; if (r.code !== "permission-denied") erreur("plantage", r.message || String(r)); });

  // Données de l'espace propriétaire (les règles refusent tout autre compte)
  const comptes = async () => (await db.collection("users").get()).docs.map((d) => ({ ...d.data(), uid: d.id }));
  const erreurs = async () => (await db.collection("erreurs").orderBy("at", "desc").limit(200).get()).docs.map((d) => ({ ...d.data(), id: d.id }));
  const suspendre = (uid, oui) => db.collection("users").doc(uid).update({ suspendu: oui });
  async function viderErreurs(ids) {
    for (let i = 0; i < ids.length; i += 400) { const b = db.batch(); ids.slice(i, i + 400).forEach((id) => b.delete(db.collection("erreurs").doc(id))); await b.commit(); }
  }

  return { enabled, start, activite, erreur, comptes, erreurs, suspendre, viderErreurs, get proprio() { return proprio; }, get suspendu() { return !!(doc && doc.suspendu === true); }, postScore, listenScores, signIn, signInEmail, resetPassword, signOut, claim, save, get user() { return user; }, get ready() { return ready; } };
})();
