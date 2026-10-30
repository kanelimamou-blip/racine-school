"use strict";
// Exercices à plusieurs étapes sur un même énoncé, avec des nombres nouveaux à chaque tirage.
// Chaque modèle rend { context, steps } ; les points de ses étapes font 5, donc 4 exercices donnent un sujet sur 20.
// Les sujets types générés (BFEM, BAC, devoirs) assemblent 4 exercices de chapitres différents.

const EXGEN = {};
(() => {
  const { nf, sci, ri, pick, nz, m, sg, par, co, gcd, fr, C, TRIPLES } = GH;
  const S = (q, ok, faux, e, pts = 1) => ({ q, ok: String(ok), faux: faux.map(String), e, pts });
  const add = (sid, t, make) => (EXGEN[sid] = EXGEN[sid] || []).push({ t, make });

  // ---------- 6e
  add("6e-maths", "Achats au marché", (r) => { const p1 = ri(r, 3, 9) * 50, n1 = ri(r, 2, 6), p2 = ri(r, 2, 8) * 25, n2 = ri(r, 2, 5), T = p1 * n1 + p2 * n2, B = Math.ceil(T / 1000) * 1000 + pick(r, [0, 1000]);
    return { context: `Awa achète ${n1} kg de riz à ${p1} F le kg et ${n2} boîtes de lait à ${p2} F la boîte. Elle paie avec ${B} F.`, steps: [
      S("Prix du riz :", `${p1 * n1} F`, [`${p1 + n1} F`, `${p1 * (n1 + 1)} F`, `${p1} F`], `${n1} × ${p1} = ${p1 * n1} F.`, 1.5),
      S("Prix du lait :", `${p2 * n2} F`, [`${p2 + n2} F`, `${p2 * (n2 - 1)} F`, `${p2 * n2 * 2} F`], `${n2} × ${p2} = ${p2 * n2} F.`, 1.5),
      S("Montant total :", `${T} F`, [`${T + 100} F`, `${p1 + p2} F`, `${T - p2} F`], `${p1 * n1} + ${p2 * n2} = ${T} F.`, 1),
      S("Monnaie rendue :", `${B - T} F`, [`${B - T + 100} F`, `${B + T} F`, `${T} F`], `${B} − ${T} = ${B - T} F.`, 1)] }; });
  add("6e-maths", "Le terrain rectangulaire", (r) => { const L = ri(r, 12, 40), l = ri(r, 5, L - 2), pq = ri(r, 2, 6) * 100;
    return { context: `Un terrain rectangulaire mesure ${L} m de long et ${l} m de large. On veut le clôturer ; le mètre de grillage coûte ${pq} F.`, steps: [
      S("Périmètre du terrain :", `${2 * (L + l)} m`, [`${L + l} m`, `${L * l} m`, `${4 * L} m`], `P = 2 × (L + l) = 2 × (${L} + ${l}) = ${2 * (L + l)} m.`, 1.5),
      S("Aire du terrain :", `${L * l} m²`, [`${2 * (L + l)} m²`, `${L + l} m²`, `${L * l * 2} m²`], `A = L × l = ${L} × ${l} = ${L * l} m².`, 1.5),
      S("Prix du grillage :", `${2 * (L + l) * pq} F`, [`${L * l * pq} F`, `${(L + l) * pq} F`, `${2 * (L + l) + pq} F`], `${2 * (L + l)} m × ${pq} F = ${2 * (L + l) * pq} F.`, 2)] }; });
  add("6e-maths", "Fractions d'une somme", (r) => { const d = pick(r, [4, 5, 8, 10]), n = ri(r, 1, d - 2), T = d * ri(r, 2, 9) * 100, a = (T * n) / d;
    return { context: `Moussa a ${T} F. Il dépense les ${n}/${d} de cette somme pour des fournitures.`, steps: [
      S(`Combien vaut 1/${d} de ${T} F ?`, `${T / d} F`, [`${T * d} F`, `${T - d} F`, `${T / 2} F`], `${T} ÷ ${d} = ${T / d} F.`, 1.5),
      S("Combien dépense-t-il ?", `${a} F`, [`${T / d} F`, `${T - a} F`, `${a + T / d} F`], `${n} × ${T / d} = ${a} F.`, 2),
      S("Combien lui reste-t-il ?", `${T - a} F`, [`${a} F`, `${T} F`, `${T - a + T / d} F`], `${T} − ${a} = ${T - a} F, soit les ${d - n}/${d}.`, 1.5)] }; });

  // ---------- 5e
  add("5e-maths", "Températures relevées", (r) => { const t = Array.from({ length: 4 }, () => ri(r, -9, 12)), mn = Math.min(...t), mx = Math.max(...t), s = t.reduce((a, b) => a + b, 0);
    return { context: `On relève la température d'une chambre froide du port de Dakar à quatre moments de la journée : ${t.map(m).join(" °C ; ")} °C.`, steps: [
      S("Température la plus basse :", `${m(mn)} °C`, [`${m(mx)} °C`, `${m(-mn)} °C`, `${m(t[0])} °C`], `On compare les relatifs : ${m(mn)} est le plus petit.`, 1),
      S("Écart entre la plus haute et la plus basse :", `${mx - mn} °C`, [`${mx + mn} °C`, `${Math.abs(mx) - Math.abs(mn)} °C`, `${mx} °C`], `${m(mx)} − ${par(mn)} = ${mx - mn} °C.`, 2),
      S("Somme des quatre relevés :", `${m(s)} °C`, [`${m(s + 2)} °C`, `${m(-s)} °C`, `${t.reduce((a, b) => a + Math.abs(b), 0)} °C`], `${t.map(par).join(" + ")} = ${m(s)}.`, 2)] }; });
  add("5e-maths", "Soldes et pourcentages", (r) => { const P = ri(r, 4, 30) * 500, p = pick(r, [10, 20, 25, 30, 40]), R = (P * p) / 100;
    return { context: `Une paire de chaussures coûte ${P} F. Le commerçant fait une remise de ${p} %.`, steps: [
      S("Montant de la remise :", `${R} F`, [`${p} F`, `${P - R} F`, `${R * 2} F`], `${p} % de ${P} = ${P} × ${p} ÷ 100 = ${R} F.`, 2),
      S("Prix après remise :", `${P - R} F`, [`${P + R} F`, `${R} F`, `${P - p} F`], `${P} − ${R} = ${P - R} F.`, 2),
      S("Quel pourcentage du prix initial paie-t-on ?", `${100 - p} %`, [`${p} %`, `${100 + p} %`, `${100 - 2 * p} %`], `On paie 100 % − ${p} % = ${100 - p} % du prix.`, 1)] }; });
  add("5e-maths", "Le triangle et ses angles", (r) => { const a = ri(r, 30, 80), b = ri(r, 30, 150 - a), c = 180 - a - b;
    return { context: `ABC est un triangle avec Â = ${a}° et B̂ = ${b}°.`, steps: [
      S("Mesure de Ĉ :", `${c}°`, [`${360 - a - b}°`, `${a + b}°`, `${c + 10}°`], `180 − ${a} − ${b} = ${c}°.`, 2),
      S("Angle extérieur en C (supplémentaire de Ĉ) :", `${180 - c}°`, [`${c}°`, `${90 - c / 2}°`, `${360 - c}°`], `180 − ${c} = ${180 - c}°, égal aussi à Â + B̂.`, 1.5),
      S("Le triangle est-il rectangle ?", a === 90 || b === 90 || c === 90 ? "Oui" : "Non", ["Oui", "Non", "On ne peut pas savoir", "Seulement s'il est isocèle"].filter((x) => x !== (a === 90 || b === 90 || c === 90 ? "Oui" : "Non")), `Il faudrait un angle de 90° ; ici les angles sont ${a}°, ${b}° et ${c}°.`, 1.5)] }; });

  // ---------- 4e
  add("4e-maths", "Pythagore sur une échelle", (r) => { const [a, b, c] = pick(r, TRIPLES), k = pick(r, [1, 2]);
    return { context: `Une échelle de ${c * k} dm est posée contre un mur vertical. Son pied est à ${a * k} dm du mur, sur un sol horizontal.`, steps: [
      S("Le triangle formé est rectangle :", "au pied du mur", ["au pied de l'échelle", "en haut de l'échelle", "il ne l'est pas"], "Le mur est perpendiculaire au sol : l'angle droit est au pied du mur.", 1),
      S("Quelle égalité utiliser ?", `h² = ${c * k}² − ${a * k}²`, [`h² = ${c * k}² + ${a * k}²`, `h = ${c * k} − ${a * k}`, `h² = ${a * k}² − ${c * k}²`], "L'échelle est l'hypoténuse : h² + pied² = échelle².", 2),
      S("Hauteur atteinte sur le mur :", `${b * k} dm`, [`${(c - a) * k} dm`, `${(c + a) * k} dm`, `${(b + 1) * k} dm`], `h² = ${(c * k) ** 2} − ${(a * k) ** 2} = ${(b * k) ** 2}, donc h = ${b * k} dm.`, 2)] }; });
  add("4e-maths", "Équation d'un problème", (r) => { const x = ri(r, 5, 20), d = ri(r, 2, 9);
    return { context: `Fatou a ${d} ans de plus que son frère. La somme de leurs âges est ${2 * x + d} ans. On note x l'âge du frère.`, steps: [
      S("Équation du problème :", `x + (x + ${d}) = ${2 * x + d}`, [`x + ${d} = ${2 * x + d}`, `2x = ${2 * x + d}`, `x × ${d} = ${2 * x + d}`], `Âge de Fatou : x + ${d}. On additionne les deux âges.`, 2),
      S("Âge du frère :", `${x} ans`, [`${x + d} ans`, `${2 * x} ans`, `${x - d} ans`], `2x + ${d} = ${2 * x + d}, donc 2x = ${2 * x}, x = ${x}.`, 2),
      S("Âge de Fatou :", `${x + d} ans`, [`${x} ans`, `${x + 2 * d} ans`, `${2 * x + d} ans`], `${x} + ${d} = ${x + d} ans.`, 1)] }; });
  add("4e-maths", "Vitesse moyenne d'un trajet", (r) => { const v = ri(r, 4, 9) * 10, t = pick(r, [1.5, 2, 2.5, 3]), d = v * t;
    return { context: `Un car Dakar–Touba roule à la vitesse moyenne de ${v} km/h pendant ${nf(t, 1)} h.`, steps: [
      S("Distance parcourue :", `${nf(d)} km`, [`${nf(v / t, 1)} km`, `${nf(v + t, 1)} km`, `${nf(d * 2)} km`], `d = v × t = ${v} × ${nf(t, 1)} = ${nf(d)} km.`, 2),
      S(`Durée en heures et minutes :`, `${Math.floor(t)} h ${Math.round((t % 1) * 60)} min`.replace(" 0 min", ""), [`${Math.floor(t)} h ${Math.round((t % 1) * 100)} min`, `${Math.floor(t) + 1} h`, `${t * 60} h`], `${nf(t, 1)} h = ${Math.floor(t)} h + ${nf(t % 1, 1)} × 60 min.`, 1.5),
      S("Vitesse en m/s (arrondie au dixième) :", `${nf(v / 3.6, 1)} m/s`, [`${nf(v * 3.6, 1)} m/s`, `${v} m/s`, `${nf(v / 60, 1)} m/s`], `On divise par 3,6 : ${v} ÷ 3,6 ≈ ${nf(v / 3.6, 1)} m/s.`, 1.5)] }; });
  add("4e-pc", "Masse volumique d'un objet", (r) => { const [mat, rho] = pick(r, [["aluminium", 2.7], ["fer", 7.8], ["cuivre", 8.9], ["bois de chêne", 0.8]]), V0 = ri(r, 5, 12) * 10, dV = ri(r, 2, 8) * 5, M = rho * dV;
    return { context: `Une éprouvette contient ${V0} mL d'eau. On y plonge un objet en ${mat} de masse ${nf(M, 1)} g ; le niveau monte à ${V0 + dV} mL.`, steps: [
      S("Volume de l'objet :", `${dV} cm³`, [`${V0 + dV} cm³`, `${V0} cm³`, `${dV * 2} cm³`], `V = ${V0 + dV} − ${V0} = ${dV} mL = ${dV} cm³.`, 1.5),
      S("Masse volumique :", `${nf(rho, 1)} g/cm³`, [`${nf(dV / M, 2)} g/cm³`, `${nf(M * dV)} g/cm³`, `${nf(rho * 10, 1)} g/cm³`], `ρ = m ÷ V = ${nf(M, 1)} ÷ ${dV} = ${nf(rho, 1)} g/cm³.`, 2),
      S("Dans l'eau (1 g/cm³), cet objet :", rho > 1 ? "coule" : "flotte", ["coule", "flotte", "se dissout", "reste entre deux eaux"].filter((x) => x !== (rho > 1 ? "coule" : "flotte")), `Il ${rho > 1 ? "coule" : "flotte"} car sa masse volumique est ${rho > 1 ? "supérieure" : "inférieure"} à celle de l'eau.`, 1.5)] }; });
  add("4e-pc", "Circuit en série et en dérivation", (r) => { const I1 = ri(r, 1, 9) / 10, I2 = ri(r, 1, 9) / 10, U = pick(r, [4.5, 6, 9, 12]);
    return { context: `Un générateur de ${nf(U, 1)} V alimente deux lampes L₁ et L₂ montées en dérivation. L₁ est traversée par ${nf(I1, 1)} A et L₂ par ${nf(I2, 1)} A.`, steps: [
      S("Tension aux bornes de L₁ :", `${nf(U, 1)} V`, [`${nf(U / 2, 2)} V`, `0 V`, `${nf(U * 2, 1)} V`], "En dérivation, chaque branche a la même tension que le générateur.", 1.5),
      S("Intensité dans la branche principale :", `${nf(I1 + I2, 1)} A`, [`${nf(Math.abs(I1 - I2), 1)} A`, `${nf(I1 * I2, 2)} A`, `${nf(Math.max(I1, I2), 1)} A`], `Loi des nœuds : I = I₁ + I₂ = ${nf(I1 + I2, 1)} A.`, 2),
      S("Si L₁ grille, L₂ :", "reste allumée", ["s'éteint", "brille deux fois moins", "grille aussi"], "En dérivation, chaque lampe a sa propre boucle.", 1.5)] }; });

  // ---------- 3e (BFEM)
  add("3e-maths", "Théorème de Thalès", (r) => { const k = pick(r, [2, 3, 4, 5]), am = ri(r, 2, 6), an = ri(r, 2, 6), mn = ri(r, 2, 7);
    return { context: `Dans le triangle ABC, M ∈ [AB] et N ∈ [AC] avec (MN) // (BC). AM = ${am} cm, AN = ${an} cm, MN = ${mn} cm et AB = ${am * k} cm.`, steps: [
      S("Rapport de réduction AM/AB :", `1/${k}`, [`${k}`, `${am}/${am + k}`, `1/${k + 1}`], `AM/AB = ${am}/${am * k} = 1/${k}.`, 1),
      S("Longueur AC :", `${an * k} cm`, [`${an + am * k - am} cm`, `${an * k + 1} cm`, `${nf(an / k, 2)} cm`], `AN/AC = 1/${k}, donc AC = ${k} × ${an} = ${an * k} cm.`, 1.5),
      S("Longueur BC :", `${mn * k} cm`, [`${mn + am * k - am} cm`, `${mn * k + k} cm`, `${nf(mn / k, 2)} cm`], `MN/BC = 1/${k}, donc BC = ${k} × ${mn} = ${mn * k} cm.`, 1.5),
      S("Longueur MB :", `${am * k - am} cm`, [`${am * k} cm`, `${am} cm`, `${am * k + am} cm`], `MB = AB − AM = ${am * k} − ${am} = ${am * k - am} cm.`, 1)] }; });
  add("3e-maths", "Pythagore et réciproque", (r) => { const [a, b, c] = pick(r, TRIPLES), k = ri(r, 1, 3), d = pick(r, [0, 1]);
    const C2 = c * k + d;
    return { context: `On considère le triangle EFG avec EF = ${a * k} cm, FG = ${b * k} cm et EG = ${C2} cm.`, steps: [
      S("Le plus grand côté est :", "[EG]", ["[EF]", "[FG]", "tous égaux"], `${C2} cm est la plus grande longueur.`, 1),
      S("EF² + FG² vaut :", String((a * a + b * b) * k * k), [String((a + b) * k * ((a + b) * k)), String(C2 * C2 + 1), String((a * a + b * b) * k)], `${(a * k) ** 2} + ${(b * k) ** 2} = ${(a * a + b * b) * k * k}.`, 1.5),
      S("EG² vaut :", String(C2 * C2), [String(2 * C2), String(C2 * C2 + C2), String((C2 - 1) ** 2)], `${C2}² = ${C2 * C2}.`, 1),
      S("Conclusion :", d ? "EFG n'est pas rectangle" : "EFG est rectangle en F", d ? ["EFG est rectangle en F", "EFG est rectangle en E", "EFG est isocèle"] : ["EFG n'est pas rectangle", "EFG est rectangle en E", "EFG est rectangle en G"], d ? "EF² + FG² ≠ EG² : d'après la contraposée de Pythagore, il n'est pas rectangle." : "EF² + FG² = EG² : d'après la réciproque de Pythagore, il est rectangle en F, sommet opposé à [EG].", 1.5)] }; });
  add("3e-maths", "Deux tarifs : application affine", (r) => { const a = ri(r, 2, 6) * 100, F = ri(r, 2, 8) * 1000, b = a + ri(r, 1, 4) * 100, n0 = F / (b - a);
    const ok0 = Number.isInteger(n0); const x = ri(r, 3, 15);
    return { context: `Un cybercafé propose : tarif A, ${b} F l'heure ; tarif B, abonnement de ${F} F plus ${a} F l'heure. x est le nombre d'heures.`, steps: [
      S("Prix au tarif A pour x heures :", `${b}x`, [`${a}x + ${F}`, `${b} + x`, `${F}x`], `On paie ${b} F par heure : f(x) = ${b}x (application linéaire).`, 1),
      S("Prix au tarif B pour x heures :", `${a}x + ${F}`, [`${b}x`, `${F}x + ${a}`, `${a + F}x`], `Abonnement fixe ${F} F plus ${a} F par heure : g(x) = ${a}x + ${F} (application affine).`, 1),
      S(`Prix au tarif B pour ${x} heures :`, `${a * x + F} F`, [`${b * x} F`, `${a * x} F`, `${(a + F) * x} F`], `g(${x}) = ${a} × ${x} + ${F} = ${a * x + F} F.`, 1.5),
      S("Les deux tarifs sont égaux pour x =", ok0 ? `${n0} h` : `${nf(n0, 1)} h`, [`${nf(F / a, 1)} h`, `${nf(F / b, 1)} h`, `${nf(n0 + 2, 1)} h`], `${b}x = ${a}x + ${F} ⇔ ${b - a}x = ${F} ⇔ x = ${nf(n0, 2)}.`, 1.5)] }; });
  add("3e-maths", "Système : un problème d'achats", (r) => { const x = ri(r, 2, 9) * 50, y = ri(r, 2, 9) * 50, a = ri(r, 1, 4), b = ri(r, 1, 4), c = ri(r, 1, 4), d = ri(r, 1, 4);
    if (a * d === b * c || a === b) return null;
    const pl = (n, w) => `${n} ${w}${n > 1 ? "s" : ""}`;
    return { context: `${pl(a, "cahier")} et ${pl(b, "stylo")} coûtent ${a * x + b * y} F ; ${pl(c, "cahier")} et ${pl(d, "stylo")} coûtent ${c * x + d * y} F. On note x le prix d'un cahier, y celui d'un stylo.`, steps: [
      S("Système qui traduit l'énoncé :", `${co(a)}x + ${co(b)}y = ${a * x + b * y} et ${co(c)}x + ${co(d)}y = ${c * x + d * y}`, [`${co(a)}x + ${co(c)}y = ${a * x + b * y} et ${co(b)}x + ${co(d)}y = ${c * x + d * y}`, `x + y = ${a * x + b * y} et x − y = ${c * x + d * y}`, `${co(a)}x × ${co(b)}y = ${a * x + b * y} et ${co(c)}x × ${co(d)}y = ${c * x + d * y}`], "Chaque phrase donne une équation : nombre × prix, puis on additionne.", 1.5),
      S("Prix d'un cahier :", `${x} F`, [`${y} F`, `${x + 50} F`, `${x + y} F`], `Par combinaison ou substitution, on trouve x = ${x}.`, 1.5),
      S("Prix d'un stylo :", `${y} F`, [`${x} F`, `${y + 50} F`, `${Math.abs(x - y) || 25} F`], `En remplaçant x par ${x} : y = ${y}.`, 1),
      S("Vérification de la 1re équation :", `${a} × ${x} + ${b} × ${y} = ${a * x + b * y}`, [`${a} × ${y} + ${b} × ${x} = ${a * x + b * y}`, `${a} + ${x} + ${b} + ${y} = ${a * x + b * y}`, `${a} × ${x} = ${a * x + b * y}`], "On remplace x et y dans l'équation de départ.", 1)] }; });
  add("3e-maths", "Racines carrées", (r) => { const p = pick(r, [2, 3, 5]), a = ri(r, 2, 5), b = ri(r, 2, 4), c = ri(r, 1, 3);
    return { context: `On donne A = √${a * a * p} + √${b * b * p} − √${c * c * p} et B = (√${p} + 1)².`, steps: [
      S(`Écris √${a * a * p} sous la forme k√${p} :`, `${a}√${p}`, [`${p}√${a}`, `${a * a}√${p}`, `${a * p}`], `${a * a * p} = ${a * a} × ${p}, donc √${a * a * p} = ${a}√${p}.`, 1),
      S("A s'écrit :", `${a + b - c}√${p}`, [`${a + b + c}√${p}`, `${a * b * c}√${p}`, `${a + b - c}√${3 * p}`], `A = ${a}√${p} + ${b}√${p} − ${c}√${p} = ${a + b - c}√${p}.`, 1.5),
      S("B développé :", `${p + 1} + 2√${p}`, [`${p + 1}`, `${p} + 1 + √${p}`, `${p + 1} − 2√${p}`], `(a + b)² = a² + 2ab + b² : ${p} + 2√${p} + 1.`, 1.5),
      S(`A² vaut :`, String((a + b - c) ** 2 * p), [String((a + b - c) * p), String((a + b - c) ** 2), String((a + b - c) ** 2 * p * 2)], `(${a + b - c}√${p})² = ${(a + b - c) ** 2} × ${p}.`, 1)] }; });
  add("3e-maths", "Statistiques d'une classe", (r) => { const notes = Array.from({ length: 7 }, () => ri(r, 4, 18)), s = [...notes].sort((a, b) => a - b), tot = notes.reduce((a, b) => a + b, 0);
    return { context: `Notes de 7 élèves en devoir : ${notes.join(" ; ")}.`, steps: [
      S("Moyenne (au dixième) :", nf(tot / 7, 1), [nf(tot / 6, 1), String(s[3]), nf((s[0] + s[6]) / 2, 1)], `Somme = ${tot}, et ${tot} ÷ 7 ≈ ${nf(tot / 7, 1)}.`, 1.5),
      S("Médiane :", String(s[3]), [nf(tot / 7, 1), String(notes[3] === s[3] ? s[2] : notes[3]), String(s[4] === s[3] ? s[5] : s[4])], `Notes rangées : ${s.join(" ; ")}. La 4e valeur est ${s[3]}.`, 1.5),
      S("Étendue :", String(s[6] - s[0]), [String(s[6]), String(s[6] + s[0]), String(s[5] - s[1])], `${s[6]} − ${s[0]} = ${s[6] - s[0]}.`, 1),
      S("Pourcentage d'élèves ayant au moins 10 (à l'unité) :", `${Math.round((notes.filter((x) => x >= 10).length / 7) * 100)} %`, [`${notes.filter((x) => x >= 10).length} %`, `${Math.round((notes.filter((x) => x < 10).length / 7) * 100)} %`, `${Math.round((notes.filter((x) => x >= 10).length / 7) * 100) + 10} %`], `${notes.filter((x) => x >= 10).length} élèves sur 7.`, 1)] }; });
  add("3e-maths", "Cône et réduction", (r) => { const R = ri(r, 2, 6), h = ri(r, 2, 6) * 3, k = pick(r, [2, 3]), V = (R * R * h) / 3;
    return { context: `Un cône de révolution a pour rayon de base ${R} cm et pour hauteur ${h} cm. On le coupe par un plan parallèle à la base au ${k === 2 ? "milieu" : "tiers"} de la hauteur en partant du sommet.`, steps: [
      S("Volume exact du cône :", `${V}π cm³`, [`${R * R * h}π cm³`, `${2 * V}π cm³`, `${R * h}π cm³`], `V = πR²h/3 = π × ${R * R} × ${h} ÷ 3 = ${V}π cm³.`, 1.5),
      S("Coefficient de réduction :", `1/${k}`, [`${k}`, `1/${k * k}`, `1/${k ** 3}`], `Le petit cône a une hauteur ${h / k} cm sur ${h} cm.`, 1),
      S("Volume du petit cône :", `${fr(V, k ** 3)}π cm³`, [`${fr(V, k)}π cm³`, `${fr(V, k * k)}π cm³`, `${V}π cm³`], `Les volumes sont multipliés par k³ = 1/${k ** 3}.`, 1.5),
      S("Rayon du petit cône :", `${nf(R / k, 2)} cm`, [`${R} cm`, `${nf(R / (k * k), 2)} cm`, `${R * k} cm`], `Les longueurs sont multipliées par 1/${k}.`, 1)] }; });
  add("3e-maths", "Trigonométrie dans un triangle rectangle", (r) => { const [a, b, c] = pick(r, TRIPLES), k = ri(r, 1, 3);
    return { context: `RST est rectangle en R avec RS = ${a * k} cm, RT = ${b * k} cm.`, steps: [
      S("ST mesure :", `${c * k} cm`, [`${(a + b) * k} cm`, `${(b - a) * k} cm`, `${(c + 1) * k} cm`], `ST² = ${(a * k) ** 2} + ${(b * k) ** 2} = ${(c * k) ** 2}.`, 1.5),
      S("cos Ŝ =", fr(a, c), [fr(b, c), fr(a, b), fr(c, a)], `cos Ŝ = côté adjacent ÷ hypoténuse = RS/ST.`, 1),
      S("sin Ŝ =", fr(b, c), [fr(a, c), fr(b, a), fr(c, b)], `sin Ŝ = côté opposé ÷ hypoténuse = RT/ST.`, 1),
      S("tan Ŝ =", fr(b, a), [fr(a, b), fr(b, c), fr(c, a)], `tan Ŝ = opposé ÷ adjacent = RT/RS.`, 1.5)] }; });

  add("3e-pc", "Une installation électrique", (r) => { const U = 220, P1 = pick(r, [60, 75, 100]), n = ri(r, 2, 6), P2 = pick(r, [1000, 1500, 2000]), t = ri(r, 2, 6), prix = pick(r, [90, 100, 110]);
    const P = n * P1 + P2, E = (P * t) / 1000;
    return { context: `Une maison alimentée en ${U} V a ${n} lampes de ${P1} W et un fer à repasser de ${P2} W, tous en marche ${t} h par jour. Le kWh coûte ${prix} F.`, steps: [
      S("Puissance totale :", `${P} W`, [`${n * P1} W`, `${P1 + P2} W`, `${P * t} W`], `${n} × ${P1} + ${P2} = ${P} W.`, 1),
      S("Intensité totale (au centième) :", `${nf(P / U, 2)} A`, [`${nf(U / P, 3)} A`, `${nf(P * U)} A`, `${nf(P / U / 10, 3)} A`], `I = P ÷ U = ${P} ÷ ${U} ≈ ${nf(P / U, 2)} A.`, 1.5),
      S("Énergie consommée par jour :", `${nf(E, 2)} kWh`, [`${P * t} kWh`, `${nf(E / 10, 3)} kWh`, `${nf(P / t / 1000, 3)} kWh`], `E = P × t = ${P} W × ${t} h = ${P * t} Wh = ${nf(E, 2)} kWh.`, 1.5),
      S("Coût par jour :", `${nf(E * prix, 0)} F`, [`${nf(E * prix * 10, 0)} F`, `${nf(prix / E, 0)} F`, `${nf(E + prix, 0)} F`], `${nf(E, 2)} × ${prix} ≈ ${nf(E * prix, 0)} F.`, 1)] }; });
  add("3e-pc", "Résistances et loi d'Ohm", (r) => { const R1 = ri(r, 2, 10) * 10, R2 = ri(r, 2, 10) * 10, U = pick(r, [6, 9, 12, 24]), Re = R1 + R2, I = U / Re;
    return { context: `Deux conducteurs ohmiques R₁ = ${R1} Ω et R₂ = ${R2} Ω sont en série aux bornes d'un générateur de ${U} V.`, steps: [
      S("Résistance équivalente :", `${Re} Ω`, [`${nf((R1 * R2) / Re, 1)} Ω`, `${R1 * R2} Ω`, `${Math.abs(R1 - R2) || 5} Ω`], `En série : Re = R₁ + R₂ = ${Re} Ω.`, 1),
      S("Intensité du courant :", `${nf(I, 3)} A`, [`${nf(U * Re)} A`, `${nf(Re / U, 1)} A`, `${nf(U / R1, 3)} A`], `I = U ÷ Re = ${U} ÷ ${Re} ≈ ${nf(I, 3)} A.`, 1.5),
      S("Tension aux bornes de R₁ :", `${nf(R1 * I, 2)} V`, [`${U} V`, `${nf(R2 * I, 2)} V`, `${nf(U / 2, 1)} V`].map((x, i) => (i === 1 && R1 === R2 ? `${nf(R1 * I + 1, 2)} V` : x)), `U₁ = R₁ × I = ${R1} × ${nf(I, 3)} ≈ ${nf(R1 * I, 2)} V.`, 1.5),
      S("Puissance reçue par R₂ :", `${nf(R2 * I * I, 2)} W`, [`${nf(R2 * I, 2)} W`, `${nf(U * U / R2, 2)} W`, `${nf(R2 * I * I * 10, 1)} W`], `P = R × I² = ${R2} × ${nf(I, 3)}² ≈ ${nf(R2 * I * I, 2)} W.`, 1)] }; });
  add("3e-pc", "Le trajet d'un cycliste", (r) => { const t = pick(r, [0.5, 1, 1.5, 2]), d = ri(r, 12, 30) * t, mm = ri(r, 55, 90), g = 10;
    return { context: `Un cycliste de ${mm} kg (avec son vélo) parcourt ${nf(d, 1)} km en ${nf(t, 1)} h sur une route plate. On prend g = 10 N/kg.`, steps: [
      S("Vitesse moyenne en km/h :", `${nf(d / t, 1)} km/h`, [`${nf(d * t, 1)} km/h`, `${nf(t / d, 3)} km/h`, `${nf(d / t / 3.6, 1)} km/h`], `v = d ÷ t = ${nf(d, 1)} ÷ ${nf(t, 1)} = ${nf(d / t, 1)} km/h.`, 1.5),
      S("Vitesse en m/s (au dixième) :", `${nf(d / t / 3.6, 1)} m/s`, [`${nf((d / t) * 3.6, 1)} m/s`, `${nf(d / t, 1)} m/s`, `${nf(d / t / 60, 2)} m/s`], "On divise les km/h par 3,6.", 1.5),
      S("Poids de l'ensemble :", `${mm * g} N`, [`${mm} N`, `${nf(mm / g, 1)} N`, `${mm * g * 10} N`], `P = m × g = ${mm} × 10 = ${mm * g} N.`, 1),
      S("Direction et sens du poids :", "verticale, vers le bas", ["horizontale, vers l'avant", "verticale, vers le haut", "suivant la route"], "Le poids est toujours vertical et orienté vers le centre de la Terre.", 1)] }; });
  add("3e-pc", "Combustion du butane", (r) => { const n = pick(r, [0.1, 0.2, 0.5, 1, 2]), Mb = 58;
    return { context: `On brûle complètement ${nf(n * Mb, 1)} g de butane C₄H₁₀ dans le dioxygène. Équation : 2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O. (C = 12, H = 1, O = 16 g/mol)`, steps: [
      S("Masse molaire du butane :", "58 g/mol", ["14 g/mol", "70 g/mol", "48 g/mol"], "M = 4 × 12 + 10 × 1 = 58 g/mol.", 1),
      S("Quantité de butane brûlée :", `${nf(n, 1)} mol`, [`${nf(n * 2, 1)} mol`, `${nf(Mb / n, 1)} mol`, `${nf(n * Mb, 1)} mol`], `n = m ÷ M = ${nf(n * Mb, 1)} ÷ 58 = ${nf(n, 1)} mol.`, 1.5),
      S("Quantité de CO₂ formée :", `${nf(4 * n, 1)} mol`, [`${nf(8 * n, 1)} mol`, `${nf(n, 1)} mol`, `${nf(2 * n, 1)} mol`], `2 mol de butane donnent 8 mol de CO₂ : n(CO₂) = 4 × ${nf(n, 1)} = ${nf(4 * n, 1)} mol.`, 1.5),
      S("Quantité de O₂ nécessaire :", `${nf(6.5 * n, 2)} mol`, [`${nf(13 * n, 1)} mol`, `${nf(n, 1)} mol`, `${nf(4 * n, 1)} mol`], `n(O₂) = 13/2 × ${nf(n, 1)} = ${nf(6.5 * n, 2)} mol.`, 1)] }; });
  add("3e-pc", "Lentille convergente", (r) => { const f = pick(r, [5, 10, 20, 25]), OA = f * pick(r, [2, 3, 4]), OAp = (OA * f) / (OA - f);
    return { context: `Une lentille convergente a une distance focale de ${f} cm. Un objet est placé à ${OA} cm devant elle.`, steps: [
      S("Vergence :", `${nf(100 / f, 1)} δ`, [`${f} δ`, `${nf(f / 100, 2)} δ`, `${nf(100 / f / 10, 1)} δ`], `C = 1/f = 1 ÷ ${nf(f / 100, 2)} m = ${nf(100 / f, 1)} δ.`, 1.5),
      S("L'objet est placé :", "au-delà du foyer objet", ["entre le foyer et la lentille", "sur le foyer", "contre la lentille"], `${OA} cm > ${f} cm : l'objet est au-delà de F.`, 1),
      S("L'image obtenue est :", "réelle et renversée", ["virtuelle et droite", "réelle et droite", "il n'y a pas d'image"], "Objet au-delà du foyer : l'image se forme derrière la lentille, réelle et renversée, on peut la recueillir sur un écran.", 1.5),
      S("Distance lentille–image (au dixième) :", `${nf(OAp, 1)} cm`, [`${nf(OA - f, 1)} cm`, `${nf(OA + f, 1)} cm`, `${nf(f, 1)} cm`], `1/OA′ = 1/f − 1/OA, donc OA′ = ${nf(OAp, 1)} cm.`, 1)] }; });

  // ---------- 2nde
  add("2nde-maths", "Vecteurs dans un repère", (r) => { const A = [ri(r, -5, 5), ri(r, -5, 5)], B = [ri(r, -5, 5), ri(r, -5, 5)], Cc = [ri(r, -5, 5), ri(r, -5, 5)];
    const AB = [B[0] - A[0], B[1] - A[1]], D = [Cc[0] + AB[0], Cc[1] + AB[1]];
    const pt = (p) => `(${m(p[0])} ; ${m(p[1])})`;
    return { context: `Dans un repère, A${pt(A)}, B${pt(B)} et C${pt(Cc)}. On veut le point D tel que ABDC soit un parallélogramme (vecteur CD = vecteur AB).`, steps: [
      S("Coordonnées du vecteur AB :", pt(AB), [pt([A[0] - B[0], A[1] - B[1]]), pt([A[0] + B[0], A[1] + B[1]]), pt([AB[1], AB[0]])], "AB(xB − xA ; yB − yA).", 1.5),
      S("Coordonnées de D :", pt(D), [pt([Cc[0] - AB[0], Cc[1] - AB[1]]), pt([A[0] + Cc[0], A[1] + Cc[1]]), pt([D[1], D[0]])], `D = C + AB : (${m(Cc[0])} ${sg(AB[0])} ; ${m(Cc[1])} ${sg(AB[1])}).`, 2),
      S("Milieu de [AD] :", `(${nf((A[0] + D[0]) / 2, 1)} ; ${nf((A[1] + D[1]) / 2, 1)})`, [`(${nf((A[0] + B[0]) / 2, 1)} ; ${nf((A[1] + B[1]) / 2, 1)})`, `(${m(A[0] + D[0])} ; ${m(A[1] + D[1])})`, `(${nf((A[1] + D[1]) / 2, 1)} ; ${nf((A[0] + D[0]) / 2, 1)})`], "Les diagonales d'un parallélogramme ont le même milieu : c'est aussi le milieu de [BC].", 1.5)] }; });
  add("2nde-maths", "Inéquation et tableau de signes", (r) => { const a = nz(r, -5, 5), b = nz(r, -5, 5); if (a === b) return null; const lo = Math.min(a, b), hi = Math.max(a, b);
    return { context: `On veut résoudre (x ${sg(-a)})(x ${sg(-b)}) < 0.`, steps: [
      S("Valeurs qui annulent le produit :", `${m(lo)} et ${m(hi)}`, [`${m(-hi)} et ${m(-lo)}`, `${m(a * b)}`, `${m(lo)} seulement`], "Un produit est nul si un facteur est nul.", 1.5),
      S("Signe du produit à l'extérieur des racines :", "positif", ["négatif", "nul", "on ne peut pas savoir"], "Le produit des deux facteurs est un trinôme de coefficient 1 > 0 : positif à l'extérieur des racines.", 1.5),
      S("Ensemble des solutions :", `]${m(lo)} ; ${m(hi)}[`, [`[${m(lo)} ; ${m(hi)}]`, `]−∞ ; ${m(lo)}[ ∪ ]${m(hi)} ; +∞[`, `]${m(-hi)} ; ${m(-lo)}[`], "Le produit est strictement négatif entre les racines, bornes exclues.", 2)] }; });
  add("2nde-maths", "Fonction affine et droite", (r) => { const a = nz(r, -4, 4), b = ri(r, -6, 6), x1 = ri(r, -4, 0), x2 = x1 + ri(r, 1, 4);
    return { context: `f est affine avec f(${m(x1)}) = ${m(a * x1 + b)} et f(${m(x2)}) = ${m(a * x2 + b)}.`, steps: [
      S("Coefficient directeur a :", m(a), [m(-a), fr(x2 - x1, a * (x2 - x1)), m(b)], `a = (${m(a * x2 + b)} − ${par(a * x1 + b)}) / (${m(x2)} − ${par(x1)}) = ${m(a)}.`, 2),
      S("Ordonnée à l'origine b :", m(b), [m(a * x1 + b), m(-b), m(b + a)], `b = f(${m(x1)}) − a × ${par(x1)} = ${m(b)}.`, 1.5),
      S("Sens de variation de f :", a > 0 ? "croissante" : "décroissante", ["croissante", "décroissante", "constante", "ni l'un ni l'autre"].filter((x) => x !== (a > 0 ? "croissante" : "décroissante")), `a = ${m(a)} est ${a > 0 ? "positif" : "négatif"}.`, 1.5)] }; });
  add("2nde-maths", "Pourcentages successifs", (r) => { const P = ri(r, 10, 60) * 1000, t1 = pick(r, [10, 20, 25, 30]), t2 = pick(r, [10, 20, 25]);
    const P1 = (P * (100 + t1)) / 100, P2 = (P1 * (100 - t2)) / 100, g = (P2 / P - 1) * 100;
    return { context: `Un article coûte ${P} F. Son prix augmente de ${t1} %, puis baisse de ${t2} %.`, steps: [
      S("Coefficient multiplicateur de la hausse :", nf(1 + t1 / 100), [nf(t1 / 100), nf(1 - t1 / 100), String(t1)], `Augmenter de ${t1} %, c'est multiplier par 1 + ${t1}/100.`, 1),
      S("Prix après la hausse :", `${nf(P1)} F`, [`${P + t1} F`, `${nf(P * t1 / 100)} F`, `${nf(P * (1 - t1 / 100))} F`], `${P} × ${nf(1 + t1 / 100)} = ${nf(P1)} F.`, 1.5),
      S("Prix final :", `${nf(P2)} F`, [`${nf(P * (1 + (t1 - t2) / 100))} F`, `${nf(P1 - t2)} F`, `${nf(P)} F`], `${nf(P1)} × ${nf(1 - t2 / 100)} = ${nf(P2)} F.`, 1.5),
      S("Évolution globale :", `${g >= 0 ? "+" : "−"}${nf(Math.abs(g), 1)} %`, [`${t1 - t2 >= 0 ? "+" : "−"}${Math.abs(t1 - t2)} %`, `+${t1 + t2} %`, `${g >= 0 ? "−" : "+"}${nf(Math.abs(g), 1)} %`], `Coefficient global ${nf(1 + t1 / 100)} × ${nf(1 - t2 / 100)} = ${nf(P2 / P, 4)}. Les pourcentages ne s'additionnent pas.`, 1)] }; });
  add("2nde-pc", "Préparer une solution", (r) => { const [sol, M] = pick(r, [["chlorure de sodium NaCl", 58.5], ["glucose C₆H₁₂O₆", 180], ["sulfate de cuivre CuSO₄", 159.5], ["hydroxyde de sodium NaOH", 40]]), c = pick(r, [0.05, 0.1, 0.2, 0.5]), V = pick(r, [0.1, 0.2, 0.25, 0.5]);
    return { context: `On veut préparer V = ${nf(V * 1000)} mL d'une solution de ${sol} (M = ${nf(M, 1)} g/mol) de concentration ${nf(c)} mol/L.`, steps: [
      S("Quantité de soluté :", `${nf(c * V, 3)} mol`, [`${nf(c / V, 2)} mol`, `${nf(c * V * 1000)} mol`, `${nf(V / c, 2)} mol`], `n = C × V = ${nf(c)} × ${nf(V)} = ${nf(c * V, 3)} mol.`, 1.5),
      S("Masse à peser :", `${nf(c * V * M, 2)} g`, [`${nf(c * M, 2)} g`, `${nf((c * V) / M, 4)} g`, `${nf(c * V * M * 10, 1)} g`], `m = n × M = ${nf(c * V, 3)} × ${nf(M, 1)} ≈ ${nf(c * V * M, 2)} g.`, 1.5),
      S("Verrerie pour le volume final :", "une fiole jaugée", ["un bécher", "une éprouvette graduée", "un erlenmeyer"], "La fiole jaugée donne un volume précis.", 1),
      S("Si on dilue 10 fois, la concentration devient :", `${nf(c / 10, 3)} mol/L`, [`${nf(c * 10)} mol/L`, `${nf(c, 2)} mol/L`, `${nf(c / 100, 4)} mol/L`], "Diluer 10 fois divise la concentration par 10.", 1)] }; });
  add("2nde-pc", "L'atome et son ion", (r) => { const [s, Z, A, cfg, ion, q] = pick(r, [["Mg", 12, 24, "K² L⁸ M²", "Mg²⁺", 2], ["Na", 11, 23, "K² L⁸ M¹", "Na⁺", 1], ["Al", 13, 27, "K² L⁸ M³", "Al³⁺", 3], ["Cl", 17, 35, "K² L⁸ M⁷", "Cl⁻", -1], ["O", 8, 16, "K² L⁶", "O²⁻", -2], ["S", 16, 32, "K² L⁸ M⁶", "S²⁻", -2]]);
    return { context: `Le noyau de l'atome ${s} a pour nombre de masse A = ${A} et pour numéro atomique Z = ${Z}.`, steps: [
      S("Nombre de neutrons :", String(A - Z), [String(Z), String(A), String(A + Z)], `N = A − Z = ${A - Z}.`, 1),
      S("Nombre d'électrons de l'atome :", String(Z), [String(A - Z), String(A), String(Z + 2)], "L'atome est neutre : autant d'électrons que de protons.", 1),
      S("Structure électronique :", cfg, ["K² L⁸ M²", "K² L⁸ M¹", "K² L⁸ M³", "K² L⁸ M⁷", "K² L⁶", "K² L⁸ M⁶"].filter((x) => x !== cfg).slice(0, 3), "On remplit K (2 max), puis L (8 max), puis M.", 1.5),
      S("Ion formé :", ion, ["Mg²⁺", "Na⁺", "Al³⁺", "Cl⁻", "O²⁻", "S²⁻"].filter((x) => x !== ion).slice(0, 3), `Il ${q > 0 ? `perd ${q}` : `gagne ${-q}`} électron(s) pour avoir une couche externe à 8 (règle de l'octet).`, 1.5)] }; });
  add("2nde-pc", "Mouvement d'un mobile", (r) => { const v = ri(r, 2, 20), t = ri(r, 3, 12), x0 = ri(r, 0, 20);
    return { context: `Un mobile se déplace sur une droite. Sa position est x(t) = ${v}t + ${x0} (x en m, t en s).`, steps: [
      S("Nature du mouvement :", "rectiligne uniforme", ["rectiligne accéléré", "circulaire uniforme", "rectiligne ralenti"], "x(t) est une fonction affine du temps : vitesse constante.", 1.5),
      S("Vitesse du mobile :", `${v} m/s`, [`${x0} m/s`, `${v + x0} m/s`, `${v * 3.6} m/s`], `La vitesse est le coefficient de t : ${v} m/s.`, 1),
      S(`Position à t = ${t} s :`, `${v * t + x0} m`, [`${v * t} m`, `${v + t + x0} m`, `${(v + x0) * t} m`], `x(${t}) = ${v} × ${t} + ${x0} = ${v * t + x0} m.`, 1.5),
      S("Somme des forces appliquées (principe d'inertie) :", "nulle", ["dans le sens du mouvement", "opposée au mouvement", "verticale"], "Mouvement rectiligne uniforme ⇔ les forces se compensent.", 1)] }; });

  // ---------- 1ère
  add("1ere-maths", "Trinôme du second degré", (r) => { const x1 = ri(r, -6, 5), x2 = x1 + ri(r, 1, 6), a = pick(r, [1, -1, 2]), b = -a * (x1 + x2), c = a * x1 * x2, D = b * b - 4 * a * c;
    return { context: `f(x) = ${co(a)}x² ${sg(b)}x ${sg(c)}.`.replace(" + 0x", "").replace(" + 0.", "."), steps: [
      S("Discriminant Δ :", m(D), [m(b * b + 4 * a * c), m(-D), m(b - 4 * a * c)], `Δ = b² − 4ac = ${b * b} − 4 × ${par(a)} × ${par(c)} = ${D}.`, 1.5),
      S("Racines :", `${m(x1)} et ${m(x2)}`, [`${m(-x2)} et ${m(-x1)}`, `${m(x1 * a)} et ${m(x2 + 1)}`, "pas de racine"], `x = (−b ± √Δ)/(2a) = (${m(-b)} ± ${Math.sqrt(D)})/${2 * a}.`, 1.5),
      S("Forme factorisée :", `${co(a)}(x ${sg(-x1)})(x ${sg(-x2)})`, [`${co(a)}(x ${sg(x1)})(x ${sg(x2)})`, `(x ${sg(-x1)})(x ${sg(-x2)})${a === 1 ? " + 1" : ""}`, `${co(-a)}(x ${sg(-x1)})(x ${sg(-x2)})`], "a(x − x₁)(x − x₂).", 1),
      S("f(x) > 0 pour :", a > 0 ? `x < ${m(x1)} ou x > ${m(x2)}` : `${m(x1)} < x < ${m(x2)}`, [a > 0 ? `${m(x1)} < x < ${m(x2)}` : `x < ${m(x1)} ou x > ${m(x2)}`, `x > ${m(x2)} seulement`, "tout x réel"], `Le trinôme a le signe de a = ${m(a)} à l'extérieur des racines.`, 1)] }; });
  add("1ere-maths", "Suite géométrique : une épargne", (r) => { const u0 = ri(r, 2, 10) * 10000, t = pick(r, [2, 3, 4, 5]), n = ri(r, 3, 8), q = 1 + t / 100;
    return { context: `Un élève place ${u0} F à ${t} % d'intérêts composés par an. uₙ est le capital après n années.`, steps: [
      S("Nature de la suite (uₙ) :", `géométrique de raison ${nf(q)}`, [`arithmétique de raison ${t}`, `géométrique de raison ${t}`, `arithmétique de raison ${nf(u0 * t / 100)}`], `Chaque année le capital est multiplié par 1 + ${t}/100 = ${nf(q)}.`, 1.5),
      S("u₁ vaut :", `${nf(u0 * q)} F`, [`${u0 + t} F`, `${nf(u0 * t / 100)} F`, `${nf(u0 * q * q)} F`], `u₁ = ${u0} × ${nf(q)} = ${nf(u0 * q)} F.`, 1),
      S("Expression de uₙ :", `uₙ = ${u0} × ${nf(q)}ⁿ`, [`uₙ = ${u0} + ${t}n`, `uₙ = ${u0} × ${nf(q)}n`, `uₙ = ${nf(q)} × ${u0}ⁿ`], "uₙ = u₀ × qⁿ.", 1.5),
      S(`Capital après ${n} ans (à l'unité) :`, `${nf(u0 * q ** n, 0)} F`, [`${nf(u0 * (1 + (n * t) / 100), 0)} F`, `${nf(u0 * q ** (n - 1), 0)} F`, `${nf(u0 * q * n, 0)} F`], `${u0} × ${nf(q)}^${n} ≈ ${nf(u0 * q ** n, 0)} F.`, 1)] }; });
  add("1ere-maths", "Étude d'une fonction polynôme", (r) => { const a = pick(r, [1, -1]), k = ri(r, 1, 4), c = ri(r, -5, 5);
    // f(x) = a(x³ − 3k²x) + c : f'(x) = 3a(x² − k²)
    return { context: `f(x) = ${co(a)}x³ ${sg(-3 * a * k * k)}x ${sg(c)} sur ℝ.`, steps: [
      S("f′(x) =", `${co(3 * a)}x² ${sg(-3 * a * k * k)}`, [`${co(3 * a)}x² ${sg(-3 * a * k * k)}x`, `${co(a)}x² ${sg(-3 * a * k * k)}`, `${co(3 * a)}x³ ${sg(-3 * a * k * k)}`], "(xⁿ)′ = nxⁿ⁻¹ et la constante disparaît.", 1.5),
      S("f′ s'annule en :", `${m(-k)} et ${k}`, [`0 et ${k}`, `${m(-3 * k)} et ${3 * k}`, `${k * k} seulement`], `${co(3 * a)}(x² − ${k * k}) = 0 ⇔ x = ±${k}.`, 1.5),
      S(`Sur ]${m(-k)} ; ${k}[, f est :`, a > 0 ? "décroissante" : "croissante", ["croissante", "décroissante", "constante", "positive"].filter((x) => x !== (a > 0 ? "décroissante" : "croissante")).slice(0, 3), `f′ a le signe de ${m(3 * a)} à l'extérieur des racines, le signe contraire entre elles.`, 1),
      S(`f(${k}) =`, m(a * (k ** 3 - 3 * k ** 3) + c), [m(a * (k ** 3 + 3 * k ** 3) + c), m(-(a * (k ** 3 - 3 * k ** 3)) + c), m(c)], `f(${k}) = ${m(a * k ** 3)} ${sg(-3 * a * k ** 3)} ${sg(c)}.`, 1)] }; });
  add("1ere-maths", "Probabilités : une urne", (r) => { const R = ri(r, 2, 7), B = ri(r, 2, 7), N = R + B;
    return { context: `Une urne contient ${R} boules rouges et ${B} boules blanches. On tire 2 boules simultanément.`, steps: [
      S("Nombre de tirages possibles :", String(C(N, 2)), [String(N * N), String(N * (N - 1)), String(C(N, 2) + N)], `C(${N} ; 2) = ${N} × ${N - 1} ÷ 2 = ${C(N, 2)}.`, 1.5),
      S("P(2 boules rouges) :", fr(C(R, 2), C(N, 2)), [fr(R * R, N * N), fr(R, N), fr(C(B, 2), C(N, 2))], `C(${R} ; 2)/C(${N} ; 2) = ${C(R, 2)}/${C(N, 2)}.`, 1.5),
      S("P(une rouge et une blanche) :", fr(R * B, C(N, 2)), [fr(R * B, N * N), fr(2 * R * B, C(N, 2)), fr(R + B, C(N, 2))], `${R} × ${B} = ${R * B} tirages favorables sur ${C(N, 2)}.`, 1),
      S("P(au moins une blanche) :", fr(C(N, 2) - C(R, 2), C(N, 2)), [fr(C(B, 2), C(N, 2)), fr(B, N), fr(C(R, 2), C(N, 2))], "Événement contraire de « 2 rouges ».", 1)] }; });
  add("1ere-pc", "Travail et énergie cinétique", (r) => { const mm = ri(r, 1, 10) / 2, h = ri(r, 2, 20), g = 10, v = Math.sqrt(2 * g * h);
    return { context: `Un objet de ${nf(mm, 1)} kg est lâché sans vitesse d'une hauteur de ${h} m. On néglige les frottements ; g = 10 N/kg.`, steps: [
      S("Travail du poids pendant la chute :", `${nf(mm * g * h)} J`, [`${nf(-mm * g * h)} J`, `${nf(mm * h)} J`, `${nf(mm * g)} J`], `W = m g h = ${nf(mm, 1)} × 10 × ${h} = ${nf(mm * g * h)} J (moteur).`, 1.5),
      S("Énergie cinétique à l'arrivée au sol :", `${nf(mm * g * h)} J`, [`${nf(mm * g * h / 2)} J`, "0 J", `${nf(2 * mm * g * h)} J`], "Théorème de l'énergie cinétique : ΔEc = W(poids).", 1.5),
      S("Vitesse à l'arrivée (au dixième) :", `${nf(v, 1)} m/s`, [`${nf(2 * g * h, 1)} m/s`, `${nf(g * h, 1)} m/s`, `${nf(v / 2, 1)} m/s`], `v = √(2gh) = √${2 * g * h} ≈ ${nf(v, 1)} m/s.`, 2)] }; });
  add("1ere-pc", "Pile et oxydoréduction", (r) => { const [n1, E1, n2, E2] = pick(r, [["Zn", -0.76, "Cu", 0.34], ["Fe", -0.44, "Cu", 0.34], ["Zn", -0.76, "Ag", 0.8], ["Pb", -0.13, "Ag", 0.8]]);
    return { context: `On réalise une pile avec les couples ${n1}²⁺/${n1} (E° = ${nf(E1)} V) et ${n2 === "Ag" ? "Ag⁺" : n2 + "²⁺"}/${n2} (E° = ${nf(E2)} V).`, steps: [
      S("Pôle négatif :", `l'électrode de ${n1}`, [`l'électrode de ${n2}`, "le pont salin", "aucune"], "Le métal du couple de plus petit E° s'oxyde : c'est le pôle −.", 1.5),
      S("Force électromotrice :", `${nf(E2 - E1)} V`, [`${nf(E1 + E2)} V`, `${nf(E1 - E2)} V`, `${nf(E2)} V`], `e = ${nf(E2)} − (${nf(E1)}) = ${nf(E2 - E1)} V.`, 2),
      S("Réaction à l'électrode négative :", `${n1} → ${n1}²⁺ + 2e⁻`, [`${n1}²⁺ + 2e⁻ → ${n1}`, `${n2} → ${n2 === "Ag" ? "Ag⁺ + e⁻" : n2 + "²⁺ + 2e⁻"}`, `${n1} + 2e⁻ → ${n1}²⁻`], "À l'anode (pôle −), il y a oxydation : perte d'électrons.", 1.5)] }; });
  add("1ere-pc", "Calorimétrie : mélange d'eau", (r) => { const m1 = ri(r, 1, 5) * 100, T1 = ri(r, 15, 30), m2 = ri(r, 1, 5) * 100, T2 = ri(r, 50, 90), Te = (m1 * T1 + m2 * T2) / (m1 + m2);
    return { context: `Dans un calorimètre de capacité négligeable, on mélange ${m1} g d'eau à ${T1} °C et ${m2} g d'eau à ${T2} °C. c(eau) = 4180 J/kg/°C.`, steps: [
      S("Équation de l'équilibre :", "Q₁ + Q₂ = 0", ["Q₁ = Q₂", "Q₁ × Q₂ = 0", "Q₁ − Q₂ = 1"], "Système isolé : la somme des chaleurs échangées est nulle.", 1.5),
      S("Température d'équilibre (au dixième) :", `${nf(Te, 1)} °C`, [`${nf((T1 + T2) / 2, 1)} °C`, `${nf(T2 - T1, 1)} °C`, `${nf(Te + 5, 1)} °C`], `θe = (m₁θ₁ + m₂θ₂)/(m₁ + m₂) = ${nf(Te, 1)} °C.`, 2),
      S("Chaleur cédée par l'eau chaude (au joule) :", `${nf((m2 / 1000) * 4180 * (T2 - Te), 0)} J`, [`${nf(m2 * 4180 * (T2 - Te), 0)} J`, `${nf((m2 / 1000) * 4180 * T2, 0)} J`, `${nf((m1 / 1000) * 4180 * (T2 - Te), 0)} J`], `Q = m c (θ₂ − θe) avec m en kg.`, 1.5)] }; });

  // ---------- Terminale S
  add("tle-maths", "Suite arithmético-géométrique", (r) => { const a = pick(r, [0.5, 0.2, 0.8, 0.25]), L = ri(r, 2, 10) * 2, b = Number((L * (1 - a)).toFixed(4)), u0 = L + nz(r, -6, 6);
    return { context: `(uₙ) est définie par u₀ = ${u0} et uₙ₊₁ = ${nf(a)} uₙ + ${nf(b)}. On pose vₙ = uₙ − ${L}.`, steps: [
      S("u₁ =", nf(a * u0 + b), [nf(a * u0), nf(u0 + b), nf(a * (u0 + b))], `u₁ = ${nf(a)} × ${u0} + ${nf(b)} = ${nf(a * u0 + b)}.`, 1),
      S("(vₙ) est :", `géométrique de raison ${nf(a)}`, [`arithmétique de raison ${nf(b)}`, `géométrique de raison ${nf(b)}`, `géométrique de raison ${L}`], `vₙ₊₁ = ${nf(a)}uₙ + ${nf(b)} − ${L} = ${nf(a)}(uₙ − ${L}) = ${nf(a)} vₙ.`, 1.5),
      S("Expression de uₙ :", `uₙ = ${L} ${sg(u0 - L)} × ${nf(a)}ⁿ`, [`uₙ = ${u0} × ${nf(a)}ⁿ`, `uₙ = ${L} + ${nf(b)}n`, `uₙ = ${m(u0 - L)} × ${nf(a)}ⁿ`], `v₀ = ${u0} − ${L} = ${m(u0 - L)}, vₙ = v₀ × ${nf(a)}ⁿ et uₙ = vₙ + ${L}.`, 1.5),
      S("Limite de (uₙ) :", String(L), ["0", "+∞", String(u0)], `0 < ${nf(a)} < 1 donc ${nf(a)}ⁿ → 0 et uₙ → ${L}.`, 1)] }; });
  add("tle-maths", "Nombres complexes", (r) => { const a = nz(r, -4, 4), b = ri(r, 1, 5), w = [nz(r, -3, 3), nz(r, -3, 3)];
    const cx = (x, y) => `${m(x)} ${y < 0 ? "−" : "+"} ${Math.abs(y) === 1 ? "" : Math.abs(y)}i`, z = cx(a, b), S2 = 2 * a, P = a * a + b * b;
    return { context: `On considère l'équation z² ${sg(-S2)}z + ${P} = 0 dans ℂ et le nombre w = ${cx(w[0], w[1])}.`, steps: [
      S("Discriminant :", m(S2 * S2 - 4 * P), [m(S2 * S2 + 4 * P), m(4 * P - S2 * S2), m(-P)], `Δ = ${S2 * S2} − ${4 * P} = ${m(S2 * S2 - 4 * P)} = (${2 * b}i)².`, 1),
      S("Solutions :", `${z} et ${cx(a, -b)}`, [`${cx(-a, b)} et ${cx(-a, -b)}`, `${m(a + b)} et ${m(a - b)}`, `${cx(a, b * b)} et ${cx(a, -b * b)}`], `z = (${m(S2)} ± ${2 * b}i)/2.`, 1.5),
      S(`Module de ${z} :`, Number.isInteger(Math.sqrt(P)) ? String(Math.sqrt(P)) : `√${P}`, [String(Math.abs(a) + b), String(P), `√${Math.abs(a * a - b * b) || 2}`], `|z| = √(${a * a} + ${b * b}) = √${P}.`, 1),
      S(`(${z}) × w =`, cx(a * w[0] - b * w[1], a * w[1] + b * w[0]), [cx(a * w[0] + b * w[1], a * w[1] + b * w[0]), cx(a * w[0], b * w[1] || 1), cx(a * w[0] - b * w[1], a * w[1] - b * w[0] || 2)], "(a + bi)(c + di) = (ac − bd) + (ad + bc)i, car i² = −1.", 1.5)] }; });
  add("tle-maths", "Loi binomiale : un contrôle qualité", (r) => { const n = pick(r, [4, 5, 6]), p = pick(r, [0.1, 0.2, 0.3]), q = 1 - p;
    return { context: `Une usine de jus de bissap produit des bouteilles dont ${nf(p * 100)} % sont défectueuses. On prélève ${n} bouteilles (tirages indépendants). X est le nombre de bouteilles défectueuses.`, steps: [
      S("Loi de X :", `B(${n} ; ${nf(p)})`, [`B(${nf(p)} ; ${n})`, `B(${n} ; ${nf(q)})`, `uniforme sur {0 ; … ; ${n}}`], `${n} épreuves de Bernoulli indépendantes de succès « défectueuse », p = ${nf(p)}.`, 1),
      S("P(X = 0) (au millième) :", nf(q ** n, 3), [nf(p ** n, 3), nf(1 - q ** n, 3), nf(q, 3)], `P(X = 0) = ${nf(q)}^${n} ≈ ${nf(q ** n, 3)}.`, 1.5),
      S("P(X ≥ 1) (au millième) :", nf(1 - q ** n, 3), [nf(q ** n, 3), nf(n * p, 3), nf(1 - p ** n, 3)], "Événement contraire de X = 0.", 1.5),
      S("Espérance E(X) :", nf(n * p, 1), [nf(n * q, 1), nf(n * p * q, 2), nf(p, 1)], `E(X) = np = ${n} × ${nf(p)} = ${nf(n * p, 1)}.`, 1)] }; });
  add("tle-maths", "Intégrale et aire", (r) => { const a = nz(r, -3, 3), b = nz(r, -4, 4), c = ri(r, 1, 3);
    // f(x) = 3a x² + 2b x ; F(x) = a x³ + b x² ; ∫₀^c
    const I = a * c ** 3 + b * c * c;
    return { context: `f(x) = ${co(3 * a)}x² ${sg(2 * b)}x. On calcule I = ∫₀^${c} f(x) dx.`, steps: [
      S("Une primitive F de f :", `F(x) = ${co(a)}x³ ${sg(b)}x²`, [`F(x) = ${co(6 * a)}x ${sg(2 * b)}`, `F(x) = ${co(3 * a)}x³ ${sg(2 * b)}x²`, `F(x) = ${co(a)}x³ ${sg(2 * b)}x²`], "Une primitive de xⁿ est xⁿ⁺¹/(n + 1).", 1.5),
      S("I =", m(I), [m(-I), m(3 * a * c * c + 2 * b * c), m(I + a)], `I = F(${c}) − F(0) = ${m(a * c ** 3)} ${sg(b * c * c)} = ${m(I)}.`, 2),
      S("Valeur moyenne de f sur [0 ; " + c + "] :", fr(I, c), [fr(I, 2), m(I), fr(c, I || 1)], `μ = I / (${c} − 0) = ${fr(I, c)}.`, 1.5)] }; });
  add("tle-maths", "Fonction exponentielle", (r) => { const a = nz(r, -3, 3), b = nz(r, -4, 4);
    // f(x) = (a x + b) e^x ; f'(x) = (a x + a + b) e^x ; annule en x = -(a+b)/a
    return { context: `f(x) = (${co(a)}x ${sg(b)})eˣ sur ℝ.`, steps: [
      S("f′(x) =", `(${co(a)}x ${sg(a + b)})eˣ`.replace(" + 0)", ")"), [`${m(a)}eˣ`, `(${co(a)}x ${sg(b)})eˣ`, `(${co(a)}x ${sg(a - b)})eˣ`.replace(" + 0)", ")")], "(uv)′ = u′v + uv′ avec u = ax + b et v = eˣ.", 1.5),
      S("f′ s'annule en x =", fr(-(a + b), a), [fr(-b, a), fr(a + b, a), fr(b, a)], `${co(a) || "1"}x ${sg(a + b)} = 0 ⇔ x = ${fr(-(a + b), a)} (eˣ > 0).`, 1.5),
      S("f(0) =", m(b), [m(a + b), "0", "1"], "e⁰ = 1, donc f(0) = b.", 1),
      S("Limite de f en −∞ :", "0", [a > 0 ? "−∞" : "+∞", "1", m(b)], "Croissances comparées : x eˣ → 0 et eˣ → 0 en −∞.", 1)] }; });
  add("tle-maths", "Fonction logarithme", (r) => { const a = pick(r, [1, 2, 3, 4]), b = nz(r, -3, 3);
    // f(x) = a x − ln x + b sur ]0;+∞[, f'(x) = a − 1/x, min en 1/a
    return { context: `f(x) = ${co(a)}x − ln x ${sg(b)} sur ]0 ; +∞[.`, steps: [
      S("f′(x) =", `${a} − 1/x`, [`${a} + 1/x`, `${a}x − 1/x`, `${a} − ln x`], "(ln x)′ = 1/x.", 1.5),
      S("f′ s'annule en :", fr(1, a), [String(a), "1", "e"], `${a} − 1/x = 0 ⇔ x = 1/${a}.`, 1),
      S("Minimum de f :", a === 1 ? m(1 + b) : `${m(1 + b)} + ln ${a}`, a === 1 ? [m(b), m(1 - b), m(2 + b)] : [`${m(1 + b)} − ln ${a}`, m(b), `${m(a + b)} + ln ${a}`], `f(1/${a}) = 1 − ln(1/${a}) ${sg(b)} = ${m(1 + b)} + ln ${a}.`, 1.5),
      S("Limite de f en 0⁺ :", "+∞", ["−∞", "0", m(b)], "−ln x → +∞ quand x → 0⁺.", 1)] }; });
  add("tle-pc", "Mouvement d'un projectile", (r) => { const v0 = ri(r, 5, 20), ang = pick(r, [30, 45, 60]), g = 10, rad = (ang * Math.PI) / 180;
    const vx = v0 * Math.cos(rad), vy = v0 * Math.sin(rad), H = (vy * vy) / (2 * g), D = (v0 * v0 * Math.sin(2 * rad)) / g;
    return { context: `Un ballon est lancé depuis le sol avec une vitesse de ${v0} m/s faisant ${ang}° avec l'horizontale. g = 10 m/s², frottements négligés.`, steps: [
      S("Accélération du ballon :", "g, verticale vers le bas", ["nulle", "v₀ / t", "g, dans le sens du mouvement"], "Seul le poids agit : a = g (deuxième loi de Newton).", 1),
      S("Composante horizontale de la vitesse (au dixième) :", `${nf(vx, 1)} m/s`, [`${nf(vy, 1)} m/s`, `${v0} m/s`, `${nf(v0 * Math.tan(rad), 1)} m/s`], `vx = v₀ cos ${ang}° ≈ ${nf(vx, 1)} m/s, constante.`, 1),
      S("Flèche (hauteur maximale, au centième) :", `${nf(H, 2)} m`, [`${nf(2 * H, 2)} m`, `${nf((v0 * v0) / (2 * g), 2)} m`, `${nf(D, 2)} m`], `H = (v₀ sin α)²/(2g) ≈ ${nf(H, 2)} m.`, 1.5),
      S("Portée (au centième) :", `${nf(D, 2)} m`, [`${nf(D / 2, 2)} m`, `${nf((v0 * v0) / g, 2)} m`, `${nf(H, 2)} m`], `D = v₀² sin 2α / g ≈ ${nf(D, 2)} m.`, 1.5)] }; });
  add("tle-pc", "Charge d'un condensateur (dipôle RC)", (r) => { const R = ri(r, 1, 10) * 1000, Cu = pick(r, [10, 22, 47, 100]), E = pick(r, [5, 6, 9, 12]), tau = R * Cu * 1e-6;
    return { context: `Un condensateur de ${Cu} µF, initialement déchargé, se charge à travers R = ${R} Ω sous E = ${E} V.`, steps: [
      S("Constante de temps τ :", `${nf(tau * 1000, 1)} ms`, [`${nf(tau * 1000 / 2, 1)} ms`, `${nf(R / Cu, 1)} ms`, `${nf(tau * 1000 * 5, 1)} ms`], `τ = RC = ${R} × ${Cu} × 10⁻⁶ = ${nf(tau, 4)} s.`, 1.5),
      S("Tension à t = τ (au centième) :", `${nf(E * 0.632, 2)} V`, [`${nf(E * 0.368, 2)} V`, `${E} V`, `${nf(E / 2, 2)} V`], "uC(τ) = E(1 − e⁻¹) ≈ 0,63 E.", 1.5),
      S("Durée pratique de la charge :", `${nf(tau * 5000, 1)} ms`, [`${nf(tau * 1000, 1)} ms`, `${nf(tau * 2000, 1)} ms`, `${nf(tau * 10000, 1)} ms`], "On considère la charge terminée à 5τ (99 %).", 1),
      S("Énergie stockée en fin de charge :", `${sci(0.5 * Cu * 1e-6 * E * E)} J`, [`${sci(Cu * 1e-6 * E * E)} J`, `${sci(0.5 * Cu * 1e-6 * E)} J`, `${sci(0.5 * Cu * E * E)} J`], "E = ½ C E².", 1)] }; });
  add("tle-pc", "Décroissance radioactive", (r) => { const [nu, T, u] = pick(r, [["iode 131", 8, "jours"], ["cobalt 60", 5.3, "ans"], ["phosphore 32", 14, "jours"], ["carbone 14", 5730, "ans"]]), k = ri(r, 2, 5), N0 = ri(r, 1, 9);
    return { context: `Un échantillon contient N₀ = ${N0} × 10²⁰ noyaux de ${nu} (demi-vie T = ${nf(T, 1)} ${u}).`, steps: [
      S(`Noyaux restants après ${k} demi-vies :`, `${nf(N0 / 2 ** k, 4)} × 10²⁰`, [`${nf(N0 / (2 * k), 4)} × 10²⁰`, `${nf(N0 / 2 ** (k + 1), 4)} × 10²⁰`, `${nf(N0 * (1 - 1 / 2 ** k), 4)} × 10²⁰`], `N = N₀ / 2^${k} = ${nf(N0 / 2 ** k, 4)} × 10²⁰.`, 1.5),
      S("Durée correspondante :", `${nf(k * T, 1)} ${u}`, [`${nf(T / k, 2)} ${u}`, `${nf(T, 1)} ${u}`, `${nf(2 ** k * T, 1)} ${u}`], `${k} × ${nf(T, 1)} = ${nf(k * T, 1)} ${u}.`, 1),
      S("Constante radioactive λ :", `ln 2 / ${nf(T, 1)} ${u}⁻¹`, [`${nf(T, 1)} / ln 2`, `1 / ${nf(T, 1)}`, `ln 2 × ${nf(T, 1)}`], "λ = ln 2 / T.", 1.5),
      S("Pourcentage de noyaux désintégrés :", `${nf(100 * (1 - 1 / 2 ** k), 2)} %`, [`${nf(100 / 2 ** k, 2)} %`, `${k * 50} %`, `${nf(100 * (1 - 1 / 2 ** (k - 1)), 2)} %`], `1 − 1/2^${k} des noyaux ont disparu.`, 1)] }; });
  add("tle-pc", "Dosage acide faible – base forte", (r) => { const Cb = pick(r, [0.01, 0.02, 0.05, 0.1]), Va = pick(r, [10, 20, 25]), VE = ri(r, 8, 24), pKa = pick(r, [4.2, 4.8, 3.8]), Ca = (Cb * VE) / Va;
    return { context: `On dose Va = ${Va} mL d'une solution d'acide faible AH (pKa = ${nf(pKa, 1)}) par de la soude à Cb = ${nf(Cb)} mol/L. L'équivalence est obtenue pour VbE = ${VE} mL.`, steps: [
      S("Relation à l'équivalence :", "Ca Va = Cb VbE", ["Ca VbE = Cb Va", "Ca + Cb = Va + VbE", "Ca Cb = Va VbE"], "À l'équivalence, les réactifs ont été mélangés dans les proportions stœchiométriques.", 1),
      S("Concentration de l'acide :", `${sci(Ca)} mol/L`, [`${sci((Cb * Va) / VE)} mol/L`, `${sci(Cb * VE)} mol/L`, `${sci(Ca * 10)} mol/L`], `Ca = Cb × VbE / Va = ${nf(Cb)} × ${VE} / ${Va}.`, 1.5),
      S("pH à la demi-équivalence :", nf(pKa, 1), ["7", nf(pKa / 2, 2), nf(14 - pKa, 1)], "À la demi-équivalence, [A⁻] = [AH] donc pH = pKa.", 1.5),
      S("pH à l'équivalence :", "supérieur à 7", ["égal à 7", "inférieur à 7", "égal au pKa"], "À l'équivalence, la solution contient la base A⁻ : pH basique.", 1)] }; });
  add("tle-pc", "Pendule élastique", (r) => { const mm = pick(r, [0.1, 0.2, 0.25, 0.4, 0.5]), k = pick(r, [10, 20, 40, 50, 100]), Xm = ri(r, 2, 8) / 100, w = Math.sqrt(k / mm), T = (2 * Math.PI) / w;
    return { context: `Un solide de ${nf(mm)} kg accroché à un ressort de raideur k = ${k} N/m oscille sans frottement avec une amplitude de ${nf(Xm * 100)} cm.`, steps: [
      S("Pulsation propre ω₀ (au centième) :", `${nf(w, 2)} rad/s`, [`${nf(k / mm, 2)} rad/s`, `${nf(Math.sqrt(mm / k), 3)} rad/s`, `${nf(2 * Math.PI * w, 1)} rad/s`], `ω₀ = √(k/m) = √${nf(k / mm)} ≈ ${nf(w, 2)} rad/s.`, 1.5),
      S("Période propre (au centième) :", `${nf(T, 2)} s`, [`${nf(1 / T, 2)} s`, `${nf(w / (2 * Math.PI), 2)} s`, `${nf(2 * T, 2)} s`], "T₀ = 2π/ω₀ = 2π√(m/k).", 1.5),
      S("Énergie mécanique (au millième) :", `${nf(0.5 * k * Xm * Xm, 3)} J`, [`${nf(k * Xm * Xm, 3)} J`, `${nf(0.5 * k * Xm, 3)} J`, `${nf(0.5 * mm * Xm * Xm, 4)} J`], `Em = ½ k Xm² = 0,5 × ${k} × ${nf(Xm, 2)}².`, 1),
      S("Vitesse maximale (au centième) :", `${nf(w * Xm, 2)} m/s`, [`${nf(w * Xm * 100, 1)} m/s`, `${nf(Xm / w, 3)} m/s`, `${nf(w * w * Xm, 2)} m/s`], "Vmax = ω₀ Xm.", 1)] }; });
  add("tle-pc", "Particule dans un champ magnétique", (r) => { const v = ri(r, 1, 9) * 1e5, B = pick(r, [0.1, 0.2, 0.5, 1]), mp = 1.67e-27, q = 1.6e-19, R = (mp * v) / (q * B);
    return { context: `Un proton (m = 1,67 × 10⁻²⁷ kg, q = 1,6 × 10⁻¹⁹ C) entre avec une vitesse de ${sci(v)} m/s perpendiculairement à un champ magnétique uniforme B = ${nf(B, 1)} T.`, steps: [
      S("Nature du mouvement :", "circulaire uniforme", ["rectiligne uniforme", "parabolique", "rectiligne accéléré"], "La force de Lorentz est perpendiculaire à la vitesse : elle ne change pas la valeur de v, seulement sa direction.", 1.5),
      S("Valeur de la force magnétique :", `${sci(q * v * B)} N`, [`${sci(q * B)} N`, `${sci(mp * v)} N`, `${sci((q * v) / B)} N`], `F = |q| v B = 1,6 × 10⁻¹⁹ × ${sci(v)} × ${nf(B, 1)}.`, 1.5),
      S("Rayon de la trajectoire :", `${sci(R)} m`, [`${sci((q * B) / (mp * v))} m`, `${sci(R * 10)} m`, `${sci(R / 2)} m`], "R = m v / (|q| B).", 2)] }; });
})();

// Construit un exercice (format des sujets guidés) à partir d'un modèle, avec des nombres neufs
function genExercise(sid, k, r = Math.random) {
  const tpl = (EXGEN[sid] || [])[k], subj = (DATA.subjects || []).find((s) => s.id === sid);
  if (!tpl || !subj) return null;
  let g = null, steps = null;
  for (let i = 0; i < 15 && !steps; i++) {
    try { g = tpl.make(r); } catch (e) { g = null; }
    if (!g || /NaN|undefined|Infinity/.test(JSON.stringify(g))) continue;
    // on préfère un tirage sans distracteur en double ; sinon on complète les doublons
    const exact = g.steps.every((st) => new Set([st.ok, ...st.faux]).size === 4);
    if (!exact && i < 10) continue;
    steps = g.steps.map((st) => { const f = GH.fix(GH.clean({ q: st.q, ok: st.ok, faux: st.faux, e: st.e })); if (!f) return null;
      const order = [0, 1, 2, 3].sort(() => r() - 0.5), c = [f.ok, ...f.faux];
      return { q: f.q, c: order.map((i) => c[i]), a: order.indexOf(0), e: f.e, pts: st.pts }; });
    if (steps.includes(null)) steps = null;
  }
  if (!steps) return null;
  return { id: `gx-${sid}-${k}`, levels: subj.levels, subject: subj.name, title: tpl.t, src: "Nombres nouveaux à chaque essai", free: false, gen: true, guided: [{ title: tpl.t, context: g.context, steps }] };
}

// Sujet type complet (noté sur 20) : 4 exercices de thèmes différents, tirés au hasard
function genSujet(sid, r = Math.random) {
  const n = (EXGEN[sid] || []).length, subj = (DATA.subjects || []).find((s) => s.id === sid);
  if (n < 2 || !subj) return null;
  const ks = [...Array(n).keys()].sort(() => r() - 0.5).slice(0, 4);
  const parts = ks.map((k) => genExercise(sid, k, r)).filter(Boolean).map((e, i) => ({ ...e.guided[0], title: `Exercice ${i + 1} : ${e.title}` }));
  const tot = parts.reduce((a, p) => a + p.steps.reduce((b, s) => b + s.pts, 0), 0);
  parts.forEach((p) => p.steps.forEach((s) => (s.pts = Math.round(((s.pts * 20) / tot) * 4) / 4)));
  const last = parts[parts.length - 1].steps, sum = parts.reduce((x, p) => x + p.steps.reduce((y, s) => y + s.pts, 0), 0);
  last[last.length - 1].pts = Math.round((last[last.length - 1].pts + 20 - sum) * 100) / 100;
  const exam = sid.startsWith("3e") ? "BFEM" : sid.startsWith("tle") ? "BAC" : "Devoir";
  return { id: `gs-${sid}`, levels: subj.levels, exam, year: "type", subject: subj.name, modele: exam !== "Devoir", gen: true, duration: exam === "Devoir" ? "2 h" : exam === "BFEM" ? "2 h" : "4 h", guided: parts };
}
