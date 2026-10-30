"use strict";
// Générateurs supplémentaires (Terminale) : chaque appel fabrique une question nouvelle, avec la réponse calculée,
// trois distracteurs plausibles et l'explication. Ils s'ajoutent à GEN (generateurs.js), chapitre par chapitre.

(() => {
  const nf = (x, d = 2) => Number(x.toFixed(d)).toLocaleString("fr-FR", { maximumFractionDigits: d }).replace("-", "−");
  const sci = (x) => { const e = Math.floor(Math.log10(Math.abs(x))), c = x / 10 ** e; return `${nf(c, 2)} × 10${sup(e)}`; };
  const mono = (c, v) => (c === 1 ? v : c === -1 ? `−${v}` : `${m(c)}${v}`);
  const lin = (a, b) => `y = ${a ? mono(a, "x") + (b ? " " + sg(b) : "") : m(b)}`;
  const xp = (n) => (n === 0 ? "" : n === 1 ? "x" : `x${sup(n)}`);
  const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const nz = (r, a, b) => { let x = 0; while (!x) x = ri(r, a, b); return x; };
  const m = (x) => String(x).replace("-", "−");
  const sg = (x) => (x < 0 ? `− ${-x}` : `+ ${x}`);
  const par = (x) => (x < 0 ? `(${m(x)})` : String(x));
  const co = (a) => (a === 1 ? "" : a === -1 ? "−" : m(a));
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const fr = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; p /= g; q /= g; return q === 1 ? m(p) : `${m(p)}/${q}`; };
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const C = (n, p) => fact(n) / (fact(p) * fact(n - p));
  const A = (n, p) => fact(n) / fact(n - p);
  const sup = (n) => String(n).split("").map((d) => (d === "-" ? "⁻" : "⁰¹²³⁴⁵⁶⁷⁸⁹"[d])).join("");
  const sub = (n) => String(n).split("").map((d) => "₀₁₂₃₄₅₆₇₈₉"[d]).join("");
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];

  const PLUS = {
    "tle-maths": [
      ["Limites de fonctions", (r) => { const a = nz(r, -9, 9), c = nz(r, 1, 9), b = ri(r, -9, 9), d = ri(r, -9, 9);
        return { q: `lim quand x → +∞ de (${co(a)}x² ${sg(b)}) / (${co(c)}x² ${sg(d)}) :`, ok: fr(a, c), faux: [fr(b || 1, d || 2), a > 0 ? "+∞" : "−∞", "0"], e: `En +∞, un quotient de polynômes a la limite du quotient des termes de plus haut degré : ${co(a)}x² / ${co(c)}x² = ${fr(a, c)}.` }; }],
      ["Limites de fonctions", (r) => { const a = nz(r, 1, 9), b = ri(r, 1, 9), c = nz(r, 1, 9);
        return { q: `lim quand x → +∞ de (${co(a)}x² ${sg(b)}) / (${co(c)}x ${sg(b)}) :`, ok: "+∞", faux: [fr(a, c), "0", "−∞"], e: `Le numérateur est de degré 2 et le dénominateur de degré 1 : le quotient se comporte comme ${fr(a, c)}x, qui tend vers +∞.` }; }],
      ["Limites de fonctions", (r) => { const k = pick(r, [2, 3, 4, 5]);
        return { q: `lim quand x → 0 de (e^(${k}x) − 1) / x :`, ok: String(k), faux: ["1", "0", `1/${k}`], e: `(e^(${k}x) − 1)/x = ${k} × (e^X − 1)/X avec X = ${k}x → 0, et (e^X − 1)/X → 1. La limite vaut ${k}.` }; }],
      ["Continuité et théorème des valeurs intermédiaires", (r) => { const p = ri(r, 1, 5), n = ri(r, 1, 3), q = -(n ** 3 + p * n + ri(r, 1, 3 * n * n + p));
        const f = (x) => x ** 3 + p * x + q; let k = n; while (f(k + 1) < 0) k++;
        return { q: `f(x) = x³ + ${p}x ${sg(q)} est continue et strictement croissante sur ℝ. L'unique solution α de f(x) = 0 vérifie :`, ok: `${k} < α < ${k + 1}`, faux: [`${k - 1} < α < ${k}`, `${k + 1} < α < ${k + 2}`, `${k + 2} < α < ${k + 3}`], e: `f(${k}) = ${m(f(k))} < 0 et f(${k + 1}) = ${m(f(k + 1))} > 0 : d'après le théorème des valeurs intermédiaires (bijection), α est entre ${k} et ${k + 1}.` }; }],
      ["Dérivabilité et calcul de dérivées", (r) => { const a = nz(r, -5, 5), b = ri(r, -6, 6);
        return { q: `f(x) = (${co(a)}x ${sg(b)}) eˣ. f′(x) =`, ok: `(${co(a)}x ${sg(a + b)}) eˣ`, faux: [`${m(a)} eˣ`, `(${co(a)}x ${sg(b)}) eˣ`, `(${co(a)}x ${sg(b - a)}) eˣ`], e: `(uv)′ = u′v + uv′ avec u = ${co(a)}x ${sg(b)}, u′ = ${m(a)}, v = v′ = eˣ : f′(x) = (${m(a)} + ${co(a)}x ${sg(b)}) eˣ.` }; }],
      ["Dérivabilité et calcul de dérivées", (r) => { const a = ri(r, 2, 7), b = ri(r, 1, 9);
        return { q: `f(x) = ln(${a}x + ${b}) sur son ensemble de définition. f′(x) =`, ok: `${a}/(${a}x + ${b})`, faux: [`1/(${a}x + ${b})`, `${a} ln(${a}x + ${b})`, `${a}x/(${a}x + ${b})`], e: `(ln u)′ = u′/u avec u = ${a}x + ${b} et u′ = ${a}.` }; }],
      ["Dérivabilité et calcul de dérivées", (r) => { const a = nz(r, -4, 4), b = nz(r, -6, 6), x0 = nz(r, -3, 3), d = 3 * a * x0 * x0 + b;
        return { q: `f(x) = ${co(a)}x³ ${sg(b)}x. Calcule f′(${m(x0)}).`, ok: m(d), faux: [m(a * x0 ** 3 + b * x0), m(3 * a * x0 + b), m(a * x0 * x0 + b)], e: `f′(x) = ${m(3 * a)}x² ${sg(b)}, donc f′(${m(x0)}) = ${m(3 * a)} × ${par(x0 * x0)} ${sg(b)} = ${m(d)}.` }; }],
      ["Étude complète d'une fonction", (r) => { const b = ri(r, -6, 6), c = ri(r, -6, 6), x0 = ri(r, -3, 3), s = 2 * x0 + b, y0 = x0 * x0 + b * x0 + c, p = y0 - s * x0;
        return { q: `Équation de la tangente à la courbe de f(x) = x² ${sg(b)}x ${sg(c)} au point d'abscisse ${m(x0)} :`, ok: lin(s, p), faux: [lin(s + 1, p), lin(s, p + 1), lin(-s, p)], e: `f′(x) = 2x ${sg(b)}, f′(${m(x0)}) = ${m(s)} et f(${m(x0)}) = ${m(y0)}. y = f′(a)(x − a) + f(a) = ${m(s)}(x − ${par(x0)}) + ${par(y0)}.` }; }],
      ["Fonction logarithme népérien", (r) => { const k = nz(r, -3, 4);
        return { q: `Résous ln x = ${m(k)}.`, ok: `x = e${sup(k)}`, faux: [`x = ${m(k)}`, `x = e${sup(-k)}`, `x = ln ${m(k)}`], e: `ln est une bijection de ]0 ; +∞[ sur ℝ : ln x = ${m(k)} ⟺ x = e${sup(k)}.` }; }],
      ["Fonction logarithme népérien", (r) => { const a = ri(r, 2, 6), b = ri(r, 2, 7), c = pick(r, [2, a]), v = a * b / c; if (a === c && b === c) return null;
        return { q: `Simplifie ln ${a} + ln ${b} − ln ${c}.`, ok: `ln ${nf(v)}`, faux: [`ln ${nf(a * b * c)}`, `ln ${nf(a * b + c)}`, `ln ${nf(a + b + c)}`], e: `ln a + ln b = ln(ab) et ln a − ln c = ln(a/c) : ln(${a} × ${b} / ${c}) = ln ${nf(v)}.` }; }],
      ["Fonction logarithme népérien", (r) => { const a = ri(r, -5, 5);
        return { q: `Résous ln(x ${sg(-a)}) = 0.`, ok: `x = ${m(a + 1)}`, faux: [`x = ${m(a)}`, `x = ${m(a - 1)}`, `x = e`], e: `ln u = 0 ⟺ u = 1 : x ${sg(-a)} = 1, x = ${m(a + 1)} (et x ${sg(-a)} > 0 est bien vérifié).` }; }],
      ["Fonction exponentielle et fonctions puissances", (r) => { const a = nz(r, -5, 5), b = nz(r, -5, 5);
        return { q: `e${sup(a)} × e${sup(b)} =`, ok: `e${sup(a + b)}`, faux: [`e${sup(a * b)}`, `e${sup(a - b)}`, `e${sup(a + b + 1)}`], e: `eᵃ × eᵇ = e^(a + b) : e^(${m(a)} + ${par(b)}) = e${sup(a + b)}.` }; }],
      ["Fonction exponentielle et fonctions puissances", (r) => { const a = nz(r, -4, 4), b = ri(r, 1, 6);
        return { q: `La dérivée de f(x) = e^(${m(a)}x ${sg(b)}) est :`, ok: `${m(a)} e^(${m(a)}x ${sg(b)})`, faux: [`e^(${m(a)}x ${sg(b)})`, `(${m(a)}x ${sg(b)}) e^(${m(a)}x ${sg(b) /**/})`, `${m(a)}x e^(${m(a)}x ${sg(b)})`], e: `(eᵘ)′ = u′ eᵘ avec u = ${m(a)}x ${sg(b)}, u′ = ${m(a)}.` }; }],
      ["Suites numériques", (r) => { const u0 = ri(r, -5, 10), q = nz(r, -5, 6), n = ri(r, 5, 15), un = u0 + (n - 1) * q, S = n * (u0 + un) / 2;
        return { q: `(uₙ) est arithmétique, u₀ = ${m(u0)}, raison ${m(q)}. Somme u₀ + u₁ + … + u${sub(n - 1)} :`, ok: m(S), faux: [m(S + q), m(n * u0), m((n - 1) * (u0 + un) / 2)], e: `${n} termes : S = nombre de termes × (premier + dernier)/2 = ${n} × (${m(u0)} + ${m(un)})/2 = ${m(S)}.` }; }],
      ["Suites numériques", (r) => { const u0 = ri(r, 1, 5), q = pick(r, [2, 3]), n = ri(r, 3, 6), S = u0 * (q ** n - 1) / (q - 1);
        return { q: `(vₙ) est géométrique, v₀ = ${u0}, raison ${q}. Somme v₀ + … + v${sub(n - 1)} :`, ok: String(S), faux: [String(u0 * q ** n), String(S + u0 * q ** n), String(n * u0 * q)], e: `S = v₀ (1 − qⁿ)/(1 − q) = ${u0} × (${q}${sup(n)} − 1)/(${q} − 1) = ${S}.` }; }],
      ["Suites numériques", (r) => { const q = pick(r, [["1/2", "0"], ["3", "+∞"], ["−1/3", "0"], ["0,9", "0"], ["1,05", "+∞"]]);
        return { q: `Limite de (${q[0]})ⁿ quand n → +∞ :`, ok: q[1], faux: [q[1] === "0" ? "+∞" : "0", "1", "n'existe pas"], e: `Si −1 < q < 1, qⁿ → 0 ; si q > 1, qⁿ → +∞.` }; }],
      ["Primitives", (r) => { const a = nz(r, 1, 9), n = ri(r, 1, 5);
        return { q: `Une primitive de ${co(a)}${xp(n)} sur ℝ :`, ok: `${fr(a, n + 1) === "1" ? "" : fr(a, n + 1)}${xp(n + 1)}`, faux: [`${co(a * n)}${xp(n - 1) || ""}${n === 1 ? "" : ""}`, `${co(a)}${xp(n + 1)}`, `${co(a * (n + 1))}${xp(n + 1)}`], e: `Une primitive de xⁿ est xⁿ⁺¹/(n + 1) : ${m(a)} × x${sup(n + 1)}/${n + 1}.` }; }],
      ["Primitives", (r) => { const a = nz(r, 1, 9), k = pick(r, [-3, -2, 2, 3, 4, 5]);
        return { q: `Une primitive de ${co(a)}e^(${m(k)}x) :`, ok: `${fr(a, k) === "1" ? "" : fr(a, k) === "−1" ? "−" : fr(a, k)}e^(${m(k)}x)`, faux: [`${co(a * k)}e^(${m(k)}x)`, `${co(a)}e^(${m(k)}x)`, `${co(a)}x e^(${m(k)}x)`], e: `Une primitive de e^(kx) est (1/k) e^(kx) : ${m(a)}/${par(k)} = ${fr(a, k)}.` }; }],
      ["Calcul intégral et aires", (r) => { const t = ri(r, 1, 3);
        return { q: `∫ de 0 à ${t} de eˣ dx =`, ok: `e${sup(t)} − 1`, faux: [`e${sup(t)}`, `e${sup(t - 1)}`, `${t}e${sup(t)}`], e: `Une primitive de eˣ est eˣ : e${sup(t)} − e⁰ = e${sup(t)} − 1.` }; }],
      ["Calcul intégral et aires", (r) => { const a = ri(r, 1, 6), t = ri(r, 1, 3), I = a * t ** 3;
        return { q: `∫ de 0 à ${t} de ${3 * a}x² dx =`, ok: String(I), faux: [String(I * 3), String(I + a), String(2 * I)], e: `Une primitive de ${3 * a}x² est ${co(a)}x³ : ${a} × ${t}³ − 0 = ${I}.` }; }],
      ["Calcul intégral et aires", (r) => { const k = ri(r, 2, 5);
        return { q: `∫ de 1 à e${k === 1 ? "" : sup(k)} de (1/x) dx =`, ok: String(k), faux: ["1", `e${sup(k)}`, `1/${k}`], e: `Une primitive de 1/x sur ]0 ; +∞[ est ln x : ln(e${sup(k)}) − ln 1 = ${k}.` }; }],
      ["Équations différentielles", (r) => { const a = pick(r, [-3, -2, 2, 3, 4]), k = pick(r, [-3, 2, 3, 4, 5]);
        return { q: `La solution de y′ = ${co(a)}y telle que y(0) = ${m(k)} est :`, ok: `y = ${co(k)}e^(${m(a)}x)`, faux: [`y = ${co(a)}e^(${m(k)}x)`, `y = ${co(k)}e^(${m(-a)}x)`, `y = ${m(k)} + e^(${m(a)}x)`], e: `Les solutions de y′ = ay sont y = C e^(ax) ; y(0) = C = ${m(k)}.` }; }],
      ["Équations différentielles", (r) => { const w = ri(r, 2, 6);
        return { q: `Les solutions de y″ + ${w * w}y = 0 sont de la forme :`, ok: `A cos(${w}x) + B sin(${w}x)`, faux: [`A e^(${w}x) + B e^(−${w}x)`, `A cos(${w * w}x) + B sin(${w * w}x)`, `(Ax + B) e^(${w}x)`], e: `y″ + ω²y = 0 avec ω² = ${w * w}, donc ω = ${w}.` }; }],
      ["Équations différentielles", (r) => { const a = pick(r, [-4, -3, -2, 2, 3, 4]), b = a * pick(r, [-5, -3, 2, 4, 5]);
        return { q: `Une solution constante de y′ = ${co(a)}y ${sg(b)} est :`, ok: `y = ${m(-b / a)}`, faux: [`y = ${m(b / a)}`, `y = ${m(b)}`, `y = ${m(-b)}`], e: `y constante ⟹ y′ = 0 : 0 = ${m(a)}y ${sg(b)}, d'où y = ${m(-b / a)}.` }; }],
      ["Nombres complexes : forme algébrique et équations", (r) => { const a = nz(r, -5, 5), b = nz(r, -5, 5), c = nz(r, -5, 5), d = nz(r, -5, 5), re = a * c - b * d, im = a * d + b * c;
        return { q: `(${m(a)} ${sg(b)}i)(${m(c)} ${sg(d)}i) =`, ok: `${m(re)} ${sg(im)}i`, faux: [`${m(a * c + b * d)} ${sg(im)}i`, `${m(a * c)} ${sg(b * d)}i`, `${m(re)} ${sg(-im)}i`], e: `On développe avec i² = −1 : ${m(a * c)} ${sg(a * d)}i ${sg(b * c)}i ${sg(-b * d)} = ${m(re)} ${sg(im)}i.` }; }],
      ["Nombres complexes : forme algébrique et équations", (r) => { const a = nz(r, -4, 4), b = ri(r, 2, 5), S = 2 * a, P = a * a + b * b;
        return { q: `Les solutions de z² ${sg(-S)}z + ${P} = 0 sont :`.replace("+ 0z ", ""), ok: `${m(a)} ± ${b}i`, faux: [`${m(-a)} ± ${b}i`, `${m(a)} ± ${b * b}i`, `${m(a + b)} et ${m(a - b)}`], e: `Δ = ${S * S} − ${4 * P} = ${m(S * S - 4 * P)} = (${2 * b}i)² ; z = (${m(S)} ± ${2 * b}i)/2.` }; }],
      ["Nombres complexes : forme trigonométrique, exponentielle et géométrie", (r) => { const t = pick(r, [["1 + i", "π/4", "√2"], ["1 − i", "−π/4", "√2"], ["−1 + i", "3π/4", "√2"], ["√3 + i", "π/6", "2"], ["1 + i√3", "π/3", "2"], ["−√3 + i", "5π/6", "2"], ["2i", "π/2", "2"], ["−3", "π", "3"]]);
        const others = ["π/4", "−π/4", "3π/4", "π/6", "π/3", "5π/6", "π/2", "π", "2π/3", "−π/3"].filter((x) => x !== t[1]).sort(() => r() - 0.5);
        return { q: `Un argument de z = ${t[0]} est :`, ok: t[1], faux: others.slice(0, 3), e: `|z| = ${t[2]} ; on cherche θ tel que cos θ = Re(z)/|z| et sin θ = Im(z)/|z| : θ = ${t[1]}.` }; }],
      ["Nombres complexes : forme trigonométrique, exponentielle et géométrie", (r) => { const k = pick(r, [3, 4, 6]), n = ri(r, 2, 12), ang = ((n % (2 * k)) + 2 * k) % (2 * k);
        const lab = (j) => (j === 0 ? "1" : j === k ? "−1" : `e^(i${fr(j, k) === "1" ? "" : fr(j, k)}π)`);
        return { q: `(e^(iπ/${k}))${sup(n)} =`, ok: lab(ang), faux: [lab((ang + 1) % (2 * k)), lab((ang + k) % (2 * k)), `e^(i${n}π)`].filter((x) => x !== lab(ang)), e: `(e^(iθ))ⁿ = e^(inθ) : e^(i${n}π/${k}), et on retire les multiples de 2π.` }; }],
      ["Transformations du plan : similitudes", (r) => { const t = pick(r, [["2i", "2", "π/2"], ["1 + i", "√2", "π/4"], ["−3", "3", "π"], ["√3 + i", "2", "π/6"], ["1 − i", "√2", "−π/4"], ["3i", "3", "π/2"]]), b = ri(r, -4, 4);
        return { q: `La similitude z′ = (${t[0]})z ${sg(b)} a pour rapport et angle :`, ok: `${t[1]} et ${t[2]}`, faux: [`${t[2]} et ${t[1]}`, `${t[1]} et 0`, `1 et ${t[2]}`], e: `z′ = az + b : rapport |a| = ${t[1]}, angle arg(a) = ${t[2]}.` }; }],
      ["Dénombrement", (r) => { const n = ri(r, 5, 12), p = ri(r, 2, Math.min(4, n - 1));
        return { q: `C${sub(n)}${sup(p)} (nombre de façons de choisir ${p} éléments parmi ${n}) :`, ok: String(C(n, p)), faux: [String(A(n, p)), String(n * p), String(C(n, p) + n)], e: `C(n, p) = n!/(p!(n − p)!) = ${C(n, p)}.` }; }],
      ["Dénombrement", (r) => { const n = ri(r, 5, 10), p = ri(r, 2, 4);
        return { q: `Nombre de classements des ${p} premiers parmi ${n} coureurs :`, ok: String(A(n, p)), faux: [String(C(n, p)), String(n ** p), String(fact(p))], e: `L'ordre compte, sans répétition : arrangements A = ${n}!/${n - p}! = ${A(n, p)}.` }; }],
      ["Probabilités et variables aléatoires", (r) => { const n = ri(r, 5, 50), p = pick(r, [0.1, 0.2, 0.25, 0.4, 0.5]);
        return { q: `X suit la loi binomiale B(${n} ; ${nf(p)}). Espérance E(X) :`, ok: nf(n * p), faux: [nf(n * p * (1 - p)), nf(p), nf(n * (1 - p))], e: `E(X) = n p = ${n} × ${nf(p)} = ${nf(n * p)}. (La variance serait n p (1 − p) = ${nf(n * p * (1 - p))}.)` }; }],
      ["Probabilités et variables aléatoires", (r) => { const pa = pick(r, [0.2, 0.3, 0.4, 0.5, 0.6]), pb = pick(r, [0.1, 0.25, 0.5]);
        return { q: `A et B sont indépendants, P(A) = ${nf(pa)} et P(B) = ${nf(pb)}. P(A ∩ B) =`, ok: nf(pa * pb, 3), faux: [nf(pa + pb, 3), nf(pa + pb - pa * pb, 3), nf(pa / pb, 3)], e: `Indépendance : P(A ∩ B) = P(A) × P(B).` }; }],
      ["Probabilités et variables aléatoires", (r) => { const pa = pick(r, [0.3, 0.4, 0.5, 0.6]), pba = pick(r, [0.2, 0.5, 0.7]), pbn = pick(r, [0.1, 0.3, 0.4]), p = pa * pba + (1 - pa) * pbn;
        return { q: `P(A) = ${nf(pa)}, P_A(B) = ${nf(pba)}, P_Ā(B) = ${nf(pbn)}. Calcule P(B).`, ok: nf(p, 3), faux: [nf(pa * pba, 3), nf(pba + pbn, 3), nf(pba * pbn, 3)], e: `Probabilités totales : P(B) = P(A) P_A(B) + P(Ā) P_Ā(B) = ${nf(pa)} × ${nf(pba)} + ${nf(1 - pa)} × ${nf(pbn)} = ${nf(p, 3)}.` }; }],
      ["Statistiques à deux variables", (r) => { const xs = [1, 2, 3, 4], ys = xs.map(() => ri(r, 2, 20)), xb = 2.5, yb = ys.reduce((a, b) => a + b) / 4;
        return { q: `Série : x = 1, 2, 3, 4 et y = ${ys.join(", ")}. Le point moyen G a pour coordonnées :`, ok: `(2,5 ; ${nf(yb)})`, faux: [`(${nf(yb)} ; 2,5)`, `(10 ; ${ys.reduce((a, b) => a + b)})`, `(2 ; ${nf(yb)})`], e: `x̄ = (1 + 2 + 3 + 4)/4 = 2,5 et ȳ = ${ys.reduce((a, b) => a + b)}/4 = ${nf(yb)}. La droite d'ajustement passe par G.` }; }],
      ["Arithmétique (séries S1 et S3)", (r) => { const n = pick(r, [5, 7, 9, 11]), a = ri(r, 20, 400);
        return { q: `Reste de la division euclidienne de ${a} par ${n} :`, ok: String(a % n), faux: [1, 2, 3].map((d) => String((a + d) % n)), e: `${a} = ${n} × ${Math.floor(a / n)} + ${a % n}, avec 0 ≤ ${a % n} < ${n}.` }; }],
      ["Arithmétique (séries S1 et S3)", (r) => { const k = ri(r, 4, 40), rr = [1, 2, 4][k % 3];
        return { q: `Reste de 2${sup(k)} dans la division par 7 :`, ok: String(rr), faux: ["3", "5", "6"], e: `2³ = 8 ≡ 1 [7], donc les restes de 2ⁿ se répètent tous les 3 : 1, 2, 4. ${k} = 3 × ${Math.floor(k / 3)} + ${k % 3}, donc 2${sup(k)} ≡ 2${sup(k % 3)} ≡ ${rr} [7].` }; }],
      ["Géométrie dans l'espace", (r) => { const [a, b, c] = pick(r, [[1, 2, 2], [2, 3, 6], [1, 4, 8], [2, 6, 9], [4, 4, 7]]), A0 = [ri(r, -3, 3), ri(r, -3, 3), ri(r, -3, 3)], s = [pick(r, [1, -1]), pick(r, [1, -1]), pick(r, [1, -1])], d = Math.sqrt(a * a + b * b + c * c);
        const B = [A0[0] + s[0] * a, A0[1] + s[1] * b, A0[2] + s[2] * c];
        return { q: `A(${A0.map(m).join(" ; ")}) et B(${B.map(m).join(" ; ")}). Distance AB :`, ok: String(d), faux: [String(a + b + c), String(d * d), String(d + 1)], e: `AB = √(${a}² + ${b}² + ${c}²) = √${d * d} = ${d}.` }; }],
      ["Géométrie dans l'espace", (r) => { const u = [nz(r, -4, 4), nz(r, -4, 4), nz(r, -4, 4)], v = [nz(r, -4, 4), nz(r, -4, 4), nz(r, -4, 4)], s = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
        return { q: `u⃗(${u.map(m).join(" ; ")}) · v⃗(${v.map(m).join(" ; ")}) =`, ok: m(s), faux: [m(s + 2), m(u[0] * v[0]), m(-s || 3)], e: `u⃗ · v⃗ = xx′ + yy′ + zz′ = ${u.map((x, i) => `${par(x)} × ${par(v[i])}`).join(" + ")} = ${m(s)}.${s === 0 ? " Les vecteurs sont orthogonaux." : ""}` }; }],
      ["Coniques (série S1)", (r) => { const [b, c, a] = pick(r, TRIPLES);
        return { q: `Ellipse x²/${a * a} + y²/${b * b} = 1. Distance du centre à chaque foyer :`, ok: String(c), faux: [String(a - b), String(a + b), String(Math.round(Math.sqrt(a * a + b * b) * 100) / 100).replace(".", ",")], e: `c² = a² − b² = ${a * a} − ${b * b} = ${c * c}, donc c = ${c}. L'excentricité vaut e = c/a = ${fr(c, a)}.` }; }],
    ],
    "tle-pc": [
      ["P1. Cinématique du point", (r) => { const v0 = ri(r, 0, 10), a = ri(r, 1, 5), t = ri(r, 2, 8);
        return { q: `Mouvement rectiligne uniformément varié : v₀ = ${v0} m/s, a = ${a} m/s². Vitesse à t = ${t} s :`, ok: `${v0 + a * t} m/s`, faux: [`${a * t} m/s`, `${v0 + a * t * t / 2} m/s`, `${v0 * t} m/s`], e: `v = a t + v₀ = ${a} × ${t} + ${v0}.` }; }],
      ["P1. Cinématique du point", (r) => { const v0 = ri(r, 0, 10), a = 2 * ri(r, 1, 3), t = ri(r, 2, 6), x = a * t * t / 2 + v0 * t;
        return { q: `x(t) = ½ a t² + v₀ t avec a = ${a} m/s² et v₀ = ${v0} m/s. Distance parcourue en ${t} s :`, ok: `${x} m`, faux: [`${a * t * t + v0 * t} m`, `${a * t + v0} m`, `${x + v0} m`], e: `x = ½ × ${a} × ${t}² + ${v0} × ${t} = ${a * t * t / 2} + ${v0 * t} = ${x} m.` }; }],
      ["P1. Cinématique du point", (r) => { const v = pick(r, [2, 4, 5, 10, 20]), R = pick(r, [0.5, 1, 2, 4, 5]);
        return { q: `Mouvement circulaire uniforme : v = ${v} m/s sur un cercle de rayon ${nf(R)} m. Accélération :`, ok: `${nf(v * v / R)} m/s²`, faux: [`${nf(v / R)} m/s²`, `${nf(v * R)} m/s²`, "0 m/s²"], e: `L'accélération est centripète : a = v²/R = ${v * v}/${nf(R)}. Elle existe car la direction de la vitesse change.` }; }],
      ["P2. Bases de la dynamique et énergie", (r) => { const al = pick(r, [[30, 0.5], [45, 0.71], [60, 0.87], [20, 0.34]]);
        return { q: `Un solide glisse sans frottement sur un plan incliné de ${al[0]}° (g = 10 m/s², sin ${al[0]}° ≈ ${nf(al[1])}). Son accélération :`, ok: `${nf(10 * al[1], 1)} m/s²`, faux: ["10 m/s²", `${nf(10 * Math.sqrt(1 - al[1] * al[1]), 1)} m/s²`, `${nf(5 * al[1], 1)} m/s²`], e: `Seule la composante du poids parallèle au plan accélère : a = g sin α = 10 × ${nf(al[1])}.` }; }],
      ["P2. Bases de la dynamique et énergie", (r) => { const mm = pick(r, [0.5, 1, 2, 5]), h = pick(r, [5, 10, 20, 45]), v = Math.sqrt(2 * 10 * h);
        return { q: `Un objet tombe en chute libre d'une hauteur de ${h} m sans vitesse initiale (g = 10 m/s²). Vitesse à l'arrivée :`, ok: `${nf(v, 1)} m/s`, faux: [`${nf(2 * 10 * h, 0)} m/s`, `${nf(10 * h / 2, 1)} m/s`, `${nf(Math.sqrt(10 * h), 1)} m/s`], e: `Théorème de l'énergie cinétique : ½ m v² = m g h, donc v = √(2gh) = √${2 * 10 * h}. La masse (${nf(mm)} kg) n'intervient pas.` }; }],
      ["P3. Mouvements dans les champs de pesanteur et électrique uniformes", (r) => { const h = pick(r, [0.8, 1.25, 1.8, 3.2, 5]), v0 = ri(r, 2, 15), t = Math.sqrt(2 * h / 10);
        return { q: `Lancé horizontalement à ${v0} m/s d'une hauteur de ${nf(h)} m (g = 10 m/s²), le projectile touche le sol à la distance :`, ok: `${nf(v0 * t)} m`, faux: [`${nf(v0 * h)} m`, `${nf(v0 * t * t)} m`, `${nf(v0 / t)} m`], e: `Durée de chute t = √(2h/g) = ${nf(t, 2)} s ; mouvement horizontal uniforme : x = v₀ t = ${nf(v0 * t)} m.` }; }],
      ["P3. Mouvements dans les champs de pesanteur et électrique uniformes", (r) => { const U = pick(r, [100, 200, 500, 1000]), d = pick(r, [0.01, 0.02, 0.05, 0.1]);
        return { q: `Deux plaques parallèles distantes de ${nf(d * 100, 0)} cm sont soumises à ${U} V. Champ électrique entre les plaques :`, ok: `${nf(U / d, 0)} V/m`, faux: [`${nf(U * d, 2)} V/m`, `${nf(U / d * 10, 0)} V/m`, `${nf(U / d / 10, 0)} V/m`], e: `E = U/d avec d en mètres : ${U}/${nf(d)} = ${nf(U / d, 0)} V/m.` }; }],
      ["P4. Gravitation universelle et satellites", (r) => { const h = pick(r, [[6400, 4], [12800, 9], [3200, 2.25]]);
        return { q: `À quelle valeur est divisé g quand on monte à ${h[0]} km d'altitude (rayon terrestre 6 400 km) ?`, ok: `par ${nf(h[1])}`, faux: [`par ${nf(Math.sqrt(h[1]))}`, `par ${nf(h[1] * 2)}`, "il ne change pas"], e: `g = g₀ R²/(R + h)² : rapport ((R + h)/R)² = (${nf((6400 + h[0]) / 6400)})² = ${nf(h[1])}.` }; }],
      ["P4. Gravitation universelle et satellites", (r) => { const k = pick(r, [4, 9, 16]);
        return { q: `Si le rayon de l'orbite d'un satellite est multiplié par ${k}, sa vitesse est :`, ok: `divisée par ${Math.sqrt(k)}`, faux: [`divisée par ${k}`, `multipliée par ${Math.sqrt(k)}`, "inchangée"], e: `v = √(GM/r) : si r est multiplié par ${k}, v est divisée par √${k} = ${Math.sqrt(k)}.` }; }],
      ["P5. Particule chargée dans un champ magnétique", (r) => { const v = pick(r, [1, 2, 5]) * 1e5, B = pick(r, [0.01, 0.02, 0.05, 0.1]), mm = 1.67e-27, q = 1.6e-19, R = mm * v / (q * B);
        return { q: `Un proton (m = 1,67 × 10⁻²⁷ kg, q = 1,6 × 10⁻¹⁹ C) entre à ${nf(v / 1e5, 0)} × 10⁵ m/s perpendiculairement à B = ${nf(B)} T. Rayon de sa trajectoire :`, ok: `${nf(R * 100, 1)} cm`, faux: [`${nf(R * 1000, 1)} cm`, `${nf(R * 10, 2)} cm`, `${nf(q * B / (mm * v) , 1)} cm`], e: `R = m v / (|q| B) = 1,67 × 10⁻²⁷ × ${nf(v, 0)} / (1,6 × 10⁻¹⁹ × ${nf(B)}) ≈ ${nf(R, 4)} m.` }; }],
      ["P6. Loi de Laplace", (r) => { const I = pick(r, [1, 2, 5, 10]), L = pick(r, [0.05, 0.1, 0.2]), B = pick(r, [0.1, 0.2, 0.5]);
        return { q: `Une tige de ${nf(L * 100, 0)} cm parcourue par ${I} A est perpendiculaire à un champ de ${nf(B)} T. Force de Laplace :`, ok: `${nf(I * L * B, 3)} N`, faux: [`${nf(I * L * 100 * B, 1)} N`, `${nf(I * B, 2)} N`, `${nf(I * L / B, 3)} N`], e: `F = I L B sin 90° = ${I} × ${nf(L)} × ${nf(B)} (L en mètres).` }; }],
      ["P7. Induction et auto-induction", (r) => { const L = pick(r, [0.01, 0.05, 0.1, 0.5]), I = pick(r, [0.1, 0.2, 0.5, 1, 2]);
        return { q: `Énergie magnétique stockée dans une bobine L = ${nf(L)} H parcourue par ${nf(I)} A :`, ok: `${nf(L * I * I / 2, 4)} J`, faux: [`${nf(L * I * I, 4)} J`, `${nf(L * I * I / 4, 4)} J`, `${nf(L * I * I * 10, 4)} J`], e: `E = ½ L I² = 0,5 × ${nf(L)} × ${nf(I)}².` }; }],
      ["P7. Induction et auto-induction", (r) => { const L = pick(r, [0.02, 0.1, 0.5]), di = pick(r, [0.1, 0.5, 1, 2]), dt = pick(r, [0.01, 0.02, 0.1]);
        return { q: `Dans une bobine L = ${nf(L)} H, l'intensité varie de ${nf(di)} A en ${nf(dt)} s. Valeur de la f.é.m. d'auto-induction :`, ok: `${nf(L * di / dt, 2)} V`, faux: [`${nf(L * di * dt, 4)} V`, `${nf(di / dt, 1)} V`, `${nf(L / (di * dt), 1)} V`], e: `|e| = L |di/dt| = ${nf(L)} × ${nf(di)}/${nf(dt)}.` }; }],
      ["P8. Dipôle RC", (r) => { const C = pick(r, [1, 2.2, 4.7, 10, 100]), U = pick(r, [5, 6, 9, 12]);
        return { q: `Condensateur de ${nf(C, 1)} µF chargé sous ${U} V. Charge Q :`, ok: `${nf(C * U, 1)} µC`, faux: [`${nf(C / U, 2)} µC`, `${nf(C * U * U / 2, 1)} µC`, `${nf(U / C, 2)} µC`], e: `Q = C U = ${nf(C, 1)} × 10⁻⁶ × ${U} C.` }; }],
      ["P8. Dipôle RC", (r) => { const E = pick(r, [5, 10, 12, 20]), n = pick(r, [[1, 0.63], [3, 0.95], [5, 0.99]]);
        return { q: `Charge d'un condensateur sous E = ${E} V : valeur de u_C à t = ${n[0]}τ :`, ok: `≈ ${nf(E * n[1], 2)} V`, faux: [`${E} V`, `≈ ${nf(E * (1 - n[1]), 2)} V`, `${nf(E / 2, 2)} V`], e: `u_C = E(1 − e^(−t/τ)) ; à t = ${n[0]}τ, 1 − e⁻${sup(n[0]).replace("⁻", "")} ≈ ${nf(n[1])}.` }; }],
      ["P9. Oscillations électriques libres", (r) => { const L = pick(r, [0.01, 0.1, 0.4, 1]), C = pick(r, [1, 10, 100]) * 1e-6, T = 2 * Math.PI * Math.sqrt(L * C);
        return { q: `Période propre d'un circuit LC avec L = ${nf(L)} H et C = ${nf(C * 1e6, 0)} µF :`, ok: `${nf(T * 1000, 2)} ms`, faux: [`${nf(Math.sqrt(L * C) * 1000, 2)} ms`, `${nf(2 * Math.PI * L * C * 1000, 4)} ms`, `${nf(T * 1000 * 2, 2)} ms`], e: `T₀ = 2π √(LC) = 2π √(${nf(L)} × ${nf(C * 1e6, 0)} × 10⁻⁶) ≈ ${nf(T, 5)} s.` }; }],
      ["P10. Oscillations électriques forcées (RLC)", (r) => { const R = pick(r, [10, 20, 50, 100]), U = pick(r, [5, 10, 12, 20]);
        return { q: `Circuit RLC série (R = ${R} Ω) à la résonance d'intensité, alimenté sous ${U} V efficaces. Intensité efficace :`, ok: `${nf(U / R, 3)} A`, faux: [`${nf(U * R, 0)} A`, "0 A", `${nf(U / (2 * R), 3)} A`], e: `À la résonance, Lω = 1/(Cω) : l'impédance se réduit à R, donc I = U/R.` }; }],
      ["P11. Oscillateurs mécaniques", (r) => { const mm = pick(r, [0.1, 0.2, 0.4, 0.5]), k = pick(r, [10, 20, 40, 50]), T = 2 * Math.PI * Math.sqrt(mm / k);
        return { q: `Pendule élastique : m = ${nf(mm)} kg, k = ${k} N/m. Période propre :`, ok: `${nf(T, 2)} s`, faux: [`${nf(2 * Math.PI * Math.sqrt(k / mm), 1)} s`, `${nf(Math.sqrt(mm / k), 3)} s`, `${nf(2 * Math.PI * mm / k, 3)} s`], e: `T₀ = 2π √(m/k) = 2π √(${nf(mm)}/${k}).` }; }],
      ["P11. Oscillateurs mécaniques", (r) => { const l = pick(r, [0.25, 0.4, 1, 1.6, 2.5]), T = 2 * Math.PI * Math.sqrt(l / 9.8);
        return { q: `Pendule simple de longueur ${nf(l)} m (g = 9,8 m/s²). Période des petites oscillations :`, ok: `${nf(T, 2)} s`, faux: [`${nf(2 * Math.PI * Math.sqrt(9.8 / l), 1)} s`, `${nf(Math.sqrt(l / 9.8), 2)} s`, `${nf(2 * Math.PI * l / 9.8, 2)} s`], e: `T₀ = 2π √(ℓ/g), indépendante de la masse.` }; }],
      ["P12. Interférences lumineuses", (r) => { const lam = pick(r, [450, 500, 550, 600, 650]), D = pick(r, [1, 1.5, 2]), a = pick(r, [0.5, 1, 2]);
        return { q: `Fentes de Young : λ = ${lam} nm, D = ${nf(D)} m, a = ${nf(a)} mm. Interfrange :`, ok: `${nf(lam * D / a / 1000, 3)} mm`, faux: [`${nf(lam * D / a / 100, 3)} mm`, `${nf(lam * D / a / 1000 * 2, 3)} mm`, `${nf(lam * D / a, 0)} mm`], e: `i = λ D / a = ${lam} × 10⁻⁹ × ${nf(D)} / (${nf(a)} × 10⁻³) m.` }; }],
      ["P13. Effet photoélectrique", (r) => { const lam = pick(r, [300, 400, 500, 600]), E = 1240 / lam;
        return { q: `Énergie d'un photon de longueur d'onde ${lam} nm (hc ≈ 1 240 eV·nm) :`, ok: `${nf(E, 2)} eV`, faux: [`${nf(lam / 1240, 2)} eV`, `${nf(E * 10, 1)} eV`, `${nf(1240 * lam / 1e5, 2)} eV`], e: `E = hc/λ = 1 240/${lam} eV.` }; }],
      ["P13. Effet photoélectrique", (r) => { const E = pick(r, [3, 3.5, 4, 5]), W = pick(r, [1.9, 2.2, 2.5, 2.8]);
        return { q: `Des photons de ${nf(E)} eV éclairent un métal de travail d'extraction ${nf(W)} eV. Énergie cinétique maximale des électrons :`, ok: `${nf(E - W)} eV`, faux: [`${nf(E + W)} eV`, `${nf(E)} eV`, `${nf(E / W)} eV`], e: `Einstein : Ec max = E − W₀ = ${nf(E)} − ${nf(W)}.` }; }],
      ["P14. Niveaux d'énergie de l'atome", (r) => { const n = ri(r, 1, 5), E = -13.6 / (n * n);
        return { q: `Énergie du niveau n = ${n} de l'atome d'hydrogène (Eₙ = −13,6/n² eV) :`, ok: `${nf(E)} eV`, faux: [`${nf(13.6 / (n * n))} eV`, `${nf(-13.6 * n * n)} eV`, `${nf(-13.6 / (n * n) - 1)} eV`], e: `Eₙ = −13,6/${n}² = ${nf(E)} eV.` }; }],
      ["P14. Niveaux d'énergie de l'atome", (r) => { const p = ri(r, 2, 4), n = ri(r, 1, p - 1), dE = 13.6 * (1 / (n * n) - 1 / (p * p));
        return { q: `Atome d'hydrogène : énergie du photon émis lors de la transition du niveau ${p} au niveau ${n} :`, ok: `${nf(dE)} eV`, faux: [`${nf(dE + 1.7)} eV`, `${nf(13.6 * (1 / n + 1 / p))} eV`, `${nf(-dE)} eV`], e: `E = E${sub(p)} − E${sub(n)} = 13,6 (1/${n}² − 1/${p}²) = ${nf(dE)} eV.` }; }],
      ["P15. Réactions nucléaires", (r) => { const T = pick(r, [5, 8, 30, 138, 1600, 5730]);
        return { q: `Constante radioactive d'un élément de demi-vie ${T} ans :`, ok: `${sci(Math.log(2) / T)} an⁻¹`, faux: [`${sci(T / Math.log(2))} an⁻¹`, `${sci(1 / T)} an⁻¹`, `${sci(Math.log(2) * T)} an⁻¹`], e: `λ = ln 2 / T = 0,693 / ${T}.` }; }],
      ["P15. Réactions nucléaires", (r) => { const el = pick(r, [["¹⁴₆C", "β⁻", "¹⁴₇N"], ["⁶⁰₂₇Co", "β⁻", "⁶⁰₂₈Ni"], ["²²⁶₈₈Ra", "α", "²²²₈₆Rn"], ["²³⁸₉₂U", "α", "²³⁴₉₀Th"], ["³²₁₅P", "β⁻", "³²₁₆S"], ["²¹⁰₈₄Po", "α", "²⁰⁶₈₂Pb"]]), all = ["¹⁴₇N", "⁶⁰₂₈Ni", "²²²₈₆Rn", "²³⁴₉₀Th", "³²₁₆S", "²⁰⁶₈₂Pb", "¹⁴₅B", "²²²₈₇Fr", "⁶⁰₂₆Fe"];
        return { q: `Le noyau ${el[0]} se désintègre (${el[1]}). Noyau fils :`, ok: el[2], faux: all.filter((x) => x !== el[2]).sort(() => r() - 0.5).slice(0, 3), e: el[1] === "α" ? "Émission α (⁴₂He) : A diminue de 4, Z de 2." : "Émission β⁻ (⁰₋₁e) : A ne change pas, Z augmente de 1." }; }],
      ["C1. Les alcools", (r) => { const n = ri(r, 1, 6), M = 14 * n + 18;
        return { q: `Un alcool saturé CₙH₂ₙ₊₁OH a une masse molaire de ${M} g/mol. n vaut :`, ok: String(n), faux: [String(n + 1), String(n + 2 > 7 ? n - 1 || 7 : n + 2), String(Math.round(M / 14))].filter((x, i, s) => s.indexOf(x) === i && x !== String(n)).concat(["8"]).slice(0, 3), e: `M = 12n + 2n + 1 + 16 + 1 = 14n + 18 = ${M}, donc n = ${n}.` }; }],
      ["C2. Amines et acides α-aminés", (r) => { const n = ri(r, 1, 5), M = 14 * n + 17;
        return { q: `Une amine saturée CₙH₂ₙ₊₃N a une masse molaire de ${M} g/mol. n vaut :`, ok: String(n), faux: [String(n + 1), String(n + 2), String(n + 3)], e: `M = 12n + 2n + 3 + 14 = 14n + 17 = ${M}, donc n = ${n}.` }; }],
      ["C3. Acides carboxyliques et dérivés", (r) => { const n0 = pick(r, [0.5, 1, 2]), rd = pick(r, [0.6, 0.67, 0.7, 0.8]);
        return { q: `Estérification : ${nf(n0)} mol d'acide et ${nf(n0)} mol d'alcool donnent ${nf(n0 * rd, 3)} mol d'ester. Rendement :`, ok: `${nf(rd * 100, 0)} %`, faux: [`${nf((1 - rd) * 100, 0)} %`, "100 %", `${nf(rd * 50, 0)} %`], e: `r = n(ester)/n(initial) = ${nf(n0 * rd, 3)}/${nf(n0)}.` }; }],
      ["C4. Cinétique chimique", (r) => { const dn = pick(r, [0.01, 0.02, 0.05]), dt = pick(r, [2, 5, 10]), V = pick(r, [0.1, 0.2, 0.5]);
        return { q: `En ${dt} min, ${nf(dn)} mol de produit se forment dans ${nf(V)} L. Vitesse volumique moyenne :`, ok: `${nf(dn / V / dt, 4)} mol·L⁻¹·min⁻¹`, faux: [`${nf(dn / dt, 4)} mol·L⁻¹·min⁻¹`, `${nf(dn * V / dt, 4)} mol·L⁻¹·min⁻¹`, `${nf(dn / V * dt, 3)} mol·L⁻¹·min⁻¹`], e: `v = Δ[P]/Δt = (${nf(dn)}/${nf(V)})/${dt}.` }; }],
      ["C5. Autoprotolyse de l'eau, pH et indicateurs", (r) => { const k = ri(r, 1, 5);
        return { q: `À 25 °C, une solution a [H₃O⁺] = 10⁻${sup(k).replace("⁻", "")} mol/L. [OH⁻] vaut :`, ok: `10⁻${sup(14 - k)} mol/L`, faux: [`10⁻${sup(k)} mol/L`, `10${sup(14 - k)} mol/L`, `10⁻${sup(14 + k)} mol/L`], e: `Produit ionique : [H₃O⁺][OH⁻] = 10⁻¹⁴, donc [OH⁻] = 10⁻¹⁴/10⁻${sup(k)} = 10⁻${sup(14 - k)}.` }; }],
      ["C6. Acides forts et bases fortes", (r) => { const k = ri(r, 1, 4);
        return { q: `pH d'une solution d'hydroxyde de sodium (base forte) à 10⁻${sup(k)} mol/L :`, ok: String(14 - k), faux: [String(k), String(7 + k), String(14 + k)], e: `[OH⁻] = 10⁻${sup(k)}, [H₃O⁺] = 10⁻${sup(14 - k)}, donc pH = ${14 - k}.` }; }],
      ["C6. Acides forts et bases fortes", (r) => { const Ca = pick(r, [0.01, 0.05, 0.1]), Va = pick(r, [10, 20, 25]), Cb = pick(r, [0.01, 0.02, 0.05, 0.1]);
        return { q: `On dose ${Va} mL d'acide chlorhydrique à ${nf(Ca)} mol/L par de la soude à ${nf(Cb)} mol/L. Volume à l'équivalence :`, ok: `${nf(Ca * Va / Cb, 1)} mL`, faux: [`${nf(Cb * Va / Ca, 1)} mL`, `${Va} mL`, `${nf(Ca * Cb * Va, 3)} mL`], e: `À l'équivalence Ca Va = Cb V_E, donc V_E = ${nf(Ca)} × ${Va}/${nf(Cb)}.` }; }],
      ["C7. Acides faibles, bases faibles et pKa", (r) => { const pKa = pick(r, [3.8, 4.2, 4.8, 9.2]), k = pick(r, [-1, 0, 1]);
        return { q: `Couple de pKa = ${nf(pKa)}. pH d'une solution où [A⁻]/[AH] = ${k === -1 ? "0,1" : k === 0 ? "1" : "10"} :`, ok: nf(pKa + k), faux: [nf(pKa + k + 2), nf(pKa + k - 2), nf(pKa + k + 0.5)], e: `pH = pKa + log([A⁻]/[AH]) = ${nf(pKa)} ${k >= 0 ? "+" : "−"} ${Math.abs(k)}.` }; }],
      ["C8. Dosages et solutions tampons", (r) => { const pKa = pick(r, [3.8, 4.8, 9.2]);
        return { q: `Dosage d'un acide faible de pKa ${nf(pKa)} par une base forte. pH à la demi-équivalence :`, ok: nf(pKa), faux: ["7", nf(pKa / 2), nf(14 - pKa)], e: `À la demi-équivalence [A⁻] = [AH], donc pH = pKa. Le mélange est alors une solution tampon.` }; }],
    ],
  };
  for (const [sid, list] of Object.entries(PLUS)) (GEN[sid] = GEN[sid] || []).push(...list);

  // Collège, 2nde et 1ère : de nouveaux exercices à chaque tirage
  const PLUS2 = {
    "6e-maths": [
      ["Nombres décimaux et opérations", (r) => { const a = ri(r, 12, 99) / 10, b = ri(r, 11, 89) / 10;
        return { q: `Calcule ${nf(a, 1)} + ${nf(b, 1)}.`, ok: nf(a + b, 1), faux: [nf(a + b + 1, 1), nf(a + b - 0.1, 1), nf(a + b + 10, 1)], e: `On aligne les virgules puis on ajoute : ${nf(a, 1)} + ${nf(b, 1)} = ${nf(a + b, 1)}.` }; }],
      ["Nombres décimaux et opérations", (r) => { const a = ri(r, 11, 99) / 10, k = pick(r, [10, 100, 1000]);
        return { q: `Calcule ${nf(a, 1)} × ${k}.`, ok: nf(a * k, 1), faux: [nf(a * k / 10, 1), nf(a * k * 10, 1), nf(a + k, 1)], e: `Multiplier par ${k}, c'est décaler la virgule de ${String(k).length - 1} rang(s) vers la droite.` }; }],
      ["Nombres décimaux et opérations", (r) => { const a = ri(r, 2, 9), b = ri(r, 12, 99) / 10;
        return { q: `Calcule ${a} × ${nf(b, 1)}.`, ok: nf(a * b, 1), faux: [nf(a * b * 10, 1), nf(a * b + 1, 1), nf(a + b, 1)], e: `${a} × ${nf(b, 1)} = ${a} × ${b * 10} ÷ 10 = ${nf(a * b, 1)}.` }; }],
      ["Multiples, diviseurs et divisibilité", (r) => { const n = pick(r, [2, 3, 5, 9]), k = ri(r, 11, 99), x = n * k;
        return { q: `Lequel de ces nombres est divisible par ${n} ?`, ok: String(x), faux: [String(x + 1), String(x + (n === 2 ? 3 : 2)), String(x - 1)], e: n === 2 ? "Divisible par 2 : le chiffre des unités est pair." : n === 5 ? "Divisible par 5 : il se termine par 0 ou 5." : `Divisible par ${n} : la somme des chiffres est un multiple de ${n}.` }; }],
      ["Multiples, diviseurs et divisibilité", (r) => { const a = ri(r, 3, 12), q = ri(r, 4, 15), re = ri(r, 0, a - 1), n = a * q + re;
        return { q: `Dans la division euclidienne de ${n} par ${a}, le reste est :`, ok: String(re), faux: [String(q), String((re + 1) % a === re ? re + 2 : (re + 1) % a), String(a - 1 === re ? 0 : a - 1)], e: `${n} = ${a} × ${q} + ${re}, avec ${re} < ${a}. Le reste est ${re}.` }; }],
      ["Proportionnalité", (r) => { const p = ri(r, 2, 9) * 50, n = ri(r, 2, 5), k = ri(r, 6, 12);
        return { q: `${n} cahiers coûtent ${p * n} F. Combien coûtent ${k} cahiers ?`, ok: `${p * k} F`, faux: [`${p * n * k} F`, `${p * (k - 1)} F`, `${p * n + k} F`], e: `Un cahier coûte ${p * n} ÷ ${n} = ${p} F, donc ${k} cahiers coûtent ${k} × ${p} = ${p * k} F.` }; }],
      ["Mesures de longueurs, masses et durées", (r) => { const x = ri(r, 12, 980) / 10, [u, v, f] = pick(r, [["m", "cm", 100], ["km", "m", 1000], ["kg", "g", 1000], ["cm", "mm", 10]]);
        return { q: `Convertis ${nf(x, 1)} ${u} en ${v}.`, ok: `${nf(x * f, 1)} ${v}`, faux: [`${nf(x * f / 10, 1)} ${v}`, `${nf(x * f * 10, 1)} ${v}`, `${nf(x / f, 4)} ${v}`], e: `1 ${u} = ${f} ${v}, donc on multiplie par ${f}.` }; }],
      ["Mesures de longueurs, masses et durées", (r) => { const h = ri(r, 1, 3), mn = pick(r, [15, 20, 30, 45, 50]);
        return { q: `${h} h ${mn} min, c'est combien de minutes ?`, ok: `${h * 60 + mn} min`, faux: [`${h * 100 + mn} min`, `${h + mn} min`, `${h * 60 + mn + 10} min`], e: `1 h = 60 min, donc ${h} × 60 + ${mn} = ${h * 60 + mn} min.` }; }],
      ["Droites, angles et triangles", (r) => { const a = ri(r, 30, 80), b = ri(r, 30, 140 - a);
        return { q: `Dans un triangle, deux angles mesurent ${a}° et ${b}°. Le troisième mesure :`, ok: `${180 - a - b}°`, faux: [`${360 - a - b}°`, `${a + b}°`, `${90 - Math.min(a, b)}°`], e: `La somme des angles d'un triangle vaut 180° : 180 − ${a} − ${b} = ${180 - a - b}°.` }; }],
      ["Périmètres, aires et cercle", (r) => { const R = ri(r, 2, 10);
        return { q: `Périmètre d'un cercle de rayon ${R} cm (π ≈ 3,14) :`, ok: `${nf(2 * 3.14 * R)} cm`, faux: [`${nf(3.14 * R)} cm`, `${nf(3.14 * R * R)} cm`, `${nf(4 * 3.14 * R)} cm`], e: `P = 2 × π × R = 2 × 3,14 × ${R} = ${nf(2 * 3.14 * R)} cm.` }; }],
      ["Périmètres, aires et cercle", (r) => { const b = ri(r, 4, 14), h = ri(r, 3, 12);
        return { q: `Aire d'un triangle de base ${b} cm et de hauteur ${h} cm :`, ok: `${nf(b * h / 2)} cm²`, faux: [`${b * h} cm²`, `${b + h} cm²`, `${2 * (b + h)} cm²`], e: `A = base × hauteur ÷ 2 = ${b} × ${h} ÷ 2 = ${nf(b * h / 2)} cm².` }; }],
    ],
    "5e-maths": [
      ["Fractions et priorités de calcul", (r) => { const a = ri(r, 2, 9), b = ri(r, 2, 9), c = ri(r, 2, 9);
        return { q: `Calcule ${a} + ${b} × ${c}.`, ok: String(a + b * c), faux: [String((a + b) * c), String(a * b + c), String(a + b + c)], e: `La multiplication est prioritaire : ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${a + b * c}.` }; }],
      ["Fractions et priorités de calcul", (r) => { const d = pick(r, [3, 4, 5, 6, 7, 8, 9]), a = ri(r, 1, d - 1), b = ri(r, 1, d - 1);
        return { q: `Calcule ${a}/${d} + ${b}/${d}.`, ok: fr(a + b, d), faux: [`${a + b}/${2 * d}`, fr(a * b, d), `${a + b}/${d * d}`], e: `Même dénominateur : on ajoute les numérateurs. ${a} + ${b} = ${a + b}, donc ${fr(a + b, d)}.` }; }],
      ["Parallélogramme et symétrie centrale", (r) => { const a = ri(r, 40, 140);
        return { q: `ABCD est un parallélogramme et Â = ${a}°. Combien mesure l'angle B̂ ?`, ok: `${180 - a}°`, faux: [`${a}°`, `${360 - a}°`, `${nf(90 - a / 2, 1)}°`], e: `Deux angles consécutifs d'un parallélogramme sont supplémentaires : 180 − ${a} = ${180 - a}°.` }; }],
      ["Parallélogramme et symétrie centrale", (r) => { const xa = ri(r, -6, 6), xo = ri(r, -6, 6);
        return { q: `Sur une droite graduée, A a pour abscisse ${m(xa)} et O pour abscisse ${m(xo)}. Abscisse du symétrique de A par rapport à O :`, ok: m(2 * xo - xa), faux: [m(-xa), m(xa + xo), m(xo - xa)], e: `O est le milieu de [AA'] : x' = 2 × ${par(xo)} − ${par(xa)} = ${m(2 * xo - xa)}.` }; }],
      ["Aires et volumes", (r) => { const a = ri(r, 2, 9), b = ri(r, 2, 9), c = ri(r, 2, 9);
        return { q: `Volume d'un pavé droit de ${a} cm × ${b} cm × ${c} cm :`, ok: `${a * b * c} cm³`, faux: [`${a + b + c} cm³`, `${2 * (a * b + b * c + a * c)} cm³`, `${a * b} cm³`], e: `V = L × l × h = ${a} × ${b} × ${c} = ${a * b * c} cm³.` }; }],
      ["Aires et volumes", (r) => { const b = ri(r, 4, 15), h = ri(r, 3, 12);
        return { q: `Aire d'un parallélogramme de base ${b} cm et de hauteur ${h} cm :`, ok: `${b * h} cm²`, faux: [`${nf(b * h / 2)} cm²`, `${2 * (b + h)} cm²`, `${b + h} cm²`], e: `A = base × hauteur = ${b} × ${h} = ${b * h} cm².` }; }],
      ["Nombres relatifs", (r) => { const a = nz(r, -15, 15), b = nz(r, -15, 15);
        return { q: `Calcule ${par(a)} − ${par(b)}.`, ok: m(a - b), faux: [m(a + b), m(b - a), m(-a - b)], e: `Soustraire, c'est ajouter l'opposé : ${par(a)} + ${par(-b)} = ${m(a - b)}.` }; }],
    ],
    "4e-maths": [
      ["Calcul littéral : développer, factoriser", (r) => { const k = nz(r, -6, 6), a = nz(r, 1, 7), b = nz(r, -9, 9);
        return { q: `Développe ${k}(${co(a)}x ${sg(b)}).`.replace(/^Développe (−?\d+)/, (s0, kk) => `Développe ${par(Number(kk.replace("−", "-")))}`), ok: `${co(k * a)}x ${sg(k * b)}`, faux: [`${co(k * a)}x ${sg(b)}`, `${co(a)}x ${sg(k * b)}`, `${co(k * a)}x ${sg(-k * b)}`], e: `On multiplie chaque terme par ${par(k)} : ${par(k)} × ${co(a) || "1"}x = ${co(k * a)}x et ${par(k)} × ${par(b)} = ${m(k * b)}.` }; }],
      ["Calcul littéral : développer, factoriser", (r) => { const k = ri(r, 2, 9), a = ri(r, 1, 6), b = ri(r, 1, 9);
        return { q: `Factorise ${k * a}x + ${k * b}.`, ok: `${k}(${co(a)}x + ${b})`, faux: [`${k}(${co(a)}x + ${k * b})`, `${k * a}(x + ${b})`, `x(${k * a} + ${k * b})`], e: `${k} est un facteur commun : ${k * a}x + ${k * b} = ${k} × ${co(a) || "1"}x + ${k} × ${b}.` }; }],
      ["Fractions et inverses", (r) => { const a = ri(r, 1, 7), b = ri(r, 2, 9), c = ri(r, 1, 7), d = ri(r, 2, 9);
        return { q: `Calcule ${a}/${b} × ${c}/${d}.`, ok: fr(a * c, b * d), faux: [fr(a * d, b * c), `${a + c}/${b + d}`, fr(a * c, b + d)], e: `On multiplie les numérateurs entre eux et les dénominateurs entre eux : ${a * c}/${b * d} = ${fr(a * c, b * d)}.` }; }],
      ["Fractions et inverses", (r) => { const a = ri(r, 1, 7), b = ri(r, 2, 9), c = ri(r, 1, 7), d = ri(r, 2, 9);
        return { q: `Calcule ${a}/${b} ÷ ${c}/${d}.`, ok: fr(a * d, b * c), faux: [fr(a * c, b * d), fr(b * c, a * d), `${a - c}/${b - d || 1}`], e: `Diviser, c'est multiplier par l'inverse : ${a}/${b} × ${d}/${c} = ${fr(a * d, b * c)}.` }; }],
      ["Droite des milieux et cercle circonscrit", (r) => { const bc = ri(r, 4, 20);
        return { q: `Dans le triangle ABC, I et J sont les milieux de [AB] et [AC]. BC = ${bc} cm. IJ mesure :`, ok: `${nf(bc / 2, 1)} cm`, faux: [`${bc} cm`, `${2 * bc} cm`, `${nf(bc / 3, 1)} cm`], e: `Droite des milieux : IJ = BC ÷ 2 = ${nf(bc / 2, 1)} cm, et (IJ) // (BC).` }; }],
      ["Droite des milieux et cercle circonscrit", (r) => { const h = pick(r, [10, 13, 17, 25, 15, 26]);
        return { q: `ABC est rectangle en A et BC = ${h} cm. Rayon de son cercle circonscrit :`, ok: `${nf(h / 2, 1)} cm`, faux: [`${h} cm`, `${2 * h} cm`, `${nf(h / 3, 1)} cm`], e: `Le centre est le milieu de l'hypoténuse : R = BC ÷ 2 = ${nf(h / 2, 1)} cm.` }; }],
      ["Puissances et écriture scientifique", (r) => { const a = ri(r, 2, 6), n = ri(r, 2, 6), p = ri(r, 2, 6);
        return { q: `Écris ${a}${sup(n)} × ${a}${sup(p)} sous la forme d'une puissance de ${a}.`, ok: `${a}${sup(n + p)}`, faux: [`${a}${sup(n * p)}`, `${a * a}${sup(n + p)}`, `${a}${sup(Math.abs(n - p))}`], e: `aⁿ × aᵖ = aⁿ⁺ᵖ : ${a}${sup(n)} × ${a}${sup(p)} = ${a}${sup(n + p)}.` }; }],
    ],
    "4e-pc": [
      ["Mélanges et corps purs", (r) => { const ms = ri(r, 5, 40), v = pick(r, [0.25, 0.5, 1, 2]);
        return { q: `On dissout ${ms} g de sel dans ${nf(v)} L d'eau. Concentration massique :`, ok: `${nf(ms / v)} g/L`, faux: [`${nf(ms * v)} g/L`, `${nf(v / ms, 3)} g/L`, `${ms + v} g/L`], e: `Cm = m ÷ V = ${ms} ÷ ${nf(v)} = ${nf(ms / v)} g/L.` }; }],
      ["Les changements d'état", (r) => { const [ch, nm] = pick(r, [["solide → liquide", "la fusion"], ["liquide → gaz", "la vaporisation"], ["gaz → liquide", "la liquéfaction"], ["liquide → solide", "la solidification"]]);
        return { q: `Le passage ${ch} s'appelle :`, ok: nm, faux: ["la fusion", "la vaporisation", "la liquéfaction", "la solidification", "la sublimation"].filter((x) => x !== nm).slice(0, 3), e: `${ch} : c'est ${nm}. Pendant un changement d'état d'un corps pur, la température reste constante.` }; }],
      ["La propagation de la lumière", (r) => { const d = ri(r, 1, 9) * 10, t = d / 300000;
        return { q: `La lumière parcourt ${d * 1000} km à 300 000 km/s. Durée du trajet :`, ok: `${nf(d * 1000 / 300000, 3)} s`, faux: [`${nf(d * 1000 * 300000)} s`, `${nf(300000 / (d * 1000), 3)} s`, `${nf(d * 1000 / 3000, 3)} s`], e: `t = d ÷ v = ${d * 1000} ÷ 300 000 = ${nf(d * 1000 / 300000, 3)} s.` }; }],
      ["Le circuit électrique", (r) => { const u1 = ri(r, 2, 9), u2 = ri(r, 2, 9);
        return { q: `Deux lampes en série ont des tensions ${u1} V et ${u2} V. Tension aux bornes du générateur :`, ok: `${u1 + u2} V`, faux: [`${Math.abs(u1 - u2)} V`, `${u1 * u2} V`, `${Math.max(u1, u2)} V`], e: `En série, les tensions s'additionnent (loi d'additivité) : ${u1} + ${u2} = ${u1 + u2} V.` }; }],
    ],
    "3e-maths": [
      ["Calcul dans ℝ : racines carrées, puissances", (r) => { const a = pick(r, [2, 3, 5, 6, 7]), k = ri(r, 2, 6);
        return { q: `Simplifie √${k * k * a}.`, ok: `${k}√${a}`, faux: [`${a}√${k}`, `${k * k}√${a}`, `${k * a}`], e: `${k * k * a} = ${k * k} × ${a}, donc √${k * k * a} = √${k * k} × √${a} = ${k}√${a}.` }; }],
      ["Calcul dans ℝ : racines carrées, puissances", (r) => { const a = pick(r, [2, 3, 5]), b = ri(r, 2, 5), c = ri(r, 1, 5);
        return { q: `Calcule ${b}√${a} + ${c}√${a}.`, ok: `${b + c}√${a}`, faux: [`${b + c}√${2 * a}`, `${b * c}√${a}`, `${b + c}√${a * a}`], e: `On factorise par √${a} : (${b} + ${c})√${a} = ${b + c}√${a}.` }; }],
      ["Calcul dans ℝ : racines carrées, puissances", (r) => { const a = pick(r, [2, 3, 5, 7]);
        return { q: `Rends rationnel le dénominateur de 1/√${a}.`, ok: `√${a}/${a}`, faux: [`√${a}`, `${a}/√${a}`, `1/${a}`], e: `On multiplie en haut et en bas par √${a} : √${a}/(√${a})² = √${a}/${a}.` }; }],
      ["Calcul littéral et identités remarquables", (r) => { const a = ri(r, 1, 5), b = nz(r, -9, 9);
        return { q: `Développe (${co(a)}x ${sg(b)})².`, ok: `${co(a * a)}x² ${sg(2 * a * b)}x + ${b * b}`, faux: [`${co(a * a)}x² + ${b * b}`, `${co(a * a)}x² ${sg(a * b)}x + ${b * b}`, `${co(a * a)}x² ${sg(2 * a * b)}x ${sg(-b * b)}`], e: `(A + B)² = A² + 2AB + B² avec A = ${co(a)}x et B = ${m(b)}.` }; }],
      ["Calcul littéral et identités remarquables", (r) => { const a = ri(r, 1, 6), b = ri(r, 1, 9);
        return { q: `Factorise ${co(a * a)}x² − ${b * b}.`, ok: `(${co(a)}x − ${b})(${co(a)}x + ${b})`, faux: [`(${co(a)}x − ${b})²`, `(${co(a)}x + ${b})²`, `(${co(a * a)}x − ${b})(x + ${b})`], e: `A² − B² = (A − B)(A + B) avec A = ${co(a)}x et B = ${b}.` }; }],
      ["Équations, inéquations et systèmes", (r) => { const a = nz(r, 2, 7), x = nz(r, -6, 6), b = nz(r, -9, 9), c = a * x + b;
        return { q: `Résous ${a}x ${sg(b)} > ${m(c)}.`, ok: `x > ${m(x)}`, faux: [`x < ${m(x)}`, `x > ${m(-x)}`, `x > ${fr(c + b, a)}`], e: `${a}x > ${m(c)} − ${par(b)} = ${m(c - b)}, puis on divise par ${a} > 0 : x > ${m(x)}.` }; }],
      ["Équations, inéquations et systèmes", (r) => { const a = nz(r, -6, 6), b = nz(r, -6, 6);
        return { q: `Solutions de (x ${sg(-a)})(x ${sg(-b)}) = 0 :`, ok: a === b ? m(a) : `${m(Math.min(a, b))} et ${m(Math.max(a, b))}`, faux: [`${m(-Math.max(a, b))} et ${m(-Math.min(a, b))}`, `${m(a * b)}`, `${m(a + b)}`], e: `Un produit est nul si l'un des facteurs est nul : x = ${m(a)} ou x = ${m(b)}.` }; }],
      ["Arithmétique : PGCD", (r) => { const g = ri(r, 2, 12), a = g * pick(r, [3, 5, 7, 4]), b = g * pick(r, [2, 9, 11, 13]); const G = gcd(a, b);
        return { q: `La fraction ${a}/${b} rendue irréductible :`, ok: fr(a, b), faux: [`${a / g}/${b}`, `${a / 2}/${b / 2}`.includes(".") ? `${a}/${b * 2}` : `${a / 2}/${b / 2}`, fr(b, a)], e: `PGCD(${a} ; ${b}) = ${G}. On divise en haut et en bas par ${G} : ${fr(a, b)}.` }; }],
      ["Applications affines et repérage", (r) => { const a = nz(r, -5, 5), b = nz(r, -9, 9), x = nz(r, -5, 5);
        return { q: `f(x) = ${co(a)}x ${sg(b)}. Calcule f(${m(x)}).`, ok: m(a * x + b), faux: [m(a * x - b), m(a + x + b), m(-a * x + b)], e: `f(${m(x)}) = ${m(a)} × ${par(x)} ${sg(b)} = ${m(a * x + b)}.` }; }],
      ["Applications affines et repérage", (r) => { const xa = ri(r, -5, 5), ya = ri(r, -5, 5), xb = ri(r, -5, 5), yb = ri(r, -5, 5);
        return { q: `A(${m(xa)} ; ${m(ya)}) et B(${m(xb)} ; ${m(yb)}). Coordonnées du milieu de [AB] :`, ok: `(${nf((xa + xb) / 2, 1)} ; ${nf((ya + yb) / 2, 1)})`, faux: [`(${m(xb - xa)} ; ${m(yb - ya)})`, `(${m(xa + xb)} ; ${m(ya + yb)})`, `(${nf((ya + yb) / 2, 1)} ; ${nf((xa + xb) / 2, 1)})`], e: `Milieu : ((xA + xB)/2 ; (yA + yB)/2).` }; }],
      ["Pythagore et trigonométrie", (r) => { const [a, b, c] = pick(r, TRIPLES), k = ri(r, 1, 3);
        return { q: `ABC est rectangle en A, AB = ${a * k} cm et AC = ${b * k} cm. cos B̂ =`, ok: fr(a, c), faux: [fr(b, c), fr(a, b), fr(c, a)], e: `BC = √(${a * k}² + ${b * k}²) = ${c * k} cm. cos B̂ = adjacent ÷ hypoténuse = ${a * k}/${c * k} = ${fr(a, c)}.` }; }],
      ["Pythagore et trigonométrie", (r) => { const ang = pick(r, [30, 60]), h = ri(r, 2, 12) * 2;
        return { q: `Triangle rectangle d'hypoténuse ${h} cm et d'angle aigu ${ang}°. Côté opposé à cet angle :`, ok: ang === 30 ? `${h / 2} cm` : `${h / 2}√3 cm`, faux: ang === 30 ? [`${h / 2}√3 cm`, `${h} cm`, `${h * 2} cm`] : [`${h / 2} cm`, `${h}√3 cm`, `${h} cm`], e: `Opposé = hypoténuse × sin ${ang}° avec sin ${ang}° = ${ang === 30 ? "1/2" : "√3/2"}.` }; }],
      ["Angles inscrits et cercle", (r) => { const a = ri(r, 15, 85);
        return { q: `Un angle inscrit intercepte un arc ; l'angle au centre associé mesure ${2 * a}°. L'angle inscrit mesure :`, ok: `${a}°`, faux: [`${4 * a}°`, `${2 * a}°`, `${180 - a}°`], e: `L'angle inscrit vaut la moitié de l'angle au centre : ${2 * a} ÷ 2 = ${a}°.` }; }],
      ["Angles inscrits et cercle", (r) => { const n = pick(r, [5, 6, 8, 9, 10, 12]);
        return { q: `Angle au centre d'un polygone régulier à ${n} côtés :`, ok: `${nf(360 / n, 1)}°`, faux: [`${nf(180 / n, 1)}°`, `${nf(180 - 360 / n, 1)}°`, `${n * 10}°`], e: `Les ${n} angles au centre se partagent 360° : 360 ÷ ${n} = ${nf(360 / n, 1)}°.` }; }],
      ["Géométrie dans l'espace : pyramide, cône, cylindre", (r) => { const c = ri(r, 2, 9), h = ri(r, 2, 10) * 3;
        return { q: `Volume d'une pyramide à base carrée de côté ${c} cm et de hauteur ${h} cm :`, ok: `${c * c * h / 3} cm³`, faux: [`${c * c * h} cm³`, `${c * c * h / 2} cm³`, `${c * h} cm³`], e: `V = (aire de base × hauteur) ÷ 3 = ${c * c} × ${h} ÷ 3 = ${c * c * h / 3} cm³.` }; }],
      ["Géométrie dans l'espace : pyramide, cône, cylindre", (r) => { const R = ri(r, 1, 6), h = ri(r, 1, 6) * 3;
        return { q: `Volume exact d'un cône de rayon ${R} cm et de hauteur ${h} cm :`, ok: `${R * R * h / 3}π cm³`, faux: [`${R * R * h}π cm³`, `${2 * R * h / 3}π cm³`, `${R * h}π cm³`], e: `V = π × R² × h ÷ 3 = π × ${R * R} × ${h} ÷ 3 = ${R * R * h / 3}π cm³.` }; }],
      ["Statistiques", (r) => { const v = Array.from({ length: 5 }, () => ri(r, 4, 19)), s = [...v].sort((a, b) => a - b);
        return { q: `Médiane de la série : ${v.join(" ; ")}`, ok: String(s[2]), faux: [String(v[2] === s[2] ? s[1] : v[2]), nf(v.reduce((a, b) => a + b) / 5, 1), String(s[4] - s[0])], e: `On range : ${s.join(" ; ")}. La valeur du milieu (3e sur 5) est ${s[2]}.` }; }],
    ],
    "3e-pc": [
      ["Électricité : loi d'Ohm, résistances", (r) => { const R1 = ri(r, 1, 20) * 10, R2 = ri(r, 1, 20) * 10;
        return { q: `Deux résistances ${R1} Ω et ${R2} Ω sont en série. Résistance équivalente :`, ok: `${R1 + R2} Ω`, faux: [`${nf(R1 * R2 / (R1 + R2), 1)} Ω`, `${R1 * R2} Ω`, `${Math.abs(R1 - R2)} Ω`], e: `En série, les résistances s'ajoutent : ${R1} + ${R2} = ${R1 + R2} Ω.` }; }],
      ["Électricité : loi d'Ohm, résistances", (r) => { const R1 = pick(r, [10, 20, 30, 60]), R2 = pick(r, [20, 30, 60, 40]);
        return { q: `Deux résistances ${R1} Ω et ${R2} Ω sont en parallèle. Résistance équivalente :`, ok: `${nf(R1 * R2 / (R1 + R2), 1)} Ω`, faux: [`${R1 + R2} Ω`, `${nf((R1 + R2) / 2, 1)} Ω`, `${R1 * R2} Ω`], e: `En parallèle : R = R₁R₂/(R₁ + R₂) = ${R1 * R2}/${R1 + R2} = ${nf(R1 * R2 / (R1 + R2), 1)} Ω.` }; }],
      ["Électricité : loi d'Ohm, résistances", (r) => { const R = ri(r, 2, 50) * 10, U = ri(r, 2, 24);
        return { q: `Une résistance de ${R} Ω est soumise à ${U} V. Intensité du courant :`, ok: `${nf(U / R, 3)} A`, faux: [`${U * R} A`, `${nf(R / U, 1)} A`, `${nf(U / R * 10, 3)} A`], e: `Loi d'Ohm : I = U ÷ R = ${U} ÷ ${R} = ${nf(U / R, 3)} A.` }; }],
      ["Puissance et énergie électriques", (r) => { const P = pick(r, [60, 100, 500, 1000, 1500, 2000]), t = ri(r, 1, 6);
        return { q: `Un appareil de ${P} W fonctionne ${t} h. Énergie consommée :`, ok: `${nf(P * t / 1000, 2)} kWh`, faux: [`${P * t} kWh`, `${nf(P / t / 1000, 3)} kWh`, `${nf(P * t / 100, 1)} kWh`], e: `E = P × t = ${P} W × ${t} h = ${P * t} Wh = ${nf(P * t / 1000, 2)} kWh.` }; }],
      ["Puissance et énergie électriques", (r) => { const U = pick(r, [220, 230]), P = pick(r, [440, 1100, 2200, 660, 880]);
        return { q: `Un appareil ${P} W – ${U} V. Intensité qui le traverse en fonctionnement normal :`, ok: `${nf(P / U, 2)} A`, faux: [`${nf(U / P, 3)} A`, `${P * U} A`, `${nf(P / U * 10, 1)} A`], e: `P = U × I, donc I = P ÷ U = ${P} ÷ ${U} = ${nf(P / U, 2)} A.` }; }],
      ["Mécanique : poids, masse, vitesse", (r) => { const mm = ri(r, 2, 90), g = pick(r, [10, 9.8]);
        return { q: `Poids d'un objet de ${mm} kg (g = ${nf(g, 1)} N/kg) :`, ok: `${nf(mm * g, 1)} N`, faux: [`${mm} N`, `${nf(mm / g, 2)} N`, `${nf(mm * g * 10, 1)} N`], e: `P = m × g = ${mm} × ${nf(g, 1)} = ${nf(mm * g, 1)} N.` }; }],
      ["Mécanique : poids, masse, vitesse", (r) => { const t = pick(r, [0.5, 1, 2, 4, 5]), d = ri(r, 4, 9) * 10 * t;
        return { q: `Un car parcourt ${d} km en ${nf(t, 1)} h. Vitesse moyenne :`, ok: `${nf(d / t, 1)} km/h`, faux: [`${nf(d * t, 1)} km/h`, `${nf(t / d, 3)} km/h`, `${nf(d / t / 3.6, 1)} km/h`], e: `v = d ÷ t = ${d} ÷ ${nf(t, 1)} = ${nf(d / t, 1)} km/h.` }; }],
      ["Mécanique : poids, masse, vitesse", (r) => { const v = pick(r, [36, 54, 72, 90, 108]);
        return { q: `Convertis ${v} km/h en m/s.`, ok: `${nf(v / 3.6)} m/s`, faux: [`${nf(v * 3.6, 1)} m/s`, `${nf(v / 36)} m/s`, `${v * 1000} m/s`], e: `On divise par 3,6 : ${v} ÷ 3,6 = ${nf(v / 3.6)} m/s.` }; }],
      ["Optique : les lentilles", (r) => { const f = pick(r, [0.1, 0.2, 0.25, 0.5, 0.05]);
        return { q: `Vergence d'une lentille de distance focale ${nf(f * 100)} cm :`, ok: `${nf(1 / f, 1)} δ`, faux: [`${nf(f, 2)} δ`, `${nf(f * 100)} δ`, `${nf(1 / f / 10, 1)} δ`], e: `C = 1/f avec f en mètres : 1 ÷ ${nf(f, 2)} = ${nf(1 / f, 1)} dioptries.` }; }],
      ["Masse volumique et changements d'état", (r) => { const mm = ri(r, 2, 40) * 10, V = pick(r, [10, 20, 25, 50, 100]);
        return { q: `Un corps de masse ${mm} g a un volume de ${V} cm³. Masse volumique :`, ok: `${nf(mm / V, 2)} g/cm³`, faux: [`${mm * V} g/cm³`, `${nf(V / mm, 3)} g/cm³`, `${nf(mm / V * 10, 1)} g/cm³`], e: `ρ = m ÷ V = ${mm} ÷ ${V} = ${nf(mm / V, 2)} g/cm³.` }; }],
      ["Atome, molécule, mole et équations-bilans", (r) => { const [f, M] = pick(r, [["H₂O", 18], ["CO₂", 44], ["NaCl", 58.5], ["CH₄", 16], ["O₂", 32], ["C₂H₆O", 46]]), n = pick(r, [0.1, 0.2, 0.5, 2, 3]);
        return { q: `Masse de ${nf(n, 1)} mol de ${f} (M = ${nf(M, 1)} g/mol) :`, ok: `${nf(n * M, 2)} g`, faux: [`${nf(M / n, 2)} g`, `${nf(M, 1)} g`, `${nf(n * M * 10, 1)} g`], e: `m = n × M = ${nf(n, 1)} × ${nf(M, 1)} = ${nf(n * M, 2)} g.` }; }],
      ["Atome, molécule, mole et équations-bilans", (r) => { const [eq, k, nm] = pick(r, [["CH₄ + _ O₂ → CO₂ + 2 H₂O", 2, "O₂"], ["2 H₂ + _ O₂ → 2 H₂O", 1, "O₂"], ["C + _ O₂ → CO₂", 1, "O₂"], ["N₂ + _ H₂ → 2 NH₃", 3, "H₂"], ["C₃H₈ + _ O₂ → 3 CO₂ + 4 H₂O", 5, "O₂"], ["2 Na + _ Cl₂ → 2 NaCl", 1, "Cl₂"]]);
        return { q: `Coefficient manquant devant ${nm} : ${eq}`, ok: String(k), faux: [String(k + 1), String(k + 2), String(k === 1 ? 4 : k - 1)], e: `On équilibre chaque élément : il faut ${k} ${nm} pour conserver les atomes.` }; }],
      ["Solutions acides, basiques et pH", (r) => { const p = ri(r, 1, 13);
        return { q: `Une solution a un pH de ${p}. Elle est :`, ok: p < 7 ? "acide" : p > 7 ? "basique" : "neutre", faux: ["acide", "basique", "neutre", "saturée"].filter((x) => x !== (p < 7 ? "acide" : p > 7 ? "basique" : "neutre")).slice(0, 3), e: `pH < 7 : acide ; pH = 7 : neutre ; pH > 7 : basique (à 25 °C).` }; }],
      ["Métaux et combustions", (r) => { const nC = pick(r, [0.5, 1, 2, 3]);
        return { q: `Combustion complète du carbone : C + O₂ → CO₂. ${nf(nC, 1)} mol de C donne :`, ok: `${nf(nC, 1)} mol de CO₂`, faux: [`${nf(2 * nC, 1)} mol de CO₂`, `${nf(nC / 2, 2)} mol de CO₂`, `${nf(nC + 1, 1)} mol de CO₂`], e: `Les coefficients sont 1 : 1, donc n(CO₂) = n(C) = ${nf(nC, 1)} mol.` }; }],
    ],
    "2nde-maths": [
      ["Calcul dans ℝ : intervalles, valeur absolue, racines", (r) => { const a = ri(r, -8, 8), d = ri(r, 1, 6);
        return { q: `Solutions de |x ${sg(-a)}| ≤ ${d} :`, ok: `[${m(a - d)} ; ${m(a + d)}]`, faux: [`]−∞ ; ${m(a - d)}] ∪ [${m(a + d)} ; +∞[`, `[${m(-a - d)} ; ${m(-a + d)}]`, `[${m(a)} ; ${m(a + d)}]`], e: `|x − ${par(a)}| ≤ ${d} signifie que la distance de x à ${m(a)} est au plus ${d}.` }; }],
      ["Fonctions de référence et fonctions affines", (r) => { const xa = ri(r, -5, 4), xb = xa + ri(r, 1, 4), a = nz(r, -4, 4), b = ri(r, -6, 6);
        return { q: `Droite passant par A(${m(xa)} ; ${m(a * xa + b)}) et B(${m(xb)} ; ${m(a * xb + b)}) : coefficient directeur ?`, ok: m(a), faux: [fr(xb - xa, a * (xb - xa)), m(-a), m(b)], e: `a = (yB − yA)/(xB − xA) = ${m(a * (xb - xa))}/${xb - xa} = ${m(a)}.` }; }],
      ["Droites et cercles dans le plan", (r) => { const a = ri(r, -5, 5), b = ri(r, -5, 5), R = ri(r, 1, 7);
        return { q: `Centre et rayon du cercle (x ${sg(-a)})² + (y ${sg(-b)})² = ${R * R} :`.replace(/x \+ 0|x − 0/g, "x").replace(/y \+ 0|y − 0/g, "y"), ok: `(${m(a)} ; ${m(b)}), R = ${R}`, faux: [`(${m(-a)} ; ${m(-b)}), R = ${R}`, `(${m(a)} ; ${m(b)}), R = ${R * R}`, `(${m(b)} ; ${m(a)}), R = ${R}`], e: `(x − a)² + (y − b)² = R² : centre (a ; b), rayon R = √${R * R} = ${R}.` }; }],
      ["Trigonométrie", (r) => { const [d, rad] = pick(r, [[30, "π/6"], [45, "π/4"], [60, "π/3"], [90, "π/2"], [120, "2π/3"], [135, "3π/4"], [150, "5π/6"], [180, "π"]]);
        return { q: `${d}° en radians :`, ok: rad, faux: ["π/6", "π/4", "π/3", "π/2", "2π/3", "π"].filter((x) => x !== rad).slice(0, 3), e: `x rad = ${d} × π/180 = ${rad}.` }; }],
      ["Trigonométrie", (r) => { const [rad, c, s] = pick(r, [["π/6", "√3/2", "1/2"], ["π/4", "√2/2", "√2/2"], ["π/3", "1/2", "√3/2"], ["2π/3", "−1/2", "√3/2"], ["5π/6", "−√3/2", "1/2"]]);
        return { q: `cos(${rad}) =`, ok: c, faux: ["1/2", "√3/2", "√2/2", "−1/2", "−√3/2", "0"].filter((x) => x !== c).slice(0, 3), e: `Valeur remarquable sur le cercle trigonométrique : cos(${rad}) = ${c} et sin(${rad}) = ${s}.` }; }],
      ["Polynômes et fractions rationnelles", (r) => { const a = nz(r, -4, 4), b = nz(r, -5, 5), c = ri(r, -5, 5), x = nz(r, -3, 3);
        return { q: `P(x) = ${co(a)}x² ${sg(b)}x ${sg(c)}. Calcule P(${m(x)}).`, ok: m(a * x * x + b * x + c), faux: [m(-a * x * x + b * x + c), m(a * x * x - b * x + c), m(a * x + b * x + c)], e: `P(${m(x)}) = ${m(a)} × ${x * x} ${sg(b)} × ${par(x)} ${sg(c)} = ${m(a * x * x + b * x + c)}.` }; }],
      ["Polynômes et fractions rationnelles", (r) => { const a = nz(r, -6, 6);
        return { q: `Valeur interdite de f(x) = 1/(x ${sg(-a)}) :`, ok: m(a), faux: [m(-a), "0", "1"], e: `On ne peut pas diviser par 0 : x − ${par(a)} = 0 ⇔ x = ${m(a)}.` }; }],
      ["Calcul littéral, équations et inéquations", (r) => { const a = nz(r, -6, 6), x = nz(r, -8, 8), b = nz(r, -9, 9);
        return { q: `Résous ${co(a)}x ${sg(b)} = ${m(a * x + b)}.`, ok: `x = ${m(x)}`, faux: [`x = ${m(-x)}`, `x = ${fr(a * x + 2 * b, a)}`, `x = ${m(x + 1)}`], e: `${co(a) || "1"}x = ${m(a * x + b)} − ${par(b)} = ${m(a * x)}, donc x = ${m(x)}.` }; }],
    ],
    "2nde-pc": [
      ["Structure de l'atome", (r) => { const [s, Z, A] = pick(r, [["C", 6, 12], ["O", 8, 16], ["Na", 11, 23], ["Al", 13, 27], ["Cl", 17, 35], ["Fe", 26, 56], ["N", 7, 14], ["Mg", 12, 24]]);
        return { q: `Nombre de neutrons dans le noyau ${s} (Z = ${Z}, A = ${A}) :`, ok: String(A - Z), faux: [String(Z), String(A), String(A + Z)], e: `N = A − Z = ${A} − ${Z} = ${A - Z}.` }; }],
      ["Ions, liaisons et classification périodique", (r) => { const [s, Z, cfg, ion] = pick(r, [["Na", 11, "K² L⁸ M¹", "Na⁺"], ["Mg", 12, "K² L⁸ M²", "Mg²⁺"], ["Cl", 17, "K² L⁸ M⁷", "Cl⁻"], ["O", 8, "K² L⁶", "O²⁻"], ["Al", 13, "K² L⁸ M³", "Al³⁺"], ["F", 9, "K² L⁷", "F⁻"]]);
        return { q: `${s} (Z = ${Z}) a pour structure ${cfg}. Ion qu'il forme :`, ok: ion, faux: ["Na⁺", "Mg²⁺", "Cl⁻", "O²⁻", "Al³⁺", "F⁻"].filter((x) => x !== ion).slice(0, 3), e: `L'atome gagne ou perd des électrons pour avoir la structure du gaz noble le plus proche (règle de l'octet) : ${ion}.` }; }],
      ["Réaction chimique", (r) => { const n1 = pick(r, [1, 2, 3, 4]), n2 = pick(r, [1, 2, 3]);
        return { q: `2 H₂ + O₂ → 2 H₂O avec ${n1} mol de H₂ et ${n2} mol de O₂. Réactif limitant :`, ok: n1 / 2 < n2 ? "H₂" : n1 / 2 > n2 ? "O₂" : "aucun (mélange stœchiométrique)", faux: ["H₂", "O₂", "aucun (mélange stœchiométrique)", "H₂O"].filter((x) => x !== (n1 / 2 < n2 ? "H₂" : n1 / 2 > n2 ? "O₂" : "aucun (mélange stœchiométrique)")).slice(0, 3), e: `On compare n(H₂)/2 = ${nf(n1 / 2, 1)} et n(O₂)/1 = ${n2} : le plus petit rapport désigne le limitant.` }; }],
      ["Mouvement et principe d'inertie", (r) => { const v = ri(r, 2, 30), t = ri(r, 2, 20);
        return { q: `Un mobile en mouvement rectiligne uniforme à ${v} m/s. Distance parcourue en ${t} s :`, ok: `${v * t} m`, faux: [`${nf(v / t, 2)} m`, `${v + t} m`, `${v * t * 2} m`], e: `Mouvement uniforme : d = v × t = ${v} × ${t} = ${v * t} m.` }; }],
      ["Forces : poids et gravitation", (r) => { const mm = ri(r, 2, 90), [astre, g] = pick(r, [["la Lune", 1.6], ["Mars", 3.7], ["la Terre", 9.8]]);
        return { q: `Poids sur ${astre} (g = ${nf(g, 1)} N/kg) d'un objet de ${mm} kg :`, ok: `${nf(mm * g, 1)} N`, faux: [`${mm} N`, `${nf(mm / g, 2)} N`, `${nf(mm * 9.8 === mm * g ? mm * 1.6 : mm * 9.8, 1)} N`], e: `P = m × g = ${mm} × ${nf(g, 1)} = ${nf(mm * g, 1)} N. La masse, elle, ne change pas.` }; }],
      ["Le courant électrique : intensité et tension", (r) => { const I = ri(r, 1, 9) / 10, t = ri(r, 1, 10) * 60;
        return { q: `Un courant de ${nf(I, 1)} A circule pendant ${t / 60} min. Quantité d'électricité :`, ok: `${nf(I * t)} C`, faux: [`${nf(I * t / 60, 2)} C`, `${nf(t / I)} C`, `${nf(I * t * 10)} C`], e: `Q = I × t = ${nf(I, 1)} × ${t} s = ${nf(I * t)} C.` }; }],
      ["Réflexion et réfraction de la lumière", (r) => { const i = pick(r, [30, 45, 60]), n = pick(r, [1.33, 1.5]), s = Math.sin(i * Math.PI / 180) / n, rr = Math.asin(s) * 180 / Math.PI;
        return { q: `Un rayon passe de l'air dans un milieu d'indice ${nf(n)} sous ${i}°. Angle de réfraction (arrondi au degré) :`, ok: `${Math.round(rr)}°`, faux: [`${i}°`, `${Math.round(i / n)}°`, `${90 - Math.round(rr)}°`], e: `sin i = n sin r : sin r = sin ${i}° ÷ ${nf(n)} = ${nf(s, 3)}, donc r ≈ ${Math.round(rr)}°.` }; }],
      ["Réflexion et réfraction de la lumière", (r) => { const i = ri(r, 10, 80);
        return { q: `Un rayon arrive sur un miroir plan avec un angle d'incidence de ${i}°. Angle de réflexion :`, ok: `${i}°`, faux: [`${90 - i}°`, `${180 - i}°`, `${2 * i}°`], e: `Loi de la réflexion : l'angle de réflexion est égal à l'angle d'incidence.` }; }],
    ],
    "1ere-maths": [
      ["Produit scalaire et vecteurs", (r) => { const a = ri(r, -5, 5), b = ri(r, -5, 5), c = ri(r, -5, 5), d = ri(r, -5, 5);
        return { q: `u(${m(a)} ; ${m(b)}) et v(${m(c)} ; ${m(d)}). Produit scalaire u·v :`, ok: m(a * c + b * d), faux: [m(a * d + b * c), m(a * c - b * d), m(a + b + c + d)], e: `u·v = xx' + yy' = ${par(a)} × ${par(c)} + ${par(b)} × ${par(d)} = ${m(a * c + b * d)}.` }; }],
      ["Produit scalaire et vecteurs", (r) => { const [a, b, c] = pick(r, TRIPLES);
        return { q: `Norme du vecteur u(${a} ; ${b}) :`, ok: String(c), faux: [String(a + b), String(a * a + b * b), String(Math.abs(b - a))], e: `‖u‖ = √(${a}² + ${b}²) = √${a * a + b * b} = ${c}.` }; }],
      ["Trigonométrie", (r) => { const [x, v] = pick(r, [["cos(π − x)", "−cos x"], ["sin(π − x)", "sin x"], ["cos(−x)", "cos x"], ["sin(−x)", "−sin x"], ["cos(π/2 − x)", "sin x"], ["sin(π/2 − x)", "cos x"], ["cos(π + x)", "−cos x"]]);
        return { q: `Simplifie ${x}.`, ok: v, faux: ["cos x", "−cos x", "sin x", "−sin x"].filter((y) => y !== v), e: `On lit la formule sur le cercle trigonométrique : ${x} = ${v}.` }; }],
      ["Généralités sur les fonctions", (r) => { const a = nz(r, -4, 4), b = nz(r, -5, 5), x = nz(r, -3, 3);
        return { q: `f(x) = ${co(a)}x ${sg(b)} et g(x) = x². Calcule (g ∘ f)(${m(x)}).`, ok: String((a * x + b) ** 2), faux: [String(a * x * x + b), String((a * x + b) * 2), String(a * x + b)], e: `f(${m(x)}) = ${m(a * x + b)}, puis g(${m(a * x + b)}) = ${(a * x + b) ** 2}.` }; }],
      ["Barycentre", (r) => { const xa = ri(r, -6, 6), xb = ri(r, -6, 6), a = ri(r, 1, 4), b = ri(r, 1, 4);
        return { q: `Sur un axe, A(${m(xa)}) et B(${m(xb)}). Abscisse du barycentre de (A ; ${a}) et (B ; ${b}) :`, ok: fr(a * xa + b * xb, a + b), faux: [fr(xa + xb, 2), fr(b * xa + a * xb, a + b), fr(a * xa + b * xb, a * b)], e: `xG = (${a} × ${par(xa)} + ${b} × ${par(xb)}) / (${a} + ${b}) = ${fr(a * xa + b * xb, a + b)}.` }; }],
      ["Angles orientés et rotations", (r) => { const k = ri(r, 1, 5), [b, bs] = pick(r, [[1, "π/3"], [1, "π/4"], [1, "π/6"], [5, "5π/6"], [3, "3π/4"], [2, "2π/3"]]); const den = Number(bs.match(/\/(\d)/)[1]), base = b;
        const tot = base + 2 * k * den, sign = r() < 0.5 ? 1 : -1;
        return { q: `Mesure principale de ${sign < 0 ? "−" : ""}${tot}π/${den} :`, ok: sign < 0 ? `−${bs}` : bs, faux: [sign < 0 ? bs : `−${bs}`, `${tot}π/${den}`.replace(/^/, sign < 0 ? "" : "−"), `${base + den}π/${den}`], e: `On retire des multiples de 2π (= ${2 * den}π/${den}) pour tomber dans ]−π ; π] : ${sign < 0 ? "−" : ""}${bs}.` }; }],
      ["Limites", (r) => { const a = nz(r, -6, 6), b = nz(r, 1, 6), c = ri(r, -6, 6), d = ri(r, -6, 6);
        return { q: `lim quand x → +∞ de (${co(a)}x ${sg(c)}) / (${co(b)}x ${sg(d)}) :`, ok: fr(a, b), faux: ["0", a > 0 ? "+∞" : "−∞", fr(c || 1, d || 2)], e: `On garde les termes de plus haut degré : ${co(a)}x / ${co(b)}x → ${fr(a, b)}.` }; }],
    ],
    "1ere-pc": [
      ["Mouvement de rotation", (r) => { const n = pick(r, [60, 120, 300, 600, 1200, 3000]);
        return { q: `Un moteur tourne à ${n} tr/min. Vitesse angulaire :`, ok: `${nf(2 * Math.PI * n / 60, 1)} rad/s`, faux: [`${nf(n / 60, 1)} rad/s`, `${nf(2 * Math.PI * n, 0)} rad/s`, `${nf(Math.PI * n / 60, 1)} rad/s`], e: `ω = 2π × N avec N = ${n}/60 = ${nf(n / 60, 1)} tr/s : ω ≈ ${nf(2 * Math.PI * n / 60, 1)} rad/s.` }; }],
      ["Mouvement de rotation", (r) => { const w = ri(r, 2, 20), R = ri(r, 1, 9) / 10;
        return { q: `Un point à ${nf(R * 100)} cm de l'axe tourne à ${w} rad/s. Sa vitesse :`, ok: `${nf(w * R, 2)} m/s`, faux: [`${nf(w / R, 1)} m/s`, `${nf(w * R * 100)} m/s`, `${nf(w * R * R, 3)} m/s`], e: `v = R × ω = ${nf(R, 1)} × ${w} = ${nf(w * R, 2)} m/s.` }; }],
      ["Champ et force électriques", (r) => { const q = ri(r, 1, 9), E = ri(r, 1, 9) * 1000;
        return { q: `Une charge de ${q} µC est placée dans un champ de ${E} V/m. Force électrique :`, ok: `${sci(q * 1e-6 * E)} N`, faux: [`${sci(q * E)} N`, `${sci(E / (q * 1e-6))} N`, `${sci(q * 1e-3 * E)} N`], e: `F = |q| × E = ${q} × 10⁻⁶ × ${E} = ${sci(q * 1e-6 * E)} N.` }; }],
      ["Électrocinétique : générateurs et effet Joule", (r) => { const E = pick(r, [4.5, 6, 9, 12]), rr = pick(r, [0.5, 1, 1.5, 2]), I = pick(r, [0.5, 1, 1.5, 2]);
        return { q: `Générateur E = ${nf(E, 1)} V, r = ${nf(rr, 1)} Ω, débitant ${nf(I, 1)} A. Tension à ses bornes :`, ok: `${nf(E - rr * I, 2)} V`, faux: [`${nf(E + rr * I, 2)} V`, `${nf(E, 1)} V`, `${nf(rr * I, 2)} V`], e: `U = E − rI = ${nf(E, 1)} − ${nf(rr, 1)} × ${nf(I, 1)} = ${nf(E - rr * I, 2)} V.` }; }],
      ["Électrocinétique : générateurs et effet Joule", (r) => { const R = ri(r, 5, 100), I = ri(r, 1, 5) / 2, t = ri(r, 1, 10) * 60;
        return { q: `Énergie dissipée par effet Joule dans ${R} Ω parcourue par ${nf(I, 1)} A pendant ${t / 60} min :`, ok: `${nf(R * I * I * t)} J`, faux: [`${nf(R * I * t)} J`, `${nf(R * I * I * t / 60)} J`, `${nf(R * I * I)} J`], e: `W = R I² t = ${R} × ${nf(I * I, 2)} × ${t} = ${nf(R * I * I * t)} J.` }; }],
      ["Chimie organique : hydrocarbures et polymères", (r) => { const n = ri(r, 1, 8), names = ["méthane", "éthane", "propane", "butane", "pentane", "hexane", "heptane", "octane"];
        return { q: `Formule brute ${/^[aeéiouh]/.test(names[n - 1]) ? "de l'" : "du "}${names[n - 1]} :`, ok: `C${n > 1 ? sub(n) : ""}H${sub(2 * n + 2)}`, faux: [`C${n > 1 ? sub(n) : ""}H${sub(2 * n)}`, `C${n > 1 ? sub(n) : ""}H${sub(2 * n - 2 || 4)}`, `C${sub(n + 1)}H${sub(2 * n + 2)}`], e: `Alcane : CₙH₂ₙ₊₂ avec n = ${n}.` }; }],
      ["Alcools et acides carboxyliques", (r) => { const [nm, f, cl] = pick(r, [["propan-1-ol", "CH₃–CH₂–CH₂OH", "primaire"], ["propan-2-ol", "CH₃–CHOH–CH₃", "secondaire"], ["2-méthylpropan-2-ol", "(CH₃)₃C–OH", "tertiaire"], ["éthanol", "CH₃–CH₂OH", "primaire"], ["butan-2-ol", "CH₃–CHOH–CH₂–CH₃", "secondaire"]]);
        return { q: `Classe de l'alcool ${nm} (${f}) :`, ok: cl, faux: ["primaire", "secondaire", "tertiaire", "phénol"].filter((x) => x !== cl), e: `On compte les carbones liés au carbone qui porte –OH : primaire (1), secondaire (2), tertiaire (3).` }; }],
      ["Oxydoréduction", (r) => { const [ox, red] = pick(r, [["Cu²⁺", "Cu"], ["Fe²⁺", "Fe"], ["Zn²⁺", "Zn"], ["Ag⁺", "Ag"], ["Al³⁺", "Al"]]);
        return { q: `Dans le couple ${ox}/${red}, l'oxydant est :`, ok: ox, faux: [red, "les électrons", "H₂O"], e: `Un oxydant capte des électrons : ${ox} + ne⁻ → ${red}.` }; }],
      ["Calorimétrie", (r) => { const mm = ri(r, 1, 5) / 2, dT = ri(r, 5, 60);
        return { q: `Chaleur pour chauffer ${nf(mm, 1)} kg d'eau de ${dT} °C (c = 4180 J/kg/°C) :`, ok: `${nf(mm * 4180 * dT)} J`, faux: [`${nf(4180 * dT)} J`, `${nf(mm * 4180)} J`, `${nf(mm * 4180 * dT / 1000)} J`], e: `Q = m c ΔT = ${nf(mm, 1)} × 4180 × ${dT} = ${nf(mm * 4180 * dT)} J.` }; }],
      ["Condensateurs", (r) => { const Cc = ri(r, 1, 50), U = ri(r, 2, 24);
        return { q: `Condensateur de ${Cc} µF chargé sous ${U} V. Charge Q :`, ok: `${sci(Cc * 1e-6 * U)} C`, faux: [`${sci(Cc * U)} C`, `${sci(Cc * 1e-6 / U)} C`, `${sci(Cc * 1e-3 * U)} C`], e: `Q = C × U = ${Cc} × 10⁻⁶ × ${U} = ${sci(Cc * 1e-6 * U)} C.` }; }],
      ["Amplificateur opérationnel", (r) => { const R1 = pick(r, [2, 5, 10]), R2 = pick(r, [10, 20, 47]), ue = ri(r, 1, 3) / 10;
        return { q: `Montage inverseur : R₁ = ${R1} kΩ, R₂ = ${R2} kΩ, uₑ = ${nf(ue, 1)} V. Tension de sortie :`, ok: `${nf(-R2 / R1 * ue, 2)} V`, faux: [`${nf(R2 / R1 * ue, 2)} V`, `${nf(-R1 / R2 * ue, 3)} V`, `${nf((1 + R2 / R1) * ue, 2)} V`], e: `Inverseur : uₛ = −(R₂/R₁) uₑ = −${nf(R2 / R1, 1)} × ${nf(ue, 1)} = ${nf(-R2 / R1 * ue, 2)} V.` }; }],
      ["Piles, électrolyse et dosages d'oxydoréduction", (r) => { const [p, E1, n1, E2, n2] = pick(r, [["Daniell (Zn/Cu)", -0.76, "Zn", 0.34, "Cu"], ["Fe/Cu", -0.44, "Fe", 0.34, "Cu"], ["Zn/Ag", -0.76, "Zn", 0.8, "Ag"], ["Cu/Ag", 0.34, "Cu", 0.8, "Ag"]]);
        return { q: `Pile ${p} : E°(${n1}) = ${nf(E1)} V, E°(${n2}) = ${nf(E2)} V. Force électromotrice :`, ok: `${nf(E2 - E1)} V`, faux: [`${nf(E1 + E2)} V`, `${nf(E1 - E2)} V`, `${nf(E2)} V`], e: `e = E°(pôle +) − E°(pôle −) = ${nf(E2)} − (${nf(E1)}) = ${nf(E2 - E1)} V.` }; }],
      ["Travail, énergie et puissance", (r) => { const mm = ri(r, 1, 20), v = ri(r, 2, 15);
        return { q: `Énergie cinétique d'un corps de ${mm} kg à ${v} m/s :`, ok: `${nf(mm * v * v / 2)} J`, faux: [`${mm * v * v} J`, `${nf(mm * v / 2)} J`, `${mm * v} J`], e: `Ec = ½ m v² = 0,5 × ${mm} × ${v * v} = ${nf(mm * v * v / 2)} J.` }; }],
    ],
  };
  for (const [sid, list] of Object.entries(PLUS2)) (GEN[sid] = GEN[sid] || []).push(...list);

  // Garde-fou commun : on retire tant que le tirage est dégénéré, puis on complète
  // les distracteurs en double en décalant le nombre de la bonne réponse.
  const bad = (g) => !g || !g.q || g.ok == null || /NaN|undefined|Infinity/.test(JSON.stringify(g));
  const shift = (ok, k) => {
    const mt = String(ok).match(/[−-]?\d+(?:[ ,.]\d+)*/);
    if (!mt) return null;
    const raw = mt[0], neg = /^[−-]/.test(raw), dec = raw.includes(",");
    const v = (neg ? -1 : 1) * Number(raw.replace(/^[−-]/, "").replace(/ /g, "").replace(",", "."));
    const d = [1, -1, 2, -2, 10, 3][k % 6] * (dec ? (raw.split(",")[1].length > 1 ? 0.01 : 0.1) : 1);
    const nv = Number((v + d).toFixed(dec ? raw.split(",")[1].length : 0));
    return String(ok).replace(raw, nv.toLocaleString("fr-FR", { maximumFractionDigits: 6 }).replace("-", "−"));
  };
  const fix = (g) => {
    const seen = new Set([String(g.ok)]), faux = [];
    for (const f of g.faux || []) if (f != null && !seen.has(String(f)) && faux.length < 3) { seen.add(String(f)); faux.push(String(f)); }
    for (let k = 0; faux.length < 3 && k < 12; k++) { const f = shift(g.ok, k); if (f && !seen.has(f)) { seen.add(f); faux.push(f); } }
    return faux.length === 3 ? { ...g, ok: String(g.ok), faux } : null;
  };
  const clean = (g) => { const c = (t) => String(t).replace(/(\d+)\.(\d{5,})/g, (x) => Number(Number(x).toFixed(2)).toLocaleString("fr-FR")); return { ...g, q: c(g.q), ok: c(g.ok), faux: g.faux.map(c), e: c(g.e) }; };
  for (const list of Object.values(GEN)) list.forEach((item) => {
    const f = item[1];
    item[1] = (r) => { let g = null; for (let i = 0; i < 12; i++) { try { g = f(r); } catch (e) { g = null; } if (bad(g)) continue; g = clean(g); const a = [g.ok, ...g.faux].map(String); if (a.length === 4 && new Set(a).size === 4) return g; } return bad(g) ? null : fix(clean(g)); };
  });
  globalThis.GH = { nf, sci, ri, pick, nz, m, sg, par, co, gcd, fr, sup, sub, C, TRIPLES, fix, clean };
})();
