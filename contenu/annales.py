# Vrais sujets du BAC (Office du Baccalauréat, UCAD) et questions tirées de ces sujets.
# Les sujets ne sont pas recopiés : on donne leur structure et le lien vers le PDF original.
# Chaque question sourcée : (énoncé, [4 choix], indice de la bonne réponse, explication, source).

BASE = "https://groupe-reussite.fr/ressources/wp-content/uploads/Annales/bac/senegal/"
HOST = "groupe-reussite.fr"

ANNALES = [
  {"id": "bac-2023-s2-maths", "exam": "BAC", "year": 2023, "series": "S2, S2A, S4, S5", "subject": "Mathématiques", "levels": ["Tle S2", "Tle S4", "Tle S5"],
   "duration": "4 h", "coef": 5, "code": "2023GS26NA0132",
   "parts": ["Exercice 1 (3 pts) : limites usuelles et primitives",
             "Exercice 2 (4 pts) : nombres complexes, polynôme de degré 3, barycentre et lieu de points (culture sous serre)",
             "Exercice 3 (4 pts) : suite définie par récurrence, convergence",
             "Problème : équation différentielle puis étude d'une fonction définie par morceaux (exponentielle et logarithme), aire"],
   "sujet": BASE + "sujet-bac-s2-s2a-s4-s5-maths-2023-senegal.pdf", "corrige": BASE + "corrige-bac-s2-s2a-s4-s5-maths-2023-senegal.pdf"},
  {"id": "bac-2023-s1-maths", "exam": "BAC", "year": 2023, "series": "S1, S1A, S3", "subject": "Mathématiques", "levels": ["Tle S1", "Tle S3"],
   "duration": "4 h", "coef": 8, "code": "2023GS21NA0124",
   "parts": ["Exercice 1 (4 pts) : similitude directe, ellipse et coniques",
             "Exercice 2 (5 pts) : bases de numération, congruences modulo 7, loi de probabilité d'un jeu",
             "Problème (11 pts) : famille de fonctions logarithmiques, bijection réciproque, intégrales, volume, suite d'intégrales"],
   "sujet": BASE + "sujet-bac-s1-s1a-s3-maths-2023-senegal.pdf", "corrige": BASE + "corrige-bac-s1-s1a-s3-maths-2023-senegal.pdf"},
  {"id": "bac-2022-s2-maths", "exam": "BAC", "year": 2022, "series": "S2, S2A, S4, S5", "subject": "Mathématiques", "levels": ["Tle S2", "Tle S4", "Tle S5"],
   "duration": "4 h", "coef": 5, "code": "22G26NA0152",
   "parts": ["Exercice 1 (4 pts) : nombres complexes, forme trigonométrique, valeurs exactes de cos et sin de π/12",
             "Exercice 2 (4 pts) : probabilités avec trois lancers de dé et une équation du second degré, loi binomiale",
             "Problème (12 pts) : fonction définie par morceaux avec x ln x, prolongement par continuité, point fixe et suite"],
   "sujet": BASE + "sujet-bac-s2-s2a-s4-s5-maths-2022-senegal.pdf", "corrige": BASE + "corrige-bac-s2-s2a-s4-s5-maths-2022-senegal.pdf"},
  {"id": "bac-2022-s1-maths", "exam": "BAC", "year": 2022, "series": "S1, S1A, S3", "subject": "Mathématiques", "levels": ["Tle S1", "Tle S3"],
   "sujet": BASE + "sujet-bac-s1-s1A-s3-maths-2022-senegal.pdf", "corrige": BASE + "corrige-bac-s1-s1a-s3-maths-2022-senegal.pdf"},
  {"id": "bac-2021-s2-maths", "exam": "BAC", "year": 2021, "series": "S2, S2A, S4, S5", "subject": "Mathématiques", "levels": ["Tle S2", "Tle S4", "Tle S5"],
   "duration": "4 h", "coef": 5, "code": "21G26NA0152",
   "parts": ["Exercice 1 (5 pts) : probabilités avec un dé et deux urnes, probabilité conditionnelle, loi binomiale",
             "Exercice 2 (5 pts) : nombres complexes, équation du second degré, triangle rectangle isocèle",
             "Problème (10 pts) : fonction définie par morceaux (logarithme et exponentielle), asymptotes, aire"],
   "sujet": BASE + "sujet-bac-s2-s2a-s4-s5-maths-2021-senegal.pdf", "corrige": BASE + "corrige-bac-s2-s2a-s4-s5-maths-2021-senegal.pdf"},
  {"id": "bac-2021-s1-maths", "exam": "BAC", "year": 2021, "series": "S1, S1A, S3", "subject": "Mathématiques", "levels": ["Tle S1", "Tle S3"],
   "duration": "4 h", "code": "21G21NA0145",
   "parts": ["Exercice 1 (5 pts) : géométrie dans le cube, plan et tétraèdre",
             "Exercice 2 (3,5 pts) : équation 12u + 11v = 1, congruences, problème des cartes de Farba",
             "Problème (11,5 pts) : similitude, intégrales et volume, étude de fonction, suite"],
   "sujet": BASE + "sujet-bac-s1-s1a-s3-maths-2021-senegal.pdf", "corrige": BASE + "corrige-bac-s1-s1a-s3-maths-2021-senegal.pdf"},
  {"id": "bac-2020-s2-maths", "exam": "BAC", "year": 2020, "series": "S2, S4, S5", "subject": "Mathématiques", "levels": ["Tle S2", "Tle S4", "Tle S5"],
   "sujet": BASE + "sujet-bac-s2-s4-s5-maths-2020-senegal.pdf", "corrige": BASE + "corrige-bac-s2-s4-s5-maths-2020-senegal.pdf"},
  {"id": "bac-2020-s1-maths", "exam": "BAC", "year": 2020, "series": "S1, S1A, S3", "subject": "Mathématiques", "levels": ["Tle S1", "Tle S3"],
   "sujet": BASE + "sujet-bac-s1-s1a-s3-maths-2020-senegal.pdf", "corrige": BASE + "corrige-bac-s1-s3-maths-2020-senegal.pdf"},
  {"id": "bac-2019-s2-maths", "exam": "BAC", "year": 2019, "series": "S2, S2A, S4, S5", "subject": "Mathématiques", "levels": ["Tle S2", "Tle S4", "Tle S5"],
   "duration": "4 h", "coef": 5,
   "parts": ["Exercice 1 (4,5 pts) : probabilités sur une classe de 45 élèves et suite géométrique",
             "Exercice 2 (5,5 pts) : équation de degré 5 dans ℂ, quadrilatère, rotation, puissances d'un complexe",
             "Problème (10 pts) : étude de f(x) = −x + 2 + (2x − 4)e^(x/2), asymptote, intégration par parties, aire"],
   "sujet": BASE + "sujet-bac-s2-s4-s5-maths-2019-senegal.pdf", "corrige": BASE + "corrige-bac-s2-s4-s5-maths-2019-senegal.pdf"},
  {"id": "bac-2019-s1-maths", "exam": "BAC", "year": 2019, "series": "S1, S3", "subject": "Mathématiques", "levels": ["Tle S1", "Tle S3"],
   "duration": "4 h", "coef": 8,
   "parts": ["Exercice 1 (4 pts) : arithmétique, points à coordonnées entières d'une droite",
             "Exercice 2 (6 pts) : tétraèdre régulier dans l'espace, probabilités avec un tétraèdre numéroté",
             "Problème (10 pts) : f(x) = √(1 − e^(−x)), bijection réciproque, suite d'intégrales et sommes"],
   "sujet": BASE + "sujet-bac-s1-s3-maths-2019-senegal.pdf", "corrige": BASE + "corrige-bac-s1-s3-maths-2019-senegal.pdf"},
]

S2_19, S2_21, S2_22, S2_23 = "BAC S2 2019", "BAC S2 2021", "BAC S2 2022", "BAC S2 2023"
S1_19, S1_21, S1_23 = "BAC S1 2019", "BAC S1 2021", "BAC S1 2023"

SUBJECTS_ANNALES = [
  ("tle-annales-maths-s2", ["Tle S2", "Tle S4", "Tle S5"], "Annales BAC maths", [
    ("Une classe de 45 élèves : 30 ont eu la moyenne au premier devoir. Quelle est la probabilité p₁ qu'un élève ait eu la moyenne ?", ["1/3", "2/3", "3/4", "30/100"], 1, "p₁ = 30/45 = 2/3.", S2_19 + ", exercice 1"),
    ("Si l'élève a eu la moyenne, il l'a au devoir suivant avec la probabilité 1/2 ; sinon avec la probabilité 1/3. Avec p₁ = 2/3, combien vaut p₂ ?", ["1/2", "4/9", "5/12", "2/9"], 1, "p₂ = (2/3)(1/2) + (1/3)(1/3) = 1/3 + 1/9 = 4/9.", S2_19 + ", exercice 1"),
    ("On a pₙ₊₁ = (1/6)pₙ + 1/3 et uₙ = pₙ − 2/5. Quelle est la raison de la suite géométrique (uₙ) ?", ["1/3", "1/6", "2/5", "6"], 1, "uₙ₊₁ = pₙ/6 + 1/3 − 2/5 = pₙ/6 − 1/15 = (pₙ − 2/5)/6 = uₙ/6.", S2_19 + ", exercice 1"),
    ("Même exercice : vers quelle limite tend pₙ ?", ["0", "2/5", "1/3", "1/2"], 1, "uₙ tend vers 0 car |1/6| < 1, donc pₙ = uₙ + 2/5 tend vers 2/5.", S2_19 + ", exercice 1"),
    ("z⁵ + 2z⁴ + 2z³ − z² − 2z − 2 = (z³ − 1)Q(z). Que vaut Q(z) ?", ["z² + 2z + 2", "z² − 2z + 2", "z² + 2", "z² + z + 1"], 0, "(z³ − 1)(z² + 2z + 2) redonne bien le polynôme. Racines de Q : −1 + i et −1 − i.", S2_19 + ", exercice 2"),
    ("z_A = −1/2 + i√3/2. Quel est le plus petit entier n ≥ 1 tel que (z_A)ⁿ soit réel ?", ["2", "3", "6", "4"], 1, "z_A = e^(2iπ/3) : 2nπ/3 doit être un multiple de π, donc n multiple de 3.", S2_19 + ", exercice 2"),
    ("f(x) = −x + 2 + (2x − 4)e^(x/2). Que vaut f′(x) ?", ["−1 + x e^(x/2)", "2e^(x/2)", "−1 + (x − 2)e^(x/2)", "(2x − 4)e^(x/2)"], 0, "f′(x) = −1 + 2e^(x/2) + (x − 2)e^(x/2) = −1 + x e^(x/2) = g(x).", S2_19 + ", problème"),
    ("Même fonction f : quelle droite est asymptote à la courbe en −∞ ?", ["y = 2", "y = −x + 2", "y = x", "x = 0"], 1, "(2x − 4)e^(x/2) tend vers 0 en −∞, donc f(x) − (−x + 2) → 0.", S2_19 + ", problème"),
    ("Un dé : si 6, on tire dans U1 (4 noires, 3 blanches), sinon dans U2 (3 noires, 2 blanches). Probabilité de tirer une blanche ?", ["5/12", "17/42", "1/2", "3/7"], 1, "P(B) = (1/6)(3/7) + (5/6)(2/5) = 1/14 + 1/3 = 17/42.", S2_21 + ", exercice 1"),
    ("Même expérience : sachant que la boule est blanche, probabilité que le dé ait donné 6 ?", ["1/6", "3/17", "3/7", "1/14"], 1, "P_B(A) = (1/14) / (17/42) = 3/17.", S2_21 + ", exercice 1"),
    ("Même expérience répétée 5 fois, X = nombre de blanches. Combien vaut E(X) ?", ["85/42", "5/6", "17/42", "2"], 0, "X suit la loi binomiale B(5 ; 17/42), donc E(X) = 5 × 17/42 = 85/42.", S2_21 + ", exercice 1"),
    ("Plus petit n tel que la probabilité d'avoir au moins une blanche en n épreuves dépasse 0,99 ?", ["5", "7", "9", "12"], 2, "1 − (25/42)ⁿ > 0,99 ⇔ n > ln 0,01 / ln(25/42) ≈ 8,88, donc n = 9.", S2_21 + ", exercice 1"),
    ("Résous a(1 + i) = 1 + 3i.", ["a = 1 + 2i", "a = 2 + i", "a = 2 − i", "a = 1 + i"], 1, "a = (1 + 3i)(1 − i)/2 = (4 + 2i)/2 = 2 + i.", S2_21 + ", exercice 2"),
    ("A(2 + i) et B(−1 + 2i) avec b = i·a. Quelle est la nature du triangle OAB ?", ["Équilatéral", "Rectangle isocèle en O", "Rectangle en A", "Quelconque"], 1, "Multiplier par i, c'est tourner de π/2 autour de O : OA = OB et (OA) ⊥ (OB).", S2_21 + ", exercice 2"),
    ("On lance 3 fois un dé et on obtient (a, b, c). Combien de triplets avec b = 6 rendent −1 solution de ax² + bx + c = 0 ?", ["3", "5", "6", "11"], 1, "a − 6 + c = 0 ⇔ a + c = 6 : (1,5), (2,4), (3,3), (4,2), (5,1). D'où p(A) = 5/216.", S2_22 + ", exercice 2"),
    ("Même jeu : probabilité que la somme des solutions soit −2 et leur produit 1 ?", ["1/36", "1/72", "1/108", "1/216"], 1, "b = 2a et c = a, avec b ≤ 6 : a ∈ {1, 2, 3}. 3/216 = 1/72.", S2_22 + ", exercice 2"),
    ("Y suit la loi binomiale B(10 ; 5/216). Que vaut E(Y) ?", ["5/216", "25/108", "50/108", "10"], 1, "E(Y) = np = 10 × 5/216 = 50/216 = 25/108.", S2_22 + ", exercice 2"),
    ("f(x) = 1 + x − x ln x sur ]0 ; 1[. Quelle est la limite de f en 0 à droite ?", ["0", "1", "+∞", "−∞"], 1, "x ln x tend vers 0 quand x → 0⁺, donc f(x) → 1 : f se prolonge par continuité avec h(0) = 1.", S2_22 + ", problème"),
    ("Même fonction sur ]0 ; 1[ : que vaut f′(x) ?", ["−ln x", "ln x", "1 − ln x", "−1/x"], 0, "f′(x) = 1 − (ln x + 1) = −ln x, positif sur ]0 ; 1[.", S2_22 + ", problème"),
    ("Quelle est la limite de ln(1 + x)/x quand x tend vers 0 ?", ["0", "1", "+∞", "e"], 1, "C'est le nombre dérivé de ln(1 + x) en 0.", S2_23 + ", exercice 1"),
    ("P(z) = 2z³ − 3(1 + i)z² + 4iz + 1 − i a pour racines 1 et i. Quelle est la troisième racine ?", ["(1 + i)/2", "1 − i", "−1", "2i"], 0, "P(z) = (z − 1)(z − i)(2z − 1 − i), d'où z = (1 + i)/2, affixe du point C.", S2_23 + ", exercice 2"),
    ("A(1), B(i) et C((1 + i)/2). Où se trouve G, barycentre de (A, 1), (B, 1) et (C, 2) ?", ["En O", "En C", "En A", "Au milieu de [OC]"], 1, "z_G = (1 + i + 2 × (1 + i)/2)/4 = (1 + i)/2 : G est confondu avec C, milieu de [AB].", S2_23 + ", exercice 2"),
  ]),
  ("tle-annales-maths-s1", ["Tle S1", "Tle S3"], "Annales BAC maths", [
    ("La droite y = (7/6)x − 2/5 contient-elle un point à coordonnées entières ?", ["Oui, une infinité", "Oui, un seul", "Non", "Seulement l'origine"], 2, "On obtiendrait 35x − 30y = 12, or 35x − 30y est divisible par 5 et 12 ne l'est pas.", S1_19 + ", exercice 1"),
    ("A(0 ; 0 ; 3√2) et B(4 ; 0 ; −√2). Que vaut AB ?", ["4", "4√2", "4√3", "8"], 2, "AB² = 4² + (4√2)² = 16 + 32 = 48, donc AB = 4√3.", S1_19 + ", exercice 2"),
    ("Tétraèdre équilibré, faces 0, 1, 2, 2, lancé 2 fois : probabilité que le produit des 6 chiffres visibles soit non nul ?", ["1/4", "1/16", "9/16", "3/4"], 1, "Il faut que la face 0 soit cachée (posée au sol) aux deux lancers : (1/4)² = 1/16.", S1_19 + ", exercice 2"),
    ("f(x) = √(1 − e^(−x)) sur [0 ; +∞[. Quelle est sa bijection réciproque g ?", ["g(x) = −ln(1 − x²)", "g(x) = ln(1 + x²)", "g(x) = e^(x²) − 1", "g(x) = 1 − e^(−x²)"], 0, "y² = 1 − e^(−x) ⇔ x = −ln(1 − y²), pour y dans [0 ; 1[.", S1_19 + ", problème"),
    ("Un couple d'entiers solution de 12u + 11v = 1 est :", ["(1 ; −1)", "(−1 ; 1)", "(2 ; −2)", "(0 ; 1)"], 0, "12 × 1 + 11 × (−1) = 1. L'existence vient du théorème de Bézout (12 et 11 sont premiers entre eux).", S1_21 + ", exercice 2"),
    ("Farba a entre 800 et 1 000 cartes de 1 000 F. Par lots de 12, il en reste 4 ; par lots de 11, il en reste 3. Combien a-t-il dépensé ?", ["796 000 F", "916 000 F", "928 000 F", "880 000 F"], 1, "n = 132k − 8, et le seul n entre 800 et 1 000 est 916 : 916 = 12 × 76 + 4 = 11 × 83 + 3.", S1_21 + ", exercice 2"),
    ("Que vaut 7E6 (écrit en base 16) en base 10 ?", ["2016", "2022", "2023", "1766"], 1, "7 × 256 + 14 × 16 + 6 = 1 792 + 224 + 6 = 2 022.", S1_23 + ", exercice 2"),
    ("Que vaut 431 (écrit en base 5) en base 10 ?", ["116", "431", "86", "106"], 0, "4 × 25 + 3 × 5 + 1 = 116.", S1_23 + ", exercice 2"),
    ("Quel est le reste de 5²⁰²³ dans la division par 7 ?", ["1", "3", "5", "6"], 2, "5⁶ ≡ 1 [7] et 2023 = 6 × 337 + 1, donc 5²⁰²³ ≡ 5 [7].", S1_23 + ", exercice 2"),
    ("Quel est le reste de 2023 dans la division par 7 ?", ["0", "1", "3", "6"], 0, "2023 = 7 × 289.", S1_23 + ", exercice 2"),
  ]),
]

# Sujets guidés : l'énoncé est reformulé étape par étape, chaque réponse est corrigée tout de suite.
# Étape : (question, [4 choix], indice de la bonne réponse, corrigé détaillé, points du barème officiel)
GUIDED = {
  "bac-2019-s2-maths": [
    {"title": "Exercice 1 : probabilités et suite (4,5 pts)",
     "context": "Une classe de Première S2 compte 45 élèves ; 30 ont eu la moyenne au premier devoir de maths. "
                "Un élève qui a eu la moyenne à un devoir l'a au suivant avec la probabilité 1/2 ; "
                "un élève qui ne l'a pas eue l'a au suivant avec la probabilité 1/3. "
                "Eₙ : « l'élève a eu la moyenne au n-ième devoir », pₙ = P(Eₙ).",
     "steps": [
       ("Combien vaut p₁ ?", ["1/3", "2/3", "30/100", "1/2"], 1, "p₁ = 30/45 = 2/3.", 0.5),
       ("Que valent P(E₂ | E₁) et P(E₂ | Ē₁) ?", ["1/2 et 1/3", "1/3 et 1/2", "1/2 et 2/3", "2/3 et 1/3"], 0, "Ce sont les données de l'énoncé : 1/2 si l'élève avait la moyenne, 1/3 sinon.", 0.5),
       ("En déduire p₂.", ["5/6", "4/9", "1/3", "7/18"], 1, "Formule des probabilités totales : p₂ = (2/3)(1/2) + (1/3)(1/3) = 1/3 + 1/9 = 4/9.", 0.5),
       ("Pour tout n ≥ 1, pₙ₊₁ est égal à :", ["(1/2)pₙ + 1/3", "(1/6)pₙ + 1/3", "(5/6)pₙ", "(1/6)pₙ + 1/2"], 1, "pₙ₊₁ = (1/2)pₙ + (1/3)(1 − pₙ) = (1/2 − 1/3)pₙ + 1/3 = (1/6)pₙ + 1/3.", 0.75),
       ("On pose uₙ = pₙ − 2/5. La suite (uₙ) est géométrique de :", ["raison 1/6 et u₁ = 4/15", "raison 1/3 et u₁ = 2/3", "raison 1/6 et u₁ = 2/5", "raison 6 et u₁ = 4/15"], 0, "uₙ₊₁ = (1/6)pₙ + 1/3 − 2/5 = (1/6)pₙ − 1/15 = (1/6)(pₙ − 2/5) = (1/6)uₙ, et u₁ = 2/3 − 2/5 = 4/15.", 1),
       ("Alors, pour tout n ≥ 1, pₙ est égal à :", ["2/5 + (4/15)(1/6)ⁿ⁻¹", "(4/15)(1/6)ⁿ", "2/5 − (1/6)ⁿ", "2/3 (1/6)ⁿ⁻¹"], 0, "uₙ = u₁ qⁿ⁻¹ = (4/15)(1/6)ⁿ⁻¹, puis pₙ = uₙ + 2/5.", 1),
       ("Quelle est la limite de pₙ ?", ["0", "2/5", "2/3", "+∞"], 1, "Comme 0 < 1/6 < 1, (1/6)ⁿ⁻¹ tend vers 0, donc pₙ tend vers 2/5.", 0.25),
     ]},
    {"title": "Exercice 2 : nombres complexes (5,5 pts)",
     "context": "f(z) = z⁵ + 2z⁴ + 2z³ − z² − 2z − 2 et (E) : f(z) = 0. "
                "Dans la partie B, A, B, C, D ont pour affixes −1/2 + i√3/2, −1 + i, −1 − i et −1/2 − i√3/2.",
     "steps": [
       ("Le polynôme Q tel que f(z) = (z³ − 1)Q(z) est :", ["z² + 2z + 2", "z² − 2z + 2", "z² + 2", "z² + z + 1"], 0, "En développant (z³ − 1)(z² + 2z + 2) = z⁵ + 2z⁴ + 2z³ − z² − 2z − 2.", 0.5),
       ("Les solutions de (E) sont :", ["1, −1/2 ± i√3/2 et −1 ± i", "1 et −1 ± i", "±1 et ± i", "−1/2 ± i√3/2 seulement"], 0, "z³ = 1 donne 1 et e^(±2iπ/3) = −1/2 ± i√3/2 ; z² + 2z + 2 = 0 a pour discriminant −4, d'où −1 ± i.", 0.5),
       ("La forme trigonométrique de −1 + i est :", ["√2 (cos 3π/4 + i sin 3π/4)", "√2 (cos π/4 + i sin π/4)", "2 (cos 3π/4 + i sin 3π/4)", "√2 (cos 5π/4 + i sin 5π/4)"], 0, "|−1 + i| = √2 et le point est dans le 2e quadrant sur la bissectrice : argument 3π/4. De même −1 − i = √2 e^(−3iπ/4).", 1),
       ("Quelle est la nature du quadrilatère ABCD ?", ["Un trapèze isocèle", "Un parallélogramme", "Un carré", "Un losange"], 0, "(AD) et (BC) sont verticales donc parallèles, mais AD = √3 et BC = 2 ; la figure est symétrique par rapport à l'axe réel : trapèze isocèle.", 0.5),
       ("La rotation r de centre Ω(1) qui envoie A sur D a pour écriture :", ["z′ = e^(iπ/3)(z − 1) + 1", "z′ = e^(−iπ/3)(z − 1) + 1", "z′ = e^(iπ/3) z", "z′ = −z + 2"], 0, "z_A − 1 = √3 e^(5iπ/6) et z_D − 1 = √3 e^(−5iπ/6) : l'angle vaut −5π/3, c'est-à-dire π/3 modulo 2π.", 0.5),
       ("uₙ = (z_A)ⁿ. Quel est le plus petit n ≥ 1 tel que uₙ soit réel ?", ["2", "3", "4", "6"], 1, "z_A = e^(2iπ/3) : (z_A)ⁿ est réel quand 2nπ/3 est un multiple de π, soit n multiple de 3.", 1),
       ("Forme algébrique de u₂₀₁₉ :", ["1", "−1", "−1/2 + i√3/2", "i"], 0, "2019 = 3 × 673 et (z_A)³ = 1, donc u₂₀₁₉ = 1.", 0.5),
     ]},
    {"title": "Problème : étude de fonction (10 pts)",
     "context": "g(x) = −1 + x e^(x/2) et f(x) = −x + 2 + (2x − 4) e^(x/2), pour x réel. "
                "Repère orthonormé, unité graphique 2 cm.",
     "steps": [
       ("Limites de g en −∞ et en +∞ :", ["−1 et +∞", "0 et +∞", "−∞ et +∞", "−1 et 0"], 0, "En −∞, x e^(x/2) tend vers 0 (croissances comparées), donc g → −1. En +∞, g → +∞.", 0.75),
       ("Sens de variation de g :", ["Décroissante sur ]−∞ ; −2], croissante sur [−2 ; +∞[", "Croissante sur ℝ", "Décroissante sur ℝ", "Croissante sur ]−∞ ; 0], décroissante après"], 0, "g′(x) = e^(x/2) + (x/2) e^(x/2) = (1 + x/2) e^(x/2), du signe de x + 2.", 1),
       ("g(x) = 0 a une unique solution α. Quel encadrement est juste ?", ["0,70 < α < 0,71", "0,60 < α < 0,70", "0,71 < α < 0,72", "1 < α < 2"], 0, "g(0,70) ≈ −0,007 < 0 et g(0,71) ≈ 0,013 > 0, et g est continue et strictement croissante sur [−2 ; +∞[ (et négative avant −2).", 0.75),
       ("Signe de g(x) :", ["g < 0 sur ]−∞ ; α[ et g > 0 sur ]α ; +∞[", "g > 0 sur ℝ", "g < 0 sur ℝ", "g > 0 sur ]−∞ ; α["], 0, "Conséquence des variations et de g(α) = 0.", 0.5),
       ("Exprimer f′(x) :", ["f′(x) = g(x)", "f′(x) = −g(x)", "f′(x) = 2g(x)", "f′(x) = x e^(x/2)"], 0, "f′(x) = −1 + 2 e^(x/2) + (x − 2) e^(x/2) = −1 + x e^(x/2) = g(x).", 0.5),
       ("Sens de variation de f :", ["Décroissante sur ]−∞ ; α], croissante sur [α ; +∞[", "Croissante sur ℝ", "Croissante puis décroissante", "Décroissante sur ℝ"], 0, "f′ = g est négative avant α et positive après.", 0.5),
       ("Comme α e^(α/2) = 1, f(α) est égal à :", ["4 − α − 4/α", "2 − α", "4 + α − 4/α", "−α + 2/α"], 0, "e^(α/2) = 1/α, donc f(α) = −α + 2 + (2α − 4)/α = 4 − α − 4/α.", 0.5),
       ("Un encadrement de f(α) :", ["−2,42 < f(α) < −2,34", "−2,3 < f(α) < −2,2", "−1,5 < f(α) < −1,4", "2,34 < f(α) < 2,42"], 0, "x ↦ 4 − x − 4/x est croissante sur ]0 ; 2[ ; avec 0,70 < α < 0,71 : 4 − 0,70 − 4/0,70 ≈ −2,414 et 4 − 0,71 − 4/0,71 ≈ −2,344.", 0.5),
       ("En +∞ : limites de f(x) et de f(x)/x ?", ["+∞ et +∞ (branche parabolique de direction (Oy))", "+∞ et 0", "0 et 0", "+∞ et 2"], 0, "(2x − 4) e^(x/2) l'emporte : f → +∞ et f(x)/x → +∞.", 0.75),
       ("Limite de f en −∞ :", ["+∞", "−∞", "2", "0"], 0, "−x + 2 → +∞ et (2x − 4) e^(x/2) → 0.", 0.25),
       ("Asymptote à la courbe en −∞ :", ["y = −x + 2", "y = 2", "y = x", "x = −2"], 0, "f(x) − (−x + 2) = (2x − 4) e^(x/2) → 0 en −∞.", 0.5),
       ("Par parties, I(x) = ∫₀ˣ (2t − 4) e^(t/2) dt vaut :", ["(4x − 16) e^(x/2) + 16", "(4x − 8) e^(x/2) + 8", "(2x − 4) e^(x/2)", "(4x − 16) e^(x/2)"], 0, "u = 2t − 4, v = 2e^(t/2) : I(x) = [(4t − 8)e^(t/2)]₀ˣ − ∫₀ˣ 4e^(t/2) dt = (4x − 8)e^(x/2) + 8 − 8e^(x/2) + 8.", 0.75),
       ("λ < 0. Aire en cm² entre la courbe, y = 2 − x et les droites x = λ et x = 0, puis sa limite en −∞ :", ["(16λ − 64)e^(λ/2) + 64, limite 64 cm²", "(4λ − 16)e^(λ/2) + 16, limite 16 cm²", "64 e^(λ/2), limite 0", "16λ, limite −∞"], 0, "Sur [λ ; 0], f(x) ≤ 2 − x. L'aire vaut −∫_λ^0 (2x − 4)e^(x/2) dx = I(λ) unités d'aire, et 1 u.a. = 2 × 2 = 4 cm². Quand λ → −∞, l'aire tend vers 64 cm² (aire finie entre la courbe et son asymptote).", 0.75),
     ]},
  ],
}
