// Emploi du temps et cahier de textes : l'élève note ses cours de la semaine et ce qu'il doit rendre.
// La veille au soir (à partir de 17 h), l'appli propose quoi réviser pour les cours et les devoirs du lendemain.
// Tout est rangé dans S (sauvegardé sur le téléphone et dans le compte de l'élève).

const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const ORDRE_JOURS = [1, 2, 3, 4, 5, 6, 0];
const TYPES_TODO = ["Devoir surveillé", "Composition", "Exercice à rendre", "Exposé", "Leçon à apprendre", "Autre"];
const isoDay = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const daysUntil = (iso) => Math.round((new Date(iso + "T12:00") - new Date(isoDay(new Date()) + "T12:00")) / 864e5);
const quand = (n) => n < 0 ? `en retard de ${-n} jour${n < -1 ? "s" : ""}` : n === 0 ? "aujourd'hui" : n === 1 ? "demain" : n === 2 ? "après-demain" : `dans ${n} jours`;
const hh = (t) => t.replace(/^0(?=\d)/, "").replace(":", " h ").replace(/ h 00$/, " h");
const slotName = (c) => c.sid ? subjName(c.sid) : c.nom;
const slotsOf = (day) => ((S.edt || {})[day] || []).slice().sort((a, b) => a.d.localeCompare(b.d));

// Chapitre à revoir en priorité dans une matière : celui où l'élève a le plus d'erreurs, sinon le moins travaillé
function chapitreConseille(sid) {
  const prog = (DATA.programmes || {})[sid], f = (DATA.fiches || {})[sid] || [];
  if (!prog || !f.length) return null;
  const err = prog.map(() => 0), seen = prog.map(() => 0);
  for (const q of DATA.questions) {
    if (q.s !== sid || q.ch < 0) continue;
    const st = S.stats[q.id]; if (!st) continue;
    seen[q.ch] += st.ok + st.ko; if (st.last === false) err[q.ch]++;
  }
  const withFiche = f.map((c, i) => ({ c, i })).filter(({ c }) => c.p !== undefined);
  if (!withFiche.length) return null;
  const pickErr = withFiche.slice().sort((a, b) => err[b.c.p] - err[a.c.p])[0];
  const best = err[pickErr.c.p] > 0 ? pickErr : withFiche.slice().sort((a, b) => seen[a.c.p] - seen[b.c.p])[0];
  return { ...best, raison: err[best.c.p] > 0 ? `${err[best.c.p]} erreur${err[best.c.p] > 1 ? "s" : ""} à corriger` : "pas encore assez travaillé" };
}

// Suggestions de la veille : à partir de 17 h on prépare demain, avant on regarde aujourd'hui
function suggestions() {
  const now = new Date(), soir = now.getHours() >= 17, cible = soir ? addDays(now, 1) : now;
  const slots = slotsOf(cible.getDay()), todos = (S.todo || []).filter((t) => !t.done && daysUntil(t.date) <= 2);
  const out = [];
  for (const t of todos.sort((a, b) => a.date.localeCompare(b.date))) {
    const prog = t.sid && (DATA.programmes || {})[t.sid];
    out.push({ ico: "🎯", txt: `<b>${esc(t.type)}</b>${t.sid || t.nom ? ` de ${esc(t.sid ? subjName(t.sid) : t.nom)}` : ""} ${quand(daysUntil(t.date))}${t.note ? ` : ${esc(t.note)}` : ""}`,
      href: prog ? `#devoir/${t.sid}` : t.sid ? `#quiz/${t.sid}` : "#agenda/todo", btn: prog ? "Préparer" : t.sid ? "S'entraîner" : "Voir" });
  }
  const vus = new Set();
  for (const c of slots) {
    if (!c.sid || vus.has(c.sid)) continue; vus.add(c.sid);
    const ch = chapitreConseille(c.sid);
    out.push({ ico: "📘", txt: `${soir ? "Demain" : "Aujourd'hui"} à ${hh(c.d)} : <b>${esc(subjName(c.sid))}</b>.${ch ? ` À revoir : ${esc(ch.c.t)} (${ch.raison}).` : ""}`,
      href: ch ? `#fiche/${c.sid}~${ch.i}` : `#quiz/${c.sid}`, btn: ch ? "Réviser" : "QCM" });
  }
  return { soir, cible, slots, out };
}

function agendaCard() {
  const hasEdt = Object.values(S.edt || {}).some((l) => l.length), { soir, slots, out } = suggestions();
  if (!hasEdt && !(S.todo || []).length) return `<a class="card lib-card" href="#agenda"><b>🗓️ Mon emploi du temps</b><span class="small muted">Note tes cours et tes devoirs : chaque soir, l'appli te dit quoi réviser pour le lendemain.</span></a>`;
  if (!out.length && !slots.length) return "";
  return `<div class="card"><h2>${soir ? "🌙 Pour demain" : "🗓️ Aujourd'hui"}</h2>
    ${slots.length ? `<p class="small muted">${slots.map((c) => `${hh(c.d)} ${esc(slotName(c))}`).join(" · ")}</p>` : ""}
    ${out.slice(0, 4).map((s) => `<div class="row sugg"><span>${s.ico} ${s.txt}</span><a class="btn alt small" href="${s.href}">${s.btn}</a></div>`).join("")}
    <a class="small" href="#agenda">Mon emploi du temps et mes devoirs ›</a></div>`;
}

function matiereSelect(id, withOther = true) {
  const subs = subjectsOf(S.level).filter((s) => !/annales/.test(s.id));
  return `<select id="${id}">${subs.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}<option value="">Vie scolaire / sans matière</option>${withOther ? `<option value="autre">Autre (écrire le nom)…</option>` : ""}</select>`;
}

function viewAgenda(arg) {
  S.edt = S.edt || {}; S.todo = S.todo || [];
  const onglet = arg === "todo" ? "todo" : "edt";
  const head = `<h1>🗓️ Mon agenda</h1>
    <div class="row onglets"><a class="btn alt small${onglet === "edt" ? " on" : ""}" href="#agenda">Emploi du temps</a><a class="btn alt small${onglet === "todo" ? " on" : ""}" href="#agenda/todo">À rendre (${S.todo.filter((t) => !t.done).length})</a></div>
    ${agendaCard()}`;
  if (onglet === "todo") return viewTodo(head);
  const jour = agendaJour ?? new Date().getDay();
  const slots = slotsOf(jour);
  $view.innerHTML = `${head}
    <div class="row days">${ORDRE_JOURS.map((d) => `<button class="btn alt small day${d === jour ? " on" : ""}" data-d="${d}">${JOURS[d].slice(0, 3)}${(S.edt[d] || []).length ? " •" : ""}</button>`).join("")}</div>
    <div class="card"><h2>${JOURS[jour]}</h2>
      ${slots.length ? slots.map((c) => `<div class="row slot"><span><b>${hh(c.d)}${c.f ? " – " + hh(c.f) : ""}</b> ${esc(slotName(c))}</span><button class="btn alt small del" data-k="${(S.edt[jour] || []).indexOf(c)}">✕</button></div>`).join("") : `<p class="small muted">Aucun cours noté pour ce jour.</p>`}
    </div>
    <div class="card"><h2>Ajouter un cours le ${JOURS[jour].toLowerCase()}</h2>
      <label class="small">Matière</label>${matiereSelect("mat")}
      <input id="autre" placeholder="Nom du cours (ex. : EPS, arabe, informatique)" hidden maxlength="40">
      <div class="row"><label class="small" style="flex:1">Début<input type="time" id="hd" value="08:00"></label><label class="small" style="flex:1">Fin<input type="time" id="hf" value="10:00"></label></div>
      <button class="btn" id="add">Ajouter</button>
      <button class="btn alt small" id="copy">Copier ce jour sur un autre jour…</button>
    </div>`;
  const mat = document.getElementById("mat"), autre = document.getElementById("autre");
  mat.onchange = () => { autre.hidden = mat.value !== "autre"; };
  $view.querySelectorAll(".day").forEach((b) => b.onclick = () => { agendaJour = +b.dataset.d; viewAgenda(); });
  $view.querySelectorAll(".del").forEach((b) => b.onclick = () => { S.edt[jour].splice(+b.dataset.k, 1); store.save(); viewAgenda(); });
  document.getElementById("add").onclick = () => {
    const d = document.getElementById("hd").value, f = document.getElementById("hf").value;
    if (!d) return;
    const c = mat.value === "autre" ? { d, f, nom: autre.value.trim() || "Cours" } : mat.value ? { d, f, sid: mat.value } : { d, f, nom: "Vie scolaire" };
    S.edt[jour] = [...(S.edt[jour] || []), c]; store.save(); viewAgenda();
  };
  document.getElementById("copy").onclick = (e) => {
    e.target.outerHTML = `<div class="row days">${ORDRE_JOURS.filter((d) => d !== jour).map((d) => `<button class="btn alt small to" data-d="${d}">${JOURS[d].slice(0, 3)}</button>`).join("")}</div>`;
    $view.querySelectorAll(".to").forEach((b) => b.onclick = () => { S.edt[+b.dataset.d] = (S.edt[jour] || []).map((c) => ({ ...c })); store.save(); agendaJour = +b.dataset.d; viewAgenda(); });
  };
}
let agendaJour = null;

function viewTodo(head) {
  const list = S.todo.map((t, k) => ({ ...t, k })).sort((a, b) => a.date.localeCompare(b.date));
  const open = list.filter((t) => !t.done), done = list.filter((t) => t.done);
  const groupe = (titre, items) => items.length ? `<h2>${titre}</h2>${items.map(item).join("")}` : "";
  function item(t) {
    const n = daysUntil(t.date), prog = t.sid && (DATA.programmes || {})[t.sid];
    return `<div class="card todo${n < 0 && !t.done ? " late" : ""}"><div class="row"><label class="chk"><input type="checkbox" class="done" data-k="${t.k}"${t.done ? " checked" : ""}> <b>${esc(t.type)}</b>${t.sid || t.nom ? ` · ${esc(t.sid ? subjName(t.sid) : t.nom)}` : ""}</label><button class="btn alt small rm" data-k="${t.k}">✕</button></div>
      <p class="small muted">${new Date(t.date + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} · ${t.done ? "fait ✓" : quand(n)}</p>
      ${t.note ? `<p class="small">${esc(t.note)}</p>` : ""}
      ${!t.done && t.sid ? `<a class="btn alt small" href="${prog ? `#devoir/${t.sid}` : `#quiz/${t.sid}`}">${prog ? "🎯 Préparer ce devoir" : "✏️ S'entraîner"}</a>` : ""}</div>`;
  }
  $view.innerHTML = `${head}
    <div class="card"><h2>Noter un devoir ou un travail</h2>
      <label class="small">Type</label><select id="ty">${TYPES_TODO.map((t) => `<option>${t}</option>`).join("")}</select>
      <label class="small">Matière</label>${matiereSelect("mat")}
      <input id="autre" placeholder="Nom de la matière" hidden maxlength="40">
      <label class="small">Pour le</label><input type="date" id="dt" value="${isoDay(addDays(new Date(), 1))}">
      <input id="note" placeholder="Détail (ex. : exercices 3 et 4 page 52)" maxlength="120">
      <button class="btn" id="add">Ajouter</button></div>
    ${groupe("En retard", open.filter((t) => daysUntil(t.date) < 0))}
    ${groupe("Cette semaine", open.filter((t) => daysUntil(t.date) >= 0 && daysUntil(t.date) <= 7))}
    ${groupe("Plus tard", open.filter((t) => daysUntil(t.date) > 7))}
    ${open.length ? "" : `<p class="muted">Rien à rendre pour l'instant. Note ici tes devoirs, compositions et exercices : l'appli te les rappelle et te propose de les préparer.</p>`}
    ${done.length ? `<details><summary class="small">Déjà faits (${done.length})</summary>${done.slice(-20).map(item).join("")}</details>` : ""}`;
  const mat = document.getElementById("mat"), autre = document.getElementById("autre");
  mat.onchange = () => { autre.hidden = mat.value !== "autre"; };
  document.getElementById("add").onclick = () => {
    const date = document.getElementById("dt").value;
    if (!date) return;
    const t = { type: document.getElementById("ty").value, date, note: document.getElementById("note").value.trim(), done: false,
      ...(mat.value === "autre" ? { nom: autre.value.trim() } : mat.value ? { sid: mat.value } : {}) };
    S.todo = [...S.todo, t]; store.save(); viewAgenda("todo");
  };
  $view.querySelectorAll(".done").forEach((b) => b.onchange = () => { S.todo[+b.dataset.k].done = b.checked; store.save(); viewAgenda("todo"); });
  $view.querySelectorAll(".rm").forEach((b) => b.onclick = () => { S.todo.splice(+b.dataset.k, 1); store.save(); viewAgenda("todo"); });
}
