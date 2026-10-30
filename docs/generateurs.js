"use strict";
// Générateurs d'exercices : chaque appel fabrique une question nouvelle (nombres tirés au hasard),
// avec la bonne réponse calculée, trois distracteurs plausibles et l'explication pas à pas.
// Ils élargissent les QCM de maths, de physique-chimie et de gestion pour éviter les répétitions.
// Format : GEN[matière] = [[chapitre du programme, (r) => ({ q, ok, faux: [3 réponses], e })], ...]

const GEN = (() => {
  const nf = (x, d = 2) => Number(x.toFixed(d)).toLocaleString("fr-FR").replace("-", "−");
  const co = (a) => (a === 1 ? "" : a === -1 ? "−" : m(a));
  const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const nz = (r, a, b) => { let x = 0; while (!x) x = ri(r, a, b); return x; };
  const sg = (x) => (x < 0 ? `− ${-x}` : `+ ${x}`);
  const par = (x) => (x < 0 ? `(${String(x).replace("-", "−")})` : String(x));
  const m = (x) => String(x).replace("-", "−");
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [20, 21, 29]];
  const tri = (r) => { const k = ri(r, 1, 3); return pick(r, TRIPLES).map((x) => x * k); };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  return {
    "6e-maths": [
      ["Nombres décimaux et opérations", (r) => { const a = ri(r, 11, 99) / 10, b = ri(r, 101, 999) / 100, s = a + b;
        return { q: `Combien font ${nf(a, 1)} + ${nf(b)} ?`, ok: nf(s), faux: [nf(s + 1), nf(s - 0.1), nf(a + b * 10)], e: `On aligne les virgules : ${nf(a, 1)} + ${nf(b)} = ${nf(s)}.` }; }],
      ["Nombres décimaux et opérations", (r) => { const a = ri(r, 12, 98), b = ri(r, 3, 9), p = a * b;
        return { q: `Combien font ${a} × ${b} ?`, ok: String(p), faux: [String(p + b), String(p - 10), String(a * (b + 1))], e: `${a} × ${b} = ${p}.` }; }],
      ["Fractions", (r) => { const d = pick(r, [3, 4, 5, 6, 8, 10]), n = ri(r, 1, d - 1), k = ri(r, 2, 9), tot = d * k;
        return { q: `Combien font les ${n}/${d} de ${tot} ?`, ok: String(n * k), faux: [String(k), String(n * k + k), String(tot - n * k)], e: `${tot} ÷ ${d} = ${k}, puis ${k} × ${n} = ${n * k}.` }; }],
      ["Périmètres, aires et cercle", (r) => { const L = ri(r, 5, 20), l = ri(r, 2, L - 1);
        return { q: `Aire d'un rectangle de ${L} m sur ${l} m :`, ok: `${L * l} m²`, faux: [`${2 * (L + l)} m²`, `${L + l} m²`, `${L * l * 2} m²`], e: `Aire = longueur × largeur = ${L} × ${l} = ${L * l} m². (Le périmètre serait ${2 * (L + l)} m.)` }; }],
      ["Périmètres, aires et cercle", (r) => { const L = ri(r, 5, 25), l = ri(r, 2, L - 1);
        return { q: `Périmètre d'un rectangle de ${L} cm sur ${l} cm :`, ok: `${2 * (L + l)} cm`, faux: [`${L * l} cm`, `${L + l} cm`, `${4 * L} cm`], e: `Périmètre = 2 × (L + l) = 2 × (${L} + ${l}) = ${2 * (L + l)} cm.` }; }],
      ["Proportionnalité", (r) => { const n = ri(r, 2, 6), p = ri(r, 2, 9) * 50, k = ri(r, 2, 9); const tot = n * p, ans = k * p;
        return { q: `${n} cahiers coûtent ${tot} F. Combien coûtent ${k} cahiers ?`, ok: `${ans} F`, faux: [`${ans + p} F`, `${tot + k} F`, `${tot * k} F`], e: `Un cahier coûte ${tot} ÷ ${n} = ${p} F, donc ${k} cahiers coûtent ${k} × ${p} = ${ans} F.` }; }],
      ["Mesures de longueurs, masses et durées", (r) => { const h = ri(r, 1, 5) + pick(r, [0, 0.5, 0.25]);
        return { q: `Combien de minutes dans ${nf(h)} heure${h > 1 ? "s" : ""} ?`, ok: `${h * 60} min`, faux: [`${h * 100} min`, `${h * 60 + 30} min`, `${Math.round(h * 60 / 2)} min`], e: `1 h = 60 min, donc ${nf(h)} × 60 = ${h * 60} min.` }; }],
    ],
    "5e-maths": [
      ["Nombres relatifs", (r) => { const a = nz(r, -15, 15), b = nz(r, -15, 15), s = a + b;
        return { q: `Combien font ${par(a)} + ${par(b)} ?`, ok: m(s), faux: [m(-s || 1), m(a - b), m(Math.abs(a) + Math.abs(b))].map(String), e: `${Math.sign(a) === Math.sign(b) ? "Même signe : on additionne les distances à zéro et on garde le signe." : "Signes contraires : on soustrait les distances à zéro et on prend le signe du plus éloigné de zéro."} Résultat : ${m(s)}.` }; }],
      ["Nombres relatifs", (r) => { const a = nz(r, -9, 9), b = nz(r, -9, 9), p = a * b;
        return { q: `Combien font ${par(a)} × ${par(b)} ?`, ok: m(p), faux: [m(-p), m(a + b), m(Math.abs(a) + Math.abs(b) * 10)], e: `Règle des signes : ${(a < 0) === (b < 0) ? "deux signes identiques donnent un produit positif" : "deux signes différents donnent un produit négatif"}. ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(p)}, donc ${m(p)}.` }; }],
      ["Proportionnalité et pourcentages", (r) => { const t = pick(r, [10, 20, 25, 30, 40, 50, 75]), x = ri(r, 2, 40) * 100, v = x * t / 100;
        return { q: `Combien font ${t} % de ${x} F ?`, ok: `${v} F`, faux: [`${v * 2} F`, `${x - v} F`, `${t * 10} F`], e: `${t} % de ${x} = ${x} × ${t} / 100 = ${v} F.` }; }],
      ["Angles et triangles", (r) => { const a = ri(r, 25, 85), b = ri(r, 20, 150 - a), c = 180 - a - b;
        return { q: `Un triangle a deux angles de ${a}° et ${b}°. Le troisième mesure :`, ok: `${c}°`, faux: [`${c + 10}°`, `${a + b}°`, `${360 - a - b}°`], e: `La somme des angles d'un triangle vaut 180° : 180 − ${a} − ${b} = ${c}°.` }; }],
      ["Statistiques", (r) => { const n = ri(r, 3, 4); let v = Array.from({ length: n }, () => ri(r, 5, 18)); const s = v.reduce((x, y) => x + y, 0); v[n - 1] += (n - (s % n)) % n; const t = v.reduce((x, y) => x + y, 0), moy = t / n;
        return { q: `Moyenne des notes ${v.join(" ; ")} :`, ok: nf(moy), faux: [nf(moy + 1), nf(t), nf(moy - 2)], e: `Somme = ${t}, divisée par ${n} notes : ${t} / ${n} = ${nf(moy)}.` }; }],
    ],
    "4e-maths": [
      ["Puissances et écriture scientifique", (r) => { const a = pick(r, [2, 3, 5, 10]), p = ri(r, 2, 6), q = ri(r, 2, 6);
        return { q: `${a}^${p} × ${a}^${q} =`.replace(/\^(\d)/g, (_, d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]), ok: `${a}${String(p + q).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("")}`, faux: [`${a}${String(p * q).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("")}`, `${a * a}${String(p + q).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("")}`, `${a}${String(Math.abs(p - q) + 1).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("")}`], e: `Même base : on additionne les exposants, ${p} + ${q} = ${p + q}.` }; }],
      ["Équations", (r) => { const x = nz(r, -9, 9), a = ri(r, 2, 7), c = ri(r, 1, a - 1) , b = nz(r, -12, 12), d = (a - c) * x + b;
        return { q: `Résous ${a}x ${sg(b)} = ${co(c)}x ${sg(d)}.`, ok: `x = ${m(x)}`, faux: [`x = ${m(-x)}`, `x = ${m(x + 1)}`, `x = ${m(d - b)}`], e: `${a}x − ${co(c)}x = ${m(d)} − ${par(b)}, soit ${co(a - c)}x = ${m(d - b)}, donc x = ${m(x)}.` }; }],
      ["Pythagore et cosinus", (r) => { const [a, b, c] = tri(r);
        return { q: `Un triangle est rectangle ; les côtés de l'angle droit mesurent ${a} cm et ${b} cm. L'hypoténuse mesure :`, ok: `${c} cm`, faux: [`${a + b} cm`, `${c + 1} cm`, `${Math.abs(b - a) + c} cm`], e: `Pythagore : ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, donc l'hypoténuse vaut √${c * c} = ${c} cm.` }; }],
      ["Proportionnalité, vitesse et pourcentages", (r) => { const v = pick(r, [40, 50, 60, 80, 90, 100, 120]), t = pick(r, [0.5, 1.5, 2, 2.5, 3]);
        return { q: `À ${v} km/h, quelle distance parcourt-on en ${nf(t)} h ?`, ok: `${nf(v * t)} km`, faux: [`${nf(v / t)} km`, `${nf(v + t)} km`, `${nf(v * t + v / 2)} km`], e: `d = v × t = ${v} × ${nf(t)} = ${nf(v * t)} km.` }; }],
    ],
    "3e-maths": [
      ["Théorème de Thalès", (r) => { const k = pick(r, [2, 3, 4, 5]), am = ri(r, 1, 6), ab = am * k, ac = ri(r, 2, 8) * k, an = ac / k;
        return { q: `(MN) // (BC) avec M sur [AB] et N sur [AC]. AM = ${am} cm, AB = ${ab} cm, AC = ${ac} cm. Calcule AN.`, ok: `${an} cm`, faux: [`${ac * k} cm`, `${an + am} cm`, `${ab} cm`], e: `Thalès : AM/AB = AN/AC, donc AN = AC × AM / AB = ${ac} × ${am} / ${ab} = ${an} cm.` }; }],
      ["Pythagore et trigonométrie", (r) => { const [a, b, c] = tri(r);
        return { q: `ABC est rectangle en A, BC = ${c} cm et AB = ${a} cm. Calcule AC.`, ok: `${b} cm`, faux: [`${c - a} cm`, `${b + 2} cm`, `√${c * c + a * a} cm`], e: `AC² = BC² − AB² = ${c * c} − ${a * a} = ${b * b}, donc AC = ${b} cm.` }; }],
      ["Pythagore et trigonométrie", (r) => { const [a, b, c] = tri(r);
        return { q: `ABC est rectangle en A avec AB = ${a}, AC = ${b} et BC = ${c}. cos(ABC) vaut :`, ok: `${a}/${c}`, faux: [`${b}/${c}`, `${a}/${b}`, `${c}/${a}`], e: `cos B = côté adjacent / hypoténuse = AB / BC = ${a}/${c}.` }; }],
      ["Calcul littéral et identités remarquables", (r) => { const a = nz(r, -9, 9);
        return { q: `Développe (x ${sg(a)})².`, ok: `x² ${sg(2 * a)}x + ${a * a}`, faux: [`x² + ${a * a}`, `x² ${sg(a)}x + ${a * a}`, `x² ${sg(-2 * a)}x + ${a * a}`], e: `(x ${sg(a)})² = x² + 2 × x × ${par(a)} + ${par(a)}² = x² ${sg(2 * a)}x + ${a * a}.` }; }],
      ["Équations, inéquations et systèmes", (r) => { const x = ri(r, 1, 12), y = ri(r, 1, 12);
        return { q: `Résous le système x + y = ${x + y} et x − y = ${m(x - y)}.`, ok: `x = ${x} et y = ${y}`, faux: [`x = ${y} et y = ${x}`, `x = ${x + 1} et y = ${y - 1}`, `x = ${x + y} et y = 0`], e: `En additionnant : 2x = ${2 * x}, donc x = ${x} ; puis y = ${x + y} − ${x} = ${y}.` }; }],
      ["Applications affines et repérage", (r) => { const a = nz(r, -5, 5), b = nz(r, -9, 9), x1 = ri(r, -3, 2), x2 = x1 + ri(r, 1, 4);
        return { q: `f est affine avec f(${m(x1)}) = ${m(a * x1 + b)} et f(${x2}) = ${m(a * x2 + b)}. Le coefficient a vaut :`, ok: m(a), faux: [m(-a), m(a + 1), m(b)], e: `a = (f(${x2}) − f(${m(x1)})) / (${x2} − ${par(x1)}) = ${m(a * (x2 - x1))} / ${x2 - x1} = ${m(a)}.` }; }],
      ["Arithmétique : PGCD", (r) => { const g = pick(r, [2, 3, 4, 5, 6, 7, 8, 9, 12, 15]); let p = ri(r, 2, 9), q = ri(r, 2, 9); while (gcd(p, q) !== 1 || p === q) q = ri(r, 2, 9);
        return { q: `PGCD de ${g * p} et ${g * q} :`, ok: String(g), faux: [String(g * p * q), String(g * 2 === g * p ? g * 3 : g * 2), String(Math.max(1, g - 1))].filter((v, i, t) => t.indexOf(v) === i && v !== String(g)).concat(["1", "2", "3"]).filter((v) => v !== String(g)).slice(0, 3), e: `${g * p} = ${g} × ${p} et ${g * q} = ${g} × ${q}, avec ${p} et ${q} premiers entre eux : le PGCD est ${g}.` }; }],
      ["Géométrie dans l'espace : pyramide, cône, cylindre", (r) => { const R = ri(r, 1, 6), h = ri(r, 2, 12);
        return { q: `Volume exact d'un cylindre de rayon ${R} cm et de hauteur ${h} cm :`, ok: `${R * R * h}π cm³`, faux: [`${2 * R * h}π cm³`, `${R * R * h * 2}π cm³`, `${R * h}π cm³`], e: `V = π × r² × h = π × ${R * R} × ${h} = ${R * R * h}π cm³.` }; }],
    ],
    "2nde-maths": [
      ["Vecteurs et repérage", (r) => { const xa = ri(r, -6, 6), ya = ri(r, -6, 6), xb = ri(r, -6, 6), yb = ri(r, -6, 6);
        return { q: `A(${m(xa)} ; ${m(ya)}) et B(${m(xb)} ; ${m(yb)}). Coordonnées du vecteur AB :`, ok: `(${m(xb - xa)} ; ${m(yb - ya)})`, faux: [`(${m(xa - xb)} ; ${m(ya - yb)})`, `(${m(xb + xa)} ; ${m(yb + ya)})`, `(${m(yb - ya)} ; ${m(xb - xa)})`], e: `AB (xB − xA ; yB − yA) = (${m(xb)} − ${par(xa)} ; ${m(yb)} − ${par(ya)}).` }; }],
      ["Vecteurs et repérage", (r) => { const xa = 2 * ri(r, -4, 4), ya = 2 * ri(r, -4, 4), xb = 2 * ri(r, -4, 4), yb = 2 * ri(r, -4, 4);
        return { q: `Milieu de [AB] avec A(${m(xa)} ; ${m(ya)}) et B(${m(xb)} ; ${m(yb)}) :`, ok: `(${m((xa + xb) / 2)} ; ${m((ya + yb) / 2)})`, faux: [`(${m(xa + xb)} ; ${m(ya + yb)})`, `(${m((xb - xa) / 2)} ; ${m((yb - ya) / 2)})`, `(${m((ya + yb) / 2)} ; ${m((xa + xb) / 2)})`], e: `On fait la moyenne des abscisses et des ordonnées : ((${m(xa)} + ${m(xb)})/2 ; (${m(ya)} + ${m(yb)})/2).` }; }],
      ["Pourcentages et statistiques", (r) => { const t = pick(r, [10, 20, 25, 50]), x = ri(r, 2, 30) * 1000, v = x * (1 + t / 100);
        return { q: `Un prix de ${x} F augmente de ${t} %. Nouveau prix :`, ok: `${v} F`, faux: [`${x + t} F`, `${x * t / 100} F`, `${x * (1 - t / 100)} F`], e: `On multiplie par le coefficient 1 + ${t}/100 = ${nf(1 + t / 100)} : ${x} × ${nf(1 + t / 100)} = ${v} F.` }; }],
      ["Calcul littéral, équations et inéquations", (r) => { const a = ri(r, 2, 6), b = nz(r, -10, 10), c = ri(r, -10, 10), s = (c - b) / a;
        return { q: `Résous ${a}x ${sg(b)} < ${m(c)}.`, ok: `x < ${nf(s)}`, faux: [`x > ${nf(s)}`, `x < ${nf((c + b) / a)}`, `x < ${nf(c - b)}`], e: `${a}x < ${m(c)} − ${par(b)} = ${m(c - b)}, puis on divise par ${a} (positif, le sens ne change pas) : x < ${nf(s)}.` }; }],
    ],
    "1ere-maths": [
      ["Le second degré", (r) => { const x1 = ri(r, -6, 6), x2 = ri(r, -6, 6), S = x1 + x2, P = x1 * x2, D = S * S - 4 * P;
        return { q: `Discriminant de x² ${sg(-S)}x ${sg(P)} :`.replace("+ 0x ", "").replace(" + 0 :", " :").replace(/([+−]) 1x/, "$1 x"), ok: String(D), faux: [m(S * S + 4 * P), m(D + 4), m(-D || 1)], e: `Δ = b² − 4ac = ${par(-S)}² − 4 × 1 × ${par(P)} = ${S * S} ${sg(-4 * P)} = ${D}.` }; }],
      ["Le second degré", (r) => { let x1 = ri(r, -6, 6), x2 = ri(r, -6, 6); if (x1 === x2) x2 = x1 + 2; const S = x1 + x2, P = x1 * x2;
        return { q: `Racines de x² ${sg(-S)}x ${sg(P)} :`.replace("+ 0x ", "").replace(" + 0 :", " :").replace(/([+−]) 1x/, "$1 x"), ok: `${m(Math.min(x1, x2))} et ${m(Math.max(x1, x2))}`, faux: [`${m(-Math.max(x1, x2))} et ${m(-Math.min(x1, x2))}`, `${m(S)} et ${m(P)}`, `${m(Math.min(x1, x2) - 1)} et ${m(Math.max(x1, x2) + 1)}`], e: `Δ = ${(x1 - x2) ** 2}, √Δ = ${Math.abs(x1 - x2)} ; x = (${m(S)} ± ${Math.abs(x1 - x2)}) / 2, soit ${m(x1)} et ${m(x2)}. Vérification : somme ${m(S)}, produit ${m(P)}.` }; }],
      ["Dérivation", (r) => { const a = nz(r, -5, 5), b = ri(r, -9, 9), c = ri(r, -9, 9), x0 = ri(r, -3, 3), d = 2 * a * x0 + b;
        return { q: `f(x) = ${co(a)}x² ${sg(b)}x ${sg(c)}. Calcule f'(${m(x0)}).`.replace(/([+−]) 1x/, "$1 x").replace(" + 0x", "").replace(" + 0.", "."), ok: m(d), faux: [m(a * x0 * x0 + b * x0 + c), m(2 * a + b), m(d + 2 * a)], e: `f'(x) = ${m(2 * a)}x ${sg(b)}, donc f'(${m(x0)}) = ${m(2 * a)} × ${par(x0)} ${sg(b)} = ${m(d)}.` }; }],
      ["Suites arithmétiques et géométriques", (r) => { const u0 = ri(r, -10, 10), q = nz(r, -6, 6), n = ri(r, 5, 20);
        return { q: `(uₙ) est arithmétique de premier terme u₀ = ${m(u0)} et de raison ${m(q)}. Calcule u${String(n).split("").map((d) => "₀₁₂₃₄₅₆₇₈₉"[d]).join("")}.`, ok: m(u0 + n * q), faux: [m(u0 + (n - 1) * q), m(u0 * q ** 1 + n), m(u0 + n + q)], e: `uₙ = u₀ + n × r = ${m(u0)} + ${n} × ${par(q)} = ${m(u0 + n * q)}.` }; }],
    ],
    "tle-maths": [
      ["Suites numériques", (r) => { const u0 = ri(r, 1, 5), q = pick(r, [2, 3]), n = ri(r, 3, 6);
        return { q: `(uₙ) est géométrique, u₀ = ${u0} et q = ${q}. Calcule u${"₀₁₂₃₄₅₆₇₈₉"[n]}.`, ok: String(u0 * q ** n), faux: [String(u0 * q ** (n - 1)), String(u0 + n * q), String((u0 * q) ** n)], e: `uₙ = u₀ × qⁿ = ${u0} × ${q}^${n} = ${u0 * q ** n}.` }; }],
      ["Nombres complexes : forme algébrique et équations", (r) => { const [a, b, c] = tri(r), sa = pick(r, [1, -1]), sb = pick(r, [1, -1]);
        return { q: `Module de z = ${m(sa * a)} ${sb > 0 ? "+" : "−"} ${b}i :`, ok: String(c), faux: [String(a + b), String(c * c), `√${a + b}`], e: `|z| = √(a² + b²) = √(${a * a} + ${b * b}) = √${c * c} = ${c}.` }; }],
      ["Probabilités et variables aléatoires", (r) => { const n = ri(r, 2, 4), p = pick(r, [0.1, 0.2, 0.3, 0.4, 0.5]), q0 = (1 - p) ** n;
        return { q: `X suit la loi binomiale B(${n} ; ${nf(p, 1)}). Calcule P(X ≥ 1).`, ok: nf(1 - q0, 4), faux: [nf(q0, 4), nf(n * p, 2), nf(1 - p ** n, 4)], e: `P(X ≥ 1) = 1 − P(X = 0) = 1 − ${nf(1 - p, 1)}^${n} = 1 − ${nf(q0, 4)} = ${nf(1 - q0, 4)}.` }; }],
      ["Calcul intégral et aires", (r) => { const a = ri(r, 1, 6), b = ri(r, 0, 6), t = ri(r, 1, 4), I = a * t * t / 2 + b * t;
        return { q: `Calcule ∫₀^${t} (${a}x + ${b}) dx.`.replace("^", "").replace(/∫₀(\d)/, (_, d) => `∫₀${"⁰¹²³⁴⁵⁶⁷⁸⁹"[d]}`), ok: nf(I), faux: [nf(a * t + b), nf(a * t * t + b * t), nf(I + b)], e: `Une primitive est ${nf(a / 2)}x² + ${b}x ; on calcule ${nf(a / 2)} × ${t * t} + ${b} × ${t} − 0 = ${nf(I)}.` }; }],
      ["Fonction exponentielle et fonctions puissances", (r) => { const k = pick(r, [2, 3, 5, 7, 10]), a = ri(r, 2, 4);
        return { q: `Résous e^(${a}x) = ${k}.`, ok: a === 1 ? `x = ln ${k}` : `x = (ln ${k}) / ${a}`, faux: [`x = ${k}/${a}`, `x = e^${k}`, `x = ${a} ln ${k}`], e: `On passe au logarithme : ${a}x = ln ${k}${a === 1 ? "" : `, donc x = (ln ${k}) / ${a}`}.` }; }],
    ],
    "3e-pc": [
      ["Électricité : loi d'Ohm, résistances", (r) => { const R = pick(r, [10, 20, 47, 50, 100, 220]), I = pick(r, [0.05, 0.1, 0.2, 0.5]);
        return { q: `Un conducteur ohmique de ${R} Ω est parcouru par ${nf(I)} A. Tension à ses bornes :`, ok: `${nf(R * I)} V`, faux: [`${nf(R / I)} V`, `${nf(R + I)} V`, `${nf(I / R, 4)} V`], e: `Loi d'Ohm : U = R × I = ${R} × ${nf(I)} = ${nf(R * I)} V.` }; }],
      ["Électricité : loi d'Ohm, résistances", (r) => { const a = pick(r, [10, 20, 30, 40, 60]), b = pick(r, [10, 20, 30, 60]);
        return { q: `Deux résistances de ${a} Ω et ${b} Ω montées en série équivalent à :`, ok: `${a + b} Ω`, faux: [`${nf(a * b / (a + b))} Ω`, `${a * b} Ω`, `${Math.abs(a - b) || a / 2} Ω`], e: `En série, les résistances s'additionnent : ${a} + ${b} = ${a + b} Ω.` }; }],
      ["Puissance et énergie électriques", (r) => { const P = pick(r, [60, 100, 500, 1000, 1500, 2000]), t = pick(r, [0.5, 1, 2, 3, 4]);
        return { q: `Un appareil de ${P} W fonctionne ${nf(t)} h. Énergie consommée :`, ok: `${nf(P * t / 1000, 3)} kWh`, faux: [`${nf(P * t, 0)} kWh`, `${nf(P / t / 1000, 3)} kWh`, `${nf(P * t / 100, 3)} kWh`], e: `E = P × t = ${P} W × ${nf(t)} h = ${nf(P * t, 0)} Wh = ${nf(P * t / 1000, 3)} kWh.` }; }],
      ["Mécanique : poids, masse, vitesse", (r) => { const mm = pick(r, [0.5, 1.2, 2, 2.5, 4, 15, 50]);
        return { q: `Poids d'un objet de ${nf(mm)} kg sur Terre (g = 10 N/kg) :`, ok: `${nf(mm * 10)} N`, faux: [`${nf(mm)} N`, `${nf(mm / 10)} N`, `${nf(mm * 100)} N`], e: `P = m × g = ${nf(mm)} × 10 = ${nf(mm * 10)} N.` }; }],
      ["Masse volumique et changements d'état", (r) => { const V = pick(r, [50, 100, 200, 250, 500]), rho = pick(r, [0.8, 1, 1.2, 2.7, 7.8]);
        return { q: `Un corps de volume ${V} cm³ a une masse de ${nf(V * rho, 1)} g. Sa masse volumique :`, ok: `${nf(rho, 1)} g/cm³`, faux: [`${nf(V / (V * rho), 2)} g/cm³`, `${nf(V * rho * V, 0)} g/cm³`, `${nf(rho * 10, 1)} g/cm³`], e: `ρ = m / V = ${nf(V * rho, 1)} / ${V} = ${nf(rho, 1)} g/cm³.` }; }],
      ["Optique : les lentilles", (r) => { const f = pick(r, [0.05, 0.1, 0.2, 0.25, 0.5]);
        return { q: `Vergence d'une lentille de distance focale ${nf(f * 100, 0)} cm :`, ok: `${nf(1 / f, 0)} δ`, faux: [`${nf(f * 100, 0)} δ`, `${nf(1 / (f * 100), 2)} δ`, `${nf(f, 2)} δ`], e: `On convertit f en mètres : ${nf(f)} m ; C = 1 / f = ${nf(1 / f, 0)} δ.` }; }],
    ],
    "4e-pc": [
      ["Le circuit électrique", (r) => { const a = ri(r, 1, 9) / 10, b = ri(r, 1, 9) / 10;
        return { q: `Deux lampes en dérivation sont parcourues par ${nf(a, 1)} A et ${nf(b, 1)} A. Intensité dans la branche principale :`, ok: `${nf(a + b, 1)} A`, faux: [`${nf(Math.abs(a - b), 1)} A`, `${nf(a * b, 2)} A`, `${nf(Math.max(a, b), 1)} A`], e: `Loi des nœuds : I = ${nf(a, 1)} + ${nf(b, 1)} = ${nf(a + b, 1)} A.` }; }],
      ["Mesures : masse, volume, masse volumique", (r) => { const L = pick(r, [0.5, 1.5, 2, 2.5, 5]);
        return { q: `Masse de ${nf(L)} L d'eau :`, ok: `${nf(L)} kg`, faux: [`${nf(L * 10)} kg`, `${nf(L / 10)} kg`, `${nf(L * 100)} g`], e: `1 L d'eau a une masse de 1 kg (ρ = 1 kg/L), donc ${nf(L)} L ont une masse de ${nf(L)} kg.` }; }],
    ],
    "2nde-pc": [
      ["La mole et la concentration", (r) => { const sp = pick(r, [["H₂O", 18], ["CO₂", 44], ["NaCl", 58.5], ["C₆H₁₂O₆", 180], ["O₂", 32]]), n = pick(r, [0.1, 0.2, 0.5, 1, 2]);
        return { q: `Quantité de matière dans ${nf(n * sp[1], 2)} g de ${sp[0]} (M = ${nf(sp[1], 1)} g/mol) :`, ok: `${nf(n)} mol`, faux: [`${nf(n * sp[1] * sp[1], 0)} mol`, `${nf(n * 10)} mol`, `${nf(sp[1] / (n * sp[1]), 2)} mol`], e: `n = m / M = ${nf(n * sp[1], 2)} / ${nf(sp[1], 1)} = ${nf(n)} mol.` }; }],
      ["La mole et la concentration", (r) => { const n = pick(r, [0.01, 0.05, 0.1, 0.2]), V = pick(r, [0.1, 0.25, 0.5, 2]);
        return { q: `On dissout ${nf(n)} mol de soluté dans ${nf(V)} L de solution. Concentration molaire :`, ok: `${nf(n / V, 3)} mol/L`, faux: [`${nf(n * V, 3)} mol/L`, `${nf(V / n, 2)} mol/L`, `${nf(n, 3)} mol/L`], e: `C = n / V = ${nf(n)} / ${nf(V)} = ${nf(n / V, 3)} mol/L.` }; }],
    ],
    "1ere-pc": [
      ["Travail, énergie et puissance", (r) => { const mm = pick(r, [0.5, 1, 2, 5]), h = pick(r, [2, 5, 10, 20]);
        return { q: `Travail du poids d'un objet de ${nf(mm)} kg qui descend de ${h} m (g = 10 N/kg) :`, ok: `${nf(mm * 10 * h)} J`, faux: [`−${nf(mm * 10 * h)} J`, `${nf(mm * h)} J`, `${nf(mm * 10 / h)} J`], e: `Le corps descend, le travail est moteur : W = m g h = ${nf(mm)} × 10 × ${h} = ${nf(mm * 10 * h)} J.` }; }],
      ["Travail, énergie et puissance", (r) => { const mm = pick(r, [0.2, 1, 2, 4, 1000]), v = pick(r, [2, 4, 5, 10, 20]);
        return { q: `Énergie cinétique d'un corps de ${nf(mm)} kg à ${v} m/s :`, ok: `${nf(mm * v * v / 2)} J`, faux: [`${nf(mm * v)} J`, `${nf(mm * v * v)} J`, `${nf(mm * v / 2)} J`], e: `Ec = ½ m v² = 0,5 × ${nf(mm)} × ${v * v} = ${nf(mm * v * v / 2)} J.` }; }],
    ],
    "tle-pc": [
      ["P2. Bases de la dynamique et énergie", (r) => { const mm = pick(r, [0.5, 1, 2, 4, 5]), F = pick(r, [2, 4, 6, 10, 20]);
        return { q: `Une force résultante de ${F} N agit sur un solide de ${nf(mm)} kg. Accélération :`, ok: `${nf(F / mm)} m/s²`, faux: [`${nf(F * mm)} m/s²`, `${nf(mm / F)} m/s²`, `${nf(F / mm + 10)} m/s²`], e: `Deuxième loi de Newton : a = F / m = ${F} / ${nf(mm)} = ${nf(F / mm)} m/s².` }; }],
      ["P8. Dipôle RC", (r) => { const R = pick(r, [100, 470, 1000, 2000, 10000]), C = pick(r, [1, 2, 10, 47, 100]);
        return { q: `Constante de temps d'un circuit RC avec R = ${R} Ω et C = ${C} µF :`, ok: `${nf(R * C / 1000, 3)} ms`, faux: [`${nf(R / C, 1)} ms`, `${nf(R * C, 0)} ms`, `${nf(R * C / 1e6, 4)} ms`], e: `τ = R C = ${R} × ${C} × 10⁻⁶ = ${nf(R * C / 1e6, 5)} s = ${nf(R * C / 1000, 3)} ms.` }; }],
      ["C6. Acides forts et bases fortes", (r) => { const k = ri(r, 1, 4);
        return { q: `pH d'une solution d'acide chlorhydrique (acide fort) de concentration 10⁻${"⁰¹²³⁴⁵⁶⁷⁸⁹"[k]} mol/L :`, ok: String(k), faux: [String(14 - k), String(-k).replace("-", "−"), String(k + 1)], e: `Acide fort : [H₃O⁺] = C = 10⁻${"⁰¹²³⁴⁵⁶⁷⁸⁹"[k]} mol/L, donc pH = −log C = ${k}.` }; }],
      ["P15. Réactions nucléaires", (r) => { const n = ri(r, 1, 4), t = pick(r, [5, 8, 30, 1600]);
        return { q: `Un radio-isotope a une demi-vie de ${t} ans. Fraction des noyaux restants après ${n * t} ans :`, ok: `1/${2 ** n}`, faux: [`1/${2 * n}`, `1/${2 ** (n + 1)}`, `${n}/${2 ** n}`], e: `${n * t} ans = ${n} demi-vie${n > 1 ? "s" : ""} ; il reste (1/2)^${n} = 1/${2 ** n} des noyaux.` }; }],
    ],
    "g-compta": [
      ["Les amortissements", (r) => { const V = ri(r, 2, 20) * 500000, n = pick(r, [4, 5, 8, 10]);
        return { q: `Un matériel de ${V.toLocaleString("fr-FR")} F est amorti en linéaire sur ${n} ans. Annuité :`, ok: `${(V / n).toLocaleString("fr-FR")} F`, faux: [`${(V / (n * 2)).toLocaleString("fr-FR")} F`, `${(V * n / 10).toLocaleString("fr-FR")} F`, `${(V / 10).toLocaleString("fr-FR")} F`].filter((x) => x !== `${(V / n).toLocaleString("fr-FR")} F`).concat([`${(V / n + 100000).toLocaleString("fr-FR")} F`]).slice(0, 3), e: `Annuité = valeur d'origine / durée = ${V.toLocaleString("fr-FR")} / ${n} = ${(V / n).toLocaleString("fr-FR")} F.` }; }],
      ["Le bilan", (r) => { const a = ri(r, 10, 60) * 100000, d = ri(r, 1, 9) * 100000;
        return { q: `Total de l'actif : ${a.toLocaleString("fr-FR")} F ; total des dettes : ${d.toLocaleString("fr-FR")} F. Capitaux propres :`, ok: `${(a - d).toLocaleString("fr-FR")} F`, faux: [`${(a + d).toLocaleString("fr-FR")} F`, `${d.toLocaleString("fr-FR")} F`, `${a.toLocaleString("fr-FR")} F`], e: `Capitaux propres = actif − dettes = ${(a - d).toLocaleString("fr-FR")} F.` }; }],
    ],
    "g-eco": [
      ["Le marché, les prix et l'inflation", (r) => { const x = ri(r, 10, 40) * 500, t = pick(r, [4, 5, 8, 10, 20, 25]), y = x * (1 + t / 100);
        return { q: `Un prix passe de ${x.toLocaleString("fr-FR")} F à ${y.toLocaleString("fr-FR")} F. Taux de variation :`, ok: `+${t} %`, faux: [`+${nf(100 * (y - x) / y, 1)} %`, `+${(y - x).toLocaleString("fr-FR")} %`, `−${t} %`], e: `(${y.toLocaleString("fr-FR")} − ${x.toLocaleString("fr-FR")}) / ${x.toLocaleString("fr-FR")} × 100 = ${t} %.` }; }],
    ],
  };
})();

// Fabrique n questions générées pour une matière (chapitres choisis facultatifs), au format des questions de l'appli
function genQuestions(sid, n, chapters = null) {
  const list = (GEN[sid] || []).filter(([ch]) => !chapters || chapters.includes(ch));
  if (!list.length) return [];
  const out = [], seen = new Set();
  for (let tries = 0; out.length < n && tries < n * 6; tries++) {
    const [ch, f] = list[Math.floor(Math.random() * list.length)];
    let g; try { g = f(Math.random); } catch (e) { continue; }
    const choices = [g.ok, ...g.faux.filter((x) => x !== g.ok)];
    if (choices.length < 4 || new Set(choices).size < 4 || seen.has(g.q)) continue;
    seen.add(g.q);
    const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    out.push({ id: `gen-${sid}-${out.length}-${Date.now()}`, s: sid, q: g.q, c: order.map((i) => choices[i]), a: order.indexOf(0), e: g.e, gen: true, chTitle: ch, free: false });
  }
  return out;
}
