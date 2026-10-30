# Notions de cours détaillées pour les autres classes (6e, 5e, 4e, 2nde, 1ère) et la série G.
# Même format que notions.py.

from notions import _svg, _t

FILL = ' fill="currentColor" fill-opacity=".25"'
SVG_FRACTION = _svg(
    ''.join(f'<rect x="{20 + 52 * i}" y="40" width="52" height="50"{FILL if i < 3 else ""}/>' for i in range(5))
    + _t(150, 120, "3 parts sur 5 : 3/5"))

SVG_AIRES = _svg(
    '<rect x="20" y="40" width="110" height="70"/><polygon points="160,110 280,110 220,40"/>'
    '<line x1="220" y1="40" x2="220" y2="110" stroke-dasharray="4 4"/>'
    + _t(75, 150, "aire = L × l") + _t(220, 150, "aire = (b × h) / 2") + _t(228, 80, "h", "start") + _t(220, 126, "b") + _t(75, 126, "L") + _t(10, 80, "l", "start"))

SVG_REPERE = _svg(
    '<line x1="20" y1="90" x2="280" y2="90"/>'
    + ''.join(f'<line x1="{30 + 30 * i}" y1="84" x2="{30 + 30 * i}" y2="96"/>' + _t(30 + 30 * i, 116, str(i - 4).replace("-", "−")) for i in range(9))
    + '<circle cx="60" cy="90" r="5" fill="currentColor"/><circle cx="210" cy="90" r="5" fill="currentColor"/>'
    + _t(60, 70, "A (−3)") + _t(210, 70, "B (+2)"))

SVG_MASSE_VOL = _svg(
    '<rect x="40" y="50" width="70" height="90"/><path d="M40,80 L110,80" stroke-dasharray="4 4"/>'
    '<rect x="170" y="70" width="90" height="70"/>'
    + _t(75, 40, "volume V") + _t(215, 60, "balance : masse m") + _t(150, 168, "ρ = m / V"))

NOTIONS_AUTRES = {
  "6e-maths": [
    {"id": "6e-fractions", "title": "Les fractions", "svg": SVG_FRACTION,
     "cours": ["Une fraction a/b (b ≠ 0) représente a parts d'une unité partagée en b parts égales. a est le numérateur, b le dénominateur.",
               "Une fraction est aussi le quotient de a par b : 3/4 = 3 ÷ 4 = 0,75."],
     "enonce": ["On ne change pas une fraction en multipliant ou divisant le numérateur et le dénominateur par un même nombre non nul : 2/3 = 4/6 = 10/15.",
                "Simplifier : diviser le haut et le bas par un diviseur commun. 12/18 = 2/3 (on divise par 6).",
                "Comparer : avec le même dénominateur, la plus grande fraction a le plus grand numérateur.",
                "Additionner : on met au même dénominateur, puis on additionne les numérateurs. 1/4 + 2/4 = 3/4."],
     "exemples": [("Prendre une fraction d'une quantité", ["Les 3/5 de 40 élèves : 40 ÷ 5 = 8, puis 8 × 3 = 24 élèves."])],
     "exo": {"context": "Une classe de 6e compte 45 élèves. Les 2/5 sont des garçons.",
             "steps": [
               ("Combien y a-t-il de garçons ?", ["18", "9", "27", "20"], 0, "45 ÷ 5 = 9, puis 9 × 2 = 18.", 1),
               ("Quelle fraction de la classe représentent les filles ?", ["3/5", "2/5", "5/3", "1/2"], 0, "5/5 − 2/5 = 3/5.", 1),
               ("Simplifie 18/45.", ["2/5", "3/5", "6/15 (déjà simplifiée)", "1/3"], 0, "18 = 9 × 2 et 45 = 9 × 5 : on divise par 9.", 1),
               ("Calcule 1/3 + 1/6.", ["1/2", "2/9", "2/6", "1/9"], 0, "1/3 = 2/6, donc 2/6 + 1/6 = 3/6 = 1/2.", 1)]}},
    {"id": "6e-aires", "title": "Périmètres et aires", "svg": SVG_AIRES,
     "cours": ["Le périmètre est la longueur du tour d'une figure (en cm, m…). L'aire est la mesure de la surface intérieure (en cm², m²…).",
               "Ne pas confondre : on additionne des longueurs pour un périmètre, on multiplie pour une aire."],
     "enonce": ["Carré de côté c : périmètre 4c ; aire c × c.",
                "Rectangle : périmètre 2 × (L + l) ; aire L × l.",
                "Triangle : aire (base × hauteur) / 2.",
                "Cercle de rayon r : périmètre 2 × π × r ; disque : aire π × r² (π ≈ 3,14).",
                "1 m² = 100 dm² = 10 000 cm²."],
     "exemples": [("Un jardin rectangulaire", ["L = 12 m et l = 5 m.", "Périmètre = 2 × (12 + 5) = 34 m ; aire = 12 × 5 = 60 m²."])],
     "exo": {"context": "Un terrain rectangulaire mesure 20 m de long et 15 m de large. On veut l'entourer d'un grillage et y semer du gazon.",
             "steps": [
               ("Longueur de grillage nécessaire :", ["70 m", "35 m", "300 m", "50 m"], 0, "Périmètre = 2 × (20 + 15) = 70 m.", 1),
               ("Aire du terrain :", ["300 m²", "70 m²", "35 m²", "600 m²"], 0, "20 × 15 = 300 m².", 1),
               ("Un sac de semence couvre 25 m². Nombre de sacs :", ["12", "10", "15", "25"], 0, "300 ÷ 25 = 12 sacs.", 1),
               ("Aire d'un disque de rayon 10 m (π ≈ 3,14) :", ["314 m²", "62,8 m²", "31,4 m²", "100 m²"], 0, "3,14 × 10 × 10 = 314 m².", 1)]}},
  ],
  "5e-maths": [
    {"id": "5e-relatifs", "title": "Les nombres relatifs", "svg": SVG_REPERE,
     "cours": ["Un nombre relatif est positif (+) ou négatif (−). On les place sur une droite graduée de part et d'autre de 0.",
               "Exemples de la vie courante : températures, altitudes, soldes d'un compte."],
     "enonce": ["Deux nombres opposés ont la même distance à zéro et des signes contraires : 5 et −5.",
                "Addition de deux nombres de même signe : on garde le signe et on additionne les distances à zéro. (−3) + (−4) = −7.",
                "Signes contraires : on prend le signe de celui qui a la plus grande distance à zéro et on soustrait. (−7) + 4 = −3.",
                "Soustraire un nombre, c'est ajouter son opposé : 2 − (−5) = 2 + 5 = 7.",
                "Distance entre A et B sur une droite graduée = abscisse la plus grande − abscisse la plus petite."],
     "exemples": [("Température", ["Le matin il fait −2 °C, l'après-midi 9 °C.", "Écart : 9 − (−2) = 11 °C."])],
     "exo": {"context": "Sur une droite graduée, A a pour abscisse −3 et B a pour abscisse +2.",
             "steps": [
               ("Calcule (−3) + 2.", ["−1", "1", "−5", "5"], 0, "Signes contraires : 3 − 2 = 1, signe de −3, donc −1.", 1),
               ("Calcule la distance AB.", ["5", "1", "−5", "−1"], 0, "2 − (−3) = 2 + 3 = 5.", 1),
               ("Calcule (−6) + (−8).", ["−14", "14", "−2", "2"], 0, "Même signe : 6 + 8 = 14, signe −.", 1),
               ("Calcule 4 − 10.", ["−6", "6", "14", "−14"], 0, "4 + (−10) = −6.", 1)]}},
    {"id": "5e-proportionnalite", "title": "La proportionnalité", "svg": None,
     "cours": ["Deux grandeurs sont proportionnelles quand on passe de l'une à l'autre en multipliant toujours par le même nombre, le coefficient de proportionnalité.",
               "La proportionnalité sert pour les prix, les recettes, les échelles de cartes et les pourcentages."],
     "enonce": ["Dans un tableau de proportionnalité, les quotients sont tous égaux.",
                "Règle de trois (produit en croix) : si a/b = c/d, alors a × d = b × c, donc d = b × c / a.",
                "Pourcentage : t % de x = x × t / 100.",
                "Échelle = distance sur le plan / distance réelle (dans la même unité)."],
     "exemples": [("Prix du riz", ["5 kg coûtent 2 000 F. Prix de 8 kg ?", "1 kg coûte 2 000 ÷ 5 = 400 F, donc 8 kg coûtent 8 × 400 = 3 200 F."])],
     "exo": {"context": "Au marché, 3 kg de mangues coûtent 1 500 F.",
             "steps": [
               ("Prix d'un kilogramme :", ["500 F", "450 F", "300 F", "4 500 F"], 0, "1 500 ÷ 3 = 500 F.", 1),
               ("Prix de 7 kg :", ["3 500 F", "2 100 F", "10 500 F", "3 000 F"], 0, "7 × 500 = 3 500 F.", 1),
               ("Le vendeur fait une remise de 10 % sur 3 500 F. Montant de la remise :", ["350 F", "35 F", "3 150 F", "10 F"], 0, "3 500 × 10 / 100 = 350 F.", 1),
               ("Prix à payer après la remise :", ["3 150 F", "3 500 F", "3 850 F", "350 F"], 0, "3 500 − 350 = 3 150 F.", 1)]}},
  ],
  "4e-maths": [
    {"id": "4e-puissances", "title": "Les puissances", "svg": None,
     "cours": ["aⁿ (lu « a puissance n ») est le produit de n facteurs égaux à a : 2⁴ = 2 × 2 × 2 × 2 = 16.",
               "Les puissances de 10 servent à écrire les très grands et très petits nombres (écriture scientifique)."],
     "enonce": ["aᵐ × aⁿ = aᵐ⁺ⁿ ; aᵐ / aⁿ = aᵐ⁻ⁿ ; (aᵐ)ⁿ = aᵐⁿ ; (ab)ⁿ = aⁿ bⁿ.",
                "a⁰ = 1 (a ≠ 0) ; a⁻ⁿ = 1/aⁿ.",
                "Écriture scientifique : a × 10ⁿ avec 1 ≤ a < 10. Exemple : 45 000 = 4,5 × 10⁴ ; 0,003 = 3 × 10⁻³."],
     "exemples": [("Simplifier", ["10⁵ × 10⁻² = 10³ = 1 000.", "(2³)² = 2⁶ = 64."])],
     "exo": {"context": "Calcule et simplifie.",
             "steps": [
               ("3² × 3³ =", ["3⁵", "3⁶", "9⁵", "6⁵"], 0, "On additionne les exposants : 2 + 3 = 5.", 1),
               ("10⁷ / 10⁴ =", ["10³", "10¹¹", "10²⁸", "1³"], 0, "On soustrait les exposants : 7 − 4 = 3.", 1),
               ("5⁰ =", ["1", "0", "5", "50"], 0, "Toute puissance d'exposant 0 vaut 1 (base non nulle).", 1),
               ("Écriture scientifique de 0,000 72 :", ["7,2 × 10⁻⁴", "72 × 10⁻⁶", "7,2 × 10⁴", "0,72 × 10⁻³"], 0, "On déplace la virgule de 4 rangs vers la droite : exposant −4.", 1)]}},
    {"id": "4e-calcul-litteral", "title": "Développer et factoriser", "svg": None,
     "cours": ["Développer, c'est transformer un produit en somme. Factoriser, c'est l'inverse : transformer une somme en produit.",
               "Ces techniques servent à simplifier des expressions et à résoudre des équations."],
     "enonce": ["Distributivité simple : k(a + b) = ka + kb.",
                "Double distributivité : (a + b)(c + d) = ac + ad + bc + bd.",
                "Factoriser avec un facteur commun : ka + kb = k(a + b).",
                "Règle des signes : −(a − b) = −a + b."],
     "exemples": [("Développer", ["(x + 3)(x − 2) = x² − 2x + 3x − 6 = x² + x − 6."]),
                  ("Factoriser", ["5x + 15 = 5(x + 3).", "x² + 4x = x(x + 4)."])],
     "exo": {"context": "Soit A = (2x + 1)(x + 3).",
             "steps": [
               ("Développe A.", ["2x² + 7x + 3", "2x² + 6x + 3", "2x² + 4x + 3", "3x + 4"], 0, "2x × x + 2x × 3 + 1 × x + 1 × 3 = 2x² + 6x + x + 3.", 1),
               ("Calcule A pour x = 0.", ["3", "0", "4", "1"], 0, "(0 + 1)(0 + 3) = 3.", 1),
               ("Factorise 6x − 9.", ["3(2x − 3)", "6(x − 9)", "3(2x − 9)", "2(3x − 9)"], 0, "Le facteur commun est 3.", 1),
               ("Factorise x² − 5x.", ["x(x − 5)", "5(x − x)", "x(x − 5x)", "(x − 5)²"], 0, "x est commun aux deux termes.", 1)]}},
  ],
  "4e-pc": [
    {"id": "4e-masse-volumique", "title": "La masse volumique", "svg": SVG_MASSE_VOL,
     "cours": ["La masse volumique ρ (rho) d'une substance est la masse d'une unité de volume de cette substance. Elle permet d'identifier une substance et de prévoir si un objet flotte.",
               "On mesure la masse avec une balance et le volume avec une éprouvette graduée (déplacement d'eau pour un solide)."],
     "enonce": ["ρ = m / V (en g/cm³ ou kg/m³).",
                "Eau : ρ = 1 g/cm³ = 1 000 kg/m³.",
                "Un objet flotte sur l'eau si sa masse volumique est inférieure à celle de l'eau.",
                "Densité par rapport à l'eau : d = ρ / ρ(eau), sans unité."],
     "exemples": [("Un caillou", ["m = 54 g ; le niveau de l'eau passe de 50 mL à 70 mL, donc V = 20 cm³.", "ρ = 54 / 20 = 2,7 g/cm³ : c'est la valeur de l'aluminium."])],
     "exo": {"context": "Un morceau de bois a une masse de 120 g et un volume de 200 cm³.",
             "steps": [
               ("Calcule sa masse volumique.", ["0,6 g/cm³", "1,67 g/cm³", "80 g/cm³", "24 000 g/cm³"], 0, "ρ = 120 / 200 = 0,6 g/cm³.", 1),
               ("Ce bois flotte-t-il sur l'eau ?", ["Oui, car 0,6 < 1", "Non, car 0,6 < 1", "Oui, car 0,6 > 1", "On ne peut pas savoir"], 0, "Sa masse volumique est inférieure à celle de l'eau.", 1),
               ("Sa densité par rapport à l'eau vaut :", ["0,6", "600", "1,6", "6"], 0, "d = 0,6 / 1 = 0,6.", 1),
               ("Masse de 1 L d'eau :", ["1 kg", "1 g", "100 g", "10 kg"], 0, "1 L = 1 000 cm³ et ρ = 1 g/cm³, donc 1 000 g.", 1)]}},
    {"id": "4e-circuit", "title": "Le circuit électrique", "svg": None,
     "cours": ["Un circuit électrique comprend un générateur (pile), des récepteurs (lampes, moteur), des fils et un interrupteur. Le courant ne circule que si le circuit est fermé.",
               "Les dipôles peuvent être montés en série (une seule boucle) ou en dérivation (plusieurs boucles)."],
     "enonce": ["Le courant sort par la borne + du générateur et rentre par la borne −.",
                "En série : la même intensité traverse tous les dipôles ; si une lampe grille, les autres s'éteignent.",
                "En dérivation : l'intensité du courant principal est la somme des intensités des branches (loi des nœuds) ; les lampes fonctionnent indépendamment.",
                "L'ampèremètre se branche en série, le voltmètre en dérivation."],
     "exemples": [("Loi des nœuds", ["Deux lampes en dérivation parcourues par 0,2 A et 0,3 A : le courant principal vaut 0,5 A."])],
     "exo": {"context": "Dans une maison, les lampes sont branchées en dérivation. Deux lampes sont parcourues par I₁ = 0,4 A et I₂ = 0,25 A.",
             "steps": [
               ("Intensité du courant principal :", ["0,65 A", "0,15 A", "0,4 A", "0,1 A"], 0, "Loi des nœuds : I = I₁ + I₂ = 0,65 A.", 1),
               ("Si la lampe 1 grille, la lampe 2 :", ["reste allumée", "s'éteint", "brille deux fois plus", "explose"], 0, "En dérivation, chaque lampe est dans sa propre boucle.", 1),
               ("Comment branche-t-on un ampèremètre ?", ["En série", "En dérivation", "Sans fil", "Aux bornes de la pile seulement"], 0, "Il doit être traversé par le courant à mesurer.", 1),
               ("Pourquoi les maisons utilisent-elles la dérivation ?", ["Pour que chaque appareil fonctionne indépendamment", "Pour économiser les fils", "Pour diminuer la tension", "Par habitude"], 0, "On peut allumer ou éteindre chaque appareil sans toucher aux autres.", 1)]}},
  ],
  "2nde-maths": [
    {"id": "2nde-vecteurs", "title": "Les vecteurs", "svg": None,
     "cours": ["Un vecteur AB⃗ est défini par une direction (celle de la droite (AB)), un sens (de A vers B) et une longueur (AB).",
               "Dans un repère, on calcule avec les coordonnées : c'est la base de la géométrie analytique."],
     "enonce": ["Si A(xA ; yA) et B(xB ; yB), alors AB⃗ (xB − xA ; yB − yA).",
                "Relation de Chasles : AB⃗ + BC⃗ = AC⃗.",
                "u⃗ (x ; y) et v⃗ (x' ; y') sont colinéaires si et seulement si xy' − x'y = 0.",
                "ABDC est un parallélogramme si et seulement si AB⃗ = CD⃗."],
     "exemples": [("Coordonnées", ["A(1 ; 2), B(4 ; 6) : AB⃗ (3 ; 4) et AB = √(9 + 16) = 5."])],
     "exo": {"context": "Dans un repère orthonormé : A(1 ; 1), B(3 ; 2), C(4 ; 5).",
             "steps": [
               ("Coordonnées de AB⃗ :", ["(2 ; 1)", "(4 ; 3)", "(−2 ; −1)", "(1 ; 2)"], 0, "(3 − 1 ; 2 − 1).", 1),
               ("On cherche D tel que ABCD soit un parallélogramme. Il faut :", ["AB⃗ = DC⃗", "AB⃗ = CD⃗", "AC⃗ = BD⃗", "AD⃗ = CB⃗"], 0, "Dans ABCD, les côtés opposés [AB] et [DC] donnent des vecteurs égaux.", 1),
               ("Coordonnées de D :", ["(2 ; 4)", "(6 ; 6)", "(0 ; 0)", "(3 ; 3)"], 0, "DC⃗ = (4 − xD ; 5 − yD) = (2 ; 1), donc D(2 ; 4).", 1),
               ("u⃗ (2 ; 1) et v⃗ (6 ; 3) sont-ils colinéaires ?", ["Oui", "Non", "Seulement si on change de repère", "On ne peut pas savoir"], 0, "2 × 3 − 6 × 1 = 0 : v⃗ = 3u⃗.", 1)]}},
  ],
  "2nde-pc": [
    {"id": "2nde-mole", "title": "La mole et la quantité de matière", "svg": None,
     "cours": ["Les atomes et les molécules sont si petits qu'on les compte par paquets : la mole. Une mole contient Nₐ = 6,02 × 10²³ entités (constante d'Avogadro).",
               "La masse molaire M est la masse d'une mole (en g/mol). On la calcule en additionnant les masses molaires atomiques."],
     "enonce": ["n = m / M (n en mol, m en g, M en g/mol).",
                "N = n × Nₐ (nombre d'entités).",
                "Gaz : n = V / Vm, avec Vm ≈ 24 L/mol à 20 °C (22,4 L/mol à 0 °C).",
                "Concentration molaire : C = n / V (mol/L)."],
     "exemples": [("L'eau", ["M(H₂O) = 2 × 1 + 16 = 18 g/mol.", "36 g d'eau : n = 36 / 18 = 2 mol."])],
     "exo": {"context": "On dissout 5,85 g de chlorure de sodium NaCl dans de l'eau pour obtenir 500 mL de solution. M(Na) = 23 g/mol ; M(Cl) = 35,5 g/mol.",
             "steps": [
               ("Masse molaire de NaCl :", ["58,5 g/mol", "35,5 g/mol", "12,5 g/mol", "81,5 g/mol"], 0, "23 + 35,5 = 58,5 g/mol.", 1),
               ("Quantité de matière :", ["0,1 mol", "10 mol", "1 mol", "0,01 mol"], 0, "n = 5,85 / 58,5 = 0,1 mol.", 1),
               ("Concentration molaire :", ["0,2 mol/L", "0,05 mol/L", "0,1 mol/L", "2 mol/L"], 0, "C = 0,1 / 0,5 = 0,2 mol/L.", 1),
               ("Nombre d'unités NaCl dissoutes :", ["6,02 × 10²²", "6,02 × 10²³", "6,02 × 10²⁴", "0,1"], 0, "N = 0,1 × 6,02 × 10²³.", 1)]}},
  ],
  "1ere-pc": [
    {"id": "1ere-energie-cinetique", "title": "Travail et énergie cinétique", "svg": None,
     "cours": ["Une force travaille quand son point d'application se déplace. Le travail mesure l'énergie transférée par la force.",
               "L'énergie cinétique est l'énergie due au mouvement. Le théorème de l'énergie cinétique relie les deux."],
     "enonce": ["Travail d'une force constante : W(F⃗) = F × AB × cos α (en joules).",
                "Travail du poids : W(P⃗) = m g (zA − zB) : positif quand le corps descend.",
                "Énergie cinétique : Ec = ½ m v².",
                "Théorème de l'énergie cinétique : ΔEc = Ec(B) − Ec(A) = somme des travaux des forces."],
     "exemples": [("Chute libre", ["Une bille de 0,1 kg tombe de 5 m sans vitesse initiale, g = 10 N/kg.", "W(P) = 0,1 × 10 × 5 = 5 J = ½ × 0,1 × v², donc v = 10 m/s."])],
     "exo": {"context": "Un solide de 2 kg glisse sans frottement sur un plan incliné. Il part du repos et descend d'une hauteur h = 1,8 m. On prend g = 10 N/kg.",
             "steps": [
               ("Travail du poids :", ["36 J", "18 J", "3,6 J", "360 J"], 0, "W = m g h = 2 × 10 × 1,8 = 36 J.", 1),
               ("Travail de la réaction du plan (sans frottement) :", ["0 J", "36 J", "−36 J", "20 J"], 0, "Elle est perpendiculaire au déplacement.", 1),
               ("Énergie cinétique en bas :", ["36 J", "0 J", "18 J", "72 J"], 0, "ΔEc = 36 J et Ec initiale nulle.", 1),
               ("Vitesse en bas :", ["6 m/s", "36 m/s", "18 m/s", "3 m/s"], 0, "½ × 2 × v² = 36, donc v² = 36, v = 6 m/s.", 1)]}},
  ],
  "g-compta": [
    {"id": "g-bilan", "title": "Le bilan comptable", "svg": None,
     "cours": ["Le bilan est une photographie du patrimoine de l'entreprise à une date donnée. Il présente à gauche les emplois (actif) et à droite les ressources (passif).",
               "Il est toujours équilibré : total de l'actif = total du passif."],
     "enonce": ["Actif : actif immobilisé (terrains, bâtiments, matériel), actif circulant (stocks, créances clients), trésorerie-actif (banque, caisse).",
                "Passif : capitaux propres (capital, résultat), dettes financières (emprunts), passif circulant (fournisseurs), trésorerie-passif.",
                "Capitaux propres = total de l'actif − total des dettes.",
                "Plan comptable : système comptable OHADA (SYSCOHADA) en vigueur au Sénégal."],
     "exemples": [("Création d'une boutique", ["Apport de 2 000 000 F en banque : à l'actif, Banque 2 000 000 ; au passif, Capital 2 000 000."])],
     "exo": {"context": "Une entreprise possède : matériel 3 000 000 F, stock de marchandises 1 200 000 F, banque 800 000 F. Elle doit : emprunt 1 500 000 F, fournisseurs 500 000 F.",
             "steps": [
               ("Total de l'actif :", ["5 000 000 F", "2 000 000 F", "3 000 000 F", "7 000 000 F"], 0, "3 000 000 + 1 200 000 + 800 000.", 1),
               ("Total des dettes :", ["2 000 000 F", "1 500 000 F", "500 000 F", "5 000 000 F"], 0, "1 500 000 + 500 000.", 1),
               ("Capitaux propres :", ["3 000 000 F", "5 000 000 F", "2 000 000 F", "7 000 000 F"], 0, "Actif − dettes = 5 000 000 − 2 000 000.", 1),
               ("Le stock de marchandises appartient à :", ["l'actif circulant", "l'actif immobilisé", "les capitaux propres", "les dettes"], 0, "Il est destiné à être vendu au cours de l'exploitation.", 1)]}},
  ],
  "g-eco": [
    {"id": "g-inflation", "title": "L'inflation et le pouvoir d'achat", "svg": None,
     "cours": ["L'inflation est une hausse générale et durable des prix. Elle réduit le pouvoir d'achat si les revenus n'augmentent pas autant que les prix.",
               "Au Sénégal, l'inflation est mesurée par l'ANSD avec l'indice harmonisé des prix à la consommation ; la BCEAO fixe la politique monétaire de l'UEMOA, avec un objectif de stabilité des prix."],
     "enonce": ["Taux de variation = (valeur d'arrivée − valeur de départ) / valeur de départ × 100.",
                "Indice = valeur de l'année / valeur de l'année de base × 100.",
                "Causes : inflation par la demande (demande supérieure à l'offre), par les coûts (hausse du prix du pétrole, des matières premières), monétaire (trop de monnaie en circulation).",
                "Remèdes : hausse des taux directeurs de la banque centrale, maîtrise des dépenses publiques, augmentation de l'offre."],
     "exemples": [("Prix du sac de riz", ["Il passe de 15 000 F à 16 500 F.", "Taux de variation = 1 500 / 15 000 × 100 = 10 %."])],
     "exo": {"context": "L'indice des prix vaut 100 en 2020 et 108 en 2023. Le salaire d'un employé passe de 200 000 F à 210 000 F sur la même période.",
             "steps": [
               ("Hausse des prix entre 2020 et 2023 :", ["8 %", "108 %", "0,8 %", "18 %"], 0, "(108 − 100) / 100 × 100 = 8 %.", 1),
               ("Hausse du salaire :", ["5 %", "10 %", "10 000 %", "2 %"], 0, "10 000 / 200 000 × 100 = 5 %.", 1),
               ("Le pouvoir d'achat de l'employé a :", ["baissé", "augmenté", "pas changé", "doublé"], 0, "Les prix ont augmenté plus vite (8 %) que le salaire (5 %).", 1),
               ("Quelle institution fixe la politique monétaire au Sénégal ?", ["La BCEAO", "L'ANSD", "La Senelec", "Le ministère de l'Éducation"], 0, "La BCEAO est la banque centrale des États de l'UEMOA.", 1)]}},
  ],
}
