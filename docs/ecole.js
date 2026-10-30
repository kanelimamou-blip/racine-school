"use strict";
// Espace école de Racine School : profils (élève, professeur, direction), fiche d'inscription de l'élève,
// tableau de bord de la direction (effectifs, classes, progrès, paiements), devoirs publiés par les professeurs.
// Avec le Firebase de l'école, tout est partagé en ligne (Firestore) ; sans lui, tout reste sur ce téléphone,
// ce qui permet aussi de présenter l'appli avec des élèves de démonstration.

const ROLES = { eleve: "Élève", prof: "Professeur", directeur: "Direction" };
const isStaff = () => S.role === "prof" || S.role === "directeur";
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const moisNom = (m) => (m === "inscription" ? "Inscription" : MOIS[+m.slice(5) - 1] + " " + m.slice(0, 4));
const ceMois = () => today().slice(0, 7);
const niveauOf = (level) => String(level).split(" ")[0];
const initiales = (f) => ((f.prenom || "?")[0] + (f.nom || "")[0] || "").toUpperCase();
const nomComplet = (f) => `${f.prenom || ""} ${f.nom || ""}`.trim();
const avatar = (f, cls = "av") => f.photo ? `<img class="${cls}" src="${esc(f.photo)}" alt="">` : `<span class="${cls}">${esc(initiales(f))}</span>`;
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const telLien = (t) => String(t || "").replace(/\D/g, "").replace(/^(?=[67]\d{8}$)/, "221");

const ECOLE_DEFAUT = {
  annee: "2026-2027", debut: "2026-10", fin: "2027-07", inscription: 25000,
  mensualites: { "6e": 15000, "5e": 15000, "4e": 17500, "3e": 20000, "2nde": 22500, "1ère": 25000, "Tle": 27500 },
  classes: [["6e A", "6e"], ["6e B", "6e"], ["5e A", "5e"], ["5e B", "5e"], ["4e A", "4e"], ["4e B", "4e"], ["3e A", "3e"], ["3e B", "3e"],
    ["2nde L", "2nde L"], ["2nde S", "2nde S"], ["1ère L2", "1ère L2"], ["1ère S2", "1ère S2"], ["Tle L2", "Tle L2"], ["Tle S2", "Tle S2"]].map(([nom, level]) => ({ nom, level })),
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
  const myId = () => (online() ? Compte.user.uid : (S.idLocal = S.idLocal || "moi-" + Math.random().toString(36).slice(2, 10)));
  let cfgCache = null;

  async function config() {
    if (cfgCache) return cfgCache;
    let c = L.config;
    if (online()) c = (await db().collection("ecole").doc("config").get().catch(() => null))?.data() || c;
    return (cfgCache = { ...ECOLE_DEFAUT, ...(c || {}) });
  }
  async function setConfig(c) {
    cfgCache = c; L.config = c; keep();
    if (online()) await db().collection("ecole").doc("config").set(c);
  }
  async function saveFiche(f) {
    const id = myId(); f = { ...f, id };
    if (online()) await db().collection("eleves").doc(id).set(f, { merge: true });
    else { L.eleves = { ...(L.eleves || {}), [id]: { ...(L.eleves || {})[id], ...f } }; keep(); }
  }
  async function maFiche() {
    if (online()) return (await db().collection("eleves").doc(myId()).get().catch(() => null))?.data() || null;
    return (L.eleves || {})[myId()] || null;
  }
  async function eleves() {
    if (online()) return (await db().collection("eleves").get()).docs.map((d) => ({ ...d.data(), id: d.id }));
    return Object.values(L.eleves || {});
  }
  async function paiements() {
    if (online()) return Object.fromEntries((await db().collection("paiements").get()).docs.map((d) => [d.id, d.data()]));
    return L.paiements || {};
  }
  async function payer(id, mois, paye) {
    const val = paye ? { le: today() } : null;
    if (online()) await db().collection("paiements").doc(id).set({ [mois]: val || firebase.firestore.FieldValue.delete() }, { merge: true });
    else { const p = { ...(L.paiements || {})[id] }; if (val) p[mois] = val; else delete p[mois]; L.paiements = { ...(L.paiements || {}), [id]: p }; keep(); }
  }
  async function devoirs(classe = null) {
    let list;
    if (online()) {
      const q = classe ? db().collection("devoirs").where("classe", "==", classe) : db().collection("devoirs");
      list = (await q.get()).docs.map((d) => ({ ...d.data(), id: d.id }));
    } else list = (L.devoirs || []).filter((d) => !classe || d.classe === classe);
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }
  async function addDevoir(d) {
    d = { ...d, par: myId(), parNom: S.staffNom || "", le: today() };
    if (online()) await db().collection("devoirs").add(d);
    else { L.devoirs = [...(L.devoirs || []), { ...d, id: "d" + Date.now() }]; keep(); }
  }
  async function delDevoir(id) {
    if (online()) await db().collection("devoirs").doc(id).delete();
    else { L.devoirs = (L.devoirs || []).filter((d) => d.id !== id); keep(); }
  }
  // La clé d'entrée est vérifiée ici, puis par les règles Firestore quand l'école est en ligne
  async function claimRole(role, cle, nom, classes) {
    if (!CFG.cles || CFG.cles[role] !== await sha256(CFG.salt + cle)) throw new Error("clé");
    if (online()) await db().collection("staff").doc(myId()).set({ role, cle, nom, classes });
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
    if (!on) { L.eleves = Object.fromEntries(Object.entries(L.eleves || {}).filter(([, f]) => !f.demo)); L.paiements = {}; L.devoirs = (L.devoirs || []).filter((d) => !d.demo); L.demo = false; keep(); return; }
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
        eleves[id] = { id, demo: true, prenom: pick(fille ? F : G), nom, sexe: fille ? "F" : "G", classe: c.nom, level: c.level,
          naissance: `${2026 - age}-${String(1 + Math.floor(rnd() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rnd() * 28)).padStart(2, "0")}`,
          tel: "77 000 " + String(k).padStart(4, "0").replace(/(\d\d)(\d\d)/, "$1 $2"), whatsapp: "", parent: `${pick(["M.", "Mme"])} ${nom}`, telParent: "78 000 " + String(k).padStart(4, "0").replace(/(\d\d)(\d\d)/, "$1 $2"),
          inscritLe: `2026-${rnd() < 0.7 ? "09" : "10"}-${String(1 + Math.floor(rnd() * 28)).padStart(2, "0")}`,
          stats: { rep, ok: Math.round(rep * (0.42 + rnd() * 0.48)), derniere: rep ? d.toISOString().slice(0, 10) : null, jours7: rep ? Math.max(0, 6 - Math.floor(jours / 2) - Math.floor(rnd() * 3)) : 0, moy: rep ? Math.round((7 + rnd() * 11) * 10) / 10 : null } };
        pay[id] = Object.fromEntries(moisEchus(cfg).filter((m) => rnd() < (m === "inscription" ? 0.95 : 0.83)).map((m) => [m, { le: "2026-10-0" + (1 + Math.floor(rnd() * 8)) }]));
      }
    }
    const t = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
    const dv = [["3e A", "Devoir surveillé", "Mathématiques", "Théorème de Thalès et trigonométrie", 3], ["Tle S2", "Composition", "Sciences physiques", "Mécanique : lois de Newton", 6],
      ["6e A", "Exercice à rendre", "Français", "Rédaction : raconter une journée au marché", 2], ["4e B", "Leçon à apprendre", "Histoire-Géographie", "La traite atlantique", 1]];
    L.devoirs = [...(L.devoirs || []).filter((d) => !d.demo), ...dv.map(([classe, type, nom, note, j], i) => ({ id: "demo-d" + i, demo: true, classe, type, nom, note, date: t(j), par: "demo", parNom: "Équipe pédagogique", le: today() }))];
    L.eleves = { ...Object.fromEntries(Object.entries(L.eleves || {}).filter(([, f]) => !f.demo)), ...eleves };
    L.paiements = pay; L.demo = true; keep();
  }
  return { config, setConfig, saveFiche, maFiche, eleves, paiements, payer, devoirs, addDevoir, delDevoir, claimRole, monRole, setClasses, syncStats, demo,
    get online() { return online(); }, get isDemo() { return !!L.demo && !online(); }, reset() { cfgCache = null; } };
})();

// Au démarrage : profil et fiche retrouvés en ligne (nouveau téléphone), devoirs de la classe ajoutés à l'agenda
async function ecoleStart() {
  if (Ecole.online) {
    const st = await Ecole.monRole();
    if (st && !S.role) Object.assign(S, { role: st.role, staffNom: st.nom, profClasses: st.classes || [] });
    if (!S.role || S.role === "eleve") { const f = await Ecole.maFiche(); if (f && !S.fiche) { S.fiche = f; S.role = "eleve"; S.level = S.level || f.level; } }
    store.save();
  }
  await devoirsDansAgenda();
  Ecole.syncStats();
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") Ecole.syncStats(); });

async function devoirsDansAgenda() {
  if (S.role !== "eleve" || !S.fiche) return;
  const list = await Ecole.devoirs(S.fiche.classe).catch(() => []);
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
      <button class="btn alt role" data-r="prof">👩🏾‍🏫 Professeur<span class="small">Avec la clé d'entrée des professeurs</span></button>
      <button class="btn alt role" data-r="directeur">🏫 Direction<span class="small">Avec la clé d'entrée de la direction</span></button>
    </div>${err ? `<p class="msg-ko small">${esc(err)}</p>` : ""}`;
  $view.querySelectorAll(".role").forEach((b) => b.onclick = () => {
    if (b.dataset.r === "eleve") { S.role = "eleve"; store.save(); return go("inscription"); }
    viewCle(b.dataset.r);
  });
}
function viewCle(role) {
  $view.innerHTML = `<h1>${ROLES[role]}</h1>
    <div class="card"><label class="small">Ton nom (affiché aux élèves)</label><input class="field" id="nom" maxlength="40" placeholder="${role === "prof" ? "Ex. : M. Diallo" : "Ex. : M. le Directeur"}" value="${esc(S.staffNom || "")}">
      <label class="small">Clé d'entrée</label><input class="code" id="cle" placeholder="${role === "prof" ? "PROF-XXXXXX" : "DIR-XXXXXX"}" autocomplete="off" maxlength="12">
      <button class="btn" id="ok">Entrer</button><p id="msg" class="small"></p>
      <p class="small muted">La clé est remise par la direction de l'école.</p></div>
    <button class="btn alt" id="back">Retour</button>`;
  document.getElementById("back").onclick = () => viewRole();
  document.getElementById("ok").onclick = async () => {
    const cle = document.getElementById("cle").value.trim().toUpperCase().replace(/\s/g, ""), nom = document.getElementById("nom").value.trim();
    const msg = document.getElementById("msg");
    if (!nom) { msg.className = "msg-ko small"; msg.textContent = "Écris ton nom."; return; }
    try { await Ecole.claimRole(role, cle, nom, S.profClasses || []); }
    catch { msg.className = "msg-ko small"; msg.textContent = "Clé incorrecte. Vérifie les lettres et les chiffres."; return; }
    Object.assign(S, { role, staffNom: nom }); store.save(); go("ecole");
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
      <label class="small">Classe *<select class="field" id="classe"><option value="">Choisis ta classe</option>${cfg.classes.map((c) => `<option${c.nom === f.classe ? " selected" : ""}>${esc(c.nom)}</option>`).join("")}</select></label></div>
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
    const msg = document.getElementById("msg"), classe = cfg.classes.find((c) => c.nom === v("classe"));
    if (!v("prenom") || !v("nom") || !classe || !v("parent") || !v("telParent")) { msg.className = "msg-ko small"; msg.textContent = "Remplis les champs marqués d'une étoile (*)."; return; }
    const fiche = { prenom: v("prenom"), nom: v("nom"), naissance: v("naissance"), sexe, classe: classe.nom, level: classe.level, tel: v("tel"), whatsapp: v("whatsapp") || v("tel"),
      parent: v("parent"), telParent: v("telParent"), photo, inscritLe: f.inscritLe || today() };
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
  return `<a class="card lib-card fiche-card" href="#inscription"><span class="row" style="justify-content:flex-start">${avatar(f)}<span><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)} · Racine School</span></span></span></a>`;
}

// ---------- Espace école (professeurs et direction)
const ongletsEcole = (actif) => {
  const tabs = S.role === "directeur"
    ? [["", "Tableau"], ["eleves", "Élèves"], ["paiements", "Paiements"], ["devoirs", "Devoirs"], ["reglages", "Réglages"]]
    : [["", "Mes classes"], ["devoirs", "Devoirs"]];
  return `<div class="row onglets">${tabs.map(([k, l]) => `<a class="btn alt small${k === actif ? " on" : ""}" href="#ecole${k ? "/" + k : ""}">${l}</a>`).join("")}</div>`;
};
async function viewEcole() {
  const [, sub = "", arg = ""] = location.hash.slice(1).split("/").map(decodeURIComponent);
  $view.innerHTML = `<h1>${S.role === "directeur" ? "Direction" : "Espace professeur"}</h1><p class="muted">Chargement…</p>`;
  try {
    const [cfg, eleves, devoirs, pay] = await Promise.all([Ecole.config(), Ecole.eleves(), Ecole.devoirs(), S.role === "directeur" ? Ecole.paiements() : {}]);
    const ctx = { cfg, eleves: eleves.sort((a, b) => (a.nom + a.prenom).localeCompare(b.nom + b.prenom)), devoirs, pay };
    const head = `<div class="row"><h1>${S.role === "directeur" ? "Direction" : "Espace professeur"}</h1><span class="small muted">${esc(S.staffNom || "")}</span></div>
      ${Ecole.isDemo ? `<p class="demo small">Démonstration : élèves fictifs. <button class="linkbtn" id="demo-off">Effacer la démo</button></p>` : ""}${ongletsEcole(sub === "eleve" ? "eleves" : sub)}`;
    const views = { "": S.role === "directeur" ? vueEnsemble : vueClassesProf, eleves: vueEleves, eleve: vueFiche, paiements: vuePaiements, devoirs: vueDevoirs, reglages: vueReglages };
    if (S.role !== "directeur" && ["paiements", "reglages"].includes(sub)) return go("ecole");
    $view.innerHTML = head + (await (views[sub] || views[""])(ctx, arg));
    const off = document.getElementById("demo-off");
    if (off) off.onclick = async () => { await Ecole.demo(false); viewEcole(); };
    const on = document.getElementById("demo-on");
    if (on) on.onclick = async () => { on.disabled = true; await Ecole.demo(true); viewEcole(); };
    bindEcole[sub] && bindEcole[sub](ctx, arg);
  } catch (e) {
    $view.innerHTML = `<h1>Espace école</h1><div class="card"><p>Impossible de charger les données de l'école. Vérifie ta connexion puis réessaie.</p><a class="btn" href="#ecole">Réessayer</a></div>`;
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
    ${Ecole.online ? "" : `<button class="btn" id="demo-on">Voir une démonstration avec des élèves fictifs</button>`}</div>`;
  const ret = eleves.map((f) => retard(cfg, f, pay[f.id])), enRetard = ret.filter((r) => r.mois.length);
  const filles = eleves.filter((f) => f.sexe === "F").length, actifs = eleves.filter(actif7).length;
  const avecRep = eleves.filter((f) => reussite(f) !== null);
  const moyReussite = avecRep.length ? Math.round(avecRep.reduce((n, f) => n + reussite(f), 0) / avecRep.length) : 0;
  const parClasse = cfg.classes.map((c) => { const l = eleves.filter((f) => f.classe === c.nom), a = l.filter((f) => reussite(f) !== null);
    return { c, n: l.length, f: l.filter((f) => f.sexe === "F").length, actifs: l.filter(actif7).length, ret: l.filter((f) => retard(cfg, f, pay[f.id]).mois.length).length,
      reu: a.length ? Math.round(a.reduce((n, f) => n + reussite(f), 0) / a.length) : null }; });
  const max = Math.max(1, ...parClasse.map((x) => x.n));
  const aSuivre = eleves.filter((f) => !actif7(f) || (reussite(f) !== null && reussite(f) < 50)).sort((a, b) => (reussite(a) ?? -1) - (reussite(b) ?? -1)).slice(0, 5);
  return `<div class="kpis">
      <div class="card kpi"><span class="small muted">Élèves inscrits</span><b class="count">${eleves.length}</b><span class="small muted">${filles} filles · ${eleves.length - filles} garçons</span></div>
      <div class="card kpi"><span class="small muted">Actifs cette semaine</span><b class="count">${pct(actifs, eleves.length)} %</b><span class="small muted">${actifs} élèves ont révisé</span></div>
      <div class="card kpi"><span class="small muted">Réussite moyenne</span><b class="count">${moyReussite} %</b><span class="small muted">aux QCM de l'appli</span></div>
      <a class="card kpi" href="#ecole/paiements"><span class="small muted">Retards de paiement</span><b class="count ko-txt">${enRetard.length}</b><span class="small muted">${fcfa(enRetard.reduce((n, r) => n + r.montant, 0))} à recouvrer</span></a>
    </div>
    <div class="card"><h2>Répartition par classe</h2>
      <div class="classes">${parClasse.map((x) => `<a class="crow2" href="#ecole/eleves/${encodeURIComponent(x.c.nom)}"><span><b>${esc(x.c.nom)}</b></span>
        <span class="bar"><i style="width:${(100 * x.n) / max}%"></i></span><span class="small"><b>${x.n}</b> él.</span>
        <span class="small muted span">${x.f} F · ${x.n - x.f} G · ${x.actifs} actifs${x.reu !== null ? ` · ${x.reu} % réussite` : ""}${x.ret ? ` · <span class="ko-txt">${x.ret} en retard</span>` : ""}</span></a>`).join("")}</div></div>
    ${aSuivre.length ? `<div class="card"><h2>Élèves à suivre</h2><p class="small muted">Peu actifs cette semaine ou moins de 50 % de réussite.</p>${aSuivre.map((f) => ligneEleve(ctx, f)).join("")}</div>` : ""}
    <div class="card"><h2>Dernières inscriptions</h2>${eleves.slice().sort((a, b) => String(b.inscritLe).localeCompare(String(a.inscritLe))).slice(0, 5).map((f) => ligneEleve(ctx, f)).join("")}</div>`;
}

function vueEleves(ctx, classe) {
  const { cfg, eleves } = ctx, dir = S.role === "directeur";
  const mesClasses = dir ? cfg.classes.map((c) => c.nom) : (S.profClasses || []);
  const list = eleves.filter((f) => (classe ? f.classe === classe : mesClasses.includes(f.classe)));
  return `<div class="card"><div class="row"><select class="field" id="cl"><option value="">Toutes ${dir ? "les classes" : "mes classes"}</option>${mesClasses.map((c) => `<option${c === classe ? " selected" : ""}>${esc(c)}</option>`).join("")}</select></div>
      <input class="field" id="cherche" placeholder="Chercher un élève…" autocomplete="off">
      <p class="small muted" id="nb">${list.length} élève${list.length > 1 ? "s" : ""}</p>
      <div id="liste">${list.map((f) => `<div data-q="${esc((nomComplet(f) + " " + f.classe).toLowerCase())}">${ligneEleve(ctx, f, { pay: dir })}</div>`).join("") || `<p class="muted">Aucun élève inscrit dans cette classe pour l'instant.</p>`}</div></div>`;
}

function vueFiche(ctx, id) {
  const { cfg, eleves, pay } = ctx, f = eleves.find((x) => x.id === id), dir = S.role === "directeur";
  if (!f) return `<div class="card"><p>Élève introuvable.</p></div>`;
  const st = f.stats || {}, r = retard(cfg, f, pay[f.id]);
  const tel = (t, wa = false) => t ? (f.demo ? `${esc(t)} <span class="small muted">(fictif)</span>` : `<a href="${wa ? `https://wa.me/${telLien(t)}` : `tel:${telLien(t)}`}"${wa ? ' target="_blank" rel="noopener"' : ""}>${esc(t)}</a>`) : "—";
  const relance = `Bonjour ${f.parent || ""}, ici la direction de Racine School. Sauf erreur de notre part, la scolarité de ${f.prenom} (${f.classe}) reste à régler pour : ${r.mois.map(moisNom).join(", ")}, soit ${fcfa(r.montant)}. Merci de passer à l'école ou de nous contacter. Bonne journée.`;
  const age = f.naissance ? Math.floor((new Date(today()) - new Date(f.naissance)) / 3.15576e10) : null;
  return `<a class="small" href="#ecole/eleves/${encodeURIComponent(f.classe)}">← ${esc(f.classe)}</a>
    <div class="card" style="align-items:center;text-align:center">${avatar(f, "av big")}<h2>${esc(nomComplet(f))}</h2>
      <p class="muted">${esc(f.classe)}${age ? ` · ${age} ans` : ""}${f.sexe ? ` · ${f.sexe === "F" ? "fille" : "garçon"}` : ""}</p>
      <p class="small muted">Inscrit le ${f.inscritLe ? new Date(f.inscritLe + "T12:00").toLocaleDateString("fr-FR") : "—"}</p></div>
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
        <button class="btn small ${p ? "" : "alt"} payer" data-m="${m}">${p ? "✓ Payé" : "Marquer payé"}</button></div>`; }).join("")}
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
  const classes = dir ? cfg.classes : cfg.classes.filter((c) => (S.profClasses || []).includes(c.nom));
  const avenir = devoirs.filter((d) => d.date >= today() && (dir || (S.profClasses || []).includes(d.classe)));
  const lvl = (classes[0] || {}).level;
  return `<div class="card"><h2>Publier un devoir</h2>
      ${classes.length ? `<p class="small muted">Il arrive dans l'agenda de tous les élèves de la classe.</p>
      <label class="small">Classe<select class="field" id="dcl">${classes.map((c) => `<option value="${esc(c.nom)}">${esc(c.nom)}</option>`).join("")}</select></label>
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
      <label class="small">Frais d'inscription (FCFA)<input class="field" type="number" id="insc" value="${cfg.inscription}" min="0" step="500"></label></div>
    <div class="card"><h2>Mensualités (FCFA)</h2>${DATA.classes.map((n) => `<label class="row small">${n}<input class="field mens" style="max-width:140px" type="number" data-n="${n}" value="${cfg.mensualites[n] || 0}" min="0" step="500"></label>`).join("")}</div>
    <div class="card"><h2>Classes de l'école</h2>
      ${cfg.classes.map((c, i) => `<div class="row slot"><span><b>${esc(c.nom)}</b> <span class="small muted">programme ${esc(c.level)}</span></span><button class="btn alt small delc" data-i="${i}">✕</button></div>`).join("")}
      <div class="row"><input class="field" id="cnom" placeholder="Nom (ex. : 5e C)" maxlength="20"><select class="field" id="clvl">${DATA.levels.map((l) => `<option>${esc(l)}</option>`).join("")}</select></div>
      <button class="btn alt" id="cadd">Ajouter la classe</button></div>
    <button class="btn" id="csave">Enregistrer les réglages</button><p id="cmsg" class="small"></p>
    <div class="card"><h2>Clés d'entrée</h2><p class="small muted">La clé de la direction et celle des professeurs sont dans le fichier remis à l'école. Donne la clé « PROF » à chaque professeur : il l'entre une fois sur son téléphone.</p></div>
    <button class="btn alt" id="quit">Changer de profil sur ce téléphone</button>`;
}

function vueClassesProf(ctx) {
  const { cfg, eleves } = ctx, mine = S.profClasses || [];
  return `<div class="card"><h2>Mes classes</h2><p class="small muted">Coche les classes où tu enseignes.</p>
      <div class="chips">${cfg.classes.map((c) => `<label class="chip"><input type="checkbox" class="pc" value="${esc(c.nom)}"${mine.includes(c.nom) ? " checked" : ""}> ${esc(c.nom)}</label>`).join("")}</div></div>
    ${mine.map((c) => { const l = eleves.filter((f) => f.classe === c), a = l.filter((f) => reussite(f) !== null);
      return `<div class="card"><div class="row"><h2>${esc(c)}</h2><span class="small muted">${l.length} élève${l.length > 1 ? "s" : ""}${a.length ? ` · ${Math.round(a.reduce((n, f) => n + reussite(f), 0) / a.length)} % réussite` : ""}</span></div>
        ${l.map((f) => ligneEleve(ctx, f)).join("") || `<p class="small muted">Aucun élève inscrit pour l'instant.</p>`}</div>`; }).join("")}
    ${!ctx.eleves.length && !Ecole.online ? `<button class="btn alt" id="demo-on">Voir une démonstration avec des élèves fictifs</button>` : ""}
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
  eleves: (ctx) => {
    const cl = document.getElementById("cl"), q = document.getElementById("cherche");
    cl.onchange = () => go("ecole/eleves" + (cl.value ? "/" + encodeURIComponent(cl.value) : ""));
    q.oninput = () => {
      const t = q.value.trim().toLowerCase(); let n = 0;
      $view.querySelectorAll("#liste [data-q]").forEach((d) => { d.hidden = !d.dataset.q.includes(t); n += !d.hidden; });
      document.getElementById("nb").textContent = `${n} élève${n > 1 ? "s" : ""}`;
    };
  },
  eleve: (ctx, id) => {
    $view.querySelectorAll(".payer").forEach((b) => b.onclick = async () => {
      b.disabled = true; await Ecole.payer(id, b.dataset.m, !(ctx.pay[id] || {})[b.dataset.m]).catch(() => {}); viewEcole();
    });
  },
  devoirs: (ctx) => {
    const cl = document.getElementById("dcl");
    if (cl) cl.onchange = () => { const c = ctx.cfg.classes.find((x) => x.nom === cl.value); document.getElementById("dmat").innerHTML = matieresDe(c && c.level); };
    const add = document.getElementById("dadd");
    if (add) add.onclick = async () => {
      const sid = document.getElementById("dsid").value, date = document.getElementById("ddt").value;
      if (!date) return;
      add.disabled = true;
      await Ecole.addDevoir({ classe: cl.value, type: document.getElementById("dty").value, date, note: document.getElementById("dnote").value.trim(), ...(sid ? { sid } : { nom: "Vie scolaire" }) }).catch(() => {});
      viewEcole();
    };
    $view.querySelectorAll(".rm").forEach((b) => b.onclick = async () => { await Ecole.delDevoir(b.dataset.id).catch(() => {}); viewEcole(); });
  },
  reglages: (ctx) => {
    quitter();
    const cfg = { ...ctx.cfg, classes: ctx.cfg.classes.slice(), mensualites: { ...ctx.cfg.mensualites } };
    $view.querySelectorAll(".delc").forEach((b) => b.onclick = () => { b.closest(".slot").remove(); cfg.classes[+b.dataset.i] = null; });
    document.getElementById("cadd").onclick = async () => {
      const nom = document.getElementById("cnom").value.trim(), level = document.getElementById("clvl").value;
      if (!nom || cfg.classes.some((c) => c && c.nom === nom)) return;
      await Ecole.setConfig({ ...ctx.cfg, classes: [...ctx.cfg.classes, { nom, level }] }); viewEcole();
    };
    document.getElementById("csave").onclick = async () => {
      const v = (id) => document.getElementById(id).value;
      $view.querySelectorAll(".mens").forEach((i) => { cfg.mensualites[i.dataset.n] = +i.value || 0; });
      await Ecole.setConfig({ ...cfg, classes: cfg.classes.filter(Boolean), annee: v("annee").trim() || cfg.annee, debut: v("debut") || cfg.debut, fin: v("fin") || cfg.fin, inscription: +v("insc") || 0 })
        .then(() => { const m = document.getElementById("cmsg"); m.className = "msg-ok small"; m.textContent = "Réglages enregistrés."; })
        .catch(() => { const m = document.getElementById("cmsg"); m.className = "msg-ko small"; m.textContent = "L'enregistrement n'a pas abouti."; });
    };
  },
};
