"use strict";
// Espace école de Racine School : profils (élève, parent, professeur, surveillant, personnel, direction), fiche d'inscription de l'élève,
// tableau de bord de la direction (effectifs, classes, progrès, paiements), devoirs publiés par les professeurs.
// La vie scolaire (annonces, appel, portail, carte d'élève, documents, espace parent) est dans vie-scolaire.js.
// Avec le Firebase de l'école, tout est partagé en ligne (Firestore) ; sans lui, tout reste sur ce téléphone.

const ROLES = { eleve: "Élève", parent: "Parent", prof: "Professeur", surveillant: "Surveillant", personnel: "Personnel", directeur: "Direction" };
const CLE_PREFIXE = { prof: "PROF", surveillant: "SURV", personnel: "PERS", directeur: "DIR" };
// tout profil autre qu'élève a l'espace école à la place des révisions
const isStaff = () => !!S.role && S.role !== "eleve";
const estCaisse = () => S.role === "directeur" || S.role === "personnel";
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const moisNom = (m) => (m === "inscription" ? "Inscription" : MOIS[+m.slice(5) - 1] + " " + m.slice(0, 4));
const ceMois = () => today().slice(0, 7);
const niveauOf = (level) => String(level).split(" ")[0];
const initiales = (f) => ((f.prenom || "?")[0] + (f.nom || "")[0] || "").toUpperCase();
const nomComplet = (f) => `${f.prenom || ""} ${f.nom || ""}`.trim();
const avatar = (f, cls = "av") => f.photo ? `<img class="${cls}" src="${esc(f.photo)}" alt="">` : `<span class="${cls}">${esc(initiales(f))}</span>`;
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const numeroRecu = () => `R${today().slice(2, 4)}${today().slice(5, 7)}-${Array.from(crypto.getRandomValues(new Uint8Array(5)), (x) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join("")}`;
const codeParentNeuf = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), (x) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join("");
const telLien = (t) => String(t || "").replace(/\D/g, "").replace(/^(?=[67]\d{8}$)/, "221");

// Chaque classe garde un identifiant fixe : la direction peut la renommer sans perdre ses élèves ni ses devoirs
function slugClasse(nom) { return "c-" + String(nom).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
const classeById = (cfg, id) => cfg.classes.find((c) => c.id === id);
const cidDe = (cfg, x) => x.cid || x.classeId || (cfg.classes.find((c) => c.nom === x.classe) || {}).id || x.classe;
// élèves et devoirs rattachés à leur classe par identifiant, avec le nom de classe à jour
function rattacher(cfg, items) {
  return items.map((x) => { const cid = cidDe(cfg, x), c = classeById(cfg, cid); return { ...x, cid, classe: c ? c.nom : x.classe }; });
}
const ECOLE_DEFAUT = {
  annee: "2026-2027", debut: "2026-10", fin: "2027-07", inscription: 25000,
  mensualites: { "6e": 15000, "5e": 15000, "4e": 17500, "3e": 20000, "2nde": 22500, "1ère": 25000, "Tle": 27500 },
  // liste indicative pour une grande école : la direction renomme, ajoute ou supprime les classes dans « Réglages »
  classes: [...["6e", "5e", "4e", "3e"].flatMap((n) => "ABCDE".split("").map((l) => [`${n} ${l}`, n])),
    ["2nde L A", "2nde L"], ["2nde L B", "2nde L"], ["2nde S A", "2nde S"], ["2nde S B", "2nde S"],
    ["1ère L A", "1ère L2"], ["1ère L B", "1ère L2"], ["1ère S1", "1ère S1"], ["1ère S2 A", "1ère S2"], ["1ère S2 B", "1ère S2"],
    ["Tle L A", "Tle L2"], ["Tle L B", "Tle L2"], ["Tle S1", "Tle S1"], ["Tle S2 A", "Tle S2"], ["Tle S2 B", "Tle S2"]].map(([nom, level]) => ({ id: slugClasse(nom), nom, level })),
};

// Mois de scolarité déjà échus (inscription comprise) : ceux qu'un élève à jour a réglés
function moisEchus(cfg) {
  const out = ["inscription"];
  for (let m = cfg.debut; m <= cfg.fin && m <= ceMois(); ) {
    out.push(m);
    const [y, mo] = m.split("-").map(Number);
    m = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, "0")}`;
  }
  return out;
}
const montantDu = (cfg, f, m) => (m === "inscription" ? cfg.inscription : cfg.mensualites[niveauOf(f.level || "")] || 0);
function retard(cfg, f, pay) {
  const dus = moisEchus(cfg).filter((m) => !(pay || {})[m]);
  return { mois: dus, montant: dus.reduce((n, m) => n + montantDu(cfg, f, m), 0) };
}

// ---------- Données : Firestore si le compte de l'école est branché, sinon ce téléphone
const Ecole = (() => {
  const KEY = "racine-ecole";
  const L = (() => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } })();
  const keep = () => { try { localStorage.setItem(KEY, JSON.stringify(L)); } catch {} };
  const online = () => !!(Compte.enabled && Compte.user && window.firebase);
  const db = () => firebase.firestore();
  const shared = () => online();
  const myId = () => (online() ? Compte.user.uid : (S.idLocal = S.idLocal || "moi-" + Math.random().toString(36).slice(2, 10)));
  let cfgCache = null;

  async function config() {
    if (cfgCache) return cfgCache;
    let c = L.config;
    if (online()) c = (await db().collection("ecole").doc("config").get().catch(() => null))?.data() || c;
    c = { ...ECOLE_DEFAUT, ...(c || {}) };
    return (cfgCache = { ...c, classes: c.classes.map((x) => ({ ...x, id: x.id || slugClasse(x.nom) })) });
  }
  async function setConfig(c) {
    cfgCache = c; L.config = c; keep(); journal("Réglages de l'école modifiés");
    if (online()) await db().collection("ecole").doc("config").set(c);
  }
  async function saveFiche(f) {
    const id = myId(); f = { ...f, id };
    if (online()) {
      await db().collection("eleves").doc(id).set(f, { merge: true });
      // le code parent pointe vers cette fiche ; il n'est créé qu'une fois (refusé ensuite par les règles)
      if (f.codeParent) await db().collection("codesParent").doc(f.codeParent).set({ eleve: id }).catch(() => {});
    } else { L.eleves = { ...(L.eleves || {}), [id]: { ...(L.eleves || {})[id], ...f } }; keep(); }
  }
  async function maFiche() {
    if (online()) return (await db().collection("eleves").doc(myId()).get().catch(() => null))?.data() || null;
    return (L.eleves || {})[myId()] || null;
  }
  async function eleves() {
    if (shared()) return (await db().collection("eleves").get()).docs.map((d) => ({ ...d.data(), id: d.id }));
    return Object.values(L.eleves || {});
  }
  async function paiements() {
    if (shared()) return Object.fromEntries((await db().collection("paiements").get()).docs.map((d) => [d.id, d.data()]));
    return L.paiements || {};
  }
  // chaque paiement reçoit un numéro de reçu (mois de l'encaissement + 5 caractères) et garde le montant et qui l'a encaissé
  async function payer(id, mois, paye, montant = 0) {
    const val = paye ? { le: today(), recu: numeroRecu(), montant, par: S.staffNom || "" } : null;
    journal(`${paye ? "Paiement enregistré" : "Paiement annulé"} : ${mois === "inscription" ? "inscription" : moisNom(mois)}, élève ${id}${paye ? ` (${fcfa(montant)}, reçu ${val.recu})` : ""}`);
    if (shared()) await db().collection("paiements").doc(id).set({ [mois]: val || firebase.firestore.FieldValue.delete() }, { merge: true });
    else { const p = { ...(L.paiements || {})[id] }; if (val) p[mois] = val; else delete p[mois]; L.paiements = { ...(L.paiements || {}), [id]: p }; keep(); }
  }
  async function devoirs(classe = null) {
    let list;
    if (shared()) {
      const q = classe ? db().collection("devoirs").where("cid", "==", classe) : db().collection("devoirs");
      list = (await q.get()).docs.map((d) => ({ ...d.data(), id: d.id }));
    } else list = (L.devoirs || []).filter((d) => !classe || d.cid === classe);
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }
  async function addDevoir(d) {
    d = { ...d, par: myId(), parNom: S.staffNom || "", le: today() };
    if (shared()) await db().collection("devoirs").add(d);
    else { L.devoirs = [...(L.devoirs || []), { ...d, id: "d" + Date.now() }]; keep(); }
  }
  async function delDevoir(id) {
    if (shared()) await db().collection("devoirs").doc(id).delete();
    else { L.devoirs = (L.devoirs || []).filter((d) => d.id !== id); keep(); }
  }
  // La clé d'entrée est vérifiée ici, puis par les règles Firestore quand l'école est en ligne
  async function claimRole(role, cle, nom, classes, tel = "") {
    if (!CFG.cles || CFG.cles[role] !== await sha256(CFG.salt + cle)) throw new Error("clé");
    if (online()) await db().collection("staff").doc(myId()).set({ role, cle, nom, classes });
    await ecrire("annuaire", myId(), { nom, role, tel }).catch(() => {});
  }
  // historique des modifications sensibles, visible par la direction
  function journal(quoi) {
    if (!S.role || S.role === "eleve" || S.role === "parent") return;
    ecrire("journal", null, { quoi, qui: S.staffNom || "", par: myId(), at: new Date().toISOString() }).catch(() => {});
  }
  async function retirerAcces(uid) {
    journal(`Accès retiré : ${uid}`);
    await effacer("annuaire", uid);
    if (shared()) await db().collection("staff").doc(uid).delete().catch(() => {});
  }
  // petites collections de la vie scolaire (annonces, appels, séances, portail, annuaire), rangées comme les devoirs
  async function liste(col, champ = null, val = null) {
    if (shared()) { let q = db().collection(col); if (champ) q = q.where(champ, "==", val); return (await q.get()).docs.map((d) => ({ ...d.data(), id: d.id })); }
    return Object.values((L.col || {})[col] || {}).filter((x) => !champ || x[champ] === val);
  }
  async function lire(col, id) {
    if (shared()) return (await db().collection(col).doc(id).get().catch(() => null))?.data() || null;
    return ((L.col || {})[col] || {})[id] || null;
  }
  async function ecrire(col, id, data) {
    id = id || col.slice(0, 2) + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    if (shared()) await db().collection(col).doc(id).set(data);
    else { L.col = L.col || {}; L.col[col] = { ...(L.col[col] || {}), [id]: { ...data, id } }; keep(); }
    return id;
  }
  async function effacer(col, id) {
    if (shared()) await db().collection(col).doc(id).delete();
    else { const c = { ...((L.col || {})[col] || {}) }; delete c[id]; L.col = { ...(L.col || {}), [col]: c }; keep(); }
  }
  // Notes : une évaluation par document ; en ligne, chaque élève a aussi son relevé (lu par lui et ses parents, sans les notes des autres)
  async function sauverEvaluation(id, ev, eleveIds) {
    journal(`Notes ${id ? "modifiées" : "saisies"} : ${ev.matiere || ""} ${ev.classe || ""} ${ev.titre || ""}`.trim());
    id = await ecrire("notes", id, ev);
    if (shared()) {
      const b = db().batch(), FV = firebase.firestore.FieldValue;
      for (const eid of eleveIds) {
        const n = ev.notes ? ev.notes[eid] : null;
        b.set(db().collection("releves").doc(eid), { evals: { [id]: n === undefined || n === null ? FV.delete()
          : { sid: ev.sid, matiere: ev.matiere, titre: ev.titre, type: ev.type, trimestre: ev.trimestre, coef: ev.coef, sur: ev.sur, date: ev.date, note: n } } }, { merge: true });
      }
      await b.commit();
    }
    return id;
  }
  async function supprimerEvaluation(id, eleveIds) {
    await sauverEvaluation(id, { notes: {} }, eleveIds).catch(() => {});
    await effacer("notes", id);
  }
  async function releve(eid, cid) {
    if (shared()) {
      const d = (await db().collection("releves").doc(eid).get().catch(() => null))?.data();
      return Object.entries((d && d.evals) || {}).map(([id, e]) => ({ ...e, id, cid, notes: { [eid]: e.note } }));
    }
    return Object.values((L.col || {}).notes || {}).filter((e) => e.cid === cid && e.notes && e.notes[eid] !== undefined && e.notes[eid] !== null);
  }
  // Parents : le code de l'enfant (sur sa carte d'élève) relie le téléphone du parent à sa fiche
  async function lierEnfant(code) {
    code = code.trim().toUpperCase().replace(/\s/g, "");
    if (shared()) {
      const c = (await db().collection("codesParent").doc(code).get().catch(() => null))?.data();
      if (!c) throw new Error("code");
      await db().collection("liens").doc(myId() + "_" + c.eleve).set({ parent: myId(), enfant: c.eleve, code });
      return c.eleve;
    }
    const f = Object.values(L.eleves || {}).find((x) => x.codeParent === code);
    if (!f) throw new Error("code");
    return f.id;
  }
  async function mesEnfants() {
    if (!online()) return null;
    return (await db().collection("liens").where("parent", "==", myId()).get()).docs.map((d) => d.data().enfant);
  }
  async function enfant(id) {
    if (shared()) {
      const [f, p] = await Promise.all([db().collection("eleves").doc(id).get(), db().collection("paiements").doc(id).get().catch(() => null)]);
      return f.exists ? { fiche: { ...f.data(), id }, pay: p && p.exists ? p.data() : {} } : null;
    }
    const f = (L.eleves || {})[id];
    return f ? { fiche: f, pay: (L.paiements || {})[id] || {} } : null;
  }
  async function monRole() {
    if (!online()) return null;
    return (await db().collection("staff").doc(myId()).get().catch(() => null))?.data() || null;
  }
  async function setClasses(classes) {
    if (online()) await db().collection("staff").doc(myId()).set({ classes }, { merge: true });
  }
  // Résumé des progrès de l'élève, lu par la direction et les professeurs (au plus toutes les 30 minutes)
  function syncStats(force = false) {
    if (S.role !== "eleve" || !S.fiche || S.fiche.apercu || (!force && Date.now() - (S.statsSync || 0) < 18e5)) return;
    const st = Object.values(S.stats), rep = st.reduce((n, s) => n + s.ok + s.ko, 0), ok = st.reduce((n, s) => n + s.ok, 0);
    const semaine = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); });
    const notes = S.sessions.slice(-10).map((x) => (20 * x.score) / x.total), mat = {};
    for (const [qid, s] of Object.entries(S.stats)) { const sid = (qid.match(/^(.*)-\d+$/) || [])[1]; if (!sid) continue; const m = (mat[sid] = mat[sid] || [0, 0]); m[0] += s.ok + s.ko; m[1] += s.ok; }
    const stats = { rep, ok, derniere: S.days.slice(-1)[0] || null, jours7: semaine.filter((d) => S.days.includes(d)).length,
      moy: notes.length ? Math.round((10 * notes.reduce((a, b) => a + b, 0)) / notes.length) / 10 : null, mat };
    S.statsSync = Date.now(); store.save();
    saveFiche({ ...S.fiche, stats }).catch(() => {});
  }
  // Anciennes données de démonstration (élèves fictifs) : effacées de ce téléphone
  function sansDemo() {
    if (!L.demo && !Object.values(L.eleves || {}).some((f) => f.demo)) return;
    L.eleves = Object.fromEntries(Object.entries(L.eleves || {}).filter(([, f]) => !f.demo)); L.paiements = {}; L.devoirs = (L.devoirs || []).filter((d) => !d.demo);
    L.col = Object.fromEntries(Object.entries(L.col || {}).map(([k, c]) => [k, Object.fromEntries(Object.entries(c).filter(([, x]) => !x.demo))])); L.demo = false; keep();
  }
  sansDemo();
  return { config, setConfig, saveFiche, maFiche, eleves, paiements, payer, devoirs, addDevoir, delDevoir, claimRole, retirerAcces, monRole, setClasses, syncStats,
    liste, lire, ecrire, effacer, lierEnfant, mesEnfants, enfant, myId, sauverEvaluation, supprimerEvaluation, releve,
    get online() { return online(); }, reset() { cfgCache = null; } };
})();

// Au démarrage : profil et fiche retrouvés en ligne (nouveau téléphone), devoirs de la classe ajoutés à l'agenda
async function ecoleStart() {
  if (Ecole.online) {
    const st = await Ecole.monRole();
    if (st && !S.role) Object.assign(S, { role: st.role, staffNom: st.nom, profClasses: st.classes || [] });
    if (!S.role || S.role === "eleve") { const f = await Ecole.maFiche(); if (f && !S.fiche) { S.fiche = f; S.role = "eleve"; S.level = S.level || f.level; } }
    if (!S.role || S.role === "parent") { const e = await Ecole.mesEnfants().catch(() => null); if (e && e.length) { S.role = "parent"; S.enfants = [...new Set([...(S.enfants || []), ...e])]; } }
    store.save();
  }
  // fiches remplies avant l'espace parent : on leur donne leur code parent
  if (S.role === "eleve" && S.fiche && !S.fiche.codeParent) { S.fiche = { ...S.fiche, codeParent: codeParentNeuf() }; store.save(); Ecole.saveFiche(S.fiche).catch(() => {}); }
  // classes renommées par la direction : nom à jour sur la fiche, choix du professeur gardés par identifiant
  const cfg = await Ecole.config().catch(() => null);
  if (cfg && S.fiche) { const c = classeById(cfg, cidDe(cfg, S.fiche)); if (c) S.fiche = { ...S.fiche, classeId: c.id, classe: c.nom, level: c.level }; }
  if (cfg && S.profClasses) S.profClasses = S.profClasses.map((x) => (classeById(cfg, x) ? x : cidDe(cfg, { classe: x })));
  store.save();
  await devoirsDansAgenda();
  Ecole.syncStats();
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") Ecole.syncStats(); });

async function devoirsDansAgenda() {
  if (S.role !== "eleve" || !S.fiche) return;
  const list = await Ecole.devoirs(S.fiche.classeId || S.fiche.classe).catch(() => []);
  S.todo = S.todo || []; S.ecoleVus = S.ecoleVus || [];
  let n = 0;
  for (const d of list) {
    if (S.ecoleVus.includes(d.id)) continue;
    S.ecoleVus.push(d.id); n++;
    S.todo.push({ type: d.type, date: d.date, done: false, ecole: d.id, note: [d.note, d.parNom && `publié par ${d.parNom}`].filter(Boolean).join(" · "), ...(d.sid ? { sid: d.sid } : { nom: d.nom || "" }) });
  }
  if (n) store.save();
}

// ---------- Premier écran : qui utilise l'appli ?
function viewRole(err = "") {
  $view.innerHTML = `<div class="card" style="gap:14px;text-align:center">
      <img src="icons/logo.svg" alt="" style="width:96px;height:96px;margin:0 auto;display:block">
      <h1>Bienvenue à Racine School</h1><p class="muted" style="font-style:italic">L'Excellence et la Réussite</p></div>
    <h2>Tu es…</h2>
    <div class="btns">
      <button class="btn role" data-r="eleve">🎒 Élève<span class="small">Je m'inscris et je révise</span></button>
      <button class="btn alt role" data-r="parent">👨🏾‍👩🏾‍👧🏾 Parent<span class="small">Avec le code de mon enfant</span></button>
      <button class="btn alt role" data-r="prof">👩🏾‍🏫 Professeur<span class="small">Avec la clé d'entrée des professeurs</span></button>
      <button class="btn alt role" data-r="surveillant">🛡️ Surveillant<span class="small">Avec la clé d'entrée des surveillants</span></button>
      <button class="btn alt role" data-r="personnel">🗂️ Personnel<span class="small">Secrétariat, caisse, intendance</span></button>
      <button class="btn alt role" data-r="directeur">🏫 Direction<span class="small">Avec la clé d'entrée de la direction</span></button>
    </div><button class="btn alt" id="preins">📝 Pré-inscrire un enfant (nouvel élève)</button>${err ? `<p class="msg-ko small">${esc(err)}</p>` : ""}`;
  document.getElementById("preins").onclick = () => viewPreinscription();
  $view.querySelectorAll(".role").forEach((b) => b.onclick = () => {
    if (b.dataset.r === "eleve") { S.role = "eleve"; store.save(); return go("inscription"); }
    if (b.dataset.r === "parent") { S.role = "parent"; store.save(); return go("ecole"); }
    viewCle(b.dataset.r);
  });
}
function viewCle(role) {
  $view.innerHTML = `<h1>${ROLES[role]}</h1>
    <div class="card"><label class="small">Ton nom (affiché aux élèves)</label><input class="field" id="nom" maxlength="40" placeholder="${role === "directeur" ? "Ex. : M. le Directeur" : "Ex. : M. Diallo"}" value="${esc(S.staffNom || "")}">
      <label class="small">Ton téléphone (annuaire de l'équipe, facultatif)</label><input class="field" id="tel" type="tel" inputmode="tel" maxlength="20" placeholder="77 123 45 67" value="${esc(S.staffTel || "")}">
      <label class="small">Clé d'entrée</label><input class="code" id="cle" placeholder="${CLE_PREFIXE[role]}-XXXXXX" autocomplete="off" maxlength="12">
      <button class="btn" id="ok">Entrer</button><p id="msg" class="small"></p>
      <p class="small muted">La clé est remise par la direction de l'école.</p></div>
    <button class="btn alt" id="back">Retour</button>`;
  document.getElementById("back").onclick = () => viewRole();
  document.getElementById("ok").onclick = async () => {
    const cle = document.getElementById("cle").value.trim().toUpperCase().replace(/\s/g, ""), nom = document.getElementById("nom").value.trim(), tel = document.getElementById("tel").value.trim();
    const msg = document.getElementById("msg");
    if (!nom) { msg.className = "msg-ko small"; msg.textContent = "Écris ton nom."; return; }
    try { await Ecole.claimRole(role, cle, nom, S.profClasses || [], tel); }
    catch { msg.className = "msg-ko small"; msg.textContent = "Clé incorrecte. Vérifie les lettres et les chiffres."; return; }
    Object.assign(S, { role, staffNom: nom, staffTel: tel }); store.save(); go("ecole");
  };
}

// ---------- Fiche d'inscription de l'élève
function photoReduite(file) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.width, img.height), c = document.createElement("canvas"); c.width = c.height = 240;
      c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 240, 240);
      URL.revokeObjectURL(img.src); ok(c.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = ko; img.src = URL.createObjectURL(file);
  });
}
async function viewInscription() {
  const cfg = await Ecole.config(), f = S.fiche || {};
  let photo = f.photo || "";
  const champ = (id, label, attrs = "") => `<label class="small">${label}<input class="field" id="${id}" value="${esc(f[id] || "")}" ${attrs}></label>`;
  $view.innerHTML = `<h1>${S.fiche ? "Ma fiche" : "Mon inscription"}</h1>
    ${S.fiche ? "" : `<p class="muted">Remplis ta fiche une seule fois : ta classe, tes professeurs et la direction te retrouvent ensuite dans l'appli.</p>`}
    <div class="card"><h2>Identité</h2>
      <div class="photo-pick"><span id="ph">${avatar({ ...f, photo }, "av big")}</span>
        <label class="btn alt small">📷 ${photo ? "Changer la photo" : "Ajouter une photo"}<input type="file" id="file" accept="image/*" hidden></label></div>
      ${champ("prenom", "Prénom *", 'maxlength="40" autocomplete="given-name"')}
      ${champ("nom", "Nom *", 'maxlength="40" autocomplete="family-name"')}
      ${champ("naissance", "Date de naissance", 'type="date"')}
      <label class="small">Sexe</label><div class="seg"><button type="button" data-s="F" aria-pressed="${f.sexe === "F"}">Fille</button><button type="button" data-s="G" aria-pressed="${f.sexe === "G"}">Garçon</button></div>
      <label class="small">Classe *<select class="field" id="classe"><option value="">Choisis ta classe</option>${cfg.classes.map((c) => `<option value="${esc(c.id)}"${c.id === cidDe(cfg, f) ? " selected" : ""}>${esc(c.nom)}</option>`).join("")}</select></label></div>
    <div class="card"><h2>Contacts</h2>
      ${champ("tel", "Mon numéro de téléphone", 'type="tel" inputmode="tel" maxlength="20" placeholder="77 123 45 67"')}
      ${champ("whatsapp", "Mon numéro WhatsApp", 'type="tel" inputmode="tel" maxlength="20" placeholder="Laisse vide si c\'est le même"')}
      ${champ("parent", "Nom du parent ou tuteur *", 'maxlength="50"')}
      ${champ("telParent", "Téléphone du parent *", 'type="tel" inputmode="tel" maxlength="20"')}</div>
    <button class="btn" id="save">${S.fiche ? "Enregistrer" : "Valider mon inscription"}</button><p id="msg" class="small"></p>
    ${S.fiche ? `<button class="btn alt" id="role">Changer de profil</button>` : `<button class="btn alt" id="role">Je ne suis pas élève</button>`}`;
  let sexe = f.sexe || "";
  $view.querySelectorAll("[data-s]").forEach((b) => b.onclick = () => { sexe = b.dataset.s; $view.querySelectorAll("[data-s]").forEach((x) => x.setAttribute("aria-pressed", x === b)); });
  document.getElementById("file").onchange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    photo = await photoReduite(file).catch(() => photo);
    document.getElementById("ph").innerHTML = avatar({ ...f, photo }, "av big");
  };
  document.getElementById("role").onclick = () => { delete S.role; store.save(); viewRole(); };
  document.getElementById("save").onclick = async () => {
    const v = (id) => document.getElementById(id).value.trim();
    const msg = document.getElementById("msg"), classe = classeById(cfg, v("classe"));
    if (!v("prenom") || !v("nom") || !classe || !v("parent") || !v("telParent")) { msg.className = "msg-ko small"; msg.textContent = "Remplis les champs marqués d'une étoile (*)."; return; }
    const fiche = { prenom: v("prenom"), nom: v("nom"), naissance: v("naissance"), sexe, classe: classe.nom, classeId: classe.id, level: classe.level, tel: v("tel"), whatsapp: v("whatsapp") || v("tel"),
      parent: v("parent"), telParent: v("telParent"), photo, inscritLe: f.inscritLe || today(), codeParent: f.codeParent || codeParentNeuf() };
    const nouveau = !S.fiche;
    S.fiche = fiche; S.level = classe.level; store.save();
    msg.className = "small muted"; msg.textContent = "Enregistrement…";
    await Ecole.saveFiche({ ...fiche, stats: (await Ecole.maFiche().catch(() => null))?.stats || null }).catch(() => {});
    Ecole.syncStats(true); await devoirsDansAgenda();
    go(nouveau ? "accueil" : "progres");
  };
}
// Carte de l'élève sur l'accueil et dans « Progrès »
function ficheCard() {
  if (S.role !== "eleve" || !S.fiche) return "";
  const f = S.fiche;
  return `<div class="card lib-card fiche-card"><a class="row" style="justify-content:flex-start;text-decoration:none;color:inherit" href="#inscription">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)} · Racine School</span></span></a>
    <span class="row" style="gap:6px"><a class="btn alt small" href="#carte">🪪 Ma carte</a><a class="btn alt small" href="#notes">📑 Mes notes</a><a class="btn alt small" href="#demandes">✉️ Questions</a><a class="btn alt small" href="#messages">💬 Ma classe</a><a class="btn alt small" href="#documents">📂 Documents</a></span></div>`;
}

// ---------- Espace école (équipe et parents)
const ONGLETS = {
  directeur: [["", "Tableau"], ["eleves", "Élèves"], ["paiements", "Paiements"], ["bulletins", "Bulletins"], ["edt", "Emploi du temps"], ["programme", "Programme"], ["devoirs", "Devoirs"], ["annonces", "Annonces"], ["messages", "Messages"], ["documents", "Documents"], ["demandes", "Demandes"], ["registres", "Registres"], ["equipe", "Équipe"], ["reglages", "Réglages"]],
  prof: [["", "Mes classes"], ["appel", "Appel"], ["notes", "Notes"], ["programme", "Programme"], ["quiz", "Quiz en classe"], ["devoirs", "Devoirs"], ["annonces", "Annonces"], ["messages", "Messages"], ["documents", "Documents"], ["demandes", "Demandes"], ["registres", "Registres"], ["equipe", "Annuaire"]],
  surveillant: [["", "Aujourd'hui"], ["portail", "Portail"], ["eleves", "Élèves"], ["demandes", "Demandes"], ["registres", "Registres"], ["annonces", "Annonces"], ["messages", "Messages"], ["documents", "Documents"], ["equipe", "Annuaire"]],
  personnel: [["", "Caisse"], ["eleves", "Élèves"], ["demandes", "Demandes"], ["registres", "Registres"], ["annonces", "Annonces"], ["messages", "Messages"], ["documents", "Documents"], ["equipe", "Annuaire"]],
  parent: [["", "Mon enfant"], ["demandes", "Démarches"], ["annonces", "Annonces"], ["documents", "Documents"]],
};
const TITRES = { directeur: "Direction", prof: "Espace professeur", surveillant: "Vie scolaire", personnel: "Administration", parent: "Espace parent" };
// pages ouvertes depuis une autre (fiche d'un élève, reçu, certificat), selon le profil
const SOUS_PAGES = { directeur: ["eleve", "recu", "certificat", "notes", "bulletin", "registre", "convocation", "journal", "rapport", "cloture", "parents", "defi", "analyse", "clubs", "rendus"], prof: ["eleve", "eleves", "bulletins", "bulletin", "registre", "parents", "defi", "analyse", "clubs", "rendus"], surveillant: ["eleve", "registre", "convocation", "clubs", "defi"], personnel: ["eleve", "recu", "certificat", "paiements", "registre", "cloture"], parent: ["recu", "bulletin"] };
const ongletsEcole = (actif) => `<div class="row onglets noprint">${(ONGLETS[S.role] || []).map(([k, l]) => `<a class="btn alt small${k === actif ? " on" : ""}" href="#ecole${k ? "/" + k : ""}">${l}</a>`).join("")}</div>`;
async function viewEcole() {
  const [, sub = "", arg = "", arg2 = ""] = location.hash.slice(1).split("/").map(decodeURIComponent);
  const role = S.role, titre = TITRES[role] || "Espace école";
  if (![...(ONGLETS[role] || []).map(([k]) => k), ...(SOUS_PAGES[role] || [])].includes(sub)) return go("ecole");
  $view.innerHTML = `<h1>${titre}</h1><p class="muted">Chargement…</p>`;
  try {
    const vide = () => [];
    const equipe = role !== "parent";
    const [cfg, eleves, devoirs, pay, annonces, appels, portail, annuaire] = await Promise.all([Ecole.config(), equipe ? Ecole.eleves() : [], equipe ? Ecole.devoirs() : [], estCaisse() ? Ecole.paiements() : {},
      Ecole.liste("annonces").catch(vide), equipe && role !== "personnel" ? Ecole.liste("appels", "date", today()).catch(vide) : [],
      equipe && role !== "personnel" ? Ecole.lire("portail", today()).catch(() => null) : null, equipe ? Ecole.liste("annuaire").catch(vide) : []]);
    const ctx = { cfg, eleves: rattacher(cfg, eleves).sort((a, b) => (a.nom + a.prenom).localeCompare(b.nom + b.prenom)), devoirs: rattacher(cfg, devoirs), pay,
      annonces: annonces.sort((a, b) => String(b.le).localeCompare(String(a.le))), appels, portail: (portail && portail.retards) || {}, annuaire };
    const actif = { eleve: "eleves", recu: role === "parent" ? "" : "paiements", certificat: "eleves", registre: "registres", convocation: "", bulletin: { parent: "", prof: "notes" }[role] ?? "bulletins", bulletins: role === "prof" ? "notes" : "bulletins", notes: role === "prof" ? "notes" : "bulletins", journal: "registres", rapport: "", cloture: "", parents: "", defi: "", analyse: "", clubs: "registres", rendus: "devoirs" }[sub] ?? sub;
    const head = `<div class="row noprint"><h1>${titre}</h1><span class="small muted">${role === "parent" ? "" : esc(S.staffNom || "")}</span></div>
      ${voirComme()}${ongletsEcole(actif)}`;
    const views = {
      "": { directeur: vueEnsemble, prof: vueProfAccueil, surveillant: vueAujourdhuiComplet, personnel: vueCaisse, parent: vueParent }[role],
      eleves: vueEleves, eleve: vueFicheComplete, paiements: vuePaiementsComplet, registres: vueRegistres, registre: vueRegistre, demandes: vueDemandes, convocation: vueConvocation, devoirs: (ctx) => `<a class="btn alt small" href="#ecole/rendus">📥 Copies rendues en photo</a>${vueDevoirs(ctx)}`, reglages: vueReglages,
      annonces: vueAnnonces, equipe: vueEquipeComplete, edt: vueEdt, programme: vueProgramme, appel: vueAppel, quiz: vueQuiz, portail: vuePortail, recu: vueRecu, certificat: vueCertificat,
      notes: vueNotes, bulletins: vueBulletins, bulletin: vueBulletin,
      messages: vueMessages, documents: vueDocuments, journal: vueJournal, rapport: vueRapport, cloture: vueCloture, parents: vueParentsClasse,
      defi: vueDefi, analyse: vueAnalyse, clubs: vueClubs, rendus: vueRendus,
    };
    $view.innerHTML = head + (await views[sub](ctx, arg, arg2));
    quitter(); lierVoir();
    const b = sub === "" ? bindEcole["accueil-" + role] || bindEcole[""] : bindEcole[sub];
    b && b(ctx, arg, arg2);
    verifierNouveautes().catch(() => {});
  } catch (e) {
    console.error(e);
    $view.innerHTML = `<h1>${titre}</h1><div class="card"><p>Impossible de charger les données de l'école. Vérifie ta connexion puis réessaie.</p><a class="btn" href="#ecole">Réessayer</a></div>
      <button class="btn alt" id="quit">Changer de profil sur ce téléphone</button>`;
    quitter();
  }
}
const actif7 = (f) => f.stats && f.stats.derniere && (new Date(today()) - new Date(f.stats.derniere)) / 864e5 < 7;
const reussite = (f) => (f.stats && f.stats.rep ? pct(f.stats.ok, f.stats.rep) : null);
const badgePay = (r) => (r.mois.length ? `<span class="badge ko">Retard : ${fcfa(r.montant)}</span>` : `<span class="badge ok">À jour</span>`);
function ligneEleve(ctx, f, { pay = false } = {}) {
  const r = reussite(f);
  return `<a class="lib eleve" href="#ecole/eleve/${encodeURIComponent(f.id)}">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)}${r !== null ? ` · ${r} % de réussite` : " · pas encore d'activité"}${actif7(f) ? "" : " · inactif"}</span></span>
    ${pay ? badgePay(retard(ctx.cfg, f, ctx.pay[f.id])) : ""}</a>`;
}

function vueEnsemble(ctx) {
  const { cfg, eleves, pay } = ctx;
  if (!eleves.length) return `<div class="card"><h2>Aucun élève inscrit pour l'instant</h2>
    <p class="muted">Les élèves apparaissent ici dès qu'ils remplissent leur fiche d'inscription dans l'appli.</p></div>`;
  const ret = eleves.map((f) => retard(cfg, f, pay[f.id])), enRetard = ret.filter((r) => r.mois.length);
  const filles = eleves.filter((f) => f.sexe === "F").length, actifs = eleves.filter(actif7).length;
  const avecRep = eleves.filter((f) => reussite(f) !== null);
  const moyReussite = avecRep.length ? Math.round(avecRep.reduce((n, f) => n + reussite(f), 0) / avecRep.length) : 0;
  const parClasse = cfg.classes.map((c) => { const l = eleves.filter((f) => f.cid === c.id), a = l.filter((f) => reussite(f) !== null);
    return { c, n: l.length, f: l.filter((f) => f.sexe === "F").length, actifs: l.filter(actif7).length, ret: l.filter((f) => retard(cfg, f, pay[f.id]).mois.length).length,
      reu: a.length ? Math.round(a.reduce((n, f) => n + reussite(f), 0) / a.length) : null }; });
  const max = Math.max(1, ...parClasse.map((x) => x.n));
  const aSuivre = eleves.filter((f) => !actif7(f) || (reussite(f) !== null && reussite(f) < 50)).sort((a, b) => (reussite(a) ?? -1) - (reussite(b) ?? -1)).slice(0, 5);
  return `${carteDuJour(ctx)}<div class="kpis">
      <div class="card kpi"><span class="small muted">Élèves inscrits</span><b class="count">${eleves.length}</b><span class="small muted">${filles} filles · ${eleves.length - filles} garçons</span></div>
      <div class="card kpi"><span class="small muted">Actifs cette semaine</span><b class="count">${pct(actifs, eleves.length)} %</b><span class="small muted">${actifs} élèves ont révisé</span></div>
      <div class="card kpi"><span class="small muted">Réussite moyenne</span><b class="count">${moyReussite} %</b><span class="small muted">aux QCM de l'appli</span></div>
      <a class="card kpi" href="#ecole/paiements"><span class="small muted">Retards de paiement</span><b class="count ko-txt">${enRetard.length}</b><span class="small muted">${fcfa(enRetard.reduce((n, r) => n + r.montant, 0))} à recouvrer</span></a>
    </div>
    <div class="card"><h2>Répartition par classe</h2>
      <div class="classes">${parClasse.map((x) => `<a class="crow2" href="#ecole/eleves/${encodeURIComponent(x.c.id)}"><span><b>${esc(x.c.nom)}</b></span>
        <span class="bar"><i style="width:${(100 * x.n) / max}%"></i></span><span class="small"><b>${x.n}</b> él.</span>
        <span class="small muted span">${x.f} F · ${x.n - x.f} G · ${x.actifs} actifs${x.reu !== null ? ` · ${x.reu} % réussite` : ""}${x.ret ? ` · <span class="ko-txt">${x.ret} en retard</span>` : ""}</span></a>`).join("")}</div></div>
    ${aSuivre.length ? `<div class="card"><h2>Élèves à suivre</h2><p class="small muted">Peu actifs cette semaine ou moins de 50 % de réussite.</p>${aSuivre.map((f) => ligneEleve(ctx, f)).join("")}</div>` : ""}
    <div class="card"><h2>Dernières inscriptions</h2>${eleves.slice().sort((a, b) => String(b.inscritLe).localeCompare(String(a.inscritLe))).slice(0, 5).map((f) => ligneEleve(ctx, f)).join("")}</div>`;
}

function vueEleves(ctx, classe) {
  const { cfg, eleves } = ctx, dir = S.role !== "prof";
  const mesClasses = dir ? cfg.classes : cfg.classes.filter((c) => (S.profClasses || []).includes(c.id));
  const list = eleves.filter((f) => (classe ? f.cid === classe : mesClasses.some((c) => c.id === f.cid)));
  return `<div class="card"><div class="row"><select class="field" id="cl"><option value="">Toutes ${dir ? "les classes" : "mes classes"}</option>${mesClasses.map((c) => `<option value="${esc(c.id)}"${c.id === classe ? " selected" : ""}>${esc(c.nom)}</option>`).join("")}</select></div>
      <input class="field" id="cherche" placeholder="Chercher un élève…" autocomplete="off">
      <p class="small muted" id="nb">${list.length} élève${list.length > 1 ? "s" : ""}</p>
      <div id="liste">${list.map((f) => `<div data-q="${esc((nomComplet(f) + " " + f.classe).toLowerCase())}">${ligneEleve(ctx, f, { pay: estCaisse() })}</div>`).join("") || `<p class="muted">Aucun élève inscrit dans cette classe pour l'instant.</p>`}</div></div>
    ${estCaisse() && list.length ? `<button class="btn alt" id="export">📊 Télécharger la liste pour Excel (${list.length} élève${list.length > 1 ? "s" : ""})</button>` : ""}`;
}

function vueFiche(ctx, id) {
  const { cfg, eleves, pay } = ctx, f = eleves.find((x) => x.id === id), dir = estCaisse();
  if (!f) return `<div class="card"><p>Élève introuvable.</p></div>`;
  const st = f.stats || {}, r = retard(cfg, f, pay[f.id]);
  const tel = (t, wa = false) => t ? (f.demo ? `${esc(t)} <span class="small muted">(fictif)</span>` : `<a href="${wa ? `https://wa.me/${telLien(t)}` : `tel:${telLien(t)}`}"${wa ? ' target="_blank" rel="noopener"' : ""}>${esc(t)}</a>`) : "—";
  const relance = `Bonjour ${f.parent || ""}, ici la direction de Racine School. Sauf erreur de notre part, la scolarité de ${f.prenom} (${f.classe}) reste à régler pour : ${r.mois.map(moisNom).join(", ")}, soit ${fcfa(r.montant)}. Merci de passer à l'école ou de nous contacter. Bonne journée.`;
  const age = f.naissance ? Math.floor((new Date(today()) - new Date(f.naissance)) / 3.15576e10) : null;
  return `<a class="small" href="#ecole/eleves/${encodeURIComponent(f.cid)}">← ${esc(f.classe)}</a>
    <div class="card" style="align-items:center;text-align:center">${avatar(f, "av big")}<h2>${esc(nomComplet(f))}</h2>
      <p class="muted">${esc(f.classe)}${age ? ` · ${age} ans` : ""}${f.sexe ? ` · ${f.sexe === "F" ? "fille" : "garçon"}` : ""}</p>
      <p class="small muted">Inscrit le ${f.inscritLe ? new Date(f.inscritLe + "T12:00").toLocaleDateString("fr-FR") : "—"}</p></div>
    ${dir ? `<a class="btn alt" href="#ecole/certificat/${encodeURIComponent(f.id)}">📄 Certificat de scolarité</a>` : ""}
    ${absencesEleve(ctx, f)}
    <div class="card"><h2>Progrès dans l'appli</h2>
      <div class="row"><div><p class="small muted">Réponses</p><p class="count">${st.rep || 0}</p></div><div><p class="small muted">Réussite</p><p class="count">${reussite(f) ?? 0} %</p></div>
        <div><p class="small muted">Jours actifs (7 j)</p><p class="count">${st.jours7 || 0}</p></div></div>
      <p class="small muted">Dernière révision : ${st.derniere ? new Date(st.derniere + "T12:00").toLocaleDateString("fr-FR") : "jamais"}${st.moy !== null && st.moy !== undefined ? ` · moyenne aux quiz : ${String(st.moy).replace(".", ",")} / 20` : ""}</p></div>
    <div class="card"><h2>Contacts</h2>
      <div class="row small"><span>Élève</span><span>${tel(f.tel)}</span></div>
      <div class="row small"><span>WhatsApp</span><span>${tel(f.whatsapp, true)}</span></div>
      <div class="row small"><span>Parent : ${esc(f.parent || "—")}</span><span>${tel(f.telParent)}</span></div></div>
    ${dir ? `<div class="card"><div class="row"><h2>Scolarité ${esc(cfg.annee)}</h2>${badgePay(r)}</div>
      ${moisEchus(cfg).map((m) => { const p = (pay[f.id] || {})[m]; return `<div class="row small mois"><span>${moisNom(m)} · ${fcfa(montantDu(cfg, f, m))}</span>
        <span class="row" style="gap:6px">${p && p.recu ? `<a class="small" href="#ecole/recu/${encodeURIComponent(f.id)}/${m}">Reçu</a>` : ""}<button class="btn small ${p ? "" : "alt"} payer" data-m="${m}">${p ? "✓ Payé" : "Encaisser"}</button></span></div>`; }).join("")}
      ${r.mois.length ? (f.demo ? `<p class="small muted">Relance WhatsApp désactivée pour les élèves fictifs.</p>` : `<a class="btn hi-btn" target="_blank" rel="noopener" href="https://wa.me/${telLien(f.telParent)}?text=${encodeURIComponent(relance)}">Relancer le parent sur WhatsApp</a>`) : ""}</div>` : ""}`;
}

function vuePaiements(ctx) {
  const { cfg, eleves, pay } = ctx, dus = moisEchus(cfg);
  const attendu = eleves.reduce((n, f) => n + dus.reduce((s, m) => s + montantDu(cfg, f, m), 0), 0);
  const lignes = eleves.map((f) => ({ f, r: retard(cfg, f, pay[f.id]) })).filter((x) => x.r.mois.length).sort((a, b) => b.r.montant - a.r.montant);
  const reste = lignes.reduce((n, x) => n + x.r.montant, 0);
  return `<div class="card"><h2>Scolarité ${esc(cfg.annee)} à ce jour</h2><p class="small muted">Inscription et mensualités échues jusqu'à ${moisNom(ceMois())}.</p>
      <div class="row"><div><p class="small muted">Attendu</p><b>${fcfa(attendu)}</b></div><div><p class="small muted">Encaissé</p><b class="ok-txt">${fcfa(attendu - reste)}</b></div><div><p class="small muted">Reste</p><b class="ko-txt">${fcfa(reste)}</b></div></div>
      <div class="bar"><i style="width:${pct(attendu - reste, attendu)}%"></i></div><p class="small muted">${pct(attendu - reste, attendu)} % recouvré</p></div>
    <div class="card"><h2>Élèves en retard (${lignes.length})</h2>
      ${lignes.map(({ f, r }) => `<a class="lib eleve" href="#ecole/eleve/${encodeURIComponent(f.id)}">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)} · ${r.mois.map(moisNom).join(", ")}</span></span><b class="ko-txt small">${fcfa(r.montant)}</b></a>`).join("") || `<p class="muted">Tout le monde est à jour. 👏</p>`}</div>`;
}

function vueDevoirs(ctx) {
  const { cfg, devoirs } = ctx, dir = S.role === "directeur";
  const classes = dir ? cfg.classes : cfg.classes.filter((c) => (S.profClasses || []).includes(c.id));
  const avenir = devoirs.filter((d) => d.date >= today() && (dir || (S.profClasses || []).includes(d.cid)));
  const lvl = (classes[0] || {}).level;
  return `<div class="card"><h2>Publier un devoir</h2>
      ${classes.length ? `<p class="small muted">Il arrive dans l'agenda de tous les élèves de la classe.</p>
      <label class="small">Classe<select class="field" id="dcl">${classes.map((c) => `<option value="${esc(c.id)}">${esc(c.nom)}</option>`).join("")}</select></label>
      <label class="small">Type<select class="field" id="dty">${TYPES_TODO.map((t) => `<option>${t}</option>`).join("")}</select></label>
      <label class="small">Matière<span id="dmat">${matieresDe(lvl)}</span></label>
      <label class="small">Pour le<input type="date" class="field" id="ddt" value="${isoDay(addDays(new Date(), 2))}"></label>
      <input class="field" id="dnote" placeholder="Détail (ex. : exercices 3 et 4 page 52)" maxlength="140">
      <button class="btn" id="dadd">Publier</button>`
      : `<p class="muted">Choisis d'abord tes classes dans l'onglet « Mes classes ».</p>`}</div>
    <h2>À venir</h2>
    ${avenir.map((d) => `<div class="card todo"><div class="row"><span><b>${esc(d.type)}</b> · ${esc(d.sid ? subjName(d.sid) : d.nom || "")}</span>${dir || d.par === (Compte.user ? Compte.user.uid : S.idLocal) || d.demo ? `<button class="btn alt small rm" data-id="${esc(d.id)}">✕</button>` : ""}</div>
      <p class="small muted">${esc(d.classe)} · pour le ${new Date(d.date + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}${d.parNom ? ` · ${esc(d.parNom)}` : ""}</p>${d.note ? `<p class="small">${esc(d.note)}</p>` : ""}</div>`).join("") || `<p class="muted">Aucun devoir à venir.</p>`}`;
}
const matieresDe = (level) => `<select class="field" id="dsid">${subjectsOf(level || "6e").filter((s) => !/annales/.test(s.id)).map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}<option value="">Autre / vie scolaire</option></select>`;

function vueReglages(ctx) {
  const { cfg } = ctx;
  return `<div class="card"><h2>Année scolaire</h2>
      <label class="small">Année<input class="field" id="annee" value="${esc(cfg.annee)}" maxlength="9"></label>
      <div class="row"><label class="small" style="flex:1">Premier mois<input class="field" type="month" id="debut" value="${cfg.debut}"></label><label class="small" style="flex:1">Dernier mois<input class="field" type="month" id="fin" value="${cfg.fin}"></label></div>
      <label class="small">Frais d'inscription (FCFA)<input class="field" type="number" id="insc" value="${cfg.inscription}" min="0" step="500"></label>
      <label class="small">Numéro Wave ou Orange Money de l'école (pour les paiements à distance)<input class="field" id="wave" value="${esc(cfg.wave || "")}" maxlength="20" placeholder="77 000 00 00"></label></div>
    <div class="card"><h2>Mensualités (FCFA)</h2>${DATA.classes.map((n) => `<label class="row small">${n}<input class="field mens" style="max-width:140px" type="number" data-n="${n}" value="${cfg.mensualites[n] || 0}" min="0" step="500"></label>`).join("")}</div>
    <div class="card"><h2>Coefficients des matières</h2><p class="small muted">Utilisés pour la moyenne générale des bulletins (1 par défaut).</p>
      ${[...new Set(DATA.subjects.filter((x) => !/annales/.test(x.id)).map((x) => x.name))].sort((a, b) => a.localeCompare(b, "fr")).map((n) => `<label class="row small">${esc(n)}<input class="field coef" style="max-width:90px" type="number" data-n="${esc(n)}" value="${(cfg.coefs || {})[n] || 1}" min="0.5" max="10" step="0.5"></label>`).join("")}</div>
    <div class="card"><h2>Classes de l'école (${cfg.classes.length})</h2>
      <p class="small muted">Liste indicative : change le nom d'une classe en touchant son nom, choisis le programme suivi, puis enregistre en bas. Les élèves inscrits suivent leur classe renommée.</p>
      ${cfg.classes.map((c, i) => { const n = ctx.eleves.filter((f) => f.cid === c.id).length;
        return `<div class="classe-edit" data-i="${i}"><input class="field cn" value="${esc(c.nom)}" maxlength="24" aria-label="Nom de la classe">
          <select class="field clv" aria-label="Programme suivi">${DATA.levels.map((l) => `<option${l === c.level ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>
          <input class="field cpp" value="${esc(c.pp || "")}" maxlength="40" placeholder="Professeur principal" aria-label="Professeur principal de ${esc(c.nom)}">
          <button class="btn alt small delc" data-i="${i}" aria-label="Supprimer ${esc(c.nom)}">✕</button>${n ? `<span class="small muted span">${n} élève${n > 1 ? "s" : ""}</span>` : ""}</div>`; }).join("")}</div>
    <div class="card"><h2>Ajouter des classes</h2>
      <label class="small">Programme suivi<select class="field" id="clvl">${DATA.levels.map((l) => `<option>${esc(l)}</option>`).join("")}</select></label>
      <label class="small">Noms des classes, séparés par des virgules<input class="field" id="cnoms" value="6e F, 6e G" maxlength="300"></label>
      <button class="btn alt" id="cadd">Ajouter ces classes</button></div>
    <button class="btn" id="csave">Enregistrer les réglages</button><p id="cmsg" class="small"></p>
    <div class="card"><h2>Clés d'entrée</h2><p class="small muted">La clé de la direction et celle des professeurs sont dans le fichier remis à l'école. Donne la clé « PROF » à chaque professeur : il l'entre une fois sur son téléphone.</p></div>
    <button class="btn alt" id="quit">Changer de profil sur ce téléphone</button>`;
}

function vueClassesProf(ctx) {
  const { cfg, eleves } = ctx, mine = S.profClasses || [];
  return `<div class="card"><h2>Mes classes</h2><p class="small muted">Coche les classes où tu enseignes.</p>
      <div class="chips">${cfg.classes.map((c) => `<label class="chip"><input type="checkbox" class="pc" value="${esc(c.id)}"${mine.includes(c.id) ? " checked" : ""}> ${esc(c.nom)}</label>`).join("")}</div></div>
    <a class="btn alt small" href="#ecole/defi">🏁 Défi entre classes</a>
    ${cfg.classes.filter((c) => mine.includes(c.id)).map(({ id, nom: c, pp }) => { const l = eleves.filter((f) => f.cid === id), a = l.filter((f) => reussite(f) !== null);
      return `<div class="card"><div class="row"><h2>${esc(c)}${pp === S.staffNom ? " ⭐" : ""}</h2>${pp ? `<span class="small muted span">Prof. principal : ${esc(pp)}</span>` : ""}<span class="small muted">${l.length} élève${l.length > 1 ? "s" : ""}${a.length ? ` · ${Math.round(a.reduce((n, f) => n + reussite(f), 0) / a.length)} % réussite` : ""}</span></div>
        ${l.map((f) => ligneEleve(ctx, f)).join("") || `<p class="small muted">Aucun élève inscrit pour l'instant.</p>`}
        ${l.length ? `<a class="btn alt small" href="#ecole/parents/${encodeURIComponent(id)}">✉️ Écrire aux parents de la classe</a> <a class="btn alt small" href="#ecole/messages/${encodeURIComponent(id)}">💬 Discussion de la classe</a> <a class="btn alt small" href="#ecole/analyse/${encodeURIComponent(id)}">📊 Analyse par matière</a>` : ""}</div>`; }).join("")}
    <button class="btn alt" id="quit">Changer de profil sur ce téléphone</button>`;
}

// La direction peut ouvrir l'appli comme chaque profil, sans clé, pour tout voir
const VOIR = [["directeur", "Direction"], ["prof", "Professeur"], ["surveillant", "Surveillant"], ["personnel", "Personnel"], ["parent", "Parent"], ["eleve", "Élève"]];
const voirComme = () => (S.role === "directeur" || S.dirReel ? `<div class="row noprint voir"><span class="small">👁️ Voir l'appli comme</span><select class="field" id="voirc">${VOIR.map(([k, n]) => `<option value="${k}"${k === S.role ? " selected" : ""}>${n}</option>`).join("")}</select></div>` : "");
async function changerVue(r) {
  if (r === "directeur") { S.role = "directeur"; delete S.dirReel; if (S.fiche && S.fiche.apercu) delete S.fiche; store.save(); return go("ecole"); }
  S.dirReel = true; S.role = r;
  const cfg = await Ecole.config(), c = cfg.classes[0] || { id: "", nom: "", level: "6e" };
  if (r === "prof" && !(S.profClasses || []).length) S.profClasses = cfg.classes.map((x) => x.id);
  if (r === "eleve") { if (!S.fiche) S.fiche = { apercu: true, prenom: "Élève", nom: "Aperçu", classe: c.nom, classeId: c.id, level: c.level }; S.level = S.level || c.level; }
  store.save(); go(r === "eleve" ? "accueil" : "ecole");
}
const lierVoir = () => { const v = document.getElementById("voirc"); if (v) v.onchange = () => changerVue(v.value); };
const quitter = () => { const q = document.getElementById("quit"); if (q) q.onclick = () => { delete S.role; delete S.staffNom; store.save(); go("accueil"); }; };
const bindEcole = {
  "": () => {
    quitter();
    $view.querySelectorAll(".pc").forEach((b) => b.onchange = async () => {
      S.profClasses = [...$view.querySelectorAll(".pc:checked")].map((x) => x.value); store.save();
      await Ecole.setClasses(S.profClasses).catch(() => {}); viewEcole();
    });
  },
  eleves: (ctx, classe) => {
    const cl = document.getElementById("cl"), q = document.getElementById("cherche"), ex = document.getElementById("export");
    if (ex) ex.onclick = () => exporterEleves(ctx, classe);
    cl.onchange = () => go("ecole/eleves" + (cl.value ? "/" + encodeURIComponent(cl.value) : ""));
    q.oninput = () => {
      const t = q.value.trim().toLowerCase(); let n = 0;
      $view.querySelectorAll("#liste [data-q]").forEach((d) => { d.hidden = !d.dataset.q.includes(t); n += !d.hidden; });
      document.getElementById("nb").textContent = `${n} élève${n > 1 ? "s" : ""}`;
    };
  },
  eleve: (ctx, id) => {
    $view.querySelectorAll(".payer").forEach((b) => b.onclick = async () => {
      const m = b.dataset.m, deja = (ctx.pay[id] || {})[m], f = ctx.eleves.find((x) => x.id === id);
      if (deja && !confirm(`Annuler le paiement de ${moisNom(m)} ? Le reçu ${deja.recu || ""} ne sera plus valable.`)) return;
      b.disabled = true; await Ecole.payer(id, m, !deja, montantDu(ctx.cfg, f, m)).catch(() => {});
      if (!deja) return go(`ecole/recu/${encodeURIComponent(id)}/${m}`);
      viewEcole();
    });
  },
  devoirs: (ctx) => {
    const cl = document.getElementById("dcl");
    if (cl) cl.onchange = () => { const c = classeById(ctx.cfg, cl.value); document.getElementById("dmat").innerHTML = matieresDe(c && c.level); };
    const add = document.getElementById("dadd");
    if (add) add.onclick = async () => {
      const sid = document.getElementById("dsid").value, date = document.getElementById("ddt").value;
      if (!date) return;
      add.disabled = true;
      await Ecole.addDevoir({ cid: cl.value, classe: classeById(ctx.cfg, cl.value).nom, type: document.getElementById("dty").value, date, note: document.getElementById("dnote").value.trim(), ...(sid ? { sid } : { nom: "Vie scolaire" }) }).catch(() => {});
      viewEcole();
    };
    $view.querySelectorAll(".rm").forEach((b) => b.onclick = async () => { await Ecole.delDevoir(b.dataset.id).catch(() => {}); viewEcole(); });
  },
  reglages: (ctx) => {
    quitter();
    const cfg = { ...ctx.cfg, classes: ctx.cfg.classes.slice(), mensualites: { ...ctx.cfg.mensualites } };
    $view.querySelectorAll(".delc").forEach((b) => b.onclick = () => { b.closest(".classe-edit").remove(); cfg.classes[+b.dataset.i] = null; });
    const lvl = document.getElementById("clvl"), noms = document.getElementById("cnoms");
    lvl.onchange = () => { const n = lvl.value; noms.value = "ABC".split("").map((l) => `${n} ${l}`).join(", "); };
    // les changements en cours (noms, programmes, montants) sont gardés aussi quand on ajoute des classes
    const v = (id) => document.getElementById(id).value;
    const lire = () => {
      $view.querySelectorAll(".classe-edit").forEach((d) => { const c = cfg.classes[+d.dataset.i]; if (c) cfg.classes[+d.dataset.i] = { ...c, nom: d.querySelector(".cn").value.trim() || c.nom, level: d.querySelector(".clv").value, pp: d.querySelector(".cpp").value.trim() }; });
      $view.querySelectorAll(".mens").forEach((i) => { cfg.mensualites[i.dataset.n] = +i.value || 0; });
      cfg.coefs = { ...(cfg.coefs || {}) }; $view.querySelectorAll(".coef").forEach((i) => { cfg.coefs[i.dataset.n] = +i.value || 1; });
      return { ...cfg, classes: cfg.classes.filter(Boolean), annee: v("annee").trim() || cfg.annee, debut: v("debut") || cfg.debut, fin: v("fin") || cfg.fin, inscription: +v("insc") || 0, wave: v("wave").trim() };
    };
    document.getElementById("cadd").onclick = async () => {
      const cur = lire(), existe = new Set(cur.classes.map((c) => c.nom.toLowerCase()));
      const neuves = [...new Set(noms.value.split(",").map((x) => x.trim()).filter((x) => x && !existe.has(x.toLowerCase())))]
        .map((nom, i) => ({ id: slugClasse(nom) + "-" + (Date.now() + i).toString(36), nom: nom.slice(0, 24), level: lvl.value }));
      if (!neuves.length) return;
      const rang = (c) => DATA.classes.indexOf(niveauOf(c.level));
      const classes = [...cur.classes, ...neuves].sort((x, y) => rang(x) - rang(y) || x.nom.localeCompare(y.nom, "fr", { numeric: true }));
      await Ecole.setConfig({ ...cur, classes }); viewEcole();
    };
    document.getElementById("csave").onclick = async () => {
      await Ecole.setConfig(lire())
        .then(() => { const m = document.getElementById("cmsg"); m.className = "msg-ok small"; m.textContent = "Réglages enregistrés."; })
        .catch(() => { const m = document.getElementById("cmsg"); m.className = "msg-ko small"; m.textContent = "L'enregistrement n'a pas abouti."; });
    };
  },
};
