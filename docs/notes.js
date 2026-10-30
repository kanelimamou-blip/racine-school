"use strict";
// Notes et bulletins de Racine School : saisie des évaluations par les professeurs (coefficients, sur combien),
// moyennes par matière et générale, rangs, appréciations proposées, bulletins imprimables, conseil de classe,
// résultats de l'école pour la direction, « Mes notes » pour l'élève et ses parents.

const TRIMESTRES = ["1", "2", "3"];
const TYPES_EVAL = ["Devoir surveillé", "Interrogation", "Composition", "Exposé", "Travaux pratiques"];
const sur20 = (n, sur) => (n === null || n === undefined || n === "" ? null : (20 * +n) / (+sur || 20));
const n2 = (x) => (x === null || x === undefined ? "—" : String(Math.round(x * 100) / 100).replace(".", ","));
const coefMatiere = (cfg, matiere) => +((cfg.coefs || {})[matiere]) || 1;
const appreciation = (m) => m === null ? "" : m >= 16 ? "Excellent travail" : m >= 14 ? "Très bon travail" : m >= 12 ? "Bon travail" : m >= 10 ? "Assez bien, peut mieux faire" : m >= 8 ? "Travail insuffisant" : "Travail très insuffisant, des efforts s'imposent";
const mention = (m) => m === null ? "" : m >= 16 ? "Félicitations du conseil" : m >= 14 ? "Encouragements" : m >= 12 ? "Tableau d'honneur" : m >= 10 ? "" : m >= 8 ? "Mise en garde" : "Avertissement travail";
const rangFr = (r, f) => (r ? (r === 1 ? (f === "F" ? "1re" : "1er") : r + "e") : "—");

// moyennes d'un élève à partir des évaluations d'un trimestre
function moyennesEleve(cfg, evals, eid) {
  const mats = {};
  for (const e of evals) {
    const v = sur20(e.notes && e.notes[eid], e.sur);
    if (v === null) continue;
    const k = e.matiere || e.sid, m = (mats[k] = mats[k] || { matiere: k, sid: e.sid, s: 0, c: 0, notes: [] });
    m.s += v * (+e.coef || 1); m.c += +e.coef || 1; m.notes.push({ titre: e.titre, note: +e.notes[eid], sur: e.sur, coef: e.coef, date: e.date });
  }
  const list = Object.values(mats).map((m) => ({ ...m, moy: m.s / m.c, coef: coefMatiere(cfg, m.matiere) })).sort((a, b) => a.matiere.localeCompare(b.matiere, "fr"));
  const c = list.reduce((n, m) => n + m.coef, 0);
  return { mats: list, gen: c ? list.reduce((n, m) => n + m.moy * m.coef, 0) / c : null };
}
// toute une classe : moyennes, rangs par matière et rang général
function calculClasse(cfg, eleves, evals) {
  const res = eleves.map((f) => ({ f, ...moyennesEleve(cfg, evals, f.id) }));
  const classe = (vals) => { const s = vals.filter((v) => v !== null).sort((a, b) => b - a); return (v) => (v === null ? null : s.indexOf(v) + 1); };
  const rg = classe(res.map((r) => r.gen));
  const parMat = {};
  res.forEach((r) => r.mats.forEach((m) => (parMat[m.matiere] = parMat[m.matiere] || []).push(m.moy)));
  const rangMat = Object.fromEntries(Object.entries(parMat).map(([k, v]) => [k, classe(v)]));
  const moyMat = Object.fromEntries(Object.entries(parMat).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length]));
  res.forEach((r) => { r.rang = rg(r.gen); r.mats.forEach((m) => { m.rang = rangMat[m.matiere](m.moy); m.moyClasse = moyMat[m.matiere]; }); });
  const notes = res.filter((r) => r.gen !== null);
  return { res, effectif: notes.length, moyClasse: notes.length ? notes.reduce((n, r) => n + r.gen, 0) / notes.length : null,
    reussite: notes.length ? pct(notes.filter((r) => r.gen >= 10).length, notes.length) : 0,
    max: notes.length ? Math.max(...notes.map((r) => r.gen)) : null, min: notes.length ? Math.min(...notes.map((r) => r.gen)) : null };
}
const evalsDe = async (cid) => Ecole.liste("notes", "cid", cid).catch(() => []);
const absencesClasse = async (cid) => { const a = await Ecole.liste("appels", "cid", cid).catch(() => []); const n = {}; a.forEach((x) => (x.absents || []).forEach((id) => (n[id] = (n[id] || 0) + 1))); return n; };
const segTrim = (trim, href) => `<div class="row onglets">${TRIMESTRES.map((t) => `<a class="btn alt small${t === trim ? " on" : ""}" href="${href(t)}">${t === "1" ? "1er" : t + "e"} trimestre</a>`).join("")}</div>`;
const classesNotes = (cfg) => (S.role === "prof" ? mesClassesProf(cfg) : cfg.classes);

// ---------- Saisie des notes (professeur, direction)
async function vueNotes(ctx, cid, evalId) {
  const { cfg, eleves } = ctx, classes = classesNotes(cfg);
  if (!classes.length) return `<div class="card"><p class="muted">Choisis d'abord tes classes dans l'onglet « Mes classes ».</p></div>`;
  const c = classeById(cfg, cid) || classes[0], l = eleves.filter((f) => f.cid === c.id), evals = await evalsDe(c.id);
  if (evalId) {
    const e = evals.find((x) => x.id === evalId) || { trimestre: S.trimestre || "1", coef: 1, sur: 20, type: "Devoir surveillé", date: today(), notes: {} };
    const neuf = !evals.some((x) => x.id === evalId);
    return `<a class="small" href="#ecole/notes/${encodeURIComponent(c.id)}">← ${esc(c.nom)}</a>
      <div class="card"><h2>${neuf ? "Nouvelle évaluation" : esc(e.titre)} · ${esc(c.nom)}</h2>
        <label class="small">Matière${matieresDe(c.level).replace('id="dsid"', 'id="nsid"').replace(`value="${e.sid}"`, `value="${e.sid}" selected`)}</label>
        <label class="small">Intitulé<input class="field" id="ntitre" maxlength="60" value="${esc(e.titre || "")}" placeholder="Ex. : Devoir n° 1"></label>
        <div class="row"><label class="small" style="flex:1">Type<select class="field" id="ntype">${TYPES_EVAL.map((t) => `<option${t === e.type ? " selected" : ""}>${t}</option>`).join("")}</select></label>
          <label class="small" style="flex:1">Trimestre<select class="field" id="ntrim">${TRIMESTRES.map((t) => `<option${t === e.trimestre ? " selected" : ""}>${t}</option>`).join("")}</select></label></div>
        <div class="row"><label class="small" style="flex:1">Coefficient<input class="field" type="number" id="ncoef" min="0.5" max="10" step="0.5" value="${e.coef}"></label>
          <label class="small" style="flex:1">Noté sur<input class="field" type="number" id="nsur" min="1" max="100" value="${e.sur}"></label>
          <label class="small" style="flex:1">Date<input class="field" type="date" id="ndate" value="${e.date}"></label></div></div>
      <div class="card"><h2>Notes (${l.length} élèves)</h2><p class="small muted">Laisse vide pour un élève absent ou non noté.</p>
        ${l.map((f) => `<label class="row small note-l">${avatar(f)}<span class="grow">${esc(nomComplet(f))}</span><input class="field nnote" type="number" inputmode="decimal" min="0" step="0.25" data-id="${esc(f.id)}" value="${e.notes[f.id] ?? ""}"></label>`).join("") || `<p class="muted">Aucun élève dans cette classe.</p>`}
        <p class="small" id="nstat"></p></div>
      <button class="btn" id="nsave" data-id="${esc(evalId)}">Enregistrer les notes</button><p id="nmsg" class="small"></p>
      ${neuf ? "" : `<button class="btn alt" id="ndel">Supprimer cette évaluation</button>`}`;
  }
  const trim = S.trimestre || "1", list = evals.filter((e) => e.trimestre === trim).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return `<div class="card"><select class="field" id="ncl">${classes.map((x) => `<option value="${esc(x.id)}"${x.id === c.id ? " selected" : ""}>${esc(x.nom)}</option>`).join("")}</select>
      <a class="btn" href="#ecole/notes/${encodeURIComponent(c.id)}/nouvelle-${Date.now().toString(36)}">➕ Nouvelle évaluation</a></div>
    ${TRIMESTRES.length ? `<div class="row onglets">${TRIMESTRES.map((t) => `<button class="btn alt small ntr${t === trim ? " on" : ""}" data-t="${t}">${t === "1" ? "1er" : t + "e"} trimestre</button>`).join("")}</div>` : ""}
    ${list.map((e) => { const v = Object.values(e.notes || {}).filter((x) => x !== null && x !== ""), m = v.length ? v.reduce((a, b) => a + sur20(b, e.sur), 0) / v.length : null;
      return `<a class="card lib-card" href="#ecole/notes/${encodeURIComponent(c.id)}/${encodeURIComponent(e.id)}"><div class="row"><b>${esc(e.matiere || "")} · ${esc(e.titre)}</b><span class="badge ok">coef ${n2(+e.coef)}</span></div>
        <span class="small muted">${esc(e.type)} · ${dateFr(e.date)} · ${v.length} notes · moyenne ${n2(m)} / 20${e.parNom ? ` · ${esc(e.parNom)}` : ""}</span></a>`; }).join("") || `<p class="muted">Aucune évaluation ce trimestre pour ${esc(c.nom)}.</p>`}
    <a class="btn alt" href="#ecole/bulletins/${encodeURIComponent(c.id)}/${trim}">📑 Moyennes et bulletins de ${esc(c.nom)}</a>`;
}

// ---------- Bulletins d'une classe, conseil de classe, résultats de l'école
async function vueBulletins(ctx, cid, trim) {
  trim = TRIMESTRES.includes(trim) ? trim : "1";
  const { cfg, eleves } = ctx, classes = classesNotes(cfg);
  if (!classes.length) return `<div class="card"><p class="muted">Choisis d'abord tes classes dans l'onglet « Mes classes ».</p></div>`;
  const c = classeById(cfg, cid) || classes[0];
  const [evals, abs] = await Promise.all([evalsDe(c.id), absencesClasse(c.id)]);
  const k = calculClasse(cfg, eleves.filter((f) => f.cid === c.id), evals.filter((e) => e.trimestre === trim));
  const tri = k.res.slice().sort((a, b) => (a.rang || 999) - (b.rang || 999));
  const difficulte = tri.filter((r) => r.gen !== null && r.gen < 10);
  let ecole = "";
  if (S.role === "directeur" && !cid) {
    const toutes = await Ecole.liste("notes").catch(() => []), t = toutes.filter((e) => e.trimestre === trim);
    const lignes = cfg.classes.map((x) => ({ x, k: calculClasse(cfg, eleves.filter((f) => f.cid === x.id), t.filter((e) => e.cid === x.id)) })).filter((y) => y.k.effectif);
    const parMat = {}; t.forEach((e) => Object.values(e.notes || {}).forEach((v) => { const s = sur20(v, e.sur); if (s !== null) (parMat[e.matiere] = parMat[e.matiere] || []).push(s); }));
    const parProf = {}; t.forEach((e) => Object.values(e.notes || {}).forEach((v) => { const s = sur20(v, e.sur); if (s !== null) (parProf[e.parNom || "—"] = parProf[e.parNom || "—"] || []).push(s); }));
    const moy = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    ecole = lignes.length ? `<div class="card"><h2>Résultats de l'école</h2><p class="small muted">Moyenne générale de chaque classe et part des élèves à 10 ou plus.</p>
      ${barChart(lignes.sort((a, b) => b.k.moyClasse - a.k.moyClasse).map((y) => [y.x.nom, y.k.moyClasse * 5, `${n2(y.k.moyClasse)} · ${y.k.reussite} %`]))}
      <h3>Par matière</h3>${barChart(Object.entries(parMat).map(([m, a]) => [m, moy(a) * 5, n2(moy(a))]).sort((a, b) => b[1] - a[1]))}
      <h3>Par professeur</h3>${barChart(Object.entries(parProf).map(([m, a]) => [m, moy(a) * 5, n2(moy(a))]).sort((a, b) => b[1] - a[1]))}</div>` : "";
  }
  return `${segTrim(trim, (t) => `#ecole/bulletins/${encodeURIComponent(cid || "")}/${t}`)}${ecole}
    <div class="card"><select class="field" id="bcl">${classes.map((x) => `<option value="${esc(x.id)}"${x.id === c.id ? " selected" : ""}>${esc(x.nom)}</option>`).join("")}</select></div>
    <div class="card"><h2>Conseil de classe · ${esc(c.nom)}</h2>
      <div class="mini4"><div><b class="count">${n2(k.moyClasse)}</b><span class="small muted">moyenne</span></div><div><b class="count">${k.reussite} %</b><span class="small muted">à 10 ou plus</span></div>
        <div><b class="count ok-txt">${n2(k.max)}</b><span class="small muted">plus forte</span></div><div><b class="count ko-txt">${n2(k.min)}</b><span class="small muted">plus faible</span></div></div>
      ${tri.filter((r) => r.rang && r.rang <= 3).length ? `<p class="small"><b>Tableau d'honneur :</b> ${tri.filter((r) => r.gen >= 12).slice(0, 8).map((r) => esc(nomComplet(r.f))).join(", ") || "personne"}</p>` : ""}
      ${difficulte.length ? `<p class="small"><b class="ko-txt">En difficulté (${difficulte.length}) :</b> ${difficulte.map((r) => `${esc(nomComplet(r.f))} (${n2(r.gen)})`).join(", ")}</p>` : ""}</div>
    <div class="card"><h2>Classement</h2>${tri.map((r) => `<a class="lib eleve" href="#ecole/bulletin/${encodeURIComponent(r.f.id)}/${trim}">${avatar(r.f)}<span class="grow"><b>${esc(nomComplet(r.f))}</b><br><span class="small muted">${rangFr(r.rang, r.f.sexe)} · ${abs[r.f.id] || 0} absence${(abs[r.f.id] || 0) > 1 ? "s" : ""}${mention(r.gen) ? " · " + mention(r.gen) : ""}</span></span><b>${n2(r.gen)}</b></a>`).join("") || `<p class="muted">Aucune note ce trimestre.</p>`}</div>`;
}

// bulletin d'un élève : par la classe (équipe, avec rangs) ou par son relevé (élève, parent)
function bulletinHtml(cfg, f, trim, b, extra = {}) {
  return `<div class="card doc bulletin" contenteditable="${isStaff() && S.role !== "parent"}" spellcheck="false">${enteteDoc(cfg)}
    <h2 class="doc-titre">Bulletin du ${trim === "1" ? "1er" : trim + "e"} trimestre</h2>
    <div class="row small"><span>Élève</span><b>${esc(nomComplet(f))}</b></div>
    <div class="row small"><span>Classe</span><b>${esc(f.classe)}${extra.effectif ? ` · ${extra.effectif} élèves` : ""}</b></div>
    <table class="tab-notes"><thead><tr><th>Matière</th><th>Moy.</th><th>Coef</th>${extra.effectif ? "<th>Rang</th><th>Classe</th>" : ""}<th>Appréciation</th></tr></thead>
      <tbody>${b.mats.map((m) => `<tr><td>${esc(m.matiere)}</td><td><b>${n2(m.moy)}</b></td><td>${n2(m.coef)}</td>${extra.effectif ? `<td>${rangFr(m.rang, f.sexe)}</td><td>${n2(m.moyClasse)}</td>` : ""}<td>${appreciation(m.moy)}</td></tr>`).join("") || `<tr><td colspan="6">Pas encore de notes.</td></tr>`}</tbody></table>
    <div class="row"><span>Moyenne générale</span><b class="count">${n2(b.gen)} / 20</b></div>
    ${extra.effectif ? `<div class="row small"><span>Rang</span><b>${rangFr(b.rang, f.sexe)} sur ${extra.effectif}</b></div><div class="row small"><span>Moyenne de la classe</span><b>${n2(extra.moyClasse)}</b></div>` : ""}
    ${extra.absences !== undefined ? `<div class="row small"><span>Absences relevées</span><b>${extra.absences}</b></div>` : ""}
    <div class="row small"><span>Décision du conseil</span><b>${mention(b.gen) || "—"}</b></div>
    <p class="small"><b>Appréciation générale :</b> ${appreciation(b.gen)}.</p>
    ${extra.effectif ? `<p style="text-align:right" class="small">Le Directeur<br><br><br></p>` : ""}</div>`;
}
async function vueBulletin(ctx, eid, trim) {
  trim = TRIMESTRES.includes(trim) ? trim : "1";
  const { cfg } = ctx;
  if (S.role === "parent") {
    const e = await Ecole.enfant(eid).catch(() => null); if (!e) return `<div class="card"><p>Élève introuvable.</p></div>`;
    const f = rattacher(cfg, [e.fiche])[0], ev = (await Ecole.releve(eid, f.cid)).filter((x) => x.trimestre === trim);
    return `<a class="small noprint" href="#ecole">← Retour</a>${segTrim(trim, (t) => `#ecole/bulletin/${encodeURIComponent(eid)}/${t}`)}${bulletinHtml(cfg, f, trim, moyennesEleve(cfg, ev, eid))}
      <div class="btns noprint"><button class="btn" onclick="print()">🖨️ Imprimer</button></div>`;
  }
  const f = ctx.eleves.find((x) => x.id === eid); if (!f) return `<div class="card"><p>Élève introuvable.</p></div>`;
  const [evals, abs] = await Promise.all([evalsDe(f.cid), absencesClasse(f.cid)]);
  const k = calculClasse(cfg, ctx.eleves.filter((x) => x.cid === f.cid), evals.filter((e) => e.trimestre === trim)), r = k.res.find((x) => x.f.id === eid);
  return `<a class="small noprint" href="#ecole/bulletins/${encodeURIComponent(f.cid)}/${trim}">← ${esc(f.classe)}</a>
    <p class="small muted noprint">Les appréciations sont proposées d'après les notes : touche le texte pour les modifier avant d'imprimer.</p>
    ${segTrim(trim, (t) => `#ecole/bulletin/${encodeURIComponent(eid)}/${t}`)}${bulletinHtml(cfg, f, trim, r, { effectif: k.effectif, moyClasse: k.moyClasse, absences: abs[eid] || 0 })}
    <div class="btns noprint"><button class="btn" onclick="print()">🖨️ Imprimer</button>${boutonParent(f, `Bonjour ${f.parent || ""}, le bulletin du ${trim === "1" ? "1er" : trim + "e"} trimestre de ${f.prenom} est disponible : moyenne générale ${n2(r.gen)} / 20, rang ${rangFr(r.rang, f.sexe)} sur ${k.effectif}. Racine School.`, "Envoyer le résultat au parent sur WhatsApp")}</div>`;
}

// ---------- Côté élève : « Mes notes »
async function viewMesNotes(arg) {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  const trim = TRIMESTRES.includes(arg) ? arg : "1", cfg = await Ecole.config().catch(() => ECOLE_DEFAUT), id = Ecole.myId();
  $view.innerHTML = `<h1>Mes notes</h1><p class="muted">Chargement…</p>`;
  const ev = (await Ecole.releve(id, S.fiche.classeId).catch(() => [])).filter((x) => x.trimestre === trim), b = moyennesEleve(cfg, ev, id);
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Mes notes</h1>${segTrim(trim, (t) => `#notes/${t}`)}
    <div class="card"><div class="row"><h2>Moyenne générale</h2><b class="count">${n2(b.gen)}</b></div>${mention(b.gen) ? `<p class="small msg-ok">${mention(b.gen)}</p>` : ""}</div>
    ${b.mats.map((m) => `<div class="card"><div class="row"><h2>${esc(m.matiere)}</h2><b>${n2(m.moy)} / 20</b></div>
      ${m.notes.map((n) => `<div class="row small"><span>${esc(n.titre)} · ${dateFr(n.date)}${+n.coef !== 1 ? ` · coef ${n2(+n.coef)}` : ""}</span><b>${n2(n.note)} / ${n.sur}</b></div>`).join("")}
      ${m.sid && m.moy < 12 ? `<a class="btn alt small" href="#quiz/${m.sid}">Réviser ${esc(m.matiere)}</a>` : ""}</div>`).join("") || `<p class="muted">Pas encore de notes ce trimestre.</p>`}
    <details class="card"><summary><b>Mon bulletin</b></summary>${bulletinHtml(cfg, S.fiche, trim, b)}</details>`;
}

Object.assign(bindEcole, {
  notes: (ctx, cid, evalId) => {
    const cl = document.getElementById("ncl");
    if (cl) cl.onchange = () => go("ecole/notes/" + encodeURIComponent(cl.value));
    $view.querySelectorAll(".ntr").forEach((b) => b.onclick = () => { S.trimestre = b.dataset.t; store.save(); viewEcole(); });
    const save = document.getElementById("nsave");
    if (!save) return;
    const c = classeById(ctx.cfg, cid) || classesNotes(ctx.cfg)[0], ids = ctx.eleves.filter((f) => f.cid === c.id).map((f) => f.id);
    const stat = () => { const sur = +document.getElementById("nsur").value || 20, v = [...$view.querySelectorAll(".nnote")].map((i) => i.value).filter((x) => x !== "").map(Number);
      document.getElementById("nstat").textContent = v.length ? `${v.length} notes · moyenne ${n2(v.reduce((a, b) => a + b, 0) / v.length)} / ${sur} · ${v.filter((x) => x * 20 / sur >= 10).length} à la moyenne` : ""; };
    $view.querySelectorAll(".nnote").forEach((i) => i.oninput = stat); stat();
    save.onclick = async () => {
      const v = (id) => document.getElementById(id).value, msg = document.getElementById("nmsg"), sur = +v("nsur") || 20;
      const notes = {}; let faux = false;
      $view.querySelectorAll(".nnote").forEach((i) => { if (i.value !== "") { const n = +i.value; if (!(n >= 0 && n <= sur)) faux = true; notes[i.dataset.id] = n; } });
      if (!v("ntitre").trim()) { msg.className = "msg-ko small"; msg.textContent = "Donne un intitulé à l'évaluation."; return; }
      if (faux) { msg.className = "msg-ko small"; msg.textContent = `Une note dépasse ${sur} ou est négative.`; return; }
      save.disabled = true;
      const sid = v("nsid");
      await Ecole.sauverEvaluation(evalId.startsWith("nouvelle-") ? null : evalId, { cid: c.id, classe: c.nom, sid, matiere: sid ? subjName(sid) : "Vie scolaire", titre: v("ntitre").trim(), type: v("ntype"), trimestre: v("ntrim"), coef: +v("ncoef") || 1, sur, date: v("ndate") || today(), notes, par: Ecole.myId(), parNom: S.staffNom || "" }, ids)
        .then(() => go("ecole/notes/" + encodeURIComponent(c.id))).catch(() => { save.disabled = false; msg.className = "msg-ko small"; msg.textContent = "L'enregistrement n'a pas abouti."; });
    };
    const del = document.getElementById("ndel");
    if (del) del.onclick = async () => { if (!confirm("Supprimer cette évaluation et ses notes ?")) return; await Ecole.supprimerEvaluation(evalId, ids).catch(() => {}); go("ecole/notes/" + encodeURIComponent(c.id)); };
  },
  bulletins: (ctx, cid, trim) => {
    const cl = document.getElementById("bcl");
    if (cl) cl.onchange = () => go(`ecole/bulletins/${encodeURIComponent(cl.value)}/${trim || "1"}`);
  },
  bulletin: () => {},
});
