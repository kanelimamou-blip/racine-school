"use strict";
// Les cours dans la vie de tous les jours : problèmes du quotidien (marché, factures, solaire, route…),
// « Pourquoi j'apprends ça ? » et métiers par chapitre, et les outils de l'élève (fiches flash, formulaire,
// simulateur de moyenne, minuteur, journal, gestion du stress, citation du jour).

(() => {
  const { nf, ri, pick } = GH;
  const F = (x) => Math.round(x).toLocaleString("fr-FR");
  const sh = (r, a) => a.map((x) => [r(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  // Trois distracteurs distincts ; s'il en manque, on décale le nombre de la bonne réponse
  const uniq = (ok, faux) => { ok = String(ok); const s = new Set([ok]), out = faux.map(String).filter((x) => !s.has(x) && s.add(x)).slice(0, 3);
    const m = ok.match(/^([\d\s\u202f]+(?:,\d+)?)(.*)$/), v = m && parseFloat(m[1].replace(/[\s\u202f]/g, "").replace(",", "."));
    for (const k of [1.1, 0.9, 1.25, 0.75, 1.5, 2]) { if (out.length >= 3 || !m) break; const x = (Number.isInteger(v) ? F(v * k) : nf(v * k, 2)) + m[2]; if (!s.has(x)) { s.add(x); out.push(x); } }
    return out; };
  const QCM = (list) => (r) => { const [q, ok, faux, e] = pick(r, list); return { q, ok, faux, e }; };

  // ---------- 1. Les maths au marché
  const PROD = [["kg de riz", 450, 550], ["litre d'huile", 1300, 1600], ["kg de sucre", 650, 800], ["kg d'oignons", 400, 800], ["baguette de pain", 150, 175], ["kg de pommes de terre", 400, 600], ["boîte de lait concentré", 400, 600]];
  const marche = [
    (r) => { const [p1, p2] = sh(r, PROD).slice(0, 2), n1 = ri(r, 1, 5), n2 = ri(r, 1, 4), u1 = ri(r, p1[1] / 25, p1[2] / 25) * 25, u2 = ri(r, p2[1] / 25, p2[2] / 25) * 25, T = n1 * u1 + n2 * u2, B = Math.ceil(T / 1000) * 1000 + pick(r, [0, 1000, 5000]);
      return { q: `Au marché de Tilène, tu achètes ${n1} ${p1[0]} à ${F(u1)} F et ${n2} ${p2[0]} à ${F(u2)} F. Tu paies avec ${F(B)} F. Combien te rend-on ?`, ok: `${F(B - T)} F`, faux: uniq(`${F(B - T)} F`, [`${F(B - T + u2)} F`, `${F(B - T - 100)} F`, `${F(T)} F`, `${F(B - n1 * u1)} F`]).slice(0, 3), e: `Total : ${n1} × ${F(u1)} + ${n2} × ${F(u2)} = ${F(T)} F. Monnaie : ${F(B)} − ${F(T)} = ${F(B - T)} F.` }; },
    (r) => { const k = ri(r, 450, 520), sac = 25, ps = Math.round((k * sac * pick(r, [0.88, 0.9, 0.92])) / 250) * 250, eco = k * sac - ps;
      return { q: `Le riz coûte ${F(k)} F le kg, ou ${F(ps)} F le sac de ${sac} kg. Combien économise-t-on en achetant le sac ?`, ok: `${F(eco)} F`, faux: uniq(`${F(eco)} F`, [`${F(ps / sac)} F`, `${F(k * sac)} F`, `${F(eco / sac)} F`, `${F(eco + 1000)} F`]).slice(0, 3), e: `${sac} kg au détail : ${sac} × ${F(k)} = ${F(k * sac)} F. Économie : ${F(k * sac)} − ${F(ps)} = ${F(eco)} F, soit ${nf(ps / sac, 0)} F le kg dans le sac.` }; },
    (r) => { const p = ri(r, 8, 40) * 500, t = pick(r, [10, 15, 20, 25, 30]);
      return { q: `Un pagne coûte ${F(p)} F. Le vendeur fait ${t} % de réduction. Prix à payer :`, ok: `${F(p * (1 - t / 100))} F`, faux: uniq(`${F(p * (1 - t / 100))} F`, [`${F((p * t) / 100)} F`, `${F(p - t)} F`, `${F(p * (1 + t / 100))} F`]), e: `Réduction : ${t} % de ${F(p)} = ${F((p * t) / 100)} F. Prix : ${F(p)} − ${F((p * t) / 100)} = ${F(p * (1 - t / 100))} F.` }; },
    (r) => { const g = pick(r, [250, 500, 750]), p = ri(r, 32, 48) * 25 * (g / 250);
      return { q: `${g} g de viande coûtent ${F(p)} F. Prix du kilo :`, ok: `${F((p * 1000) / g)} F`, faux: uniq(`${F((p * 1000) / g)} F`, [`${F(p * 4)} F`, `${F(p * 2)} F`, `${F((p * g) / 1000)} F`, `${F(p * 3)} F`]).slice(0, 3), e: `On ramène à 1 000 g : ${F(p)} ÷ ${g} × 1 000 = ${F((p * 1000) / g)} F le kilo.` }; },
    (r) => { const d = ri(r, 4, 25), tk = pick(r, [150, 200, 250, 300]), j = pick(r, [20, 22, 26]);
      return { q: `Un élève prend le bus ${tk} F l'aller et ${tk} F le retour, ${j} jours par mois. Budget transport du mois :`, ok: `${F(2 * tk * j)} F`, faux: uniq(`${F(2 * tk * j)} F`, [`${F(tk * j)} F`, `${F(2 * tk * 30)} F`, `${F(2 * tk + j)} F`]), e: `Par jour : 2 × ${tk} = ${2 * tk} F. Par mois : ${2 * tk} × ${j} = ${F(2 * tk * j)} F.` }; },
  ];

  // ---------- 2. Ma facture Senelec
  const APP = [["un ventilateur", 60], ["une télévision", 100], ["une ampoule LED", 10], ["une ampoule à incandescence", 60], ["un fer à repasser", 1000], ["un climatiseur", 1500], ["un ordinateur portable", 65], ["un réfrigérateur (en moyenne)", 150]];
  const senelec = [
    (r) => { const [a, P] = pick(r, APP), h = ri(r, 2, 10), j = 30, pk = pick(r, [100, 110, 120]), E = (P * h * j) / 1000;
      return { q: `${a[0].toUpperCase() + a.slice(1)} de ${P} W fonctionne ${h} h par jour pendant ${j} jours. Avec un kWh à ${pk} F (prix pris pour l'exercice), coût du mois :`, ok: `${F(E * pk)} F`, faux: uniq(`${F(E * pk)} F`, [`${F(P * h * j * pk)} F`, `${F((E * pk) / 10)} F`, `${F(E * pk * 10)} F`, `${F((P * h * pk) / 1000)} F`]).slice(0, 3), e: `Énergie : ${P} W × ${h} h × ${j} = ${F(P * h * j)} Wh = ${nf(E, 1)} kWh. Coût : ${nf(E, 1)} × ${pk} ≈ ${F(E * pk)} F.` }; },
    (r) => { const h = ri(r, 4, 8), n = ri(r, 3, 8), pk = 110, E = (n * (60 - 10) * h * 30) / 1000;
      return { q: `On remplace ${n} ampoules de 60 W par des LED de 10 W, allumées ${h} h par jour. Économie sur 30 jours (kWh à ${pk} F) :`, ok: `${F(E * pk)} F`, faux: uniq(`${F(E * pk)} F`, [`${F((E * pk) / n)} F`, `${F((n * 60 * h * 30 * pk) / 1000)} F`, `${F(E)} F`]), e: `Chaque ampoule consomme 50 W de moins : ${n} × 50 × ${h} × 30 = ${F(n * 50 * h * 30)} Wh = ${nf(E, 1)} kWh, soit ${F(E * pk)} F.` }; },
    (r) => { const c = pick(r, [2000, 5000, 10000]), pk = pick(r, [100, 115, 125]);
      return { q: `Avec une recharge Woyofal de ${F(c)} F et un kWh à ${pk} F (prix pris pour l'exercice), combien de kWh obtient-on (environ) ?`, ok: `${nf(c / pk, 1)} kWh`, faux: uniq(`${nf(c / pk, 1)} kWh`, [`${nf((c * pk) / 1000, 1)} kWh`, `${nf(c / 1000, 1)} kWh`, `${nf(pk / c, 3)} kWh`]), e: `Nombre de kWh = montant ÷ prix du kWh = ${F(c)} ÷ ${pk} ≈ ${nf(c / pk, 1)} kWh. Sur la vraie facture, les taxes et les tranches changent un peu ce calcul.` }; },
    QCM([["Le kWh mesure :", "une énergie", ["une puissance", "une tension", "une intensité"], "1 kWh = l'énergie consommée par un appareil de 1 000 W pendant 1 heure."], ["Quel appareil consomme le plus en 1 heure ?", "un climatiseur", ["une ampoule LED", "un chargeur de téléphone", "une radio"], "Les appareils qui chauffent ou refroidissent (climatiseur, fer, chauffe-eau) ont de grandes puissances."], ["Pour une même pièce, une ampoule LED de 10 W éclaire comme une ampoule classique de :", "60 W environ", ["10 W", "5 W", "200 W"], "La LED transforme bien plus d'énergie en lumière et moins en chaleur."]]),
  ];

  // ---------- 3. Ma facture d'eau
  const eau = [
    (r) => { const a = ri(r, 1200, 3000), c = ri(r, 12, 40), pm = pick(r, [300, 400, 500]);
      return { q: `L'index du compteur passe de ${F(a)} m³ à ${F(a + c)} m³ en deux mois. Avec un m³ à ${pm} F (prix pris pour l'exercice), montant :`, ok: `${F(c * pm)} F`, faux: uniq(`${F(c * pm)} F`, [`${F((a + c) * pm)} F`, `${F(c * pm * 2)} F`, `${F((c * pm) / 10)} F`]), e: `Consommation : ${F(a + c)} − ${F(a)} = ${c} m³. Montant : ${c} × ${pm} = ${F(c * pm)} F.` }; },
    (r) => { const l = pick(r, [0.5, 1, 2, 3]);
      return { q: `Un robinet qui goutte perd ${nf(l, 1)} L par heure. Combien d'eau perdue en 30 jours ?`, ok: `${nf(l * 24 * 30 / 1000, 2)} m³`, faux: uniq(`${nf(l * 24 * 30 / 1000, 2)} m³`, [`${nf(l * 30, 1)} m³`, `${nf(l * 24 * 30, 0)} m³`, `${nf(l * 24 / 1000, 3)} m³`]), e: `${nf(l, 1)} L × 24 h × 30 j = ${F(l * 720)} L. Et 1 m³ = 1 000 L, donc ${nf(l * 0.72, 2)} m³.` }; },
    (r) => { const d = ri(r, 5, 10), q = pick(r, [8, 10, 12]), n = ri(r, 4, 8);
      return { q: `Une douche de ${d} min avec un débit de ${q} L/min, pour ${n} personnes par jour. Litres utilisés par jour :`, ok: `${d * q * n} L`, faux: uniq(`${d * q * n} L`, [`${d * q} L`, `${d * n * 2} L`, `${d * q * (n - 1)} L`]), e: `Une douche : ${d} × ${q} = ${d * q} L. Pour ${n} personnes : ${d * q * n} L. Un seau de 10 L pour se laver économise beaucoup.` }; },
    QCM([["Pour repérer une fuite chez soi :", "noter l'index du compteur, ne rien utiliser pendant 2 h, puis relire l'index", ["regarder la couleur de l'eau", "ouvrir tous les robinets", "attendre la facture"], "Si l'index a bougé alors que personne n'a utilisé d'eau, il y a une fuite."], ["1 m³ d'eau correspond à :", "1 000 litres", ["100 litres", "10 litres", "10 000 litres"], "1 m³ = 1 000 dm³ = 1 000 L."]]),
  ];

  // ---------- 15. Énergie solaire
  const solaire = [
    (r) => { const P = pick(r, [100, 150, 200, 300]), h = 5;
      return { q: `Au Sénégal, on compte environ ${h} heures de plein soleil par jour. Un panneau de ${P} W produit par jour environ :`, ok: `${F(P * h)} Wh`, faux: uniq(`${F(P * h)} Wh`, [`${P} Wh`, `${F(P * 24)} Wh`, `${F(P * h * 10)} Wh`]), e: `Énergie = puissance × durée = ${P} W × ${h} h = ${F(P * h)} Wh.` }; },
    (r) => { const n = ri(r, 3, 8), h = ri(r, 4, 6), tv = pick(r, [0, 1]), besoin = n * 10 * h + tv * 100 * 4 + 60 * 8, P = 150, k = Math.ceil(besoin / (P * 5));
      return { q: `Une maison utilise ${n} LED de 10 W pendant ${h} h${tv ? ", une télé de 100 W pendant 4 h" : ""} et un ventilateur de 60 W pendant 8 h. Besoin par jour :`, ok: `${besoin} Wh`, faux: uniq(`${besoin} Wh`, [`${n * 10 + tv * 100 + 60} Wh`, `${besoin * 2} Wh`, `${besoin - 480} Wh`]), e: `On additionne puissance × durée de chaque appareil : ${n} × 10 × ${h}${tv ? " + 100 × 4" : ""} + 60 × 8 = ${besoin} Wh. Avec des panneaux de 150 W (750 Wh/jour chacun), il en faut ${k}.` }; },
    (r) => { const E = pick(r, [600, 900, 1200, 1500]), U = 12;
      return { q: `Pour stocker ${E} Wh dans une batterie de ${U} V, il faut une capacité d'au moins :`, ok: `${E / U} Ah`, faux: uniq(`${E / U} Ah`, [`${E * U} Ah`, `${E} Ah`, `${E / 24} Ah`]), e: `Capacité (Ah) = énergie (Wh) ÷ tension (V) = ${E} ÷ ${U} = ${E / U} Ah. En pratique on prend plus grand pour ne pas vider la batterie à fond.` }; },
    QCM([["Un panneau solaire transforme :", "l'énergie lumineuse en énergie électrique", ["l'énergie électrique en lumière", "la chaleur en mouvement", "le vent en électricité"], "C'est l'effet photovoltaïque."], ["Pour bien produire, au Sénégal, un panneau doit être orienté :", "vers le sud, légèrement incliné", ["vers le nord", "à la verticale vers l'est", "à l'ombre"], "Le Sénégal est dans l'hémisphère Nord : le soleil passe au sud."]]),
  ];

  // ---------- 16. Électricité sans danger
  const secu = [QCM([
    ["Avant de changer une ampoule, il faut :", "couper le courant au disjoncteur ou à l'interrupteur", ["mouiller ses mains", "garder la lampe allumée", "toucher la douille pour vérifier"], "On travaille toujours hors tension."],
    ["Le fil de terre (vert et jaune) sert à :", "évacuer le courant vers le sol en cas de défaut et protéger les personnes", ["faire briller les lampes", "augmenter la tension", "décorer l'installation"], "Avec un disjoncteur différentiel, il coupe le courant si une fuite apparaît."],
    ["Brancher beaucoup d'appareils sur une seule multiprise peut :", "faire chauffer les fils et provoquer un incendie", ["économiser de l'électricité", "rendre les appareils plus rapides", "ne rien changer"], "L'intensité totale dépasse ce que la multiprise supporte."],
    ["Si quelqu'un est électrocuté, on doit d'abord :", "couper le courant, sans toucher la victime", ["tirer la victime par le bras", "lui jeter de l'eau", "attendre"], "Toucher la victime sous tension, c'est s'électrocuter soi-même. Ensuite on appelle les secours (18 ou 15)."],
    ["Un fil électrique tombé au sol dans la rue après la pluie :", "on s'en éloigne et on prévient Senelec", ["on le ramasse avec la main", "on marche dessus avec des sandales", "on le touche avec un bâton mouillé"], "L'eau conduit le courant : danger mortel."],
    ["Le disjoncteur sert à :", "couper automatiquement le courant en cas de surcharge ou de court-circuit", ["mesurer la consommation", "augmenter la puissance", "stocker l'électricité"], "Il protège l'installation et les personnes."],
    ["Pourquoi ne pas utiliser un appareil électrique sous la douche ?", "l'eau et le corps mouillé conduisent le courant", ["l'appareil s'use plus vite", "le savon abîme les prises", "c'est interdit sans raison"], "La peau mouillée laisse passer un courant bien plus fort."],
  ])];

  // ---------- 17. Code de la route et physique
  const route = [
    (r) => { const v = pick(r, [36, 54, 72, 90, 108]), ms = v / 3.6, tr = 1;
      return { q: `Une voiture roule à ${v} km/h. Le conducteur met ${tr} s à réagir. Distance parcourue pendant ce temps :`, ok: `${nf(ms * tr, 0)} m`, faux: uniq(`${nf(ms * tr, 0)} m`, [`${v} m`, `${nf(v / 36, 1)} m`, `${nf(ms * 2, 0)} m`]), e: `${v} km/h = ${nf(ms, 0)} m/s. En ${tr} s, la voiture parcourt ${nf(ms, 0)} m sans freiner. Un téléphone en main allonge ce temps.` }; },
    (r) => { const v = pick(r, [36, 54, 72, 90]), ms = v / 3.6, a = 7, d = (ms * ms) / (2 * a);
      return { q: `À ${v} km/h, sur route sèche (décélération de ${a} m/s², valeur prise pour l'exercice), distance de freinage :`, ok: `${nf(d, 1)} m`, faux: uniq(`${nf(d, 1)} m`, [`${nf(d / 2, 1)} m`, `${nf(ms / a, 1)} m`, `${nf(d * 2, 1)} m`]), e: `d = v² ÷ (2a) avec v = ${nf(ms, 0)} m/s : ${nf(ms * ms, 0)} ÷ ${2 * a} ≈ ${nf(d, 1)} m.` }; },
    QCM([["Si la vitesse double, l'énergie cinétique et la distance de freinage sont :", "multipliées par 4", ["multipliées par 2", "inchangées", "divisées par 2"], "Ec = ½ m v² : la vitesse est au carré."],
      ["La ceinture de sécurité protège parce que :", "elle retient le corps qui continue sur sa lancée lors d'un choc (principe d'inertie)", ["elle fait ralentir la voiture", "elle rend la voiture plus légère", "elle évite les crevaisons"], "Sans ceinture, le passager continue à la vitesse de la voiture et heurte le pare-brise."],
      ["Sur route mouillée, la distance de freinage :", "augmente", ["diminue", "ne change pas", "devient nulle"], "Les pneus adhèrent moins : la décélération est plus faible."],
      ["La distance d'arrêt est égale à :", "distance de réaction + distance de freinage", ["distance de freinage seule", "vitesse × poids", "distance de réaction seule"], "Pendant la réaction, la voiture roule encore à pleine vitesse."]]),
  ];

  // ---------- 18. Statistiques réelles du Sénégal
  const stats = [
    QCM([["Au recensement de 2023 (RGPH-5), le Sénégal comptait environ :", "18 millions d'habitants", ["8 millions", "30 millions", "50 millions"], "18 032 473 habitants selon l'ANSD (RGPH-5)."],
      ["La superficie du Sénégal est d'environ :", "196 722 km²", ["19 672 km²", "1 967 220 km²", "96 722 km²"], "Le Sénégal couvre 196 722 km², soit environ 2 fois la taille du Portugal."], ["Le Sénégal compte combien de régions administratives ?", "14", ["10", "11", "16"], "Dakar, Diourbel, Fatick, Kaffrine, Kaolack, Kédougou, Kolda, Louga, Matam, Saint-Louis, Sédhiou, Tambacounda, Thiès, Ziguinchor."]]),
    (r) => ({ q: "Le Sénégal a environ 18 millions d'habitants pour 196 722 km². Densité moyenne :", ok: "92 hab./km²", faux: ["9 hab./km²", "920 hab./km²", "18 hab./km²"], e: "18 032 473 ÷ 196 722 ≈ 92 habitants par km² (bien plus à Dakar, bien moins à l'est)." }),
    (r) => { const n = ri(r, 20, 90) * 1000, a = ri(r, 4, 40), d = n / a;
      return { q: `Une commune (exemple) compte ${F(n)} habitants sur ${a} km². Sa densité est d'environ :`, ok: `${F(d)} hab./km²`, faux: uniq(`${F(d)} hab./km²`, [`${F(n * a)} hab./km²`, `${F(d / 10)} hab./km²`, `${F(a)} hab./km²`]), e: `Densité = population ÷ surface = ${F(n)} ÷ ${a} ≈ ${F(d)} habitants par km².` }; },
    (r) => { const t = ri(r, 30, 45), n = pick(r, [30, 40, 50, 60]), f = Math.round((n * t) / 100);
      return { q: `Dans une classe de ${n} élèves, ${f} viennent à l'école à pied. Pourcentage (arrondi) :`, ok: `${Math.round((f * 100) / n)} %`, faux: uniq(`${Math.round((f * 100) / n)} %`, [`${f} %`, `${n - f} %`, `${Math.round(((n - f) * 100) / n)} %`]), e: `${f} ÷ ${n} × 100 ≈ ${Math.round((f * 100) / n)} %. C'est la méthode des enquêtes de l'ANSD.` }; },
    (r) => ({ q: "La population est passée d'environ 13,5 millions (2013) à 18 millions (2023). Hausse en pourcentage (environ) :", ok: "33 %", faux: ["4,5 %", "18 %", "133 %"], e: "(18,03 − 13,51) ÷ 13,51 ≈ 0,33, soit +33 % en 10 ans, environ +2,9 % par an." }),
  ];

  const THEMES = [
    { id: "marche", t: "Les maths au marché", i: "🛒", d: "Total, monnaie, sac ou détail, réductions", g: marche, lien: "Proportionnalité, pourcentages" },
    { id: "senelec", t: "Ma facture Senelec", i: "💡", d: "kWh, puissance des appareils, Woyofal, LED", g: senelec, lien: "PC : puissance et énergie" },
    { id: "eau", t: "Ma facture d'eau", i: "🚰", d: "Index du compteur, m³ et litres, fuites", g: eau, lien: "Volumes, conversions" },
    { id: "solaire", t: "L'énergie solaire", i: "☀️", d: "Production d'un panneau, besoins d'une maison, batterie", g: solaire, lien: "PC 3e et 1ère : énergie" },
    { id: "securite", t: "Électricité sans danger", i: "⚡", d: "Terre, disjoncteur, multiprise, électrocution", g: secu, lien: "PC : circuits électriques" },
    { id: "route", t: "Code de la route et physique", i: "🚗", d: "Temps de réaction, freinage, ceinture", g: route, lien: "PC : vitesse, énergie cinétique, inertie" },
    { id: "senegal", t: "Le Sénégal en chiffres", i: "📊", d: "Population, régions, densité, croissance", g: stats, lien: "Statistiques, pourcentages, géographie" },
  ];
  const mk = (th, n = 10) => {
    const out = [], seen = new Set();
    for (let k = 0; out.length < n && k < n * 8; k++) {
      const g = pick(Math.random, th.g)(Math.random);
      if (!g || seen.has(g.q)) continue;
      const c = [String(g.ok), ...g.faux.map(String)].slice(0, 4);
      if (c.length < 4 || new Set(c).size < 4) continue;
      seen.add(g.q);
      const o = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      out.push({ id: `vie-${th.id}-${out.length}-${Date.now()}`, s: "", q: g.q, c: o.map((i) => c[i]), a: o.indexOf(0), e: g.e, gen: true });
    }
    return out;
  };

  // ---------- 19 et 20. Pourquoi j'apprends ça ? Les métiers du chapitre
  const WHY = [
    [/(maths)/, /pythagore|trigono/i, "Vérifier qu'un mur est bien d'équerre (règle 3-4-5), calculer la longueur d'une échelle ou d'un toit.", ["maçon", "architecte", "géomètre-topographe"]],
    [/(maths)/, /thalès|agrandissement|réduction|échelle/i, "Lire un plan ou une carte, mesurer la hauteur d'un arbre ou d'un bâtiment avec son ombre.", ["architecte", "cartographe", "dessinateur en bâtiment"]],
    [/(maths)/, /proportionnal|pourcentage|statisti/i, "Comparer des prix, comprendre une réduction, une hausse, un sondage ou les résultats d'un examen.", ["commerçant", "comptable", "statisticien (ANSD)"]],
    [/(maths)/, /intégral|primitive|logarithme|exponentielle|complexe/i, "Calculer des aires, des volumes, la décroissance d'un médicament dans le sang, des signaux électriques.", ["ingénieur", "pharmacien", "chercheur"]],
    [/(maths)/, /fraction|décima|nombres|calcul|puissance|écriture scientifique|racine/i, "Partager, calculer un prix, convertir des unités, lire de très grands ou très petits nombres.", ["commerçant", "infirmier (doses de médicaments)", "ingénieur"]],
    [/(maths)/, /vecteur|repérage|barycentre|produit scalaire|géométrie|droite|cercle|aire|périmètre|volume|espace|angle|triangle|parallélogramme|transformation|symétrie/i, "Se repérer sur une carte, construire, découper, calculer une surface à carreler ou un volume d'eau.", ["menuisier", "géomètre", "pilote"]],
    [/(maths)/, /équation|inéquation|système|littéral|polynôme|second degré/i, "Trouver une quantité inconnue : un prix, une durée, le seuil de rentabilité d'un petit commerce.", ["économiste", "ingénieur", "programmeur"]],
    [/(maths)/, /fonction|affine|dérivation|dérivée|limite|étude/i, "Modéliser un tarif, une croissance, trouver le meilleur prix ou la plus petite dépense.", ["économiste", "ingénieur", "data analyst"]],
    [/(maths)/, /suite/i, "Calculer une épargne qui rapporte des intérêts, un crédit, une population qui augmente.", ["banquier", "actuaire", "démographe"]],
    [/(maths)/, /probabilit|dénombrement/i, "Évaluer un risque, comprendre les jeux de hasard, les assurances et les tests médicaux.", ["assureur", "statisticien", "médecin épidémiologiste"]],
    [/(pc)/, /électri|ohm|résistance|circuit|courant|condensateur|bobine|amplificateur|générateur/i, "Comprendre sa facture, choisir un câble, réparer un appareil, installer un panneau solaire.", ["électricien", "technicien Senelec", "ingénieur en énergie"]],
    [/(pc)/, /atome|ion|noyau|radioact|nucléaire/i, "Comprendre l'imagerie médicale, la datation des fossiles et l'énergie nucléaire.", ["radiologue", "chercheur", "technicien en radioprotection"]],
    [/(pc)/, /mécanique|mouvement|force|poids|vitesse|travail|énergie|cinématique|newton|pendule|chute|projectile/i, "Comprendre le freinage, la ceinture, l'effort pour soulever une charge, la sécurité sur la route.", ["mécanicien", "ingénieur", "pilote"]],
    [/(pc)/, /optique|lentille|lumière|réfraction|réflexion|onde|interférence/i, "Comprendre les lunettes, l'appareil photo, la fibre optique et la vue.", ["opticien", "ophtalmologue", "technicien télécoms"]],
    [/(pc)/, /mole|solution|concentration|acide|base|ph|chimi|réaction|oxydo|alcool|ester|organique|dosage|pile|électrolyse/i, "Doser un médicament, traiter l'eau, fabriquer du savon, comprendre la rouille et les piles.", ["pharmacien", "laborantin", "ingénieur chimiste (ICS, SAR)"]],
    [/(svt)/, /cellule|adn|gén|chromosome|hérédité|méiose|mitose/i, "Comprendre les maladies héréditaires (drépanocytose), les tests ADN et l'amélioration des semences.", ["médecin", "biologiste", "agronome (ISRA)"]],
    [/(svt)/, /immun|vih|paludisme|sang|circulation/i, "Comprendre les vaccins, se protéger du paludisme et des IST, donner son sang.", ["infirmier", "médecin", "sage-femme"]],
    [/(svt)/, /nutrition|digestion|respiration|glycémie|rein|excrétion|muscle/i, "Bien manger, comprendre le diabète, l'effort physique et la santé du corps.", ["nutritionniste", "médecin", "kinésithérapeute"]],
    [/(svt)/, /nerv|réflexe|synapse/i, "Comprendre les réflexes, l'effet de l'alcool et des drogues, le temps de réaction au volant.", ["neurologue", "infirmier", "kinésithérapeute"]],
    [/(svt)/, /reproduction humaine|puberté|hormon|grossesse/i, "Connaître son corps, la grossesse, la contraception et la prévention.", ["sage-femme", "gynécologue", "conseiller en santé"]],
    [/(svt)/, /géolog|tectonique|roche|sol|érosion|volcan|séisme/i, "Comprendre les séismes, les sols agricoles, les carrières et les nappes d'eau.", ["géologue", "ingénieur des mines", "agronome"]],
    [/(svt)/, /écosystème|biodiversité|environnement|climat|développement durable/i, "Protéger la mer, les forêts et les champs, lutter contre la sécheresse et le plastique.", ["environnementaliste", "agent des Eaux et Forêts", "agronome"]],
    [/(anglais)/, /anglais|present|past|perfect|modaux|conditionnel|passif|vocabulaire|prétérit|gérondif/i, "Voyager, lire sur internet, suivre des études ou travailler avec des étrangers.", ["guide touristique", "traducteur", "commercial international"]],
    [/(francais)/, /conjugaison|grammaire|orthographe|accord|fonctions|classes de mots|phrase|homophone|subordonnée/i, "Écrire une lettre, un CV, un message clair et sans fautes.", ["journaliste", "secrétaire", "avocat"]],
    [/(francais)/, /littérature|roman|poésie|théâtre|négritude|récit|conte|fable|épopée|registres|figures|argumentation|dissertation|commentaire|résumé/i, "S'exprimer, convaincre, comprendre les idées et la culture de son pays.", ["journaliste", "enseignant", "avocat"]],
    [/(histoire|hg)/, /guerre|révolution|colonial|décolonisation|indépendance|empire|royaume|résistance|histoire|traite|islam|antiquité|moyen âge|renaissance/i, "Comprendre d'où vient le Sénégal d'aujourd'hui et débattre de l'actualité.", ["enseignant", "journaliste", "diplomate"]],
    [/(geo|hg)/, /population|ville|migration|économi|activité|agriculture|intégration|puissance|mondialisation|coopération|états/i, "Comprendre l'emploi, les migrations, le commerce et le développement de son pays.", ["urbaniste", "économiste", "fonctionnaire international"]],
    [/(geo|hg)/, /carte|repérage|relief|climat|terre|continent|océan|sénégal/i, "Lire une carte, s'orienter, comprendre la météo et les saisons.", ["cartographe", "météorologue", "guide"]],
    [/(philo)/, /philo|conscience|morale|liberté|politique|état|connaissance|épistémologie|méthode/i, "Réfléchir par soi-même, débattre avec respect et faire des choix justes.", ["juriste", "enseignant", "journaliste"]],
    [/(compta)/, /compta|bilan|résultat|amortissement|journal|syscohada|partie double/i, "Tenir les comptes d'une boutique ou d'une entreprise, savoir si on gagne de l'argent.", ["comptable", "gestionnaire", "auditeur"]],
    [/(eco)/, /pib|marché|prix|inflation|monnaie|banque|emploi|chômage|impôt|commerce extérieur|agrégats|secteurs/i, "Comprendre les prix, les salaires, le crédit et les décisions de l'État.", ["économiste", "banquier", "fonctionnaire des finances"]],
  ];
  const BYSUB = [[/maths/, "Raisonner, calculer juste et résoudre des problèmes : utile dans tous les métiers techniques et le commerce.", ["ingénieur", "comptable", "enseignant de maths"]],
    [/pc/, "Comprendre les appareils, l'énergie, la santé et la sécurité dans la vie de tous les jours.", ["technicien", "ingénieur", "pharmacien"]],
    [/svt/, "Prendre soin de sa santé, de son alimentation et de l'environnement.", ["médecin", "infirmier", "agronome"]],
    [/francais/, "Bien lire, bien écrire et bien parler : indispensable pour les études et tous les métiers.", ["journaliste", "avocat", "enseignant"]],
    [/anglais/, "Communiquer avec le monde, lire sur internet et poursuivre ses études.", ["traducteur", "guide touristique", "commercial international"]],
    [/histoire|geo|hg/, "Comprendre son pays, le monde et l'actualité.", ["enseignant", "journaliste", "diplomate"]],
    [/espagnol/, "Parler une langue de plus de 20 pays : études, tourisme, commerce et coopération avec l'Espagne et l'Amérique latine.", ["guide touristique", "traducteur", "diplomate"]],
    [/philo/, "Penser par soi-même et argumenter avec rigueur.", ["juriste", "enseignant", "journaliste"]],
    [/eco|compta/, "Comprendre l'argent, l'entreprise et l'économie du pays.", ["comptable", "gestionnaire", "banquier"]]];
  globalThis.pourquoiCard = (title, sid = "") => {
    const w = WHY.find(([sr, re]) => sr.test(sid) && re.test(title)), b = BYSUB.find(([sr]) => sr.test(sid)), [txt, mets] = w ? w.slice(2) : b ? b.slice(1) : [];
    if (!txt) return "";
    return `<div class="card"><h2>🌍 Pourquoi j'apprends ça ?</h2><p>${txt}</p><p class="small"><b>Des métiers qui s'en servent :</b> ${mets.join(", ")}.</p></div>`;
  };

  // ---------- 75. Citation du jour
  const CIT = [["Armez-vous de science jusqu'aux dents.", "Cheikh Anta Diop"], ["L'éducation est l'arme la plus puissante que l'on puisse utiliser pour changer le monde.", "Nelson Mandela"], ["Cela semble toujours impossible, jusqu'à ce qu'on le fasse.", "Nelson Mandela"], ["En Afrique, quand un vieillard meurt, c'est une bibliothèque qui brûle.", "Amadou Hampâté Bâ"], ["Il faut oser inventer l'avenir.", "Thomas Sankara"], ["Ceux qui sont morts ne sont jamais partis.", "Birago Diop, Souffles"], ["Petit à petit, l'oiseau fait son nid.", "Proverbe"], ["Ndank ndank mooy jàpp golo ci ñaay : doucement, doucement, on attrape le singe dans la forêt.", "Proverbe wolof"], ["Si tu veux aller vite, marche seul ; si tu veux aller loin, marchons ensemble.", "Proverbe africain"], ["Le savoir est comme un baobab : une seule personne ne peut pas l'embrasser.", "Proverbe africain"], ["La patience est un arbre dont la racine est amère, mais dont les fruits sont très doux.", "Proverbe africain"], ["Je suis petit, mais je fais de mon mieux.", "Wangari Maathai, d'après la légende du colibri"], ["Un enfant, un enseignant, un livre et un stylo peuvent changer le monde.", "Malala Yousafzai"], ["Quand tu ne sais pas où tu vas, regarde d'où tu viens.", "Proverbe africain"], ["L'eau chaude n'oublie pas qu'elle a été froide.", "Proverbe africain"]];
  globalThis.citationCard = () => { const [c, a] = CIT[Math.floor(Date.now() / 864e5) % CIT.length]; return `<div class="card quote"><p class="small muted">Citation du jour</p><p><b>« ${c} »</b></p><p class="small muted">${a}</p></div>`; };

  // ---------- 76. Gestion du stress
  const STRESS = [["La veille de l'examen", ["Revois seulement tes fiches, pas de nouveau chapitre.", "Prépare ton sac : convocation, pièce d'identité, stylos, calculatrice, règle, eau.", "Dors au moins 8 heures : le cerveau range ce que tu as appris pendant le sommeil."]], ["Le jour J", ["Mange quelque chose avant de partir et arrive en avance.", "Lis tout le sujet, commence par l'exercice que tu maîtrises le mieux.", "Bloqué ? Passe à la question suivante et reviens-y à la fin."]], ["Pendant les révisions", ["Travaille par blocs de 25 minutes avec 5 minutes de pause (minuteur ci-dessous).", "Bouge un peu chaque jour : marche, football, danse.", "Parle à quelqu'un si l'angoisse devient trop forte : un parent, un professeur, un ami."]]];

  // ---------- Vues
  function viewVie(arg) {
    const th = THEMES.find((t) => t.id === arg);
    if (th) return chooseMode(th.t, `10 questions tirées de la vie de tous les jours · ${th.lien}`, (solo) => { markDone("qcm"); runQuiz(th.t, mk(th), "#vie", { solo }); });
    $view.innerHTML = `<h1>Les cours dans la vie</h1><p class="muted">Des problèmes du quotidien sénégalais avec les maths et la physique de l'école. Les nombres changent à chaque fois.</p>
      <div class="grid rub">${THEMES.map((t) => `<a class="subj tile" href="#vie/${t.id}"><span class="ico">${t.i}</span><b>${t.t}</b><span class="small muted">${t.d}</span></a>`).join("")}</div>
      <h2>Mes outils</h2>
      <div class="grid rub">${[["flash", "🃏", "Fiches flash", "Retourne les cartes, révise l'essentiel"], ["formules", "📐", "Formulaire", "Formules et repères à retenir, chapitre par chapitre"], ["moyenne", "🧮", "Simulateur de moyenne", "Combien me faut-il pour avoir mon examen ?"], ["minuteur", "⏲️", "Minuteur Pomodoro", "25 min de travail, 5 min de pause"], ["journal", "📓", "Mon journal", "Ce que j'ai compris aujourd'hui"], ["stress", "🌬️", "Gérer le stress", "Respiration, sommeil, jour J"]].map(([id, i, t, d]) => `<a class="subj tile" href="#outils/${id}"><span class="ico">${i}</span><b>${t}</b><span class="small muted">${d}</span></a>`).join("")}</div>`;
  }

  let pomo = null;
  function viewOutils(arg) {
    clearInterval(pomo);
    const back = `<a class="btn alt" href="#vie">Retour aux outils</a>`;
    // formulaire et fiches flash : même logique que le reste de l'appli, matière par matière et chapitre par chapitre
    const pick = (sids, cur, base) => sids.length > 1 ? `<div class="row onglets">${sids.map((s) => `<a class="btn alt small${s.id === cur ? " on" : ""}" href="#outils/${base}/${s.id}">${esc(s.name)}</a>`).join("")}</div>` : "";
    const nota = (sid, p) => ((DATA.notions || {})[sid] || []).find((n) => n.pch === p);
    if (arg && arg.startsWith("formules")) {
      const subs = subjectsOf(S.level).filter((s) => (DATA.formules || {})[s.id]), sid = arg.split("/")[1], cur = subs.find((s) => s.id === sid) || subs[0];
      if (!cur) { $view.innerHTML = `<h1>Formulaire</h1><div class="card"><p>Pas encore de formulaire pour ta classe.</p></div>${back}`; return; }
      const chs = DATA.formules[cur.id], nb = chs.reduce((a, c) => a + c.f.length, 0);
      $view.innerHTML = `<h1>Formulaire</h1><p class="muted">${esc(cur.name)} · ${chs.length} chapitres, ${nb} ${/maths|pc|svt|eco|compta/.test(cur.id) ? "formules et valeurs" : "repères à retenir"}, dans l'ordre du programme. Garde-le ouvert pendant tes exercices.</p>${pick(subs, cur.id, "formules")}
        <input class="field" id="fq" type="search" placeholder="Chercher dans toutes les matières (ex. : vitesse, Thalès)" aria-label="Chercher une formule">
        <div id="fl">${subs.flatMap((sb) => DATA.formules[sb.id].map((c) => { const n = nota(sb.id, c.p); return `<div class="card fch" data-s="${sb.id}"${sb.id === cur.id ? "" : " hidden"}><h2>${sb.id === cur.id ? "" : `<span class="small muted">${esc(sb.name)} · </span>`}${c.p + 1}. ${esc(c.t)}</h2><ul class="steps">${c.f.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>${n ? `<a class="small" href="#notion/${n.id}">📖 Revoir le cours de ce chapitre</a>` : ""}</div>`; })).join("")}</div>
        <p class="small muted" id="fv" hidden>Aucune formule trouvée.</p>${back}`;
      const norm = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      document.getElementById("fq").oninput = (e) => { const q = norm(e.target.value.trim()); let any = false;
        document.querySelectorAll("#fl .fch").forEach((card) => { let vis = 0; if (!q && card.dataset.s !== cur.id) { card.hidden = true; return; } const tit = norm(card.querySelector("h2").textContent).includes(q);
          card.querySelectorAll("li").forEach((li) => { const ok = !q || tit || norm(li.textContent).includes(q); li.hidden = !ok; vis += ok; }); card.hidden = !vis; any = any || !!vis; });
        document.getElementById("fv").hidden = any; };
      return;
    }
    if (arg === "stress") {
      $view.innerHTML = `<h1>Gérer le stress</h1><div class="card" style="text-align:center"><h2>Respiration carrée</h2><p class="small muted">Inspire 4 s, bloque 4 s, expire 4 s, bloque 4 s. Fais 5 tours.</p><p class="score" id="br">Prêt ?</p><button class="btn" id="go">Commencer</button></div>
        ${STRESS.map(([t, l]) => `<div class="card"><h2>${t}</h2><ul class="steps">${l.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}${back}`;
      document.getElementById("go").onclick = () => { const ph = ["Inspire", "Bloque", "Expire", "Bloque"]; let k = 0; clearInterval(pomo); const tick = () => { const el = document.getElementById("br"); if (!el) return clearInterval(pomo); el.textContent = k >= 80 ? "Bravo 👏" : `${ph[Math.floor(k / 4) % 4]} ${4 - (k % 4)}`; if (k++ >= 80) clearInterval(pomo); }; tick(); pomo = setInterval(tick, 1000); };
      return;
    }
    if (arg === "minuteur") {
      let left = 25 * 60, work = true, run = false;
      $view.innerHTML = `<h1>Minuteur Pomodoro</h1><div class="card" style="text-align:center"><p class="small muted" id="ph">Travail</p><p class="score" id="tm">25:00</p>
        <div class="btns"><button class="btn" id="st">Démarrer</button><button class="btn alt" id="rs">Recommencer</button></div>
        <p class="small muted">Après 25 minutes de travail, 5 minutes de pause. Pose ton téléphone pendant le travail.</p><p class="small">Blocs faits aujourd'hui : <b id="nb">${(S.pomo || {})[today()] || 0}</b></p></div>${back}`;
      const show = () => { const el = document.getElementById("tm"); if (!el) return clearInterval(pomo); el.textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`; document.getElementById("ph").textContent = work ? "Travail" : "Pause"; };
      document.getElementById("st").onclick = (e) => { run = !run; e.target.textContent = run ? "Pause" : "Reprendre"; clearInterval(pomo); if (run) pomo = setInterval(() => { left--; if (left <= 0) { if (work) { S.pomo = S.pomo || {}; S.pomo[today()] = (S.pomo[today()] || 0) + 1; store.save(); const nb = document.getElementById("nb"); if (nb) nb.textContent = S.pomo[today()]; } work = !work; left = (work ? 25 : 5) * 60; try { navigator.vibrate && navigator.vibrate([300, 100, 300]); } catch (x) {} } show(); }, 1000); };
      document.getElementById("rs").onclick = () => { clearInterval(pomo); run = false; work = true; left = 25 * 60; document.getElementById("st").textContent = "Démarrer"; show(); };
      return;
    }
    if (arg === "journal") {
      S.journal = S.journal || {};
      const days = Object.keys(S.journal).sort().reverse().filter((d) => d !== today()).slice(0, 14);
      $view.innerHTML = `<h1>Mon journal</h1><div class="card"><label for="jr"><b>Aujourd'hui, j'ai compris…</b></label><textarea id="jr" rows="5" style="width:100%;margin-top:8px" placeholder="Ex. : en maths, j'ai enfin compris le discriminant. Demain je revois les suites.">${esc(S.journal[today()] || "")}</textarea><p class="small muted" id="ok">Enregistré automatiquement.</p></div>
        ${days.map((d) => `<div class="card"><p class="small muted">${d}</p><p>${esc(S.journal[d])}</p></div>`).join("")}${back}`;
      document.getElementById("jr").oninput = (e) => { S.journal[today()] = e.target.value; store.save(); };
      return;
    }
    if (arg === "moyenne") {
      const key = /Tle/.test(S.level) ? "bac" : "bfem";
      const base = (S.moy && S.moy[key]) || subjectsOf(S.level).filter((s) => !/annales/.test(s.id)).map((s) => [s.name, "", 2]);
      $view.innerHTML = `<h1>Simulateur de moyenne</h1><p class="muted">Mets tes notes (ou tes notes espérées) et les coefficients de ta série. Vérifie les coefficients officiels auprès de ton établissement.</p>
        <div class="card" id="rows">${base.map(([m, n, c], i) => `<div class="row" style="gap:8px"><span style="flex:1;min-width:0">${esc(m)}</span><input id="n${i}" type="number" min="0" max="20" step="0.25" value="${n}" placeholder="note" style="width:70px"><input id="c${i}" type="number" min="0" max="10" step="1" value="${c}" style="width:56px" aria-label="coefficient"></div>`).join("")}
        <p class="small muted">Colonnes : note sur 20, puis coefficient.</p></div>
        <div class="card" style="text-align:center"><p class="small muted">Moyenne</p><p class="score" id="moy">–</p><p id="need" class="small"></p></div>${back}`;
      const calc = () => { let s = 0, c = 0, cMiss = 0; const rows = base.map(([m], i) => { const n = parseFloat(document.getElementById("n" + i).value), k = parseFloat(document.getElementById("c" + i).value) || 0; if (!isNaN(n)) { s += n * k; c += k; } else cMiss += k; return [m, isNaN(n) ? "" : n, k]; });
        S.moy = S.moy || {}; S.moy[key] = rows; store.save();
        document.getElementById("moy").textContent = c ? `${nf(s / c, 2)} / 20` : "–";
        const need = cMiss ? (10 * (c + cMiss) - s) / cMiss : null;
        document.getElementById("need").textContent = cMiss ? (need <= 0 ? "Avec ces notes, tu as déjà 10 de moyenne, même avec 0 dans les matières vides." : need > 20 ? "Même avec 20 partout ailleurs, 10 de moyenne n'est pas atteint : il faut remonter des notes." : `Pour avoir 10 de moyenne, il te faut au moins ${nf(need, 2)} / 20 en moyenne dans les matières encore vides.`) : (c ? (s / c >= 10 ? "Admis avec ces notes (10 ou plus)." : "En dessous de 10 : vise les matières à gros coefficient.") : ""); };
      $view.querySelectorAll("input").forEach((x) => (x.oninput = calc)); calc();
      return;
    }
    if (arg && arg.startsWith("flash")) {
      const subs = subjectsOf(S.level).filter((s) => !/annales/.test(s.id) && (DATA.fiches || {})[s.id]), [, sid, chp] = arg.split("/"), cur = subs.find((s) => s.id === sid);
      const chList = cur ? (DATA.programmes[cur.id] || []).map((t, p) => ({ t, p })).filter((c) => DATA.fiches[cur.id].some((f) => f.p === c.p)) : [];
      const cards = (cur ? [cur] : subs).flatMap((s) => DATA.fiches[s.id].filter((c) => chp === undefined || c.p === +chp).flatMap((c) => c.cles.map((k) => ({ s: s.name, t: c.t, k }))));
      if (!cards.length) { $view.innerHTML = `<h1>Fiches flash</h1><div class="card"><p>Pas encore de fiches pour ta classe.</p></div>${back}`; return; }
      const choix = `<div class="row onglets"><a class="btn alt small${cur ? "" : " on"}" href="#outils/flash">Tout</a>${subs.map((s) => `<a class="btn alt small${cur && s.id === cur.id ? " on" : ""}" href="#outils/flash/${s.id}">${esc(s.name)}</a>`).join("")}</div>
        ${cur ? `<select class="field" id="fch" aria-label="Chapitre"><option value="">Tous les chapitres</option>${chList.map((c) => `<option value="${c.p}"${String(c.p) === chp ? " selected" : ""}>${c.p + 1}. ${esc(c.t)}</option>`).join("")}</select>` : ""}`;
      let i = Math.floor(Math.random() * cards.length), flip = false;
      const draw = () => { const c = cards[i], cut = c.k.indexOf(" : "), front = cut > 3 && cut < 70 ? c.k.slice(0, cut) + " : ?" : `${c.t} : que dois-tu retenir ?`;
        $view.innerHTML = `<h1>Fiches flash</h1>${choix}<p class="small muted">${esc(c.s)} · ${esc(c.t)}</p><button class="card flash" id="fc" style="width:100%;min-height:180px;text-align:center;font:inherit;cursor:pointer"><p class="small muted">${flip ? "Réponse" : "Question · touche pour retourner"}</p><p><b>${esc(flip ? c.k : front)}</b></p></button>
          <div class="btns"><button class="btn" id="nx">Carte suivante</button></div><p class="small muted">${cards.length} cartes${chp !== undefined ? " pour ce chapitre" : cur ? ` en ${esc(cur.name)}` : " pour ta classe"}, tirées des synthèses.</p>${back}`;
        const sel = document.getElementById("fch"); if (sel) sel.onchange = () => go(`outils/flash/${cur.id}${sel.value === "" ? "" : "/" + sel.value}`);
        document.getElementById("fc").onclick = () => { flip = !flip; draw(); };
        document.getElementById("nx").onclick = () => { i = Math.floor(Math.random() * cards.length); flip = false; draw(); }; };
      draw();
      return;
    }
    go("vie");
  }
  globalThis.viewVie = viewVie;
  globalThis.viewOutils = viewOutils;
  globalThis.VIE_THEMES = THEMES;
  globalThis.vieQuestions = mk;
})();
