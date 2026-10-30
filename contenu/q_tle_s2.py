# QCM de terminale S, lot 2 : physique-chimie (volume ×5, questions nouvelles).
from q_tle_plus import _q

QCM_TLE_S2 = {
  "tle-pc": {
    "P1. Cinématique du point": _q([
      ("x(t) = 2t² − 3t + 1 (m) : vitesse à t = 2 s :", "5 m/s", "3 m/s", "8 m/s", "1 m/s", "v = 4t − 3."),
      ("Accélération pour ce mouvement :", "4 m/s²", "2 m/s²", "−3 m/s²", "0", "a = dv/dt."),
      ("Un mouvement circulaire uniforme a une accélération :", "centripète, de valeur v²/R", "nulle", "tangentielle", "égale à g", "Accélération normale."),
      ("Mouvement uniformément décéléré : a et v sont :", "de sens contraires", "de même sens", "nuls", "perpendiculaires", "a · v < 0."),
    ]),
    "P2. Bases de la dynamique et énergie": _q([
      ("Théorème du centre d'inertie :", "ΣF = m a_G", "ΣF = m v", "ΣF = 0 toujours", "F = m g h", "2e loi de Newton."),
      ("Théorème de l'énergie cinétique :", "ΔEc = somme des travaux des forces", "Ec = mgh", "ΔEc = 0 toujours", "Ec = ½ m a²", "Entre deux instants."),
      ("Travail du poids d'un corps de 2 kg qui descend de 5 m (g = 10) :", "100 J", "−100 J", "10 J", "50 J", "W = mgh."),
      ("Une force perpendiculaire au déplacement a un travail :", "nul", "maximal", "négatif", "infini", "cos 90° = 0."),
    ]),
    "P3. Mouvements dans les champs de pesanteur et électrique uniformes": _q([
      ("Projectile lancé avec v₀ et α : la trajectoire est :", "une parabole", "une droite", "un cercle", "une hélice", "Mouvement dans g uniforme."),
      ("La portée est maximale pour α =", "45°", "30°", "60°", "90°", "sin 2α = 1."),
      ("Force sur une charge q dans un champ E :", "F = qE", "F = q/E", "F = qvB", "F = mg", "Force électrique."),
      ("Un électron entre entre deux plaques parallèles avec v₀ perpendiculaire à E : sa trajectoire est :", "parabolique", "rectiligne", "circulaire", "hélicoïdale", "Analogue au projectile."),
    ]),
    "P4. Gravitation universelle et satellites": _q([
      ("Vitesse d'un satellite en orbite circulaire de rayon r :", "v = √(GM/r)", "v = GM/r", "v = √(gr²)", "v = 2πr", "Mouvement circulaire uniforme."),
      ("Troisième loi de Kepler :", "T²/r³ = constante", "T/r = constante", "T² r³ = constante", "T = r", "4π²/GM."),
      ("Un satellite géostationnaire a une période de :", "24 h environ", "1 h", "365 jours", "12 min", "Tourne avec la Terre."),
      ("Si r double, la force gravitationnelle est :", "divisée par 4", "divisée par 2", "doublée", "inchangée", "F en 1/r²."),
    ]),
    "P5. Particule chargée dans un champ magnétique": _q([
      ("Force de Lorentz :", "F = qv ∧ B", "F = qE", "F = BIL", "F = mg", "Produit vectoriel."),
      ("Rayon de la trajectoire circulaire :", "R = mv/(|q|B)", "R = qB/mv", "R = mvB", "R = v/B", "Mouvement circulaire uniforme."),
      ("La force de Lorentz a un travail :", "nul", "positif", "négatif", "égal à qvB", "Toujours perpendiculaire à v."),
      ("Le spectrographe de masse sépare les ions selon :", "leur masse (rayon différent)", "leur couleur", "leur température", "leur volume", "R dépend de m."),
    ]),
    "P6. Loi de Laplace": _q([
      ("Force de Laplace sur un conducteur de longueur L :", "F = I L B sin α", "F = qvB", "F = BIL²", "F = I/B", "α entre conducteur et B."),
      ("I = 5 A, L = 0,1 m, B = 0,2 T, conducteur perpendiculaire à B : F =", "0,1 N", "1 N", "0,01 N", "10 N", "5 × 0,1 × 0,2."),
      ("Le sens de la force de Laplace se trouve avec :", "la règle des trois doigts de la main droite", "la loi d'Ohm", "la loi de Lenz", "le théorème de Thalès", "Ou produit vectoriel I L ∧ B."),
      ("Application de la force de Laplace :", "le moteur électrique", "la pile", "la lampe", "le thermomètre", "Conversion électrique → mécanique."),
    ]),
    "P7. Induction et auto-induction": _q([
      ("f.é.m. induite :", "e = −dΦ/dt", "e = Φ t", "e = dI/dt", "e = RI", "Loi de Faraday."),
      ("Flux à travers une bobine de N spires :", "Φ = N B S cos θ", "Φ = B/S", "Φ = N I", "Φ = BS²", "Définition."),
      ("Tension aux bornes d'une bobine idéale :", "u = L di/dt", "u = Ri", "u = q/C", "u = L i", "Auto-induction."),
      ("Énergie stockée dans une bobine :", "½ L i²", "½ C u²", "L i", "Ri²", "Énergie magnétique."),
    ]),
    "P8. Dipôle RC": _q([
      ("Constante de temps d'un dipôle RC :", "τ = RC", "τ = R/C", "τ = 1/RC", "τ = √(RC)", "Unité : seconde."),
      ("R = 1 kΩ, C = 100 µF : τ =", "0,1 s", "1 s", "10 s", "0,01 s", "1 000 × 100 × 10⁻⁶."),
      ("Au bout de τ, le condensateur est chargé à :", "63 %", "37 %", "100 %", "50 %", "1 − e⁻¹."),
      ("Énergie stockée dans un condensateur :", "½ C u²", "½ L i²", "C u", "u/C", "Énergie électrique."),
    ]),
    "P9. Oscillations électriques libres": _q([
      ("Période propre d'un circuit LC :", "T₀ = 2π√(LC)", "T₀ = 2πLC", "T₀ = √(L/C)", "T₀ = RC", "Formule de Thomson."),
      ("Dans un circuit LC idéal, l'énergie totale :", "se conserve", "diminue", "augmente", "est nulle", "Pas de résistance."),
      ("Avec une résistance, les oscillations sont :", "amorties", "entretenues", "forcées", "infinies", "Pertes par effet Joule."),
      ("Équation différentielle de q dans LC :", "q'' + q/(LC) = 0", "q' + q/RC = 0", "q'' = 0", "q'' − q/LC = 0", "Oscillateur harmonique."),
    ]),
    "P10. Oscillations électriques forcées (RLC)": _q([
      ("À la résonance d'intensité, la fréquence vaut :", "la fréquence propre f₀", "0", "2f₀", "l'infini", "f = 1/(2π√LC)."),
      ("À la résonance, l'impédance Z est :", "minimale et égale à R", "maximale", "nulle", "égale à Lω", "Z = R."),
      ("Impédance d'un RLC série :", "Z = √(R² + (Lω − 1/Cω)²)", "Z = R + L + C", "Z = RLC", "Z = R/LC", "Formule."),
      ("Facteur de puissance :", "cos φ = R/Z", "cos φ = Z/R", "cos φ = Lω", "cos φ = 1/Z", "Puissance moyenne P = UI cos φ."),
    ]),
    "P11. Oscillateurs mécaniques": _q([
      ("Période d'un pendule élastique :", "T₀ = 2π√(m/k)", "T₀ = 2π√(k/m)", "T₀ = mk", "T₀ = 2πm/k", "Ressort de raideur k."),
      ("Période d'un pendule simple (petites oscillations) :", "T₀ = 2π√(ℓ/g)", "T₀ = 2π√(g/ℓ)", "T₀ = ℓ/g", "T₀ = 2πℓ", "Indépendante de la masse."),
      ("m = 0,1 kg, k = 10 N/m : ω₀ =", "10 rad/s", "100 rad/s", "1 rad/s", "0,1 rad/s", "√(k/m) = √100."),
      ("Énergie mécanique d'un pendule élastique sans frottement :", "½ k Xm²", "½ k x", "k x²", "m g x", "Constante."),
    ]),
    "P12. Interférences lumineuses": _q([
      ("Interfrange :", "i = λD/a", "i = a/λD", "i = λa/D", "i = D/a", "Fentes d'Young."),
      ("λ = 600 nm, D = 2 m, a = 1 mm : i =", "1,2 mm", "0,6 mm", "12 mm", "0,3 mm", "600 × 10⁻⁹ × 2 / 10⁻³."),
      ("Frange brillante si la différence de marche δ =", "kλ", "(k + ½)λ", "0 seulement", "λ/4", "Interférence constructive."),
      ("Condition pour observer des interférences :", "deux sources cohérentes", "deux lampes différentes", "une lumière blanche seule", "aucune source", "Même fréquence, déphasage constant."),
    ]),
    "P13. Effet photoélectrique": _q([
      ("Énergie d'un photon :", "E = hν", "E = mc²", "E = h/ν", "E = ½ mv²", "Relation de Planck-Einstein."),
      ("L'effet photoélectrique a lieu si :", "ν ≥ ν₀ (fréquence seuil)", "l'intensité est forte", "la lumière est rouge", "toujours", "Seuil photoélectrique."),
      ("Énergie cinétique maximale de l'électron émis :", "Ec = hν − W₀", "Ec = W₀ − hν", "Ec = hν", "Ec = W₀", "Einstein."),
      ("Augmenter l'intensité lumineuse (ν > ν₀) augmente :", "le nombre d'électrons émis", "l'énergie de chaque électron", "le seuil", "la constante de Planck", "Plus de photons."),
    ]),
    "P14. Niveaux d'énergie de l'atome": _q([
      ("Niveaux de l'hydrogène :", "Eₙ = −13,6/n² eV", "Eₙ = 13,6 n eV", "Eₙ = −13,6 n² eV", "Eₙ = 0", "Modèle de Bohr."),
      ("Énergie d'ionisation de l'hydrogène (état fondamental) :", "13,6 eV", "3,4 eV", "1,51 eV", "0 eV", "Passage de n = 1 à l'infini."),
      ("Transition n = 2 → n = 1 : énergie du photon émis :", "10,2 eV", "13,6 eV", "3,4 eV", "6,8 eV", "−3,4 − (−13,6)."),
      ("Le spectre d'émission d'un atome est :", "un spectre de raies", "continu", "toujours blanc", "invisible", "Niveaux quantifiés."),
    ]),
    "P15. Réactions nucléaires": _q([
      ("Loi de décroissance radioactive :", "N = N₀ e^(−λt)", "N = N₀ λt", "N = N₀/t", "N = N₀ + λt", "Décroissance exponentielle."),
      ("Demi-vie :", "t½ = ln 2/λ", "t½ = λ/ln 2", "t½ = 2λ", "t½ = 1/λ²", "N = N₀/2."),
      ("Après 3 demi-vies, il reste :", "1/8 des noyaux", "1/3", "1/6", "1/9", "(1/2)³."),
      ("Équivalence masse-énergie :", "E = Δm c²", "E = mc", "E = ½ mv²", "E = mgh", "Einstein."),
    ]),
    "C1. Les alcools": _q([
      ("Classe du propan-2-ol :", "alcool secondaire", "alcool primaire", "alcool tertiaire", "phénol", "Le carbone fonctionnel porte 2 carbones."),
      ("2-méthylpropan-2-ol est un alcool :", "tertiaire", "primaire", "secondaire", "quaternaire", "Carbone fonctionnel lié à 3 carbones."),
      ("Déshydratation intramoléculaire d'un alcool donne :", "un alcène", "un ester", "un acide", "une amine", "Élimination d'eau."),
      ("Alcool + acide carboxylique ⇌ ester + eau : c'est :", "une estérification", "une saponification", "une oxydation", "une hydrolyse", "Réaction lente, limitée."),
    ]),
    "C2. Amines et acides α-aminés": _q([
      ("Formule générale d'une amine primaire :", "R−NH₂", "R−OH", "R−COOH", "R−NH−R'", "Un seul groupe sur N."),
      ("Les amines ont un caractère :", "basique", "acide", "neutre", "oxydant", "Doublet libre de l'azote."),
      ("Un acide α-aminé possède :", "un groupe −COOH et un groupe −NH₂ sur le même carbone", "deux groupes −OH", "un groupe ester", "un cycle benzénique", "Carbone α."),
      ("Deux acides α-aminés s'unissent par :", "une liaison peptidique", "une liaison hydrogène", "une liaison ionique", "une liaison ester", "−CO−NH−."),
    ]),
    "C3. Acides carboxyliques et dérivés": _q([
      ("Groupe fonctionnel d'un acide carboxylique :", "−COOH", "−OH", "−CHO", "−NH₂", "Carboxyle."),
      ("Ester + soude → alcool + ion carboxylate : c'est :", "une saponification", "une estérification", "une hydratation", "une oxydation", "Réaction totale, savons."),
      ("Un chlorure d'acyle réagit avec un alcool de façon :", "rapide et totale", "lente et limitée", "nulle", "réversible seulement", "Réactif très réactif."),
      ("Nom de CH₃−COOH :", "acide éthanoïque", "acide méthanoïque", "éthanol", "éthanal", "2 carbones."),
    ]),
    "C4. Cinétique chimique": _q([
      ("Vitesse volumique de formation d'un produit :", "v = d[P]/dt", "v = [P] t", "v = −d[P]/dt", "v = [P]/t²", "Dérivée de la concentration."),
      ("Un facteur cinétique :", "la température", "la couleur du flacon", "le volume du laboratoire", "l'heure", "Ainsi que concentration et catalyseur."),
      ("Un catalyseur :", "accélère la réaction sans être consommé", "change l'état final", "est un réactif", "ralentit toujours", "Définition."),
      ("Le temps de demi-réaction est la durée pour atteindre :", "la moitié de l'avancement final", "la fin de la réaction", "la moitié du volume", "le début", "x = x_f/2."),
    ]),
    "C5. Autoprotolyse de l'eau, pH et indicateurs": _q([
      ("Produit ionique de l'eau à 25 °C :", "Ke = 10⁻¹⁴", "Ke = 10⁻⁷", "Ke = 1", "Ke = 14", "[H₃O⁺][OH⁻]."),
      ("pH = 3 : [H₃O⁺] =", "10⁻³ mol/L", "3 mol/L", "10³ mol/L", "10⁻¹¹ mol/L", "pH = −log[H₃O⁺]."),
      ("Une solution de pH 9 à 25 °C est :", "basique", "acide", "neutre", "impossible", "pH > 7."),
      ("Un indicateur coloré change de teinte autour de :", "son pKa (zone de virage)", "pH = 0", "pH = 14", "n'importe quel pH", "pKa ± 1."),
    ]),
    "C6. Acides forts et bases fortes": _q([
      ("pH d'une solution de HCl à 10⁻² mol/L :", "2", "12", "10⁻²", "7", "pH = −log C."),
      ("pH d'une solution de NaOH à 10⁻³ mol/L :", "11", "3", "7", "10⁻³", "pH = 14 + log C."),
      ("À l'équivalence d'un dosage acide fort / base forte, pH =", "7", "0", "14", "pKa", "Solution neutre (NaCl)."),
      ("Un acide fort dans l'eau est :", "totalement dissocié", "partiellement dissocié", "insoluble", "toujours dilué", "Réaction totale."),
    ]),
    "C7. Acides faibles, bases faibles et pKa": _q([
      ("Relation de Henderson :", "pH = pKa + log([A⁻]/[AH])", "pH = pKa − [A⁻]", "pH = log Ka", "pH = [AH]/[A⁻]", "Couple AH/A⁻."),
      ("Si pH = pKa, alors :", "[A⁻] = [AH]", "[A⁻] = 0", "[AH] = 0", "pH = 7", "log 1 = 0."),
      ("Plus le pKa est petit, plus l'acide est :", "fort", "faible", "basique", "neutre", "Ka grand."),
      ("Si pH > pKa, l'espèce prédominante est :", "la base A⁻", "l'acide AH", "l'eau", "aucune", "Diagramme de prédominance."),
    ]),
    "C8. Dosages et solutions tampons": _q([
      ("À la demi-équivalence d'un dosage acide faible / base forte :", "pH = pKa", "pH = 7", "pH = 14", "pH = 0", "[AH] = [A⁻]."),
      ("Une solution tampon :", "modère les variations de pH", "a toujours pH 7", "est une base forte", "change fortement de pH", "Définition."),
      ("Relation à l'équivalence :", "Ca Va = Cb Vbe", "Ca = Cb", "Va = Vbe", "Ca Vbe = Cb Va", "Quantités stœchiométriques."),
      ("À l'équivalence d'un dosage acide faible par base forte, le pH est :", "supérieur à 7", "égal à 7", "inférieur à 7", "égal au pKa", "Base faible A⁻ en solution."),
    ]),
  },
}
