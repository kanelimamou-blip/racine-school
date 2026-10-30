"use strict";
// Vie scolaire de Racine School : annonces et calendrier, annuaire de l'équipe, appel en classe et cours du jour,
// absents et retards (surveillant), portail avec la carte d'élève à QR code, caisse et reçus, certificat de scolarité,
// export pour Excel, quiz en classe, espace parent. Les données passent par Ecole (Firestore, ou ce téléphone en démo).

const jourFr = (d) => new Date(d + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const dateFr = (d) => (d ? new Date(d + "T12:00").toLocaleDateString("fr-FR") : "—");
const maintenant = () => new Date().toTimeString().slice(0, 5);
const CIBLES = { tous: "Toute l'école", eleves: "Élèves", parents: "Parents", profs: "Professeurs", personnel: "Personnel et surveillants" };
const POSTES = { directeur: "Direction", prof: "Professeur", surveillant: "Surveillant", personnel: "Personnel" };
const fictif = (x) => x && (x.demo || String(x.id || "").startsWith("demo"));
const lienWa = (tel, texte) => `https://wa.me/${telLien(tel)}?text=${encodeURIComponent(texte)}`;
const mesClassesProf = (cfg) => cfg.classes.filter((c) => (S.profClasses || []).includes(c.id));
const qrSvg = (texte) => { const q = qrcode(0, "M"); q.addData(texte); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); };
// absents et retards du jour, toutes classes confondues (un élève absent à deux cours compte une fois)
function bilanDuJour(ctx) {
  const abs = new Map(), ret = new Map();
  for (const a of ctx.appels) {
    (a.absents || []).forEach((id) => abs.has(id) || abs.set(id, a));
    (a.retards || []).forEach((id) => ret.has(id) || ret.set(id, a));
  }
  return { abs, ret, portail: Object.entries(ctx.portail || {}).sort((a, b) => a[1].localeCompare(b[1])) };
}
const eleveDe = (ctx, id) => ctx.eleves.find((f) => f.id === id);

// ---------- Tableau de bord du jour (direction)
function carteDuJour(ctx) {
  const { cfg, eleves, pay, annonces } = ctx, b = bilanDuJour(ctx);
  const classesAvecEleves = cfg.classes.filter((c) => eleves.some((f) => f.cid === c.id)).length;
  const appelees = new Set(ctx.appels.map((a) => a.cid)).size;
  const encaisse = Object.values(pay).flatMap((p) => Object.values(p || {})).filter((x) => x && x.le === today());
  const total = encaisse.reduce((n, x) => n + (x.montant || 0), 0);
  const prochain = annonces.filter((a) => a.date && a.date >= today()).sort((a, b) => a.date.localeCompare(b.date))[0];
  const nouveaux = eleves.filter((f) => f.inscritLe === today()).length;
  const absents = [...b.abs.keys()].map((id) => eleveDe(ctx, id)).filter(Boolean);
  return `<div class="card jour"><div class="row"><h2>Aujourd'hui</h2><span class="small muted">${jourFr(today())}</span></div>
    <div class="mini4">
      <div><b class="count ko-txt">${b.abs.size}</b><span class="small muted">absents</span></div>
      <div><b class="count">${b.ret.size + b.portail.length}</b><span class="small muted">retards</span></div>
      <div><b class="count">${appelees}/${classesAvecEleves}</b><span class="small muted">classes appelées</span></div>
      <div><b class="count ok-txt">${total ? Math.round(total / 1000) + " k" : "0"}</b><span class="small muted">FCFA encaissés</span></div></div>
    ${absents.length ? `<p class="small"><b>Absents :</b> ${absents.slice(0, 6).map((f) => `<a href="#ecole/eleve/${encodeURIComponent(f.id)}">${esc(nomComplet(f))}</a> (${esc(f.classe)})`).join(", ")}${absents.length > 6 ? ` et ${absents.length - 6} autres` : ""}</p>` : ""}
    <p class="small muted">${encaisse.length} paiement${encaisse.length > 1 ? "s" : ""} aujourd'hui (${fcfa(total)})${nouveaux ? ` · ${nouveaux} nouvelle${nouveaux > 1 ? "s" : ""} inscription${nouveaux > 1 ? "s" : ""}` : ""}${prochain ? ` · prochain rendez-vous : <a href="#ecole/annonces">${esc(prochain.titre)}</a>, ${jourFr(prochain.date)}` : ""}</p></div>`;
}

// absence ou retard du jour sur la fiche d'un élève
function absencesEleve(ctx, f) {
  const b = bilanDuJour(ctx), a = b.abs.get(f.id), r = b.ret.get(f.id), p = (ctx.portail || {})[f.id];
  if (!a && !r && !p) return "";
  return `<div class="card"><h2>Aujourd'hui</h2>
    ${a ? `<p class="ko-txt">Absent au cours de ${esc(a.heure)} (${esc(a.parNom || "")})</p>` : ""}
    ${r ? `<p>En retard au cours de ${esc(r.heure)} (${esc(r.parNom || "")})</p>` : ""}
    ${p ? `<p>Arrivé en retard au portail à ${esc(p)}</p>` : ""}
    ${a ? boutonParent(f, messageAbsence(f, a)) : ""}</div>`;
}
const messageAbsence = (f, a) => `Bonjour ${f.parent || ""}, ici la vie scolaire de Racine School. ${f.prenom} (${f.classe}) n'est pas en classe ce ${jourFr(a.date || today())} (appel de ${a.heure}). Merci de nous indiquer la raison de cette absence. Bonne journée.`;
const boutonParent = (f, texte, label = "Prévenir le parent sur WhatsApp") => fictif(f)
  ? `<p class="small muted">WhatsApp désactivé pour les élèves fictifs. Message prévu : « ${esc(texte)} »</p>`
  : `<a class="btn hi-btn small" target="_blank" rel="noopener" href="${lienWa(f.telParent, texte)}">${label}</a>`;

// ---------- Export pour Excel (fichier CSV que Excel ouvre directement)
function exporterEleves(ctx, classe) {
  const list = ctx.eleves.filter((f) => !classe || f.cid === classe);
  const col = ["Nom", "Prénom", "Classe", "Sexe", "Date de naissance", "Téléphone", "WhatsApp", "Parent", "Téléphone du parent", "Inscrit le", "Reste à payer (FCFA)"];
  const cell = (x) => `"${String(x ?? "").replace(/"/g, '""')}"`;
  const lignes = list.map((f) => [f.nom, f.prenom, f.classe, f.sexe === "F" ? "F" : f.sexe === "G" ? "M" : "", dateFr(f.naissance), f.tel, f.whatsapp, f.parent, f.telParent, dateFr(f.inscritLe), retard(ctx.cfg, f, ctx.pay[f.id]).montant]);
  const csv = "﻿" + [col, ...lignes].map((l) => l.map(cell).join(";")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = `racine-school-eleves${classe ? "-" + ((classeById(ctx.cfg, classe) || {}).nom || classe).replace(/\s+/g, "-") : ""}-${today()}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
}

// ---------- Annonces et calendrier de l'école
function annoncesPour(list) {
  if (S.role === "eleve") return list.filter((a) => ["tous", "eleves"].includes(a.cible) || (S.fiche && a.cible === S.fiche.classeId));
  if (S.role === "parent") return list.filter((a) => ["tous", "parents"].includes(a.cible) || (S.enfantsCids || []).includes(a.cible));
  return list;
}
const cibleNom = (cfg, c) => CIBLES[c] || ((classeById(cfg, c) || {}).nom ? `Classe de ${classeById(cfg, c).nom}` : c);
function ligneAnnonce(cfg, a, { gerer = false, lec = null } = {}) {
  const texte = `📢 Racine School : ${a.titre}${a.date ? ` (${jourFr(a.date)})` : ""}. ${a.texte || ""}`;
  const moi = lec && lec.moi, present = moi && moi.present;
  return `<div class="card annonce"><div class="row"><b>${esc(a.titre)}</b>${gerer ? `<button class="btn alt small rma" data-id="${esc(a.id)}" aria-label="Supprimer">✕</button>` : ""}</div>
    ${a.date ? `<p class="small"><span class="badge ok">🗓️ ${jourFr(a.date)}</span></p>` : ""}${a.texte ? `<p>${esc(a.texte)}</p>` : ""}
    ${a.audio ? `<audio controls preload="none" src="${esc(a.audio)}"></audio>` : ""}
    <p class="small muted">${esc(cibleNom(cfg, a.cible))} · ${esc(a.parNom || "La direction")} · publié le ${dateFr(a.le)}</p>
    ${gerer && lec ? `<p class="small">👁️ Lu par <b>${lec.lus}</b> personne${lec.lus > 1 ? "s" : ""}${a.presence ? ` · ✋ <b>${lec.presents}</b> seront présents` : ""}</p>` : ""}
    ${!gerer && a.presence ? `<button class="btn ${present ? "" : "alt "}small presence" data-id="${esc(a.id)}">${present ? "✓ Je serai présent" : "✋ Je serai présent"}</button>` : ""}
    ${gerer ? `<a class="small" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(texte)}">Partager dans un groupe WhatsApp</a>` : ""}</div>`;
}
async function vueAnnonces(ctx) {
  const { cfg } = ctx, dir = S.role === "directeur", list = annoncesPour(ctx.annonces), moi = Ecole.myId();
  const avenir = list.filter((a) => a.date && a.date >= today()).sort((a, b) => a.date.localeCompare(b.date));
  // accusés de lecture : chacun marque ce qu'il a vu ; la direction voit les compteurs
  const lectures = dir ? await Ecole.liste("lectures").catch(() => []) : await Ecole.liste("lectures", "par", moi).catch(() => []);
  for (const a of list) if (!lectures.some((l) => l.annonce === a.id && l.par === moi)) Ecole.ecrire("lectures", `${a.id}_${moi}`, { annonce: a.id, par: moi, le: today(), present: false }).catch(() => {});
  const lec = (a) => { const l = lectures.filter((x) => x.annonce === a.id); return { lus: l.length, presents: l.filter((x) => x.present).length, moi: l.find((x) => x.par === moi) }; };
  return `${dir ? `<div class="card"><h2>Publier une annonce</h2>
      <input class="field" id="atitre" maxlength="80" placeholder="Titre (ex. : Réunion des parents)">
      <textarea class="field" id="atexte" rows="3" maxlength="500" placeholder="Détails"></textarea>
      <label class="small">Pour<select class="field" id="acible">${Object.entries(CIBLES).map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}
        <optgroup label="Une classe">${cfg.classes.map((c) => `<option value="${esc(c.id)}">${esc(c.nom)}</option>`).join("")}</optgroup></select></label>
      <label class="small">Date de l'événement (facultatif, l'annonce entre alors au calendrier)<input class="field" type="date" id="adate"></label>
      <label class="row small"><input type="checkbox" id="apres"> Demander qui sera présent (réunion, sortie…)</label>
      ${window.MediaRecorder ? `<button class="btn alt small" id="avoc" type="button">🎙️ Enregistrer un message vocal (1 min au plus)</button><span id="avocmsg" class="small muted"></span>` : ""}
      <button class="btn" id="apub">Publier</button><p id="amsg" class="small"></p></div>${await sondagesCarte(ctx)}` : await sondagesCarte(ctx)}
    <div class="card"><h2>🗓️ Calendrier de l'école</h2>${avenir.map((a) => `<div class="row small cal"><span><b>${esc(a.titre)}</b><br><span class="muted">${esc(cibleNom(cfg, a.cible))}</span></span><span class="badge ok">${new Date(a.date + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span></div>`).join("") || `<p class="small muted">Aucun événement à venir.</p>`}</div>
    ${"Notification" in window && Notification.permission === "default" ? `<button class="btn alt small" id="notif-on">🔔 Recevoir une notification quand une annonce arrive</button>` : ""}
    <h2>Annonces</h2>${list.map((a) => ligneAnnonce(cfg, a, { gerer: dir, lec: lec(a) })).join("") || `<p class="muted">Aucune annonce pour l'instant.</p>`}`;
}
// ---------- Annuaire de l'équipe ; la direction y retire les accès
function vueEquipe(ctx) {
  const dir = S.role === "directeur", moi = Ecole.myId();
  const ordre = ["directeur", "prof", "surveillant", "personnel"];
  const list = ctx.annuaire.slice().sort((a, b) => ordre.indexOf(a.role) - ordre.indexOf(b.role) || String(a.nom).localeCompare(String(b.nom)));
  const contact = (x) => !x.tel ? `<span class="small muted">pas de numéro</span>` : fictif(x) ? `<span class="small muted">${esc(x.tel)} (fictif)</span>`
    : `<span class="row" style="gap:6px"><a class="btn alt small" href="tel:${telLien(x.tel)}">📞</a><a class="btn alt small" target="_blank" rel="noopener" href="https://wa.me/${telLien(x.tel)}">WhatsApp</a></span>`;
  return `<div class="card"><h2>${dir ? "Équipe de l'école" : "Annuaire de l'équipe"} (${list.length})</h2>
      ${list.map((x) => `<div class="lib eleve"><span class="av">${esc(initiales({ prenom: String(x.nom).replace(/^(M\.|Mme)\s*/, ""), nom: String(x.nom).split(" ").pop() }))}</span>
        <span class="grow"><b>${esc(x.nom)}</b>${x.id === moi ? " (toi)" : ""}<br><span class="small muted">${esc(x.poste || POSTES[x.role] || "")}</span></span>
        ${contact(x)}${dir && x.id !== moi ? `<button class="btn alt small retirer" data-id="${esc(x.id)}" aria-label="Retirer l'accès de ${esc(x.nom)}">✕</button>` : ""}</div>`).join("") || `<p class="muted">Personne pour l'instant : chaque membre apparaît ici après avoir entré sa clé d'entrée.</p>`}</div>
    ${dir ? `<div class="card"><h2>Ajouter quelqu'un</h2><p class="small muted">Chaque profil a sa clé d'entrée, dans le fichier remis à l'école : PROF pour les professeurs, SURV pour les surveillants, PERS pour le secrétariat et la caisse. La personne choisit son profil au premier lancement de l'appli et entre la clé une seule fois. Les parents, eux, entrent le code inscrit sur la carte d'élève de leur enfant.</p>
      <p class="small muted">✕ retire une personne de l'équipe. Pour lui fermer définitivement l'accès, il faudra aussi changer la clé de son profil.</p></div>` : ""}`;
}

// ---------- Appel en classe (professeur) et cours du jour
function vueAppel(ctx, cid) {
  const { cfg, eleves } = ctx, mine = mesClassesProf(cfg);
  if (!mine.length) return `<div class="card"><p class="muted">Choisis d'abord tes classes dans l'onglet « Mes classes ».</p></div>`;
  const c = classeById(cfg, cid) || mine[0], l = eleves.filter((f) => f.cid === c.id);
  const deja = ctx.appels.find((a) => a.cid === c.id && a.par === Ecole.myId());
  const etat = (id) => (deja && (deja.absents || []).includes(id) ? "A" : deja && (deja.retards || []).includes(id) ? "R" : "P");
  return `<div class="card"><div class="row"><select class="field" id="acl">${mine.map((x) => `<option value="${esc(x.id)}"${x.id === c.id ? " selected" : ""}>${esc(x.nom)}</option>`).join("")}</select></div>
      <p class="small muted">${jourFr(today())} · ${l.length} élève${l.length > 1 ? "s" : ""}. Touche un élève : présent → absent → en retard.</p>
      ${deja ? `<p class="small msg-ok">Appel déjà fait à ${esc(deja.heure)} : tu peux le corriger.</p>` : ""}
      <div id="appel">${l.map((f) => `<button class="appel-l" data-id="${esc(f.id)}" data-e="${etat(f.id)}">${avatar(f)}<span class="grow">${esc(nomComplet(f))}</span><span class="etat"></span></button>`).join("") || `<p class="muted">Aucun élève inscrit dans cette classe.</p>`}</div>
      <p class="small" id="acompte"></p></div>
    <div class="card"><h2>Ce qui a été fait en cours</h2><p class="small muted">Les élèves le retrouvent sur leur accueil avec les quiz de révision qui vont avec.</p>
      <label class="small">Matière${matieresDe(c.level)}</label>
      <input class="field" id="atitre" maxlength="100" placeholder="Ex. : Théorème de Pythagore, exercices 1 à 3">
    </div>
    <button class="btn" id="asave"${l.length ? "" : " disabled"}>Envoyer l'appel</button><p id="amsg" class="small"></p>`;
}

// ---------- Vie scolaire du jour (surveillant)
function vueAujourdhui(ctx) {
  const { cfg, eleves } = ctx, b = bilanDuJour(ctx);
  S.prevenus = S.prevenus && S.prevenus.jour === today() ? S.prevenus : { jour: today(), ids: [] };
  const sans = cfg.classes.filter((c) => eleves.some((f) => f.cid === c.id) && !ctx.appels.some((a) => a.cid === c.id));
  const ligne = (f, a, quoi) => `<div class="lib eleve">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)} · ${quoi}</span></span>
    ${S.prevenus.ids.includes(f.id) ? `<span class="badge ok">Prévenu</span>` : fictif(f) ? `<button class="btn alt small prev" data-id="${esc(f.id)}">Prévenir</button>`
      : `<a class="btn alt small prev" data-id="${esc(f.id)}" target="_blank" rel="noopener" href="${lienWa(f.telParent, messageAbsence(f, a))}">Prévenir</a>`}</div>`;
  const abs = [...b.abs.entries()].map(([id, a]) => [eleveDe(ctx, id), a]).filter(([f]) => f).sort((x, y) => x[0].classe.localeCompare(y[0].classe, "fr", { numeric: true }));
  return `<div class="kpis">
      <div class="card kpi"><span class="small muted">Absents</span><b class="count ko-txt">${b.abs.size}</b><span class="small muted">${S.prevenus.ids.length} parents prévenus</span></div>
      <a class="card kpi" href="#ecole/portail"><span class="small muted">Retards</span><b class="count">${b.ret.size + b.portail.length}</b><span class="small muted">${b.portail.length} au portail · ${b.ret.size} en classe</span></a></div>
    <div class="card"><h2>Absents du jour (${abs.length})</h2><p class="small muted">Relevés par les professeurs pendant l'appel. « Prévenir » ouvre WhatsApp avec le message prêt.</p>
      ${abs.map(([f, a]) => ligne(f, a, `cours de ${esc(a.heure)}, ${esc(a.parNom || "")}`)).join("") || `<p class="muted">Aucun absent signalé pour l'instant.</p>`}</div>
    <div class="card"><h2>Retards au portail (${b.portail.length})</h2>${b.portail.map(([id, h]) => { const f = eleveDe(ctx, id); return f ? `<a class="lib eleve" href="#ecole/eleve/${encodeURIComponent(id)}">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)}</span></span><b>${esc(h)}</b></a>` : ""; }).join("") || `<p class="small muted">Aucun retard noté au portail.</p>`}
      <a class="btn alt small" href="#ecole/portail">Noter un retard au portail</a></div>
    ${sans.length ? `<div class="card"><h2>Classes sans appel (${sans.length})</h2><p class="small">${sans.map((c) => esc(c.nom)).join(" · ")}</p></div>` : ""}
    ${!eleves.length ? `<p class="muted">Aucun élève inscrit pour l'instant. Les élèves apparaissent dès qu'ils remplissent leur fiche dans l'appli.</p>` : ""}`;
}

// ---------- Portail : scanner la carte d'élève ou chercher le nom, l'heure d'arrivée est notée
function vuePortail(ctx) {
  const b = bilanDuJour(ctx), scan = "BarcodeDetector" in window && navigator.mediaDevices;
  return `<div class="card"><h2>Noter un retard</h2>
      ${scan ? `<button class="btn" id="scan">📷 Scanner la carte d'élève</button><video id="cam" playsinline muted hidden></video>` : `<p class="small muted">Le scan des cartes n'est pas pris en charge par ce téléphone : cherche l'élève par son nom.</p>`}
      <p id="pmsg" class="small" aria-live="polite"></p>
      <input class="field" id="pq" placeholder="Ou cherche un élève…" autocomplete="off"><div id="pres"></div></div>
    <div class="card"><h2>Retards du jour (${b.portail.length})</h2>${b.portail.map(([id, h]) => { const f = eleveDe(ctx, id); return f ? `<div class="lib eleve">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)}</span></span><b>${esc(h)}</b><button class="btn alt small prm" data-id="${esc(id)}" aria-label="Retirer">✕</button></div>` : ""; }).join("") || `<p class="small muted">Aucun retard pour l'instant.</p>`}</div>`;
}
let camStop = null;
window.addEventListener("hashchange", () => { if (camStop) camStop(); });

// ---------- Caisse (personnel) : encaissements du jour et recherche d'un élève
function vueCaisse(ctx) {
  const { eleves, pay } = ctx;
  const jour = eleves.flatMap((f) => Object.entries(pay[f.id] || {}).filter(([, x]) => x && x.le === today()).map(([m, x]) => ({ f, m, x })));
  const total = jour.reduce((n, j) => n + (j.x.montant || 0), 0);
  return `<div class="card"><h2>Encaisser un paiement</h2><input class="field" id="cq" placeholder="Nom de l'élève…" autocomplete="off"><div id="cres"></div></div>
    <div class="card"><div class="row"><h2>Encaissé aujourd'hui</h2><b class="ok-txt">${fcfa(total)}</b></div>
      ${jour.map(({ f, m, x }) => `<a class="lib eleve" href="#ecole/recu/${encodeURIComponent(f.id)}/${m}">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)} · ${moisNom(m)} · reçu ${esc(x.recu || "")}</span></span><b class="small">${fcfa(x.montant || 0)}</b></a>`).join("") || `<p class="small muted">Aucun paiement aujourd'hui.</p>`}
      <a class="btn alt small" href="#ecole/cloture">🔒 Clôture de caisse du jour</a></div>
    <div class="btns"><a class="btn alt" href="#ecole/paiements">Voir les retards de paiement</a><a class="btn alt" href="#ecole/eleves">Listes, certificats et export Excel</a></div>
    ${!eleves.length ? `<p class="muted">Aucun élève inscrit pour l'instant. Les élèves apparaissent dès qu'ils remplissent leur fiche dans l'appli.</p>` : ""}`;
}

// ---------- Reçu et certificat : pages imprimables au nom de l'école
const enteteDoc = (cfg) => `<div class="doc-tete"><img src="icons/logo.svg" alt=""><div><b>RACINE SCHOOL</b><br><span class="small">L'Excellence et la Réussite</span><br><span class="small muted">Année scolaire ${esc(cfg.annee)}</span></div></div>`;
async function vueRecu(ctx, id, mois) {
  let f = eleveDe(ctx, id), p = (ctx.pay[id] || {})[mois];
  if (S.role === "parent") { const e = await Ecole.enfant(id).catch(() => null); f = e && e.fiche; p = e && e.pay[mois]; }
  if (!f || !p) return `<div class="card"><p>Reçu introuvable.</p></div>`;
  const montant = p.montant || montantDu(ctx.cfg, f, mois), objet = mois === "inscription" ? "Frais d'inscription" : `Scolarité de ${moisNom(mois)}`;
  const texte = `Racine School : reçu n° ${p.recu} du ${dateFr(p.le)}. ${objet} de ${f.prenom} ${f.nom} (${f.classe}) : ${fcfa(montant)} reçus. Merci.`;
  return `<a class="small noprint" href="${S.role === "parent" ? "#ecole" : `#ecole/eleve/${encodeURIComponent(id)}`}">← Retour</a>
    <div class="card doc">${enteteDoc(ctx.cfg)}<h2 class="doc-titre">Reçu de paiement n° ${esc(p.recu || "—")}</h2>
      <div class="row small"><span>Date</span><b>${dateFr(p.le)}</b></div>
      <div class="row small"><span>Élève</span><b>${esc(nomComplet(f))}</b></div>
      <div class="row small"><span>Classe</span><b>${esc(f.classe)}</b></div>
      <div class="row small"><span>Objet</span><b>${objet}</b></div>
      <div class="row"><span>Montant reçu</span><b class="count">${fcfa(montant)}</b></div>
      <p class="small muted">Encaissé par ${esc(p.par || "la caisse")}. Ce reçu est enregistré dans l'appli de l'école.</p></div>
    <div class="btns noprint"><button class="btn" onclick="print()">🖨️ Imprimer</button>${S.role !== "parent" ? boutonParent(f, texte, "Envoyer le reçu au parent sur WhatsApp") : ""}</div>`;
}
function vueCertificat(ctx, id) {
  const f = eleveDe(ctx, id), cfg = ctx.cfg;
  if (!f) return `<div class="card"><p>Élève introuvable.</p></div>`;
  const ne = f.sexe === "F" ? "née" : "né", ins = f.sexe === "F" ? "inscrite" : "inscrit";
  return `<a class="small noprint" href="#ecole/eleve/${encodeURIComponent(id)}">← ${esc(nomComplet(f))}</a>
    <p class="small muted noprint">Tu peux corriger le texte en le touchant avant d'imprimer.</p>
    <div class="card doc" contenteditable="true" spellcheck="false">${enteteDoc(cfg)}<h2 class="doc-titre">Certificat de scolarité</h2>
      <p>Je soussigné(e), Directeur de l'établissement privé Racine School, certifie que l'élève <b>${esc(nomComplet(f).toUpperCase())}</b>, ${ne} le ${dateFr(f.naissance)}, est régulièrement ${ins} dans notre établissement en classe de <b>${esc(f.classe)}</b> pour l'année scolaire ${esc(cfg.annee)}.</p>
      <p>En foi de quoi, le présent certificat lui est délivré pour servir et valoir ce que de droit.</p>
      <p style="text-align:right">Fait à …………………, le ${dateFr(today())}</p>
      <p style="text-align:right"><b>Le Directeur</b><br><br><br></p></div>
    <div class="btns noprint"><button class="btn" onclick="print()">🖨️ Imprimer</button></div>`;
}

// ---------- Quiz en classe (professeur) : au tableau, ou sur les téléphones avec classement en direct
function vueQuiz(ctx) {
  const { cfg } = ctx, mine = mesClassesProf(cfg), classes = mine.length ? mine : cfg.classes, c = classes[0];
  return `<div class="card noprint"><h2>Quiz en classe</h2><p class="small muted">10 questions tirées des QCM corrigés de l'appli, dans la matière de ton choix.</p>
      <label class="small">Classe<select class="field" id="qcl">${classes.map((x) => `<option value="${esc(x.id)}">${esc(x.nom)}</option>`).join("")}</select></label>
      <label class="small">Matière<span id="qmat">${matieresQuiz(c && c.level)}</span></label>
      <button class="btn" id="qtab">Projeter au tableau</button>
      <button class="btn alt" id="qtel">Lancer sur les téléphones des élèves</button>
      <div class="row"><button class="btn alt" id="qprint">🖨️ Imprimer une interrogation et son corrigé</button><select class="field" id="qnb" style="max-width:90px" aria-label="Nombre de questions">${[5, 10, 15, 20].map((n) => `<option${n === 10 ? " selected" : ""}>${n}</option>`).join("")}</select></div></div><div id="qzone"></div>`;
}
const matieresQuiz = (level) => `<select class="field" id="qsid">${subjectsOf(level || "6e").filter((s) => !/annales/.test(s.id) && DATA.questions.some((q) => q.s === s.id)).map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select>`;

// ---------- Espace parent : un ou plusieurs enfants reliés par le code de leur carte
async function vueParent(ctx) {
  const ids = S.enfants || [], ajout = `<div class="card"><h2>${ids.length ? "Ajouter un enfant" : "Relier mon enfant"}</h2>
      <p class="small muted">Entrez le code inscrit sur la carte d'élève de votre enfant (dans son appli : Accueil, puis « Ma carte d'élève »).</p>
      <input class="code" id="pcode" placeholder="Code à 8 caractères" autocomplete="off" maxlength="9">
      <button class="btn" id="plier">Valider</button><p id="pmsg" class="small"></p>
</div>`;
  if (!ids.length) return ajout + `<button class="btn alt" id="quit">Changer de profil sur ce téléphone</button>`;
  const id = ids.includes(S.enfantActif) ? S.enfantActif : ids[0];
  const tous = await Promise.all(ids.map((x) => Ecole.enfant(x).catch(() => null)));
  S.enfantsCids = tous.filter(Boolean).map((e) => cidDe(ctx.cfg, e.fiche)); store.save();
  const e = tous[ids.indexOf(id)];
  if (!e) return `<div class="card"><p>La fiche de cet enfant est introuvable.</p></div>${ajout}`;
  const f = rattacher(ctx.cfg, [e.fiche])[0], r = retard(ctx.cfg, f, e.pay), st = f.stats || {};
  const [devoirs, seances, notesEnf] = await Promise.all([Ecole.devoirs(f.cid).catch(() => []), Ecole.liste("seances", "cid", f.cid).catch(() => []), Ecole.releve(id, f.cid).catch(() => [])]);
  const avenir = devoirs.filter((d) => d.date >= today()).slice(0, 5);
  const vus = seances.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  return `${ids.length > 1 ? `<div class="row onglets">${tous.map((x, i) => x ? `<button class="btn alt small enf${ids[i] === id ? " on" : ""}" data-id="${esc(ids[i])}">${esc(x.fiche.prenom)}</button>` : "").join("")}</div>` : ""}
    <div class="card" style="align-items:center;text-align:center">${avatar(f, "av big")}<h2>${esc(nomComplet(f))}</h2><p class="muted">${esc(f.classe)} · Racine School</p></div>
    <div class="card"><div class="row"><h2>Scolarité ${esc(ctx.cfg.annee)}</h2>${badgePay(r)}</div>
      ${moisEchus(ctx.cfg).map((m) => { const p = e.pay[m]; return `<div class="row small mois"><span>${moisNom(m)} · ${fcfa(montantDu(ctx.cfg, f, m))}</span>${p ? (p.recu ? `<a href="#ecole/recu/${encodeURIComponent(id)}/${m}">✓ Payé · reçu</a>` : `<span class="ok-txt">✓ Payé</span>`) : `<span class="ko-txt">À régler</span>`}</div>`; }).join("")}
      ${r.mois.length ? `<p class="small">Reste à régler : <b class="ko-txt">${fcfa(r.montant)}</b>, à la caisse de l'école.</p>` : ""}</div>
    ${(() => { const b = moyennesEleve(ctx.cfg, notesEnf.filter((x) => x.trimestre === "1"), id); return `<div class="card"><div class="row"><h2>Notes du 1er trimestre</h2><b class="count">${n2(b.gen)}</b></div>
      ${b.mats.map((m) => `<div class="row small"><span>${esc(m.matiere)}</span><b>${n2(m.moy)}</b></div>`).join("") || `<p class="small muted">Pas encore de notes.</p>`}
      <a class="btn alt small" href="#ecole/bulletin/${encodeURIComponent(id)}/1">📑 Voir le bulletin</a></div>`; })()}
    ${await assiduiteCarte(id)}
    <div class="card"><h2>Révisions dans l'appli</h2>
      <div class="row"><div><p class="small muted">Réponses</p><p class="count">${st.rep || 0}</p></div><div><p class="small muted">Réussite</p><p class="count">${reussite(f) ?? 0} %</p></div><div><p class="small muted">Jours actifs (7 j)</p><p class="count">${st.jours7 || 0}</p></div></div>
      <p class="small muted">Dernière révision : ${st.derniere ? dateFr(st.derniere) : "jamais"}${st.moy !== null && st.moy !== undefined ? ` · moyenne aux quiz : ${String(st.moy).replace(".", ",")} / 20` : ""}</p>
      ${!st.jours7 ? `<p class="small">💡 Encouragez ${esc(f.prenom)} à faire ses 3 missions du jour : environ 20 minutes.</p>` : ""}</div>
    <div class="card"><h2>Vu en classe</h2>${vus.map((s) => `<div class="row small"><span><b>${esc(s.matiere || "")}</b> : ${esc(s.titre)}</span><span class="muted">${new Date(s.date + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span></div>`).join("") || `<p class="small muted">Rien pour l'instant.</p>`}</div>
    <div class="card"><h2>Devoirs à venir</h2>${avenir.map((d) => `<div class="row small"><span><b>${esc(d.type)}</b> · ${esc(d.sid ? subjName(d.sid) : d.nom || "")}${d.note ? `<br><span class="muted">${esc(d.note)}</span>` : ""}</span><span class="muted">${jourFr(d.date)}</span></div>`).join("") || `<p class="small muted">Aucun devoir annoncé.</p>`}</div>
    <a class="btn alt" href="#ecole/annonces">📢 Annonces et calendrier de l'école</a>
    ${ajout}<button class="btn alt" id="quit">Changer de profil sur ce téléphone</button>`;
}

// ---------- Côté élève : carte d'élève, cours du jour et annonces sur l'accueil
async function viewCarte() {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  const f = S.fiche, cfg = await Ecole.config().catch(() => ECOLE_DEFAUT), id = Ecole.myId();
  const code = f.codeParent || "";
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Ma carte d'élève</h1>
    <div class="carte">${enteteDoc(cfg)}
      <div class="carte-corps">${avatar(f, "av big")}<div><b>${esc(nomComplet(f))}</b><br>${esc(f.classe)}<br><span class="small">${f.naissance ? `${f.sexe === "F" ? "Née" : "Né"} le ${dateFr(f.naissance)}` : ""}</span></div></div>
      <div class="qr">${qrSvg("RACINE:" + id)}</div><p class="small" style="text-align:center">À montrer au portail en cas de retard</p></div>
    <div class="card"><h2>Code parent</h2><p class="count" style="letter-spacing:.15em">${esc(code.replace(/^(.{4})/, "$1 "))}</p>
      <p class="small muted">Donne ce code à tes parents : avec lui, ils suivent dans l'appli ta scolarité, tes révisions et les annonces de l'école.</p>
      ${code ? `<a class="btn alt" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`Bonjour, voici mon code pour l'espace parent de l'appli Racine School : ${code}. Ouvre ${location.href.split("#")[0]}, choisis « Parent » et entre ce code.`)}">Envoyer le code à mes parents sur WhatsApp</a>` : ""}</div>`;
}
async function remplirAccueilEleve() {
  const el = document.getElementById("ecole-accueil");
  if (!el || S.role !== "eleve" || !S.fiche) return;
  verifierNouveautes().catch(() => {});
  if (S.dirReel) { el.insertAdjacentHTML("beforebegin", `<div class="row noprint voir">${voirComme().replace(/^<div[^>]*>|<\/div>$/g, "")}</div>`); lierVoir(); }
  const [annonces, seances, edt, defi] = await Promise.all([Ecole.liste("annonces").catch(() => []), Ecole.liste("seances", "cid", S.fiche.classeId).catch(() => []), edtDuJour().catch(() => ""), defiCarteEleve().catch(() => "")]);
  const recent = (d) => (new Date(today()) - new Date(d)) / 864e5 <= 3;
  const vus = seances.filter((s) => recent(s.date)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const ann = annoncesPour(annonces).sort((a, b) => String(b.le).localeCompare(String(a.le))).slice(0, 2);
  if (!document.body.contains(el)) return;
  el.innerHTML = `<div class="grid rub espace">${[["rendre", "📤", "Rendre un devoir"], ["assiduite", "📅", "Absences"], ["badges", "🏅", "Mes badges"], ["clubs", "🎭", "Clubs"], ["orientation", "🧭", "Orientation"], ["documents", "📂", "Documents"]].map(([h, i, t]) => `<a class="subj tile" href="#${h}"><span class="ico">${i}</span><b>${t}</b></a>`).join("")}</div>${edt}${defi}${vus.length ? `<div class="card"><h2>📘 Vu en classe</h2>${vus.map((s) => `<div class="row small"><span><b>${esc(s.matiere || "")}</b> : ${esc(s.titre)}<br><span class="muted">${s.date === today() ? "aujourd'hui" : jourFr(s.date)}</span></span>${s.sid ? `<a class="btn alt small" href="#quiz/${s.sid}">Réviser</a>` : ""}</div>`).join("")}<a class="small" href="#cahier">Tout le cahier de textes ›</a></div>` : ""}
    ${ann.length ? `<div class="card"><h2>📢 Annonces de l'école</h2>${ann.map((a) => `<p class="small"><b>${esc(a.titre)}</b>${a.date ? ` · ${jourFr(a.date)}` : ""}<br><span class="muted">${esc(a.texte || "")}</span></p>`).join("")}</div>` : ""}`;
}

// ---------- Actions des pages de la vie scolaire
Object.assign(bindEcole, {
  annonces: (ctx) => {
    $view.querySelectorAll(".rma").forEach((b) => b.onclick = async () => { await Ecole.effacer("annonces", b.dataset.id).catch(() => {}); viewEcole(); });
    $view.querySelectorAll(".presence").forEach((b) => b.onclick = async () => {
      const moi = Ecole.myId(), id = `${b.dataset.id}_${moi}`, l = await Ecole.lire("lectures", id).catch(() => null);
      await Ecole.ecrire("lectures", id, { annonce: b.dataset.id, par: moi, le: today(), present: !(l && l.present) }).catch(() => {}); viewEcole();
    });
    const n = document.getElementById("notif-on");
    if (n) n.onclick = () => Notification.requestPermission().then(() => n.remove());
    lierSondages(ctx);
    let audio = "";
    const voc = document.getElementById("avoc");
    if (voc) voc.onclick = async () => {
      const info = document.getElementById("avocmsg");
      if (voc.rec) { voc.rec.stop(); return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true }), rec = new MediaRecorder(stream, { audioBitsPerSecond: 16000 }), bouts = [];
        rec.ondataavailable = (e) => bouts.push(e.data);
        rec.onstop = () => { stream.getTracks().forEach((t) => t.stop()); voc.rec = null; voc.textContent = "🎙️ Refaire le message vocal";
          const r = new FileReader(); r.onload = () => { audio = r.result; info.textContent = " Message vocal prêt ✓"; }; r.readAsDataURL(new Blob(bouts, { type: rec.mimeType })); };
        rec.start(); voc.rec = rec; voc.textContent = "⏹️ Arrêter l'enregistrement"; info.textContent = " Enregistrement…";
        setTimeout(() => voc.rec === rec && rec.stop(), 60000);
      } catch { info.textContent = " Le micro n'est pas accessible."; }
    };
    const pub = document.getElementById("apub");
    if (pub) pub.onclick = async () => {
      const v = (id) => document.getElementById(id).value.trim(), msg = document.getElementById("amsg");
      if (!v("atitre")) { msg.className = "msg-ko small"; msg.textContent = "Écris un titre."; return; }
      pub.disabled = true;
      await Ecole.ecrire("annonces", null, { titre: v("atitre"), texte: v("atexte"), cible: v("acible"), date: v("adate"), presence: document.getElementById("apres").checked, ...(audio ? { audio } : {}), par: Ecole.myId(), parNom: S.staffNom || "La direction", le: today() })
        .then(() => viewEcole()).catch(() => { pub.disabled = false; msg.className = "msg-ko small"; msg.textContent = "La publication n'a pas abouti."; });
    };
  },
  equipe: () => {
    $view.querySelectorAll(".retirer").forEach((b) => b.onclick = async () => {
      if (!confirm("Retirer cette personne de l'équipe ?")) return;
      await Ecole.retirerAcces(b.dataset.id).catch(() => {}); viewEcole();
    });
  },
  appel: (ctx) => {
    const sel = document.getElementById("acl");
    if (!sel) return;
    sel.onchange = () => go("ecole/appel/" + encodeURIComponent(sel.value));
    const c = classeById(ctx.cfg, sel.value), suiv = { P: "A", A: "R", R: "P" };
    const compte = () => { const e = [...$view.querySelectorAll(".appel-l")].map((b) => b.dataset.e);
      document.getElementById("acompte").textContent = `${e.filter((x) => x === "P").length} présents · ${e.filter((x) => x === "A").length} absents · ${e.filter((x) => x === "R").length} en retard`; };
    $view.querySelectorAll(".appel-l").forEach((b) => b.onclick = () => { b.dataset.e = suiv[b.dataset.e]; compte(); });
    compte();
    document.getElementById("asave").onclick = async (ev) => {
      const btn = ev.currentTarget, msg = document.getElementById("amsg"), lst = (e) => [...$view.querySelectorAll(`.appel-l[data-e="${e}"]`)].map((b) => b.dataset.id);
      const me = Ecole.myId(), id = `${today()}_${c.id}_${me}`.replace(/[^\w-]/g, "-"), heure = (ctx.appels.find((a) => a.id === id) || {}).heure || maintenant();
      const sid = document.getElementById("dsid").value, titre = document.getElementById("atitre").value.trim();
      btn.disabled = true;
      try {
        await Ecole.ecrire("appels", id, { cid: c.id, classe: c.nom, date: today(), heure, absents: lst("A"), retards: lst("R"), par: me, parNom: S.staffNom || "" });
        if (titre) await Ecole.ecrire("seances", id, { cid: c.id, classe: c.nom, date: today(), sid, matiere: sid ? subjName(sid) : "Vie scolaire", titre, par: me, parNom: S.staffNom || "" });
        msg.className = "msg-ok small"; msg.textContent = `Appel envoyé : ${lst("A").length} absent(s), ${lst("R").length} retard(s). La vie scolaire les voit tout de suite.${titre ? " Le cours du jour est sur l'accueil des élèves." : ""}`;
      } catch { msg.className = "msg-ko small"; msg.textContent = "L'envoi n'a pas abouti. Vérifie ta connexion."; }
      btn.disabled = false;
    };
  },
  "accueil-surveillant": () => {
    $view.querySelectorAll(".prev").forEach((b) => b.addEventListener("click", () => {
      if (!S.prevenus.ids.includes(b.dataset.id)) S.prevenus.ids.push(b.dataset.id);
      store.save(); setTimeout(viewEcole, 300);
    }));
  },
  "accueil-personnel": (ctx) => chercheEleve(ctx, "cq", "cres", (f) => go("ecole/eleve/" + encodeURIComponent(f.id))),
  "accueil-parent": () => {
    const lier = document.getElementById("plier");
    if (lier) lier.onclick = async () => {
      const msg = document.getElementById("pmsg");
      try {
        const id = await Ecole.lierEnfant(document.getElementById("pcode").value);
        S.enfants = [...new Set([...(S.enfants || []), id])]; S.enfantActif = id; store.save(); viewEcole();
      } catch { msg.className = "msg-ko small"; msg.textContent = "Code introuvable. Vérifiez les lettres et les chiffres sur la carte d'élève."; }
    };
    $view.querySelectorAll(".enf").forEach((b) => b.onclick = () => { S.enfantActif = b.dataset.id; store.save(); viewEcole(); });
  },
  portail: (ctx) => {
    const msg = document.getElementById("pmsg");
    const noter = async (f) => {
      const h = maintenant(), retards = { ...(ctx.portail || {}) };
      if (retards[f.id]) { msg.className = "small"; msg.textContent = `${nomComplet(f)} est déjà noté à ${retards[f.id]}.`; return; }
      retards[f.id] = h; ctx.portail = retards;
      await Ecole.ecrire("portail", today(), { date: today(), retards }).catch(() => {});
      noterAssiduite([f.id], () => "R", f.classe);
      msg.className = "msg-ok small"; msg.textContent = `✓ ${nomComplet(f)} (${f.classe}) : retard noté à ${h}.`;
      if (!camStop) setTimeout(viewEcole, 900);
    };
    chercheEleve(ctx, "pq", "pres", noter);
    $view.querySelectorAll(".prm").forEach((b) => b.onclick = async () => {
      const retards = { ...(ctx.portail || {}) }; delete retards[b.dataset.id];
      await Ecole.ecrire("portail", today(), { date: today(), retards }).catch(() => {}); await noterAssiduite([b.dataset.id], () => "", ""); viewEcole();
    });
    const scan = document.getElementById("scan");
    if (scan) scan.onclick = async () => {
      if (camStop) { camStop(); return viewEcole(); }
      const video = document.getElementById("cam");
      try {
        const det = new BarcodeDetector({ formats: ["qr_code"] });
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream; video.hidden = false; await video.play();
        scan.textContent = "Arrêter le scan";
        let dernier = "", vivant = true;
        camStop = () => { vivant = false; stream.getTracks().forEach((t) => t.stop()); camStop = null; };
        const boucle = async () => {
          if (!vivant) return;
          const r = await det.detect(video).catch(() => []);
          const v = r[0] && r[0].rawValue;
          if (v && v !== dernier) {
            dernier = v; setTimeout(() => { dernier = ""; }, 3000);
            const f = v.startsWith("RACINE:") && eleveDe(ctx, v.slice(7));
            if (f) await noter(f); else { msg.className = "msg-ko small"; msg.textContent = "Cette carte n'est pas une carte d'élève de Racine School."; }
          }
          setTimeout(boucle, 250);
        };
        boucle();
      } catch { msg.className = "msg-ko small"; msg.textContent = "La caméra n'est pas accessible. Autorise-la, ou cherche l'élève par son nom."; }
    };
  },
  quiz: (ctx) => {
    const cl = document.getElementById("qcl"), zone = document.getElementById("qzone");
    const niveau = () => (classeById(ctx.cfg, cl.value) || {}).level;
    cl.onchange = () => { document.getElementById("qmat").innerHTML = matieresQuiz(niveau()); };
    document.getElementById("qtab").onclick = () => {
      const sid = document.getElementById("qsid").value, qs = shuffle(DATA.questions.filter((q) => q.s === sid)).slice(0, 10);
      let i = 0;
      const montre = (rep = false) => {
        if (i >= qs.length) { zone.innerHTML = `<div class="card presente"><h2>Fin du quiz 🎉</h2><p>${qs.length} questions de ${esc(subjName(sid))}.</p><button class="btn alt" id="qre">Recommencer avec d'autres questions</button></div>`; document.getElementById("qre").onclick = () => document.getElementById("qtab").click(); return; }
        const q = qs[i];
        zone.innerHTML = `<div class="card presente"><p class="small muted">${esc(subjName(sid))} · question ${i + 1} / ${qs.length}</p><p class="q">${esc(q.q)}</p>
          <div class="choices">${q.c.map((c, k) => `<div class="choice${rep && k === q.a ? " ok" : ""}"><span class="l">${LETTERS[k]}</span><span>${esc(c)}</span></div>`).join("")}</div>
          ${rep ? `<div class="expl"><b>Réponse ${LETTERS[q.a]}.</b> ${esc(q.e)}</div><button class="btn" id="qsuiv">Question suivante</button>` : `<button class="btn" id="qrep">Montrer la réponse</button>`}</div>`;
        const r = document.getElementById("qrep"), s = document.getElementById("qsuiv");
        if (r) r.onclick = () => montre(true);
        if (s) s.onclick = () => { i++; montre(); };
        zone.scrollIntoView({ behavior: "smooth" });
      };
      montre();
    };
    document.getElementById("qtel").onclick = () => {
      const lv = niveau(), code = Array.from(crypto.getRandomValues(new Uint8Array(5)), (x) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join("");
      const lien = `${location.href.split("#")[0]}#duo/${code}~${encodeURIComponent(lv)}`;
      zone.innerHTML = `<div class="card"><h2>Session ${code} · ${esc((classeById(ctx.cfg, cl.value) || {}).nom || "")}</h2>
        <p class="small muted">Les élèves ouvrent le lien sur leur téléphone (ou entrent le code dans « Session de groupe ») et répondent tous aux mêmes 10 questions. Le classement s'affiche ici en direct.</p>
        <p class="count" style="text-align:center;letter-spacing:.2em">${code}</p>
        <a class="btn alt" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`Quiz en classe sur Racine School : ouvre ce lien et réponds aux 10 questions. Code ${code}. ${lien}`)}">Envoyer le lien au groupe WhatsApp de la classe</a>
        <div id="board"><p class="small muted">${Compte.user ? "En attente des premières réponses…" : "Le classement en direct demande d'être connecté à l'appli en ligne."}</p></div></div>`;
      if (Compte.user && Compte.listenScores) {
        const stop = Compte.listenScores(code, (rows) => {
          const el = document.getElementById("board"); if (!el) return stop();
          rows.sort((a, b) => b.note - a.note);
          el.innerHTML = rows.length ? `${barChart(rows.slice(0, 30).map((r, k) => [`${["🥇", "🥈", "🥉"][k] || k + 1 + "."} ${r.name}`, r.note * 5, pts(r.note) + "/20"]))}<p class="small muted">${rows.length} élève${rows.length > 1 ? "s ont" : " a"} fini.</p>` : `<p class="small muted">En attente des premières réponses…</p>`;
        }, () => {});
      }
    };
  },
  recu: () => {},
  certificat: () => {},
});
// liste filtrée d'élèves sous un champ de recherche ; un appui sur un nom déclenche l'action
function chercheEleve(ctx, champ, zone, action) {
  const q = document.getElementById(champ), out = document.getElementById(zone);
  if (!q) return;
  q.oninput = () => {
    const t = q.value.trim().toLowerCase();
    const l = t.length < 2 ? [] : ctx.eleves.filter((f) => (nomComplet(f) + " " + f.nom + " " + f.classe).toLowerCase().includes(t)).slice(0, 8);
    out.innerHTML = l.map((f) => `<button class="lib eleve pick" data-id="${esc(f.id)}">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)}</span></span></button>`).join("") || (t.length >= 2 ? `<p class="small muted">Aucun élève trouvé.</p>` : "");
    out.querySelectorAll(".pick").forEach((b) => b.onclick = () => { action(eleveDe(ctx, b.dataset.id)); q.value = ""; out.innerHTML = ""; });
  };
}
