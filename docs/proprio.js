"use strict";
// Espace propriétaire : réservé au compte du vendeur de l'appli (voir PROPRIO_HASH dans compte.js et proprio() dans les règles).
// Comptes clients, chiffres d'utilisation, journal des erreurs, suspension d'un compte à la main. L'école n'en voit rien.

const PROPRIO = { onglet: "comptes", filtre: "", comptes: null, erreurs: null };
const prDate = (t) => (t && t.toDate ? t.toDate() : null);
const prJour = (d) => (d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—");
const prHeure = (d) => (d ? d.toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");
const prDepuis = (d, jours) => !!d && Date.now() - d.getTime() < jours * 864e5;
const prAujourdhui = (d) => !!d && d.toDateString() === new Date().toDateString();

async function viewProprio(recharger = false) {
  document.querySelector(".tabs").hidden = true;
  if (recharger || !PROPRIO.comptes) {
    $view.innerHTML = `<h1>Espace propriétaire</h1><p class="muted">Chargement…</p>`;
    try {
      const [c, e] = await Promise.all([Compte.comptes(), Compte.erreurs()]);
      PROPRIO.comptes = c.filter((x) => x.uid !== Compte.user.uid); PROPRIO.erreurs = e;
    } catch (err) {
      $view.innerHTML = `<h1>Espace propriétaire</h1><div class="card"><p class="msg-ko">Lecture refusée (${esc(err.code || err.message || "erreur")}). Les règles Firestore de cette version n'ont sans doute pas encore été publiées dans la console Firebase.</p><button class="btn" id="pr-re">Réessayer</button></div>`;
      document.getElementById("pr-re").onclick = () => viewProprio(true);
      return;
    }
  }
  const comptes = PROPRIO.comptes.map((c) => ({ ...c, cree: prDate(c.created), vu: prDate(c.vu) || prDate(c.created) }));
  const erreurs = PROPRIO.erreurs.map((e) => ({ ...e, quand: prDate(e.at) }));
  const susp = comptes.filter((c) => c.suspendu === true).length;
  const chiffre = (n, label) => `<div class="card" style="gap:2px"><p class="count">${n}</p><p class="small muted">${label}</p></div>`;
  const parRole = Object.entries(comptes.reduce((o, c) => ((o[c.role || "?"] = (o[c.role || "?"] || 0) + 1), o), {}))
    .map(([r, n]) => `${esc(r === "?" ? "Profil non choisi" : ROLES[r] || r)} : <b>${n}</b>`).join(" · ");
  const f = PROPRIO.filtre.toLowerCase();
  const liste = comptes.filter((c) => !f || `${c.nom || c.name || ""} ${c.email || ""} ${c.role || ""}`.toLowerCase().includes(f))
    .sort((a, b) => (b.vu ? b.vu.getTime() : 0) - (a.vu ? a.vu.getTime() : 0));
  const onglet = (id, label) => `<button class="btn${PROPRIO.onglet === id ? "" : " alt"}" style="flex:1" data-onglet="${id}">${label}</button>`;

  $view.innerHTML = `<div class="row"><h1>Espace propriétaire</h1><button class="btn alt small" id="pr-re">↻</button></div>
    <p class="small muted">Visible seulement par ${esc(Compte.user.email)}. Les comptes de l'école ne voient rien de cet espace.</p>
    <div class="grid">
      ${chiffre(comptes.length, "comptes inscrits")}
      ${chiffre(comptes.length - susp, "comptes actifs")}
      ${chiffre(susp, "comptes suspendus")}
      ${chiffre(comptes.filter((c) => prAujourdhui(c.vu)).length, "actifs aujourd'hui")}
      ${chiffre(comptes.filter((c) => prDepuis(c.vu, 7)).length, "actifs sur 7 jours")}
      ${chiffre(comptes.filter((c) => prDepuis(c.vu, 30)).length, "actifs sur 30 jours")}
      ${chiffre(comptes.filter((c) => prDepuis(c.cree, 7)).length, "inscrits cette semaine")}
      ${chiffre(comptes.filter((c) => prDepuis(c.cree, 30)).length, "inscrits ce mois-ci")}
      ${chiffre(erreurs.filter((e) => prDepuis(e.quand, 1)).length, "erreurs sur 24 h")}
    </div>
    ${parRole ? `<p class="small">${parRole}</p>` : ""}
    <div class="row">${onglet("comptes", `Comptes (${comptes.length})`)}${onglet("erreurs", `Erreurs (${erreurs.length})`)}</div>
    <div id="pr-corps"></div>
    <button class="btn alt" id="pr-out">Se déconnecter</button>`;

  const corps = document.getElementById("pr-corps");
  if (PROPRIO.onglet === "comptes") {
    corps.innerHTML = `<input class="field" id="pr-f" placeholder="Chercher un nom, un e-mail, un profil" value="${esc(PROPRIO.filtre)}">
      ${liste.length ? liste.map((c) => `<div class="card"><div class="row"><b>${esc(c.nom || c.name || "Sans nom")}</b><span class="small ${c.suspendu ? "msg-ko" : "msg-ok"}">${c.suspendu ? "Suspendu" : "Actif"}</span></div>
        <p class="small muted">${esc(c.email || "e-mail inconnu")}${c.role ? ` · ${esc(ROLES[c.role] || c.role)}` : ""}</p>
        <p class="small">Inscrit le ${prJour(c.cree)} · dernière activité ${prHeure(c.vu)}${prDepuis(c.vu, 30) ? "" : " (inactif depuis plus de 30 jours)"}</p>
        <button class="btn${c.suspendu ? "" : " alt"} small" data-uid="${esc(c.uid)}" data-susp="${c.suspendu ? "" : "1"}">${c.suspendu ? "Réactiver ce compte" : "Suspendre ce compte"}</button></div>`).join("")
        : `<p class="muted">Aucun compte.</p>`}`;
    const champ = document.getElementById("pr-f");
    champ.oninput = () => { PROPRIO.filtre = champ.value; viewProprio().then(() => { const c = document.getElementById("pr-f"); c.focus(); c.setSelectionRange(c.value.length, c.value.length); }); };
    corps.querySelectorAll("[data-uid]").forEach((b) => b.onclick = async () => {
      const oui = !!b.dataset.susp;
      b.disabled = true;
      try { await Compte.suspendre(b.dataset.uid, oui); PROPRIO.comptes.find((c) => c.uid === b.dataset.uid).suspendu = oui; viewProprio(); }
      catch (e) { b.disabled = false; b.textContent = `Refusé (${e.code || "erreur"})`; }
    });
  } else {
    corps.innerHTML = erreurs.length ? `${erreurs.map((e) => `<div class="card"><div class="row"><b>${e.type === "refus" ? "Action refusée" : "Plantage"}</b><span class="small muted">${prHeure(e.quand)}</span></div>
        <p class="small">${esc(e.compte || e.uid)} · page ${esc(e.page || "")}</p>
        <p class="small muted" style="word-break:break-word">${esc(e.message)}</p></div>`).join("")}
      <button class="btn alt" id="pr-vider">Effacer le journal</button>` : `<p class="muted">Aucune erreur enregistrée.</p>`;
    const v = document.getElementById("pr-vider");
    if (v) v.onclick = async () => { v.disabled = true; await Compte.viderErreurs(erreurs.map((e) => e.id)).catch(() => {}); viewProprio(true); };
  }
  $view.querySelectorAll("[data-onglet]").forEach((b) => b.onclick = () => { PROPRIO.onglet = b.dataset.onglet; viewProprio(); });
  document.getElementById("pr-re").onclick = () => viewProprio(true);
  document.getElementById("pr-out").onclick = async () => { await Compte.signOut(); PROPRIO.comptes = null; render(); };
}

// Compte suspendu par le propriétaire : l'appli ne s'ouvre plus (les règles Firestore bloquent aussi les données de l'école)
function viewSuspendu() {
  document.querySelector(".tabs").hidden = true;
  $view.innerHTML = `<div class="card" style="gap:14px"><img src="icons/logo.svg" alt="" style="width:80px;height:80px;margin:0 auto;display:block">
    <h1 style="text-align:center;margin:0">Compte suspendu</h1>
    <p class="muted" style="text-align:center">Ce compte a été suspendu. Rapproche-toi de la direction de l'école pour le faire réactiver.</p>
    <button class="btn alt" id="sus-out">Se déconnecter</button></div>`;
  document.getElementById("sus-out").onclick = async () => { await Compte.signOut(); render(); };
}
