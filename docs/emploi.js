"use strict";
// Organisation des cours de Racine School : emploi du temps par classe (fait par la direction, avec alerte de conflits),
// planning de chaque professeur, absences des professeurs et remplacements, suivi du programme officiel
// (chapitres faits contre chapitres attendus à cette date), cahier de textes de la classe.

const JOURS_SEM = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const jourIdx = (d = new Date()) => (d.getDay() + 6) % 7; // 0 = lundi, 6 = dimanche
const chevauche = (a, b) => a.jour === b.jour && a.debut < b.fin && b.debut < a.fin;
const ligneCreneau = (x, { classe = false, suppr = null, alerte = "" } = {}) => `<div class="row small creneau"><span><b>${esc(x.debut)}–${esc(x.fin)}</b> ${esc(x.matiere || "")}${classe ? ` · <b>${esc(x.classe || "")}</b>` : ""}<br>
  <span class="muted">${esc(x.prof || "—")}${x.salle ? ` · ${esc(x.salle)}` : ""}</span>${alerte ? `<br><span class="ko-txt">⚠️ ${esc(alerte)}</span>` : ""}</span>${suppr !== null ? `<button class="btn alt small rmc" data-i="${suppr}" aria-label="Retirer">✕</button>` : ""}</div>`;
const tousCreneaux = (edts) => edts.flatMap((e) => (e.creneaux || []).map((x) => ({ ...x, cid: e.cid, classe: e.classe })));
// conflits : même professeur ou même salle à la même heure dans deux classes
function conflit(edts, x, cid) {
  for (const y of tousCreneaux(edts)) {
    if (y.cid === cid || !chevauche(x, y)) continue;
    if (x.prof && y.prof === x.prof) return `${x.prof} a déjà cours en ${y.classe} (${y.debut}–${y.fin})`;
    if (x.salle && y.salle === x.salle) return `${x.salle} est déjà prise par la ${y.classe}`;
  }
  return "";
}
const fracAnnee = (cfg) => { const d = new Date(cfg.debut + "-01"), [y, m] = cfg.fin.split("-").map(Number), f = new Date(y, m, 0);
  return Math.max(0, Math.min(1, (new Date(today()) - d) / (f - d))); };
const programmeDe = (sid) => (DATA.programmes || {})[sid] || [];

// ---------- Emploi du temps de la classe (direction)
async function vueEdt(ctx, cid) {
  const { cfg } = ctx, c = classeById(cfg, cid) || cfg.classes[0], edts = await Ecole.liste("edt").catch(() => []);
  const e = edts.find((x) => x.cid === c.id) || { creneaux: [] }, profs = ctx.annuaire.filter((x) => x.role === "prof").map((x) => x.nom);
  const cr = (e.creneaux || []).map((x, i) => ({ ...x, i })).sort((a, b) => a.jour - b.jour || a.debut.localeCompare(b.debut));
  return `<div class="card"><select class="field" id="ecl">${cfg.classes.map((x) => `<option value="${esc(x.id)}"${x.id === c.id ? " selected" : ""}>${esc(x.nom)}</option>`).join("")}</select></div>
    ${JOURS_SEM.map((j, ji) => { const l = cr.filter((x) => x.jour === ji); return l.length ? `<div class="card"><h2>${j}</h2>${l.map((x) => ligneCreneau(x, { suppr: x.i, alerte: conflit(edts, x, c.id) })).join("")}</div>` : ""; }).join("") || `<p class="muted">Pas encore d'emploi du temps pour ${esc(c.nom)}.</p>`}
    <div class="card"><h2>Ajouter un cours</h2>
      <label class="small">Jour<select class="field" id="ej">${JOURS_SEM.map((j, i) => `<option value="${i}">${j}</option>`).join("")}</select></label>
      <div class="row"><label class="small" style="flex:1">Début<input class="field" type="time" id="ed" value="08:00"></label><label class="small" style="flex:1">Fin<input class="field" type="time" id="ef" value="10:00"></label></div>
      <label class="small">Matière${matieresDe(c.level).replace('id="dsid"', 'id="esid"')}</label>
      <label class="small">Professeur<input class="field" id="ep" list="eprofs" maxlength="40" placeholder="Nom du professeur"><datalist id="eprofs">${profs.map((p) => `<option value="${esc(p)}">`).join("")}</datalist></label>
      <label class="small">Salle<input class="field" id="es" maxlength="20" placeholder="Ex. : Salle 4"></label>
      <button class="btn" id="eadd">Ajouter</button><p id="emsg" class="small"></p></div>`;
}

// ---------- Accueil du professeur : sa journée, ses remplacements, puis ses classes
async function vueProfAccueil(ctx) {
  const [edts, abs] = await Promise.all([Ecole.liste("edt").catch(() => []), Ecole.liste("absprofs").catch(() => [])]);
  const nom = S.staffNom || "", moi = tousCreneaux(edts).filter((x) => x.prof && x.prof === nom), j = jourIdx();
  const remp = abs.filter((a) => a.remplacant === nom && a.date >= today()).sort((a, b) => a.date.localeCompare(b.date));
  const ajd = moi.filter((x) => x.jour === j).sort((a, b) => a.debut.localeCompare(b.debut));
  return `<div class="card"><h2>Ma journée</h2>${ajd.map((x) => ligneCreneau(x, { classe: true })).join("") || `<p class="small muted">${moi.length ? "Pas de cours aujourd'hui." : `Aucun cours à ton nom (« ${esc(nom)} ») dans les emplois du temps de l'école.`}</p>`}
      ${moi.length ? `<details><summary class="small"><b>Toute ma semaine (${moi.length} cours)</b></summary>${JOURS_SEM.map((jn, ji) => { const l = moi.filter((x) => x.jour === ji).sort((a, b) => a.debut.localeCompare(b.debut)); return l.length ? `<p class="small"><b>${jn}</b></p>${l.map((x) => ligneCreneau(x, { classe: true })).join("")}` : ""; }).join("")}</details>` : ""}</div>
    ${remp.length ? `<div class="card"><h2>Mes remplacements</h2>${remp.map((a) => `<p class="small"><b>${jourFr(a.date)}</b> : tu remplaces ${esc(a.profNom)}${a.classes ? ` (${esc(a.classes)})` : ""}.</p>`).join("")}</div>` : ""}
    ${vueClassesProf(ctx)}`;
}

// ---------- Équipe (direction) : absences des professeurs et remplaçants
async function vueEquipeComplete(ctx) {
  const base = vueEquipe(ctx);
  if (S.role !== "directeur") return base;
  const [abs, edts] = await Promise.all([Ecole.liste("absprofs").catch(() => []), Ecole.liste("edt").catch(() => [])]);
  const profs = ctx.annuaire.filter((x) => x.role === "prof");
  const avenir = abs.filter((a) => a.date >= today()).sort((a, b) => a.date.localeCompare(b.date));
  return `<div class="card"><h2>Absences des professeurs</h2>
      ${avenir.map((a) => `<div class="row small creneau"><span><b>${esc(a.profNom)}</b> · ${jourFr(a.date)}${a.motif ? ` · ${esc(a.motif)}` : ""}<br><span class="muted">${a.classes ? `Classes : ${esc(a.classes)} · ` : ""}${a.remplacant ? `remplacé par ${esc(a.remplacant)}` : `<span class="ko-txt">pas de remplaçant</span>`}</span></span><button class="btn alt small rmabs" data-id="${esc(a.id)}">✕</button></div>`).join("") || `<p class="small muted">Aucune absence prévue.</p>`}
      <details><summary class="small"><b>Déclarer une absence</b></summary>
        <label class="small">Professeur<select class="field" id="abp">${profs.map((p) => `<option>${esc(p.nom)}</option>`).join("")}</select></label>
        <label class="small">Date<input class="field" type="date" id="abd" value="${today()}"></label>
        <input class="field" id="abm" maxlength="80" placeholder="Motif (facultatif)">
        <label class="small">Remplaçant<select class="field" id="abr"><option value="">Aucun pour l'instant</option>${profs.map((p) => `<option>${esc(p.nom)}</option>`).join("")}</select></label>
        <button class="btn alt" id="abadd">Enregistrer</button></details></div>${base}`;
}

// ---------- Programme officiel et cahier de textes
async function vueProgramme(ctx, cid, sid) {
  const { cfg } = ctx, classes = S.role === "prof" ? mesClassesProf(cfg) : cfg.classes;
  if (!classes.length) return `<div class="card"><p class="muted">Choisis d'abord tes classes dans l'onglet « Mes classes ».</p></div>`;
  const progs = await Ecole.liste("progressions").catch(() => []), attendu = Math.round(100 * fracAnnee(cfg));
  let suivi = "";
  if (S.role === "directeur" && !cid) {
    const retards = progs.map((p) => ({ p, c: classeById(cfg, p.cid), fait: pct((p.faits || []).length, programmeDe(p.sid).length) })).filter((x) => x.c && attendu - x.fait > 15).sort((a, b) => a.fait - b.fait);
    suivi = `<div class="card"><h2>Suivi du programme</h2><p class="small muted">À cette date, environ ${attendu} % du programme devrait être fait. ${progs.length} progressions suivies dans l'école.</p>
      ${retards.length ? `<p class="small"><b class="ko-txt">En retard de plus de 15 points (${retards.length}) :</b></p>${barChart(retards.slice(0, 15).map((x) => [`${x.c.nom} · ${subjName(x.p.sid)}`, x.fait, `${x.fait} %${x.p.parNom ? " · " + x.p.parNom : ""}`]))}` : `<p class="small msg-ok">Aucune classe en retard notable.</p>`}</div>`;
  }
  const c = classeById(cfg, cid) || classes[0], mats = subjectsOf(c.level).filter((s) => programmeDe(s.id).length), s = mats.find((x) => x.id === sid) || mats[0];
  const ch = s ? programmeDe(s.id) : [], p = s ? progs.find((x) => x.cid === c.id && x.sid === s.id) : null, faits = (p && p.faits) || [];
  const seances = (await Ecole.liste("seances", "cid", c.id).catch(() => [])).filter((x) => !s || !x.sid || x.sid === s.id).sort((a, b) => b.date.localeCompare(a.date));
  return `${suivi}<div class="card"><select class="field" id="pcl">${classes.map((x) => `<option value="${esc(x.id)}"${x.id === c.id ? " selected" : ""}>${esc(x.nom)}</option>`).join("")}</select>
      <select class="field" id="psid">${mats.map((x) => `<option value="${x.id}"${s && x.id === s.id ? " selected" : ""}>${esc(x.name)}</option>`).join("")}</select></div>
    ${s ? `<div class="card"><div class="row"><h2>Programme de ${esc(s.name)}</h2><b>${pct(faits.length, ch.length)} %</b></div>
      <div class="bar"><i style="width:${pct(faits.length, ch.length)}%"></i></div><p class="small muted">Attendu à cette date : environ ${attendu} %.${p && p.parNom ? ` Mis à jour par ${esc(p.parNom)} le ${dateFr(p.le)}.` : ""}</p>
      ${ch.map((t, i) => `<label class="row small chap"><span>${i + 1}. ${esc(t)}</span><input type="checkbox" class="pch" value="${i}"${faits.includes(i) ? " checked" : ""}${S.role === "prof" || S.role === "directeur" ? "" : " disabled"}></label>`).join("")}</div>` : `<p class="muted">Pas de programme enregistré pour cette classe.</p>`}
    <div class="card"><h2>Cahier de textes · ${esc(c.nom)}</h2><p class="small muted">Rempli par les professeurs au moment de l'appel.</p>
      ${seances.map((x) => `<div class="row small creneau"><span><b>${esc(x.matiere || "")}</b> : ${esc(x.titre)}<br><span class="muted">${esc(x.parNom || "")}</span></span><span class="muted">${dateFr(x.date)}</span></div>`).join("") || `<p class="small muted">Rien pour l'instant.</p>`}</div>`;
}

// ---------- Côté élève : cahier de textes de la classe
async function viewCahier() {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  $view.innerHTML = `<h1>Cahier de textes</h1><p class="muted">Chargement…</p>`;
  const l = (await Ecole.liste("seances", "cid", S.fiche.classeId).catch(() => [])).sort((a, b) => b.date.localeCompare(a.date));
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Cahier de textes</h1><p class="muted">Ce qui a été fait en ${esc(S.fiche.classe)}, cours par cours : pratique pour rattraper une absence.</p>
    ${l.map((x) => `<div class="card"><div class="row"><b>${esc(x.matiere || "")}</b><span class="small muted">${jourFr(x.date)}</span></div><p>${esc(x.titre)}</p>
      <div class="row small"><span class="muted">${esc(x.parNom || "")}</span>${x.sid ? `<a class="btn alt small" href="#quiz/${x.sid}">Réviser</a>` : ""}</div></div>`).join("") || `<p class="muted">Rien pour l'instant.</p>`}`;
}
// emploi du temps du jour sur l'accueil de l'élève
async function edtDuJour() {
  if (!S.fiche) return "";
  const e = await Ecole.lire("edt", S.fiche.classeId).catch(() => null), j = jourIdx();
  const l = ((e && e.creneaux) || []).filter((x) => x.jour === j).sort((a, b) => a.debut.localeCompare(b.debut));
  return l.length ? `<div class="card"><h2>🕘 Mes cours aujourd'hui</h2>${l.map((x) => ligneCreneau(x)).join("")}</div>` : "";
}

Object.assign(bindEcole, {
  edt: (ctx, cid) => {
    const cl = document.getElementById("ecl"), c = classeById(ctx.cfg, cl.value);
    cl.onchange = () => go("ecole/edt/" + encodeURIComponent(cl.value));
    const charger = async () => (await Ecole.lire("edt", c.id).catch(() => null)) || { cid: c.id, classe: c.nom, creneaux: [] };
    $view.querySelectorAll(".rmc").forEach((b) => b.onclick = async () => {
      const e = await charger(); e.creneaux = e.creneaux.filter((_, i) => i !== +b.dataset.i);
      await Ecole.ecrire("edt", c.id, { cid: c.id, classe: c.nom, creneaux: e.creneaux }).catch(() => {}); viewEcole();
    });
    document.getElementById("eadd").onclick = async () => {
      const v = (id) => document.getElementById(id).value.trim(), msg = document.getElementById("emsg"), sid = v("esid");
      const x = { jour: +v("ej"), debut: v("ed"), fin: v("ef"), sid, matiere: sid ? subjName(sid) : "Vie scolaire", prof: v("ep"), salle: v("es") };
      if (!x.debut || !x.fin || x.fin <= x.debut) { msg.className = "msg-ko small"; msg.textContent = "L'heure de fin doit venir après l'heure de début."; return; }
      const e = await charger();
      if (e.creneaux.some((y) => chevauche(x, y))) { msg.className = "msg-ko small"; msg.textContent = "Cette classe a déjà un cours sur ce créneau."; return; }
      const al = conflit(await Ecole.liste("edt").catch(() => []), x, c.id);
      if (al && !confirm(`Attention : ${al}. Ajouter quand même ?`)) return;
      await Ecole.ecrire("edt", c.id, { cid: c.id, classe: c.nom, creneaux: [...e.creneaux, x] }).catch(() => {}); viewEcole();
    };
  },
  equipe: (ctx) => {
    $view.querySelectorAll(".retirer").forEach((b) => b.onclick = async () => {
      if (!confirm("Retirer cette personne de l'équipe ?")) return;
      await Ecole.retirerAcces(b.dataset.id).catch(() => {}); viewEcole();
    });
    $view.querySelectorAll(".rmabs").forEach((b) => b.onclick = async () => { await Ecole.effacer("absprofs", b.dataset.id).catch(() => {}); viewEcole(); });
    const add = document.getElementById("abadd");
    if (add) add.onclick = async () => {
      const v = (id) => document.getElementById(id).value.trim(), date = v("abd") || today(), j = jourIdx(new Date(date + "T12:00"));
      const edts = await Ecole.liste("edt").catch(() => []);
      const classes = [...new Set(tousCreneaux(edts).filter((x) => x.prof === v("abp") && x.jour === j).map((x) => x.classe))].join(", ");
      await Ecole.ecrire("absprofs", null, { profNom: v("abp"), date, motif: v("abm"), remplacant: v("abr"), classes, par: Ecole.myId() }).catch(() => {}); viewEcole();
    };
  },
  programme: (ctx, cid) => {
    const cl = document.getElementById("pcl"), ps = document.getElementById("psid");
    if (cl) cl.onchange = () => go("ecole/programme/" + encodeURIComponent(cl.value));
    if (ps) ps.onchange = () => go(`ecole/programme/${encodeURIComponent(cl.value)}/${ps.value}`);
    $view.querySelectorAll(".pch").forEach((b) => b.onchange = async () => {
      const c = classeById(ctx.cfg, cl.value), faits = [...$view.querySelectorAll(".pch:checked")].map((x) => +x.value);
      await Ecole.ecrire("progressions", `${c.id}_${ps.value}`, { cid: c.id, sid: ps.value, faits, par: Ecole.myId(), parNom: S.staffNom || "", le: today() }).catch(() => {}); viewEcole();
    });
  },
});
