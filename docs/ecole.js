"use strict";
// Espace école de Racine School : profils (élève, parent, professeur, surveillant, personnel, direction), fiche d'inscription de l'élève,
// tableau de bord de la direction (effectifs, classes, progrès, paiements), devoirs publiés par les professeurs.
// La vie scolaire (annonces, appel, portail, carte d'élève, documents, espace parent) est dans vie-scolaire.js.
// Avec le Firebase de l'école, tout est partagé en ligne (Firestore) ; sans lui, tout reste sur ce téléphone,
// ce qui permet aussi de présenter l'appli avec des élèves de démonstration.

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
  // pendant une démonstration, la direction voit des élèves fictifs gardés sur ce téléphone, jamais envoyés en ligne
  const shared = () => online() && !L.demo;
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
    if (S.role !== "eleve" || !S.fiche || (!force && Date.now() - (S.statsSync || 0) < 18e5)) return;
    const st = Object.values(S.stats), rep = st.reduce((n, s) => n + s.ok + s.ko, 0), ok = st.reduce((n, s) => n + s.ok, 0);
    const semaine = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); });
    const notes = S.sessions.slice(-10).map((x) => (20 * x.score) / x.total);
    const stats = { rep, ok, derniere: S.days.slice(-1)[0] || null, jours7: semaine.filter((d) => S.days.includes(d)).length,
      moy: notes.length ? Math.round((10 * notes.reduce((a, b) => a + b, 0)) / notes.length) / 10 : null };
    S.statsSync = Date.now(); store.save();
    saveFiche({ ...S.fiche, stats }).catch(() => {});
  }
  // Démonstration : des élèves fictifs (noms courants, numéros neutralisés) pour présenter le tableau de bord
  async function demo(on) {
    const sansDemo = () => Object.fromEntries(Object.entries(L.col || {}).map(([k, c]) => [k, Object.fromEntries(Object.entries(c).filter(([, x]) => !x.demo))]));
    if (!on) { L.eleves = Object.fromEntries(Object.entries(L.eleves || {}).filter(([, f]) => !f.demo)); L.paiements = {}; L.devoirs = (L.devoirs || []).filter((d) => !d.demo); L.col = sansDemo(); L.demo = false; keep(); return; }
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const F = "Aïssatou Fatou Awa Mariama Khady Ndeye Aminata Coumba Astou Bineta Rokhaya Seynabou Dieynaba Adama Maïmouna Sokhna Yacine".split(" ");
    const G = "Moussa Mamadou Ibrahima Cheikh Abdoulaye Ousmane Modou Serigne Pape Babacar Alioune Lamine Omar Saliou Assane Malick".split(" ");
    const N = "Diop Ndiaye Fall Sow Ba Diallo Gueye Faye Sarr Mbaye Cissé Thiam Seck Kane Diouf Niang Sy Camara Ndour Wade Mbengue Touré".split(" ");
    const cfg = await config(), eleves = {}, pay = {};
    let k = 0;
    for (const c of cfg.classes) {
      const n = 8 + Math.floor(rnd() * 9);
      for (let i = 0; i < n; i++) {
        const fille = rnd() < 0.52, id = "demo-" + ++k, nom = pick(N), age = 11 + ["6e", "5e", "4e", "3e", "2nde", "1ère", "Tle"].indexOf(niveauOf(c.level));
        const rep = Math.floor(rnd() ** 1.5 * 650), jours = Math.floor(rnd() ** 2.2 * 21);
        const d = new Date(); d.setDate(d.getDate() - jours);
        eleves[id] = { id, demo: true, codeParent: "DEMO" + String(k).padStart(4, "0"), prenom: pick(fille ? F : G), nom, sexe: fille ? "F" : "G", classe: c.nom, classeId: c.id, level: c.level,
          naissance: `${2026 - age}-${String(1 + Math.floor(rnd() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rnd() * 28)).padStart(2, "0")}`,
          tel: "77 000 " + String(k).padStart(4, "0").replace(/(\d\d)(\d\d)/, "$1 $2"), whatsapp: "", parent: `${pick(["M.", "Mme"])} ${nom}`, telParent: "78 000 " + String(k).padStart(4, "0").replace(/(\d\d)(\d\d)/, "$1 $2"),
          inscritLe: `2026-${rnd() < 0.7 ? "09" : "10"}-${String(1 + Math.floor(rnd() * 28)).padStart(2, "0")}`,
          stats: { rep, ok: Math.round(rep * (0.42 + rnd() * 0.48)), derniere: rep ? d.toISOString().slice(0, 10) : null, jours7: rep ? Math.max(0, 6 - Math.floor(jours / 2) - Math.floor(rnd() * 3)) : 0, moy: rep ? Math.round((7 + rnd() * 11) * 10) / 10 : null } };
        pay[id] = Object.fromEntries(moisEchus(cfg).filter((m) => rnd() < (m === "inscription" ? 0.95 : 0.83)).map((m) => [m, { le: "2026-10-0" + (1 + Math.floor(rnd() * 8)) }]));
      }
    }
    const t = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
    const dv = [["3e A", "Devoir surveillé", "Mathématiques", "Théorème de Thalès et trigonométrie", 3], ["Tle S2 A", "Composition", "Sciences physiques", "Mécanique : lois de Newton", 6],
      ["6e A", "Exercice à rendre", "Français", "Rédaction : raconter une journée au marché", 2], ["4e B", "Leçon à apprendre", "Histoire-Géographie", "La traite atlantique", 1]];
    L.devoirs = [...(L.devoirs || []).filter((d) => !d.demo), ...dv.map(([classe, type, nom, note, j], i) => ({ id: "demo-d" + i, demo: true, classe, cid: (cfg.classes.find((c) => c.nom === classe) || {}).id || classe, type, nom, note, date: t(j), par: "demo", parNom: "Équipe pédagogique", le: today() }))];
    L.eleves = { ...Object.fromEntries(Object.entries(L.eleves || {}).filter(([, f]) => !f.demo)), ...eleves };
    // vie scolaire du jour : équipe, annonces, appels, retards au portail, cours vus, encaissements
    const ids = Object.keys(eleves), parCl = (cid) => ids.filter((i) => eleves[i].classeId === cid);
    const col = sansDemo(), mettre = (c, id, x) => { col[c] = { ...(col[c] || {}), [id]: { ...x, id, demo: true } }; };
    [["M. Babacar Sy", "directeur", "Directeur des études"], ["Mme Aminata Diallo", "prof", "Mathématiques"], ["M. Ousmane Sarr", "prof", "Français"], ["Mme Khady Fall", "prof", "Sciences physiques"],
      ["M. Modou Ndiaye", "surveillant", "Surveillant général"], ["Mme Awa Gueye", "personnel", "Secrétariat"], ["M. Lamine Kane", "personnel", "Caisse et comptabilité"]]
      .forEach(([nom, role, poste], i) => mettre("annuaire", "demo-s" + i, { nom, role, poste, tel: "77 000 90 " + String(10 + i) }));
    [["Réunion des parents d'élèves", "Rencontre avec les professeurs principaux, de 16 h à 18 h dans la cour.", "parents", 8],
      ["Compositions du premier trimestre", "Toutes les classes. Le calendrier par matière est affiché au tableau de chaque classe.", "tous", 24],
      ["Journée de l'excellence", "Remise des prix aux meilleurs élèves de l'an dernier. Tenue correcte exigée.", "tous", 13],
      ["Conseil des professeurs", "Point sur les progressions et préparation des compositions.", "profs", 5],
      ["Rappel : port de la tenue scolaire", "La tenue est obligatoire tous les jours, y compris le samedi.", "eleves", null]]
      .forEach(([titre, texte, cible, j], i) => mettre("annonces", "demo-a" + i, { titre, texte, cible, date: j === null ? "" : t(j), par: "demo", parNom: "La direction", le: t(-i) }));
    const heure = (h, m) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const seance = [["Mathématiques", "Théorème de Pythagore"], ["Français", "Le récit : schéma narratif"], ["Sciences physiques", "Les circuits électriques"], ["Histoire-Géographie", "Les grands ensembles du Sénégal"]];
    cfg.classes.filter((_, i) => i % 3 === 0).forEach((c, i) => {
      const l = parCl(c.id), abs = l.filter(() => rnd() < 0.09), ret = l.filter((x) => !abs.includes(x) && rnd() < 0.05);
      mettre("appels", `demo-${today()}-${c.id}`, { cid: c.id, classe: c.nom, date: today(), heure: heure(8, 5 + (i % 4) * 5), absents: abs, retards: ret, par: "demo", parNom: ["Mme Aminata Diallo", "M. Ousmane Sarr", "Mme Khady Fall"][i % 3] });
      const [mat, titre] = seance[i % seance.length], s = subjectsOf(c.level).find((x) => x.name.startsWith(mat.split(" ")[0]));
      mettre("seances", `demo-se${i}`, { cid: c.id, classe: c.nom, date: today(), sid: s ? s.id : "", matiere: s ? s.name : mat, titre, par: "demo", parNom: "Équipe pédagogique" });
    });
    const retardsPortail = {}; ids.filter(() => rnd() < 0.015).slice(0, 8).forEach((id, i) => { retardsPortail[id] = ["07:52", "07:55", "07:58", "08:01", "08:04", "08:07", "08:10", "08:16"][i]; });
    mettre("portail", today(), { date: today(), retards: retardsPortail });
    ids.filter(() => rnd() < 0.03).slice(0, 9).forEach((id) => {
      const m = moisEchus(cfg).filter((x) => !pay[id][x]).pop() || ceMois();
      pay[id][m] = { le: today(), recu: numeroRecu(), montant: montantDu(cfg, eleves[id], m), par: "M. Lamine Kane" };
    });
    // notes du premier trimestre : un devoir et une composition dans trois matières par classe
    cfg.classes.forEach((c, ci) => {
      const l = parCl(c.id);
      subjectsOf(c.level).filter((x) => !/annales/.test(x.id)).slice(0, 4).forEach((m, mi) => [["Devoir 1", "Devoir surveillé", 1, -40], ["Composition", "Composition", 2, -18]].forEach(([titre, type, coef, j], ti) => {
        const notes = Object.fromEntries(l.map((id) => { const st = eleves[id].stats, base = st.rep ? (20 * st.ok) / st.rep : 10;
          return [id, Math.max(0, Math.min(20, Math.round((base - 3 + rnd() * 6) * 4) / 4))]; }));
        mettre("notes", `demo-n${ci}-${mi}-${ti}`, { cid: c.id, classe: c.nom, sid: m.id, matiere: m.name, titre, type, trimestre: "1", coef, sur: 20, date: t(j), notes, par: "demo", parNom: "Équipe pédagogique" });
      }));
    });
    // emplois du temps : matinées du lundi au samedi, trois après-midi ; un professeur par matière
    const profDe = (nom) => /math/i.test(nom) ? "Mme Aminata Diallo" : /fran/i.test(nom) ? "M. Ousmane Sarr" : /physi|svt|vie/i.test(nom) ? "Mme Khady Fall" : `M. ${pick(N)} (${nom.split(" ")[0]})`;
    const plages = [[0, "08:00", "10:00"], [0, "10:15", "12:00"], [0, "15:00", "17:00"], [1, "08:00", "10:00"], [1, "10:15", "12:00"], [2, "08:00", "10:00"], [2, "10:15", "12:00"], [3, "08:00", "10:00"], [3, "10:15", "12:00"], [3, "15:00", "17:00"], [4, "08:00", "10:00"], [4, "10:15", "12:00"], [5, "08:00", "10:00"], [5, "10:15", "12:00"]];
    cfg.classes.forEach((c, ci) => {
      const mats = subjectsOf(c.level).filter((x) => !/annales/.test(x.id));
      // l'équipe fictive enseigne dans les trois premières classes ; ailleurs, d'autres professeurs
      const profs = Object.fromEntries(mats.map((m) => [m.id, ci < 3 ? profDe(m.name) : `${pick(["M.", "Mme"])} ${pick(N)} (${m.name.split(/[ -]/)[0]})`]));
      mettre("edt", c.id, { cid: c.id, classe: c.nom, creneaux: plages.map(([jour, debut, fin], k) => { const m = mats[(k + ci) % mats.length]; return { jour, debut, fin, sid: m.id, matiere: m.name, prof: profs[m.id], salle: "Salle " + (ci + 1) }; }) });
      mats.forEach((m) => { const n = programmeDe(m.id).length; if (n) mettre("progressions", `${c.id}_${m.id}`, { cid: c.id, sid: m.id, faits: [...Array(Math.floor(n * (0.05 + rnd() * 0.3))).keys()], par: "demo", parNom: profs[m.id], le: t(-Math.floor(rnd() * 10)) }); });
    });
    // registres : quelques lignes dans chacun
    const el = (i) => eleves[ids[i % ids.length]], ref = (i) => ({ eleveId: el(i).id, eleveNom: `${el(i).prenom} ${el(i).nom}`, classe: el(i).classe });
    const R = (id, x) => mettre("registres", "demo-r" + id, { par: "demo", parNom: "M. Modou Ndiaye", le: today(), ...x });
    R(1, { reg: "discipline", ...ref(11), date: t(-2), type: "Bavardage", texte: "Bavardages répétés en cours de français.", sanction: "Mot aux parents" });
    R(2, { reg: "discipline", ...ref(11), date: t(-1), type: "Insolence", texte: "A répondu au professeur.", sanction: "Retenue" });
    R(3, { reg: "discipline", ...ref(40), date: today(), type: "Tenue non conforme", texte: "", sanction: "Avertissement oral" });
    R(4, { reg: "maincourante", date: today(), heure: "10:20", categorie: "Infirmerie", ...ref(23), texte: "Maux de tête, a pris du repos 30 minutes." });
    R(5, { reg: "maincourante", date: t(-1), heure: "12:05", categorie: "Objet trouvé", eleveNom: "", texte: "Calculatrice Casio trouvée dans la cour." });
    R(6, { reg: "planning", date: today(), debut: "07:30", fin: "08:15", lieu: "Portail", personne: "M. Modou Ndiaye" });
    R(7, { reg: "planning", date: today(), debut: "10:00", fin: "10:15", lieu: "Cour", personne: "M. Modou Ndiaye" });
    [["Ramettes de papier et craies", "Fournitures", 85000, "Librairie Clairafrique"], ["Facture Senelec", "Électricité et eau", 142000, "Senelec"], ["Réparation de tables-bancs", "Entretien et réparations", 60000, "Menuiserie Ndiaye"]]
      .forEach(([libelle, categorie, montant, fournisseur], i) => R(10 + i, { reg: "depenses", date: t(-3 * i - 1), libelle, categorie, montant, fournisseur, parNom: "M. Lamine Kane" }));
    [["Mme Awa Gueye", 150000, 20000], ["M. Lamine Kane", 175000, 0], ["M. Modou Ndiaye", 140000, 30000]].forEach(([personne, brut, avance], i) => R(20 + i, { reg: "paie", mois: ceMois(), personne, brut, avance, net: brut - avance, paye: "" }));
    [["Tables-bancs", "Mobilier", 420, "Bon", "Toutes les salles"], ["Ordinateurs", "Informatique", 12, "À réparer", "Salle informatique"], ["Vidéoprojecteur", "Informatique", 2, "Bon", "Bureau de la direction"], ["Manuels de maths 3e", "Manuels", 60, "Bon", "Bibliothèque"]]
      .forEach(([article, categorie, quantite, etat, lieu], i) => R(30 + i, { reg: "inventaire", article, categorie, quantite, etat, lieu }));
    R(40, { reg: "services", ...ref(5), service: "Cantine", formule: "Déjeuner du lundi au vendredi", montant: 10000, paye: ceMois() });
    R(41, { reg: "services", ...ref(17), service: "Transport scolaire", formule: "Ligne Parcelles – école", montant: 15000, paye: "" });
    R(50, { reg: "courrier", date: t(-4), sens: "Entrant", tiers: "Inspection d'académie", objet: "Calendrier des examens blancs", ref: "IA/2026/114" });
    R(51, { reg: "bibliotheque", livre: "Une si longue lettre (Mariama Bâ)", ...ref(30), date: t(-20), retour: t(-6), rendu: "Prêté" });
    R(52, { reg: "bibliotheque", livre: "L'Aventure ambiguë (Cheikh Hamidou Kane)", ...ref(31), date: t(-5), retour: t(9), rendu: "Prêté" });
    R(60, { reg: "taches", titre: "Réparer la porte de la salle 4", personne: "M. Lamine Kane", echeance: t(2), statut: "À faire", parNom: "M. Babacar Sy" });
    R(61, { reg: "taches", titre: "Imprimer les sujets de composition", personne: "Mme Awa Gueye", echeance: t(20), statut: "En cours", parNom: "M. Babacar Sy" });
    R(70, { reg: "heures", date: t(-1), classe: "6e A", heures: 2, objet: "Cours de soutien", par: "demo", parNom: "Mme Aminata Diallo" });
    [["Mme Awa Gueye", "07:42", ""], ["M. Lamine Kane", "07:55", ""], ["M. Modou Ndiaye", "07:20", ""], ["Mme Aminata Diallo", "07:50", ""]].forEach(([nom, arrivee], i) => R(80 + i, { reg: "pointage", date: today(), nom, arrivee }));
    mettre("preinscriptions", "demo-p1", { prenom: "Khadija", nom: "Sarr", naissance: "2015-05-12", ecole: "École Liberté 6", parent: "Mme Sarr", tel: "77 000 88 01", classe: "6e", statut: "Nouvelle", le: t(-1) });
    mettre("preinscriptions", "demo-p2", { prenom: "Babacar", nom: "Ndour", naissance: "2011-11-02", ecole: "CEM de Grand-Yoff", parent: "M. Ndour", tel: "77 000 88 02", classe: "2nde", statut: "Liste d'attente", le: t(-6) });
    // retards de la semaine au portail, pour les seuils
    [1, 2, 3].forEach((k) => mettre("portail", t(-k), { date: t(-k), retards: { [ids[11]]: "08:0" + k, [ids[23]]: "07:5" + k } }));
    // demandes en attente : justificatif, autorisation, rendez-vous, question, congé, dépense
    const D = (id, x) => mettre("demandes", "demo-d" + id, { statut: "attente", reponse: "", le: t(-1), par: "demo", ...x });
    D(1, { type: "justificatif", role: "parent", ...ref(11), cid: el(11).classeId, parNom: el(11).parent, date: today(), texte: "Fièvre depuis hier soir, il reste à la maison aujourd'hui." });
    D(2, { type: "autorisation", role: "parent", ...ref(23), cid: el(23).classeId, parNom: el(23).parent, objet: "Sortie anticipée", date: today(), texte: "Rendez-vous chez le dentiste à 15 h.", signe: true });
    D(3, { type: "rdv", role: "parent", ...ref(5), cid: el(5).classeId, parNom: el(5).parent, avec: "La direction", date: t(4), texte: "Parler de l'orientation en seconde." });
    D(4, { type: "question", role: "eleve", eleveId: el(1).id, parNom: `${el(1).prenom} ${el(1).nom}`, classe: el(1).classe, cid: el(1).classeId, matiere: "Mathématiques", texte: "Je n'ai pas compris comment simplifier une fraction quand le numérateur est plus grand." });
    D(5, { type: "conge", role: "prof", parNom: "Mme Khady Fall", du: t(3), au: t(3), texte: "Formation à l'inspection d'académie." });
    D(6, { type: "depense", role: "personnel", parNom: "M. Lamine Kane", libelle: "Cartouches d'encre", montant: 45000, texte: "Pour imprimer les sujets des compositions." });
    D(7, { type: "signalement", role: "eleve", anonyme: true, parNom: "", classe: "4e B", texte: "Des grands de 3e prennent le goûter des petits à la récréation." });
    mettre("absprofs", "demo-ab0", { profNom: "M. Ousmane Sarr", date: today(), motif: "Raison de santé", remplacant: "", classes: "6e A, 5e C", par: "demo" });
    mettre("absprofs", "demo-ab1", { profNom: "Mme Khady Fall", date: t(3), motif: "Formation à l'inspection", remplacant: "Mme Aminata Diallo", classes: "4e B, 3e A", par: "demo" });
    D(8, { type: "paiement", role: "parent", ...ref(17), cid: el(17).classeId, parNom: el(17).parent, mois: ceMois(), montant: montantDu(cfg, el(17), ceMois()), ref: "WAV-" + (481516 + 2342), texte: "" });
    // communication : sondage, discussions, documents, historique
    mettre("sondages", "demo-s0", { question: "Êtes-vous satisfaits de la communication de l'école ce trimestre ?", options: ["Très satisfait", "Satisfait", "Peu satisfait", "Pas satisfait"], cible: "parents", clos: false, par: "demo", le: t(-3) });
    mettre("sondages", "demo-s1", { question: "Quel jour pour la journée culturelle ?", options: ["Vendredi 12", "Samedi 13", "Vendredi 19"], cible: "tous", clos: false, par: "demo", le: t(-1) });
    ids.slice(0, 64).forEach((id, i) => mettre("votes", `demo-s${i % 3 ? 0 : 1}_${id}`, { sondage: `demo-s${i % 3 ? 0 : 1}`, choix: i % 3 ? pick(["Très satisfait", "Satisfait", "Satisfait", "Peu satisfait", "Pas satisfait"]) : pick(["Vendredi 12", "Samedi 13", "Vendredi 19"]), par: id, le: t(-1) }));
    const c0 = cfg.classes[0], at = (j, h) => `${t(j)}T${h}:00`;
    [["equipe", "Mme Aminata Diallo", "Bonjour à tous, la réunion pédagogique est maintenue jeudi à 16 h en salle des professeurs.", at(-2, "08:12")],
      ["equipe", "M. Lamine Kane", "Les cartouches d'encre sont arrivées, passez au secrétariat pour vos tirages.", at(-1, "10:40")],
      ["profs", "M. Ousmane Sarr", "Qui a encore le corrigé du devoir commun de 3e ? Je n'arrive pas à le retrouver.", at(-1, "17:05")],
      ["profs", "Mme Khady Fall", "Je l'ai, je le mets dans Documents ce soir.", at(-1, "17:20")],
      [c0.id, "Mme Aminata Diallo", `Bonjour la ${c0.nom}, n'oubliez pas vos compas demain pour la géométrie.`, at(-1, "18:00")],
      [c0.id, `${el(0).prenom} ${el(0).nom}`, "D'accord madame, merci !", at(-1, "18:30")]].forEach(([canal, nom, texte, at2], i) => mettre("messages", "demo-m" + i, { canal, nom, texte, at: at2, par: "demo", role: "prof" }));
    [["Règlement intérieur 2026-2027", "Règlement et circulaires", "tous", "https://drive.google.com"], ["Liste des fournitures de 6e", "Liste de fournitures", "parents", "https://drive.google.com"],
      ["Cours : les fractions", "Support de cours", c0.id, "https://www.youtube.com"], ["Corrigé du devoir commun de 3e", "Ressource pour les professeurs", "profs", "https://drive.google.com"]]
      .forEach(([titre, categorie, cible, lien], i) => mettre("documents", "demo-doc" + i, { titre, categorie, cible, lien, fichier: "", par: "demo", parNom: ["La direction", "La direction", "Mme Aminata Diallo", "Mme Khady Fall"][i], le: t(-i - 1) }));
    [["Paiement enregistré : " + moisNom(ceMois()) + `, élève ${el(3).prenom} ${el(3).nom}`, "M. Lamine Kane", at(0, "09:14")], ["Notes saisies : Mathématiques " + c0.nom + " Devoir 1", "Mme Aminata Diallo", at(-1, "19:02")],
      ["Paiement annulé : " + moisNom(ceMois()) + `, élève ${el(9).prenom} ${el(9).nom}`, "M. Lamine Kane", at(-2, "11:30")], ["Réglages de l'école modifiés", "Direction", at(-4, "08:00")]]
      .forEach(([quoi, qui, at2], i) => mettre("journal", "demo-j" + i, { quoi, qui, at: at2, par: "demo" }));
    Object.keys(col.annonces || {}).forEach((a, j) => ids.slice(0, 20 + j * 9).forEach((id, i) => mettre("lectures", `${a}_${id}`, { annonce: a, par: id, le: t(-1), present: i % 3 === 0 })));
    L.col = col;
    L.paiements = pay; L.demo = true; keep();
  }
  return { config, setConfig, saveFiche, maFiche, eleves, paiements, payer, devoirs, addDevoir, delDevoir, claimRole, retirerAcces, monRole, setClasses, syncStats, demo,
    liste, lire, ecrire, effacer, lierEnfant, mesEnfants, enfant, myId, sauverEvaluation, supprimerEvaluation, releve,
    get online() { return online(); }, get isDemo() { return !!L.demo; }, reset() { cfgCache = null; } };
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
const SOUS_PAGES = { directeur: ["eleve", "recu", "certificat", "notes", "bulletin", "registre", "convocation", "journal", "rapport", "cloture", "parents"], prof: ["eleve", "eleves", "bulletins", "bulletin", "registre", "parents"], surveillant: ["eleve", "registre", "convocation"], personnel: ["eleve", "recu", "certificat", "paiements", "registre", "cloture"], parent: ["recu", "bulletin"] };
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
    const actif = { eleve: "eleves", recu: role === "parent" ? "" : "paiements", certificat: "eleves", registre: "registres", convocation: "", bulletin: { parent: "", prof: "notes" }[role] ?? "bulletins", bulletins: role === "prof" ? "notes" : "bulletins", notes: role === "prof" ? "notes" : "bulletins", journal: "registres", rapport: "", cloture: "", parents: "" }[sub] ?? sub;
    const head = `<div class="row noprint"><h1>${titre}</h1><span class="small muted">${role === "parent" ? "" : esc(S.staffNom || "")}</span></div>
      ${Ecole.isDemo ? `<p class="demo small noprint">Démonstration : élèves et équipe fictifs. ${role === "directeur" ? `<button class="linkbtn" id="demo-off">Effacer la démo</button>` : ""}</p>` : ""}${ongletsEcole(actif)}`;
    const views = {
      "": { directeur: vueEnsemble, prof: vueProfAccueil, surveillant: vueAujourdhuiComplet, personnel: vueCaisse, parent: vueParent }[role],
      eleves: vueEleves, eleve: vueFicheComplete, paiements: vuePaiementsComplet, registres: vueRegistres, registre: vueRegistre, demandes: vueDemandes, convocation: vueConvocation, devoirs: vueDevoirs, reglages: vueReglages,
      annonces: vueAnnonces, equipe: vueEquipeComplete, edt: vueEdt, programme: vueProgramme, appel: vueAppel, quiz: vueQuiz, portail: vuePortail, recu: vueRecu, certificat: vueCertificat,
      notes: vueNotes, bulletins: vueBulletins, bulletin: vueBulletin,
      messages: vueMessages, documents: vueDocuments, journal: vueJournal, rapport: vueRapport, cloture: vueCloture, parents: vueParentsClasse,
    };
    $view.innerHTML = head + (await views[sub](ctx, arg, arg2));
    const off = document.getElementById("demo-off");
    if (off) off.onclick = async () => { await Ecole.demo(false); viewEcole(); };
    const on = document.getElementById("demo-on");
    if (on) on.onclick = async () => { on.disabled = true; await Ecole.demo(true); viewEcole(); };
    quitter();
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
    <p class="muted">Les élèves apparaissent ici dès qu'ils remplissent leur fiche d'inscription dans l'appli.</p>
    <button class="btn" id="demo-on">Voir une démonstration avec des élèves fictifs</button></div>`;
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
    ${cfg.classes.filter((c) => mine.includes(c.id)).map(({ id, nom: c }) => { const l = eleves.filter((f) => f.cid === id), a = l.filter((f) => reussite(f) !== null);
      return `<div class="card"><div class="row"><h2>${esc(c)}</h2><span class="small muted">${l.length} élève${l.length > 1 ? "s" : ""}${a.length ? ` · ${Math.round(a.reduce((n, f) => n + reussite(f), 0) / a.length)} % réussite` : ""}</span></div>
        ${l.map((f) => ligneEleve(ctx, f)).join("") || `<p class="small muted">Aucun élève inscrit pour l'instant.</p>`}
        ${l.length ? `<a class="btn alt small" href="#ecole/parents/${encodeURIComponent(id)}">✉️ Écrire aux parents de la classe</a> <a class="btn alt small" href="#ecole/messages/${encodeURIComponent(id)}">💬 Discussion de la classe</a>` : ""}</div>`; }).join("")}
    ${!ctx.eleves.length ? `<button class="btn alt" id="demo-on">Voir une démonstration avec des élèves fictifs</button>` : ""}
    <button class="btn alt" id="quit">Changer de profil sur ce téléphone</button>`;
}

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
      $view.querySelectorAll(".classe-edit").forEach((d) => { const c = cfg.classes[+d.dataset.i]; if (c) cfg.classes[+d.dataset.i] = { ...c, nom: d.querySelector(".cn").value.trim() || c.nom, level: d.querySelector(".clv").value }; });
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
