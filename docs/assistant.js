// Assistant de révision : l'élève pose une question en langage courant, l'appli cherche dans tout son contenu
// (synthèses, chapitres détaillés, QCM) et répond avec l'extrait du cours, la méthode, et un QCM pour se tester.
// Tout se fait sur le téléphone, sans serveur : gratuit, illimité, et utilisable hors connexion.

const ASSIST = { index: null, level: null, chat: [] };
const STOP = new Set(("a au aux avec ce ces cet cette dans de des du elle en est et eux il ils je la le les leur lui ma mais me mes moi mon ne nos notre nous on ou par pas pour qu que qui sa se ses son sur ta te tes toi ton tu un une vos votre vous y " +
  "c d j l m n s t qu est-ce quoi quel quelle quels quelles comment pourquoi quand combien explique expliquer explique-moi comprends comprendre comprend aide aider peux peut faut faire fait veux voudrais " +
  "sais savoir sait cours lecon chapitre difference entre bien tres plus moins donne donner dire dis svp stp merci bonjour salut").split(" "));

const normA = (s) => String(s).normalize("NFD").replace(/[̀-ͯ⃗]/g, "").toLowerCase();
const stem = (w) => (w.length >= 6 ? w.slice(0, 5) : w);
function tokens(s) {
  return normA(s).split(/[^a-z0-9α-ωµ]+/).filter((w) => w && !STOP.has(w) && (w.length > 1 || /\d/.test(w))).map(stem);
}

// Un « document » par chapitre de synthèse, par chapitre détaillé et par QCM, pour les matières de la classe
function buildIndex(level) {
  const subs = subjectsOf(level).filter((s) => !/annales/.test(s.id)), docs = [];
  for (const s of subs) {
    ((DATA.fiches || {})[s.id] || []).forEach((c, i) => {
      const lines = [...c.cles.map((t) => ["cle", t]), ...(c.methodes || []).map(([t, st]) => ["methode", t, st]), ...(c.pieges || []).map((t) => ["piege", t]),
        ...[...(c.exemple ? [c.exemple] : []), ...(c.exemples || [])].map(([q, l]) => ["exemple", q, l])];
      docs.push({ kind: "fiche", sid: s.id, sname: s.name, i, title: c.t, p: c.p, lines, text: [c.t, c.t, c.t, ...lines.map((l) => [l[1], ...(l[2] || [])].join(" ")), c.exam || ""].join(" ") });
    });
    ((DATA.notions || {})[s.id] || []).forEach((c) => docs.push({ kind: "notion", sid: s.id, sname: s.name, id: c.id, title: c.title, free: c.free, pch: c.pch,
      lines: [...c.cours.map((t) => ["cours", t]), ...c.enonce.map((t) => ["cle", t])], text: [c.title, c.title, c.title, ...c.cours, ...c.enonce, ...c.exemples.flatMap(([t, l]) => [t, ...l])].join(" ") }));
    qsOf(s.id).forEach((q) => docs.push({ kind: "qcm", sid: s.id, sname: s.name, q, title: q.q, text: `${q.q} ${q.c[q.a]} ${q.e}` }));
  }
  const df = new Map();
  for (const d of docs) { d.tf = new Map(); for (const w of tokens(d.text)) d.tf.set(w, (d.tf.get(w) || 0) + 1); d.len = [...d.tf.values()].reduce((a, b) => a + b, 0) || 1; for (const w of d.tf.keys()) df.set(w, (df.get(w) || 0) + 1); }
  const avg = docs.reduce((a, d) => a + d.len, 0) / (docs.length || 1);
  return { docs, df, n: docs.length, avg, subs };
}

// score BM25 : les mots rares (« Thalès », « pKa ») comptent plus que les mots fréquents
function score(ix, d, qt) {
  let sc = 0;
  for (const w of qt) {
    const f = d.tf.get(w); if (!f) continue;
    const idf = Math.log(1 + (ix.n - ix.df.get(w) + 0.5) / (ix.df.get(w) + 0.5));
    sc += idf * (f * 2.2) / (f + 1.2 * (0.25 + 0.75 * d.len / ix.avg));
  }
  return sc;
}
// les mots rares de la question (« Sartre », « pKa ») pèsent plus que les mots du titre, présents partout dans le chapitre
const overlap = (ix, text, qt) => { const t = new Set(tokens(text)); return qt.filter((w) => t.has(w)).reduce((a, w) => a + Math.log(1 + ix.n / (ix.df.get(w) || 1)), 0); };

function answer(question) {
  if (!ASSIST.index || ASSIST.level !== S.level) { ASSIST.index = buildIndex(S.level); ASSIST.level = S.level; }
  const ix = ASSIST.index, qt = [...new Set(tokens(question))];
  if (!qt.length) return { empty: true };
  // une matière citée dans la question oriente la recherche
  const nq = normA(question), hint = ix.subs.filter((s) => normA(s.name).split(/[^a-z]+/).some((w) => w.length > 3 && nq.includes(w)) ||
    (/\b(physique|chimie|pc)\b/.test(nq) && /-pc$/.test(s.id)) || (/\bmaths?\b/.test(nq) && /maths/.test(s.id)) || (/\bsvt\b|biologie/.test(nq) && /svt/.test(s.id)) || (/\bphilo/.test(nq) && /philo/.test(s.id))).map((s) => s.id);
  const ranked = ix.docs.map((d) => [score(ix, d, qt) * (hint.length && !hint.includes(d.sid) ? 0.4 : 1) * (d.kind === "qcm" ? 0.8 : 1), d]).filter(([sc]) => sc > 0.5).sort((a, b) => b[0] - a[0]);
  const fiches = ranked.filter(([, d]) => d.kind === "fiche"), notions = ranked.filter(([, d]) => d.kind === "notion"), qcms = ranked.filter(([, d]) => d.kind === "qcm");
  const main = (fiches[0] && (!notions[0] || fiches[0][0] >= notions[0][0] * 0.7)) ? fiches[0][1] : notions[0] ? notions[0][1] : null;
  if (!main) return { none: true, qcm: qcms.slice(0, 1).map(([, d]) => d.q) };
  // dans le chapitre trouvé, les passages qui répondent le mieux à la question
  const best = main.lines.map((l, k) => [overlap(ix, [l[1], ...(Array.isArray(l[2]) ? l[2] : [])].join(" "), qt) + (l[0] === "cle" || l[0] === "cours" ? (k < 2 ? 1 : 0.3) : 0), l]).sort((a, b) => b[0] - a[0]);
  const keys = best.filter(([, l]) => l[0] === "cle" || l[0] === "cours").slice(0, 3).map(([, l]) => l[1]);
  const meth = best.find(([sc, l]) => l[0] === "methode" && sc >= 2), ex = best.find(([sc, l]) => l[0] === "exemple" && sc >= 2), trap = best.find(([sc, l]) => l[0] === "piege" && sc >= 2);
  const sameSubj = qcms.filter(([, d]) => d.sid === main.sid && (main.kind !== "fiche" || main.p === undefined || d.q.ch === main.p));
  const others = [...fiches, ...notions].map(([, d]) => d).filter((d) => d !== main && d.title !== main.title).slice(0, 2);
  const notion = main.kind === "fiche" ? ((DATA.notions || {})[main.sid] || []).find((n) => main.p !== undefined && n.pch === main.p) : main;
  return { main, keys, meth: meth && meth[1], ex: ex && ex[1], trap: trap && trap[1], notion, qcm: (sameSubj.length ? sameSubj : qcms).slice(0, 1).map(([, d]) => d.q), others };
}

function renderAnswer(r) {
  if (r.empty) return `<p>Écris ta question avec quelques mots du cours, par exemple : « c'est quoi le pKa », « comment appliquer Thalès », « la méiose ».</p>`;
  if (r.none) return `<p>Je n'ai pas trouvé ce point dans les cours de ta classe (${esc(S.level)}). Essaie avec d'autres mots, le nom de la notion ou de la matière.</p>`;
  const m = r.main, link = m.kind === "fiche" ? `#fiche/${m.sid}~${m.i}` : `#notion/${m.id}`;
  return `<p class="small muted">${esc(m.sname)} · ${esc(m.title)}</p>
    <p><b>Ce que dit le cours :</b></p><ul class="steps">${r.keys.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>
    ${r.meth ? `<p><b>Méthode : ${esc(r.meth[1])}</b></p><ol class="steps">${r.meth[2].map((l) => `<li>${esc(l)}</li>`).join("")}</ol>` : ""}
    ${r.trap ? `<p>⚠️ <b>Attention :</b> ${esc(r.trap[1])}</p>` : ""}
    ${r.ex ? `<p><b>Exemple :</b> ${esc(r.ex[1])}</p><details><summary class="small">Voir le corrigé</summary><ol class="steps">${r.ex[2].map((l) => `<li>${esc(l)}</li>`).join("")}</ol></details>` : ""}
    <div class="row wrap">
      <a class="btn alt small" href="${link}">📝 Tout le chapitre</a>
      ${r.notion && r.notion !== m ? `<a class="btn alt small" href="#notion/${r.notion.id}">📖 Cours détaillé${isPremium() || r.notion.free ? "" : " 🔒"}</a>` : ""}
      ${m.kind === "fiche" && m.p !== undefined ? `<button class="btn alt small train" data-sid="${m.sid}" data-p="${m.p}">✏️ M'entraîner</button>` : ""}
    </div>
    ${r.others.length ? `<p class="small muted">Voir aussi : ${r.others.map((d) => `<a href="${d.kind === "fiche" ? `#fiche/${d.sid}~${d.i}` : `#notion/${d.id}`}">${esc(d.title)}</a>`).join(" · ")}</p>` : ""}`;
}

function viewAssistant() {
  $view.innerHTML = `<h1>💬 Pose ta question</h1>
    <p class="muted">Demande une définition, une formule, une méthode ou un exemple. Je cherche dans tous les cours de ${esc(S.level)} et je te réponds avec l'extrait du cours, la méthode, et un QCM pour vérifier que tu as compris.</p>
    <div id="chat"></div>
    <form id="ask" class="ask"><input id="qin" autocomplete="off" placeholder="Ex. : comment calculer un pH ?" maxlength="200"><button class="btn" style="width:auto">Envoyer</button></form>
    <p class="small muted">Idées : ${["c'est quoi une primitive", "loi d'Ohm", "accord du participe passé", "la méiose", "théorème de Pythagore"].map((x) => `<a href="#" class="idea">${esc(x)}</a>`).join(" · ")}</p>`;
  const chat = document.getElementById("chat"), input = document.getElementById("qin");
  const draw = () => {
    chat.innerHTML = ASSIST.chat.map((m, k) => m.me ? `<div class="bubble me">${esc(m.text)}</div>` : `<div class="bubble bot" data-k="${k}">${m.html}${m.q ? `<div class="card mini">${questionBlock(m.q)}</div>` : ""}</div>`).join("");
    chat.querySelectorAll(".bubble.bot").forEach((el) => { const m = ASSIST.chat[+el.dataset.k]; if (m.q) bindQuestion(el.querySelector(".mini"), m.q, () => {}); });
    chat.querySelectorAll(".train").forEach((b) => b.onclick = () => { S.devoir = { ...(S.devoir || {}), [b.dataset.sid]: [+b.dataset.p] }; store.save(); go("devoir/" + b.dataset.sid); });
    const last = chat.lastElementChild; if (last) last.scrollIntoView({ block: "start" });
  };
  const ask = (text) => {
    text = text.trim(); if (!text) return;
    const r = answer(text);
    ASSIST.chat.push({ me: true, text }, { html: renderAnswer(r) + (r.qcm && r.qcm.length ? `<p><b>Teste-toi :</b></p>` : ""), q: r.qcm && r.qcm[0] ? remix(r.qcm[0]) : null });
    ASSIST.chat = ASSIST.chat.slice(-20);
    markDone("assistant"); draw(); input.value = "";
  };
  document.getElementById("ask").onsubmit = (e) => { e.preventDefault(); ask(input.value); };
  $view.querySelectorAll(".idea").forEach((a) => a.onclick = (e) => { e.preventDefault(); ask(a.textContent); });
  draw();
}
