"use strict";
// Demandes et validations : absences et permissions du personnel, dépenses à valider, justificatifs d'absence,
// autorisations signées par les parents, rendez-vous, questions des élèves à leurs professeurs, signalements confidentiels.
// Chacun dépose sa demande ; celui qui la traite l'accepte, la refuse ou y répond, et le demandeur voit la suite.

const DEMANDES = {
  conge: { titre: "Absence ou permission", ico: "🗓️", de: ["prof", "surveillant", "personnel"], pour: ["directeur"],
    champs: [["du", "Du", "date"], ["au", "Au", "date"], ["texte", "Motif", "textarea"]], resume: (x) => `du ${dateFr(x.du)} au ${dateFr(x.au || x.du)}` },
  depense: { titre: "Dépense à valider", ico: "💸", de: ["prof", "surveillant", "personnel"], pour: ["directeur"],
    champs: [["libelle", "Quoi", "text"], ["montant", "Montant (FCFA)", "number"], ["texte", "Pourquoi", "textarea"]], resume: (x) => `${x.libelle} · ${fcfa(+x.montant || 0)}` },
  justificatif: { titre: "Justifier une absence", ico: "📄", de: ["parent"], pour: ["surveillant", "directeur"], enfant: true, photo: true,
    champs: [["date", "Jour de l'absence", "date"], ["texte", "Motif", "textarea"]], resume: (x) => `absence du ${dateFr(x.date)}` },
  autorisation: { titre: "Autorisation signée", ico: "✍️", de: ["parent"], pour: ["surveillant", "directeur"], enfant: true,
    champs: [["objet", "Objet", "select", ["Sortie anticipée", "Sortie scolaire ou voyage", "Rentrer seul à la maison", "Photos de l'enfant sur les supports de l'école"]], ["date", "Date (si besoin)", "date"], ["texte", "Précisions", "textarea"]],
    signature: "J'autorise mon enfant et j'en prends la responsabilité.", resume: (x) => `${x.objet}${x.date ? " · " + dateFr(x.date) : ""}` },
  rdv: { titre: "Demander un rendez-vous", ico: "🤝", de: ["parent"], pour: ["directeur", "prof"], enfant: true,
    champs: [["avec", "Avec", "select", ["La direction", "Le professeur principal", "La vie scolaire"]], ["date", "Date souhaitée", "date"], ["texte", "À quel sujet ?", "textarea"]], resume: (x) => `${x.avec} · souhaité le ${dateFr(x.date)}` },
  question: { titre: "Poser une question à un professeur", ico: "❓", de: ["eleve"], pour: ["prof"], anonyme: true,
    champs: [["matiere", "Matière", "matiere"], ["texte", "Ta question", "textarea"]], resume: (x) => x.matiere || "" },
  paiement: { titre: "J'ai payé par Wave ou Orange Money", ico: "📲", de: ["parent"], pour: ["personnel", "directeur"], enfant: true, photo: "📷 Joindre la capture du paiement",
    aide: (cfg) => `Payez la scolarité ${cfg.wave ? `au <b>${esc(cfg.wave)}</b> (Wave ou Orange Money)` : "par Wave ou Orange Money au numéro donné par l'école"}, puis envoyez la capture : la caisse vérifie et votre reçu apparaît dans l'appli.`,
    champs: [["mois", "Pour quel mois", "select", (cfg) => moisEchus(cfg).concat(ceMois() < cfg.fin ? [isoDay(addDays(new Date(ceMois() + "-15T12:00"), 31)).slice(0, 7)] : []).map((m) => [m, m === "inscription" ? "Inscription" : moisNom(m)])],
      ["montant", "Montant payé (FCFA)", "number"], ["ref", "Référence de la transaction", "text"], ["texte", "Message (facultatif)", "textarea"]],
    resume: (x) => `${x.mois === "inscription" ? "Inscription" : moisNom(x.mois)} · ${fcfa(+x.montant || 0)}${x.ref ? " · réf. " + x.ref : ""}` },
  signalement: { titre: "Signaler un problème (confidentiel)", ico: "🛟", de: ["eleve", "parent"], pour: ["directeur"], anonyme: true,
    champs: [["texte", "Que se passe-t-il ?", "textarea"]], resume: () => "Signalement confidentiel" },
};
const STATUTS = { attente: "En attente", accepte: "Accepté", refuse: "Refusé", repondu: "Répondu" };
const badgeStatut = (s) => `<span class="badge ${s === "refuse" ? "ko" : s === "attente" ? "" : "ok"}">${STATUTS[s] || s}</span>`;
// photo d'un justificatif : réduite à 900 px pour rester légère, en gardant les proportions
function photoDocument(file) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => { const r = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * r); c.height = Math.round(img.height * r); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src); ok(c.toDataURL("image/jpeg", 0.6)); };
    img.onerror = ko; img.src = URL.createObjectURL(file);
  });
}
// demandes que ce profil doit traiter (le professeur : les questions et rendez-vous de ses classes)
function aTraiter(l) {
  return l.filter((x) => { const d = DEMANDES[x.type]; if (!d || !d.pour.includes(S.role)) return false;
    if (S.role === "prof") return (S.profClasses || []).includes(x.cid) && (x.type === "question" || x.avec === "Le professeur principal");
    if (x.type === "rdv" && S.role === "directeur") return x.avec !== "Le professeur principal";
    return true; });
}
const auteur = (x) => (x.anonyme ? "Anonyme" : x.parNom || "");
function carteDemande(x, { traiter = false } = {}) {
  const d = DEMANDES[x.type] || { titre: x.type, ico: "📨", resume: () => "" };
  return `<div class="card demande"><div class="row"><b>${d.ico} ${esc(d.titre)}</b>${badgeStatut(x.statut)}</div>
    <p class="small">${esc(d.resume(x))}${x.eleveNom ? ` · <b>${esc(x.eleveNom)}</b> (${esc(x.classe || "")})` : x.classe && !x.anonyme ? ` · ${esc(x.classe)}` : ""}</p>
    ${x.texte ? `<p>${esc(x.texte)}</p>` : ""}${x.photo ? `<img class="justif" src="${esc(x.photo)}" alt="Justificatif">` : ""}
    ${x.signe ? `<p class="small msg-ok">✍️ Signé par ${esc(x.parNom)} le ${dateFr(x.le)} : « ${esc(DEMANDES[x.type].signature)} »</p>` : ""}
    <p class="small muted">${esc(auteur(x))}${auteur(x) ? " · " : ""}le ${dateFr(x.le)}</p>
    ${x.reponse ? `<p class="small reponse"><b>Réponse${x.repNom ? " de " + esc(x.repNom) : ""} :</b> ${esc(x.reponse)}</p>` : ""}
    ${traiter && x.statut === "attente" ? `<textarea class="field rep" data-id="${esc(x.id)}" rows="2" maxlength="500" placeholder="Réponse (facultatif)"></textarea>
      <div class="row" style="gap:6px">${x.type === "question" || x.type === "signalement" ? `<button class="btn small dm" data-id="${esc(x.id)}" data-s="repondu">Répondre</button>`
        : `<button class="btn small dm" data-id="${esc(x.id)}" data-s="accepte">Accepter</button><button class="btn alt small dm" data-id="${esc(x.id)}" data-s="refuse">Refuser</button>`}</div>` : ""}</div>`;
}

// ---------- Onglet Demandes (équipe, parents) et page « Mes demandes » de l'élève
async function vueDemandes(ctx) {
  const equipe = !["parent", "eleve"].includes(S.role);
  const tout = equipe ? await Ecole.liste("demandes").catch(() => []) : [];
  const miennes = (equipe ? tout.filter((x) => x.par === Ecole.myId()) : await Ecole.liste("demandes", "par", Ecole.myId()).catch(() => [])).sort((a, b) => String(b.le).localeCompare(String(a.le)));
  const tri = aTraiter(tout).sort((a, b) => (a.statut === "attente" ? 0 : 1) - (b.statut === "attente" ? 0 : 1) || String(b.le).localeCompare(String(a.le)));
  const types = Object.entries(DEMANDES).filter(([, d]) => d.de.includes(S.role));
  const attente = tri.filter((x) => x.statut === "attente").length;
  return `${tri.length ? `<h2>À traiter (${attente})</h2>${tri.slice(0, 40).map((x) => carteDemande(x, { traiter: true })).join("")}` : equipe && !types.length ? `<p class="muted">Aucune demande pour l'instant.</p>` : ""}
    ${types.length ? `<h2>Faire une demande</h2><div class="grid rub">${types.map(([k, d]) => `<button class="subj tile dnew" data-t="${k}"><span class="ico">${d.ico}</span><b>${d.titre}</b></button>`).join("")}</div><div id="dform"></div>` : ""}
    ${types.length ? `<h2>Mes demandes</h2>${miennes.map((x) => carteDemande(x)).join("") || `<p class="small muted">Aucune demande envoyée.</p>`}` : ""}`;
}
async function formDemande(ctx, type) {
  const d = DEMANDES[type], zone = document.getElementById("dform"), cfg = await Ecole.config();
  let enfants = [];
  if (d.enfant) enfants = (await Promise.all((S.enfants || []).map((id) => Ecole.enfant(id).catch(() => null)))).filter(Boolean).map((e) => ({ ...e.fiche, id: e.fiche.id || "" }));
  if (d.enfant && !enfants.length) { zone.innerHTML = `<p class="msg-ko small">Reliez d'abord votre enfant dans « Mon enfant ».</p>`; return; }
  const champ = ([k, label, type, opts]) => type === "textarea" ? `<label class="small">${label}<textarea class="field" id="df-${k}" rows="3" maxlength="800"></textarea></label>`
    : type === "select" ? `<label class="small">${label}<select class="field" id="df-${k}">${(typeof opts === "function" ? opts(cfg) : opts).map((o) => (Array.isArray(o) ? `<option value="${esc(o[0])}">${esc(o[1])}</option>` : `<option>${o}</option>`)).join("")}</select></label>`
    : type === "matiere" ? `<label class="small">${label}<select class="field" id="df-${k}">${subjectsOf(S.level || "6e").filter((s) => !/annales/.test(s.id)).map((s) => `<option>${esc(s.name)}</option>`).join("")}</select></label>`
    : `<label class="small">${label}<input class="field" id="df-${k}" type="${type}" ${type === "date" ? `value="${today()}"` : 'maxlength="80"'}></label>`;
  zone.innerHTML = `<div class="card"><h2>${d.ico} ${d.titre}</h2>
    ${d.enfant ? `<label class="small">Enfant<select class="field" id="df-enfant">${enfants.map((f, i) => `<option value="${i}">${esc(nomComplet(f))} (${esc(f.classe)})</option>`).join("")}</select></label>` : ""}
    ${d.aide ? `<p class="small muted">${d.aide(cfg)}</p>` : ""}${d.champs.map(champ).join("")}
    ${d.photo ? `<label class="btn alt small">${d.photo === true ? "📷 Joindre une photo du justificatif" : d.photo}<input type="file" id="df-photo" accept="image/*" hidden></label><span id="df-ph" class="small muted"></span>` : ""}
    ${d.signature ? `<label class="row small"><input type="checkbox" id="df-signe"> ${d.signature}</label>` : ""}
    ${d.anonyme ? `<label class="row small"><input type="checkbox" id="df-anon"> Envoyer sans mon nom</label>` : ""}
    <button class="btn" id="df-ok">Envoyer</button><p id="df-msg" class="small"></p></div>`;
  let photo = "";
  const ph = document.getElementById("df-photo");
  if (ph) ph.onchange = async (e) => { const f = e.target.files[0]; if (!f) return; photo = await photoDocument(f).catch(() => ""); document.getElementById("df-ph").textContent = photo ? " Photo jointe ✓" : " La photo n'a pas pu être lue."; };
  document.getElementById("df-ok").onclick = async (ev) => {
    const btn = ev.currentTarget, msg = document.getElementById("df-msg"), v = (k) => (document.getElementById("df-" + k) || {}).value?.trim() || "";
    if (!v("texte") && d.champs.some(([k]) => k === "texte") && !["autorisation", "paiement"].includes(type)) { msg.className = "msg-ko small"; msg.textContent = "Écrivez quelques mots."; return; }
    if (d.signature && !document.getElementById("df-signe").checked) { msg.className = "msg-ko small"; msg.textContent = "Cochez la case pour signer l'autorisation."; return; }
    const x = { type, par: Ecole.myId(), parNom: S.role === "eleve" ? nomComplet(S.fiche) : S.role === "parent" ? "Parent" : S.staffNom || "", role: S.role, statut: "attente", le: today(), reponse: "" };
    d.champs.forEach(([k]) => (x[k] = v(k)));
    if (d.enfant) { const f = enfants[+v("enfant")]; Object.assign(x, { eleveId: (S.enfants || [])[+v("enfant")], eleveNom: nomComplet(f), classe: f.classe, cid: f.classeId || f.cid || "", parNom: f.parent || "Parent" }); }
    if (S.role === "eleve") Object.assign(x, { eleveId: Ecole.myId(), classe: S.fiche.classe, cid: S.fiche.classeId });
    if (d.anonyme && document.getElementById("df-anon").checked) { x.anonyme = true; x.parNom = ""; if (type === "signalement") { x.eleveId = ""; } }
    if (d.signature) x.signe = true;
    if (photo) x.photo = photo;
    btn.disabled = true;
    await Ecole.ecrire("demandes", null, x).then(() => (S.role === "eleve" ? viewMesDemandes() : viewEcole())).catch(() => { btn.disabled = false; msg.className = "msg-ko small"; msg.textContent = "L'envoi n'a pas abouti. Vérifiez votre connexion."; });
  };
  zone.scrollIntoView({ behavior: "smooth" });
}
async function viewMesDemandes() {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Questions et signalements</h1><p class="muted">Pose une question à tes professeurs, ou signale un problème à la direction en toute confidentialité.</p>${await vueDemandes({})}`;
  lierDemandes({});
}
function lierDemandes(ctx) {
  $view.querySelectorAll(".dnew").forEach((b) => b.onclick = () => formDemande(ctx, b.dataset.t));
  $view.querySelectorAll(".dm").forEach((b) => b.onclick = async () => {
    const x = await Ecole.lire("demandes", b.dataset.id); if (!x) return;
    const rep = $view.querySelector(`.rep[data-id="${CSS.escape(b.dataset.id)}"]`).value.trim();
    if (b.dataset.s === "repondu" && !rep) { alert("Écris d'abord ta réponse."); return; }
    b.disabled = true;
    await Ecole.ecrire("demandes", b.dataset.id, { ...sansId(x), statut: b.dataset.s, reponse: rep, repNom: S.staffNom || "", repLe: today() }).catch(() => {});
    // une dépense acceptée entre dans le registre des dépenses
    if (x.type === "depense" && b.dataset.s === "accepte") await Ecole.ecrire("registres", null, { reg: "depenses", date: today(), libelle: x.libelle, categorie: "Autre", montant: +x.montant || 0, fournisseur: "", par: Ecole.myId(), parNom: `${x.parNom} (validé par ${S.staffNom || "la direction"})`, le: today() }).catch(() => {});
    // un paiement mobile vérifié par la caisse devient un paiement enregistré, avec son reçu
    if (x.type === "paiement" && b.dataset.s === "accepte" && x.eleveId && x.mois) await Ecole.payer(x.eleveId, x.mois, true, +x.montant || 0).catch(() => {});
    viewEcole();
  });
}
Object.assign(bindEcole, { demandes: (ctx) => lierDemandes(ctx) });
