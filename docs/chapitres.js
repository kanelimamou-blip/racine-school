"use strict";
// Parcours du programme : classe → matière → chapitre. Chaque chapitre réunit le cours (notion), la synthèse,
// les formules, l'exercice corrigé et les QCM du chapitre, avec un bouton vers le chapitre suivant.
// Les vues s'enregistrent dans ROUTES (lu par render() dans app.js).

(() => {
  const ROUTES = (globalThis.ROUTES = globalThis.ROUTES || {});
  const progOf = (sid) => (DATA.programmes || {})[sid] || [];
  const subs = () => subjectsOf(S.level).filter((s) => !/annales/.test(s.id) && progOf(s.id).length);
  const notionOf = (sid, p) => ((DATA.notions || {})[sid] || []).find((n) => n.pch === p);
  const synthOf = (sid, p) => ((DATA.fiches || {})[sid] || []).map((c, i) => ({ c, i })).filter((x) => x.c.p === p);
  const formOf = (sid, p) => ((DATA.formules || {})[sid] || []).find((c) => c.p === p);
  const qcmOf = (sid, p) => DATA.questions.filter((q) => (q.s === sid && q.ch === p) || (q.alt === sid && q.ach === p && subjectsOf(S.level).some((x) => x.id === q.s)));

  // supports déposés par les professeurs de l'école pour ce chapitre (ou toute la matière) : affichés en premier
  const supports = (sid, p) => (typeof Ecole === "undefined" || typeof documentsPour !== "function" || !S.role ? Promise.resolve([]) : Ecole.liste("documents").then(documentsPour).catch(() => []))
    .then((l) => l.filter((d) => d.sid === sid && (p === undefined || d.pch === p || d.pch === -1)).sort((a, b) => String(b.le).localeCompare(String(a.le))));
  const showSupports = (sid, p) => supports(sid, p).then((l) => { const el = document.getElementById("supports"); if (!el || !l.length) return;
    el.innerHTML = `<div class="card notion-key"><h2>🏫 Supports de ton école</h2>${l.map((d) => `<div class="row lib"><span>${d.type && d.type.startsWith("image") ? "🖼️" : d.lien ? "🔗" : "📄"} ${esc(d.titre)}<br><span class="small muted">${esc(d.parNom || "")}${d.pch === -1 ? " · toute la matière" : ""}</span></span>${d.fichier ? `<a class="btn alt small" style="width:auto" href="${esc(d.fichier)}" download="${esc(d.nomFichier || d.titre)}" target="_blank">Ouvrir</a>` : d.lien ? `<a class="btn alt small" style="width:auto" href="${esc(d.lien)}" target="_blank" rel="noopener">Ouvrir</a>` : ""}</div>`).join("")}</div>`; });

  function viewMatiere(sid) {
    const s = subs().find((x) => x.id === sid);
    if (!s) {
      $view.innerHTML = `<h1>Mes matières</h1><p class="muted">Le programme officiel de ${esc(S.level)}, matière par matière et chapitre par chapitre.</p>
        <div class="grid">${subs().map((x) => `<a class="subj" href="#matiere/${x.id}" style="text-decoration:none;color:inherit"><b>${esc(x.name)}</b><span class="small muted">${progOf(x.id).length} chapitres</span><span class="bar"><i style="width:${mastery(x.id)}%"></i></span></a>`).join("")}</div>`;
      return;
    }
    $view.innerHTML = `<p class="tag-src">${esc(S.level)} · programme officiel</p><h1>${esc(s.name)}</h1><div id="supports"></div>
      <p class="muted">${progOf(sid).length} chapitres, dans l'ordre du programme. Chaque chapitre : cours, synthèse, ${(DATA.formules || {})[sid] ? (/maths|pc|svt|eco|compta/.test(sid) ? "formules, " : "repères à retenir, ") : ""}exercice corrigé et QCM.</p>
      <div class="card">${progOf(sid).map((t, p) => `<a class="row lib" href="#chapitre/${sid}/${p}"><span>${p + 1}. ${esc(t)}</span><span class="small muted">${qcmOf(sid, p).length} QCM ›</span></a>`).join("")}</div>
      <a class="btn" href="#quiz/${sid}/themes">🎯 QCM par thème, pour préparer un devoir</a>
      <a class="btn alt" href="#quiz/${sid}">QCM sur toute la matière</a>
      <a class="btn alt" href="#matiere">Autres matières</a>`;
    showSupports(sid);
  }

  function viewChapitre(arg) {
    const [sid, k] = String(arg || "").split("/"), p = +k, s = subs().find((x) => x.id === sid), prog = progOf(sid);
    if (!s || !(p >= 0 && p < prog.length)) return go("matiere" + (s ? "/" + sid : ""));
    const n = notionOf(sid, p), syn = synthOf(sid, p), f = formOf(sid, p), qs = qcmOf(sid, p);
    $view.innerHTML = `<p class="tag-src">${esc(s.name)} · chapitre ${p + 1} / ${prog.length}</p><h1>${esc(prog[p])}</h1><div id="supports"></div>
      ${n ? `<a class="card lib-card" href="#notion/${n.id}"><b>📘 Le cours</b><span class="small muted">Cours expliqué, à retenir, ${n.exemples.length} exemple${n.exemples.length > 1 ? "s" : ""} résolu${n.exemples.length > 1 ? "s" : ""}${isPremium() || n.free ? "" : " 🔒"}</span></a>` : ""}
      ${syn.map(({ c, i }) => `<a class="card lib-card" href="#fiche/${sid}~${i}"><b>📝 La synthèse${syn.length > 1 ? " : " + esc(c.t) : ""}</b><span class="small muted">L'essentiel, la méthode, les pièges, un exemple corrigé, ce qui tombe à l'examen</span></a>`).join("")}
      ${f ? `<details class="card"><summary><b>${/maths|pc|eco|compta/.test(sid) ? "📐 Les formules du chapitre" : /svt/.test(sid) ? "📐 Formules et repères du chapitre" : "📌 Les repères à retenir"}</b> <span class="small muted">(${f.f.length})</span></summary><ul class="steps">${f.f.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><a class="small" href="#outils/formules/${sid}">Tout le formulaire de ${esc(s.name)}</a></details>` : ""}
      ${n ? `<a class="card lib-card" href="#sujet/ch-${n.id}"><b>✏️ Exercice corrigé pas à pas</b><span class="small muted">Tu réponds étape par étape, le corrigé suit chaque réponse</span></a>` : ""}
      <a class="card lib-card" href="#outils/flash/${sid}/${p}"><b>🃏 Fiches flash</b><span class="small muted">Les cartes tirées de la synthèse de ce chapitre</span></a>
      <button class="btn hi-btn" id="qcm"${qs.length || (GEN[sid] || []).some(([c]) => c === prog[p]) ? "" : " disabled"}>✅ QCM du chapitre (${qs.length})</button>
      ${prog[p + 1] !== undefined ? `<a class="btn" href="#chapitre/${sid}/${p + 1}">Chapitre suivant : ${esc(prog[p + 1])}</a>` : ""}
      ${p > 0 ? `<a class="btn alt" href="#chapitre/${sid}/${p - 1}">Chapitre précédent</a>` : ""}
      <a class="btn alt" href="#matiere/${sid}">Tous les chapitres de ${esc(s.name)}</a>`;
    showSupports(sid, p);
    document.getElementById("qcm").onclick = () => {
      const picked = mixQuestions(sid, qs, 10, [prog[p]]), title = `${s.name} · ${prog[p]}`;
      chooseMode(title, `${picked.length} questions sur ce chapitre.`, (solo) => { markDone("qcm"); runQuiz(title, picked, `#chapitre/${sid}/${p}`, { solo }); });
    };
  }

  Object.assign(ROUTES, { matiere: viewMatiere, chapitre: viewChapitre });
})();
