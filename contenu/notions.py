# Notions de cours détaillées, chapitre par chapitre, pour les matières dominantes.
# Chaque chapitre : cours, énoncé (définitions, théorèmes, formules), exemples résolus,
# une illustration (SVG facultatif) et un exercice d'application corrigé pas à pas.
# Étapes de l'exercice : (question, [4 choix], indice de la bonne réponse, corrigé, points).

def _svg(body, w=300, h=180):
    return (f'<svg viewBox="0 0 {w} {h}" role="img" fill="none" stroke="currentColor" stroke-width="2" '
            f'font-size="14" font-family="sans-serif">{body}</svg>')

def _t(x, y, s, anchor="middle"):
    return f'<text x="{x}" y="{y}" fill="currentColor" stroke="none" text-anchor="{anchor}">{s}</text>'

SVG_THALES = _svg(
    '<polygon points="40,160 260,160 120,20"/>'
    '<line x1="80" y1="90" x2="190" y2="90" stroke-dasharray="6 4"/>'
    + _t(120, 14, "A") + _t(70, 92, "M") + _t(204, 92, "N") + _t(30, 172, "B") + _t(270, 172, "C")
    + _t(150, 135, "(MN) // (BC)"))

SVG_PYTHAGORE = _svg(
    '<polygon points="50,150 250,150 50,30"/><polyline points="50,135 65,135 65,150"/>'
    + _t(40, 166, "A", "end") + _t(40, 30, "B", "end") + _t(260, 166, "C", "start")
    + _t(40, 95, "AB", "end") + _t(150, 168, "AC") + _t(160, 82, "BC (hypoténuse)", "start"))

SVG_AFFINE = _svg(
    '<line x1="20" y1="150" x2="290" y2="150"/><line x1="60" y1="170" x2="60" y2="10"/>'
    '<line x1="30" y1="170" x2="230" y2="10" stroke-width="3"/>'
    '<circle cx="80" cy="130" r="4" fill="currentColor"/><circle cx="130" cy="90" r="4" fill="currentColor"/>'
    '<polyline points="80,130 130,130 130,90" stroke-dasharray="4 4"/>'
    + _t(105, 146, "+1") + _t(150, 115, "+a", "start") + _t(48, 112, "b", "end")
    + _t(285, 142, "x") + _t(70, 20, "y", "start"))

SVG_TRIGO = _svg(
    '<polygon points="20,150 230,150 230,40"/><polyline points="215,150 215,135 230,135"/>'
    '<path d="M60,150 A40,40 0 0 0 56,132"/>'
    + _t(75, 140, "α") + _t(125, 168, "adjacent") + _t(238, 100, "opposé", "start") + _t(110, 82, "hypoténuse"))

SVG_LN_EXP = _svg(
    '<line x1="10" y1="120" x2="290" y2="120"/><line x1="110" y1="175" x2="110" y2="5"/>'
    '<line x1="10" y1="175" x2="200" y2="5" stroke-dasharray="4 4"/>'
    '<path d="M10,118 C60,116 90,100 110,95 C130,88 145,60 160,5" stroke-width="3"/>'
    '<path d="M116,175 C120,150 128,130 135,120 C160,95 210,82 290,70" stroke-width="3"/>'
    + _t(150, 20, "eˣ", "start") + _t(282, 62, "ln x", "end") + _t(196, 20, "y = x", "start")
    + _t(104, 108, "1", "end") + _t(135, 136, "1"))

SVG_RC = _svg(
    '<line x1="30" y1="160" x2="290" y2="160"/><line x1="30" y1="170" x2="30" y2="10"/>'
    '<line x1="30" y1="40" x2="290" y2="40" stroke-dasharray="6 4"/>'
    '<path d="M30,160 C70,70 120,48 290,41" stroke-width="3"/>'
    '<line x1="80" y1="160" x2="80" y2="84" stroke-dasharray="4 4"/>'
    + _t(24, 44, "E", "end") + _t(80, 176, "τ") + _t(88, 110, "0,63 E à t = τ", "start") + _t(282, 176, "t") + _t(40, 20, "uC", "start"))

SVG_PROJECTILE = _svg(
    '<line x1="20" y1="160" x2="290" y2="160"/><line x1="30" y1="170" x2="30" y2="10"/>'
    '<path d="M30,160 Q150,-20 270,160" stroke-width="3"/>'
    '<line x1="30" y1="160" x2="80" y2="110" stroke-width="2"/><polyline points="70,112 80,110 78,120"/>'
    '<path d="M60,160 A30,30 0 0 0 52,139"/>'
    + _t(66, 150, "α", "start") + _t(84, 104, "v₀", "start") + _t(150, 50, "parabole") + _t(270, 176, "portée"))

SVG_COEUR = _svg(
    '<rect x="110" y="8" width="100" height="26" rx="6"/><rect x="110" y="166" width="100" height="26" rx="6"/>'
    '<rect x="110" y="55" width="45" height="40" rx="6"/><rect x="165" y="55" width="45" height="40" rx="6"/>'
    '<rect x="110" y="100" width="45" height="45" rx="6"/><rect x="165" y="100" width="45" height="45" rx="6"/>'
    + _t(160, 26, "poumons") + _t(160, 184, "organes")
    + _t(132, 80, "OD") + _t(187, 80, "OG") + _t(132, 127, "VD") + _t(187, 127, "VG")
    + '<path d="M110,122 C80,122 80,21 110,21" stroke-dasharray="5 4"/><path d="M210,21 C240,21 240,75 210,75" stroke-dasharray="5 4"/>'
    '<path d="M210,122 C240,122 240,179 210,179"/><path d="M110,179 C80,179 80,75 110,75"/>'
    + _t(248, 50, "petite", "start") + _t(248, 160, "grande", "start") + _t(248, 94, "O : oreillette", "start") + _t(248, 112, "V : ventricule", "start"), 340, 200)

SVG_NEURONE = _svg(
    '<line x1="20" y1="150" x2="290" y2="150"/><line x1="30" y1="170" x2="30" y2="10"/>'
    '<line x1="30" y1="120" x2="290" y2="120" stroke-dasharray="4 4"/>'
    '<path d="M30,120 L100,120 L115,30 L130,140 L150,120 L290,120" stroke-width="3"/>'
    + _t(36, 112, "−70 mV", "start") + _t(120, 22, "+30 mV") + _t(240, 170, "temps (1 à 2 ms)")
    + _t(140, 142, "hyperpolarisation", "start") + _t(205, 112, "repos", "start"))


NOTIONS = {
  # ---------------------------------------------------------------- 3e : mathématiques
  "3e-maths": [
    {"id": "3e-thales", "title": "Le théorème de Thalès", "svg": SVG_THALES,
     "cours": ["Le théorème de Thalès permet de calculer des longueurs quand deux droites sont parallèles. Il sert aussi, dans l'autre sens (réciproque), à prouver que deux droites sont parallèles.",
               "On l'utilise dans un triangle ABC coupé par une droite parallèle à un côté : le petit triangle obtenu est un agrandissement ou une réduction du grand."],
     "enonce": ["Théorème : soit ABC un triangle, M un point de (AB) et N un point de (AC). Si (MN) // (BC), alors AM/AB = AN/AC = MN/BC.",
                "Réciproque : si A, M, B et A, N, C sont alignés dans le même ordre et si AM/AB = AN/AC, alors (MN) // (BC).",
                "Attention : on écrit toujours les rapports dans le même ordre (petit triangle en haut, grand triangle en bas)."],
     "exemples": [("Calculer une longueur", ["Dans ABC, M ∈ [AB], N ∈ [AC], (MN) // (BC). AM = 3 cm, AB = 5 cm, AC = 7,5 cm. Calculer AN.",
                    "Comme (MN) // (BC), Thalès donne AM/AB = AN/AC, soit 3/5 = AN/7,5.",
                    "Donc AN = 7,5 × 3 / 5 = 4,5 cm."]),
                  ("Prouver un parallélisme", ["AM = 2, AB = 5, AN = 3, AC = 7,5 avec A, M, B et A, N, C alignés dans le même ordre.",
                    "AM/AB = 2/5 = 0,4 et AN/AC = 3/7,5 = 0,4. Les rapports sont égaux.",
                    "D'après la réciproque de Thalès, (MN) // (BC)."])],
     "exo": {"context": "ABC est un triangle. M est sur [AB] et N sur [AC] avec (MN) // (BC). AM = 2 cm, AB = 6 cm, AN = 3 cm, BC = 9 cm.",
             "steps": [
               ("Quelle égalité permet d'écrire le théorème de Thalès ?", ["AM/AB = AN/AC = MN/BC", "AM/MB = BC/MN", "AB/AM = AN/AC", "AM × AB = AN × AC"], 0, "Les rapports se lisent petit triangle AMN sur grand triangle ABC, dans le même ordre.", 1),
               ("Calcule MN.", ["3 cm", "4,5 cm", "6 cm", "27 cm"], 0, "MN/BC = AM/AB = 2/6 = 1/3, donc MN = 9 / 3 = 3 cm.", 1),
               ("Calcule AC.", ["9 cm", "4 cm", "6 cm", "1 cm"], 0, "AN/AC = 1/3, donc AC = 3 × 3 = 9 cm.", 1),
               ("Le triangle AMN est une réduction de ABC de rapport :", ["1/3", "3", "2/6 × 9", "1/2"], 0, "Toutes les longueurs de AMN sont celles de ABC multipliées par 1/3.", 1)]}},
    {"id": "3e-pythagore", "title": "Le théorème de Pythagore", "svg": SVG_PYTHAGORE,
     "cours": ["Dans un triangle rectangle, le côté opposé à l'angle droit s'appelle l'hypoténuse : c'est le plus long côté.",
               "Le théorème de Pythagore relie les longueurs des trois côtés. Sa réciproque permet de savoir si un triangle est rectangle."],
     "enonce": ["Théorème : si le triangle ABC est rectangle en A, alors BC² = AB² + AC².",
                "Réciproque : si BC² = AB² + AC², alors le triangle ABC est rectangle en A.",
                "Si BC² ≠ AB² + AC² (BC étant le plus grand côté), le triangle n'est pas rectangle."],
     "exemples": [("Calculer l'hypoténuse", ["ABC rectangle en A, AB = 6 cm, AC = 8 cm.", "BC² = 6² + 8² = 36 + 64 = 100.", "BC = √100 = 10 cm."]),
                  ("Calculer un côté de l'angle droit", ["EFG rectangle en E, FG = 13 cm, EF = 5 cm.", "EG² = FG² − EF² = 169 − 25 = 144.", "EG = 12 cm."])],
     "exo": {"context": "Un triangle RST a pour côtés RS = 5 cm, ST = 12 cm et RT = 13 cm.",
             "steps": [
               ("Quel est le plus grand côté ?", ["RT", "ST", "RS", "Ils sont égaux"], 0, "RT = 13 cm est le plus grand : c'est l'hypoténuse possible.", 1),
               ("Compare RT² et RS² + ST².", ["169 = 25 + 144", "169 > 25 + 144", "169 < 25 + 144", "13 = 5 + 12"], 0, "RT² = 169 et RS² + ST² = 25 + 144 = 169.", 1),
               ("Que peut-on conclure ?", ["RST est rectangle en S", "RST est rectangle en R", "RST est rectangle en T", "RST n'est pas rectangle"], 0, "Réciproque de Pythagore : l'angle droit est en face de l'hypoténuse [RT], donc en S.", 1),
               ("Calcule l'aire de RST.", ["30 cm²", "60 cm²", "32,5 cm²", "78 cm²"], 0, "Les côtés de l'angle droit sont RS et ST : aire = 5 × 12 / 2 = 30 cm².", 1)]}},
    {"id": "3e-racines", "title": "Les racines carrées", "svg": None,
     "cours": ["La racine carrée d'un nombre positif a, notée √a, est le nombre positif dont le carré vaut a. Exemple : √49 = 7 car 7² = 49.",
               "Au BFEM, on demande souvent d'écrire une expression sous la forme a√b, avec b entier le plus petit possible, ou de rendre rationnel un dénominateur."],
     "enonce": ["Pour a ≥ 0 et b ≥ 0 : √(ab) = √a × √b et (√a)² = a.",
                "Pour a ≥ 0 et b > 0 : √(a/b) = √a / √b.",
                "Attention : √(a + b) n'est pas égal à √a + √b. Exemple : √(9 + 16) = 5 alors que √9 + √16 = 7.",
                "Pour enlever √b du dénominateur, on multiplie en haut et en bas par √b ; pour (√a − b), on multiplie par le conjugué (√a + b)."],
     "exemples": [("Simplifier", ["√72 = √(36 × 2) = √36 × √2 = 6√2.", "√50 + √8 = 5√2 + 2√2 = 7√2."]),
                  ("Rendre le dénominateur rationnel", ["3/√3 = 3√3 / 3 = √3.", "1/(√5 − 2) = (√5 + 2) / ((√5)² − 2²) = (√5 + 2)/1 = √5 + 2."])],
     "exo": {"context": "On donne A = √50 − 3√8 + √18 et B = 2/√2.",
             "steps": [
               ("Écris √50 sous la forme a√2.", ["5√2", "25√2", "2√5", "10√5"], 0, "√50 = √(25 × 2) = 5√2.", 1),
               ("Écris 3√8 sous la forme a√2.", ["6√2", "12√2", "3√2", "24√2"], 0, "√8 = √(4 × 2) = 2√2, donc 3√8 = 6√2.", 1),
               ("Calcule A.", ["2√2", "14√2", "−2√2", "√60"], 0, "√18 = 3√2, donc A = 5√2 − 6√2 + 3√2 = 2√2.", 1),
               ("Calcule B.", ["√2", "2√2", "1", "√2 / 2"], 0, "B = 2√2 / (√2 × √2) = 2√2 / 2 = √2.", 1),
               ("Calcule A × B.", ["4", "2√2", "2", "8"], 0, "A × B = 2√2 × √2 = 2 × 2 = 4.", 1)]}},
    {"id": "3e-affine", "title": "Les applications affines", "svg": SVG_AFFINE,
     "cours": ["Une application affine est de la forme f(x) = ax + b. Sa représentation graphique est une droite.",
               "a est le coefficient directeur (la pente) : quand x augmente de 1, f(x) augmente de a. b est l'ordonnée à l'origine : la droite coupe l'axe des ordonnées au point (0 ; b).",
               "Si b = 0, f(x) = ax est une application linéaire : sa droite passe par l'origine."],
     "enonce": ["Si f(x₁) et f(x₂) sont connus : a = (f(x₂) − f(x₁)) / (x₂ − x₁), puis b = f(x₁) − a x₁.",
                "Si a > 0, f est croissante ; si a < 0, f est décroissante ; si a = 0, f est constante.",
                "Deux droites sont parallèles si elles ont le même coefficient directeur."],
     "exemples": [("Trouver f à partir de deux images", ["f est affine, f(1) = 3 et f(3) = 7.", "a = (7 − 3) / (3 − 1) = 4/2 = 2.", "b = f(1) − 2 × 1 = 3 − 2 = 1. Donc f(x) = 2x + 1."])],
     "exo": {"context": "f est une application affine telle que f(2) = 1 et f(5) = 7.",
             "steps": [
               ("Calcule le coefficient a.", ["2", "3", "6", "1/2"], 0, "a = (7 − 1) / (5 − 2) = 6/3 = 2.", 1),
               ("Calcule b.", ["−3", "3", "1", "−1"], 0, "b = f(2) − 2 × 2 = 1 − 4 = −3. Donc f(x) = 2x − 3.", 1),
               ("Quel est le sens de variation de f ?", ["Croissante", "Décroissante", "Constante", "On ne peut pas savoir"], 0, "a = 2 > 0, donc f est croissante.", 1),
               ("Pour quelle valeur de x a-t-on f(x) = 0 ?", ["1,5", "−1,5", "3", "0"], 0, "2x − 3 = 0 donne x = 3/2 = 1,5.", 1)]}},
    {"id": "3e-systemes", "title": "Systèmes de deux équations", "svg": None, "programme": "Équations, inéquations et systèmes",
     "cours": ["Un système de deux équations à deux inconnues se résout par substitution (on exprime une inconnue en fonction de l'autre) ou par combinaison (on additionne ou soustrait les équations pour éliminer une inconnue).",
               "Dans un problème, on commence toujours par choisir les inconnues, puis on traduit l'énoncé en équations, on résout, et on vérifie."],
     "enonce": ["Substitution : de l'équation la plus simple, on tire x = … et on remplace dans l'autre.",
                "Combinaison : on multiplie les équations pour avoir le même coefficient devant une inconnue, puis on soustrait.",
                "On vérifie toujours la solution dans les deux équations."],
     "exemples": [("Par combinaison", ["x + y = 10 et x − y = 4.", "En additionnant : 2x = 14, donc x = 7.", "Puis y = 10 − 7 = 3. Solution : (7 ; 3)."])],
     "exo": {"context": "À la librairie, 2 cahiers et 3 stylos coûtent 1 100 F. Un cahier et un stylo coûtent 450 F. On note c le prix d'un cahier et s celui d'un stylo.",
             "steps": [
               ("Quel système traduit l'énoncé ?", ["2c + 3s = 1 100 et c + s = 450", "3c + 2s = 1 100 et c + s = 450", "2c + 3s = 450 et c + s = 1 100", "c + s = 1 100 et 2c = 3s"], 0, "On traduit chaque phrase en une équation.", 1),
               ("Multiplie la deuxième équation par 2 :", ["2c + 2s = 900", "2c + 2s = 450", "c + 2s = 900", "2c + s = 900"], 0, "2 × (c + s) = 2 × 450.", 1),
               ("En soustrayant, on obtient s =", ["200 F", "250 F", "100 F", "450 F"], 0, "(2c + 3s) − (2c + 2s) = 1 100 − 900, donc s = 200 F.", 1),
               ("Le prix d'un cahier est :", ["250 F", "200 F", "300 F", "650 F"], 0, "c = 450 − 200 = 250 F. Vérification : 2 × 250 + 3 × 200 = 1 100 F.", 1)]}},
    {"id": "3e-trigo", "title": "La trigonométrie", "svg": SVG_TRIGO,
     "cours": ["Dans un triangle rectangle, on peut relier un angle aigu et les longueurs des côtés avec le cosinus, le sinus et la tangente.",
               "Moyen de mémoriser : SOH CAH TOA (Sinus = Opposé / Hypoténuse ; Cosinus = Adjacent / Hypoténuse ; Tangente = Opposé / Adjacent)."],
     "enonce": ["cos α = côté adjacent / hypoténuse ; sin α = côté opposé / hypoténuse ; tan α = côté opposé / côté adjacent.",
                "Pour tout angle aigu : cos² α + sin² α = 1 et tan α = sin α / cos α.",
                "Valeurs à connaître : cos 60° = sin 30° = 1/2 ; cos 30° = sin 60° = √3/2 ; tan 45° = 1."],
     "exemples": [("Calculer une longueur", ["Triangle rectangle, hypoténuse 10 cm, angle de 30°.", "Côté opposé = 10 × sin 30° = 10 × 1/2 = 5 cm."])],
     "exo": {"context": "ABC est rectangle en A avec AB = 3 cm, AC = 4 cm et BC = 5 cm.",
             "steps": [
               ("Calcule cos(ABC).", ["3/5", "4/5", "3/4", "5/3"], 0, "Pour l'angle B, le côté adjacent est AB = 3 et l'hypoténuse BC = 5.", 1),
               ("Calcule sin(ABC).", ["4/5", "3/5", "4/3", "5/4"], 0, "Côté opposé à B : AC = 4 ; sin B = 4/5.", 1),
               ("Vérifie : cos² B + sin² B =", ["1", "7/5", "25/9", "0"], 0, "9/25 + 16/25 = 25/25 = 1.", 1),
               ("Calcule tan(ACB).", ["3/4", "4/3", "3/5", "4/5"], 0, "Pour l'angle C : opposé AB = 3, adjacent AC = 4, donc tan C = 3/4.", 1)]}},
    {"id": "3e-stats", "title": "Les statistiques", "svg": None,
     "cours": ["Une série statistique étudie un caractère (note, taille…) sur une population. L'effectif d'une valeur est le nombre de fois où elle apparaît.",
               "On résume une série par des paramètres de position : la moyenne, la médiane et le mode."],
     "enonce": ["Fréquence = effectif de la valeur / effectif total (souvent en %).",
                "Moyenne = (somme des valeurs × effectifs) / effectif total.",
                "Médiane : valeur qui partage la série rangée par ordre croissant en deux groupes de même effectif.",
                "Mode : valeur qui a le plus grand effectif."],
     "exemples": [("Série 4 ; 7 ; 7 ; 9 ; 13", ["Moyenne = (4 + 7 + 7 + 9 + 13) / 5 = 40/5 = 8.", "Médiane : 5 valeurs, la 3e est 7.", "Mode : 7 (2 fois)."])],
     "exo": {"context": "Les notes de 5 élèves sont : 8 ; 12 ; 10 ; 14 ; 11.",
             "steps": [
               ("Calcule la moyenne.", ["11", "10", "12", "55"], 0, "(8 + 12 + 10 + 14 + 11) / 5 = 55/5 = 11.", 1),
               ("Range la série par ordre croissant :", ["8 ; 10 ; 11 ; 12 ; 14", "8 ; 12 ; 10 ; 14 ; 11", "14 ; 12 ; 11 ; 10 ; 8", "8 ; 10 ; 12 ; 11 ; 14"], 0, "On classe de la plus petite à la plus grande.", 1),
               ("Quelle est la médiane ?", ["11", "10", "12", "10,5"], 0, "5 valeurs : la médiane est la 3e, soit 11.", 1),
               ("Quel pourcentage d'élèves a au moins 11 ?", ["60 %", "40 %", "50 %", "80 %"], 0, "11, 12 et 14 : 3 élèves sur 5, soit 60 %.", 1)]}},
  ],

  # ---------------------------------------------------------------- 3e : sciences physiques
  "3e-pc": [
    {"id": "3e-ohm", "title": "Résistance et loi d'Ohm", "svg": None,
     "cours": ["Un résistor (ou conducteur ohmique) s'oppose au passage du courant. Sa résistance R se mesure en ohms (Ω) avec un ohmmètre.",
               "La tension U aux bornes d'un résistor est proportionnelle à l'intensité I qui le traverse : c'est la loi d'Ohm."],
     "enonce": ["Loi d'Ohm : U = R × I (U en volts V, R en ohms Ω, I en ampères A).",
                "Donc I = U / R et R = U / I.",
                "Association en série : R = R₁ + R₂. En parallèle : 1/R = 1/R₁ + 1/R₂.",
                "Penser à convertir : 1 mA = 0,001 A ; 1 kΩ = 1 000 Ω."],
     "exemples": [("Calculer une tension", ["R = 100 Ω parcouru par I = 50 mA = 0,05 A.", "U = 100 × 0,05 = 5 V."]),
                  ("Résistances en série", ["R₁ = 20 Ω et R₂ = 30 Ω en série : R = 50 Ω."])],
     "exo": {"context": "Un résistor de résistance R = 48 Ω est branché aux bornes d'un générateur de tension U = 12 V.",
             "steps": [
               ("Quelle relation permet de calculer I ?", ["I = U / R", "I = U × R", "I = R / U", "I = U + R"], 0, "De U = R × I, on tire I = U / R.", 1),
               ("Calcule I.", ["0,25 A", "4 A", "576 A", "0,4 A"], 0, "I = 12 / 48 = 0,25 A, soit 250 mA.", 1),
               ("On ajoute en série un second résistor de 48 Ω. La résistance totale vaut :", ["96 Ω", "24 Ω", "48 Ω", "2 304 Ω"], 0, "En série, les résistances s'additionnent : 48 + 48 = 96 Ω.", 1),
               ("Nouvelle intensité :", ["0,125 A", "0,25 A", "0,5 A", "8 A"], 0, "I = 12 / 96 = 0,125 A : l'intensité est divisée par 2.", 1)]}},
    {"id": "3e-puissance", "title": "Puissance et énergie électriques", "svg": None,
     "cours": ["Chaque appareil électrique porte une puissance nominale en watts (W) : c'est l'énergie qu'il consomme chaque seconde.",
               "L'énergie consommée dépend de la puissance et de la durée de fonctionnement. La Senelec facture en kilowattheures (kWh)."],
     "enonce": ["P = U × I (P en W, U en V, I en A).",
                "E = P × t : en joules (J) si P en W et t en s ; en wattheures (Wh) si t en heures.",
                "1 kWh = 1 000 Wh = 3 600 000 J.",
                "Coût = énergie en kWh × prix du kWh."],
     "exemples": [("Une lampe", ["Une lampe de 60 W allumée 5 h consomme E = 60 × 5 = 300 Wh = 0,3 kWh."])],
     "exo": {"context": "Un fer à repasser porte l'indication 220 V – 1 000 W. Il fonctionne 30 minutes par jour. Le kWh coûte 100 F.",
             "steps": [
               ("Que signifie 1 000 W ?", ["Sa puissance nominale", "Sa tension", "Son énergie par jour", "Son intensité"], 0, "Le watt est l'unité de puissance.", 1),
               ("Calcule l'intensité qui le traverse.", ["≈ 4,5 A", "220 000 A", "0,22 A", "45 A"], 0, "I = P / U = 1 000 / 220 ≈ 4,5 A.", 1),
               ("Énergie consommée en un jour :", ["0,5 kWh", "30 kWh", "500 kWh", "2 kWh"], 0, "E = 1 kW × 0,5 h = 0,5 kWh.", 1),
               ("Coût sur 30 jours :", ["1 500 F", "50 F", "3 000 F", "15 000 F"], 0, "0,5 kWh × 30 = 15 kWh ; 15 × 100 = 1 500 F.", 1)]}},
    {"id": "3e-poids", "title": "Poids et masse", "svg": None,
     "cours": ["La masse m d'un objet (en kg) mesure la quantité de matière ; elle ne change pas d'un lieu à l'autre.",
               "Le poids P est la force d'attraction exercée par la Terre (ou un astre) sur l'objet. C'est une force : elle a une direction (verticale), un sens (vers le bas), un point d'application (centre de gravité) et une intensité en newtons (N)."],
     "enonce": ["P = m × g (P en N, m en kg, g en N/kg).",
                "Sur Terre, on prend g ≈ 10 N/kg (9,8 N/kg plus précisément). Sur la Lune, g ≈ 1,6 N/kg.",
                "Le poids se mesure avec un dynamomètre, la masse avec une balance."],
     "exemples": [("Un sac de riz", ["m = 50 kg ; P = 50 × 10 = 500 N."])],
     "exo": {"context": "Un objet a une masse de 2,5 kg. On prend g = 10 N/kg sur Terre et g = 1,6 N/kg sur la Lune.",
             "steps": [
               ("Calcule son poids sur Terre.", ["25 N", "2,5 N", "250 N", "0,25 N"], 0, "P = 2,5 × 10 = 25 N.", 1),
               ("Quelle est sa masse sur la Lune ?", ["2,5 kg", "0,4 kg", "4 kg", "1,6 kg"], 0, "La masse ne dépend pas du lieu.", 1),
               ("Calcule son poids sur la Lune.", ["4 N", "25 N", "1,6 N", "16 N"], 0, "P = 2,5 × 1,6 = 4 N.", 1),
               ("Avec quel appareil mesure-t-on le poids ?", ["Un dynamomètre", "Une balance", "Un ampèremètre", "Un thermomètre"], 0, "Le dynamomètre mesure les forces, en newtons.", 1)]}},
    {"id": "3e-lentilles", "title": "Les lentilles", "svg": None,
     "cours": ["Une lentille convergente (bords minces) fait converger les rayons lumineux ; une lentille divergente (bords épais) les fait diverger.",
               "Un faisceau parallèle à l'axe optique traversant une lentille convergente converge au foyer image F'. La distance OF' est la distance focale f."],
     "enonce": ["Vergence : C = 1 / f (C en dioptries δ, f en mètres).",
                "Rayons particuliers : un rayon passant par le centre optique O n'est pas dévié ; un rayon parallèle à l'axe ressort en passant par F' ; un rayon passant par F ressort parallèle à l'axe.",
                "L'œil myope se corrige avec une lentille divergente, l'œil hypermétrope avec une lentille convergente."],
     "exemples": [("Calculer une vergence", ["f = 20 cm = 0,2 m ; C = 1 / 0,2 = 5 δ."])],
     "exo": {"context": "Une lentille convergente a une vergence C = 10 δ.",
             "steps": [
               ("Calcule sa distance focale.", ["0,1 m soit 10 cm", "10 m", "1 m", "0,01 m"], 0, "f = 1 / C = 1 / 10 = 0,1 m.", 1),
               ("Un rayon passant par le centre optique O :", ["n'est pas dévié", "passe par F'", "ressort parallèle à l'axe", "est réfléchi"], 0, "C'est une propriété du centre optique.", 1),
               ("Un rayon parallèle à l'axe optique ressort :", ["en passant par le foyer image F'", "sans être dévié", "parallèle à l'axe", "en passant par O"], 0, "Le foyer image est le point de convergence des rayons parallèles à l'axe.", 1),
               ("Quel type de lentille corrige la myopie ?", ["Divergente", "Convergente", "N'importe laquelle", "Aucune"], 0, "Le myope voit flou de loin : l'image se forme avant la rétine, on la recule avec une lentille divergente.", 1)]}},
  ],

  # ---------------------------------------------------------------- 3e : SVT
  "3e-svt": [
    {"id": "3e-digestion", "title": "La digestion et l'absorption", "svg": None,
     "cours": ["La digestion transforme les aliments en nutriments assez petits pour passer dans le sang. Elle est mécanique (mastication, brassage) et chimique (enzymes des sucs digestifs).",
               "Chaque enzyme agit sur un aliment précis et dans des conditions précises (température de 37 °C, pH)."],
     "enonce": ["Amylase salivaire : amidon → maltose. Dans l'intestin, le maltose donne du glucose.",
                "Protéines → acides aminés (pepsine dans l'estomac, puis enzymes pancréatiques et intestinales).",
                "Lipides → acides gras et glycérol (lipase pancréatique, aidée par la bile qui émulsionne les graisses).",
                "L'absorption se fait au niveau des villosités de l'intestin grêle, qui offrent une très grande surface."],
     "exemples": [("Expérience de l'amylase", ["Tube 1 : empois d'amidon + salive à 37 °C. Après 15 min, l'eau iodée ne bleuit plus : l'amidon a disparu.",
                    "Tube 2 : même mélange à 0 °C : l'eau iodée bleuit encore.",
                    "Conclusion : la salive digère l'amidon, mais seulement à une température favorable."])],
     "exo": {"context": "On prépare trois tubes avec de l'empois d'amidon. Tube A : + salive, 37 °C. Tube B : + eau, 37 °C. Tube C : + salive bouillie, 37 °C. Après 20 min, on ajoute de l'eau iodée.",
             "steps": [
               ("Quel tube ne bleuit pas ?", ["Le tube A", "Le tube B", "Le tube C", "Aucun"], 0, "Seule la salive active digère l'amidon : il n'y a plus d'amidon dans A.", 1),
               ("À quoi sert le tube B ?", ["C'est le témoin : sans salive, l'amidon reste", "À chauffer l'amidon", "À tester la bile", "À rien"], 0, "Le témoin montre que l'eau seule ne digère pas l'amidon.", 1),
               ("Pourquoi le tube C bleuit-il ?", ["L'ébullition a détruit l'enzyme de la salive", "Il manque de l'eau", "Il fait trop froid", "L'amidon est un nutriment"], 0, "L'amylase est une protéine détruite par la chaleur.", 1),
               ("Où se fait l'absorption des nutriments ?", ["Dans l'intestin grêle", "Dans l'estomac", "Dans la bouche", "Dans le gros intestin"], 0, "Les villosités intestinales sont très irriguées par le sang.", 1)]}},
    {"id": "3e-circulation", "title": "La circulation sanguine", "svg": SVG_COEUR,
     "cours": ["Le cœur est un muscle creux à quatre cavités : deux oreillettes en haut, deux ventricules en bas. Le cœur droit et le cœur gauche ne communiquent pas.",
               "Chez l'homme, la circulation est double : la petite circulation (pulmonaire) et la grande circulation (générale)."],
     "enonce": ["Petite circulation : ventricule droit → artère pulmonaire → poumons (le sang se charge en O₂) → veines pulmonaires → oreillette gauche.",
                "Grande circulation : ventricule gauche → aorte → organes (le sang cède O₂ et nutriments, reçoit CO₂) → veines caves → oreillette droite.",
                "Les artères partent du cœur, les veines y reviennent. Les valvules empêchent le sang de refluer."],
     "exemples": [("Trajet d'une goutte de sang", ["Oreillette droite → ventricule droit → poumons → oreillette gauche → ventricule gauche → aorte → organes → veines caves → oreillette droite."])],
     "exo": {"context": "On suit une goutte de sang qui quitte le ventricule gauche.",
             "steps": [
               ("Dans quel vaisseau part-elle ?", ["L'aorte", "L'artère pulmonaire", "La veine cave", "La veine pulmonaire"], 0, "Le ventricule gauche envoie le sang dans l'aorte, vers tout le corps.", 1),
               ("Par où revient-elle au cœur ?", ["Par les veines caves, dans l'oreillette droite", "Par l'aorte", "Par les veines pulmonaires", "Directement dans le ventricule droit"], 0, "Le sang pauvre en O₂ revient par les veines caves.", 1),
               ("Où se charge-t-elle en dioxygène ?", ["Dans les poumons", "Dans le cœur", "Dans le foie", "Dans les muscles"], 0, "Les échanges gazeux se font dans les alvéoles pulmonaires.", 1),
               ("Le sang dans les veines pulmonaires est :", ["Riche en dioxygène", "Pauvre en dioxygène", "Riche en CO₂", "Sans globules rouges"], 0, "Il revient des poumons où il vient de se charger en O₂ : c'est une exception (veines à sang rouge vif).", 1)]}},
    {"id": "3e-immunite", "title": "L'immunité : vaccin et sérum", "svg": None,
     "cours": ["L'organisme se défend contre les microbes : d'abord par la phagocytose (réaction rapide, non spécifique), puis par la production d'anticorps et de lymphocytes spécifiques.",
               "La médecine aide l'organisme de deux façons : la vaccination (prévention) et la sérothérapie (traitement d'urgence)."],
     "enonce": ["Vaccin : microbe atténué ou toxine rendue inoffensive (anatoxine). L'organisme fabrique lui-même ses anticorps et garde une mémoire. Protection lente à venir mais durable. Il est préventif.",
                "Sérum : contient des anticorps déjà fabriqués. Protection immédiate mais de courte durée. Il est curatif.",
                "Les rappels de vaccin renforcent la mémoire immunitaire."],
     "exemples": [("Deux situations", ["Un enfant de 9 mois reçoit le vaccin contre la rougeole : prévention.", "Un berger mordu par un serpent reçoit un sérum antivenimeux : il faut agir tout de suite."])],
     "exo": {"context": "Moussa se blesse avec un clou rouillé. Il n'est pas vacciné contre le tétanos.",
             "steps": [
               ("Que faut-il lui administrer en urgence ?", ["Un sérum antitétanique", "Un vaccin seul", "Un antibiotique contre le virus", "Rien"], 0, "Il faut des anticorps immédiatement : c'est le sérum.", 1),
               ("Pourquoi pas seulement le vaccin ?", ["Il met plusieurs jours à agir", "Il est dangereux", "Il ne contient rien", "Il agit trop vite"], 0, "L'organisme doit d'abord fabriquer ses propres anticorps.", 1),
               ("La protection apportée par le sérum est :", ["Immédiate et de courte durée", "Lente et durable", "Définitive", "Inexistante"], 0, "Les anticorps injectés sont éliminés en quelques semaines.", 1),
               ("Pour être protégé durablement, Moussa devra :", ["Se faire vacciner avec des rappels", "Reprendre du sérum chaque mois", "Manger plus", "Prendre des vitamines"], 0, "Le vaccin crée une mémoire immunitaire durable.", 1)]}},
  ],

  # ---------------------------------------------------------------- 3e : français
  "3e-francais": [
    {"id": "3e-figures", "title": "Les figures de style", "svg": None,
     "cours": ["Une figure de style est une manière particulière d'écrire pour rendre une idée plus frappante. Au BFEM, on demande de l'identifier et d'expliquer son effet.",
               "Toujours répondre en deux temps : « C'est une … » puis « Elle permet de … »."],
     "enonce": ["Comparaison : rapprochement avec un outil (comme, tel, pareil à). « Il est fort comme un lion. »",
                "Métaphore : rapprochement sans outil. « Cet homme est un lion. »",
                "Personnification : on prête des traits humains à une chose. « Le vent hurlait. »",
                "Hyperbole : exagération. « Je te l'ai dit mille fois. »",
                "Antithèse : opposition de deux mots. « Il fait froid dehors, mon cœur est brûlant. »",
                "Anaphore : répétition d'un mot en début de phrase ou de vers."],
     "exemples": [("Analyser une phrase", ["« Le baobab, vieux sage du village, veillait sur nous. »", "C'est une personnification (et une métaphore « vieux sage ») : l'arbre devient un ancien protecteur, ce qui montre son importance pour le village."])],
     "exo": {"context": "Identifie la figure de style dans chaque phrase.",
             "steps": [
               ("« Ses yeux brillaient comme des étoiles. »", ["Comparaison", "Métaphore", "Hyperbole", "Antithèse"], 0, "L'outil « comme » signale une comparaison.", 1),
               ("« La ville dormait sous la lune. »", ["Personnification", "Comparaison", "Anaphore", "Antithèse"], 0, "Dormir est une action humaine prêtée à la ville.", 1),
               ("« J'ai une montagne de devoirs. »", ["Hyperbole (ou métaphore exagérée)", "Comparaison", "Antithèse", "Personnification"], 0, "On exagère la quantité de devoirs.", 1),
               ("« Tout le monde rit, lui seul pleure. »", ["Antithèse", "Comparaison", "Anaphore", "Personnification"], 0, "Rire et pleurer s'opposent.", 1)]}},
    {"id": "3e-argumenter", "title": "La rédaction argumentative", "svg": None,
     "cours": ["Au BFEM, le sujet de réflexion demande de défendre une opinion (thèse) avec des arguments illustrés d'exemples.",
               "Un bon devoir a une introduction, un développement en deux ou trois paragraphes et une conclusion."],
     "enonce": ["Introduction : amener le sujet, poser le sujet (le citer ou le reformuler), annoncer le plan.",
                "Chaque paragraphe : une idée (argument) + une explication + un exemple précis (vie quotidienne, actualité, lecture).",
                "Connecteurs : d'abord, ensuite, de plus, en outre, cependant, par conséquent, enfin.",
                "Conclusion : bilan de la réflexion et ouverture (une question plus large)."],
     "exemples": [("Sujet : « Le téléphone portable est-il utile à l'élève ? »", ["Argument : il donne accès au savoir.", "Explication : on peut y consulter des cours et des exercices.", "Exemple : une application de révision permet de s'entraîner pour le BFEM même sans livre."])],
     "exo": {"context": "Sujet : « Faut-il interdire le téléphone portable à l'école ? »",
             "steps": [
               ("Quelle phrase est une thèse ?", ["Le téléphone doit être encadré, pas interdit, à l'école.", "Le téléphone a été inventé au XIXe siècle.", "Mon ami a un téléphone.", "Les téléphones coûtent cher."], 0, "La thèse est une opinion sur la question posée.", 1),
               ("Quel élément vient en dernier dans l'introduction ?", ["L'annonce du plan", "L'amorce", "La conclusion", "Un exemple"], 0, "On amène, on pose, puis on annonce le plan.", 1),
               ("Quel connecteur introduit une opposition ?", ["Cependant", "De plus", "Ensuite", "Par exemple"], 0, "Cependant marque une concession ou une opposition.", 1),
               ("Un paragraphe bien construit contient :", ["Un argument, une explication et un exemple", "Seulement des exemples", "Une citation sans commentaire", "Plusieurs idées mélangées"], 0, "Une idée par paragraphe, expliquée et illustrée.", 1)]}},
  ],

  # ---------------------------------------------------------------- Terminale S : mathématiques
  "tle-maths": [
    {"id": "tle-derivation", "title": "Dérivation et sens de variation", "svg": None,
     "cours": ["La dérivée f'(x) donne la pente de la tangente à la courbe au point d'abscisse x. Son signe donne le sens de variation de f.",
               "Plan type d'une étude de fonction au BAC : ensemble de définition, limites aux bornes, dérivée, signe de la dérivée, tableau de variations, puis courbe."],
     "enonce": ["(u + v)' = u' + v' ; (uv)' = u'v + uv' ; (u/v)' = (u'v − uv') / v² ; (uⁿ)' = n u' uⁿ⁻¹ ; (√u)' = u' / (2√u).",
                "Si f' > 0 sur un intervalle, f y est strictement croissante ; si f' < 0, strictement décroissante.",
                "Tangente au point d'abscisse a : y = f'(a)(x − a) + f(a)."],
     "exemples": [("f(x) = x² − 4x + 1", ["f'(x) = 2x − 4, qui s'annule en x = 2.", "f' < 0 sur ]−∞ ; 2[ et f' > 0 sur ]2 ; +∞[.", "f admet un minimum f(2) = 4 − 8 + 1 = −3."])],
     "exo": {"context": "Soit f définie sur ℝ par f(x) = x³ − 3x + 1.",
             "steps": [
               ("Calcule f'(x).", ["3x² − 3", "3x² − 3x", "x² − 3", "3x − 3"], 0, "(x³)' = 3x², (−3x)' = −3, (1)' = 0.", 1),
               ("Pour quelles valeurs f'(x) = 0 ?", ["x = −1 et x = 1", "x = 0", "x = 3", "x = 1 seulement"], 0, "3x² − 3 = 3(x − 1)(x + 1).", 1),
               ("Sur ]−1 ; 1[, f est :", ["décroissante", "croissante", "constante", "positive"], 0, "Entre les racines, 3(x² − 1) < 0.", 1),
               ("Valeur du maximum local en x = −1 :", ["3", "−1", "1", "5"], 0, "f(−1) = −1 + 3 + 1 = 3.", 1),
               ("Équation de la tangente en x = 0 :", ["y = −3x + 1", "y = 3x + 1", "y = −3x", "y = 1"], 0, "f'(0) = −3 et f(0) = 1, donc y = −3(x − 0) + 1.", 1)]}},
    {"id": "tle-ln", "title": "La fonction logarithme népérien", "svg": SVG_LN_EXP,
     "cours": ["La fonction ln est définie sur ]0 ; +∞[. C'est la primitive de 1/x qui s'annule en 1. Elle transforme les produits en sommes.",
               "Au BAC, on l'utilise pour résoudre des équations et inéquations, étudier des fonctions et calculer des limites."],
     "enonce": ["ln 1 = 0 ; ln e = 1 ; ln(ab) = ln a + ln b ; ln(a/b) = ln a − ln b ; ln(aⁿ) = n ln a.",
                "(ln x)' = 1/x ; (ln u)' = u'/u (u > 0). ln est strictement croissante sur ]0 ; +∞[.",
                "ln a = ln b ⇔ a = b (a, b > 0) ; ln x > 0 ⇔ x > 1.",
                "Limites : ln x → −∞ quand x → 0⁺ ; ln x → +∞ quand x → +∞ ; ln x / x → 0 en +∞ ; x ln x → 0 en 0⁺."],
     "exemples": [("Résoudre ln(2x − 1) = 0", ["Condition : 2x − 1 > 0, soit x > 1/2.", "ln(2x − 1) = ln 1 donne 2x − 1 = 1, donc x = 1.", "1 > 1/2 : S = {1}."])],
     "exo": {"context": "On veut résoudre dans ℝ l'équation ln(x) + ln(x − 1) = ln 6.",
             "steps": [
               ("Ensemble de validité :", ["]1 ; +∞[", "]0 ; +∞[", "ℝ", "]−∞ ; 1["], 0, "Il faut x > 0 et x − 1 > 0, donc x > 1.", 1),
               ("L'équation devient :", ["ln(x(x − 1)) = ln 6", "ln(2x − 1) = ln 6", "ln x × ln(x − 1) = ln 6", "x + x − 1 = 6"], 0, "ln a + ln b = ln(ab).", 1),
               ("On obtient l'équation :", ["x² − x − 6 = 0", "x² − x + 6 = 0", "x² = 6", "2x − 1 = 6"], 0, "x(x − 1) = 6 donne x² − x − 6 = 0.", 1),
               ("Ses racines sont :", ["3 et −2", "−3 et 2", "6 et −1", "1 et 6"], 0, "Δ = 1 + 24 = 25 ; x = (1 ± 5)/2.", 1),
               ("Solution de l'équation de départ :", ["S = {3}", "S = {3 ; −2}", "S = {−2}", "S = ∅"], 0, "−2 n'est pas dans ]1 ; +∞[ : on ne garde que 3.", 1)]}},
    {"id": "tle-exp", "title": "La fonction exponentielle", "svg": SVG_LN_EXP,
     "cours": ["La fonction exponentielle est la réciproque de ln : y = eˣ ⇔ x = ln y (y > 0). Elle est définie sur ℝ et strictement positive.",
               "C'est la seule fonction égale à sa dérivée et qui vaut 1 en 0."],
     "enonce": ["e⁰ = 1 ; eᵃ⁺ᵇ = eᵃ × eᵇ ; eᵃ⁻ᵇ = eᵃ / eᵇ ; (eᵃ)ⁿ = eⁿᵃ ; ln(eˣ) = x ; e^(ln x) = x (x > 0).",
                "(eˣ)' = eˣ ; (eᵘ)' = u' eᵘ.",
                "eᵃ = eᵇ ⇔ a = b ; eˣ = k (k > 0) ⇔ x = ln k.",
                "Limites : eˣ → 0 en −∞ ; eˣ → +∞ en +∞ ; eˣ / x → +∞ en +∞ ; x eˣ → 0 en −∞."],
     "exemples": [("Résoudre e²ˣ⁻¹ = 5", ["2x − 1 = ln 5, donc x = (1 + ln 5) / 2."])],
     "exo": {"context": "On veut résoudre e²ˣ − 3eˣ + 2 = 0. On pose X = eˣ.",
             "steps": [
               ("L'équation devient :", ["X² − 3X + 2 = 0", "X² − 3X = 2", "2X − 3X + 2 = 0", "X² + 3X + 2 = 0"], 0, "e²ˣ = (eˣ)² = X².", 1),
               ("Les solutions en X sont :", ["1 et 2", "−1 et −2", "3 et 2", "0 et 3"], 0, "Δ = 9 − 8 = 1 ; X = (3 ± 1)/2.", 1),
               ("eˣ = 1 donne :", ["x = 0", "x = 1", "x = e", "pas de solution"], 0, "eˣ = e⁰.", 1),
               ("eˣ = 2 donne :", ["x = ln 2", "x = e²", "x = 2", "x = 2/e"], 0, "On passe au logarithme : x = ln 2.", 1)]}},
    {"id": "tle-suites", "title": "Les suites numériques", "svg": None,
     "cours": ["Au BAC, on rencontre surtout des suites définies par récurrence uₙ₊₁ = a uₙ + b, que l'on étudie à l'aide d'une suite auxiliaire géométrique.",
               "Il faut savoir reconnaître une suite arithmétique ou géométrique, calculer un terme général, une somme et une limite."],
     "enonce": ["Arithmétique de raison r : uₙ = u₀ + nr ; somme de termes consécutifs = nombre de termes × (premier + dernier) / 2.",
                "Géométrique de raison q : uₙ = u₀ qⁿ ; somme = premier terme × (1 − q^(nombre de termes)) / (1 − q) (q ≠ 1).",
                "Si −1 < q < 1, qⁿ → 0 ; si q > 1, qⁿ → +∞.",
                "Pour montrer que (vₙ) est géométrique, on exprime vₙ₊₁ en fonction de vₙ et on trouve vₙ₊₁ = q vₙ."],
     "exemples": [("Somme géométrique", ["1 + 2 + 4 + … + 2⁹ = (1 − 2¹⁰)/(1 − 2) = 1 023."])],
     "exo": {"context": "(uₙ) est définie par u₀ = 5 et uₙ₊₁ = 2uₙ − 3. On pose vₙ = uₙ − 3.",
             "steps": [
               ("Calcule u₁.", ["7", "10", "13", "2"], 0, "u₁ = 2 × 5 − 3 = 7.", 1),
               ("Exprime vₙ₊₁ en fonction de vₙ.", ["vₙ₊₁ = 2vₙ", "vₙ₊₁ = vₙ + 2", "vₙ₊₁ = 2vₙ − 3", "vₙ₊₁ = vₙ / 2"], 0, "vₙ₊₁ = uₙ₊₁ − 3 = 2uₙ − 6 = 2(uₙ − 3) = 2vₙ : (vₙ) est géométrique de raison 2.", 1),
               ("Calcule v₀.", ["2", "5", "−3", "8"], 0, "v₀ = u₀ − 3 = 2.", 1),
               ("En déduis uₙ.", ["uₙ = 3 + 2ⁿ⁺¹", "uₙ = 5 × 2ⁿ", "uₙ = 2ⁿ − 3", "uₙ = 3 + 2n"], 0, "vₙ = 2 × 2ⁿ = 2ⁿ⁺¹, donc uₙ = vₙ + 3.", 1),
               ("Limite de (uₙ) :", ["+∞", "3", "0", "5"], 0, "2ⁿ⁺¹ → +∞ car 2 > 1.", 1)]}},
    {"id": "tle-complexes", "title": "Les nombres complexes", "svg": None,
     "cours": ["Un nombre complexe s'écrit z = a + ib (forme algébrique) avec i² = −1, ou z = r e^(iθ) (forme exponentielle), où r = |z| est le module et θ un argument.",
               "En géométrie, z est l'affixe d'un point M du plan. Le module est la distance OM, l'argument l'angle avec l'axe des abscisses."],
     "enonce": ["|a + ib| = √(a² + b²) ; conjugué : z̄ = a − ib ; z z̄ = |z|².",
                "cos θ = a / r et sin θ = b / r.",
                "Produit : modules multipliés, arguments additionnés. Moivre : (e^(iθ))ⁿ = e^(inθ).",
                "Équation az² + bz + c = 0 avec Δ < 0 : z = (−b ± i√(−Δ)) / (2a)."],
     "exemples": [("z = 1 + i", ["|z| = √2 ; cos θ = sin θ = √2/2, donc θ = π/4.", "z = √2 e^(iπ/4)."])],
     "exo": {"context": "On considère z = √3 + i.",
             "steps": [
               ("Calcule |z|.", ["2", "4", "√3 + 1", "√2"], 0, "|z| = √(3 + 1) = 2.", 1),
               ("Un argument de z est :", ["π/6", "π/3", "π/4", "2π/3"], 0, "cos θ = √3/2 et sin θ = 1/2.", 1),
               ("Forme exponentielle de z :", ["2 e^(iπ/6)", "4 e^(iπ/6)", "2 e^(iπ/3)", "√3 e^(i)"], 0, "z = r e^(iθ).", 1),
               ("Calcule z⁶.", ["−64", "64", "64i", "−64i"], 0, "z⁶ = 2⁶ e^(iπ) = 64 × (−1) = −64.", 1)]}},
    {"id": "tle-probas", "title": "Probabilités et loi binomiale", "svg": None,
     "cours": ["Une épreuve de Bernoulli a deux issues : succès (probabilité p) et échec (1 − p). Si on la répète n fois de façon indépendante, le nombre X de succès suit la loi binomiale B(n ; p).",
               "Au BAC, on demande souvent P(X = k), P(X ≥ 1) et l'espérance."],
     "enonce": ["P(X = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ, où C(n, k) = n! / (k!(n − k)!).",
                "P(X ≥ 1) = 1 − P(X = 0) = 1 − (1 − p)ⁿ.",
                "E(X) = np ; V(X) = np(1 − p).",
                "Probabilité conditionnelle : P_A(B) = P(A ∩ B) / P(A)."],
     "exemples": [("Lancer 3 fois une pièce", ["X = nombre de « pile » suit B(3 ; 1/2).", "P(X = 2) = 3 × (1/2)² × (1/2) = 3/8."])],
     "exo": {"context": "Un joueur tire 3 penalties. À chaque tir, il marque avec la probabilité 0,4, indépendamment. X est le nombre de buts.",
             "steps": [
               ("X suit la loi :", ["B(3 ; 0,4)", "B(0,4 ; 3)", "B(3 ; 0,6)", "uniforme"], 0, "3 répétitions indépendantes, succès « marquer » de probabilité 0,4.", 1),
               ("Calcule P(X = 0).", ["0,216", "0,064", "0,6", "0"], 0, "0,6³ = 0,216.", 1),
               ("Calcule P(X = 2).", ["0,288", "0,16", "0,096", "0,48"], 0, "C(3, 2) × 0,4² × 0,6 = 3 × 0,16 × 0,6 = 0,288.", 1),
               ("Probabilité de marquer au moins une fois :", ["0,784", "0,216", "0,4", "0,936"], 0, "1 − 0,216 = 0,784.", 1),
               ("Espérance de X :", ["1,2", "0,4", "3", "0,72"], 0, "E(X) = 3 × 0,4 = 1,2 but en moyenne.", 1)]}},
    {"id": "tle-integrales", "title": "Primitives et intégrales", "svg": None,
     "cours": ["F est une primitive de f si F' = f. L'intégrale de a à b de f est F(b) − F(a) ; si f ≥ 0, c'est l'aire sous la courbe en unités d'aire.",
               "L'intégration par parties sert à intégrer un produit, par exemple x eˣ ou x ln x."],
     "enonce": ["Primitives : xⁿ → xⁿ⁺¹/(n + 1) ; 1/x → ln x ; eˣ → eˣ ; u'eᵘ → eᵘ ; u'/u → ln|u|.",
                "∫ₐᵇ f(x) dx = [F(x)]ₐᵇ = F(b) − F(a).",
                "Par parties : ∫ₐᵇ u v' = [uv]ₐᵇ − ∫ₐᵇ u' v.",
                "Valeur moyenne de f sur [a ; b] : (1/(b − a)) ∫ₐᵇ f(x) dx."],
     "exemples": [("∫₀¹ (2x + 1) dx", ["Une primitive est x² + x.", "[x² + x]₀¹ = 2 − 0 = 2."])],
     "exo": {"context": "On veut calculer I = ∫₀¹ x eˣ dx par parties.",
             "steps": [
               ("Quel choix est judicieux ?", ["u = x et v' = eˣ", "u = eˣ et v' = x", "u = x eˣ et v' = 1", "u = 1 et v' = x eˣ"], 0, "En dérivant x, on obtient 1 : l'intégrale devient simple.", 1),
               ("On obtient I =", ["[x eˣ]₀¹ − ∫₀¹ eˣ dx", "[x eˣ]₀¹ + ∫₀¹ eˣ dx", "[eˣ]₀¹", "∫₀¹ x dx × ∫₀¹ eˣ dx"], 0, "u' = 1 et v = eˣ.", 1),
               ("Calcule [x eˣ]₀¹.", ["e", "e − 1", "1", "0"], 0, "1 × e − 0 × 1 = e.", 1),
               ("Calcule ∫₀¹ eˣ dx.", ["e − 1", "e", "1", "e + 1"], 0, "[eˣ]₀¹ = e − 1.", 1),
               ("Donc I =", ["1", "2e − 1", "e", "0"], 0, "I = e − (e − 1) = 1.", 1)]}},
    {"id": "tle-equadiff", "title": "Équations différentielles", "svg": None,
     "cours": ["Une équation différentielle relie une fonction inconnue y et ses dérivées. On les retrouve en physique (décharge d'un condensateur, radioactivité, oscillations).",
               "Au BAC S, on résout y' = ay + b et y'' + ω²y = 0, puis on trouve la solution qui vérifie des conditions initiales."],
     "enonce": ["y' = ay : solutions y = C e^(ax), C réel.",
                "y' = ay + b (a ≠ 0) : y = C e^(ax) − b/a.",
                "y'' + ω²y = 0 : y = A cos(ωx) + B sin(ωx).",
                "y'' + ay' + by = 0 : on résout r² + ar + b = 0 (équation caractéristique)."],
     "exemples": [("y' = −2y avec y(0) = 5", ["y = C e^(−2x) ; y(0) = C = 5.", "Solution : y = 5 e^(−2x)."])],
     "exo": {"context": "On considère l'équation (E) : y' = 2y − 4.",
             "steps": [
               ("La solution constante de (E) est :", ["y = 2", "y = −2", "y = 4", "y = 0"], 0, "y' = 0 donne 2y − 4 = 0, soit y = 2 (c'est −b/a).", 1),
               ("Les solutions de (E) sont :", ["y = C e^(2x) + 2", "y = C e^(−2x) + 2", "y = C e^(2x) − 4", "y = 2x − 4"], 0, "y = C e^(ax) − b/a avec a = 2, b = −4.", 1),
               ("Solution telle que y(0) = 5 :", ["y = 3 e^(2x) + 2", "y = 5 e^(2x)", "y = 5 e^(2x) + 2", "y = 7 e^(2x) − 2"], 0, "C + 2 = 5, donc C = 3.", 1),
               ("Les solutions de y'' + 9y = 0 sont :", ["A cos 3x + B sin 3x", "A e^(3x) + B e^(−3x)", "A cos 9x + B sin 9x", "C e^(9x)"], 0, "ω² = 9, donc ω = 3.", 1)]}},
  ],

  # ---------------------------------------------------------------- Terminale S : sciences physiques
  "tle-pc": [
    {"id": "tle-rfd", "title": "Relation fondamentale de la dynamique", "svg": None,
     "cours": ["Pour étudier un mouvement, on choisit un système, un référentiel galiléen (terrestre), on fait le bilan des forces, puis on applique la deuxième loi de Newton.",
               "Méthode : schéma, bilan des forces, projection sur des axes, calcul de l'accélération, puis des équations horaires."],
     "enonce": ["Deuxième loi de Newton (RFD) : Σ F⃗ = m a⃗.",
                "Mouvement rectiligne uniformément varié : a constante ; v = a t + v₀ ; x = ½ a t² + v₀ t + x₀ ; v² − v₀² = 2a(x − x₀).",
                "Poids : P = m g. Sur un plan incliné d'angle α sans frottement : a = g sin α."],
     "exemples": [("Plan incliné", ["Un solide glisse sans frottement sur un plan incliné à 30°, g = 10 m/s².", "a = g sin 30° = 5 m/s²."])],
     "exo": {"context": "Un solide de masse 2 kg, au repos sur un sol horizontal, est tiré par une force horizontale F = 10 N. Les frottements valent f = 2 N.",
             "steps": [
               ("La RFD projetée sur l'axe du mouvement donne :", ["F − f = m a", "F + f = m a", "F = m g", "f = m a"], 0, "Le poids et la réaction se compensent ; il reste F et f opposées.", 1),
               ("Calcule l'accélération.", ["4 m/s²", "5 m/s²", "6 m/s²", "16 m/s²"], 0, "a = (10 − 2) / 2 = 4 m/s².", 1),
               ("Vitesse au bout de 3 s :", ["12 m/s", "4 m/s", "18 m/s", "7 m/s"], 0, "v = a t = 4 × 3 = 12 m/s.", 1),
               ("Distance parcourue en 3 s :", ["18 m", "12 m", "36 m", "6 m"], 0, "x = ½ × 4 × 3² = 18 m.", 1)]}},
    {"id": "tle-projectile", "title": "Mouvement dans le champ de pesanteur", "svg": SVG_PROJECTILE,
     "cours": ["Un projectile soumis à son seul poids a une accélération a⃗ = g⃗ : le mouvement est uniforme horizontalement et uniformément varié verticalement.",
               "La trajectoire est une parabole (ou une droite si le lancer est vertical)."],
     "enonce": ["Avec v₀ faisant l'angle α avec l'horizontale, origine au point de lancement, axe vertical vers le haut :",
                "x(t) = v₀ cos α · t ; z(t) = −½ g t² + v₀ sin α · t.",
                "Équation de la trajectoire : z = −g x² / (2 v₀² cos² α) + x tan α.",
                "Portée (retour au même niveau) : xₘ = v₀² sin 2α / g, maximale pour α = 45°. Flèche : h = v₀² sin² α / (2g)."],
     "exemples": [("Lancer à 45°", ["v₀ = 20 m/s, g = 10 m/s² : portée = 400 × 1 / 10 = 40 m."])],
     "exo": {"context": "Une bille est lancée horizontalement depuis une table de hauteur h = 5 m avec v₀ = 10 m/s. On prend g = 10 m/s² et on néglige l'air.",
             "steps": [
               ("Le mouvement horizontal est :", ["rectiligne uniforme", "uniformément accéléré", "circulaire", "immobile"], 0, "Aucune force horizontale : la vitesse horizontale reste v₀.", 1),
               ("Durée de la chute :", ["1 s", "0,5 s", "2 s", "10 s"], 0, "5 = ½ × 10 × t², donc t² = 1, t = 1 s.", 1),
               ("Distance horizontale au point d'impact :", ["10 m", "5 m", "20 m", "50 m"], 0, "x = v₀ t = 10 × 1 = 10 m.", 1),
               ("Vitesse verticale à l'impact :", ["10 m/s", "5 m/s", "0 m/s", "20 m/s"], 0, "vz = g t = 10 m/s.", 1)]}},
    {"id": "tle-rc", "title": "Le dipôle RC", "svg": SVG_RC,
     "cours": ["Un condensateur stocke des charges. Branché en série avec un résistor sur un générateur de tension E, il se charge progressivement : la tension uC tend vers E.",
               "La rapidité de la charge est caractérisée par la constante de temps τ = RC."],
     "enonce": ["q = C uC ; i = dq/dt = C duC/dt.",
                "Charge : RC duC/dt + uC = E, solution uC = E(1 − e^(−t/τ)).",
                "Décharge : uC = E e^(−t/τ).",
                "À t = τ : uC = 0,63 E (charge) ; on considère la charge terminée après 5τ.",
                "Énergie stockée : W = ½ C uC²."],
     "exemples": [("Constante de temps", ["R = 1 kΩ et C = 10 µF : τ = 1 000 × 10 × 10⁻⁶ = 10⁻² s = 10 ms."])],
     "exo": {"context": "Un condensateur C = 10 µF se charge à travers R = 1 kΩ sous E = 6 V.",
             "steps": [
               ("Calcule τ.", ["10 ms", "1 ms", "10 s", "100 ms"], 0, "τ = RC = 10³ × 10⁻⁵ = 10⁻² s.", 1),
               ("Valeur de uC à t = τ :", ["≈ 3,8 V", "6 V", "3 V", "0 V"], 0, "uC = 6(1 − e⁻¹) ≈ 6 × 0,63 ≈ 3,8 V.", 1),
               ("Au bout de combien de temps la charge est-elle pratiquement terminée ?", ["50 ms", "10 ms", "5 ms", "1 s"], 0, "5τ = 50 ms.", 1),
               ("Énergie stockée en fin de charge :", ["1,8 × 10⁻⁴ J", "3 × 10⁻⁵ J", "180 J", "3,6 × 10⁻⁴ J"], 0, "W = ½ × 10⁻⁵ × 6² = 1,8 × 10⁻⁴ J.", 1)]}},
    {"id": "tle-acidebase", "title": "Acides, bases et pH", "svg": None,
     "cours": ["Un acide (au sens de Brönsted) cède un proton H⁺, une base en capte un. Un couple acide/base s'écrit AH/A⁻.",
               "Un acide fort réagit totalement avec l'eau ; un acide faible, partiellement. On le caractérise par son pKa."],
     "enonce": ["pH = −log[H₃O⁺] et [H₃O⁺] = 10^(−pH). Dans l'eau à 25 °C : [H₃O⁺][OH⁻] = 10⁻¹⁴.",
                "Acide fort de concentration C : pH = −log C. Base forte : pH = 14 + log C.",
                "Acide faible : pH = pKa + log([A⁻]/[AH]). À la demi-équivalence, pH = pKa.",
                "Dosage : à l'équivalence, Cₐ Vₐ = C_b V_b."],
     "exemples": [("Acide chlorhydrique", ["C = 10⁻² mol/L : pH = 2."])],
     "exo": {"context": "On dose Vₐ = 20 mL d'une solution d'acide éthanoïque (pKa = 4,8) par de la soude C_b = 0,1 mol/L. L'équivalence est obtenue pour V_bE = 10 mL.",
             "steps": [
               ("Calcule la concentration de l'acide.", ["0,05 mol/L", "0,1 mol/L", "0,2 mol/L", "0,5 mol/L"], 0, "Cₐ = C_b V_bE / Vₐ = 0,1 × 10 / 20 = 0,05 mol/L.", 1),
               ("Quel est le pH à la demi-équivalence (V_b = 5 mL) ?", ["4,8", "7", "2,4", "9,6"], 0, "À la demi-équivalence, [A⁻] = [AH], donc pH = pKa.", 1),
               ("À l'équivalence, le pH est :", ["supérieur à 7", "égal à 7", "inférieur à 7", "égal à 4,8"], 0, "On obtient une solution d'ions éthanoate, une base faible.", 1),
               ("Un pH de 3 correspond à [H₃O⁺] =", ["10⁻³ mol/L", "3 mol/L", "10³ mol/L", "10⁻¹¹ mol/L"], 0, "[H₃O⁺] = 10^(−pH).", 1)]}},
  ],

  # ---------------------------------------------------------------- Terminale S : SVT
  "tle-svt": [
    {"id": "tle-nerveux", "title": "Le message nerveux", "svg": SVG_NEURONE,
     "cours": ["Au repos, la membrane d'un neurone est polarisée : l'intérieur est négatif (potentiel de repos ≈ −70 mV), grâce à la pompe Na⁺/K⁺ et à la perméabilité au K⁺.",
               "Une stimulation efficace déclenche un potentiel d'action (PA) : une inversion brève de polarité qui se propage le long de l'axone."],
     "enonce": ["Phases du PA : dépolarisation (entrée de Na⁺), repolarisation (sortie de K⁺), hyperpolarisation, retour au repos.",
                "Fibre isolée : loi du tout ou rien. Le message est codé en fréquence de PA.",
                "Nerf (ensemble de fibres) : réponse graduée, par recrutement des fibres.",
                "Synapse chimique : le PA provoque la libération d'un neurotransmetteur (ex. acétylcholine) qui se fixe sur des récepteurs de la cellule post-synaptique. Message électrique → chimique → électrique."],
     "exemples": [("Intensité de stimulation", ["Sur une fibre, une stimulation plus forte que le seuil ne donne pas un PA plus grand, mais des PA plus fréquents."])],
     "exo": {"context": "On enregistre l'activité d'une fibre nerveuse isolée soumise à des stimulations d'intensité croissante.",
             "steps": [
               ("En dessous du seuil, on observe :", ["Aucun potentiel d'action", "Un petit potentiel d'action", "Un PA géant", "Une inversion durable"], 0, "Loi du tout ou rien : sous le seuil, pas de PA.", 1),
               ("Au-delà du seuil, si l'intensité augmente, l'amplitude du PA :", ["reste la même", "augmente", "diminue", "s'annule"], 0, "Sur une fibre, l'amplitude est constante.", 1),
               ("La phase de dépolarisation est due à :", ["l'entrée d'ions Na⁺", "la sortie d'ions K⁺", "l'entrée d'ions Cl⁻", "la pompe Na⁺/K⁺"], 0, "Les canaux Na⁺ s'ouvrent : l'intérieur devient positif.", 1),
               ("Au niveau d'une synapse neuromusculaire, le message est transmis par :", ["l'acétylcholine", "l'insuline", "l'ADN", "le glucose"], 0, "L'acétylcholine est le neurotransmetteur de la plaque motrice.", 1)]}},
    {"id": "tle-glycemie", "title": "La régulation de la glycémie", "svg": None,
     "cours": ["La glycémie (taux de glucose dans le sang) reste proche de 1 g/L. Elle est régulée par le pancréas, qui agit comme capteur et comme centre de commande.",
               "Les îlots de Langerhans contiennent deux types de cellules qui sécrètent deux hormones aux effets opposés."],
     "enonce": ["Cellules β : insuline, hormone hypoglycémiante. Elle favorise l'entrée du glucose dans les cellules et son stockage sous forme de glycogène (foie, muscles).",
                "Cellules α : glucagon, hormone hyperglycémiante. Il provoque la glycogénolyse dans le foie (libération de glucose).",
                "Diabète de type 1 : destruction des cellules β, plus d'insuline (traitement par injections). Type 2 : les cellules répondent mal à l'insuline."],
     "exemples": [("Après un repas", ["La glycémie monte à 1,4 g/L → sécrétion d'insuline → stockage du glucose → retour vers 1 g/L."])],
     "exo": {"context": "On mesure la glycémie d'une personne pendant un jeûne puis après un repas riche en riz.",
             "steps": [
               ("Valeur normale de la glycémie à jeun :", ["≈ 1 g/L", "≈ 10 g/L", "≈ 0,1 g/L", "≈ 5 g/L"], 0, "Elle oscille autour de 0,8 à 1,1 g/L.", 1),
               ("Après le repas, quelle hormone est sécrétée ?", ["L'insuline", "Le glucagon", "L'adrénaline", "La testostérone"], 0, "La glycémie monte : il faut une hormone hypoglycémiante.", 1),
               ("Quelles cellules la produisent ?", ["Les cellules β des îlots de Langerhans", "Les cellules α", "Les hépatocytes", "Les globules rouges"], 0, "Insuline = cellules β.", 1),
               ("Pendant le jeûne, le glucagon agit surtout sur :", ["le foie", "le cerveau", "les os", "la peau"], 0, "Il fait libérer le glucose stocké sous forme de glycogène hépatique.", 1)]}},
    {"id": "tle-immuno", "title": "L'immunologie", "svg": None,
     "cours": ["Le système immunitaire distingue le soi du non-soi grâce aux marqueurs du CMH. Après une réaction innée (inflammation, phagocytose), une réponse adaptative spécifique se met en place.",
               "Les lymphocytes T4 (auxiliaires) jouent un rôle central : ils activent les lymphocytes B et T8 grâce à l'interleukine 2."],
     "enonce": ["Réponse à médiation humorale : LB → plasmocytes → anticorps. Les anticorps neutralisent l'antigène (complexe immun), éliminé par phagocytose.",
                "Réponse à médiation cellulaire : LT8 → lymphocytes T cytotoxiques qui détruisent les cellules infectées (perforine).",
                "Mémoire immunitaire : une seconde rencontre donne une réponse plus rapide et plus forte (base de la vaccination).",
                "Le VIH détruit les LT4 : les deux réponses s'effondrent (sida, maladies opportunistes)."],
     "exemples": [("Rôle des LT4", ["Chez un malade du sida, le taux de LT4 chute sous 200/mm³ : des infections bénignes deviennent graves."])],
     "exo": {"context": "Des souris sont privées de thymus à la naissance (pas de lymphocytes T matures). On leur injecte un antigène.",
             "steps": [
               ("Quelles cellules produisent les anticorps ?", ["Les plasmocytes", "Les LT8", "Les macrophages", "Les globules rouges"], 0, "Les LB activés se différencient en plasmocytes sécréteurs.", 1),
               ("Chez ces souris, la production d'anticorps est très faible car :", ["les LT4 ne peuvent plus activer les LB", "il n'y a plus de macrophages", "les anticorps sont détruits", "l'antigène est absent"], 0, "Les LB ont besoin de l'aide des LT4 (interleukines).", 1),
               ("Les cellules infectées par un virus sont détruites par :", ["les lymphocytes T cytotoxiques", "les anticorps seuls", "les plaquettes", "l'insuline"], 0, "C'est la réponse à médiation cellulaire.", 1),
               ("Pourquoi une seconde injection donne-t-elle une réponse plus rapide ?", ["Grâce aux cellules mémoire", "Parce que l'antigène est plus faible", "Grâce au glucagon", "Par hasard"], 0, "Les lymphocytes mémoire reconnaissent vite l'antigène.", 1)]}},
    {"id": "tle-genetique", "title": "Génétique : le monohybridisme", "svg": None,
     "cours": ["Un caractère est gouverné par un gène qui peut avoir plusieurs allèles. Un individu possède deux allèles par gène (un de chaque parent).",
               "Un allèle dominant s'exprime dès qu'il est présent ; un allèle récessif ne s'exprime qu'à l'état homozygote."],
     "enonce": ["Première loi de Mendel : le croisement de deux lignées pures donne une F1 homogène.",
                "F1 × F1 avec dominance complète : 3/4 phénotype dominant, 1/4 récessif. Codominance : 1/4, 1/2, 1/4.",
                "Test-cross (croisement avec un homozygote récessif) : 1/2 – 1/2 si l'individu testé est hétérozygote ; 100 % dominant s'il est homozygote.",
                "On écrit toujours génotypes, gamètes et échiquier de croisement."],
     "exemples": [("Pois lisses et ridés", ["Lisse (L) dominant sur ridé (r). LL × rr → F1 : 100 % Lr, lisses.", "F1 × F1 → 1 LL, 2 Lr, 1 rr : 3/4 lisses, 1/4 ridés."])],
     "exo": {"context": "Chez le mil, la couleur des grains est gouvernée par un gène : allèle R (rouge) dominant, allèle b (blanc) récessif. On croise une lignée pure rouge avec une lignée pure blanche.",
             "steps": [
               ("Génotype de la F1 :", ["R//b", "R//R", "b//b", "R//b et b//b"], 0, "Chaque parent pur donne un seul type de gamète : R et b.", 1),
               ("Phénotype de la F1 :", ["100 % rouge", "100 % blanc", "50 % rouge, 50 % blanc", "rose"], 0, "R est dominant.", 1),
               ("F1 × F1 donne en F2 :", ["3/4 rouges, 1/4 blancs", "1/2 – 1/2", "100 % rouges", "1/4 rouges, 3/4 blancs"], 0, "Échiquier : RR, Rb, Rb, bb.", 1),
               ("Un test-cross d'un rouge donne 50 % rouges et 50 % blancs. Ce rouge est :", ["hétérozygote R//b", "homozygote R//R", "homozygote b//b", "impossible à dire"], 0, "Il a produit deux types de gamètes en proportions égales.", 1)]}},
  ],

  # ---------------------------------------------------------------- Terminale : philosophie
  "tle-philo": [
    {"id": "tle-dissertation", "title": "La méthode de la dissertation", "svg": None, "programme": "La méthode philosophique et les grands auteurs",
     "cours": ["La dissertation philosophique répond à une question par une réflexion argumentée et progressive. Ce n'est pas une récitation de cours.",
               "Le travail préparatoire (analyse des termes, problématique, plan) compte autant que la rédaction."],
     "enonce": ["Introduction : amorce, énoncé du sujet, problématique (le paradoxe ou la tension du sujet), annonce du plan.",
                "Développement en deux ou trois parties : thèse, antithèse (limites), dépassement. Chaque partie : idée, argument, exemple, référence à un auteur.",
                "Conclusion : réponse claire à la question, sans idée nouvelle, avec éventuellement une ouverture.",
                "Toujours définir les mots clés et justifier chaque passage d'une partie à l'autre (transitions)."],
     "exemples": [("Sujet : « Peut-on être libre sans les autres ? »", ["Problématique : la liberté semble exiger l'indépendance, mais l'homme ne devient-il pas libre que par la société et ses lois ?",
                    "I. La liberté comme indépendance à l'égard d'autrui. II. Les autres comme condition de la liberté (Rousseau : l'obéissance à la loi qu'on s'est prescrite est liberté)."])],
     "exo": {"context": "Sujet : « Le travail est-il une contrainte ? »",
             "steps": [
               ("Quelle est la première étape ?", ["Analyser et définir les termes du sujet", "Rédiger la conclusion", "Choisir des citations", "Écrire la deuxième partie"], 0, "On commence par comprendre ce que le sujet demande.", 1),
               ("Laquelle est une problématique ?", ["Le travail nous soumet-il à la nécessité ou est-il le moyen par lequel l'homme se libère ?", "Le travail existe depuis longtemps.", "Je pense que le travail est bien.", "Marx est un philosophe."], 0, "Une problématique met en tension deux réponses possibles.", 1),
               ("Quel auteur voit dans le travail un moyen pour l'homme de se réaliser en transformant la nature ?", ["Hegel (et Marx)", "Épicure", "Descartes", "Platon"], 0, "Chez Hegel, l'esclave se libère par le travail ; Marx en fait l'essence de l'homme, tout en dénonçant le travail aliéné.", 1),
               ("Que ne doit pas contenir la conclusion ?", ["Un nouvel argument", "Une réponse à la question", "Un bilan", "Une ouverture"], 0, "La conclusion fait le bilan, elle n'apporte pas d'argument nouveau.", 1)]}},
    {"id": "tle-conscience", "title": "La conscience et l'inconscient", "svg": None,
     "cours": ["La conscience est la connaissance qu'un sujet a de lui-même et du monde. Elle fonde la responsabilité morale.",
               "La découverte de l'inconscient par Freud remet en question l'idée que l'homme est transparent à lui-même."],
     "enonce": ["Descartes : « Je pense, donc je suis » (cogito). La conscience est la première certitude.",
                "Freud : « Le moi n'est pas maître dans sa propre maison. » Le psychisme comprend le ça, le moi et le surmoi ; les désirs refoulés se manifestent dans les rêves, les lapsus, les actes manqués.",
                "Sartre refuse l'inconscient comme excuse : il parle de mauvaise foi.",
                "Bergson : « Conscience signifie d'abord mémoire. »"],
     "exemples": [("Utiliser une référence", ["Pour montrer les limites de la conscience, on cite Freud et l'exemple du lapsus, puis on discute avec Sartre : l'homme reste responsable."])],
     "exo": {"context": "Associe chaque idée à son auteur ou à la bonne notion.",
             "steps": [
               ("« Je pense, donc je suis » :", ["Descartes", "Freud", "Sartre", "Marx"], 0, "C'est le cogito du Discours de la méthode.", 1),
               ("« Le moi n'est pas maître dans sa propre maison » :", ["Freud", "Descartes", "Kant", "Rousseau"], 0, "Freud décrit la troisième blessure narcissique de l'humanité.", 1),
               ("Le lapsus est, selon Freud :", ["une manifestation de l'inconscient", "une simple erreur sans sens", "une preuve de la liberté", "une maladie"], 0, "Il révèle un désir refoulé.", 1),
               ("Sartre appelle « mauvaise foi » :", ["le fait de se mentir pour fuir sa liberté", "le fait de ne pas croire en Dieu", "un rêve", "l'inconscient"], 0, "L'homme se cache derrière des excuses pour ne pas assumer ses choix.", 1)]}},
    {"id": "tle-liberte", "title": "La liberté", "svg": None, "programme": "La morale et la liberté",
     "cours": ["Être libre, c'est d'abord pouvoir faire ce que l'on veut. Mais les philosophes distinguent la liberté d'agir, le libre arbitre (pouvoir choisir) et l'autonomie (se donner sa propre loi).",
               "La question est de savoir si nos choix sont vraiment libres ou déterminés par des causes que nous ignorons."],
     "enonce": ["Spinoza : les hommes se croient libres parce qu'ils sont conscients de leurs désirs mais ignorent les causes qui les déterminent.",
                "Sartre : « L'homme est condamné à être libre » ; « l'existence précède l'essence ».",
                "Rousseau : « L'obéissance à la loi qu'on s'est prescrite est liberté. »",
                "Kant : l'autonomie de la volonté, qui agit par devoir selon la loi morale."],
     "exemples": [("Liberté et loi", ["La loi ne s'oppose pas toujours à la liberté : sans lois, le plus fort domine (Rousseau, Montesquieu)."])],
     "exo": {"context": "Associe chaque thèse sur la liberté à son auteur.",
             "steps": [
               ("« L'homme est condamné à être libre » :", ["Sartre", "Spinoza", "Platon", "Freud"], 0, "Pour Sartre, on ne peut pas ne pas choisir.", 1),
               ("La liberté serait une illusion due à l'ignorance des causes :", ["Spinoza", "Sartre", "Descartes", "Kant"], 0, "Exemple de la pierre qui se croirait libre de tomber.", 1),
               ("« L'obéissance à la loi qu'on s'est prescrite est liberté » :", ["Rousseau", "Hobbes", "Nietzsche", "Épicure"], 0, "Du Contrat social.", 1),
               ("Agir de façon autonome, selon Kant, c'est :", ["obéir à la loi morale que la raison se donne", "faire tout ce qu'on désire", "obéir à ses passions", "suivre la mode"], 0, "L'autonomie s'oppose à l'hétéronomie (obéir à ses penchants ou à une autorité extérieure).", 1)]}},
  ],

  # ---------------------------------------------------------------- 1ère S : mathématiques
  "1ere-maths": [
    {"id": "1ere-second-degre", "title": "Le second degré", "svg": None,
     "cours": ["Un trinôme du second degré s'écrit f(x) = ax² + bx + c avec a ≠ 0. Sa courbe est une parabole, tournée vers le haut si a > 0.",
               "Le discriminant Δ permet de trouver les racines, de factoriser et d'étudier le signe."],
     "enonce": ["Δ = b² − 4ac.",
                "Δ > 0 : deux racines x₁,₂ = (−b ± √Δ) / (2a) et f(x) = a(x − x₁)(x − x₂).",
                "Δ = 0 : une racine double x₀ = −b/(2a). Δ < 0 : pas de racine réelle.",
                "Signe : f(x) est du signe de a à l'extérieur des racines, du signe contraire entre les racines.",
                "Somme et produit des racines : S = −b/a, P = c/a."],
     "exemples": [("x² − 5x + 6", ["Δ = 25 − 24 = 1 ; racines (5 ± 1)/2 : 2 et 3.", "x² − 5x + 6 = (x − 2)(x − 3), négatif entre 2 et 3."])],
     "exo": {"context": "Soit f(x) = 2x² − 3x − 2.",
             "steps": [
               ("Calcule Δ.", ["25", "−7", "9", "17"], 0, "Δ = 9 − 4 × 2 × (−2) = 9 + 16 = 25.", 1),
               ("Les racines sont :", ["2 et −1/2", "−2 et 1/2", "3 et −2", "1 et 2"], 0, "x = (3 ± 5)/4, soit 2 et −1/2.", 1),
               ("Forme factorisée :", ["2(x − 2)(x + 1/2)", "(x − 2)(x + 1/2)", "2(x + 2)(x − 1/2)", "(2x − 2)(x + 1)"], 0, "f(x) = a(x − x₁)(x − x₂) avec a = 2.", 1),
               ("Ensemble des solutions de f(x) < 0 :", ["]−1/2 ; 2[", "]−∞ ; −1/2[ ∪ ]2 ; +∞[", "∅", "ℝ"], 0, "a > 0 : f est négative entre les racines.", 1)]}},
  ],
}
