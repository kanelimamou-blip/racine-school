"use strict";
// Racine School, appli de révision de l'école : quiz, examen blanc, erreurs à revoir, progrès, accès premium par code
const $view = document.getElementById("view");
const LETTERS = "ABCD";
const QUIZ_LEN = 20, EXAM_LEN = 30, EXAM_MIN = 30;
let DATA = null, CFG = null, timer = null;

const store = {
  load() { try { return JSON.parse(localStorage.getItem("racine") || "{}"); } catch { return {}; } },
  save() { try { localStorage.setItem("racine", JSON.stringify(S)); } catch {} Compte.save(S); },
};
const S = Object.assign({ level: null, premium: false, stats: {}, sessions: [], days: [] }, store.load());

// la flèche de vecteur combinante (F⃗) manque dans beaucoup de polices de téléphone : on la dessine en CSS
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])).replace(/([A-Za-zℓ]{1,2}?)\u20d7/g, '<span class="vec">$1</span>');
const today = () => new Date().toISOString().slice(0, 10);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fcfa = (n) => n.toLocaleString("fr-FR") + " FCFA";
// « Tle S2 » appartient aussi à la famille « Tle S » (matières communes à toutes les séries S)
const family = (level) => { const [c, sr] = String(level).split(" "); return sr ? `${c} ${DATA.families[sr] || sr}` : c; };
const matches = (levels, level) => levels.includes(level) || levels.includes(family(level));
const subjectsOf = (level) => DATA.subjects.filter((s) => matches(s.levels, level));
const inLevel = (q) => subjectsOf(S.level).some((s) => s.id === q.s);
const examOf = () => CFG.exams[String(S.level).split(" ")[0]] || null;
const blancName = () => (examOf() ? "Examen blanc" : "Devoir blanc");
// Essai gratuit : tout est débloqué pendant TRIAL_DAYS jours à partir de la première ouverture
const TRIAL_DAYS = 10;
if (!S.trialStart) { S.trialStart = today(); store.save(); }
const trialLeft = () => Math.max(0, TRIAL_DAYS - Math.floor((new Date(today()) - new Date(S.trialStart)) / 864e5));
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isPremium = () => S.premium || trialLeft() > 0 || isStaff();
const open = (q) => isPremium() || q.free;
const qsOf = (sid) => DATA.questions.filter((q) => q.s === sid);
// Tirage sans répétition : d'abord les questions jamais vues, puis celles ratées, puis les plus anciennes ;
// l'ordre des réponses est mélangé à chaque fois pour qu'on ne retienne pas « c'est la B ».
function pickFresh(pool, n) {
  const now = Date.now(), score = (q) => { const st = S.stats[q.id]; if (!st) return Math.random();
    const ageDays = (now - (st.t || 0)) / 864e5; return (st.last === false ? 2 : 4) + (st.ok + st.ko) - Math.min(ageDays, 30) / 10 + Math.random(); };
  return pool.map((q) => [score(q), q]).sort((a, b) => a[0] - b[0]).slice(0, n).map(([, q]) => remix(q));
}
function remix(q) {
  const order = shuffle([0, 1, 2, 3]);
  return { ...q, c: order.map((i) => q.c[i]), a: order.indexOf(q.a) };
}
// Questions de la base + questions générées (nombres nouveaux à chaque fois) pour les abonnés et pendant l'essai
function mixQuestions(sid, pool, n, chapters = null) {
  const g = isPremium() && typeof genQuestions === "function" ? genQuestions(sid, Math.round(n * 0.4), chapters) : [];
  return shuffle([...pickFresh(pool, n - g.length), ...g]);
}
const subjName = (sid) => (DATA.subjects.find((s) => s.id === sid) || {}).name || "";

function mastery(sid) {
  const qs = qsOf(sid), done = qs.filter((q) => S.stats[q.id] && S.stats[q.id].last).length;
  return Math.round((100 * done) / qs.length);
}
function record(q, ok) {
  const st = S.stats[q.id] || { ok: 0, ko: 0 };
  if (q.gen) { const d = (S.daily = S.daily || {})[today()] || { n: 0, ok: 0 }; d.n++; d.ok += ok; S.daily[today()] = d; store.save(); return; }
  st[ok ? "ok" : "ko"]++; st.last = ok; st.t = Date.now(); S.stats[q.id] = st;
  if (!S.days.includes(today())) S.days.push(today());
  const d = (S.daily = S.daily || {})[today()] || { n: 0, ok: 0 }; d.n++; d.ok += ok; S.daily[today()] = d;
  store.save();
}
// Missions du jour (programme des 10 jours d'essai, puis programme quotidien)
const doneToday = (tag) => ((S.done || {})[today()] || []).includes(tag);
function markDone(tag) { S.done = S.done || {}; const t = S.done[today()] || []; if (!t.includes(tag)) { t.push(tag); S.done[today()] = t; store.save(); } }
function streak() {
  let n = 0; const d = new Date();
  if (!S.days.includes(today())) d.setDate(d.getDate() - 1);
  while (S.days.includes(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// ---------- Choix de la classe puis de la série
function viewLevel() {
  const cls = location.hash.split("/")[1] ? decodeURIComponent(location.hash.split("/")[1]) : null;
  const series = cls && DATA.series[cls];
  const pick = (l, sub) => `<button class="subj lvl" data-l="${esc(l)}"${l === S.level ? ' aria-pressed="true"' : ""}><b>${esc(l)}</b><span class="small muted">${sub}</span></button>`;
  const info = (l) => { const ex = CFG.exams[l.split(" ")[0]]; return ex ? "Année du " + ex[0] : subjectsOf(l).length + " matières"; };
  $view.innerHTML = series
    ? `<h1>Quelle série en ${esc(cls)} ?</h1><div class="grid">${series.map((sr) => pick(`${cls} ${sr}`, `${subjectsOf(`${cls} ${sr}`).length} matières`)).join("")}</div>
       <a class="btn alt" href="#classe">Retour aux classes</a>`
    : `<h1>Tu es en quelle classe ?</h1>
       <p class="muted">Tu pourras changer plus tard en touchant ta classe en haut de l'écran.</p>
       <div class="grid">${DATA.classes.map((c) => DATA.series[c]
         ? `<a class="subj lvl" href="#classe/${encodeURIComponent(c)}" style="text-decoration:none;color:inherit"${String(S.level).startsWith(c + " ") ? ' aria-pressed="true"' : ""}><b>${esc(c)}</b><span class="small muted">${CFG.exams[c] ? "Année du " + CFG.exams[c][0] + " · " : ""}séries ${DATA.series[c].join(", ")}</span></a>`
         : pick(c, info(c))).join("")}</div>`;
  $view.querySelectorAll("[data-l]").forEach((b) => b.onclick = () => { S.level = b.dataset.l; store.save(); go("accueil"); });
}

// ---------- Accueil
const notionsOf = (level) => subjectsOf(level).flatMap((s) => ((DATA.notions || {})[s.id] || []).map((c) => ({ ...c, sid: s.id, sname: s.name })));
const exercisesOf = (level) => (DATA.exercises || []).filter((e) => matches(e.levels, level));
// Exercices et sujets types fabriqués à la demande (exos_gen.js) : nombres nouveaux à chaque essai
const genExosOf = (level) => (typeof EXGEN === "undefined" ? [] : subjectsOf(level).flatMap((s) => (EXGEN[s.id] || []).map((t, k) => ({ id: `gx-${s.id}-${k}`, subject: s.name, title: t.t }))));
const genSujetsOf = (level) => (typeof EXGEN === "undefined" ? [] : subjectsOf(level).filter((s) => (EXGEN[s.id] || []).length >= 3).map((s) => ({ id: `gs-${s.id}`, subject: s.name })));
function rubriques() {
  const nAnn = annalesOf(S.level).length, nGs = genSujetsOf(S.level).length, nGx = genExosOf(S.level).length, nEx = exercisesOf(S.level).length + annalesOf(S.level).filter((a) => a.guided).length + nGx;
  const exam = examOf() ? examOf()[0] : "BAC", nNot = notionsOf(S.level).length;
  const tile = (href, icon, title, sub) => `<a class="subj tile" href="${href}"><span class="ico">${icon}</span><b>${title}</b><span class="small muted">${sub}</span></a>`;
  return [
    nAnn || nGs ? tile("#annales", "📚", examOf() ? `Sujets du ${exam}` : "Devoirs types", `${nAnn ? `${nAnn} sujet${nAnn > 1 ? "s" : ""} rédigé${nAnn > 1 ? "s" : ""}` : ""}${nAnn && nGs ? " + " : ""}${nGs ? "un sujet neuf à chaque essai" : ""}, corrigés pas à pas`) : "",
    tile("#matiere", "🗂️", "Mes matières", "Chapitre par chapitre : cours, synthèse, formules, exercices, QCM"),
    tile("#agenda", "🗓️", "Mon agenda", "Emploi du temps, devoirs à rendre, rappels du soir"),
    tile("#assistant", "💬", "Pose ta question", "Une notion pas claire ? Je réponds avec le cours"),
    tile("#devoir", "🎯", "Préparer un devoir", "Choisis la matière et les chapitres du programme"),
    tile("#qcm-list", "✅", "QCM corrigés", "Chaque choix corrigé et expliqué"),
    tile("#exercices", "✏️", "Exercices corrigés", nEx ? `${nEx} exercices pas à pas${nGx ? ", nombres nouveaux à chaque essai" : ""}` : "Bientôt pour ta classe"),
    nNot ? tile("#notions", "📖", "Notions de cours", `${nNot} chapitres : cours, exemples, exercice corrigé`) : "",
    tile("#fiches", "📝", "Synthèses de cours", "L'essentiel à retenir"),
    tile("#apprendre", "🚀", "Mieux apprendre", "Plan de révision, diagnostic, jour J, dictées, cartes mentales"),
    tile("#vie", "🌍", "Les cours dans la vie", "Marché, factures Senelec et eau, solaire, route"),
    tile("#outils", "🧰", "Mes outils", "Fiches flash, formulaire, moyenne, minuteur, journal"),
    tile("#challenge", "🏆", "Challenge du jour", "Toutes les matières, résultats en graphique"),
    tile("#duo", "👥", "Session de groupe", "De 2 à 10 élèves, classement en direct"),
    tile("#examen", "⏱️", blancName(), `${EXAM_LEN} questions en ${EXAM_MIN} min${isPremium() ? "" : " 🔒"}`),
  ].join("");
}
// Vidéo de présentation (45 s), proposée sur l'accueil pendant les premiers jours
function tutoCard() {
  if (S.premium || S.tutoVu || S.eco) return "";
  return `<div class="card tuto"><div class="row"><h2>▶️ Découvre l'appli en 45 secondes</h2><button class="btn alt small" id="tuto-x" aria-label="Fermer">✕</button></div>
    <video src="tuto.mp4" controls playsinline preload="none" poster="apercu.png"></video></div>`;
}
function programme() {
  const n = Math.min(TRIAL_DAYS, Math.floor((new Date(today()) - new Date(S.trialStart)) / 864e5) + 1);
  const weakest = subjectsOf(S.level).filter((s) => !/annales/.test(s.id)).sort((a, b) => mastery(a.id) - mastery(b.id))[0];
  const third = n % 3 === 1 ? ["exo", "#exercices", "Fais un exercice corrigé"] : n % 3 === 2 ? (() => { const ch = (DATA.notions || {})[weakest && weakest.id] || [];
    return ch.length ? ["fiche", `#notion/${ch[Math.floor(n / 3) % ch.length].id}`, `Apprends un chapitre de ${weakest.name} : ${ch[Math.floor(n / 3) % ch.length].title}`] : ["fiche", weakest ? `#fiche/${weakest.id}` : "#fiches", "Lis une synthèse de cours"]; })() : ["duo", "#duo", "Fais une session de groupe avec tes camarades"];
  const missions = [["challenge", "#challenge", "Fais le challenge du jour (toutes matières)"],
    ["qcm", weakest ? `#quiz/${weakest.id}` : "#qcm-list", `QCM dans ta matière la plus faible${weakest ? " : " + weakest.name : ""}`], third];
  const done = missions.filter(([t]) => doneToday(t)).length;
  const trial = !S.premium && n <= TRIAL_DAYS;
  return `<div class="card prog"><div class="row"><h2>${trial ? `Mon programme : jour ${n} / ${TRIAL_DAYS}` : "Mes missions du jour"}</h2><b>${done}/3</b></div>
    ${missions.map(([t, href, label]) => `<a class="mission${doneToday(t) ? " done" : ""}" href="${href}"><span>${doneToday(t) ? "✅" : "⬜"}</span><span>${esc(label)}</span></a>`).join("")}
    ${done === 3 ? `<p class="msg-ok small">Bravo, journée réussie ! Reviens demain pour garder ta série 🔥</p>` : `<p class="small muted">3 missions par jour, environ 20 minutes.</p>`}</div>`;
}
function viewHome() {
  const ex = examOf();
  const days = ex ? Math.max(0, Math.ceil((new Date(ex[1]) - new Date(today())) / 864e5)) : 0;
  const answered = Object.values(S.stats).reduce((n, s) => n + s.ok + s.ko, 0);
  const free = DATA.questions.filter((q) => q.free && inLevel(q));
  const daily = free[Math.floor(new Date(today()).getTime() / 864e5) % free.length];
  const subs = subjectsOf(S.level).map((s) => `
    <a class="subj" href="${(DATA.programmes || {})[s.id] && !/annales/.test(s.id) ? "#matiere/" : "#quiz/"}${s.id}" style="text-decoration:none;color:inherit">
      <b>${esc(s.name)}</b>
      <span class="small muted">${s.count} questions${(GEN[s.id] || []).length ? " + ∞ à nombres nouveaux" : ""}${isPremium() ? "" : ` · <span class="lock">🔒</span>`}</span>
      <span class="bar"><i style="width:${mastery(s.id)}%"></i></span>
    </a>`).join("");
  $view.innerHTML = `
    ${isIOS && !standalone ? `<div class="card small"><b>Installer sur iPhone :</b> ouvre ce lien dans Safari, appuie sur Partager (carré avec une flèche) puis sur « Sur l'écran d'accueil ».</div>` : ""}
    ${!S.premium && trialLeft() > 0 ? `<a class="trial" href="#premium">🎁 Essai gratuit : tout est débloqué encore <b>${trialLeft()} jour${trialLeft() > 1 ? "s" : ""}</b></a>` : ""}
    ${!isPremium() ? `<a class="trial" href="#premium">🔒 Ton essai gratuit de ${TRIAL_DAYS} jours est terminé. Abonne-toi pour tout retrouver, avec tes progrès.</a>` : ""}
    <div class="card">
      <div class="row">${ex ? `<div><p class="small muted">${ex[0]} ${ex[1].slice(0, 4)}, date indicative</p><p class="count">J−${days}</p></div>`
        : `<div><p class="small muted">Réponses données</p><p class="count">${answered}</p></div>`}
      <div style="text-align:right"><p class="small muted">Série en cours</p><p class="count">${streak()} 🔥</p></div></div>
    </div>
    ${ficheCard()}
    <div id="ecole-accueil"></div>
    ${typeof profilCard === "function" ? profilCard() : ""}
    ${typeof planCard === "function" ? planCard() : ""}
    ${agendaCard()}
    ${typeof citationCard === "function" ? citationCard() : ""}
    ${tutoCard()}
    ${programme()}
    <h2>Rubriques</h2>
    <div class="grid rub">${rubriques()}</div>
    <div class="card" id="daily">
      <h2><span class="hi">Question du jour</span></h2>
      <p class="small muted">${esc(subjName(daily.s))}</p>
      ${questionBlock(daily)}
    </div>
    <h2 id="qcm">QCM corrigés : choisis une matière</h2>
    <div class="grid">${subs}</div>
    <div class="btns">
      <a class="btn hi-btn" href="#examen">${blancName()} : ${EXAM_LEN} questions en ${EXAM_MIN} min${isPremium() ? "" : " 🔒"}</a>
      <button class="btn alt" id="share">Partager l'appli à un camarade</button>
    </div>`;
  bindQuestion($view.querySelector("#daily"), daily, () => {});
  $view.querySelector("#share").onclick = share;
  const tx = $view.querySelector("#tuto-x");
  if (tx) tx.onclick = () => { S.tutoVu = true; store.save(); tx.closest(".tuto").remove(); };
  remplirAccueilEleve();
}

const srcLine = (q) => (q.src ? `<p class="src">📄 Source : ${esc(q.src)}</p>` : "");
function questionBlock(q) {
  return `${q.src ? `<p class="tag-src">${esc(q.src)}</p>` : ""}<p class="q">${esc(q.q)}</p><div class="choices">${q.c.map((c, i) =>
    `<button class="choice" data-i="${i}"><span class="l">${LETTERS[i]}</span><span>${esc(c)}</span></button>`).join("")}</div>
    <div class="expl" hidden></div>`;
}
function bindQuestion(root, q, done, showExpl = true) {
  root.querySelectorAll(".choice").forEach((b) => b.onclick = () => {
    const i = +b.dataset.i, ok = i === q.a;
    root.querySelectorAll(".choice").forEach((x) => { x.disabled = true; if (+x.dataset.i === q.a && showExpl) x.classList.add("ok"); });
    if (showExpl) {
      if (!ok) b.classList.add("ko");
      const ex = root.querySelector(".expl");
      ex.innerHTML = ok ? `<b class="msg-ok">Bonne réponse !</b> ${esc(q.e)}${srcLine(q)}`
        : `<b class="msg-ko">Pas tout à fait.</b><br>Tu as répondu : <s>${esc(q.c[i])}</s><br>La bonne réponse est <b>${LETTERS[q.a]} : ${esc(q.c[q.a])}</b>
          <p><b>Pourquoi :</b> ${esc(q.e)}</p><p class="small muted">Cette question est gardée dans « Mes erreurs » pour la refaire plus tard.</p>${srcLine(q)}`;
      ex.hidden = false;
    } else b.classList.add("ok");
    record(q, ok); done(ok, i);
  });
}

// ---------- Quiz par matière, erreurs, examen blanc
function runQuiz(title, qs, back, { exam = false, duo = null, solo = false, onEnd = null } = {}) {
  const hide = exam || solo;
  clearInterval(timer);
  if (!qs.length) { $view.innerHTML = `<div class="card"><h2>${esc(title)}</h2><p class="muted">Aucune question ici pour l'instant.</p><a class="btn" href="${back}">Retour</a></div>`; return; }
  let k = 0, score = 0; const answers = [];
  const end = Date.now() + EXAM_MIN * 60e3;
  if (exam) timer = setInterval(() => {
    const left = Math.max(0, end - Date.now()), el = document.getElementById("timer");
    if (el) el.textContent = `${Math.floor(left / 60e3)}:${String(Math.floor(left / 1e3) % 60).padStart(2, "0")}`;
    if (!left) finish();
  }, 500);
  function step() {
    const q = qs[k];
    $view.innerHTML = `<div class="progress"><span>${esc(title)}</span><span>${exam ? `<span class="timer" id="timer"></span> · ` : ""}${k + 1} / ${qs.length}</span></div>
      <div class="bar"><i style="width:${(100 * k) / qs.length}%"></i></div>
      <div class="card" id="qc">${hide ? `<p class="small muted">${esc(subjName(q.s))}</p>` : ""}${questionBlock(q)}</div>
      <button class="btn" id="next" hidden>${k + 1 < qs.length ? "Question suivante" : "Voir mon score"}</button>`;
    const next = document.getElementById("next");
    bindQuestion(document.getElementById("qc"), q, (ok, i) => {
      score += ok; answers.push({ q, i, ok });
      if (hide) { k + 1 < qs.length ? (k++, step()) : finish(); } else next.hidden = false;
    }, !hide);
    next.onclick = () => (k + 1 < qs.length ? (k++, step()) : finish());
    window.scrollTo(0, 0);
  }
  function finish() {
    clearInterval(timer);
    const total = hide ? qs.length : answers.length, note = Math.round((20 * score) / total * 10) / 10;
    S.sessions.push({ t: title, score, total, d: today() }); store.save();
    const mot = note >= 16 ? "Excellent, continue comme ça !" : note >= 12 ? "Bien joué, encore un effort." : note >= 10 ? "C'est juste, revois tes erreurs." : "Courage, revois les corrections et recommence.";
    const fixes = hide ? `<h2>Corrigé ligne par ligne</h2><div class="list">${qs.map((q) => { const a = answers.find((x) => x.q === q);
      return `<div class="card"><p class="small muted">${esc(subjName(q.s))}</p><p><b>${esc(q.q)}</b></p>
        <p class="${a && a.ok ? "msg-ok" : "msg-ko"}">${a ? (a.ok ? "✓ " : "✗ Ta réponse : " + esc(q.c[a.i]) + " · ") : "Sans réponse · "}Bonne réponse : ${esc(q.c[q.a])}</p>
        <p class="small muted">${esc(q.e)}</p>${srcLine(q)}</div>`; }).join("")}</div>` : "";
    $view.innerHTML = `<div class="card" style="text-align:center"><p class="muted">${esc(title)}</p><p class="score">${note} / 20</p>
      <p>${score} bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""} sur ${total}</p><p><b>${mot}</b></p></div>
      ${!isPremium() ? `<div class="card"><p>Il y a encore beaucoup de questions dans cette matière, avec l'examen blanc chronométré.</p><a class="btn hi-btn" href="#premium">Débloquer tout pour ${fcfa(CFG.price_fcfa)}</a></div>` : ""}
      ${duo ? `<div class="card"><h2>Classement du groupe ${esc(duo)}</h2><div id="board"><p class="small muted">Chargement du classement…</p></div></div>
        <a class="btn hi-btn" href="https://wa.me/?text=${encodeURIComponent(`Session de groupe ${duo} (${S.level}) : j'ai eu ${note}/20 (${score}/${total}). À toi ! ${duoLink(duo)}`)}" target="_blank" rel="noopener">Envoyer ma note au groupe sur WhatsApp</a>` : ""}
      ${onEnd ? onEnd(score, total, answers) : ""}
      <div class="btns"><button class="btn" id="again">Recommencer</button><a class="btn alt" href="${back}">Retour</a></div>${fixes}`;
    document.getElementById("again").onclick = () => render();
    if (duo) groupBoard(duo, { name: myName(), note, score, total, level: S.level });
    window.scrollTo(0, 0);
  }
  step();
}

// Avant chaque QCM ou exercice, l'élève choisit : avec support (corrigé après chaque réponse) ou tout seul (corrigé à la fin)
function chooseMode(title, sub, start) {
  $view.innerHTML = `<div class="card"><h1>${esc(title)}</h1><p class="muted">${esc(sub)}</p>
    <h2>Comment veux-tu travailler ?</h2>
    <button class="btn" id="m-help">🧑‍🏫 Avec support<br><span class="small">Corrigé et explication après chaque réponse</span></button>
    <button class="btn alt" id="m-solo">💪 Tout seul<br><span class="small">Tu réponds à tout, corrigé ligne par ligne à la fin</span></button></div>`;
  document.getElementById("m-help").onclick = () => start(false);
  document.getElementById("m-solo").onclick = () => start(true);
}
function viewQuiz(sid) {
  const s = DATA.subjects.find((x) => x.id === sid);
  if (!s) return go("accueil");
  const qs = mixQuestions(sid, qsOf(sid).filter(open), QUIZ_LEN);
  chooseMode(`QCM · ${s.name}`, `${qs.length} questions de ${S.level}`, (solo) => { markDone("qcm"); runQuiz(`${S.level} · ${s.name}`, qs, "#qcm-list", { solo }); });
}
function viewExam() {
  if (!isPremium()) return viewPremium(`${examOf() ? "L'examen blanc" : "Le devoir blanc"} fait partie du pack premium.`);
  const qs = pickFresh(DATA.questions.filter(inLevel), EXAM_LEN);
  runQuiz(`${blancName()} ${S.level}`, qs, "#accueil", { exam: true });
}
function viewErrors() {
  const wrong = DATA.questions.filter((q) => open(q) && inLevel(q) && S.stats[q.id] && S.stats[q.id].last === false);
  if (location.hash === "#erreurs/go") return runQuiz(`Mes erreurs ${S.level}`, shuffle(wrong).slice(0, QUIZ_LEN), "#erreurs");
  const by = {}; wrong.forEach((q) => (by[q.s] = (by[q.s] || 0) + 1));
  $view.innerHTML = `<h1>Mes erreurs</h1>
    <p class="muted">Les questions de ${S.level} que tu as ratées la dernière fois. Quand tu les réussis, elles disparaissent de la liste.</p>
    ${wrong.length ? `<div class="card">${Object.entries(by).map(([sid, n]) => `<div class="row"><span>${esc(subjName(sid))}</span><b>${n}</b></div>`).join("")}</div>
      <a class="btn" href="#erreurs/go">Revoir ${Math.min(wrong.length, QUIZ_LEN)} erreur${wrong.length > 1 ? "s" : ""}</a>`
    : `<div class="card"><p>Aucune erreur à revoir. Fais un quiz depuis l'accueil.</p><a class="btn" href="#accueil">Choisir une matière</a></div>`}`;
}

// ---------- Annales : sujets officiels repris dans l'appli et corrigés étape par étape (les références sont gardées dans contenu/)
const annalesOf = (level) => (DATA.annales || []).filter((a) => a.guided && matches(a.levels, level));

// ---------- Synthèses de cours : l'essentiel à retenir, gratuit, avant les quiz
function viewFiches() {
  const subs = subjectsOf(S.level).filter((s) => s.fiche);
  $view.innerHTML = `<h1>Synthèses de cours</h1><p class="muted">L'essentiel du programme de ${esc(S.level)} à retenir, matière par matière. Lis la fiche, puis entraîne-toi avec le quiz.</p>
    <div class="grid">${subs.map((s) => `<a class="subj" href="#fiche/${s.id}" style="text-decoration:none;color:inherit"><b>${esc(s.name)}</b><span class="small muted">${DATA.fiches[s.id].length} chapitres</span></a>`).join("")}</div>
    ${subs.length ? "" : `<div class="card"><p>Les synthèses de ta classe arrivent bientôt.</p></div>`}`;
}
function viewFiche(arg) {
  const [sid, k] = arg.split("~"), s = DATA.subjects.find((x) => x.id === sid), f = DATA.fiches && DATA.fiches[sid];
  if (!s || !f) return go("fiches");
  markDone("fiche");
  if (k === undefined) {
    $view.innerHTML = `<p class="tag-src">Synthèse de cours · ${esc(S.level)}</p><h1>${esc(s.name)}</h1>
      <p class="muted">${f.length} chapitres. Chaque chapitre : l'essentiel à savoir${f.some((c) => c.methodes) ? ", les méthodes pas à pas, les pièges, un exemple corrigé et ce qui tombe à l'examen" : ""}.</p>
      <div class="card">${f.map((c, i) => `<a class="row lib" href="#fiche/${sid}~${i}"><span>${i + 1}. ${esc(c.t)}</span><span class="small muted">lire ›</span></a>`).join("")}</div>
      <a class="btn" href="#quiz/${s.id}">M'entraîner sur ${esc(s.name)}</a>
      <a class="btn alt" href="#fiches">Autres synthèses</a>`;
    return;
  }
  const i = +k, c = f[i];
  if (!c) return go("fiche/" + sid);
  const nots = ((DATA.notions || {})[sid] || []).filter((n) => c.p !== undefined && n.pch === c.p);
  const prog = (DATA.programmes || {})[sid];
  $view.innerHTML = `<p class="tag-src">${esc(s.name)} · chapitre ${i + 1} / ${f.length}</p><h1>${esc(c.t)}</h1>
    <div class="btns">${typeof audioBtn === "function" ? audioBtn() : ""}<a class="btn alt" href="#carte/${sid}~${i}">🧠 Carte mentale</a></div>
    <div class="card notion-key"><h2>📌 L'essentiel</h2><ul class="steps">${c.cles.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    ${(c.methodes || []).map(([t, st]) => `<div class="card"><h2>🛠️ Méthode : ${esc(t)}</h2><ol class="steps">${st.map((l) => `<li>${esc(l)}</li>`).join("")}</ol></div>`).join("")}
    ${c.pieges ? `<div class="card"><h2>⚠️ Pièges à éviter</h2><ul class="steps">${c.pieges.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>` : ""}
    ${[...(c.exemple ? [c.exemple] : []), ...(c.exemples || [])].map(([q, lines], j, all) => `<div class="card"><h2>💡 Exercice corrigé${all.length > 1 ? " " + (j + 1) : ""}</h2><p><b>${esc(q)}</b></p><details><summary class="small">Voir le corrigé</summary><ol class="steps">${lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ol></details></div>`).join("")}
    ${c.exam ? `<div class="card"><h2>🎯 À l'examen</h2><p>${esc(c.exam)}</p></div>` : ""}
    ${typeof pourquoiCard === "function" ? pourquoiCard(c.t, sid) : ""}
    ${prog && c.p !== undefined ? `<button class="btn hi-btn" id="train">✏️ M'entraîner sur ce chapitre</button>` : `<a class="btn hi-btn" href="#quiz/${s.id}">✏️ M'entraîner sur ${esc(s.name)}</a>`}
    ${nots.map((n) => `<a class="btn alt" href="#notion/${n.id}">📖 Cours détaillé : ${esc(n.title)}${isPremium() || n.free ? "" : " 🔒"}</a>`).join("")}
    ${f[i + 1] ? `<a class="btn alt" href="#fiche/${sid}~${i + 1}">Chapitre suivant : ${esc(f[i + 1].t)}</a>` : ""}
    <a class="btn alt" href="#fiche/${sid}">Tous les chapitres</a>`;
  const b = document.getElementById("train");
  if (b) b.onclick = () => { S.devoir = { ...(S.devoir || {}), [sid]: [c.p] }; store.save(); go("devoir/" + sid); };
  window.scrollTo(0, 0);
}
// ---------- Notions de cours : chapitre détaillé (cours, énoncé, exemples, illustration) + exercice corrigé
function viewNotions() {
  const all = notionsOf(S.level), subs = [...new Set(all.map((c) => c.sid))];
  $view.innerHTML = `<h1>Notions de cours</h1><p class="muted">Chaque chapitre : le cours expliqué, ce qu'il faut retenir, des exemples résolus, puis un exercice corrigé pas à pas.</p>
    ${subs.map((sid) => { const ch = all.filter((c) => c.sid === sid);
      return `<h2>${esc(ch[0].sname)}</h2>${ch.map((c, i) => `<a class="card lib-card" href="#notion/${c.id}"><b>${i + 1}. ${esc(c.title)}</b><span class="small muted">Cours · ${c.exemples.length} exemple${c.exemples.length > 1 ? "s" : ""} · exercice corrigé${c.free ? " · gratuit" : isPremium() ? "" : " 🔒"}</span></a>`).join("")}`; }).join("")}
    ${all.length ? "" : `<div class="card"><p>Les chapitres détaillés de ta classe arrivent. En attendant, lis les synthèses.</p><a class="btn" href="#fiches">Synthèses de cours</a></div>`}`;
}
function viewNotion(id) {
  const all = Object.entries(DATA.notions || {}).flatMap(([sid, ch]) => ch.map((c, i) => ({ ...c, sid, i, n: ch.length })));
  const c = all.find((x) => x.id === id);
  if (!c) return go("notions");
  if (!isPremium() && !c.free) return viewPremium("Tous les chapitres détaillés font partie du pack premium. Le premier chapitre de chaque matière est gratuit.");
  markDone("fiche");
  const s = DATA.subjects.find((x) => x.id === c.sid), next = all.find((x) => x.sid === c.sid && x.i === c.i + 1);
  $view.innerHTML = `<p class="tag-src">${esc(s ? s.name : "")} · chapitre ${c.i + 1} / ${c.n}</p><h1>${esc(c.title)}</h1>${typeof audioBtn === "function" ? audioBtn() : ""}
    <div class="card"><h2>📘 Le cours</h2>${c.cours.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
    ${c.svg ? `<div class="card notion-fig">${c.svg}</div>` : ""}
    <div class="card notion-key"><h2>📌 À retenir</h2><ul class="steps">${c.enonce.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    ${c.exemples.map(([t, lines]) => `<div class="card"><h2>💡 Exemple : ${esc(t)}</h2><ol class="steps">${lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ol></div>`).join("")}
    <a class="btn hi-btn" href="#sujet/ch-${c.id}">✏️ Exercice corrigé sur ce chapitre</a>
    ${next ? `<a class="btn alt" href="#notion/${next.id}">Chapitre suivant : ${esc(next.title)}${isPremium() || next.free ? "" : " 🔒"}</a>` : ""}
    <a class="btn alt" href="#notions">Tous les chapitres</a>`;
  window.scrollTo(0, 0);
}
// ---------- Préparer un devoir : l'élève choisit la matière puis les chapitres du programme sur lesquels il sera interrogé
function viewDevoir(arg) {
  const progs = DATA.programmes || {};
  const subs = subjectsOf(S.level).filter((s) => progs[s.id] && !/annales/.test(s.id));
  const s = subs.find((x) => x.id === arg);
  if (!s) {
    $view.innerHTML = `<h1>Préparer un devoir</h1><p class="muted">Tu as un devoir ou un contrôle bientôt ? Choisis la matière, puis coche les chapitres au programme : l'appli te prépare un entraînement corrigé sur ces chapitres seulement.</p>
      <div class="grid">${subs.map((x) => `<a class="subj" href="#devoir/${x.id}" style="text-decoration:none;color:inherit"><b>${esc(x.name)}</b><span class="small muted">${progs[x.id].length} chapitres</span></a>`).join("")}</div>`;
    return;
  }
  // les questions tirées des annales du BAC comptent aussi dans les chapitres de la matière
  const lv = subjectsOf(S.level).map((x) => x.id), extra = DATA.questions.filter((q) => q.alt === s.id && lv.includes(q.s)).map((q) => ({ ...q, ch: q.ach }));
  const chs = progs[s.id], all = [...qsOf(s.id), ...extra], nots = ((DATA.notions || {})[s.id] || []);
  const count = (i) => all.filter((q) => q.ch === i).length;
  const saved = (S.devoir || {})[s.id] || [];
  $view.innerHTML = `<p class="tag-src">Préparer un devoir · ${esc(S.level)}</p><h1>${esc(s.name)}</h1>
    <p class="muted">Coche les chapitres de ton devoir. Tu peux en choisir un seul ou plusieurs.${(GEN[s.id] || []).length ? " « + ∞ » : des exercices nouveaux sont fabriqués à chaque fois sur ce chapitre." : ""}</p>
    <div class="card"><label class="row small"><span><input type="checkbox" id="all"> <b>Tout le programme</b></span></label>
      ${chs.map((t, i) => `<label class="row chk"><span><input type="checkbox" class="ch" value="${i}"${saved.includes(i) ? " checked" : ""}> ${i + 1}. ${esc(t)}</span><span class="small muted">${count(i)} q.${(GEN[s.id] || []).some(([c]) => c === t) ? " + ∞" : ""}</span></label>`).join("")}</div>
    <div class="card"><h2>Nombre de questions</h2><div class="row">${[10, 20, 30].map((n) => `<button class="btn alt small nb${n === 20 ? " on" : ""}" data-n="${n}" style="flex:1">${n}</button>`).join("")}</div></div>
    <div id="revoir"></div>
    <p id="dmsg" class="small msg-ko"></p>
    <button class="btn hi-btn" id="go">Commencer l'entraînement</button>`;
  let n = 20;
  const boxes = [...$view.querySelectorAll(".ch")], picked = () => boxes.filter((b) => b.checked).map((b) => +b.value);
  function refresh() {
    const sel = picked();
    document.getElementById("all").checked = sel.length === chs.length;
    S.devoir = { ...(S.devoir || {}), [s.id]: sel }; store.save();
    const rel = nots.filter((c) => sel.includes(c.pch));
    document.getElementById("revoir").innerHTML = rel.length ? `<div class="card"><h2>📖 À revoir avant</h2>${rel.map((c) => `<a class="row lib" href="#notion/${c.id}"><span>${esc(c.title)}</span><span class="small muted">cours + exercice${isPremium() || c.free ? "" : " 🔒"}</span></a>`).join("")}</div>` : "";
  }
  boxes.forEach((b) => b.onchange = refresh);
  document.getElementById("all").onchange = (e) => { boxes.forEach((b) => b.checked = e.target.checked); refresh(); };
  $view.querySelectorAll(".nb").forEach((b) => b.onclick = () => { n = +b.dataset.n; $view.querySelectorAll(".nb").forEach((x) => x.classList.toggle("on", x === b)); });
  refresh();
  document.getElementById("go").onclick = () => {
    const sel = picked(), pool = all.filter((q) => sel.includes(q.ch) && open(q));
    const m = document.getElementById("dmsg");
    if (!sel.length) { m.textContent = "Coche au moins un chapitre."; return; }
    if (!pool.length && !(isPremium() && (GEN[s.id] || []).some(([c]) => sel.map((i) => chs[i]).includes(c)))) { m.textContent = isPremium() ? "Pas encore de questions sur ces chapitres. Choisis-en d'autres." : "Ces chapitres sont dans le pack premium."; return; }
    const qs = mixQuestions(s.id, pool, n, sel.map((i) => chs[i]));
    const title = `Devoir de ${s.name}`, sub = `${qs.length} questions sur : ${sel.map((i) => chs[i]).join(", ")}.`;
    chooseMode(title, sub, (solo) => { markDone("qcm"); runQuiz(title, qs, `#devoir/${s.id}`, { solo }); });
  };
}
function viewAnnales() {
  const list = annalesOf(S.level);
  $view.innerHTML = `${examOf() ? `<h1>Sujets du ${esc(examOf()[0])}</h1>
    <p class="muted">Des sujets complets du ${esc(examOf()[0])}, avec la structure, le barème et les notions des épreuves officielles. Tu les traites étape par étape et chaque réponse est corrigée.</p>` : `<h1>Devoirs et compositions</h1>
    <p class="muted">Ta classe n'a pas d'examen national : voici des devoirs types de ${esc(S.level)} pour t'entraîner, corrigés étape par étape.</p>`}
    ${list.length ? list.map((a) => `<div class="card">
      <div class="row"><h2>${a.modele ? `Sujet ${esc(a.exam)} ${esc(a.year)}` : `${esc(a.exam)} ${a.year}`}</h2><span class="tag">${esc(a.subject)}</span></div>
      ${a.modele ? `<p class="small muted">Sur le modèle de l'épreuve officielle</p>` : ""}<p class="small muted">${a.series ? "Séries " + esc(a.series) : esc(a.levels.join(", "))}${a.duration ? " · " + esc(a.duration) : ""}${a.coef ? " · coefficient " + a.coef : ""}</p>
      ${a.parts ? `<ul class="steps small">${a.parts.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      ${a.guided ? `<a class="btn hi-btn" href="#sujet/${a.id}">Faire ce sujet en mode guidé, corrigé à chaque étape${isPremium() ? "" : " 🔒"}</a>` : ""}</div>`).join("")
    : ""}
    ${genSujetsOf(S.level).length ? `<h2>${examOf() ? "Sujets types" : "Devoirs types"} à nombres nouveaux</h2><p class="small muted">4 exercices de chapitres différents, notés sur 20. Un sujet différent à chaque essai.</p>
      ${genSujetsOf(S.level).map((g) => `<a class="card lib-card" href="#sujet/${g.id}"><b>${esc(g.subject)} : nouveau sujet</b><span class="small muted">${examOf() ? `Sur le modèle du ${esc(examOf()[0])}` : "Devoir de 2 h"} · noté sur 20${isPremium() ? "" : " 🔒"}</span></a>`).join("")}` : ""}
    ${list.length || genSujetsOf(S.level).length ? "" : `<div class="card"><p>Pas encore d'annales pour ta série. Elles arrivent au fur et à mesure.</p></div>`}`;
}

// ---------- Exercices corrigés : sujets guidés et exercices pas à pas de la classe
function viewExercices() {
  const ann = annalesOf(S.level).filter((a) => a.guided), exs = exercisesOf(S.level);
  const card = (href, title, sub, lock) => `<a class="card lib-card" href="${href}"><b>${esc(title)}</b><span class="small muted">${esc(sub)}${lock ? " 🔒" : ""}</span></a>`;
  $view.innerHTML = `<h1>Exercices corrigés</h1><p class="muted">Tu réponds étape par étape ; après chaque réponse, le corrigé s'affiche avec les points gagnés.</p>
    ${ann.length ? `<h2>Sujets complets du ${esc(examOf() ? examOf()[0] : "BAC")}</h2>${ann.map((a) => card(`#sujet/${a.id}`, `${a.exam} ${a.year} · ${a.subject}`, `${a.series ? `Séries ${a.series} · ` : ""}${a.modele ? "sur le modèle officiel · " : ""}sujet entier noté sur 20`, !isPremium())).join("")}` : ""}
    ${exs.length ? `<h2>Exercices</h2>${exs.map((e) => card(`#sujet/${e.id}`, `${e.subject} · ${e.title}`, `${e.src} · ${e.guided.reduce((n, p) => n + p.steps.length, 0)} étapes${e.free ? " · gratuit" : ""}`, !isPremium() && !e.free)).join("")}` : ""}
    ${genExosOf(S.level).length ? `<h2>Exercices à nombres nouveaux</h2><p class="small muted">Les nombres changent à chaque essai : refais-les autant que tu veux.</p>${genExosOf(S.level).map((e) => card(`#sujet/${e.id}`, `${e.subject} · ${e.title}`, "Énoncé suivi · noté sur 5 · ∞", !isPremium())).join("")}` : ""}
    ${ann.length + exs.length + genExosOf(S.level).length ? "" : `<div class="card"><p>Les exercices corrigés de ta classe arrivent. En attendant, fais les QCM corrigés.</p><a class="btn" href="#qcm-list">QCM corrigés</a></div>`}`;
}
function viewQcmList() {
  $view.innerHTML = `<h1>QCM corrigés</h1><p class="muted">Pour chaque question, tu vois si ton choix est juste, la bonne réponse et l'explication. Les erreurs sont gardées pour les revoir.</p>
    <div class="grid">${subjectsOf(S.level).map((s) => `<a class="subj" href="#quiz/${s.id}" style="text-decoration:none;color:inherit"><b>${esc(s.name)}</b>
      <span class="small muted">${isPremium() ? s.count : s.free} questions${isPremium() && (GEN[s.id] || []).length ? " + ∞" : ""}</span><span class="bar"><i style="width:${mastery(s.id)}%"></i></span></a>`).join("")}</div>
    <a class="btn alt" href="#erreurs">Revoir mes erreurs</a>`;
}

// ---------- Session de groupe : de 2 à 10 camarades de la même classe reçoivent les mêmes questions dans le même ordre
const DUO_LEN = 10;
function seeded(str) { let h = 1779033703; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 3432918353), (h = (h << 13) | (h >>> 19)); return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
function duoQuestions(code, level) {
  const rnd = seeded(code + "|" + level), pool = DATA.questions.filter((q) => subjectsOf(level).some((s) => s.id === q.s));
  const a = pool.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, DUO_LEN);
}
const GROUP_MAX = 10;
const myName = () => (S.pseudo || (Compte.user && Compte.user.displayName) || "").split(" ")[0].slice(0, 30);
function groupBoard(code, rec) {
  const el = () => document.getElementById("board");
  if (!Compte.user) { if (el()) el().innerHTML = `<p class="small muted">Connecte-toi pour apparaître dans le classement du groupe.</p>`; return; }
  const off = (msg) => { if (el()) el().innerHTML = `<p class="small muted">${msg} Envoyez-vous vos notes sur WhatsApp.</p>`; };
  Compte.postScore(code, { ...rec, name: rec.name || "Élève" }).catch(() => off("Le classement en direct n'est pas disponible pour le moment."));
  const stop = Compte.listenScores(code, (rows) => {
    if (!el()) return stop();
    rows.sort((a, b) => b.note - a.note || (a.at && b.at ? a.at.toMillis() - b.at.toMillis() : 0));
    const top = rows.slice(0, GROUP_MAX);
    el().innerHTML = `${barChart(top.map((r, i) => [`${["🥇", "🥈", "🥉"][i] || i + 1 + "."} ${r.name}${r.me ? " (toi)" : ""}`, r.note * 5, pts(r.note) + "/20"]))}
      <p class="small muted">${rows.length} élève${rows.length > 1 ? "s ont" : " a"} fini. Le classement se met à jour tout seul quand les autres terminent.</p>`;
  }, () => off("Le classement en direct n'est pas disponible pour le moment."));
}
const duoLink = (code) => `${location.href.split("#")[0]}#duo/${code}~${encodeURIComponent(S.level)}`;
function viewDuo(arg) {
  if (arg) {
    const [code, lv] = decodeURIComponent(arg).split("~");
    if (lv && lv !== S.level && DATA.levels.includes(lv)) { S.level = lv; store.save(); }
    markDone("duo");
    return runQuiz(`Session de groupe · ${code}`, duoQuestions(code, S.level), "#duo", { duo: code });
  }
  $view.innerHTML = `<h1>Session de groupe</h1>
    <p class="muted">De 2 à ${GROUP_MAX} camarades de ${esc(S.level)} répondent aux mêmes ${DUO_LEN} questions, dans le même ordre, chacun sur son téléphone. À la fin, le classement du groupe s'affiche en direct, puis vous revoyez ensemble les corrections.</p>
    <div class="card"><h2>Ton prénom dans le classement</h2><input class="field" id="pseudo" maxlength="30" value="${esc(myName())}" placeholder="Ton prénom"></div>
    <div class="card"><h2>Créer une session</h2><p class="small muted">Tu reçois un code et un lien à envoyer au groupe WhatsApp de ta classe.</p><button class="btn" id="new">Créer une session</button><div id="made"></div></div>
    <div class="card"><h2>Rejoindre une session</h2><p class="small muted">Entre le code reçu. Vous devez être dans la même classe et la même série.</p>
      <input class="field" id="code" maxlength="5" placeholder="Code (ex. K7P2Q)" autocapitalize="characters"><button class="btn alt" id="join">Rejoindre</button></div>`;
  document.getElementById("pseudo").onchange = (e) => { S.pseudo = e.target.value.trim().slice(0, 30); store.save(); };
  document.getElementById("new").onclick = () => {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(5)), (x) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join("");
    const text = `Session de groupe sur Racine School (${S.level}) : on répond tous aux mêmes ${DUO_LEN} questions, classement en direct. Code ${code}. Ouvre ce lien : ${duoLink(code)}`;
    document.getElementById("made").innerHTML = `<p>Code de la session : <b class="count">${code}</b></p>
      <a class="btn alt" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">Envoyer le lien au groupe sur WhatsApp</a>
      <a class="btn" href="#duo/${code}~${encodeURIComponent(S.level)}">Commencer la session</a>`;
  };
  document.getElementById("join").onclick = () => {
    const code = document.getElementById("code").value.trim().toUpperCase();
    if (code.length >= 4) go(`duo/${code}~${encodeURIComponent(S.level)}`);
  };
}

// ---------- Challenge du jour : 20 questions qui mélangent tout le programme, résultats en graphique
const CHAL_LEN = 20;
function challengeQuestions(level, day) {
  const rnd = seeded("challenge|" + level + "|" + day), subs = subjectsOf(level);
  const pools = subs.map((s) => { const a = qsOf(s.id); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; });
  const out = []; for (let r = 0; out.length < CHAL_LEN && r < 50; r++) pools.forEach((p) => { if (p[r] && out.length < CHAL_LEN) out.push(p[r]); });
  return out;
}
function barChart(rows) {
  return `<div class="chart">${rows.map(([label, val, sub]) => `<div class="crow"><span class="clab">${esc(label)}</span>
    <span class="ctrack"><i style="width:${Math.max(2, val)}%;background:${val >= 70 ? "var(--ok)" : val >= 50 ? "var(--hi)" : "var(--ko)"}"></i></span><b>${sub}</b></div>`).join("")}</div>`;
}
function viewChallenge() {
  const day = today(), qs = challengeQuestions(S.level, day), prev = (S.challenges || {})[day];
  const hist = Object.entries(S.challenges || {}).sort().slice(-10);
  $view.innerHTML = `<h1>Challenge du jour</h1>
    <p class="muted">${CHAL_LEN} questions qui mélangent toutes les matières de ${esc(S.level)}. Toute ta classe a le même challenge aujourd'hui : compare ta note avec tes camarades.</p>
    ${prev ? `<div class="card"><p>Déjà fait aujourd'hui : <b>${pts(prev.note)} / 20</b>. Tu peux le refaire pour t'entraîner, ta première note reste enregistrée.</p></div>` : ""}
    <button class="btn hi-btn" id="go">Lancer le challenge</button>
    ${hist.length ? `<div class="card"><h2>Mes derniers challenges</h2>${barChart(hist.map(([d, c]) => [d.slice(5).split("-").reverse().join("/"), c.note * 5, pts(c.note) + "/20"]))}</div>` : ""}`;
  document.getElementById("go").onclick = () => runQuiz(`Challenge du ${day.slice(5).split("-").reverse().join("/")}`, qs, "#challenge", { solo: true, onEnd: (score, total, answers) => {
    const by = {}; answers.forEach((a) => { const b = (by[a.q.s] = by[a.q.s] || { ok: 0, n: 0 }); b.n++; b.ok += a.ok; });
    const note = Math.round((20 * score) / total * 10) / 10;
    if (!prev) { S.challenges = S.challenges || {}; S.challenges[day] = { note, by }; store.save(); }
    markDone("challenge");
    const weak = Object.entries(by).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n)[0];
    const text = `Challenge du jour Racine School (${S.level}) : j'ai eu ${note}/20. Fais mieux ! ${location.href.split("#")[0]}`;
    return `<div class="card"><h2>Tes résultats par matière</h2>${barChart(Object.entries(by).map(([sid, b]) => [subjName(sid), Math.round((100 * b.ok) / b.n), `${b.ok}/${b.n}`]))}
      ${weak ? `<p class="small">À travailler en priorité : <b>${esc(subjName(weak[0]))}</b>.</p><a class="btn alt" href="#fiche/${weak[0]}">Revoir la synthèse</a>` : ""}</div>
      <a class="btn hi-btn" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">Défier mes camarades sur WhatsApp</a>`;
  } });
}

// ---------- Sujet guidé : un vrai sujet, étape par étape, corrigé tout de suite
const pts = (x) => String(Math.round(x * 100) / 100).replace(".", ",");
function viewGuided(id) {
  const gid = String(id), cut = gid.lastIndexOf("-");
  const an = [...(DATA.annales || []), ...(DATA.exercises || [])].find((x) => x.id === id && x.guided)
    || (typeof genExercise === "function" && gid.startsWith("gx-") ? genExercise(gid.slice(3, cut), +gid.slice(cut + 1)) : null)
    || (typeof genSujet === "function" && gid.startsWith("gs-") ? genSujet(gid.slice(3)) : null);
  if (!an) return go("exercices");
  if (!isPremium() && !an.free) return viewPremium("Les sujets guidés et les exercices corrigés font partie du pack premium.");
  const head = an.title ? `${an.subject} · ${an.title}` : `${an.exam} ${an.year} · ${an.subject}`;
  const steps = an.guided.flatMap((p, pi) => p.steps.map((st) => ({ ...st, pi })));
  const max = steps.reduce((n, st) => n + st.pts, 0);
  let k = -1, got = 0, solo = false;
  const byPart = an.guided.map(() => 0), picks = [];
  function intro() {
    $view.innerHTML = `<div class="card"><p class="tag-src">${an.title ? "Exercice corrigé" : "Sujet guidé"}</p><h1>${esc(head)}</h1>
      ${an.src ? `<p class="src">📄 ${esc(an.src)}</p>` : `<p class="muted">${an.modele ? "Sur le modèle de l'épreuve officielle · " : ""}${an.series ? "Séries " + esc(an.series) : esc(an.levels.join(", "))}${an.duration ? " · " + esc(an.duration) : ""}${an.coef ? " · coefficient " + an.coef : ""}</p>`}
      <p>Tu réponds étape par étape. Choisis si tu veux le corrigé après chaque réponse ou seulement à la fin.</p>
      <p class="small muted">${steps.length} étapes, ${pts(max)} points.${an.gen ? " Les nombres changent à chaque essai : tu peux le refaire autant de fois que tu veux." : an.title ? "" : " Les tableaux et les tracés de courbes ne sont pas notés ici."}</p>
      <button class="btn" id="go">🧑‍🏫 Avec support<br><span class="small">Corrigé et points après chaque réponse</span></button>
      <button class="btn alt" id="solo">💪 Tout seul<br><span class="small">Tu fais tout l'exercice, corrigé ligne par ligne à la fin</span></button></div>`;
    document.getElementById("go").onclick = () => { solo = false; k = 0; markDone("exo"); step(); };
    document.getElementById("solo").onclick = () => { solo = true; k = 0; markDone("exo"); step(); };
  }
  function step() {
    const st = steps[k], part = an.guided[st.pi];
    $view.innerHTML = `<div class="progress"><span>${esc(an.title || an.exam + " " + an.year)} · étape ${k + 1} / ${steps.length}</span><span>${solo ? "💪 Tout seul" : `<b>${pts(got)}</b> / ${pts(max)} pts`}</span></div>
      <div class="bar"><i style="width:${(100 * k) / steps.length}%"></i></div>
      <div class="card"><h2>${esc(part.title)}</h2><p class="small">${esc(part.context)}</p></div>
      <div class="card" id="qc"><p class="tag-src">${pts(st.pts)} point${st.pts > 1 ? "s" : ""}</p>${questionBlock(st)}</div>
      <button class="btn" id="next" hidden>${k + 1 < steps.length ? "Étape suivante" : "Voir ma note"}</button>`;
    const qc = document.getElementById("qc");
    qc.querySelectorAll(".choice").forEach((b) => b.onclick = () => {
      const ok = +b.dataset.i === st.a;
      picks[k] = +b.dataset.i;
      if (ok) { got += st.pts; byPart[st.pi] += st.pts; }
      if (solo) return k + 1 < steps.length ? (k++, step()) : finish();
      qc.querySelectorAll(".choice").forEach((x) => { x.disabled = true; if (+x.dataset.i === st.a) x.classList.add("ok"); });
      if (!ok) b.classList.add("ko");
      const ex = qc.querySelector(".expl");
      ex.innerHTML = ok ? `<b class="msg-ok">Juste : +${pts(st.pts)} pt</b><br><b>Corrigé :</b> ${esc(st.e)}`
        : `<b class="msg-ko">Faux : 0 pt</b><br>Tu as répondu : <s>${esc(st.c[+b.dataset.i])}</s><br>La bonne réponse est <b>${LETTERS[st.a]} : ${esc(st.c[st.a])}</b><p><b>Corrigé :</b> ${esc(st.e)}</p>`;
      ex.hidden = false;
      document.getElementById("next").hidden = false;
      if (!S.days.includes(today())) { S.days.push(today()); store.save(); }
    });
    document.getElementById("next").onclick = () => (k + 1 < steps.length ? (k++, step()) : finish());
    window.scrollTo(0, 0);
  }
  function finish() {
    const note = Math.round((20 * got) / max * 10) / 10;
    S.sessions.push({ t: an.title ? `Exercice : ${an.title}` : `Sujet guidé ${an.exam} ${an.year}`, score: got, total: max, d: today() }); store.save();
    $view.innerHTML = `<div class="card" style="text-align:center"><p class="muted">${esc(head)}</p>
      <p class="score">${pts(note)} / 20</p><p>${pts(got)} points sur ${pts(max)} notés</p></div>
      <div class="card">${an.guided.map((p, i) => `<div class="row small"><span>${esc(p.title)}</span><b>${pts(byPart[i])} / ${pts(p.steps.reduce((n, x) => n + x.pts, 0))}</b></div>`).join("")}</div>
      <div class="btns">
      <button class="btn" id="again">${an.gen ? "Nouveaux nombres" : "Recommencer"}</button>${an.chapter ? `<a class="btn alt" href="#notion/${an.chapter}">Revoir le cours</a>` : ""}<a class="btn alt" href="#exercices">Autres exercices</a></div>
      ${solo ? `<h2>Corrigé ligne par ligne</h2>${steps.map((st, i) => { const ok = picks[i] === st.a;
        return `<div class="card"><p class="small muted">${esc(an.guided[st.pi].title)} · ${pts(st.pts)} pt</p><p><b>${esc(st.q)}</b></p>
          <p class="${ok ? "msg-ok" : "msg-ko"}">${ok ? "✓ Juste" : "✗ Ta réponse : " + esc(st.c[picks[i]])} · Bonne réponse : ${esc(st.c[st.a])}</p><p class="small">${esc(st.e)}</p></div>`; }).join("")}` : ""}`;
    document.getElementById("again").onclick = () => (an.gen ? viewGuided(id) : (got = 0, byPart.fill(0), picks.length = 0, intro()));
    window.scrollTo(0, 0);
  }
  intro();
}

// ---------- Progrès
function daysChart() {
  const days = [...Array(10)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 9 + i); return d.toISOString().slice(0, 10); });
  const data = days.map((d) => (S.daily || {})[d] || { n: 0, ok: 0 }), top = Math.max(10, ...data.map((x) => x.n));
  return `<div class="days">${days.map((d, i) => `<div class="day"><span class="dbar"><i style="height:${(100 * data[i].n) / top}%"></i><i class="okp" style="height:${(100 * data[i].ok) / top}%"></i></span>
    <span class="small muted">${d.slice(8)}</span><span class="small"><b>${data[i].n || ""}</b></span></div>`).join("")}</div>
    <p class="small muted">Barre claire : questions répondues ; barre verte : bonnes réponses.</p>`;
}
function viewProgress() {
  const answered = Object.values(S.stats).reduce((n, s) => n + s.ok + s.ko, 0);
  const good = Object.values(S.stats).reduce((n, s) => n + s.ok, 0);
  const rows = subjectsOf(S.level).map((s) => `<div><div class="row small"><span>${esc(s.name)}</span><b>${mastery(s.id)} %</b></div><div class="bar"><i style="width:${mastery(s.id)}%"></i></div></div>`).join("");
  const last = S.sessions.slice(-8).reverse().map((x) => `<div class="row small"><span>${esc(x.t)}<br><span class="muted">${x.d}</span></span><b>${Math.round((200 * x.score) / x.total) / 10} / 20</b></div>`).join("");
  $view.innerHTML = `<h1>Mes progrès</h1>${ficheCard()}
    <div class="card"><div class="row"><div><p class="small muted">Réponses</p><p class="count">${answered}</p></div>
      <div><p class="small muted">Réussite</p><p class="count">${answered ? Math.round((100 * good) / answered) : 0} %</p></div>
      <div><p class="small muted">Série</p><p class="count">${streak()} 🔥</p></div></div></div>
    <div class="card"><h2>Mes 10 derniers jours</h2>${daysChart()}</div>
    <div class="card"><h2>Matières maîtrisées en ${S.level}</h2>${rows}<p class="small muted">Part des questions réussies la dernière fois.</p></div>
    <div class="card"><h2>Derniers quiz</h2>${last || '<p class="muted">Pas encore de quiz.</p>'}</div>
    ${Compte.user ? `<div class="card"><p class="small muted">Connecté avec ${esc(Compte.user.email || Compte.user.displayName || "Google")}</p><button class="btn alt" id="logout">Se déconnecter</button></div>` : ""}`;
  const lo = document.getElementById("logout");
  if (lo) lo.onclick = () => Compte.signOut().then(() => { localStorage.removeItem("racine"); location.reload(); });
}

// ---------- Premium : paiement Wave puis code reçu par WhatsApp
async function sha256(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function viewPremium(reason = "", pay = "wave") {
  const total = DATA.questions.length, wa = CFG.whatsapp, wave = CFG.wave_number, om = CFG.om_number;
  if (!wave) pay = "om";
  const msg = encodeURIComponent(`Bonjour, j'ai payé ${fcfa(CFG.price_fcfa)} par ${pay === "om" ? "Orange Money" : "Wave"} pour le pack premium Racine School. Voici ma capture :`);
  $view.innerHTML = `<h1>Pack premium</h1>
    ${reason ? `<p><b>${esc(reason)}</b></p>` : ""}
    ${!S.premium ? `<div class="card"><p>${trialLeft() > 0 ? `🎁 Ton essai gratuit de ${TRIAL_DAYS} jours est en cours : encore <b>${trialLeft()} jour${trialLeft() > 1 ? "s" : ""}</b> avec tout débloqué.` : `Ton essai gratuit de ${TRIAL_DAYS} jours est terminé.`}</p></div>` : ""}
    ${S.premium ? `<div class="card"><p class="msg-ok">Ton pack premium est actif. Toutes les questions et les examens blancs sont débloqués.</p><a class="btn" href="#accueil">Réviser</a></div>` : `
    <div class="card">
      <p class="count">${fcfa(CFG.price_fcfa)}</p><p class="muted">Payé une seule fois, valable jusqu'à l'examen.</p>
      <ul class="steps"><li>Les <b>${total}</b> questions de la 6e à la Terminale, toutes corrigées</li><li>Les examens et devoirs blancs chronométrés, notés sur 20</li><li>Les nouvelles questions ajoutées pendant l'année</li></ul>
    </div>
    <div class="card"><h2>Comment payer</h2>
      ${wave || om ? `<p class="small muted">Choisis ton moyen de paiement :</p>
        <div class="row">${wave ? `<button class="btn${pay === "wave" ? "" : " alt"}" style="flex:1" data-pay="wave">Wave</button>` : ""}${om ? `<button class="btn${pay === "om" ? "" : " alt"}" style="flex:1" data-pay="om">Orange Money</button>` : ""}</div>
        <ol class="steps">
        <li>${pay === "om" ? `Envoie <b>${fcfa(CFG.price_fcfa)}</b> par Orange Money au <b>${esc(om)}</b> (code #144# ou appli Orange Money).` : `Envoie <b>${fcfa(CFG.price_fcfa)}</b> par Wave au <b>${esc(wave)}</b>.`}</li>
        <li>Envoie la capture du paiement sur WhatsApp.</li>
        <li>Tu reçois ton code. Entre-le ci-dessous.</li></ol>
        ${wa ? `<a class="btn hi-btn" href="https://wa.me/${esc(wa)}?text=${msg}" target="_blank" rel="noopener">Envoyer la capture sur WhatsApp</a>` : ""}`
      : `<p class="muted">Le paiement arrive très bientôt. Si tu as déjà un code, entre-le ci-dessous.</p>`}
    </div>
    <div class="card"><h2>J'ai un code</h2>
      <input class="code" id="code" placeholder="XXXXX-XXXXXX" autocomplete="off" maxlength="12">
      <button class="btn" id="unlock">Débloquer</button><p id="codemsg" class="small"></p></div>`}`;
  $view.querySelectorAll("[data-pay]").forEach((b) => b.onclick = () => viewPremium(reason, b.dataset.pay));
  const btn = document.getElementById("unlock");
  if (btn) btn.onclick = async () => {
    const raw = document.getElementById("code").value.trim().toUpperCase().replace(/\s/g, "");
    const code = raw.length === 11 && !raw.includes("-") ? raw.slice(0, 5) + "-" + raw.slice(5) : raw;
    const m = document.getElementById("codemsg");
    let ok = CFG.codes.includes(await sha256(CFG.salt + code));
    // avec les comptes, c'est le serveur qui valide le code et refuse un code déjà utilisé
    if (ok && Compte.enabled) ok = await Compte.claim(code).then(() => true, () => false);
    if (ok) { S.premium = true; S.code = code; store.save(); m.className = "msg-ok"; m.textContent = "Code accepté !"; setTimeout(render, 700); }
    else { m.className = "msg-ko"; m.textContent = "Code inconnu ou déjà utilisé. Vérifie les lettres et les chiffres."; }
  };
}

// Partage : sur Android, la vidéo de présentation part avec le lien (WhatsApp l'affiche directement) ;
// sinon, le lien seul, dont l'aperçu montre l'image de présentation.
async function share() {
  const url = location.href.split("#")[0];
  const text = `Je révise le BAC et le BFEM avec cette appli : 1 300 QCM corrigés, sujets officiels, cours et devoirs. 10 jours gratuits 👉 ${url}`;
  try {
    const blob = await fetch("tuto.mp4").then((r) => r.blob());
    const files = [new File([blob], "racine-school.mp4", { type: "video/mp4" })];
    if (navigator.canShare && navigator.canShare({ files })) return await navigator.share({ files, text, title: "Racine School" });
  } catch (e) { if (e && e.name === "AbortError") return; }
  if (navigator.share) navigator.share({ title: "Racine School", text, url }).catch(() => {});
  else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

// ---------- Navigation
function go(h) { location.hash = h; }
function viewLogin(err = "", ok = "") {
  $view.innerHTML = `<div class="card" style="gap:14px">
    <img src="icons/logo.svg" alt="" style="width:96px;height:96px;margin:0 auto;display:block"><h1 style="text-align:center;margin:0">Bienvenue sur Racine School</h1><p style="text-align:center;margin:0;font-style:italic">L'Excellence et la Réussite</p>
    <p class="muted" style="text-align:center">Connecte-toi pour garder tes progrès et profiter de ${TRIAL_DAYS} jours d'essai gratuit avec tout débloqué.</p>
    <button class="btn" id="google">Se connecter avec Google</button>
    <p class="small muted" style="text-align:center">ou avec ton adresse e-mail</p>
    <input class="field" id="mail" type="email" autocomplete="email" placeholder="Adresse e-mail">
    <input class="field" id="pass" type="password" autocomplete="current-password" placeholder="Mot de passe (6 caractères minimum)">
    <div class="row"><button class="btn alt" style="flex:1" id="login">Se connecter</button><button class="btn alt" style="flex:1" id="signup">Créer un compte</button></div>
    <button class="linkbtn small" id="forgot">Mot de passe oublié ?</button>
    ${err ? `<p class="msg-ko small">${esc(err)}</p>` : ""}${ok ? `<p class="msg-ok small">${esc(ok)}</p>` : ""}</div>`;
  const done = (p) => { applyProfile(p); render(); };
  const mail = () => document.getElementById("mail").value.trim(), pass = () => document.getElementById("pass").value;
  const fail = (e) => viewLogin(({
    "auth/invalid-email": "Adresse e-mail invalide.",
    "auth/missing-password": "Entre ton mot de passe.",
    "auth/weak-password": "Le mot de passe doit faire au moins 6 caractères.",
    "auth/email-already-in-use": "Ce compte existe déjà : appuie sur « Se connecter ».",
    "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
    "auth/wrong-password": "E-mail ou mot de passe incorrect.",
    "auth/user-not-found": "Aucun compte avec cet e-mail : appuie sur « Créer un compte ».",
    "auth/too-many-requests": "Trop d'essais. Attends quelques minutes.",
  })[e && e.code] || "La connexion n'a pas abouti. Réessaie.");
  document.getElementById("google").onclick = () => Compte.signIn().then(done).catch(fail);
  document.getElementById("login").onclick = () => Compte.signInEmail(mail(), pass(), false).then(done).catch(fail);
  document.getElementById("signup").onclick = () => Compte.signInEmail(mail(), pass(), true).then(done).catch(fail);
  document.getElementById("forgot").onclick = () => mail()
    ? Compte.resetPassword(mail()).then(() => viewLogin("", "Un e-mail pour changer ton mot de passe a été envoyé."), fail)
    : viewLogin("Écris d'abord ton adresse e-mail.");
}
// le profil en ligne fait foi pour l'essai et le premium ; les progrès les plus complets sont gardés
function applyProfile(p) {
  if (!p) return;
  S.trialStart = p.created.toISOString().slice(0, 10);
  S.premium = p.premium;
  const d = p.data || {};
  if (Object.keys(d.stats || {}).length > Object.keys(S.stats).length) Object.assign(S, { stats: d.stats, sessions: d.sessions || [], days: d.days || [], daily: d.daily || {}, challenges: d.challenges || {}, done: d.done || {} });
  if (!S.level && d.level) S.level = d.level;
  // emploi du temps et devoirs : retrouvés en se connectant sur un autre téléphone
  if (!Object.keys(S.edt || {}).length && d.edt) S.edt = d.edt;
  if (!(S.todo || []).length && d.todo) S.todo = d.todo;
  try { localStorage.setItem("racine", JSON.stringify(S)); } catch {}
}

function render() {
  clearInterval(timer);
  // hors connexion (Firebase injoignable), l'appli reste utilisable en local
  if (Compte.enabled && Compte.ready && !Compte.user) return viewLogin();
  const [tab, ...rest] = (location.hash.slice(1) || (isStaff() ? "ecole" : "accueil")).split("/"), arg = rest.length ? rest.join("/") : undefined;
  document.getElementById("exam-tag").textContent = S.level || "";
  // onglets selon le profil : l'équipe de l'école a son espace à la place des erreurs et du premium
  document.querySelectorAll(".tabs a").forEach((a) => { a.hidden = S.role === "parent" ? a.dataset.tab !== "ecole" : isStaff() ? ["erreurs", "premium"].includes(a.dataset.tab) : a.dataset.tab === "ecole"; });
  // profil et fiche d'inscription d'abord, puis l'espace école (qui ne dépend pas d'une classe)
  document.querySelector(".tabs").hidden = !S.role;
  if (!S.role) return viewRole();
  if (S.role === "eleve" && !S.fiche && tab !== "classe") return viewInscription();
  if (tab === "inscription" && S.role === "eleve") return viewInscription();
  if (tab === "ecole" && isStaff()) { document.querySelectorAll(".tabs a").forEach((a) => { if (a.dataset.tab === "ecole") a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); }); return viewEcole(); }
  if ((!S.level || !DATA.levels.includes(S.level)) && tab !== "classe") { S.level = null; return viewLevel(); }
  // après l'essai, l'appli est la même pour tous mais réservée aux abonnés : seuls l'accueil, la classe et les progrès restent visibles
  if (!isPremium() && !["accueil", "classe", "premium", "progres"].includes(tab)) return viewPremium(`Ton essai gratuit de ${TRIAL_DAYS} jours est terminé. Abonne-toi pour continuer à réviser.`);
  document.querySelectorAll(".tabs a").forEach((a) => { if (a.dataset.tab === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  if ((globalThis.ROUTES || {})[tab]) { ROUTES[tab](arg); window.scrollTo(0, 0); return; }
  ({ classe: viewLevel, annales: viewAnnales, exercices: viewExercices, "qcm-list": viewQcmList, devoir: () => viewDevoir(arg), duo: () => viewDuo(arg), challenge: viewChallenge, fiches: viewFiches, fiche: () => viewFiche(arg), assistant: viewAssistant, agenda: () => viewAgenda(arg), notions: viewNotions, notion: () => viewNotion(arg), sujet: () => viewGuided(arg), quiz: () => viewQuiz(arg), examen: viewExam, erreurs: viewErrors, progres: viewProgress, premium: () => viewPremium(), carte: viewCarte, notes: () => viewMesNotes(arg), cahier: viewCahier, demandes: viewMesDemandes, messages: () => viewMessagesEleve(arg), documents: viewMesDocuments, badges: viewBadges, assiduite: viewAssiduite, clubs: viewClubs, orientation: viewOrientation, rendre: viewRendre, vie: () => viewVie(arg), outils: () => viewOutils(arg) }[tab] || viewHome)();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);

let deferred = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; document.getElementById("install").hidden = false; });
document.getElementById("install").onclick = () => { if (deferred) { deferred.prompt(); deferred = null; document.getElementById("install").hidden = true; } };
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

Promise.all([fetch("data/questions.json", { cache: "no-cache" }).then((r) => r.json()), fetch("data/config.json", { cache: "no-cache" }).then((r) => r.json())])
  .then(async ([d, c]) => { DATA = d; CFG = c; applyProfile(await Compte.start().catch(() => null)); await ecoleStart().catch(() => {}); render(); })
  .catch(() => { $view.innerHTML = `<div class="card"><p>Impossible de charger les questions. Vérifie ta connexion puis recharge la page.</p></div>`; });
