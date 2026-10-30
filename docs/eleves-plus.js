"use strict";
// Côté élèves : badges, absences et retards, clubs, orientation, devoirs rendus en photo et corrigés, défi entre classes,
// analyse d'une classe par matière, interrogation imprimable avec son corrigé.

// ---------- Badges, calculés sur ce téléphone à partir des révisions
function serieJours() {
  const jours = new Set(S.days), d = new Date();
  if (!jours.has(isoDay(d))) d.setDate(d.getDate() - 1);
  let n = 0; while (jours.has(isoDay(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function badgesEleve(assid) {
  const st = Object.values(S.stats), rep = st.reduce((n, s) => n + s.ok + s.ko, 0), serie = serieJours();
  const parfaits = S.sessions.filter((x) => x.total >= 5 && x.score === x.total).length, mats = new Set(Object.keys(S.stats).map((q) => q.replace(/-\d+$/, ""))).size;
  const m = ceMois(), dansMois = (o) => Object.keys(o || {}).filter((d) => d.startsWith(m)).length;
  return [
    ["🌱", "Premiers pas", "Répondre à 10 questions", rep >= 10], ["📗", "Bon élève", "100 réponses", rep >= 100], ["📚", "Grand travailleur", "500 réponses", rep >= 500], ["🏆", "Champion", "2 000 réponses", rep >= 2000],
    ["🎯", "Sans faute", "Un quiz d'au moins 5 questions réussi à 100 %", parfaits >= 1], ["💎", "Perfectionniste", "10 quiz sans faute", parfaits >= 10],
    ["🔥", "Régulier", "Réviser 3 jours de suite", serie >= 3], ["⚡", "Inarrêtable", "Réviser 7 jours de suite", serie >= 7], ["🗓️", "Fidèle", "30 jours de révision", S.days.length >= 30],
    ["🧭", "Curieux", "Réviser dans 5 matières", mats >= 5], ["✅", "Toujours là", "Aucune absence ce mois-ci", !!assid && !dansMois(assid.abs)], ["⏰", "Ponctuel", "Aucun retard ce mois-ci", !!assid && !dansMois(assid.ret)],
  ];
}
async function viewBadges() {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  const b = badgesEleve(await Ecole.lire("assiduite", Ecole.myId()).catch(() => null) || { abs: {}, ret: {} }), n = b.filter((x) => x[3]).length;
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Mes badges</h1><p class="muted">${n} badge${n > 1 ? "s" : ""} sur ${b.length} · série en cours : ${serieJours()} jour${serieJours() > 1 ? "s" : ""}</p>
    <div class="grid rub">${b.map(([ico, t, d, ok]) => `<div class="subj tile badge-t${ok ? "" : " off"}"><span class="ico">${ico}</span><b>${t}</b><span class="small muted">${d}</span></div>`).join("")}</div>`;
}

// ---------- Absences et retards : notés à l'appel et au portail, visibles par l'élève et ses parents
async function noterAssiduite(touches, etat, classe) {
  for (const id of touches) {
    const a = (await Ecole.lire("assiduite", id).catch(() => null)) || {}, abs = { ...(a.abs || {}) }, ret = { ...(a.ret || {}) };
    delete abs[today()]; delete ret[today()];
    if (etat(id) === "A") abs[today()] = classe; if (etat(id) === "R") ret[today()] = classe;
    await Ecole.ecrire("assiduite", id, { abs, ret }).catch(() => {});
  }
}
function listeAssiduite(a) {
  const l = [...Object.keys(a.abs || {}).map((d) => [d, "Absence"]), ...Object.keys(a.ret || {}).map((d) => [d, "Retard"])].sort((x, y) => y[0].localeCompare(x[0]));
  return `<div class="row"><div><p class="small muted">Absences</p><p class="count">${Object.keys(a.abs || {}).length}</p></div><div><p class="small muted">Retards</p><p class="count">${Object.keys(a.ret || {}).length}</p></div></div>
    ${l.slice(0, 30).map(([d, t]) => `<div class="row small"><span>${jourFr(d)}</span><span class="${t === "Absence" ? "ko-txt" : ""}">${t}</span></div>`).join("") || `<p class="small muted">Aucune absence ni retard cette année. Bravo !</p>`}`;
}
async function assiduiteCarte(eid) {
  const a = (await Ecole.lire("assiduite", eid).catch(() => null)) || {};
  return `<div class="card"><h2>Absences et retards</h2>${listeAssiduite(a)}<p class="small muted">Une absence à justifier ? Utilisez « Démarches ».</p></div>`;
}
async function viewAssiduite() {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Mes absences et retards</h1>${await assiduiteCarte(Ecole.myId())}`;
}

// ---------- Clubs et activités : la direction les crée, les élèves s'inscrivent
async function viewClubs() {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  const moi = Ecole.myId(), [clubs, miens] = await Promise.all([Ecole.liste("clubs").catch(() => []), Ecole.liste("membres", "par", moi).catch(() => [])]);
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Clubs et activités</h1>
    ${clubs.map((c) => { const in_ = miens.some((m) => m.club === c.id);
      return `<div class="card"><div class="row"><b>${esc(c.nom)}</b>${in_ ? `<span class="badge ok">Inscrit</span>` : ""}</div><p class="small muted">${esc(c.jour || "")}${c.responsable ? ` · avec ${esc(c.responsable)}` : ""}</p><p class="small">${esc(c.description || "")}</p>
        <button class="btn ${in_ ? "alt " : ""}small club" data-id="${esc(c.id)}" data-in="${in_ ? 1 : ""}">${in_ ? "Me désinscrire" : "M'inscrire"}</button></div>`; }).join("") || `<p class="muted">Aucun club pour l'instant.</p>`}`;
  $view.querySelectorAll(".club").forEach((b) => b.onclick = async () => {
    const id = `${b.dataset.id}_${moi}`;
    if (b.dataset.in) await Ecole.effacer("membres", id).catch(() => {});
    else await Ecole.ecrire("membres", id, { club: b.dataset.id, par: moi, nom: nomComplet(S.fiche), classe: S.fiche.classe, le: today() }).catch(() => {});
    viewClubs();
  });
}
async function vueClubs() {
  const [clubs, membres] = await Promise.all([Ecole.liste("clubs").catch(() => []), Ecole.liste("membres").catch(() => [])]);
  return `<a class="small" href="#ecole/registres">← Registres</a><h2>🎭 Clubs et activités</h2>
    ${S.role === "directeur" ? `<details class="card"><summary><b>➕ Créer un club</b></summary>
      <input class="field" id="cnom" maxlength="50" placeholder="Nom (ex. : Club de lecture, Football, Théâtre)"><input class="field" id="cjour" maxlength="50" placeholder="Quand (ex. : mercredi 15 h, salle 4)">
      <input class="field" id="cresp" maxlength="50" placeholder="Responsable"><textarea class="field" id="cdesc" rows="2" maxlength="300" placeholder="En quelques mots"></textarea><button class="btn" id="cadd2">Créer</button></details>` : ""}
    ${clubs.map((c) => { const l = membres.filter((m) => m.club === c.id);
      return `<div class="card"><div class="row"><b>${esc(c.nom)}</b>${S.role === "directeur" ? `<button class="btn alt small crm" data-id="${esc(c.id)}">✕</button>` : ""}</div><p class="small muted">${esc(c.jour || "")}${c.responsable ? ` · ${esc(c.responsable)}` : ""}</p>
        <details><summary class="small"><b>${l.length} inscrit${l.length > 1 ? "s" : ""}</b></summary>${l.map((m) => `<p class="small">${esc(m.nom)} (${esc(m.classe)})</p>`).join("")}</details></div>`; }).join("") || `<p class="muted">Aucun club pour l'instant.</p>`}`;
}

// ---------- Orientation : les séries après la 3e et la 2nde, et les points forts de l'élève dans l'appli
const SERIES_INFO = [
  ["2nde L", "Littéraire : français, langues, histoire-géographie, philosophie ensuite."], ["2nde S", "Scientifique : mathématiques, physique-chimie, SVT."],
  ["L1a, L1b, L2, L'", "Séries littéraires de 1ère et Tle : langues vivantes, lettres, philosophie."], ["S1", "Mathématiques et physique-chimie renforcées."],
  ["S2", "Sciences de la vie et de la terre, avec physique-chimie."], ["S3, S4, S5", "Séries techniques et scientifiques spécialisées, selon les lycées."], ["G", "Économie et gestion."],
  ["Après le bac", "Université, grandes écoles, BTS, formations professionnelles : demandez au conseiller d'orientation."],
];
function pointsForts() {
  const mat = {};
  for (const [qid, s] of Object.entries(S.stats)) { const sid = qid.replace(/-\d+$/, ""), m = (mat[sid] = mat[sid] || [0, 0]); m[0] += s.ok + s.ko; m[1] += s.ok; }
  return Object.entries(mat).filter(([, [n]]) => n >= 10).map(([sid, [n, ok]]) => ({ sid, nom: subjName(sid), r: Math.round((100 * ok) / n) })).sort((a, b) => b.r - a.r);
}
function viewOrientation() {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  const pf = pointsForts(), niv = niveauOf(S.level || "6e"), college = ["6e", "5e", "4e"].includes(niv);
  const sci = pf.filter((x) => /math|physi|svt|science/i.test(x.nom)), lit = pf.filter((x) => /fran|anglais|espagnol|arabe|histoire|philo|lettre/i.test(x.nom));
  const moy = (l) => (l.length ? l.reduce((a, b) => a + b.r, 0) / l.length : null), ms = moy(sci), ml = moy(lit);
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Orientation</h1>
    <div class="card"><h2>Mes points forts dans l'appli</h2>${pf.length ? `${barChart(pf.slice(0, 6).map((x) => [x.nom, x.r, `${x.r} %`]))}
      ${ms !== null && ml !== null ? `<p class="small">Tu réussis ${ms > ml + 5 ? "mieux dans les matières scientifiques" : ml > ms + 5 ? "mieux dans les matières littéraires" : "aussi bien en sciences qu'en lettres"}. C'est un indice, pas une décision : parles-en avec ton professeur principal et tes parents.</p>` : ""}`
      : `<p class="small muted">Réponds à au moins 10 questions dans plusieurs matières pour voir tes points forts.</p>`}</div>
    <div class="card"><h2>Les séries au lycée</h2>${college ? `<p class="small">Pas de choix à faire pour l'instant : travaille toutes les matières. En fin de 3e, tu choisiras entre la seconde L et la seconde S.</p>` : ""}
      ${SERIES_INFO.map(([s, d]) => `<p class="small"><b>${s}</b> : ${d}</p>`).join("")}<p class="small muted">Les séries proposées dépendent des lycées. Renseigne-toi auprès de la direction.</p></div>`;
}

// ---------- Devoirs rendus en photo, corrigés par le professeur
async function viewRendre() {
  if (S.role !== "eleve" || !S.fiche) return go("accueil");
  const moi = Ecole.myId(), d14 = isoDay(addDays(new Date(), -14));
  const [dv, rendus] = await Promise.all([Ecole.devoirs(S.fiche.classeId || S.fiche.classe).catch(() => []), Ecole.liste("rendus", "par", moi).catch(() => [])]);
  const l = dv.filter((d) => d.date >= d14).sort((a, b) => a.date.localeCompare(b.date));
  $view.innerHTML = `<a class="small" href="#accueil">← Accueil</a><h1>Rendre un devoir</h1><p class="muted">Photographie ta copie : ton professeur la corrige dans l'appli.</p>
    ${l.map((d) => { const r = rendus.find((x) => x.devoir === d.id);
      return `<div class="card"><div class="row"><b>${esc(d.type)} · ${esc(d.sid ? subjName(d.sid) : d.nom || "")}</b><span class="small muted">${jourFr(d.date)}</span></div>${d.note ? `<p class="small muted">${esc(d.note)}</p>` : ""}
        ${r ? `<p class="small msg-ok">Rendu le ${dateFr(r.le)}.</p>${r.corrige ? `<div class="reponse small"><b>Correction${r.note !== "" && r.note !== undefined ? ` : ${esc(r.note)}` : ""}</b>${r.commentaire ? `<br>${esc(r.commentaire)}` : ""}</div>` : `<p class="small muted">En attente de correction.</p>`}` : ""}
        ${!r || !r.corrige ? `<label class="btn alt small">📷 ${r ? "Remplacer ma photo" : "Rendre ma copie en photo"}<input type="file" class="rfic" data-id="${esc(d.id)}" accept="image/*" hidden></label>` : ""}</div>`; }).join("") || `<p class="muted">Aucun devoir ces deux dernières semaines.</p>`}`;
  $view.querySelectorAll(".rfic").forEach((i) => i.onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const photo = await photoDocument(f).catch(() => ""); if (!photo) return;
    await Ecole.ecrire("rendus", `${i.dataset.id}_${moi}`, { devoir: i.dataset.id, cid: S.fiche.classeId, par: moi, nom: nomComplet(S.fiche), photo, le: today(), corrige: false }).catch(() => alert("L'envoi n'a pas abouti."));
    viewRendre();
  });
}
async function vueRendus(ctx, devoirId) {
  const dir = S.role === "directeur", mes = (d) => dir || (S.profClasses || []).includes(d.cid);
  if (!devoirId) {
    const l = ctx.devoirs.filter((d) => mes(d) && d.date >= isoDay(addDays(new Date(), -21))).sort((a, b) => b.date.localeCompare(a.date)), rendus = await Ecole.liste("rendus").catch(() => []);
    return `<a class="small" href="#ecole/devoirs">← Devoirs</a><h2>📥 Copies rendues</h2>${l.map((d) => { const r = rendus.filter((x) => x.devoir === d.id), ac = r.filter((x) => !x.corrige).length;
      return `<a class="lib" href="#ecole/rendus/${encodeURIComponent(d.id)}"><span class="grow"><b>${esc(d.classe)} · ${esc(d.type)} de ${esc(d.sid ? subjName(d.sid) : d.nom || "")}</b><br><span class="small muted">${jourFr(d.date)}</span></span><span class="small">${r.length} copie${r.length > 1 ? "s" : ""}${ac ? ` · <b>${ac} à corriger</b>` : ""}</span></a>`; }).join("") || `<p class="muted">Aucun devoir ces trois dernières semaines.</p>`}`;
  }
  const d = ctx.devoirs.find((x) => x.id === devoirId), r = (await Ecole.liste("rendus", "devoir", devoirId).catch(() => [])).sort((a, b) => a.nom.localeCompare(b.nom));
  return `<a class="small" href="#ecole/rendus">← Copies rendues</a><h2>${d ? `${esc(d.classe)} · ${esc(d.type)} de ${esc(d.sid ? subjName(d.sid) : d.nom || "")}` : "Devoir"}</h2>
    ${r.map((x) => `<div class="card"><div class="row"><b>${esc(x.nom)}</b><span class="small muted">rendu le ${dateFr(x.le)}</span></div><a href="${esc(x.photo)}" target="_blank"><img class="copie" src="${esc(x.photo)}" alt="Copie de ${esc(x.nom)}"></a>
      <div class="row"><input class="field rnote" style="max-width:110px" data-id="${esc(x.id)}" value="${esc(x.note ?? "")}" placeholder="Note" maxlength="8"><input class="field rcom" data-id="${esc(x.id)}" value="${esc(x.commentaire || "")}" placeholder="Commentaire" maxlength="300"></div>
      <button class="btn ${x.corrige ? "alt " : ""}small rok" data-id="${esc(x.id)}">${x.corrige ? "Corrigé ✓ (modifier)" : "Rendre la correction"}</button></div>`).join("") || `<p class="muted">Aucune copie rendue pour l'instant.</p>`}`;
}

// ---------- Défi entre classes : régularité et réussite des élèves dans l'appli
function classementClasses(ctx) {
  return ctx.cfg.classes.map((c) => {
    const l = ctx.eleves.filter((f) => f.cid === c.id), r = l.filter((f) => reussite(f) !== null);
    const jours = l.reduce((n, f) => n + ((f.stats || {}).jours7 || 0), 0) / (l.length || 1), reu = r.length ? r.reduce((n, f) => n + reussite(f), 0) / r.length : 0;
    return { id: c.id, nom: c.nom, n: l.length, score: Math.round(jours * 10 + reu * 0.3) };
  }).filter((x) => x.n >= 3).sort((a, b) => b.score - a.score);
}
function vueDefi(ctx) {
  const l = classementClasses(ctx);
  return `<div class="card"><h2>🏁 Défi entre classes</h2><p class="small muted">Points sur 100 : jours de révision des 7 derniers jours (70 points) et réussite aux questions (30 points), en moyenne par élève.</p>
    ${barChart(l.slice(0, 15).map((x, i) => [`${["🥇", "🥈", "🥉"][i] || i + 1 + "."} ${x.nom}`, x.score, `${x.score} pts`]))}
    ${S.role === "directeur" ? `<button class="btn" id="dpub2">Publier le classement pour les élèves</button><p id="dmsg2" class="small"></p>` : ""}</div>
    <div class="card"><h2>Analyse par classe</h2><div class="chips">${l.map((x) => `<a class="btn alt small" href="#ecole/analyse/${encodeURIComponent(x.id)}">${esc(x.nom)}</a>`).join("")}</div></div>`;
}
async function defiCarteEleve() {
  const d = await Ecole.lire("ecole", "defi").catch(() => null);
  if (!d || !(d.classement || []).length) return "";
  const rang = d.classement.findIndex((x) => x.id === S.fiche.classeId);
  return `<div class="card"><h2>🏁 Défi entre classes</h2>${d.classement.slice(0, 5).map((x, i) => `<div class="row small"><span>${["🥇", "🥈", "🥉"][i] || i + 1 + "."} ${esc(x.nom)}</span><b>${x.score} pts</b></div>`).join("")}
    ${rang >= 0 ? `<p class="small">Ta classe est <b>${rang + 1}${rang ? "e" : "re"}</b> sur ${d.classement.length}. Chaque jour de révision compte !</p>` : ""}<p class="small muted">Classement du ${dateFr(d.le)}.</p></div>`;
}

// ---------- Analyse d'une classe : réussite par matière dans l'appli, élèves à aider
function vueAnalyse(ctx, cid) {
  const c = classeById(ctx.cfg, cid); if (!c) return `<p>Classe introuvable.</p>`;
  const l = ctx.eleves.filter((f) => f.cid === c.id), agg = {};
  l.forEach((f) => Object.entries((f.stats || {}).mat || {}).forEach(([sid, [n, ok]]) => { const a = (agg[sid] = agg[sid] || [0, 0]); a[0] += n; a[1] += ok; }));
  const mats = Object.entries(agg).filter(([, [n]]) => n >= 10).map(([sid, [n, ok]]) => ({ sid, r: Math.round((100 * ok) / n), n })).sort((a, b) => a.r - b.r);
  const aider = (sid) => l.filter((f) => { const m = ((f.stats || {}).mat || {})[sid]; return m && m[0] >= 5 && m[1] / m[0] < 0.5; });
  return `<a class="small" href="${S.role === "directeur" ? "#ecole/defi" : "#ecole"}">← Retour</a><h2>📊 Analyse de ${esc(c.nom)}</h2>${c.pp ? `<p class="small muted">Professeur principal : ${esc(c.pp)}</p>` : ""}
    <div class="card"><h2>Réussite par matière</h2><p class="small muted">Questions de l'appli auxquelles les ${l.length} élèves ont répondu. Les matières les plus difficiles d'abord.</p>
      ${mats.length ? barChart(mats.map((m) => [subjName(m.sid), m.r, `${m.r} %`])) : `<p class="small muted">Pas encore assez de réponses.</p>`}</div>
    ${mats.slice(0, 3).map((m) => { const a = aider(m.sid); return a.length ? `<div class="card"><h2>À aider en ${esc(subjName(m.sid))}</h2>${a.slice(0, 8).map((f) => `<p class="small">${esc(nomComplet(f))}</p>`).join("")}${a.length > 8 ? `<p class="small muted">et ${a.length - 8} autres</p>` : ""}</div>` : ""; }).join("")}`;
}

// ---------- Interrogation imprimable, avec la page du corrigé
function interroHtml(cfg, classe, sid, qs) {
  return `<div class="card doc">${enteteDoc(cfg)}<h2 class="doc-titre">Interrogation de ${esc(subjName(sid))}</h2><p class="small">Classe : ${esc(classe)} · Nom : ............................................ · Date : ......................</p>
    ${qs.map((q, i) => `<div class="interro-q"><p><b>${i + 1}.</b> ${esc(q.q)}</p><p class="small">${q.c.map((c, k) => `☐ ${LETTERS[k]}. ${esc(c)}`).join("&nbsp;&nbsp;&nbsp; ")}</p></div>`).join("")}</div>
    <div class="card doc saut"><h2 class="doc-titre">Corrigé</h2>${qs.map((q, i) => `<p class="small"><b>${i + 1}. ${LETTERS[q.a]}</b> · ${esc(q.e)}</p>`).join("")}</div>`;
}

Object.assign(bindEcole, {
  clubs: () => {
    const add = document.getElementById("cadd2"), v = (id) => document.getElementById(id).value.trim();
    if (add) add.onclick = async () => { if (!v("cnom")) return; await Ecole.ecrire("clubs", null, { nom: v("cnom"), jour: v("cjour"), responsable: v("cresp"), description: v("cdesc"), le: today() }).catch(() => {}); viewEcole(); };
    $view.querySelectorAll(".crm").forEach((b) => b.onclick = async () => { if (!confirm("Supprimer ce club ?")) return; await Ecole.effacer("clubs", b.dataset.id).catch(() => {}); viewEcole(); });
  },
  rendus: () => $view.querySelectorAll(".rok").forEach((b) => b.onclick = async () => {
    const x = await Ecole.lire("rendus", b.dataset.id); if (!x) return;
    const q = (c) => $view.querySelector(`${c}[data-id="${CSS.escape(b.dataset.id)}"]`).value.trim();
    await Ecole.ecrire("rendus", b.dataset.id, { ...sansId(x), note: q(".rnote"), commentaire: q(".rcom"), corrige: true, corrigeNom: S.staffNom || "" }).catch(() => {});
    b.textContent = "Corrigé ✓ (modifier)"; b.classList.add("alt");
  }),
  defi: (ctx) => {
    const b = document.getElementById("dpub2");
    if (b) b.onclick = async () => {
      await Ecole.ecrire("ecole", "defi", { classement: classementClasses(ctx).map(({ id, nom, score }) => ({ id, nom, score })), le: today() }).catch(() => {});
      const m = document.getElementById("dmsg2"); m.className = "msg-ok small"; m.textContent = "Classement publié : les élèves le voient sur leur accueil.";
    };
  },
});
// l'appel et le portail tiennent à jour les absences et retards de chaque élève
const lierAppelBase = bindEcole.appel;
bindEcole.appel = (ctx) => {
  lierAppelBase(ctx);
  const btn = document.getElementById("asave"), sel = document.getElementById("acl");
  if (btn) btn.addEventListener("click", () => {
    const c = classeById(ctx.cfg, sel.value), etat = (id) => ($view.querySelector(`.appel-l[data-id="${CSS.escape(id)}"]`) || { dataset: {} }).dataset.e;
    const avant = ctx.appels.filter((a) => a.cid === c.id && a.par === Ecole.myId()).flatMap((a) => [...(a.absents || []), ...(a.retards || [])]);
    const touches = [...new Set([...[...$view.querySelectorAll('.appel-l[data-e="A"], .appel-l[data-e="R"]')].map((b) => b.dataset.id), ...avant])];
    noterAssiduite(touches, etat, c.nom);
  });
};
const lierQuizBase = bindEcole.quiz;
bindEcole.quiz = (ctx) => {
  lierQuizBase(ctx);
  const b = document.getElementById("qprint");
  if (b) b.onclick = () => {
    const sid = document.getElementById("qsid").value, n = +document.getElementById("qnb").value || 10, cl = classeById(ctx.cfg, document.getElementById("qcl").value);
    document.getElementById("qzone").innerHTML = `${interroHtml(ctx.cfg, cl ? cl.nom : "", sid, shuffle(DATA.questions.filter((q) => q.s === sid)).slice(0, n))}<div class="btns noprint"><button class="btn" onclick="print()">🖨️ Imprimer</button></div>`;
  };
};
