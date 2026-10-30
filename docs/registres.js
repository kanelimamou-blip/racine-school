"use strict";
// Registres de l'école : un même écran (formulaire, liste, total, export Excel) pour le cahier de discipline,
// la main courante, le planning de surveillance, les dépenses, la paie, l'inventaire, la cantine et le transport,
// le courrier, la bibliothèque, les tâches, les heures des professeurs et le pointage du personnel.
// Plus : candidats BFEM et BAC, pré-inscriptions, seuils et convocations, placement aux compositions, trésorerie.

const OUI_ROLES = (...r) => r;
const sansId = ({ id, ...r }) => r;
const REG = {
  discipline: { titre: "Cahier de discipline", ico: "⚖️", roles: OUI_ROLES("directeur", "surveillant", "prof"),
    champs: [["eleve", "Élève", "eleve"], ["date", "Date", "date"], ["type", "Faute", "select", ["Bavardage", "Retards répétés", "Insolence", "Bagarre", "Tenue non conforme", "Triche", "Absence injustifiée", "Autre"]],
      ["texte", "Ce qui s'est passé", "textarea"], ["sanction", "Sanction", "select", ["Aucune pour l'instant", "Avertissement oral", "Mot aux parents", "Retenue", "Exclusion temporaire", "Conseil de discipline"]]],
    ligne: (x) => [`${x.eleveNom} · ${x.type}`, `${x.classe || ""} · ${dateFr(x.date)} · ${x.sanction}${x.texte ? " · " + x.texte : ""}`] },
  maincourante: { titre: "Main courante", ico: "📓", roles: OUI_ROLES("directeur", "surveillant"),
    champs: [["date", "Date", "date"], ["heure", "Heure", "time"], ["categorie", "Catégorie", "select", ["Infirmerie", "Objet trouvé", "Incident", "Visite", "Autre"]], ["eleve", "Élève concerné (facultatif)", "eleve"], ["texte", "Description", "textarea"]],
    ligne: (x) => [`${x.categorie}${x.eleveNom ? " · " + x.eleveNom : ""}`, `${dateFr(x.date)} ${x.heure || ""} · ${x.texte || ""}`] },
  planning: { titre: "Planning de surveillance", ico: "🗓️", roles: OUI_ROLES("directeur", "surveillant"),
    champs: [["date", "Date", "date"], ["debut", "De", "time"], ["fin", "À", "time"], ["lieu", "Lieu", "select", ["Portail", "Cour", "Cantine", "Salle d'examen", "Sortie des classes"]], ["personne", "Surveillant", "personne"]],
    ligne: (x) => [`${x.lieu} · ${x.personne}`, `${jourFr(x.date)} · ${x.debut}–${x.fin}`], tri: (a, b) => (a.date + a.debut).localeCompare(b.date + b.debut) },
  depenses: { titre: "Dépenses", ico: "💸", roles: OUI_ROLES("directeur", "personnel"), total: "montant",
    champs: [["date", "Date", "date"], ["libelle", "Libellé", "text"], ["categorie", "Catégorie", "select", ["Fournitures", "Entretien et réparations", "Salaires", "Électricité et eau", "Transport", "Communication", "Autre"]], ["montant", "Montant (FCFA)", "number"], ["fournisseur", "Fournisseur", "text"]],
    ligne: (x) => [`${x.libelle} · ${fcfa(+x.montant || 0)}`, `${dateFr(x.date)} · ${x.categorie}${x.fournisseur ? " · " + x.fournisseur : ""}`] },
  paie: { titre: "Paie du personnel", ico: "🧾", roles: OUI_ROLES("directeur", "personnel"), total: "net",
    champs: [["mois", "Mois", "month"], ["personne", "Employé", "personne"], ["brut", "Salaire (FCFA)", "number"], ["avance", "Avances déjà versées (FCFA)", "number"], ["paye", "Payé le", "date"]],
    avant: (x) => ({ ...x, net: (+x.brut || 0) - (+x.avance || 0) }),
    ligne: (x) => [`${x.personne} · net ${fcfa(+x.net || 0)}`, `${x.mois ? moisNom(x.mois) : ""} · salaire ${fcfa(+x.brut || 0)}${+x.avance ? ` − avances ${fcfa(+x.avance)}` : ""}${x.paye ? ` · payé le ${dateFr(x.paye)}` : " · à payer"}`] },
  inventaire: { titre: "Inventaire", ico: "📦", roles: OUI_ROLES("directeur", "personnel"), statut: ["etat", ["Bon", "À réparer", "Hors service"]],
    champs: [["article", "Article", "text"], ["categorie", "Catégorie", "select", ["Mobilier", "Manuels", "Informatique", "Matériel de labo", "Sport", "Autre"]], ["quantite", "Quantité", "number"], ["etat", "État", "select", ["Bon", "À réparer", "Hors service"]], ["lieu", "Où", "text"]],
    ligne: (x) => [`${x.article} × ${x.quantite || 1}`, `${x.categorie}${x.lieu ? " · " + x.lieu : ""}`] },
  services: { titre: "Cantine et transport", ico: "🚌", roles: OUI_ROLES("directeur", "personnel"), total: "montant",
    champs: [["eleve", "Élève", "eleve"], ["service", "Service", "select", ["Cantine", "Transport scolaire"]], ["formule", "Formule ou trajet", "text"], ["montant", "Montant mensuel (FCFA)", "number"], ["paye", "Payé jusqu'à", "month"]],
    ligne: (x) => [`${x.eleveNom} · ${x.service}`, `${x.classe || ""} · ${x.formule || ""} · ${fcfa(+x.montant || 0)} / mois${x.paye ? ` · payé jusqu'à ${moisNom(x.paye)}` : " · rien payé"}`] },
  courrier: { titre: "Courrier", ico: "✉️", roles: OUI_ROLES("directeur", "personnel"),
    champs: [["date", "Date", "date"], ["sens", "Sens", "select", ["Entrant", "Sortant"]], ["tiers", "Expéditeur ou destinataire", "text"], ["objet", "Objet", "text"], ["ref", "Référence", "text"]],
    ligne: (x) => [`${x.sens === "Entrant" ? "📥" : "📤"} ${x.objet}`, `${dateFr(x.date)} · ${x.tiers}${x.ref ? " · réf. " + x.ref : ""}`] },
  bibliotheque: { titre: "Bibliothèque", ico: "📚", roles: OUI_ROLES("directeur", "personnel", "surveillant"), statut: ["rendu", ["Prêté", "Rendu", "Perdu"]],
    champs: [["livre", "Livre", "text"], ["eleve", "Emprunteur", "eleve"], ["date", "Prêté le", "date"], ["retour", "Retour prévu", "date"], ["rendu", "État", "select", ["Prêté", "Rendu", "Perdu"]]],
    ligne: (x) => [`${x.livre}`, `${x.eleveNom} (${x.classe || ""}) · prêté le ${dateFr(x.date)}${x.rendu === "Prêté" && x.retour && x.retour < today() ? ` · <span class="ko-txt">en retard depuis le ${dateFr(x.retour)}</span>` : x.retour ? ` · retour le ${dateFr(x.retour)}` : ""}`] },
  taches: { titre: "Tâches", ico: "✅", roles: OUI_ROLES("directeur", "personnel", "surveillant", "prof"), statut: ["statut", ["À faire", "En cours", "Fait"]],
    champs: [["titre", "Tâche", "text"], ["personne", "Confiée à", "personne"], ["echeance", "Pour le", "date"], ["statut", "Statut", "select", ["À faire", "En cours", "Fait"]]],
    ligne: (x) => [`${x.titre}`, `${x.personne || "—"}${x.echeance ? ` · pour le ${dateFr(x.echeance)}` : ""}${x.parNom ? ` · demandé par ${x.parNom}` : ""}`] },
  heures: { titre: "Heures effectuées", ico: "⏱️", roles: OUI_ROLES("directeur", "prof"), total: "heures", perso: true,
    champs: [["date", "Date", "date"], ["classe", "Classe", "classe"], ["heures", "Heures", "number"], ["objet", "Objet", "select", ["Cours", "Remplacement", "Cours de soutien", "Surveillance d'examen", "Conseil de classe"]]],
    ligne: (x) => [`${x.heures} h · ${x.objet}`, `${dateFr(x.date)} · ${x.classe || ""} · ${x.parNom || ""}`] },
  pointage: { titre: "Pointage du personnel", ico: "🕗", roles: OUI_ROLES("directeur"), lecture: true, champs: [],
    ligne: (x) => [`${x.nom}`, `${jourFr(x.date)} · arrivé à ${x.arrivee || "—"}${x.depart ? ` · parti à ${x.depart}` : ""}`] },
};
const PAGES_SPECIALES = {
  candidats: { titre: "Candidats BFEM et BAC", ico: "🎓", roles: ["directeur", "personnel"] },
  preinscriptions: { titre: "Pré-inscriptions", ico: "📝", roles: ["directeur", "personnel"] },
  examens: { titre: "Placement aux compositions", ico: "🪑", roles: ["directeur", "surveillant"] },
};
const labelEleve = (f) => `${nomComplet(f)} (${f.classe})`;
const valeurChamp = (x, k) => (x[k] === undefined ? "" : x[k]);

function champHtml(ctx, [k, label, type, opts]) {
  const id = "rg-" + k;
  if (type === "textarea") return `<label class="small">${label}<textarea class="field" id="${id}" rows="2" maxlength="500"></textarea></label>`;
  if (type === "select") return `<label class="small">${label}<select class="field" id="${id}">${opts.map((o) => `<option>${esc(o)}</option>`).join("")}</select></label>`;
  if (type === "eleve") return `<label class="small">${label}<input class="field" id="${id}" list="rg-eleves" autocomplete="off" placeholder="Tape le nom de l'élève"></label>`;
  if (type === "personne") return `<label class="small">${label}<input class="field" id="${id}" list="rg-personnes" autocomplete="off" maxlength="50"></label>`;
  if (type === "classe") return `<label class="small">${label}<select class="field" id="${id}">${(S.role === "prof" ? mesClassesProf(ctx.cfg) : ctx.cfg.classes).map((c) => `<option>${esc(c.nom)}</option>`).join("")}</select></label>`;
  const t = { date: "date", time: "time", number: "number", month: "month" }[type] || "text", v = { date: today(), time: maintenant(), month: ceMois() }[type] || "";
  return `<label class="small">${label}<input class="field" id="${id}" type="${t}" value="${v}"${t === "number" ? ' min="0" inputmode="decimal"' : ' maxlength="120"'}></label>`;
}
const datalists = (ctx) => `<datalist id="rg-eleves">${ctx.eleves.map((f) => `<option value="${esc(labelEleve(f))}">`).join("")}</datalist>
  <datalist id="rg-personnes">${ctx.annuaire.map((x) => `<option value="${esc(x.nom)}">`).join("")}</datalist>`;
const registresDuRole = () => [...Object.entries(REG), ...Object.entries(PAGES_SPECIALES)].filter(([, d]) => d.roles.includes(S.role));

// ---------- Registres : la liste des registres du profil, et le pointage de la personne
async function vueRegistres(ctx) {
  const pt = S.role !== "directeur" ? await Ecole.lire("registres", `pt-${today()}-${Ecole.myId()}`).catch(() => null) : null;
  return `${S.role !== "directeur" ? `<div class="card"><h2>🕗 Mon pointage du jour</h2>${pt ? `<p class="small">Arrivé à <b>${esc(pt.arrivee)}</b>${pt.depart ? `, parti à <b>${esc(pt.depart)}</b>` : ""}.</p>` : `<p class="small muted">Pas encore pointé aujourd'hui.</p>`}
      ${!pt ? `<button class="btn" id="pt-in">Je suis arrivé</button>` : !pt.depart ? `<button class="btn alt" id="pt-out">Je pars</button>` : ""}</div>` : ""}
    <div class="grid rub">${registresDuRole().map(([k, d]) => `<a class="subj tile" href="#ecole/registre/${k}"><span class="ico">${d.ico}</span><b>${d.titre}</b></a>`).join("")}</div>`;
}

// ---------- Un registre
async function vueRegistre(ctx, key) {
  if (PAGES_SPECIALES[key]) return ({ candidats: vueCandidats, preinscriptions: vuePreinscriptions, examens: vueExamens }[key])(ctx);
  const d = REG[key];
  if (!d || !d.roles.includes(S.role)) return `<div class="card"><p>Registre introuvable.</p></div>`;
  let l = await Ecole.liste("registres", "reg", key).catch(() => []);
  if (d.perso && S.role !== "directeur") l = l.filter((x) => x.par === Ecole.myId());
  l.sort(d.tri || ((a, b) => String(b.date || b.mois || b.le || "").localeCompare(String(a.date || a.mois || a.le || ""))));
  const total = d.total ? l.reduce((n, x) => n + (+x[d.total] || 0), 0) : null;
  const ceMoisTot = d.total ? l.filter((x) => String(x.date || x.mois || x.le || "").startsWith(ceMois())).reduce((n, x) => n + (+x[d.total] || 0), 0) : null;
  return `<a class="small" href="#ecole/registres">← Registres</a><h2>${d.ico} ${d.titre}</h2>
    ${d.lecture ? "" : `<details class="card"${l.length ? "" : " open"}><summary><b>➕ Ajouter</b></summary>${d.champs.map((c) => champHtml(ctx, c)).join("")}
      <button class="btn" id="rg-add">Enregistrer</button><p id="rg-msg" class="small"></p></details>${datalists(ctx)}`}
    ${d.total ? `<div class="card"><div class="row"><span>Ce mois-ci</span><b>${d.total === "heures" ? ceMoisTot + " h" : fcfa(ceMoisTot)}</b></div><div class="row small"><span class="muted">Depuis le début</span><b>${d.total === "heures" ? total + " h" : fcfa(total)}</b></div></div>` : ""}
    <div class="card">${l.map((x) => { const [t, s] = d.ligne(x); return `<div class="row small creneau"><span class="grow"><b>${esc(t)}</b><br><span class="muted">${s.includes("<span") ? s : esc(s)}</span></span>
      ${d.statut ? `<select class="field rg-st" data-id="${esc(x.id)}" style="max-width:120px;margin:0">${d.statut[1].map((o) => `<option${o === x[d.statut[0]] ? " selected" : ""}>${o}</option>`).join("")}</select>` : ""}
      <button class="btn alt small rg-rm" data-id="${esc(x.id)}" aria-label="Supprimer">✕</button></div>`; }).join("") || `<p class="small muted">Rien pour l'instant.</p>`}</div>
    ${l.length ? `<button class="btn alt" id="rg-csv">📊 Télécharger pour Excel</button>` : ""}`;
}
function telechargerCsv(nom, entetes, lignes) {
  const cell = (x) => `"${String(x ?? "").replace(/"/g, '""')}"`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + [entetes, ...lignes].map((l) => l.map(cell).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
  a.download = `racine-school-${nom}-${today()}.csv`; document.body.appendChild(a); a.click(); a.remove();
}

// ---------- Candidats aux examens officiels : élèves de 3e et de Terminale, pièces du dossier
const PIECES = ["Extrait de naissance", "Photos d'identité", "Frais d'examen", "Dossier déposé"];
async function vueCandidats(ctx) {
  const dos = Object.fromEntries((await Ecole.liste("registres", "reg", "candidats").catch(() => [])).map((x) => [x.eleveId, x]));
  const l = ctx.eleves.filter((f) => ["3e", "Tle"].includes(niveauOf(f.level)));
  const complet = l.filter((f) => PIECES.every((p) => ((dos[f.id] || {}).pieces || []).includes(p))).length;
  return `<a class="small" href="#ecole/registres">← Registres</a><h2>🎓 Candidats BFEM et BAC</h2>
    <div class="card"><div class="row"><span>${l.length} candidats</span><b>${complet} dossiers complets</b></div><div class="bar"><i style="width:${pct(complet, l.length)}%"></i></div></div>
    ${["3e", "Tle"].map((n) => { const g = l.filter((f) => niveauOf(f.level) === n); return g.length ? `<div class="card"><h2>${n === "3e" ? "BFEM" : "BAC"} (${g.length})</h2>
      ${g.map((f) => `<div class="creneau"><b class="small">${esc(nomComplet(f))}</b> <span class="small muted">${esc(f.classe)}</span><div class="chips">${PIECES.map((p) => `<label class="chip"><input type="checkbox" class="cand" data-id="${esc(f.id)}" value="${esc(p)}"${((dos[f.id] || {}).pieces || []).includes(p) ? " checked" : ""}> ${p}</label>`).join("")}</div></div>`).join("")}</div>` : ""; }).join("")}
    <button class="btn alt" id="cand-csv">📊 Liste des candidats pour Excel</button>`;
}

// ---------- Pré-inscriptions : déposées depuis le premier écran de l'appli, traitées par l'école
async function vuePreinscriptions(ctx) {
  const l = (await Ecole.liste("preinscriptions").catch(() => [])).sort((a, b) => String(b.le).localeCompare(String(a.le)));
  return `<a class="small" href="#ecole/registres">← Registres</a><h2>📝 Pré-inscriptions (${l.length})</h2>
    <p class="small muted">Les familles les déposent depuis le premier écran de l'appli (« Pré-inscrire un enfant »).</p>
    ${l.map((x) => `<div class="card"><div class="row"><b>${esc(x.prenom)} ${esc(x.nom)}</b><select class="field pre-st" data-id="${esc(x.id)}" style="max-width:150px;margin:0">${["Nouvelle", "Acceptée", "Liste d'attente", "Refusée"].map((o) => `<option${o === x.statut ? " selected" : ""}>${o}</option>`).join("")}</select></div>
      <p class="small">Classe souhaitée : <b>${esc(x.classe)}</b>${x.ecole ? ` · vient de ${esc(x.ecole)}` : ""}<br>Parent : ${esc(x.parent)} · ${esc(x.tel)}</p><p class="small muted">Déposée le ${dateFr(x.le)}</p>
      ${fictif(x) ? "" : `<a class="btn alt small" target="_blank" rel="noopener" href="${lienWa(x.tel, `Bonjour ${x.parent}, ici Racine School. Nous avons bien reçu la pré-inscription de ${x.prenom} en ${x.classe}. `)}">Répondre sur WhatsApp</a>`}</div>`).join("") || `<p class="muted">Aucune pré-inscription pour l'instant.</p>`}`;
}
function viewPreinscription() {
  $view.innerHTML = `<a class="small" href="#" id="pre-back">← Retour</a><h1>Pré-inscrire un enfant</h1><p class="muted">Pour un nouvel élève. L'école vous recontacte sur WhatsApp.</p>
    <div class="card">${[["prenom", "Prénom de l'enfant *"], ["nom", "Nom *"], ["naissance", "Date de naissance", "date"], ["ecole", "École actuelle"], ["parent", "Nom du parent *"], ["tel", "Téléphone (WhatsApp) *", "tel"]]
      .map(([k, l, t]) => `<label class="small">${l}<input class="field" id="pi-${k}" type="${t || "text"}" maxlength="50"></label>`).join("")}
      <label class="small">Classe souhaitée *<select class="field" id="pi-classe">${DATA.classes.map((c) => `<option>${c}</option>`).join("")}</select></label>
      <button class="btn" id="pi-ok">Envoyer la pré-inscription</button><p id="pi-msg" class="small"></p></div>`;
  document.getElementById("pre-back").onclick = (e) => { e.preventDefault(); viewRole(); };
  document.getElementById("pi-ok").onclick = async () => {
    const v = (k) => document.getElementById("pi-" + k).value.trim(), msg = document.getElementById("pi-msg");
    if (!v("prenom") || !v("nom") || !v("parent") || !v("tel")) { msg.className = "msg-ko small"; msg.textContent = "Remplissez les champs marqués d'une étoile (*)."; return; }
    await Ecole.ecrire("preinscriptions", null, { prenom: v("prenom"), nom: v("nom"), naissance: v("naissance"), ecole: v("ecole"), parent: v("parent"), tel: v("tel"), classe: v("classe"), statut: "Nouvelle", le: today(), par: Ecole.myId() })
      .then(() => { $view.innerHTML = `<div class="card"><h2>Merci !</h2><p>La pré-inscription de ${esc(v("prenom"))} est envoyée. L'école vous recontacte sur WhatsApp.</p><button class="btn alt" id="pre-fin">Retour</button></div>`; document.getElementById("pre-fin").onclick = () => viewRole(); })
      .catch(() => { msg.className = "msg-ko small"; msg.textContent = "L'envoi n'a pas abouti. Vérifiez votre connexion."; });
  };
}

// ---------- Placement des élèves aux compositions : salles, places, listes d'émargement
function vueExamens(ctx) {
  return `<a class="small" href="#ecole/registres">← Registres</a><h2>🪑 Placement aux compositions</h2>
    <div class="card"><p class="small muted">Coche les classes qui composent ensemble : les élèves sont mélangés et répartis dans les salles, avec une liste d'émargement par salle.</p>
      <div class="chips">${ctx.cfg.classes.map((c) => `<label class="chip"><input type="checkbox" class="ex-c" value="${esc(c.id)}"> ${esc(c.nom)}</label>`).join("")}</div>
      <div class="row"><label class="small" style="flex:1">Salles<input class="field" type="number" id="ex-s" value="3" min="1" max="30"></label><label class="small" style="flex:1">Places par salle<input class="field" type="number" id="ex-p" value="30" min="5" max="80"></label></div>
      <button class="btn" id="ex-go">Répartir les élèves</button></div><div id="ex-out"></div>`;
}

// ---------- Seuils de vie scolaire et convocations (surveillant, direction)
async function alertesSeuils(ctx) {
  const m = ceMois(), [portails, appels, disc] = await Promise.all([Ecole.liste("portail").catch(() => []), Ecole.liste("appels").catch(() => []), Ecole.liste("registres", "reg", "discipline").catch(() => [])]);
  const c = {}, inc = (id, k) => { c[id] = c[id] || { ret: 0, abs: 0, disc: 0 }; c[id][k]++; };
  portails.filter((p) => String(p.date).startsWith(m)).forEach((p) => Object.keys(p.retards || {}).forEach((id) => inc(id, "ret")));
  appels.filter((a) => String(a.date).startsWith(m)).forEach((a) => { (a.absents || []).forEach((id) => inc(id, "abs")); (a.retards || []).forEach((id) => inc(id, "ret")); });
  disc.filter((x) => String(x.date).startsWith(m)).forEach((x) => inc(x.eleveId, "disc"));
  const l = Object.entries(c).filter(([, v]) => v.ret >= 3 || v.abs >= 3 || v.disc >= 2).map(([id, v]) => ({ f: eleveDe(ctx, id), v })).filter((x) => x.f);
  return `<div class="card"><h2>⚠️ Seuils dépassés ce mois-ci (${l.length})</h2><p class="small muted">3 retards, 3 absences ou 2 incidents de discipline : la convocation des parents est proposée.</p>
    ${l.map(({ f, v }) => `<div class="lib eleve">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)} · ${v.ret} retard${v.ret > 1 ? "s" : ""} · ${v.abs} absence${v.abs > 1 ? "s" : ""} · ${v.disc} incident${v.disc > 1 ? "s" : ""}</span></span>
      <a class="btn alt small" href="#ecole/convocation/${encodeURIComponent(f.id)}">Convoquer</a></div>`).join("") || `<p class="small muted">Aucun élève au-dessus des seuils.</p>`}</div>`;
}
async function vueAujourdhuiComplet(ctx) { return vueAujourdhui(ctx) + (await alertesSeuils(ctx)); }
function vueConvocation(ctx, id) {
  const f = eleveDe(ctx, id); if (!f) return `<div class="card"><p>Élève introuvable.</p></div>`;
  const d = isoDay(addDays(new Date(), 3));
  const texte = `Bonjour ${f.parent || ""}, la direction de Racine School vous prie de passer à l'école le ${jourFr(d)} à 10 h, au sujet de la scolarité de ${f.prenom} (${f.classe}) : retards, absences ou comportement. Merci de confirmer votre venue.`;
  return `<a class="small noprint" href="#ecole">← Retour</a><p class="small muted noprint">Touche le texte pour changer la date ou le motif avant d'imprimer.</p>
    <div class="card doc" contenteditable="true" spellcheck="false">${enteteDoc(ctx.cfg)}<h2 class="doc-titre">Convocation</h2>
      <p>À l'attention de ${esc(f.parent || "Monsieur, Madame")}, parent de <b>${esc(nomComplet(f))}</b> (${esc(f.classe)}).</p>
      <p>Vous êtes prié(e) de vous présenter à l'école le <b>${jourFr(d)} à 10 h</b> pour un entretien au sujet de la scolarité de votre enfant (retards, absences ou comportement).</p>
      <p>Comptant sur votre présence, veuillez agréer nos salutations distinguées.</p><p style="text-align:right">Le Surveillant général<br><br><br></p></div>
    <div class="btns noprint"><button class="btn" onclick="print()">🖨️ Imprimer</button>${boutonParent(f, texte, "Envoyer la convocation sur WhatsApp")}</div>`;
}

// ---------- Trésorerie : attendu, encaissé et dépensé, mois par mois (direction, caisse)
async function vuePaiementsComplet(ctx) {
  const { cfg, eleves, pay } = ctx, dep = await Ecole.liste("registres", "reg", "depenses").catch(() => []);
  const mois = moisEchus(cfg).filter((m) => m !== "inscription");
  const lignes = mois.map((m) => {
    const attendu = eleves.reduce((n, f) => n + montantDu(cfg, f, m) + (m === cfg.debut ? montantDu(cfg, f, "inscription") : 0), 0);
    const encaisse = eleves.reduce((n, f) => n + Object.entries(pay[f.id] || {}).filter(([, x]) => x && String(x.le).startsWith(m)).reduce((k, [mm, x]) => k + (+x.montant || montantDu(cfg, f, mm)), 0), 0);
    const depense = dep.filter((x) => String(x.date).startsWith(m)).reduce((n, x) => n + (+x.montant || 0), 0);
    return { m, attendu, encaisse, depense };
  });
  return `${vuePaiements(ctx)}<div class="card"><h2>Trésorerie</h2><p class="small muted">Scolarité attendue, encaissée (reçus enregistrés dans l'appli) et dépenses du registre, par mois.</p>
    <table class="tab-notes"><thead><tr><th>Mois</th><th>Attendu</th><th>Encaissé</th><th>Dépensé</th><th>Solde</th></tr></thead><tbody>
    ${lignes.map((x) => `<tr><td>${moisNom(x.m)}</td><td>${Math.round(x.attendu / 1000)} k</td><td class="ok-txt">${Math.round(x.encaisse / 1000)} k</td><td class="ko-txt">${Math.round(x.depense / 1000)} k</td><td><b>${Math.round((x.encaisse - x.depense) / 1000)} k</b></td></tr>`).join("")}</tbody></table>
    <p class="small muted">Montants en milliers de FCFA.</p></div>`;
}

Object.assign(bindEcole, {
  registres: () => {
    const id = `pt-${today()}-${Ecole.myId()}`, inn = document.getElementById("pt-in"), out = document.getElementById("pt-out");
    if (inn) inn.onclick = async () => { await Ecole.ecrire("registres", id, { reg: "pointage", date: today(), arrivee: maintenant(), nom: S.staffNom || "", par: Ecole.myId() }).catch(() => {}); viewEcole(); };
    if (out) out.onclick = async () => { const p = await Ecole.lire("registres", id).catch(() => null); await Ecole.ecrire("registres", id, { ...sansId(p || {}), reg: "pointage", depart: maintenant() }).catch(() => {}); viewEcole(); };
  },
  registre: (ctx, key) => {
    const d = REG[key];
    if (key === "candidats") {
      $view.querySelectorAll(".cand").forEach((b) => b.onchange = async () => {
        const pieces = [...$view.querySelectorAll(`.cand[data-id="${CSS.escape(b.dataset.id)}"]:checked`)].map((x) => x.value), f = eleveDe(ctx, b.dataset.id);
        await Ecole.ecrire("registres", "cand-" + f.id, { reg: "candidats", eleveId: f.id, eleveNom: nomComplet(f), classe: f.classe, pieces, le: today() }).catch(() => {});
      });
      const csv = document.getElementById("cand-csv");
      if (csv) csv.onclick = () => { const l = [...$view.querySelectorAll(".cand")].reduce((o, b) => { (o[b.dataset.id] = o[b.dataset.id] || []); if (b.checked) o[b.dataset.id].push(b.value); return o; }, {});
        telechargerCsv("candidats", ["Nom", "Prénom", "Classe", "Né(e) le", ...PIECES], Object.entries(l).map(([id, p]) => { const f = eleveDe(ctx, id); return [f.nom, f.prenom, f.classe, dateFr(f.naissance), ...PIECES.map((x) => (p.includes(x) ? "oui" : "non"))]; })); };
      return;
    }
    if (key === "preinscriptions") { $view.querySelectorAll(".pre-st").forEach((s) => s.onchange = async () => { const x = await Ecole.lire("preinscriptions", s.dataset.id); await Ecole.ecrire("preinscriptions", s.dataset.id, { ...sansId(x), statut: s.value }).catch(() => {}); }); return; }
    if (key === "examens") {
      document.getElementById("ex-go").onclick = () => {
        const cids = [...$view.querySelectorAll(".ex-c:checked")].map((x) => x.value), ns = +document.getElementById("ex-s").value || 1, np = +document.getElementById("ex-p").value || 30;
        const l = shuffle(ctx.eleves.filter((f) => cids.includes(f.cid))), out = document.getElementById("ex-out");
        if (!l.length) { out.innerHTML = `<p class="msg-ko small">Coche au moins une classe avec des élèves.</p>`; return; }
        if (l.length > ns * np) { out.innerHTML = `<p class="msg-ko small">${l.length} élèves pour ${ns * np} places : ajoute des salles.</p>`; return; }
        const par = Math.ceil(l.length / ns);
        out.innerHTML = [...Array(ns).keys()].map((s) => { const g = l.slice(s * par, (s + 1) * par); return g.length ? `<div class="card doc"><h2>Salle ${s + 1} · ${g.length} élèves</h2>
          <table class="tab-notes"><thead><tr><th>Place</th><th>Élève</th><th>Classe</th><th>Signature</th></tr></thead><tbody>${g.map((f, i) => `<tr><td>${i + 1}</td><td>${esc(nomComplet(f))}</td><td>${esc(f.classe)}</td><td></td></tr>`).join("")}</tbody></table></div>` : ""; }).join("")
          + `<button class="btn noprint" onclick="print()">🖨️ Imprimer les listes</button>`;
      };
      return;
    }
    if (!d) return;
    $view.querySelectorAll(".rg-rm").forEach((b) => b.onclick = async () => { if (!confirm("Supprimer cette ligne ?")) return; await Ecole.effacer("registres", b.dataset.id).catch(() => {}); viewEcole(); });
    $view.querySelectorAll(".rg-st").forEach((s) => s.onchange = async () => { const x = await Ecole.lire("registres", s.dataset.id); await Ecole.ecrire("registres", s.dataset.id, { ...sansId(x), [d.statut[0]]: s.value }).catch(() => {}); });
    const add = document.getElementById("rg-add");
    if (add) add.onclick = async () => {
      const msg = document.getElementById("rg-msg"), x = { reg: key, par: Ecole.myId(), parNom: S.staffNom || "", le: today() };
      for (const [k, , type] of d.champs) {
        const v = document.getElementById("rg-" + k).value.trim();
        if (type === "eleve") { const f = ctx.eleves.find((e) => labelEleve(e) === v);
          if (!f && v) { msg.className = "msg-ko small"; msg.textContent = "Choisis l'élève dans la liste proposée."; return; }
          if (f) Object.assign(x, { eleveId: f.id, eleveNom: nomComplet(f), classe: f.classe }); else Object.assign(x, { eleveNom: "" }); }
        else x[k] = v;
      }
      const premier = d.champs[0];
      if (!valeurChamp(x, premier[2] === "eleve" ? "eleveNom" : premier[0]) && key !== "maincourante") { msg.className = "msg-ko small"; msg.textContent = `Remplis « ${premier[1]} ».`; return; }
      add.disabled = true;
      await Ecole.ecrire("registres", null, d.avant ? d.avant(x) : x).then(() => viewEcole()).catch(() => { add.disabled = false; msg.className = "msg-ko small"; msg.textContent = "L'enregistrement n'a pas abouti."; });
    };
    const csv = document.getElementById("rg-csv");
    if (csv) csv.onclick = async () => {
      const l = await Ecole.liste("registres", "reg", key).catch(() => []), cols = d.champs.map(([k, label, type]) => [type === "eleve" ? "eleveNom" : k, label]);
      telechargerCsv(key, [...cols.map((c) => c[1]), ...(cols.some((c) => c[0] === "eleveNom") ? ["Classe"] : [])], l.map((x) => [...cols.map(([k]) => x[k] ?? ""), ...(cols.some((c) => c[0] === "eleveNom") ? [x.classe || ""] : [])]));
    };
  },
});
