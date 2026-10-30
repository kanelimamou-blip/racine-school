"use strict";
// Communication de l'école : sondages, messagerie par groupe (équipe, professeurs, classes), documents et supports de cours,
// notifications à l'ouverture, historique des modifications, relances de scolarité du mois, résumé de la semaine aux parents,
// message aux parents d'une classe, rapport mensuel, clôture de caisse, paiement par Wave ou Orange Money.

// ---------- Sondages (direction) : une question, des choix, un vote par personne
async function sondagesCarte(ctx) {
  const dir = S.role === "directeur", moi = Ecole.myId();
  const l = annoncesPour(await Ecole.liste("sondages").catch(() => [])).filter((x) => dir || !x.clos).sort((a, b) => String(b.le).localeCompare(String(a.le)));
  const votes = dir ? await Ecole.liste("votes").catch(() => []) : await Ecole.liste("votes", "par", moi).catch(() => []);
  return `${dir ? `<details class="card"><summary><b>📊 Nouveau sondage</b></summary>
      <input class="field" id="sq" maxlength="140" placeholder="Question (ex. : Êtes-vous satisfaits du premier trimestre ?)">
      <input class="field" id="so" maxlength="200" value="Très satisfait, Satisfait, Peu satisfait, Pas satisfait" aria-label="Choix séparés par des virgules">
      <label class="small">Pour<select class="field" id="sc">${Object.entries(CIBLES).map(([k, n]) => `<option value="${k}">${n}</option>`).join("")}</select></label>
      <button class="btn alt" id="sadd">Lancer le sondage</button></details>` : ""}
    ${l.map((x) => { const v = votes.filter((y) => y.sondage === x.id), mien = v.find((y) => y.par === moi);
      return `<div class="card"><div class="row"><b>📊 ${esc(x.question)}</b>${dir ? `<button class="btn alt small sclos" data-id="${esc(x.id)}">${x.clos ? "Rouvrir" : "Clore"}</button>` : ""}</div>
        ${dir ? `${barChart(x.options.map((o) => { const n = v.filter((y) => y.choix === o).length; return [o, pct(n, v.length), `${pct(n, v.length)} %`]; }))}<p class="small muted">${v.length} réponse${v.length > 1 ? "s" : ""} · ${esc(CIBLES[x.cible] || x.cible)}${x.clos ? " · clos" : ""}</p>`
          : `<div class="chips">${x.options.map((o) => `<button class="btn ${mien && mien.choix === o ? "" : "alt "}small vote" data-id="${esc(x.id)}" data-c="${esc(o)}">${esc(o)}</button>`).join("")}</div>${mien ? `<p class="small msg-ok">Merci, ta réponse est enregistrée.</p>` : ""}`}</div>`; }).join("")}`;
}
function lierSondages() {
  const add = document.getElementById("sadd");
  if (add) add.onclick = async () => {
    const q = document.getElementById("sq").value.trim(), o = document.getElementById("so").value.split(",").map((x) => x.trim()).filter(Boolean);
    if (!q || o.length < 2) return;
    await Ecole.ecrire("sondages", null, { question: q, options: o, cible: document.getElementById("sc").value, clos: false, par: Ecole.myId(), le: today() }).catch(() => {}); viewEcole();
  };
  $view.querySelectorAll(".sclos").forEach((b) => b.onclick = async () => { const x = await Ecole.lire("sondages", b.dataset.id); await Ecole.ecrire("sondages", b.dataset.id, { ...sansId(x), clos: !x.clos }).catch(() => {}); viewEcole(); });
  $view.querySelectorAll(".vote").forEach((b) => b.onclick = async () => {
    const moi = Ecole.myId(); await Ecole.ecrire("votes", `${b.dataset.id}_${moi}`, { sondage: b.dataset.id, choix: b.dataset.c, par: moi, le: today() }).catch(() => {});
    if (S.role === "eleve") viewMesDocuments(); else viewEcole();
  });
}

// ---------- Messagerie par groupe : équipe, professeurs, et une discussion par classe (professeurs et élèves)
function canauxDuRole(cfg) {
  if (S.role === "eleve") return S.fiche ? [[S.fiche.classeId, `Classe de ${S.fiche.classe}`]] : [];
  const c = [["equipe", "Toute l'équipe"]];
  if (["prof", "directeur"].includes(S.role)) c.push(["profs", "Professeurs"]);
  const classes = S.role === "prof" ? mesClassesProf(cfg) : S.role === "directeur" ? cfg.classes : [];
  return [...c, ...classes.map((x) => [x.id, `Classe de ${x.nom}`])];
}
async function vueMessages(ctx, canal) {
  const canaux = canauxDuRole(ctx.cfg), c = canaux.find((x) => x[0] === canal) || canaux[0];
  if (!c) return `<p class="muted">Aucune discussion pour l'instant.</p>`;
  const l = (await Ecole.liste("messages", "canal", c[0]).catch(() => [])).sort((a, b) => String(a.at).localeCompare(String(b.at))).slice(-80), moi = Ecole.myId();
  const lien = S.role === "eleve" ? (k) => `#messages/${encodeURIComponent(k)}` : (k) => `#ecole/messages/${encodeURIComponent(k)}`;
  return `${canaux.length > 1 ? `<div class="card"><select class="field" id="mcanal">${canaux.map(([k, n]) => `<option value="${esc(k)}"${k === c[0] ? " selected" : ""}>${esc(n)}</option>`).join("")}</select></div>` : ""}
    <div class="card chat" id="chat"><h2>${esc(c[1])}</h2>
      ${l.map((m) => `<div class="bulle${m.par === moi ? " moi" : ""}"><span class="small"><b>${esc(m.nom)}</b> · ${String(m.at).slice(8, 10)}/${String(m.at).slice(5, 7)} ${String(m.at).slice(11, 16)}</span><p>${esc(m.texte)}</p>
        ${S.role === "directeur" || m.par === moi ? `<button class="linkbtn small mrm" data-id="${esc(m.id)}">Supprimer</button>` : ""}</div>`).join("") || `<p class="small muted">Aucun message. Écris le premier !</p>`}</div>
    <div class="card"><textarea class="field" id="mtexte" rows="2" maxlength="600" placeholder="Ton message"></textarea><button class="btn" id="menv">Envoyer</button>
      <p class="small muted">${S.role === "eleve" ? "Les professeurs et la direction lisent cette discussion : reste poli et utile." : "La direction peut supprimer un message déplacé."}</p></div>`
    + `<span hidden id="mlien" data-l="${esc(lien(""))}" data-c="${esc(c[0])}"></span>`;
}
function lierMessages() {
  const sel = document.getElementById("mcanal"), base = document.getElementById("mlien");
  if (!base) return;
  if (sel) sel.onchange = () => { location.hash = base.dataset.l + encodeURIComponent(sel.value); };
  const rafraichir = () => (S.role === "eleve" ? viewMessagesEleve(base.dataset.c) : viewEcole());
  document.getElementById("menv").onclick = async () => {
    const t = document.getElementById("mtexte").value.trim(); if (!t) return;
    await Ecole.ecrire("messages", null, { canal: base.dataset.c, texte: t, par: Ecole.myId(), nom: S.role === "eleve" ? `${S.fiche.prenom} ${S.fiche.nom}` : S.staffNom || "", role: S.role, at: new Date().toISOString() }).catch(() => {});
    rafraichir();
  };
  $view.querySelectorAll(".mrm").forEach((b) => b.onclick = async () => { await Ecole.effacer("messages", b.dataset.id).catch(() => {}); rafraichir(); });
  const ch = document.getElementById("chat"); if (ch) ch.scrollTop = ch.scrollHeight;
  // nouvelles réponses toutes les 20 secondes tant que la discussion est ouverte
  clearTimeout(lierMessages.t); const h = location.hash;
  lierMessages.t = setTimeout(() => { if (location.hash === h && !document.getElementById("mtexte").value) rafraichir(); }, 20000);
}
async function viewMessagesEleve(canal) {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Discussion de la classe</h1>${await vueMessages({ cfg: await Ecole.config() }, canal)}`;
  lierMessages();
}

// ---------- Documents de l'école et supports de cours (fichiers légers gardés dans la base, ou un lien)
const TAILLE_MAX = 700 * 1024;
function documentsPour(l) {
  if (S.role === "eleve") return l.filter((d) => ["tous", "eleves"].includes(d.cible) || d.cible === S.fiche.classeId);
  if (S.role === "parent") return l.filter((d) => ["tous", "parents"].includes(d.cible) || (S.enfantsCids || []).includes(d.cible));
  if (!["prof", "directeur"].includes(S.role)) return l.filter((d) => d.cible !== "profs");
  return l;
}
async function listeDocuments(cfg) {
  const l = documentsPour(await Ecole.liste("documents").catch(() => [])).sort((a, b) => String(b.le).localeCompare(String(a.le))), moi = Ecole.myId();
  return l.map((d) => `<div class="card doc-l"><div class="row"><b>${d.type && d.type.startsWith("image") ? "🖼️" : d.lien ? "🔗" : "📄"} ${esc(d.titre)}</b>${S.role === "directeur" || d.par === moi ? `<button class="btn alt small docrm" data-id="${esc(d.id)}">✕</button>` : ""}</div>
    <p class="small muted">${esc(d.categorie)} · ${esc(cibleNom(cfg, d.cible))} · ${esc(d.parNom || "")} · ${dateFr(d.le)}</p>
    ${d.fichier ? `<a class="btn alt small" href="${esc(d.fichier)}" download="${esc(d.nomFichier || d.titre)}" target="_blank">Ouvrir</a>` : d.lien ? `<a class="btn alt small" href="${esc(d.lien)}" target="_blank" rel="noopener">Ouvrir le lien</a>` : ""}</div>`).join("") || `<p class="muted">Aucun document pour l'instant.</p>`;
}
async function vueDocuments(ctx) {
  const peut = ["prof", "directeur"].includes(S.role), classes = S.role === "prof" ? mesClassesProf(ctx.cfg) : ctx.cfg.classes;
  return `${peut ? `<details class="card"><summary><b>➕ Ajouter un document ou un support de cours</b></summary>
      <input class="field" id="dtitre" maxlength="80" placeholder="Titre (ex. : Règlement intérieur, Cours sur les fractions)">
      <label class="small">Catégorie<select class="field" id="dcat">${["Support de cours", "Exercices", "Règlement et circulaires", "Liste de fournitures", "Ressource pour les professeurs", "Autre"].map((x) => `<option>${x}</option>`).join("")}</select></label>
      <label class="small">Pour<select class="field" id="dcib">${S.role === "directeur" ? Object.entries(CIBLES).map(([k, n]) => `<option value="${k}">${n}</option>`).join("") : `<option value="profs">Les autres professeurs</option>`}
        <optgroup label="Une classe">${classes.map((c) => `<option value="${esc(c.id)}">${esc(c.nom)}</option>`).join("")}</optgroup></select></label>
      <label class="btn alt small">📎 Choisir un fichier (photo ou PDF, 700 Ko au plus)<input type="file" id="dfic" accept="image/*,application/pdf" hidden></label><span id="dficmsg" class="small muted"></span>
      <input class="field" id="dlien" placeholder="ou un lien (Google Drive, YouTube…)" maxlength="300">
      <button class="btn" id="dpub">Publier</button><p id="dmsg" class="small"></p></details>` : ""}
    ${await listeDocuments(ctx.cfg)}`;
}
function lierDocuments() {
  let fichier = "", nom = "", type = "";
  const f = document.getElementById("dfic");
  if (f) f.onchange = async (e) => {
    const x = e.target.files[0], info = document.getElementById("dficmsg"); if (!x) return;
    if (x.type.startsWith("image")) { fichier = await photoDocument(x).catch(() => ""); type = "image/jpeg"; }
    else if (x.size > TAILLE_MAX) { info.textContent = " Fichier trop lourd : 700 Ko au plus (ou mettez un lien)."; return; }
    else { fichier = await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(x); }); type = x.type; }
    nom = x.name; info.textContent = ` ${x.name} ✓`;
  };
  const pub = document.getElementById("dpub");
  if (pub) pub.onclick = async () => {
    const v = (id) => document.getElementById(id).value.trim(), msg = document.getElementById("dmsg");
    if (!v("dtitre") || (!fichier && !v("dlien"))) { msg.className = "msg-ko small"; msg.textContent = "Donne un titre et un fichier ou un lien."; return; }
    pub.disabled = true;
    await Ecole.ecrire("documents", null, { titre: v("dtitre"), categorie: v("dcat"), cible: v("dcib"), fichier, nomFichier: nom, type, lien: v("dlien"), par: Ecole.myId(), parNom: S.staffNom || "", le: today() })
      .then(() => viewEcole()).catch(() => { pub.disabled = false; msg.className = "msg-ko small"; msg.textContent = "L'envoi n'a pas abouti."; });
  };
  $view.querySelectorAll(".docrm").forEach((b) => b.onclick = async () => { await Ecole.effacer("documents", b.dataset.id).catch(() => {}); S.role === "eleve" ? viewMesDocuments() : viewEcole(); });
}
async function viewMesDocuments() {
  if (!["eleve"].includes(S.role) || !S.fiche) return go("accueil");
  const cfg = await Ecole.config();
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Documents et sondages</h1>${await sondagesCarte({ cfg })}${await listeDocuments(cfg)}`;
  lierSondages(); lierDocuments();
}

// ---------- Notifications à l'ouverture de l'appli (annonces, réponses aux demandes, nouveaux documents)
async function verifierNouveautes() {
  if (!S.role) return;
  if (verifierNouveautes.fait) return; verifierNouveautes.fait = true;
  const depuis = S.nouvLe || today();
  const [ann, dem, docs] = await Promise.all([Ecole.liste("annonces").catch(() => []), Ecole.liste("demandes", "par", Ecole.myId()).catch(() => []), Ecole.liste("documents").catch(() => [])]);
  const n1 = annoncesPour(ann).filter((a) => String(a.le) > depuis).length, n2 = dem.filter((d) => d.repLe && d.repLe > depuis).length, n3 = documentsPour(docs).filter((d) => String(d.le) > depuis).length;
  S.nouvLe = today(); store.save();
  const parts = [n1 && `${n1} annonce${n1 > 1 ? "s" : ""}`, n2 && `${n2} réponse${n2 > 1 ? "s" : ""} à tes demandes`, n3 && `${n3} document${n3 > 1 ? "s" : ""}`].filter(Boolean);
  if (parts.length) { const p = document.createElement("p"); p.className = "demo small noprint"; p.textContent = `🔔 Depuis ta dernière visite : ${parts.join(", ")}.`; $view.prepend(p); }
  if (parts.length && "Notification" in window && Notification.permission === "granted") {
    try { const r = await navigator.serviceWorker?.getRegistration(); const t = "Racine School : du nouveau", o = { body: parts.join(", "), icon: "icons/icon-192.png" };
      r ? r.showNotification(t, o) : new Notification(t, o); } catch {}
  }
}

// ---------- Historique des modifications sensibles (paiements, notes, accès, réglages)
async function vueJournal() {
  const l = (await Ecole.liste("journal").catch(() => [])).sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 200);
  return `<a class="small" href="#ecole/registres">← Registres</a><h2>🕵️ Historique des modifications</h2><p class="small muted">Qui a changé un paiement, une note, un accès ou un réglage, et quand.</p>
    <div class="card">${l.map((x) => `<div class="row small creneau"><span><b>${esc(x.quoi)}</b><br><span class="muted">${esc(x.qui || "")} · ${String(x.at).slice(8, 10)}/${String(x.at).slice(5, 7)} à ${String(x.at).slice(11, 16)}</span></span></div>`).join("") || `<p class="small muted">Rien pour l'instant.</p>`}</div>`;
}

// ---------- Relances de scolarité du mois (direction, caisse) : une ligne par famille, marquée une fois relancée
async function relancesCarte(ctx) {
  const { cfg, eleves, pay } = ctx, m = ceMois(), faites = new Set((await Ecole.liste("registres", "reg", "relances").catch(() => [])).filter((x) => x.mois === m).map((x) => x.eleveId));
  const l = eleves.map((f) => ({ f, r: retard(cfg, f, pay[f.id]) })).filter((x) => x.r.mois.length).sort((a, b) => b.r.montant - a.r.montant);
  const jour = +today().slice(8), jourRelance = (cfg.joursRelance || [5, 15]).includes(jour);
  return `<details class="card"${jourRelance ? " open" : ""}><summary><b>📣 Relances de ${moisNom(m)} (${faites.size}/${l.length})</b></summary><p class="small muted">Relances prévues le ${(cfg.joursRelance || [5, 15]).join(" et le ")} du mois${jourRelance ? ` : <b class="ko-txt">c'est aujourd'hui</b>` : ""}. ${faites.size} famille${faites.size > 1 ? "s" : ""} relancée${faites.size > 1 ? "s" : ""} sur ${l.length}. L'envoi automatique demandera l'API WhatsApp Business (payante).</p>
    ${l.slice(0, 60).map(({ f, r }) => { const txt = `Bonjour ${f.parent || ""}, ici Racine School. Sauf erreur de notre part, la scolarité de ${f.prenom} (${f.classe}) reste à régler pour : ${r.mois.map(moisNom).join(", ")}, soit ${fcfa(r.montant)}. Vous pouvez payer à la caisse ou par Wave${cfg.wave ? " au " + cfg.wave : ""}. Merci.`;
      return `<div class="lib eleve">${avatar(f)}<span class="grow"><b>${esc(nomComplet(f))}</b><br><span class="small muted">${esc(f.classe)} · ${fcfa(r.montant)}</span></span>
        ${faites.has(f.id) ? `<span class="badge ok">Relancé</span>` : fictif(f) ? `<button class="btn alt small rel" data-id="${esc(f.id)}">Relancer</button>` : `<a class="btn alt small rel" data-id="${esc(f.id)}" target="_blank" rel="noopener" href="${lienWa(f.telParent, txt)}">Relancer</a>`}</div>`; }).join("") || `<p class="small muted">Personne en retard.</p>`}</details>`;
}
const lierRelances = () => $view.querySelectorAll(".rel").forEach((b) => b.addEventListener("click", async () => {
  await Ecole.ecrire("registres", `rel-${b.dataset.id}-${ceMois()}`, { reg: "relances", eleveId: b.dataset.id, mois: ceMois(), le: today(), par: Ecole.myId() }).catch(() => {});
  setTimeout(viewEcole, 300);
}));

// ---------- Résumé de la semaine d'un élève (pour le parent, par WhatsApp ou dans l'appli)
async function resumeSemaine(cfg, f) {
  const d7 = isoDay(addDays(new Date(), -7));
  const [appels, notes, devoirs] = await Promise.all([isStaff() && S.role !== "parent" ? Ecole.liste("appels", "cid", f.cid).catch(() => []) : [], Ecole.releve(f.id, f.cid).catch(() => []), Ecole.devoirs(f.cid).catch(() => [])]);
  const abs = appels.filter((a) => a.date >= d7 && (a.absents || []).includes(f.id)).length, ret = appels.filter((a) => a.date >= d7 && (a.retards || []).includes(f.id)).length;
  const nn = notes.filter((n) => String(n.date) >= d7).map((n) => `${n.matiere} ${n2(+n.notes[f.id])}/${n.sur}`);
  const av = devoirs.filter((d) => d.date >= today() && d.date <= isoDay(addDays(new Date(), 7))).map((d) => `${d.type} de ${d.sid ? subjName(d.sid) : d.nom} le ${jourFr(d.date)}`);
  const st = f.stats || {};
  return `Racine School · semaine de ${f.prenom} (${f.classe}) : ${appels.length ? `${abs} absence${abs > 1 ? "s" : ""}, ${ret} retard${ret > 1 ? "s" : ""}. ` : ""}${nn.length ? `Notes : ${nn.join(", ")}. ` : "Pas de nouvelle note. "}Révisions dans l'appli : ${st.jours7 || 0} jour${(st.jours7 || 0) > 1 ? "s" : ""} sur 7${st.serie ? `, série de ${st.serie} jours` : ""}. ${av.length ? `À venir : ${av.join(" ; ")}.` : ""}`;
}
async function vueFicheComplete(ctx, id) {
  const base = vueFiche(ctx, id), f = ctx.eleves.find((x) => x.id === id);
  if (!f) return base;
  const txt = await resumeSemaine(ctx.cfg, f).catch(() => "");
  const pp = (classeById(ctx.cfg, f.cid) || {}).pp;
  return `${base}${pp ? `<p class="small muted">Professeur principal : ${esc(pp)}</p>` : ""}<div class="card"><h2>Résumé de la semaine</h2><p class="small">${esc(txt)}</p>${boutonParent(f, txt, "Envoyer le résumé au parent")}</div>
    ${estCaisse() ? await dossierCarte(f) : ""}`;
}

// ---------- Message aux parents de toute une classe (professeur, direction) : un appui par parent
function vueParentsClasse(ctx, cid) {
  const c = classeById(ctx.cfg, cid); if (!c) return `<p>Classe introuvable.</p>`;
  const l = ctx.eleves.filter((f) => f.cid === c.id);
  return `<a class="small" href="#ecole">← Mes classes</a><h2>Écrire aux parents de ${esc(c.nom)}</h2>
    <div class="card"><textarea class="field" id="ptxt" rows="4" maxlength="600">Bonjour, ici ${esc(S.staffNom || "votre professeur")}, à Racine School. </textarea>
      <p class="small muted">Écris ton message, puis touche chaque parent : WhatsApp s'ouvre avec le message prêt. Ton numéro personnel n'est pas affiché dans l'appli.</p></div>
    <div class="card">${l.map((f) => `<div class="lib eleve">${avatar(f)}<span class="grow"><b>${esc(f.parent || "Parent")}</b><br><span class="small muted">parent de ${esc(nomComplet(f))}</span></span>
      ${fictif(f) ? `<span class="small muted">fictif</span>` : `<a class="btn alt small pwa" target="_blank" rel="noopener" data-tel="${esc(telLien(f.telParent))}" href="#">WhatsApp</a>`}</div>`).join("") || `<p class="muted">Aucun élève.</p>`}</div>`;
}

// ---------- Rapport du mois (direction), imprimable
async function vueRapport(ctx) {
  const { cfg, eleves, pay } = ctx, m = ceMois();
  const [appels, disc, dep, notes] = await Promise.all([Ecole.liste("appels").catch(() => []), Ecole.liste("registres", "reg", "discipline").catch(() => []), Ecole.liste("registres", "reg", "depenses").catch(() => []), Ecole.liste("notes").catch(() => [])]);
  const ret = eleves.map((f) => retard(cfg, f, pay[f.id])), enc = eleves.reduce((n, f) => n + Object.entries(pay[f.id] || {}).filter(([, x]) => x && String(x.le).startsWith(m)).reduce((k, [mm, x]) => k + (+x.montant || montantDu(cfg, f, mm)), 0), 0);
  const am = appels.filter((a) => String(a.date).startsWith(m)), abs = am.reduce((n, a) => n + (a.absents || []).length, 0);
  const vals = notes.flatMap((e) => Object.values(e.notes || {}).map((v) => sur20(v, e.sur)).filter((v) => v !== null));
  const depM = dep.filter((x) => String(x.date).startsWith(m)).reduce((n, x) => n + (+x.montant || 0), 0);
  const L = (a, b) => `<div class="row small"><span>${a}</span><b>${b}</b></div>`;
  return `<div class="card doc">${enteteDoc(cfg)}<h2 class="doc-titre">Rapport de ${moisNom(m)}</h2>
    <h3>Effectifs</h3>${L("Élèves inscrits", eleves.length)}${L("Filles / garçons", `${eleves.filter((f) => f.sexe === "F").length} / ${eleves.filter((f) => f.sexe === "G").length}`)}${L("Classes", cfg.classes.length)}
    <h3>Argent</h3>${L("Encaissé ce mois", fcfa(enc))}${L("Dépenses du mois", fcfa(depM))}${L("Familles en retard", ret.filter((r) => r.mois.length).length)}${L("Reste à recouvrer", fcfa(ret.reduce((n, r) => n + r.montant, 0)))}
    <h3>Vie scolaire</h3>${L("Appels faits", am.length)}${L("Absences relevées", abs)}${L("Incidents de discipline", disc.filter((x) => String(x.date).startsWith(m)).length)}
    <h3>Résultats</h3>${L("Notes saisies (année)", vals.length)}${L("Moyenne des notes", vals.length ? n2(vals.reduce((a, b) => a + b, 0) / vals.length) + " / 20" : "—")}${L("Élèves actifs dans l'appli (7 j)", `${pct(eleves.filter(actif7).length, eleves.length)} %`)}
    <p class="small muted">Établi le ${dateFr(today())} depuis l'appli Racine School.</p></div>
    <div class="btns noprint"><button class="btn" onclick="print()">🖨️ Imprimer ou enregistrer en PDF</button></div>`;
}

// ---------- Clôture de caisse du jour (personnel, direction), imprimable
function vueCloture(ctx) {
  const jour = ctx.eleves.flatMap((f) => Object.entries(ctx.pay[f.id] || {}).filter(([, x]) => x && x.le === today()).map(([m, x]) => ({ f, m, x })));
  const total = jour.reduce((n, j) => n + (+j.x.montant || 0), 0);
  return `<a class="small noprint" href="#ecole">← Caisse</a><div class="card doc">${enteteDoc(ctx.cfg)}<h2 class="doc-titre">Clôture de caisse du ${dateFr(today())}</h2>
    <table class="tab-notes"><thead><tr><th>Reçu</th><th>Élève</th><th>Objet</th><th>Montant</th></tr></thead><tbody>${jour.map(({ f, m, x }) => `<tr><td>${esc(x.recu || "")}</td><td>${esc(nomComplet(f))}</td><td>${moisNom(m)}</td><td>${fcfa(+x.montant || 0)}</td></tr>`).join("") || `<tr><td colspan="4">Aucun encaissement.</td></tr>`}</tbody></table>
    <div class="row"><span>${jour.length} paiement${jour.length > 1 ? "s" : ""}</span><b class="count">${fcfa(total)}</b></div>
    <p class="small">Caisse tenue par ${esc(S.staffNom || "")}. Signature :</p><br></div>
    <div class="btns noprint"><button class="btn" id="clot">Enregistrer la clôture et imprimer</button></div>`;
}

// ---------- Dossier administratif de l'élève (pièces scannées, légères)
async function dossierCarte(f) {
  const d = (await Ecole.lire("dossiers", f.id).catch(() => null)) || { pieces: [] };
  return `<div class="card"><h2>Dossier administratif</h2>${(d.pieces || []).map((p, i) => `<div class="row small creneau"><a href="${esc(p.data)}" target="_blank" download="${esc(p.nom)}">📄 ${esc(p.nom)}</a><button class="btn alt small dosrm" data-i="${i}" data-id="${esc(f.id)}">✕</button></div>`).join("") || `<p class="small muted">Aucune pièce. Photographie l'extrait de naissance, le bulletin de l'an dernier…</p>`}
    <input class="field" id="dosnom" maxlength="50" placeholder="Nom de la pièce (ex. : Extrait de naissance)">
    <label class="btn alt small">📷 Ajouter une pièce<input type="file" id="dosfic" data-id="${esc(f.id)}" accept="image/*" hidden></label>
    <p class="small muted">Version gratuite : des photos réduites (environ 6 pièces par élève). Le stockage de fichiers complets demandera le forfait Firebase payant.</p></div>`;
}

Object.assign(bindEcole, {
  messages: () => lierMessages(),
  documents: () => lierDocuments(),
  journal: () => {},
  rapport: () => {},
  cloture: (ctx) => {
    const b = document.getElementById("clot");
    if (b) b.onclick = async () => {
      const jour = ctx.eleves.flatMap((f) => Object.values(ctx.pay[f.id] || {}).filter((x) => x && x.le === today()));
      await Ecole.ecrire("registres", `clot-${today()}`, { reg: "clotures", date: today(), total: jour.reduce((n, x) => n + (+x.montant || 0), 0), nb: jour.length, par: Ecole.myId(), parNom: S.staffNom || "" }).catch(() => {});
      print();
    };
  },
  parents: () => {
    const t = document.getElementById("ptxt");
    $view.querySelectorAll(".pwa").forEach((a) => a.onclick = () => { a.href = `https://wa.me/${a.dataset.tel}?text=${encodeURIComponent(t.value)}`; a.classList.remove("alt"); });
  },
});
// la fiche de l'élève garde ses actions (paiements), plus le dossier administratif
const lierFicheBase = bindEcole.eleve;
bindEcole.eleve = (ctx, id) => {
  lierFicheBase && lierFicheBase(ctx, id);
  $view.querySelectorAll(".dosrm").forEach((b) => b.onclick = async () => { const d = await Ecole.lire("dossiers", b.dataset.id); d.pieces.splice(+b.dataset.i, 1); await Ecole.ecrire("dossiers", b.dataset.id, { pieces: d.pieces }).catch(() => {}); viewEcole(); });
  const f = document.getElementById("dosfic");
  if (f) f.onchange = async (e) => {
    const x = e.target.files[0]; if (!x) return;
    const data = await photoDocument(x).catch(() => ""), nom = document.getElementById("dosnom").value.trim() || x.name;
    const d = (await Ecole.lire("dossiers", f.dataset.id).catch(() => null)) || { pieces: [] };
    await Ecole.ecrire("dossiers", f.dataset.id, { pieces: [...(d.pieces || []), { nom, data, le: today() }] }).catch(() => alert("La pièce est trop lourde pour la version gratuite."));
    viewEcole();
  };
};
const lierPaiementsBase = bindEcole.paiements;
bindEcole.paiements = (ctx) => { lierPaiementsBase && lierPaiementsBase(ctx); lierRelances(); };
