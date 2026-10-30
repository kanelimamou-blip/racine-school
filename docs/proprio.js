"use strict";
// Espace admin (#admin) : réservé aux comptes de CONFIG_APP.admins et au vendeur de l'appli (voir compte.js et admin() dans les règles).
// Comptes de l'école avec leur activité, chiffres, journal des erreurs, suspension, WhatsApp, « Voir » un compte en lecture seule
// et barre de rôles pour les présentations. L'école n'en voit rien.

const PROPRIO = { onglet: "comptes", filtre: "", etat: "", comptes: null, erreurs: null, fiches: {}, annuaire: {}, liens: [], partages: {} };
const prDate = (t) => (t && t.toDate ? t.toDate() : null);
const prJour = (d) => (d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—");
const prHeure = (d) => (d ? d.toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");
const prDepuis = (d, jours) => !!d && Date.now() - d.getTime() < jours * 864e5;
const ETATS = { actif: "Actif", nouveau: "Nouveau", inactif: "Inactif", suspendu: "Suspendu" };
const etatDe = (c) => (c.suspendu === true ? "suspendu" : prDepuis(c.cree, 7) ? "nouveau" : prDepuis(c.vu, 7) ? "actif" : "inactif");
// jours d'ouverture de l'appli sur les 7 derniers jours (jours notés par compte.js, sinon jours de révision)
function jours7(c) {
  const sem = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); });
  const j = new Set([...(c.jours || []), ...((c.data || {}).days || [])]);
  return sem.filter((d) => j.has(d)).length;
}
// téléphone et quartier : fiche d'inscription de l'élève, annuaire de l'équipe, ou fiche de l'enfant pour un parent
function coordonnees(c) {
  const f = PROPRIO.fiches[c.uid], a = PROPRIO.annuaire[c.uid];
  if (f) return { tel: f.whatsapp || f.tel || f.telParent, quartier: f.quartier || f.adresse || "", info: [f.classe, f.parent && `parent : ${f.parent}`].filter(Boolean).join(" · ") };
  if (a) return { tel: a.tel, quartier: "", info: a.nom || "" };
  const enfant = PROPRIO.liens.find((l) => l.parent === c.uid), fe = enfant && PROPRIO.fiches[enfant.enfant];
  if (fe) return { tel: fe.telParent, quartier: fe.quartier || fe.adresse || "", info: `parent de ${nomComplet(fe)}` };
  return { tel: "", quartier: "", info: "" };
}

async function viewProprio(recharger = false) {
  document.querySelector(".tabs").hidden = true;
  if (recharger || !PROPRIO.comptes) {
    $view.innerHTML = `<h1>Espace admin</h1><p class="muted">Chargement…</p>`;
    try {
      const [c, e, el, an, li, tp] = await Promise.all([Compte.comptes(), Compte.erreurs(), Compte.lister("eleves").catch(() => []), Compte.lister("annuaire").catch(() => []), Compte.lister("liens").catch(() => []), Compte.telephonesPartages().catch(() => ({}))]);
      PROPRIO.partages = tp;
      PROPRIO.comptes = c.filter((x) => x.uid !== Compte.user.uid); PROPRIO.erreurs = e;
      PROPRIO.fiches = Object.fromEntries(el.map((x) => [x.id, x])); PROPRIO.annuaire = Object.fromEntries(an.map((x) => [x.id, x])); PROPRIO.liens = li;
    } catch (err) {
      $view.innerHTML = `<h1>Espace admin</h1><div class="card"><p class="msg-ko">Lecture refusée (${esc(err.code || err.message || "erreur")}). Les règles Firestore de cette version n'ont sans doute pas encore été publiées dans la console Firebase.</p><button class="btn" id="pr-re">Réessayer</button></div>`;
      document.getElementById("pr-re").onclick = () => viewProprio(true);
      return;
    }
  }
  // nom et rôle : ceux notés par l'appli, sinon ceux de la fiche d'élève, de l'annuaire ou du lien parent
  const nomRole = (c) => { const f = PROPRIO.fiches[c.uid], an = PROPRIO.annuaire[c.uid];
    return { nom: c.nom || (f && nomComplet(f)) || (an && an.nom) || c.name || "", role: c.role || (f ? "eleve" : an ? an.role : PROPRIO.liens.some((l) => l.parent === c.uid) ? "parent" : "") }; };
  const comptes = PROPRIO.comptes.map((c) => { const x = { ...c, ...nomRole(c), cree: prDate(c.created), vu: prDate(c.vu) || prDate(c.created) }; return { ...x, etat: etatDe(x), j7: jours7(c), co: coordonnees(c) }; });
  const erreurs = PROPRIO.erreurs.map((e) => ({ ...e, quand: prDate(e.at) }));
  const nb = (etat) => comptes.filter((c) => c.etat === etat).length;
  const chiffre = (n, label) => `<div class="card" style="gap:2px"><p class="count">${n}</p><p class="small muted">${label}</p></div>`;
  const f = PROPRIO.filtre.toLowerCase();
  const liste = comptes.filter((c) => (!PROPRIO.etat || c.etat === PROPRIO.etat)
      && (!f || `${c.nom || c.name || ""} ${c.email || ""} ${ROLES[c.role] || ""} ${c.co.tel || ""} ${c.co.quartier} ${c.co.info}`.toLowerCase().includes(f)))
    .sort((a, b) => (b.vu ? b.vu.getTime() : 0) - (a.vu ? a.vu.getTime() : 0));
  const onglet = (id, label) => `<button class="btn${PROPRIO.onglet === id ? "" : " alt"}" style="flex:1" data-onglet="${id}">${label}</button>`;
  // « même téléphone que… » : comptes ouverts sur le même téléphone, qui partagent un seul essai gratuit
  const meme = (c) => { const a = PROPRIO.partages[c.uid]; if (!a || !a.length) return "";
    const noms = a.map((x) => { const v = comptes.find((y) => y.uid === x); return v ? v.nom || v.email || "sans nom" : x === Compte.user.uid ? "toi" : "compte supprimé"; });
    return `<p class="small"><span style="color:var(--hi-ink);background:var(--hi);padding:0 4px;border-radius:4px">📱 même téléphone que ${esc(noms.join(", "))}</span></p>`; };
  const premium = (c) => (c.premium ? `<p class="small">⭐ Premium${c.code ? ` · code <b>${esc(c.code)}</b>` : ""}</p>` : "");
  const filtre = (id, label) => `<button class="btn small${PROPRIO.etat === id ? "" : " alt"}" data-etat="${id}">${label}</button>`;

  $view.innerHTML = `<div class="row"><h1>Espace admin</h1><button class="btn alt small" id="pr-re" aria-label="Actualiser">↻</button></div>
    <p class="small muted">Visible seulement par toi. Les comptes de l'école ne voient rien de cet espace.</p>
    <div class="grid">
      ${chiffre(comptes.length, "inscrits")}
      ${chiffre(comptes.filter((c) => prDepuis(c.vu, 7) && c.etat !== "suspendu").length, "actifs cette semaine")}
      ${chiffre(nb("inactif"), "inactifs (plus de 7 jours)")}
      ${chiffre(erreurs.filter((e) => prDepuis(e.quand, 7)).length, "erreurs sur 7 jours")}
      ${chiffre(comptes.filter((c) => c.premium).length, "premium")}
      ${chiffre(comptes.filter((c) => (PROPRIO.partages[c.uid] || []).length).length, "comptes sur un téléphone partagé")}
    </div>
    <button class="btn alt" id="pr-demo">🎬 Mode présentation (passer d'un rôle à l'autre)</button>
    <div class="row">${onglet("comptes", `Comptes (${comptes.length})`)}${onglet("nouveautes", "Nouveautés")}${onglet("erreurs", `Erreurs (${erreurs.length})`)}</div>
    <div id="pr-corps"></div>
    <button class="btn alt" id="pr-out">Se déconnecter</button>`;

  const corps = document.getElementById("pr-corps");
  if (PROPRIO.onglet === "comptes") {
    corps.innerHTML = `<input class="field" id="pr-f" placeholder="Chercher un nom, un e-mail, un téléphone, une classe" value="${esc(PROPRIO.filtre)}">
      <div class="row" style="flex-wrap:wrap;justify-content:flex-start">${filtre("", `Tous (${comptes.length})`)}${Object.entries(ETATS).map(([k, n]) => filtre(k, `${n} (${nb(k)})`)).join("")}</div>
      ${liste.length ? liste.map((c) => `<div class="card"><div class="row"><b>${esc(c.nom || c.email || "Sans nom")}</b><span class="small ${c.etat === "suspendu" ? "msg-ko" : c.etat === "inactif" ? "muted" : "msg-ok"}">${ETATS[c.etat]}</span></div>
        <p class="small muted">${esc(c.role ? ROLES[c.role] || c.role : "Profil non choisi")}${c.co.info ? ` · ${esc(c.co.info)}` : ""}${c.email ? ` · ${esc(c.email)}` : ""}</p>
        <p class="small">${c.co.tel ? `📞 ${esc(c.co.tel)}` : "Pas de téléphone"}${c.co.quartier ? ` · 📍 ${esc(c.co.quartier)}` : ""}</p>
        <p class="small">Inscrit le ${prJour(c.cree)} · vu ${prHeure(c.vu)} · <b>${c.j7} jour${c.j7 > 1 ? "s" : ""} d'activité sur 7</b></p>
        ${premium(c)}${meme(c)}
        <div class="row">
          <button class="btn alt small" style="flex:1" data-voir="${esc(c.uid)}">👁️ Voir</button>
          ${c.co.tel ? `<a class="btn alt small" style="flex:1" target="_blank" rel="noopener" href="https://wa.me/${telLien(c.co.tel)}">WhatsApp</a>` : ""}
          <button class="btn${c.suspendu ? "" : " alt"} small" style="flex:1" data-uid="${esc(c.uid)}" data-susp="${c.suspendu ? "" : "1"}">${c.suspendu ? "Réactiver" : "Suspendre"}</button>
        </div></div>`).join("")
        : `<p class="muted">Aucun compte.</p>`}`;
    const champ = document.getElementById("pr-f");
    champ.oninput = () => { PROPRIO.filtre = champ.value; viewProprio().then(() => { const c = document.getElementById("pr-f"); c.focus(); c.setSelectionRange(c.value.length, c.value.length); }); };
    corps.querySelectorAll("[data-etat]").forEach((b) => b.onclick = () => { PROPRIO.etat = b.dataset.etat; viewProprio(); });
    corps.querySelectorAll("[data-voir]").forEach((b) => b.onclick = () => Compte.voirCompte({ uid: b.dataset.voir, nom: (comptes.find((c) => c.uid === b.dataset.voir) || {}).nom || "" }));
    corps.querySelectorAll("[data-uid]").forEach((b) => b.onclick = async () => {
      const oui = !!b.dataset.susp;
      b.disabled = true;
      try { await Compte.suspendre(b.dataset.uid, oui); PROPRIO.comptes.find((c) => c.uid === b.dataset.uid).suspendu = oui; viewProprio(); }
      catch (e) { b.disabled = false; b.textContent = `Refusé (${e.code || "erreur"})`; }
    });
  } else if (PROPRIO.onglet === "nouveautes") {
    // inscriptions et connexions des 14 derniers jours, 30 derniers comptes, 30 dernières connexions
    const jours = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return d.toISOString().slice(0, 10); });
    const jourDe = (d) => (d ? new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10) : "");
    const ins = jours.map((j) => comptes.filter((c) => jourDe(c.cree) === j).length);
    const cos = jours.map((j) => comptes.filter((c) => (c.jours || []).includes(j) || ((c.data || {}).days || []).includes(j) || jourDe(c.vu) === j).length);
    const max = Math.max(1, ...ins, ...cos);
    const barres = (v, legende) => `<div style="display:flex;align-items:flex-end;gap:3px;height:96px">${v.map((n, i) => `<div style="flex:1;text-align:center" title="${jours[i]} : ${n}"><span class="small">${n || ""}</span><div style="height:${(70 * n) / max}px;min-height:2px;background:var(--accent);border-radius:3px"></div></div>`).join("")}</div>
      <div class="row small muted"><span>${jours[0].slice(8)}/${jours[0].slice(5, 7)}</span><span>aujourd'hui</span></div><p class="small muted">${legende}</p>`;
    const depuis = (d) => { if (!d) return "—"; const m = Math.round((Date.now() - d.getTime()) / 6e4); return m < 60 ? `il y a ${m} min` : m < 1440 ? `il y a ${Math.round(m / 60)} h` : `il y a ${Math.round(m / 1440)} j`; };
    const ligne = (c, d, t) => `<div class="row small" style="padding:6px 0;border-bottom:1px solid rgba(127,127,127,.2)"><span><b>${esc(c.nom || c.email || "Sans nom")}</b>${c.premium ? " ⭐" : ""}<br><span class="muted">${esc(c.role ? ROLES[c.role] || c.role : "Profil non choisi")}${c.co.info ? ` · ${esc(c.co.info)}` : ""}</span>${meme(c)}</span><span class="muted" style="text-align:right">${t}<br>${depuis(d)}</span></div>`;
    const nouveaux = comptes.filter((c) => c.cree).sort((a, b) => b.cree - a.cree).slice(0, 30);
    const vus = comptes.filter((c) => c.vu).sort((a, b) => b.vu - a.vu).slice(0, 30);
    corps.innerHTML = `<div class="card"><h2>Inscriptions par jour (14 jours)</h2>${barres(ins, `${ins.reduce((a, b) => a + b, 0)} inscriptions sur 14 jours.`)}</div>
      <div class="card"><h2>Connexions par jour (14 jours)</h2>${barres(cos, "Nombre de comptes qui ont ouvert l'appli ce jour-là.")}</div>
      <div class="card"><h2>🆕 30 derniers comptes</h2>${nouveaux.map((c) => ligne(c, c.cree, "inscrit")).join("") || `<p class="muted">Aucun compte pour l'instant.</p>`}</div>
      <div class="card"><h2>🟢 30 dernières connexions</h2>${vus.map((c) => ligne(c, c.vu, "vu")).join("") || `<p class="muted">Aucune connexion enregistrée.</p>`}</div>`;
  } else {
    corps.innerHTML = erreurs.length ? `${erreurs.map((e) => `<div class="card"><div class="row"><b>${e.type === "refus" ? "Écriture ou lecture refusée" : "Plantage"}</b><span class="small muted">${prHeure(e.quand)}</span></div>
        <p class="small">${esc(e.compte || e.uid)}${e.role ? ` (${esc(ROLES[e.role] || e.role)})` : ""} · écran ${esc(e.page || "")}</p>
        <p class="small muted" style="word-break:break-word">${esc(e.message)}</p>
        ${e.tel ? `<p class="small muted" style="word-break:break-word">📱 ${esc(e.tel)}</p>` : ""}</div>`).join("")}
      <button class="btn alt" id="pr-vider">Effacer le journal</button>` : `<p class="muted">Aucune erreur enregistrée.</p>`;
    const v = document.getElementById("pr-vider");
    if (v) v.onclick = async () => { v.disabled = true; await Compte.viderErreurs(erreurs.map((e) => e.id)).catch(() => {}); viewProprio(true); };
  }
  $view.querySelectorAll("[data-onglet]").forEach((b) => b.onclick = () => { PROPRIO.onglet = b.dataset.onglet; viewProprio(); });
  document.getElementById("pr-re").onclick = () => viewProprio(true);
  document.getElementById("pr-demo").onclick = () => Compte.voirCompte({ role: "directeur" });
  document.getElementById("pr-out").onclick = async () => { await Compte.signOut(); PROPRIO.comptes = null; location.hash = ""; render(); };
}

// #admin ouvert avec un compte qui n'est pas admin : son UID, à envoyer pour être ajouté à config.js et aux règles
function viewPasAdmin() {
  document.querySelector(".tabs").hidden = true;
  const uid = Compte.user.uid;
  $view.innerHTML = `<h1>Espace admin</h1><div class="card"><p>Ce compte (${esc(Compte.user.email || "")}) n'est pas encore admin.</p>
    <p class="small muted">Ton identifiant (UID), à envoyer pour être ajouté :</p><p class="code" style="word-break:break-all">${esc(uid)}</p>
    <button class="btn" id="uid-copie">Copier</button><p class="small" id="uid-msg"></p>
    <button class="btn alt" id="uid-out">Se déconnecter</button></div>`;
  document.getElementById("uid-copie").onclick = () => navigator.clipboard.writeText(uid).then(() => { document.getElementById("uid-msg").textContent = "Copié !"; }, () => {});
  document.getElementById("uid-out").onclick = async () => { await Compte.signOut(); render(); };
}

// Vue d'un compte ou présentation : préparée avant le démarrage de l'espace école ; rien n'est enregistré (compte.js bloque les écritures)
async function preparerVue() {
  const v = Compte.voir;
  if (!v) return;
  for (const k of ["role", "staffNom", "fiche", "enfants", "profClasses", "dirReel"]) delete S[k];
  if (v.uid) return;
  S.role = v.role;
  const cfg = await Ecole.config().catch(() => ECOLE_DEFAUT), eleves = await Ecole.eleves().catch(() => []);
  const c = cfg.classes[0] || { id: "", nom: "", level: "6e" };
  if (v.role === "eleve") { const f = eleves[0]; S.fiche = f || { apercu: true, prenom: "Élève", nom: "Aperçu", classe: c.nom, classeId: c.id, level: c.level }; S.level = S.fiche.level || c.level; }
  if (v.role === "parent") S.enfants = eleves.slice(0, 2).map((e) => e.id);
  if (v.role === "prof") S.profClasses = cfg.classes.map((x) => x.id);
  S.staffNom = v.role === "eleve" || v.role === "parent" ? "" : ROLES[v.role];
}
// bandeau en haut de l'écran pendant une vue : qui on regarde, choix du rôle en présentation, retour à l'espace admin
function barreVue() {
  const v = Compte.voir;
  let bar = document.getElementById("barre-vue");
  if (!v) { if (bar) bar.remove(); return; }
  if (!bar) { bar = document.createElement("div"); bar.id = "barre-vue"; bar.className = "row noprint"; bar.style.cssText = "position:sticky;top:0;z-index:20;background:var(--hi);color:var(--hi-ink);padding:8px 12px;gap:8px;font-size:.9rem"; document.body.insertBefore(bar, document.body.firstChild); }
  bar.innerHTML = v.uid ? `<span>👁️ Vue de <b>${esc(v.nom || v.email || "ce compte")}</b> · lecture seule</span><button class="btn alt small" id="vue-q">Quitter</button>`
    : `<span>🎬 Présentation</span><select class="field" id="vue-r" style="flex:1;padding:6px">${Object.entries(ROLES).map(([k, n]) => `<option value="${k}"${k === v.role ? " selected" : ""}>${n}</option>`).join("")}</select><button class="btn alt small" id="vue-q">Quitter</button>`;
  document.getElementById("vue-q").onclick = () => Compte.quitterVue();
  const sel = document.getElementById("vue-r");
  if (sel) sel.onchange = () => Compte.voirCompte({ role: sel.value });
}

// Compte suspendu par l'admin : l'appli ne s'ouvre plus (les règles Firestore refusent aussi toute écriture)
function viewSuspendu() {
  document.querySelector(".tabs").hidden = true;
  $view.innerHTML = `<div class="card" style="gap:14px"><img src="icons/logo.svg" alt="" style="width:80px;height:80px;margin:0 auto;display:block">
    <h1 style="text-align:center;margin:0">Compte suspendu</h1>
    <p class="muted" style="text-align:center">Ce compte est suspendu. Contacte l'équipe au <a href="tel:${telLien(CONFIG_APP.contact)}">${esc(CONFIG_APP.contact)}</a>.</p>
    <a class="btn" target="_blank" rel="noopener" href="https://wa.me/${telLien(CONFIG_APP.contact)}">Écrire sur WhatsApp</a>
    <button class="btn alt" id="sus-out">Se déconnecter</button></div>`;
  document.getElementById("sus-out").onclick = async () => { await Compte.signOut(); render(); };
}
