"use strict";
// Mieux apprendre : objectif et plan de révision, diagnostic, chapitres incontournables, simulation du jour J,
// méthodes pas à pas, cartes mentales, écoute des cours, dictées, prononciation anglaise, niveau et avatar,
// hors connexion et économie de données. Les vues s'enregistrent dans ROUTES (lu par render() dans app.js).

(() => {
  const ROUTES = (globalThis.ROUTES = globalThis.ROUTES || {});
  const nf = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toLocaleString("fr-FR");
  const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  const mainSubs = () => subjectsOf(S.level).filter((s) => !/annales/.test(s.id) && ((DATA.programmes || {})[s.id] || []).length);
  const back = (h = "#apprendre", t = "Retour") => `<a class="btn alt" href="${h}">${t}</a>`;

  // ---------- Chapitres qui reviennent presque toujours à l'examen (structure habituelle des sujets du BFEM et du BAC)
  const INCONT = { "3e-maths": [0, 1, 2, 4, 5, 6, 8], "3e-pc": [0, 1, 3, 5, 6], "3e-svt": [1, 2, 3, 4, 5], "tle-maths": [3, 4, 5, 6, 8, 10, 11, 14], "tle-pc": [1, 2, 3, 4, 7, 8, 17, 18, 21, 22], "tle-svt": [0, 1, 3, 5, 6, 8, 9] };
  const incont = (sid, i) => (INCONT[sid] || []).includes(i);

  // ---------- Maîtrise d'un chapitre : dernière réponse à ses questions, sinon le diagnostic
  function chMastery(sid, i) {
    const qs = qsOf(sid).filter((q) => q.ch === i && S.stats[q.id]);
    if (qs.length) return Math.round((100 * qs.filter((q) => S.stats[q.id].last).length) / qs.length);
    const d = S.diag && S.diag.ch && S.diag.ch[`${sid}~${i}`];
    return d === undefined ? null : d ? 100 : 0;
  }
  const ficheOf = (sid, i) => ((DATA.fiches || {})[sid] || []).findIndex((c) => c.p === i);
  function chapterRow(sid, i, sname) {
    const key = `${sid}~${i}`, m = chMastery(sid, i), fi = ficheOf(sid, i), done = (S.planDone || {})[key];
    return `<div class="plan-row${done ? " done" : ""}"><label class="row" style="gap:10px;align-items:flex-start"><input type="checkbox" data-done="${key}"${done ? " checked" : ""} style="margin-top:4px">
      <span style="flex:1"><b>${esc(DATA.programmes[sid][i])}</b>${incont(sid, i) ? " ⭐" : ""}<br><span class="small muted">${esc(sname)} · ${m === null ? "pas encore travaillé" : `maîtrisé à ${m} %`}</span></span></label>
      <div class="row" style="gap:8px;justify-content:flex-start;margin:6px 0 0 30px">${fi >= 0 ? `<a class="btn-ghost small" href="#fiche/${sid}~${fi}">📝 Lire</a>` : ""}<button class="btn-ghost small" data-train="${key}">✏️ M'entraîner</button></div></div>`;
  }
  function bindRows() {
    $view.querySelectorAll("[data-train]").forEach((b) => (b.onclick = () => { const [sid, i] = b.dataset.train.split("~"); S.devoir = { ...(S.devoir || {}), [sid]: [+i] }; store.save(); go("devoir/" + sid); }));
    $view.querySelectorAll("[data-done]").forEach((b) => (b.onchange = () => { S.planDone = S.planDone || {}; if (b.checked) S.planDone[b.dataset.done] = today(); else delete S.planDone[b.dataset.done]; store.save(); b.closest(".plan-row").classList.toggle("done", b.checked); }));
  }

  // ---------- 49 et 51. Objectif de note et plan de révision jusqu'à l'examen
  // note estimée : part des bonnes réponses (dernière tentative) parmi les questions déjà travaillées, matière par matière
  const estNote = () => { const r = mainSubs().map((s) => qsOf(s.id).filter((q) => S.stats[q.id])).filter((l) => l.length).map((l) => l.filter((q) => S.stats[q.id].last).length / l.length); return r.length ? (20 * r.reduce((a, b) => a + b, 0)) / r.length : null; };
  function planDate() { const ex = examOf(); if (ex) return ex[1]; if (S.planDate && S.planDate > today()) return S.planDate; const d = new Date(Date.now() + 42 * 864e5); return d.toISOString().slice(0, 10); }
  function planItems() {
    const out = [];
    for (const s of mainSubs()) DATA.programmes[s.id].forEach((t, i) => { const m = chMastery(s.id, i); if ((S.planDone || {})[`${s.id}~${i}`] || (m !== null && m >= 80)) return; out.push({ sid: s.id, i, sname: s.name, p: (m === null ? 50 : m) - (incont(s.id, i) ? 25 : 0) }); });
    return out.sort((a, b) => a.p - b.p);
  }
  function viewPlan() {
    const date = planDate(), days = Math.max(1, Math.ceil((new Date(date) - new Date(today())) / 864e5)), weeks = Math.max(1, Math.ceil(days / 7));
    const items = planItems(), workWeeks = weeks > 2 ? weeks - 1 : weeks, per = Math.max(1, Math.ceil(items.length / workWeeks));
    const est = estNote(), obj = S.objectif || 12, ex = examOf();
    const groups = []; for (let w = 0; w < workWeeks && w * per < items.length; w++) groups.push(items.slice(w * per, (w + 1) * per));
    const totalCh = mainSubs().reduce((n, s) => n + DATA.programmes[s.id].length, 0);
    $view.innerHTML = `<h1>Mon plan de révision</h1>
      <div class="card"><h2>🎯 Mon objectif</h2><div class="row"><label for="obj">Note visée${ex ? ` au ${ex[0]}` : ""}</label><select id="obj" style="width:auto">${[10, 11, 12, 13, 14, 15, 16, 17, 18].map((n) => `<option${n === obj ? " selected" : ""}>${n}</option>`).join("")}</select></div>
        <p>${est === null ? "Fais quelques QCM ou le diagnostic pour que j'estime ton niveau." : `Niveau estimé d'après tes QCM : <b>${nf(est)} / 20</b>. ${est >= obj ? "Tu es au niveau de ton objectif : garde le rythme 💪" : `Il te manque environ <b>${nf(obj - est)} point${obj - est >= 2 ? "s" : ""}</b>. Le plan ci-dessous commence par ce qui t'en rapporte le plus.`}`}</p>
        ${S.diag ? "" : `<a class="btn hi-btn" href="#diagnostic">Faire mon diagnostic (15 min)</a>`}</div>
      <div class="card"><div class="row"><div><p class="small muted">${ex ? `${ex[0]}, date indicative` : "Prochaine composition"}</p><p class="count">J−${days}</p></div><div style="text-align:right"><p class="small muted">Chapitres à revoir</p><p class="count">${items.length} / ${totalCh}</p></div></div>
        ${ex ? "" : `<label class="small" for="pd">Date de ta prochaine composition</label><input id="pd" type="date" value="${date}">`}
        <p class="small muted">${per} chapitre${per > 1 ? "s" : ""} par semaine${weeks > 2 ? ", et la dernière semaine pour les examens blancs" : ""}. Un chapitre sort du plan quand tu le coches ou quand tu le réussis à 80 %. ⭐ = revient très souvent à l'examen.</p></div>
      ${groups.length ? `<h2>Cette semaine</h2><div class="card">${groups[0].map((x) => chapterRow(x.sid, x.i, x.sname)).join("")}</div>` : `<div class="card"><p class="msg-ok">Tout le programme est revu. Place aux examens blancs !</p><a class="btn" href="#examen">${blancName()}</a></div>`}
      ${groups.slice(1).map((g, w) => `<details class="card"><summary><b>Semaine ${w + 2}</b> <span class="small muted">· ${g.length} chapitres</span></summary>${g.map((x) => chapterRow(x.sid, x.i, x.sname)).join("")}</details>`).join("")}
      ${weeks > 2 && groups.length ? `<div class="card"><h2>Dernière semaine</h2><p>Examens blancs, simulation du jour J et relecture de tes fiches. Pas de nouveau chapitre.</p><a class="btn alt" href="#jourj">Simulation du jour J</a></div>` : ""}
      ${incontCard()}${back()}`;
    document.getElementById("obj").onchange = (e) => { S.objectif = +e.target.value; store.save(); viewPlan(); };
    const pd = document.getElementById("pd"); if (pd) pd.onchange = (e) => { S.planDate = e.target.value; store.save(); viewPlan(); };
    bindRows();
  }
  // ---------- 67. Ce qui tombe le plus
  function incontCard() {
    const subs = mainSubs().filter((s) => INCONT[s.id]);
    if (!subs.length) return "";
    return `<div class="card"><h2>⭐ Ce qui tombe presque à chaque fois</h2><p class="small muted">D'après la structure habituelle des sujets du ${examOf() ? examOf()[0] : "BAC"}. Révise-les en priorité, sans faire d'impasse sur le reste.</p>
      ${subs.map((s) => `<p><b>${esc(s.name)}</b></p><ul class="steps">${INCONT[s.id].map((i) => `<li>${esc(DATA.programmes[s.id][i])} ${(() => { const m = chMastery(s.id, i); return m === null ? "" : `<span class="small muted">· ${m} %</span>`; })()}</li>`).join("")}</ul>`).join("")}</div>`;
  }
  globalThis.planCard = () => {
    if (!S.objectif && !S.diag) return "";
    const it = planItems(), est = estNote();
    return `<a class="card" href="#plan" style="display:block;text-decoration:none;color:inherit"><div class="row"><h2>📅 Mon plan de révision</h2><span class="small muted">voir ›</span></div>
      <p class="small">${it.length} chapitre${it.length > 1 ? "s" : ""} à revoir${it[0] ? ` · prochain : <b>${esc(DATA.programmes[it[0].sid][it[0].i])}</b>` : ""}${S.objectif ? ` · objectif ${S.objectif}/20${est !== null ? `, niveau estimé ${nf(est)}` : ""}` : ""}</p></a>`;
  };

  // ---------- 50. Diagnostic de début d'année : une question par chapitre, 40 au maximum
  function viewDiagnostic() {
    const per = mainSubs().map((s) => shuffle(DATA.programmes[s.id].map((t, i) => i)).map((i) => { const pool = qsOf(s.id).filter((q) => q.ch === i && open(q)); return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null; }).filter(Boolean));
    const qs = []; for (let k = 0; qs.length < 40 && per.some((l) => l.length); k = (k + 1) % per.length) if (per[k].length) qs.push(per[k].shift());
    if (!qs.length) return go("plan");
    const order = shuffle(qs);
    $view.innerHTML = `<h1>Mon diagnostic</h1><div class="card"><p>${order.length} questions sur tout le programme de ${esc(S.level)}, une par chapitre. Réponds sans stress : le but est de savoir par où commencer.</p><p class="small muted">Les corrections arrivent à la fin. Environ 15 minutes.</p><button class="btn hi-btn" id="go">Commencer</button></div>${back("#plan")}`;
    document.getElementById("go").onclick = () => { markDone("qcm"); runQuiz("Diagnostic de " + S.level, order, "#plan", { solo: true, onEnd: (score, total, answers) => {
      const ch = {}, bys = {};
      answers.forEach(({ q, ok }) => { ch[`${q.s}~${q.ch}`] = ok ? 1 : 0; const b = (bys[q.s] = bys[q.s] || { ok: 0, n: 0 }); b.n++; b.ok += ok ? 1 : 0; });
      S.diag = { d: today(), ch }; store.save();
      const rows = Object.entries(bys).map(([sid, b]) => [subjName(sid), Math.round((100 * b.ok) / b.n)]).sort((a, b) => a[1] - b[1]);
      return `<div class="card"><h2>Ton diagnostic par matière</h2>${rows.map(([n, p]) => `<div><div class="row small"><span>${esc(n)}</span><b>${p} %</b></div><div class="bar"><i style="width:${p}%"></i></div></div>`).join("")}
        <p class="small muted">Ton plan de révision est maintenant construit à partir de ces résultats.</p><a class="btn hi-btn" href="#plan">Voir mon plan de révision</a></div>`; } }); };
  }

  // ---------- 52. Écouter le cours (voix du téléphone, sans connexion sur la plupart des téléphones)
  const canSay = "speechSynthesis" in window;
  function say(text, lang = "fr-FR", rate = 0.95, onend) {
    if (!canSay) return;
    speechSynthesis.cancel();
    const voice = speechSynthesis.getVoices().find((v) => v.lang.replace("_", "-").startsWith(lang.slice(0, 2)) && v.lang.includes(lang.slice(3))) || speechSynthesis.getVoices().find((v) => v.lang.startsWith(lang.slice(0, 2)));
    const parts = String(text).replace(/\s+/g, " ").match(/[^.!?;:]+[.!?;:]*/g) || [text];
    parts.forEach((p, k) => { const u = new SpeechSynthesisUtterance(p.replace(/[→⇒]/g, ", donc ").replace(/≈/g, " environ ").replace(/×/g, " fois ").replace(/÷/g, " divisé par ")); u.lang = lang; u.rate = rate; if (voice) u.voice = voice; if (k === parts.length - 1 && onend) u.onend = onend; speechSynthesis.speak(u); });
  }
  if (canSay) { speechSynthesis.getVoices(); window.addEventListener("hashchange", () => speechSynthesis.cancel()); }
  globalThis.audioBtn = () => (canSay ? `<button class="btn alt" data-say="view">🔊 Écouter ce chapitre</button>` : "");
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-say]");
    if (!b) return;
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); b.textContent = "🔊 Écouter ce chapitre"; return; }
    const txt = [...$view.querySelectorAll("h1, .card h2, .card li, .card > p")].filter((el) => !el.closest("details")).map((el) => el.innerText.replace(/^[^\wÀ-ÿ]+/, "")).join(". ");
    b.textContent = "⏹️ Arrêter la lecture";
    say(txt, "fr-FR", 0.95, () => { b.textContent = "🔊 Écouter ce chapitre"; });
  });

  // ---------- 61. Dictées audio (textes originaux)
  const DICT = [
    ["6e 5e", "Le marché du matin", "Chaque samedi, ma mère m'emmène au marché. Les vendeuses installent leurs tables dès le lever du soleil. On y trouve des tomates rouges, des oignons, du poisson frais et des mangues bien mûres. Je porte le panier pendant qu'elle discute les prix. Au retour, nous préparons ensemble le repas de midi."],
    ["6e 5e", "La pluie", "Les premiers nuages sont arrivés hier soir. Le vent s'est levé brusquement et les enfants sont rentrés en courant. Bientôt, de grosses gouttes ont frappé les toits de tôle. Les paysans étaient heureux, car la terre attendait l'eau depuis des mois. Ce matin, les champs sentent bon la terre mouillée."],
    ["6e 5e", "Mon école", "Notre école se trouve au bout de la rue principale. La cour est plantée de grands arbres qui nous donnent de l'ombre. Le matin, nous saluons le drapeau avant d'entrer en classe. Notre maîtresse est sévère mais très juste. J'aime surtout les leçons de calcul et de géographie."],
    ["6e 5e", "Le baobab", "Au milieu du village se dresse un vieux baobab. Son tronc est si large que cinq enfants ne peuvent pas l'entourer de leurs bras. Les anciens se réunissent à son pied pour parler des affaires du village. Ses fruits, que l'on appelle pain de singe, servent à préparer une boisson délicieuse."],
    ["4e 3e", "Les pêcheurs", "Avant l'aube, les pirogues colorées quittent la plage de Kayar. Les pêcheurs ont vérifié leurs filets la veille et rempli les réservoirs des moteurs. La mer est calme, mais ils savent qu'elle peut devenir dangereuse en quelques minutes. Lorsqu'ils reviennent l'après-midi, les femmes les attendent pour acheter le poisson qu'elles iront revendre en ville."],
    ["4e 3e", "Ma première bibliothèque", "Ma grand-mère ne savait ni lire ni écrire, pourtant elle connaissait des centaines de contes. Le soir, nous nous asseyions autour d'elle et elle nous racontait les aventures de Leuk le lièvre. Plus tard, quand j'ai découvert ces mêmes histoires dans un livre, j'ai compris qu'elle avait été ma première bibliothèque."],
    ["4e 3e", "La veille de l'examen", "La veille de l'examen, Awa avait rangé ses affaires avec soin : sa convocation, ses stylos et sa règle. Elle s'était couchée tôt, mais le sommeil avait tardé à venir. Le lendemain, en lisant le sujet, elle s'aperçut qu'elle connaissait la plupart des questions. Elle prit une grande respiration et commença à écrire calmement."],
    ["4e 3e", "La grande ville", "Dakar s'étend chaque année davantage. De nouveaux quartiers sont sortis de terre là où, il y a vingt ans, on ne voyait que des dunes et des champs. Les embouteillages sont devenus le cauchemar des travailleurs, qui quittent leur maison avant six heures. Pourtant, beaucoup de jeunes rêvent encore de venir y tenter leur chance."],
    ["Lycée", "Le savoir", "On croit trop souvent que le savoir se mesure au nombre de diplômes obtenus. Pourtant, les hommes les plus sages que j'ai rencontrés n'avaient jamais franchi les portes d'une université. Ils avaient appris en observant, en écoutant et en se trompant. Leur science, patiemment acquise, n'en était pas moins précieuse que celle des livres."],
    ["Lycée", "L'océan menacé", "Les scientifiques s'inquiètent de la diminution des ressources halieutiques le long des côtes ouest-africaines. Les chalutiers industriels, souvent venus de très loin, capturent en quelques jours ce que les pêcheurs artisanaux mettaient des mois à prendre. Si rien n'est fait, les générations futures hériteront d'un océan appauvri, et des milliers de familles perdront leur gagne-pain."],
    ["Lycée", "Le désert avance", "Dans le nord du pays, le sable gagne du terrain chaque année. Les arbres, coupés pour le bois de chauffe, ne retiennent plus le sol que le vent emporte. Des villages entiers se sont mobilisés pour planter des haies et protéger leurs champs. Ces efforts, modestes en apparence, ont déjà permis de reverdir plusieurs hectares."],
    ["Lycée", "L'exil", "Il était parti un matin de saison sèche, persuadé qu'il reviendrait riche au bout de deux ans. Dix années s'étaient écoulées depuis, et les lettres qu'il envoyait à sa mère se faisaient de plus en plus rares. Il n'osait avouer que la vie là-bas ressemblait si peu à ce qu'il avait imaginé."],
  ];
  const words = (t) => t.replace(/[’`]/g, "'").replace(/[.,;:!?«»"()]/g, " ").split(/\s+/).filter(Boolean);
  // Alignement mot à mot (distance d'édition) : chaque mot manquant, en trop ou mal écrit compte une faute
  function align(ref, got) {
    const R = words(ref), G = words(got), n = R.length, m = G.length, D = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i ? (j ? 0 : i) : j)));
    const eq = (a, b) => a.toLowerCase() === b.toLowerCase();
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (eq(R[i - 1], G[j - 1]) ? 0 : 1));
    const out = []; let i = n, j = m;
    while (i || j) {
      if (i && j && D[i][j] === D[i - 1][j - 1] + (eq(R[i - 1], G[j - 1]) ? 0 : 1)) { out.unshift(eq(R[i - 1], G[j - 1]) ? ["ok", R[i - 1]] : ["sub", R[i - 1], G[j - 1]]); i--; j--; }
      else if (i && D[i][j] === D[i - 1][j] + 1) { out.unshift(["miss", R[i - 1]]); i--; }
      else { out.unshift(["extra", null, G[j - 1]]); j--; }
    }
    return { ops: out, fautes: D[n][m] };
  }
  function viewDictee(arg) {
    if (!canSay) { $view.innerHTML = `<h1>Dictées</h1><div class="card"><p>La voix n'est pas disponible sur ce navigateur. Ouvre l'appli avec Chrome.</p></div>${back()}`; return; }
    const lyc = /2nde|1ère|Tle/.test(S.level), col = /4e|3e/.test(S.level);
    const d = DICT[+arg];
    if (!d) {
      const mine = lyc ? "Lycée" : col ? "4e 3e" : "6e 5e";
      $view.innerHTML = `<h1>Dictées</h1><p class="muted">Le téléphone lit le texte phrase par phrase, tu écris, puis l'appli corrige mot par mot.</p>
        ${["6e 5e", "4e 3e", "Lycée"].map((lv) => `<h2>${lv}${lv === mine ? " · ton niveau" : ""}</h2><div class="card">${DICT.map((x, k) => x[0] === lv ? `<a class="row lib" href="#dictee/${k}"><span>${esc(x[1])}</span><span class="small muted">${words(x[2]).length} mots ›</span></a>` : "").join("")}</div>`).join("")}${back()}`;
      return;
    }
    const sent = d[2].match(/[^.!?]+[.!?]/g).map((x) => x.trim());
    let k = -1;
    $view.innerHTML = `<h1>Dictée : ${esc(d[1])}</h1><div class="card"><p class="small muted" id="st">Écoute d'abord le texte en entier, puis on dicte phrase par phrase.</p>
      <div class="btns"><button class="btn" id="all">🔊 Lire le texte en entier</button><button class="btn alt" id="nx">▶️ Dicter la phrase suivante</button><button class="btn alt" id="rp">🔁 Répéter la phrase</button></div></div>
      <div class="card"><label for="txt"><b>Ta dictée</b></label><textarea id="txt" rows="8" style="width:100%;margin-top:8px" autocapitalize="sentences" spellcheck="false" autocorrect="off"></textarea>
      <button class="btn hi-btn" id="cor">Corriger ma dictée</button></div><div id="res"></div>${back("#dictee", "Autres dictées")}`;
    const st = document.getElementById("st");
    document.getElementById("all").onclick = () => say(d[2], "fr-FR", 0.9);
    const dict = () => { st.textContent = `Phrase ${k + 1} / ${sent.length}`; say(sent[k], "fr-FR", 0.7); };
    document.getElementById("nx").onclick = () => { if (k + 1 < sent.length) { k++; dict(); } else { st.textContent = "C'est fini. Relis-toi, puis corrige."; say("Fin de la dictée. Relisez-vous.", "fr-FR", 0.9); } };
    document.getElementById("rp").onclick = () => { if (k >= 0) dict(); };
    document.getElementById("cor").onclick = () => {
      const { ops, fautes } = align(d[2], document.getElementById("txt").value), note = Math.max(0, 20 - fautes);
      document.getElementById("res").innerHTML = `<div class="card"><p class="score" style="text-align:center">${fautes} faute${fautes > 1 ? "s" : ""}</p><p class="small muted" style="text-align:center">Barème de l'appli : 20 − 1 point par faute, soit ${note} / 20. La ponctuation n'est pas comptée.</p>
        <p style="line-height:2">${ops.map(([t, r, g]) => t === "ok" ? esc(r) : t === "sub" ? `<span class="msg-ko" style="padding:0 4px;border-radius:6px"><s>${esc(g)}</s></span> <span class="msg-ok" style="padding:0 4px;border-radius:6px">${esc(r)}</span>` : t === "miss" ? `<span class="msg-ok" style="padding:0 4px;border-radius:6px">+${esc(r)}</span>` : `<span class="msg-ko" style="padding:0 4px;border-radius:6px"><s>${esc(g)}</s></span>`).join(" ")}</p>
        <p class="small muted">En vert : le mot juste. Barré en rouge : ce que tu as écrit en trop ou mal écrit.</p></div>`;
      markDone("fiche");
    };
  }

  // ---------- 62. Prononciation en anglais
  const PRON = [["Sons difficiles", ["three", "thirty", "think", "this", "these", "thank you", "world", "work", "walk", "ship", "sheep", "live", "leave", "bird", "heard"]],
    ["Lettres muettes", ["knife", "know", "listen", "answer", "climb", "hour", "honest", "island", "Wednesday", "comfortable", "vegetable", "February", "clothes", "through", "thought"]],
    ["Phrases utiles", ["Good morning, how are you?", "Could you repeat, please?", "I don't understand the question.", "What does this word mean?", "I am preparing for my exam.", "My favourite subject is mathematics.", "I live in Senegal, in West Africa.", "Where is the nearest hospital?", "I would like to become a doctor.", "Thank you very much for your help."]]];
  function viewPrononciation() {
    if (!canSay) { $view.innerHTML = `<h1>Prononciation</h1><div class="card"><p>La voix n'est pas disponible sur ce navigateur. Ouvre l'appli avec Chrome.</p></div>${back()}`; return; }
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    $view.innerHTML = `<h1>Prononciation en anglais</h1><p class="muted">Touche 🔊 pour écouter${Rec ? ", puis 🎤 pour dire le mot : l'appli vérifie si elle t'a compris (connexion internet nécessaire pour le micro)" : ", puis répète à voix haute"}.</p>
      ${PRON.map(([t, l]) => `<h2>${t}</h2><div class="card">${l.map((w) => `<div class="row" style="gap:8px;padding:6px 0;border-bottom:1px solid var(--line)"><span style="flex:1">${esc(w)}<br><span class="small" data-res></span></span><button class="btn-ghost" data-en="${esc(w)}" aria-label="Écouter">🔊</button>${Rec ? `<button class="btn-ghost" data-mic="${esc(w)}" aria-label="Parler">🎤</button>` : ""}</div>`).join("")}</div>`).join("")}${back()}`;
    $view.querySelectorAll("[data-en]").forEach((b) => (b.onclick = () => say(b.dataset.en, "en-GB", 0.8)));
    const norm = (s) => s.toLowerCase().replace(/[^a-z' ]/g, "").replace(/\s+/g, " ").trim();
    $view.querySelectorAll("[data-mic]").forEach((b) => (b.onclick = () => {
      const out = b.parentNode.querySelector("[data-res]"), r = new Rec();
      r.lang = "en-GB"; r.maxAlternatives = 5; out.textContent = "Je t'écoute…"; out.className = "small muted";
      r.onresult = (e) => { const alts = [...e.results[0]].map((a) => a.transcript), good = alts.some((a) => norm(a) === norm(b.dataset.mic));
        out.textContent = good ? "✓ Bien prononcé !" : `J'ai entendu : « ${alts[0]} ». Réécoute et réessaie.`; out.className = "small " + (good ? "msg-ok" : "msg-ko"); };
      r.onerror = () => { out.textContent = "Micro indisponible (autorise le micro, vérifie ta connexion)."; out.className = "small muted"; };
      try { r.start(); } catch (x) { r.onerror(); }
    }));
  }

  // ---------- 55. Cartes mentales d'une matière ou d'un chapitre
  const short = (k) => (k.length > 110 ? k.slice(0, 107).replace(/\s+\S*$/, "") + "…" : k);
  function viewCarte(arg = "") {
    const [sid, k] = arg.split("~"), s = DATA.subjects.find((x) => x.id === sid), f = (DATA.fiches || {})[sid];
    if (!s || !f) {
      const subs = subjectsOf(S.level).filter((x) => (DATA.fiches || {})[x.id] && !/annales/.test(x.id));
      $view.innerHTML = `<h1>Cartes mentales</h1><p class="muted">Tout un chapitre ou toute une matière sur un seul écran. Parfait pour réviser la veille d'un devoir.</p><div class="grid">${subs.map((x) => `<a class="subj" href="#carte-mentale/${x.id}" style="text-decoration:none;color:inherit"><b>${esc(x.name)}</b><span class="small muted">${DATA.fiches[x.id].length} chapitres</span></a>`).join("")}</div>${back()}`;
      return;
    }
    if (k === undefined) {
      $view.innerHTML = `<p class="tag-src">Carte mentale · ${esc(S.level)}</p><div class="mm"><div class="mm-c">${esc(s.name)}</div><div class="mm-b">${f.map((c, i) => `<a class="mm-n" href="#carte-mentale/${sid}~${i}" style="--h:${(i * 47) % 360}"><b>${esc(c.t)}</b><span class="small muted">${c.cles.slice(0, 3).map(short).map(esc).join(" · ")}</span></a>`).join("")}</div></div>${back("#carte-mentale-mentale", "Autres matières")}`;
      return;
    }
    const c = f[+k]; if (!c) return go("carte-mentale/" + sid);
    const br = [["📌 L'essentiel", c.cles.map(short)], ["🛠️ Méthodes", (c.methodes || []).map(([t]) => t)], ["⚠️ Pièges", (c.pieges || []).map(short)], ["🎯 À l'examen", c.exam ? [short(c.exam)] : []]].filter(([, l]) => l.length);
    $view.innerHTML = `<p class="tag-src">Carte mentale · ${esc(s.name)}</p><div class="mm"><div class="mm-c">${esc(c.t)}</div><div class="mm-b">${br.map(([t, l], i) => `<div class="mm-n" style="--h:${[220, 150, 10, 45][i]}"><b>${t}</b><ul>${l.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div></div>
      <a class="btn" href="#fiche/${sid}~${k}">Lire la synthèse complète</a>${f[+k + 1] ? `<a class="btn alt" href="#carte-mentale/${sid}~${+k + 1}">Carte suivante : ${esc(f[+k + 1].t)}</a>` : ""}${back("#carte-mentale-mentale/" + sid, "Carte de la matière")}`;
  }

  // ---------- 58. Méthodologie pas à pas
  const METH = [
    ["🔢", "Résoudre un problème de maths", ["Lis tout l'énoncé une première fois sans écrire, puis souligne les données et ce qu'on te demande.", "Fais une figure ou un schéma, même rapide.", "Cherche le chapitre concerné : quelle propriété ou quel théorème relie les données à la question ?", "Rédige : « On sait que… Or… Donc… ». Une étape par ligne.", "Vérifie ton résultat : ordre de grandeur, signe, unité, cas simple.", "Encadre le résultat final."], "Une question bloque ? Admets son résultat et passe à la suivante : elle est souvent utilisable plus loin."],
    ["⚛️", "Rédiger un exercice de physique-chimie", ["Écris les données avec leurs unités et convertis-les dans le système international.", "Écris la formule littérale avant tout calcul.", "Isole l'inconnue dans la formule (expression littérale).", "Fais l'application numérique en remplaçant chaque lettre par sa valeur.", "Donne le résultat avec son unité et un nombre raisonnable de chiffres significatifs.", "Pour la chimie : équation-bilan équilibrée d'abord, puis tableau ou relation des quantités de matière."], "Un résultat sans unité ou une formule absente fait perdre des points même si le nombre est juste."],
    ["🔬", "Exploiter des documents en SVT", ["Présente le document : sa nature (courbe, tableau, schéma) et ce qu'il montre.", "Décris avec des valeurs précises : « de 0 à 2 h, la glycémie passe de 1 g/L à 1,6 g/L ».", "Compare les situations (témoin et expérience).", "Interprète : explique la cause avec tes connaissances du cours.", "Conclus en une phrase qui répond à la question posée."], "Ne récite pas le cours sans t'appuyer sur les documents : décrire puis expliquer."],
    ["✍️", "Dissertation littéraire", ["Analyse le sujet : mots-clés, citation, thèse de l'auteur.", "Formule la problématique sous forme de question.", "Fais un plan en deux ou trois parties, chacune avec deux ou trois arguments.", "Chaque argument : idée, explication, exemple tiré d'une œuvre précise.", "Introduction : amorce, sujet cité, problématique, annonce du plan.", "Conclusion : bilan et ouverture.", "Garde 10 minutes pour te relire (accords, conjugaison)."], "Un exemple doit être précis : auteur, titre, passage. « Dans un roman » ne suffit pas."],
    ["📜", "Commentaire de texte", ["Lis le texte trois fois : sens général, puis le ton, puis les procédés.", "Situe le texte : auteur, œuvre, mouvement, époque.", "Repère les champs lexicaux, figures de style, temps verbaux, rythme.", "Regroupe tes remarques en deux ou trois axes de lecture.", "Pour chaque idée : citation entre guillemets, procédé nommé, effet produit.", "Introduction avec présentation, problématique et annonce des axes."], "Ne pas paraphraser : chaque citation doit être analysée, pas répétée."],
    ["💭", "Dissertation de philosophie", ["Définis chaque terme du sujet et repère le paradoxe ou la tension.", "Pose la problématique en une ou deux questions.", "Partie 1 : la thèse la plus évidente, avec arguments et auteurs.", "Partie 2 : ses limites, l'antithèse.", "Partie 3 : un dépassement qui nuance ou réconcilie.", "Cite les auteurs avec précision et explique toujours la citation."], "Un catalogue d'auteurs n'est pas une réflexion : chaque référence doit servir ton raisonnement."],
    ["🌍", "Histoire-géographie : composition et commentaire de documents", ["Lis la consigne et délimite le sujet : dates, espace, notions.", "Mobilise dates, chiffres, lieux et acteurs précis.", "Composition : introduction, deux ou trois parties chronologiques ou thématiques, conclusion.", "Documents : présente (nature, auteur, date), relève les informations, explique avec le cours, critique (limites, point de vue).", "Croquis : titre, légende organisée, figurés clairs."], "Sans dates ni exemples précis, une copie reste vague et la note aussi."],
    ["🇬🇧", "Essay en anglais", ["Read the topic carefully and underline key words.", "Write a short plan: introduction, two or three paragraphs, conclusion.", "One idea per paragraph, with an example.", "Use linking words: firstly, moreover, however, therefore, to conclude.", "Use simple, correct sentences rather than long, risky ones.", "Check verbs: tenses, -s at the third person, irregular verbs."], "Évite de traduire mot à mot depuis le français : pense directement en phrases anglaises simples."],
    ["📮", "Lettre et rédaction (collège)", ["Lis la consigne : type de texte (lettre, récit, argumentation), destinataire, point de vue.", "Note tes idées au brouillon, puis classe-les.", "Lettre : lieu et date, formule d'appel, paragraphes, formule de politesse, signature.", "Récit : situation initiale, élément déclencheur, péripéties, dénouement, situation finale.", "Relis-toi en vérifiant une chose à la fois : accords, puis conjugaison, puis ponctuation."], "Respecte le nombre de lignes demandé : trop court comme trop long fait perdre des points."],
    ["🧠", "Réviser efficacement", ["Ferme le cahier et récite : se tester vaut mieux que relire.", "Révise un chapitre le jour même, puis 3 jours après, puis une semaine après.", "Mélange les matières dans une même séance.", "Explique le chapitre à un camarade ou à voix haute.", "Travaille 25 minutes, pause 5 minutes, téléphone loin de toi.", "Dors suffisamment : le sommeil range ce que tu as appris."], "Surligner tout le cours donne l'impression de travailler sans rien retenir."],
  ];
  function viewMethodes(arg) {
    const m = METH[+arg];
    if (!m) { $view.innerHTML = `<h1>Méthodes pas à pas</h1><p class="muted">Comment on rédige chaque type d'épreuve, étape par étape.</p><div class="card">${METH.map((x, k) => `<a class="row lib" href="#methodes/${k}"><span>${x[0]} ${esc(x[1])}</span><span class="small muted">›</span></a>`).join("")}</div>${back()}`; return; }
    $view.innerHTML = `<h1>${m[0]} ${esc(m[1])}</h1><div class="card"><ol class="steps">${m[2].map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div><div class="card"><h2>⚠️ Le piège</h2><p>${esc(m[3])}</p></div>${audioBtn()}${back("#methodes", "Autres méthodes")}`;
  }

  // ---------- 66. Simulation du jour J : les épreuves enchaînées, chronométrées, durées réduites
  function epreuves() {
    const tle = /Tle/.test(S.level), ord = ["philo", "francais", "maths", "pc", "svt", "hg", "histoire", "geo", "anglais", "eco", "compta"];
    return mainSubs().sort((a, b) => ord.findIndex((o) => a.id.endsWith(o)) - ord.findIndex((o) => b.id.endsWith(o))).map((s) => (typeof EXGEN !== "undefined" && (EXGEN[s.id] || []).length >= 3
      ? { sid: s.id, name: s.name, href: `#sujet/gs-${s.id}`, min: tle ? 90 : 60, kind: "Sujet complet sur 20" }
      : { sid: s.id, name: s.name, href: `#jourj/q/${s.id}`, min: 25, kind: "20 questions" }));
  }
  const fmt = (ms) => { const t = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };
  function jjBar() {
    let bar = document.getElementById("jj-bar");
    const J = S.jourJ;
    if (!J) { if (bar) bar.remove(); return; }
    const e = J.list[J.i]; if (!e) { if (bar) bar.remove(); return; }
    if (!bar) { bar = document.createElement("div"); bar.id = "jj-bar"; document.body.appendChild(bar); bar.onclick = (ev) => { if (ev.target.id === "jj-next") nextEpreuve(); }; }
    const left = J.t0 + e.min * 60e3 - Date.now();
    bar.innerHTML = `<span>📝 Jour J · ${J.i + 1}/${J.list.length} · ${esc(e.name)} · <b>${left > 0 ? fmt(left) : "Temps écoulé, pose ton stylo !"}</b></span><button class="btn-ghost small" id="jj-next">${J.i + 1 < J.list.length ? "Épreuve suivante" : "Terminer"}</button>`;
    bar.classList.toggle("over", left <= 0);
  }
  function nextEpreuve() {
    const J = S.jourJ; if (!J) return;
    J.i++; J.t0 = Date.now(); store.save();
    if (J.i >= J.list.length) { S.jourJ = null; S.jourJfin = J; store.save(); jjBar(); go("jourj/fin"); }
    else { jjBar(); location.hash = J.list[J.i].href; }
  }
  setInterval(() => { if (typeof S !== "undefined" && S) jjBar(); }, 1000);
  function viewJourJ(arg, sid) {
    if (arg === "q") {
      const s = DATA.subjects.find((x) => x.id === sid); if (!s) return go("jourj");
      return runQuiz(`Jour J · ${s.name}`, pickFresh(qsOf(sid).filter(open), 20), "#jourj", { solo: true });
    }
    if (arg === "fin") {
      const J = S.jourJfin, ses = J ? S.sessions.filter((x) => x.d >= J.d && /^Jour J/.test(x.t)) : [];
      $view.innerHTML = `<h1>Jour J terminé 🎉</h1><div class="card"><p>Tu as tenu toute une journée d'examen. C'est exactement ce qui fera la différence le vrai jour : la concentration se travaille.</p>
        ${ses.length ? ses.map((x) => `<div class="row small"><span>${esc(x.t)}</span><b>${Math.round((200 * x.score) / x.total) / 10} / 20</b></div>`).join("") : ""}
        <p class="small muted">Pour les sujets complets, compare ta copie au corrigé pas à pas de chaque exercice.</p></div><a class="btn" href="#plan">Mon plan de révision</a>${back()}`;
      return;
    }
    const L = epreuves(), J = S.jourJ, ex = examOf();
    $view.innerHTML = `<h1>Simulation du jour J</h1>
      ${J ? `<div class="card"><p>Simulation en cours : épreuve ${J.i + 1} / ${J.list.length}, ${esc(J.list[J.i].name)}.</p><a class="btn hi-btn" href="${J.list[J.i].href}">Reprendre l'épreuve</a><button class="btn alt" id="stop">Arrêter la simulation</button></div>` : ""}
      <div class="card"><p>Comme le jour ${ex ? `du ${ex[0]}` : "de la composition"} : les épreuves s'enchaînent, chronométrées, sans corrigé avant la fin. Les durées sont réduites pour tenir en une demi-journée.</p>
        <ol class="steps">${L.map((e) => `<li><b>${esc(e.name)}</b> · ${e.kind} · ${e.min} min</li>`).join("")}</ol>
        <p class="small muted">Total : ${Math.floor(L.reduce((n, e) => n + e.min, 0) / 60)} h ${L.reduce((n, e) => n + e.min, 0) % 60} min. Prépare une feuille de brouillon, ta calculatrice et de l'eau. Le chrono reste en bas de l'écran.</p>
        ${J ? "" : `<button class="btn hi-btn" id="start">Commencer la simulation</button>`}</div>
      <div class="card"><h2>Le matin du jour J</h2><ul class="steps"><li>Réveil au moins 1 h 30 avant l'épreuve, petit-déjeuner.</li><li>Convocation, pièce d'identité, stylos bleu et noir, règle, calculatrice.</li><li>Arrive 30 minutes en avance.</li></ul></div>${back()}`;
    const st = document.getElementById("start"); if (st) st.onclick = () => { S.jourJ = { list: L, i: 0, t0: Date.now(), d: today() }; store.save(); markDone("exo"); jjBar(); location.hash = L[0].href; };
    const sp = document.getElementById("stop"); if (sp) sp.onclick = () => { S.jourJ = null; store.save(); jjBar(); viewJourJ(); };
  }

  // ---------- 74. Niveau et avatar
  const AVAT = ["🦁", "🐘", "🦒", "🐆", "🦓", "🐊", "🦅", "🐬", "🐢", "🦉", "🐝", "🦋", "👩🏾‍🎓", "👨🏾‍🎓", "👩🏿‍🔬", "👨🏿‍🔬", "👩🏾‍⚕️", "👨🏾‍💻", "👩🏿‍🚀", "🧑🏾‍🏫", "⚽", "🏀", "🎨", "🎵"];
  const TITRES = [[1, "Apprenti"], [3, "Élève appliqué"], [5, "Chercheur"], [7, "Savant"], [10, "Grand savant"], [15, "Sage"]];
  function xp() { const d = Object.values(S.daily || {}); return d.reduce((n, x) => n + x.ok * 10 + (x.n - x.ok) * 3, 0) + (S.days || []).length * 20 + Object.keys(S.planDone || {}).length * 15; }
  function niveau() { const x = xp(); let L = 1; while (50 * L * (L + 1) <= x) L++; const lo = 50 * (L - 1) * L, hi = 50 * L * (L + 1); return { L, x, lo, hi, titre: TITRES.filter(([l]) => l <= L).pop()[1] }; }
  globalThis.profilCard = () => { const n = niveau(); return `<a class="card" href="#profil" style="display:flex;gap:12px;align-items:center;text-decoration:none;color:inherit"><span style="font-size:2.2rem">${S.avatar || "🦁"}</span><span style="flex:1"><b>Niveau ${n.L} · ${n.titre}</b><span class="bar"><i style="width:${Math.round((100 * (n.x - n.lo)) / (n.hi - n.lo))}%"></i></span><span class="small muted">${n.x} XP · encore ${n.hi - n.x} XP pour le niveau ${n.L + 1}</span></span></a>`; };
  function viewProfil() {
    const n = niveau();
    $view.innerHTML = `<h1>Mon profil</h1><div class="card" style="text-align:center"><p style="font-size:4rem;margin:0">${S.avatar || "🦁"}</p><p class="score">Niveau ${n.L}</p><p><b>${n.titre}</b></p><div class="bar"><i style="width:${Math.round((100 * (n.x - n.lo)) / (n.hi - n.lo))}%"></i></div><p class="small muted">${n.x} XP · niveau ${n.L + 1} à ${n.hi} XP</p></div>
      <div class="card"><h2>Choisis ton avatar</h2><div class="grid" style="grid-template-columns:repeat(6,1fr);gap:8px">${AVAT.map((a) => `<button class="btn-ghost" data-av="${a}" style="font-size:1.8rem;padding:6px${a === (S.avatar || "🦁") ? ";outline:3px solid var(--accent);border-radius:12px" : ""}">${a}</button>`).join("")}</div></div>
      <div class="card"><h2>Comment gagner des XP</h2><ul class="steps"><li>Bonne réponse : 10 XP. Mauvaise réponse : 3 XP, car essayer, c'est déjà apprendre.</li><li>Chaque jour où tu révises : 20 XP.</li><li>Chaque chapitre coché dans ton plan : 15 XP.</li></ul>
      <p class="small muted">Titres : ${TITRES.map(([l, t]) => `${t} (niveau ${l})`).join(", ")}.</p></div>${back("#accueil", "Accueil")}`;
    $view.querySelectorAll("[data-av]").forEach((b) => (b.onclick = () => { S.avatar = b.dataset.av; store.save(); viewProfil(); }));
  }

  // ---------- 53 et 54. Hors connexion complet et économie de données
  const FILES = ["./", "index.html", "app.css", "app.js", "compte.js", "generateurs.js", "generateurs_plus.js", "generateurs_lettres.js", "exos_gen.js", "assistant.js", "agenda.js", "vie.js", "apprendre.js", "manifest.webmanifest", "data/questions.json", "data/config.json", "icons/icon-192.png"];
  const setEcoFlag = (on) => caches.open("racine_prefs").then((c) => c.put("eco", new Response(on ? "1" : "0"))).catch(() => {});
  // en économie de données, les questions ne sont mises à jour qu'une fois par jour
  setTimeout(() => { if (typeof S === "undefined" || !S || !S.eco || !navigator.onLine || S.ecoLast === today() || !("caches" in window)) return;
    S.ecoLast = today(); store.save();
    ["data/questions.json?fresh=1", "data/config.json?fresh=1"].forEach((u) => fetch(u, { cache: "no-cache" }).catch(() => {})); }, 5000);
  async function viewHorsLigne() {
    let have = 0;
    if ("caches" in window) for (const f of FILES) if (await caches.match(f, { ignoreSearch: true })) have++;
    const est = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate().catch(() => null) : null;
    const persisted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted().catch(() => false) : false;
    $view.innerHTML = `<h1>Hors connexion et données</h1>
      <div class="card"><div class="row"><div><p class="small muted">Connexion</p><p class="count">${navigator.onLine ? "📶" : "✈️"}</p></div><div style="text-align:right"><p class="small muted">Fichiers prêts hors ligne</p><p class="count">${have} / ${FILES.length}</p></div></div>
        <p class="small muted">${est ? `Place utilisée par l'appli : ${nf((est.usage || 0) / 1048576)} Mo.` : ""} ${persisted ? "Stockage protégé : le téléphone ne l'effacera pas." : ""}</p>
        <button class="btn" id="dl">${have === FILES.length ? "✅ Tout est prêt · revérifier" : "Tout préparer pour le hors-ligne"}</button><p class="small muted" id="dlm"></p></div>
      <div class="card"><div class="row"><h2>📉 Économie de données</h2><label class="row" style="gap:6px"><input type="checkbox" id="eco"${S.eco ? " checked" : ""}> Activée</label></div>
        <p class="small">L'appli n'utilise plus internet à chaque ouverture : tout est lu dans le téléphone et les questions sont mises à jour au plus une fois par jour. La vidéo de présentation est masquée.</p>
        <p class="small muted">Sans connexion, tout fonctionne sauf la connexion au compte, les sessions de groupe et le paiement.</p></div>${back()}`;
    document.getElementById("eco").onchange = (e) => { S.eco = e.target.checked; store.save(); setEcoFlag(S.eco); };
    document.getElementById("dl").onclick = async () => {
      const m = document.getElementById("dlm"); m.textContent = "Téléchargement…";
      try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (x) {}
      let ok = 0; for (const f of [...FILES, "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Source+Sans+3:wght@400;600;700&display=swap"]) { try { await fetch(f, { cache: "no-cache" }); ok++; } catch (x) {} }
      m.textContent = `${ok} fichiers vérifiés. Tu peux réviser en mode avion.`; setTimeout(() => viewHorsLigne(), 1500);
    };
  }

  // ---------- Le hub « Mieux apprendre »
  function viewApprendre() {
    const t = (h, i, n, d) => `<a class="subj tile" href="${h}"><span class="ico">${i}</span><b>${n}</b><span class="small muted">${d}</span></a>`;
    $view.innerHTML = `<h1>Mieux apprendre</h1><p class="muted">Un plan, des méthodes et d'autres façons de réviser : écouter, dicter, parler, dessiner.</p>
      <div class="grid rub">${[
        t("#plan", "📅", "Mon plan de révision", "Objectif de note et chapitres semaine par semaine"),
        t("#diagnostic", "🩺", "Mon diagnostic", S.diag ? `Fait le ${S.diag.d} · le refaire` : "Par où commencer ? 15 minutes"),
        t("#jourj", "📝", "Simulation du jour J", "Toutes les épreuves enchaînées, chronométrées"),
        t("#methodes", "🧭", "Méthodes pas à pas", "Dissertation, commentaire, problème, essay…"),
        t("#carte-mentale", "🧠", "Cartes mentales", "Un chapitre sur un seul écran"),
        canSay ? t("#dictee", "🗣️", "Dictées", "Le téléphone dicte, l'appli corrige") : "",
        canSay ? t("#prononciation", "🇬🇧", "Prononciation anglaise", "Écoute, répète, vérifie") : "",
        t("#profil", S.avatar || "🦁", "Mon niveau et mon avatar", `Niveau ${niveau().L} · ${niveau().titre}`),
        t("#hors-ligne", "✈️", "Hors connexion", "Réviser sans internet, économiser les données"),
      ].join("")}</div>`;
  }

  Object.assign(ROUTES, { apprendre: viewApprendre, plan: viewPlan, diagnostic: viewDiagnostic, jourj: (a) => { const p = (a || "").split("/"); viewJourJ(p[0] || undefined, p[1]); }, methodes: viewMethodes, "carte-mentale": viewCarte, dictee: viewDictee, prononciation: viewPrononciation, profil: viewProfil, "hors-ligne": viewHorsLigne });
})();
