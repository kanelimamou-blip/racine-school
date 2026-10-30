# Physique-chimie de Terminale S : les 23 chapitres du programme officiel (15 de physique, 8 de chimie).
# Même format que syntheses.py, avec plusieurs exercices corrigés par chapitre (clé "exemples").

def K(t, p, cles, methodes, pieges, exemples, exam):
    return {"t": t, "p": p, "cles": cles, "methodes": methodes, "pieges": pieges, "exemples": exemples, "exam": exam}

_TCI = ("Appliquer le théorème du centre d'inertie (TCI)", [
  "Préciser le système étudié et le référentiel (terrestre ou géocentrique, supposé galiléen).",
  "Faire le bilan des forces extérieures et les représenter sur un schéma.",
  "Écrire ΣF⃗ext = m a⃗G.",
  "Projeter sur des axes bien choisis (axe du mouvement et axe perpendiculaire).",
  "En déduire l'accélération, puis les équations horaires par intégrations successives.",
])

TLE_PC = [
  K("P1. Cinématique du point", 0, [
    "Référentiel : solide de référence muni d'un repère d'espace et d'une horloge. Le mouvement est relatif au référentiel.",
    "Vecteur position OM⃗ = x i⃗ + y j⃗ + z k⃗ ; vecteur vitesse v⃗ = dOM⃗/dt ; vecteur accélération a⃗ = dv⃗/dt.",
    "Mouvement rectiligne uniforme : a = 0, x = v t + x₀.",
    "Mouvement rectiligne uniformément varié : a constante ; v = a t + v₀ ; x = ½ a t² + v₀ t + x₀ ; v² − v₀² = 2a(x − x₀).",
    "Mouvement accéléré si a⃗ · v⃗ > 0 ; retardé (décéléré) si a⃗ · v⃗ < 0.",
    "Base de Frenet (mouvement curviligne) : a⃗ = (dv/dt) τ⃗ + (v²/ρ) n⃗ ; aₜ = dv/dt, aₙ = v²/ρ.",
    "Mouvement circulaire uniforme : v = R ω constante, a = v²/R = R ω², centripète ; T = 2π/ω ; f = 1/T.",
    "Mouvement rectiligne sinusoïdal : x = Xm cos(ωt + φ) ; a = −ω² x.",
  ], [
    ("Exploiter un enregistrement de positions (intervalle τ)", [
      "Vitesse instantanée au point Mᵢ : vᵢ = Mᵢ₋₁Mᵢ₊₁ / (2τ).",
      "Accélération en Mᵢ : aᵢ = (vᵢ₊₁ − vᵢ₋₁) / (2τ).",
      "Tracer v = f(t) : une droite indique un mouvement uniformément varié, sa pente est a.",
    ]),
    ("Trouver la date et le lieu d'une rencontre entre deux mobiles", [
      "Écrire les deux équations horaires dans le même repère et avec la même origine des dates.",
      "Résoudre x₁(t) = x₂(t) pour trouver t, puis calculer x.",
    ]),
  ], [
    "Oublier de convertir les km/h en m/s (diviser par 3,6).",
    "Utiliser v² − v₀² = 2a(x − x₀) pour un mouvement qui n'est pas uniformément varié.",
  ], [
    ("Une voiture roulant à 72 km/h freine avec une décélération constante de 5 m/s². Distance de freinage ?", [
      "v₀ = 72 / 3,6 = 20 m/s ; v = 0 ; a = −5 m/s².",
      "v² − v₀² = 2a d donne 0 − 400 = −10 d.",
      "d = 40 m. Durée : t = (0 − 20)/(−5) = 4 s.",
    ]),
    ("Un mobile A part de O à t = 0 avec a = 2 m/s² sans vitesse initiale. Un mobile B passe en O à t = 0 à vitesse constante 10 m/s. Quand A rattrape-t-il B ?", [
      "xA = t² et xB = 10 t.",
      "t² = 10 t donne t = 0 ou t = 10 s.",
      "Rencontre à t = 10 s, à x = 100 m.",
    ]),
  ], "Base de tous les exercices de mécanique : équations horaires, trajectoire, nature du mouvement."),

  K("P2. Bases de la dynamique et énergie", 1, [
    "Centre d'inertie G : point dont le mouvement est le plus simple ; vecteur quantité de mouvement p⃗ = m v⃗.",
    "1re loi de Newton (principe d'inertie) : si ΣF⃗ext = 0⃗, G est au repos ou en mouvement rectiligne uniforme (référentiel galiléen).",
    "2e loi (TCI) : ΣF⃗ext = m a⃗G = dp⃗/dt.",
    "3e loi (actions réciproques) : F⃗A/B = −F⃗B/A.",
    "Théorème de l'accélération angulaire (solide en rotation) : ΣM = J θ̈.",
    "Théorème de l'énergie cinétique : ΔEc = ΣW(F⃗ext) ; Ec = ½ m v² (translation), ½ J ω² (rotation).",
    "Travail du poids : W = m g (zA − zB) ; énergie potentielle de pesanteur Ep = m g z ; élastique Ep = ½ k x².",
    "Em = Ec + Ep conservée sans frottements ; avec frottements ΔEm = W(frottements) < 0.",
  ], [_TCI, ("Choisir entre TCI et théorème de l'énergie cinétique", [
    "Pour une vitesse entre deux positions : théorème de l'énergie cinétique (plus rapide).",
    "Pour une accélération, une force inconnue ou des équations horaires : TCI.",
  ])], [
    "Oublier la réaction du support ou la tension d'un fil dans le bilan des forces.",
    "Compter le travail de la réaction normale (il est nul quand il n'y a pas de frottement).",
  ], [
    ("Un solide de 2 kg est tiré sur un plan horizontal par une force de 10 N ; frottements 4 N. Accélération ?", [
      "TCI projeté sur l'axe du mouvement : F − f = m a.",
      "a = (10 − 4) / 2 = 3 m/s².",
    ]),
    ("Une bille de 50 g est lâchée sans vitesse sur une piste lisse, 1,8 m au-dessus du point le plus bas. Vitesse en bas ? (g = 10 m/s²)", [
      "Théorème de l'énergie cinétique : ½ m v² − 0 = m g h (la réaction ne travaille pas).",
      "v = √(2 × 10 × 1,8) = √36 = 6 m/s.",
    ]),
    ("Un ascenseur de 500 kg monte avec une accélération de 1 m/s². Tension du câble ?", [
      "TCI sur l'axe vertical ascendant : T − m g = m a.",
      "T = m (g + a) = 500 × 11 = 5 500 N.",
    ]),
  ], "Le TCI correctement rédigé rapporte des points dans chaque exercice de mécanique."),

  K("P3. Mouvements dans les champs de pesanteur et électrique uniformes", 2, [
    "Champ de pesanteur uniforme : a⃗ = g⃗ (frottements négligés). Plan incliné d'angle α sans frottement : a = g sin α.",
    "Projectile lancé de O avec v⃗₀ faisant l'angle α avec l'horizontale : x = v₀ cos α · t ; z = −½ g t² + v₀ sin α · t.",
    "Trajectoire parabolique : z = −g x² / (2 v₀² cos² α) + x tan α.",
    "Flèche (hauteur maximale) : H = v₀² sin² α / (2g), atteinte quand vz = 0. Portée : P = v₀² sin 2α / g, maximale pour α = 45°.",
    "Champ électrique uniforme entre deux plaques : E = U/d, dirigé vers la plaque négative ; force F⃗ = q E⃗.",
    "Accélération entre plaques (théorème de l'énergie cinétique) : ½ m v² − ½ m v₀² = |q| U.",
    "Déviation : particule entrant à v₀ perpendiculairement à E⃗ : y = (q E / (2 m v₀²)) x² ; à la sortie (x = ℓ), tan α = q E ℓ / (m v₀²).",
    "Déflexion sur un écran à la distance L du centre des plaques : Y = L tan α (le faisceau semble venir du milieu des plaques).",
  ], [_TCI, ("Trouver une condition de passage (le projectile franchit-il un obstacle ?)", [
    "Remplacer x par l'abscisse de l'obstacle dans l'équation de la trajectoire.",
    "Comparer l'altitude obtenue à la hauteur de l'obstacle.",
  ])], [
    "Mettre le poids en compte pour un électron dans un champ électrique (il est négligeable).",
    "Se tromper de signe de la charge : un électron est dévié vers la plaque positive.",
  ], [
    ("Un ballon est frappé à v₀ = 20 m/s sous α = 30°. Flèche et portée ? (g = 10 m/s²)", [
      "H = v₀² sin² α / (2g) = 400 × 0,25 / 20 = 5 m.",
      "P = v₀² sin 2α / g = 400 × sin 60° / 10 ≈ 34,6 m.",
    ]),
    ("Des électrons (m = 9,1 × 10⁻³¹ kg) sont accélérés sous U = 1 000 V depuis le repos. Vitesse acquise ?", [
      "½ m v² = e U.",
      "v = √(2 × 1,6 × 10⁻¹⁹ × 1 000 / 9,1 × 10⁻³¹) ≈ 1,9 × 10⁷ m/s.",
    ]),
    ("Un solide glisse sans frottement sur un plan incliné de 20°, départ arrêté. Vitesse après 2 m ?", [
      "a = g sin 20° ≈ 3,42 m/s².",
      "v² = 2 a d = 13,7, donc v ≈ 3,7 m/s.",
    ]),
  ], "Exercice de 5 points très fréquent : projectile (sport) ou particule déviée entre deux plaques, avec équation de la trajectoire."),

  K("P4. Gravitation universelle et satellites", 3, [
    "Loi de gravitation : F = G mA mB / d², G = 6,67 × 10⁻¹¹ N·m²·kg⁻².",
    "Champ de gravitation terrestre : 𝒢 = G M / r² ; à l'altitude h : g = g₀ R² / (R + h)².",
    "Satellite en orbite circulaire de rayon r = R + h (référentiel géocentrique) : mouvement circulaire uniforme.",
    "Vitesse : v = √(G M / r) = R √(g₀ / r), indépendante de la masse du satellite.",
    "Période : T = 2π r / v = 2π √(r³ / (G M)).",
    "3e loi de Kepler : T² / r³ = 4π² / (G M), constante pour tous les satellites d'un même astre.",
    "Géostationnaire : orbite équatoriale, même sens que la Terre, T = 86 164 s (jour sidéral), h ≈ 36 000 km.",
    "Énergie potentielle de gravitation (référence à l'infini) : Ep = −G M m / r. Vitesse de libération : v = √(2 G M / R) ≈ 11,2 km/s pour la Terre.",
  ], [("Démontrer que le mouvement d'un satellite est uniforme", [
    "La seule force est l'attraction terrestre, dirigée vers le centre de la Terre (centripète).",
    "Dans la base de Frenet, la composante tangentielle de a⃗ est nulle : dv/dt = 0, donc v est constante.",
    "Sur la normale : G M m / r² = m v² / r, d'où v.",
  ])], [
    "Prendre h au lieu de R + h comme rayon de l'orbite.",
    "Utiliser 24 h au lieu du jour sidéral (86 164 s) si l'énoncé le précise.",
  ], [
    ("Altitude d'un satellite géostationnaire ? (g₀ = 9,8 m/s², R = 6 400 km, T = 86 164 s)", [
      "T² = 4π² r³ / (g₀ R²), donc r³ = g₀ R² T² / (4π²).",
      "r³ ≈ 9,8 × (6,4 × 10⁶)² × (86 164)² / 39,5 ≈ 7,5 × 10²² m³, r ≈ 4,22 × 10⁷ m.",
      "h = r − R ≈ 35 800 km.",
    ]),
    ("Un satellite tourne à h = 600 km. Calculer sa vitesse et sa période.", [
      "r = 7,0 × 10⁶ m ; v = R √(g₀ / r) = 6,4 × 10⁶ × √(9,8 / 7,0 × 10⁶) ≈ 7,57 × 10³ m/s.",
      "T = 2π r / v ≈ 5 810 s, soit environ 1 h 37 min.",
    ]),
  ], "Exercice classique : établir v et T, vérifier Kepler, calculer l'altitude géostationnaire, comparer des satellites."),

  K("P5. Particule chargée dans un champ magnétique", 4, [
    "Force de Lorentz : F⃗ = q v⃗ ∧ B⃗ ; valeur F = |q| v B sin α ; perpendiculaire à v⃗ et à B⃗ (règle des trois doigts de la main droite).",
    "La force de Lorentz ne travaille pas : la vitesse garde la même valeur (mouvement uniforme).",
    "Si v⃗₀ ⟂ B⃗ : mouvement circulaire uniforme dans le plan perpendiculaire à B⃗, de rayon R = m v / (|q| B).",
    "Période du mouvement : T = 2π m / (|q| B), indépendante de la vitesse (principe du cyclotron).",
    "Spectrographe de masse : des ions de même charge, accélérés sous la même tension, ont des rayons R = (1/B) √(2 m U / |q|) : on sépare les isotopes.",
    "Filtre de vitesse (Wien) : champs E⃗ et B⃗ croisés ; les particules de vitesse v = E/B ne sont pas déviées.",
    "Déflexion magnétique dans un tube de télévision ou un oscilloscope.",
  ], [("Calculer le rapport des rayons de deux isotopes", [
    "Écrire R = (1/B) √(2 m U / q) pour chaque ion.",
    "R₁/R₂ = √(m₁/m₂) : le plus lourd décrit le plus grand cercle.",
  ])], [
    "Oublier le signe de q pour le sens de la déviation.",
    "Croire que la force magnétique accélère la particule (elle change seulement la direction).",
  ], [
    ("Un proton (m = 1,67 × 10⁻²⁷ kg) entre à 10⁶ m/s dans B = 0,1 T perpendiculaire. Rayon ?", [
      "R = m v / (e B) = 1,67 × 10⁻²⁷ × 10⁶ / (1,6 × 10⁻¹⁹ × 0,1).",
      "R ≈ 0,104 m.",
    ]),
    ("Ions ³⁹K⁺ et ⁴¹K⁺ accélérés sous la même tension. Rapport des rayons ?", [
      "R ∝ √m.",
      "R(41)/R(39) = √(41/39) ≈ 1,025.",
    ]),
  ], "Très fréquent : accélération puis déviation magnétique (spectrographe de masse, cyclotron)."),

  K("P6. Loi de Laplace", 5, [
    "Un conducteur rectiligne de longueur ℓ parcouru par un courant I dans un champ B⃗ subit la force de Laplace F⃗ = I ℓ⃗ ∧ B⃗.",
    "Valeur : F = I ℓ B sin α (α angle entre le conducteur et B⃗) ; point d'application au milieu de la partie dans le champ.",
    "Sens : règle des trois doigts de la main droite (pouce : I, index : B, majeur : F) ou bonhomme d'Ampère.",
    "Applications : rails de Laplace, roue de Barlow, moteur à courant continu, haut-parleur.",
    "Champ magnétique créé par un solénoïde long : B = µ₀ n I (n spires par mètre), µ₀ = 4π × 10⁻⁷ SI. Unité : tesla (T).",
    "Couple électromagnétique sur un cadre : M = N I S B sin θ.",
  ], [("Étudier l'équilibre d'une tige soumise à la force de Laplace", [
    "Faire le bilan : poids, force de Laplace, réactions ou tension.",
    "Écrire la condition d'équilibre (somme des forces, ou des moments si la tige pivote).",
    "En déduire I ou B.",
  ])], [
    "Oublier le sin α quand le conducteur n'est pas perpendiculaire à B⃗.",
    "Inverser le sens de la force en se trompant de main.",
  ], [
    ("Une tige de 10 cm parcourue par 5 A est placée perpendiculairement à B = 0,2 T. Force de Laplace ?", [
      "F = I ℓ B = 5 × 0,10 × 0,2 = 0,1 N.",
    ]),
    ("Solénoïde de 500 spires, longueur 25 cm, I = 2 A. Champ au centre ?", [
      "n = 500 / 0,25 = 2 000 spires/m.",
      "B = 4π × 10⁻⁷ × 2 000 × 2 ≈ 5,0 × 10⁻³ T.",
    ]),
  ], "Souvent la première partie d'un exercice sur l'induction (rails de Laplace)."),

  K("P7. Induction et auto-induction", 6, [
    "Flux magnétique à travers un circuit de N spires de surface S : Φ = N B S cos θ (weber, Wb).",
    "Loi de Faraday : toute variation de flux crée une force électromotrice induite e = −dΦ/dt.",
    "Loi de Lenz : le courant induit s'oppose, par ses effets, à la cause qui lui donne naissance.",
    "Tige glissant à vitesse v sur des rails dans B⃗ : e = B ℓ v ; courant induit i = e / R.",
    "Alternateur : bobine tournant à ω dans B⃗, e = N B S ω sin ωt (tension alternative).",
    "Auto-induction : une bobine d'inductance L crée un flux propre Φ = L i ; e = −L di/dt. Tension aux bornes : u = L di/dt + r i.",
    "Établissement du courant dans un dipôle RL (échelon E) : i = (E/R)(1 − e^(−t/τ)), τ = L/R ; rupture : i = I₀ e^(−t/τ).",
    "Énergie magnétique stockée : E = ½ L i². Inductance d'un solénoïde : L = µ₀ N² S / ℓ.",
  ], [("Déterminer le sens du courant induit", [
    "Le flux augmente-t-il ou diminue-t-il ?",
    "Le courant induit crée un champ qui s'oppose à cette variation (loi de Lenz).",
    "En déduire son sens avec la règle de la main droite.",
  ])], [
    "Oublier le signe moins de la loi de Faraday (il traduit la loi de Lenz).",
    "Confondre τ = L/R (RL) et τ = RC.",
  ], [
    ("Une tige de 20 cm glisse à 5 m/s sur des rails dans B = 0,5 T ; résistance du circuit 2 Ω. Courant induit ?", [
      "e = B ℓ v = 0,5 × 0,2 × 5 = 0,5 V.",
      "i = e / R = 0,25 A.",
    ]),
    ("Bobine L = 0,5 H, R totale = 100 Ω, E = 10 V. Constante de temps, courant final et énergie stockée ?", [
      "τ = L/R = 5 ms.",
      "I = E/R = 0,1 A.",
      "E = ½ L I² = 0,5 × 0,5 × 0,01 = 2,5 × 10⁻³ J.",
    ]),
  ], "Exercice classique en S1 : rails de Laplace et induction ; en S2, dipôle RL avec équation différentielle."),

  K("P8. Dipôle RC", 7, [
    "Condensateur : q = C u ; i = dq/dt = C du/dt (convention récepteur). Capacité en farads (µF, nF).",
    "Condensateur plan : C = ε₀ εᵣ S / e.",
    "Charge sous tension E : RC du/dt + u = E ; u(t) = E (1 − e^(−t/τ)), τ = RC.",
    "Décharge : RC du/dt + u = 0 ; u(t) = U₀ e^(−t/τ) ; i(t) = −(U₀/R) e^(−t/τ).",
    "À t = τ : 63 % de la charge ; à t = 5τ : condensateur chargé à plus de 99 %.",
    "La tension aux bornes d'un condensateur ne subit pas de discontinuité ; l'intensité peut en subir.",
    "Énergie stockée : E = ½ C u² = q²/(2C).",
    "Associations : parallèle C = C₁ + C₂ ; série 1/C = 1/C₁ + 1/C₂.",
  ], [("Établir l'équation différentielle de la charge", [
    "Loi d'additivité des tensions : E = uR + uC = R i + uC.",
    "Remplacer i par C duC/dt.",
    "Obtenir RC duC/dt + uC = E, puis vérifier la solution proposée.",
  ]), ("Déterminer τ graphiquement", [
    "Lire l'abscisse où u = 0,63 E (charge) ou 0,37 U₀ (décharge).",
    "Ou tracer la tangente à l'origine : elle coupe l'asymptote en t = τ.",
  ])], [
    "Oublier les puissances de 10 (µF = 10⁻⁶ F, kΩ = 10³ Ω).",
    "Écrire e^(t/τ) au lieu de e^(−t/τ).",
  ], [
    ("R = 10 kΩ, C = 100 µF, E = 6 V. τ, tension à t = 1 s et énergie finale ?", [
      "τ = RC = 1 s.",
      "u(1) = 6 (1 − e⁻¹) ≈ 3,8 V.",
      "E = ½ × 10⁻⁴ × 36 = 1,8 × 10⁻³ J.",
    ]),
    ("Un condensateur chargé sous 12 V se décharge dans R = 1 kΩ ; u = 4,4 V à t = 10 ms. Capacité ?", [
      "4,4 / 12 ≈ 0,37 = e⁻¹, donc t = τ = 10 ms.",
      "C = τ / R = 10⁻² / 10³ = 10 µF.",
    ]),
  ], "Exercice d'électricité fréquent : équation différentielle, solution, τ, énergie."),

  K("P9. Oscillations électriques libres", 8, [
    "Circuit LC : condensateur chargé relié à une bobine idéale. Équation : d²q/dt² + q/(LC) = 0.",
    "Solution : q(t) = Qm cos(ω₀ t + φ), ω₀ = 1/√(LC), T₀ = 2π √(LC) (formule de Thomson).",
    "Intensité : i = dq/dt = −Qm ω₀ sin(ω₀ t + φ) ; Im = Qm ω₀.",
    "Énergie totale : E = q²/(2C) + ½ L i² = Qm²/(2C) = ½ L Im², constante : échange entre énergie électrique et magnétique.",
    "Ces énergies oscillent à la période T₀/2.",
    "Circuit RLC libre : la résistance dissipe l'énergie par effet Joule ; régime pseudo-périodique (pseudo-période ≈ T₀) ou apériodique si R est grande.",
    "Entretien des oscillations : un dispositif (générateur à résistance négative) compense les pertes.",
  ], [("Établir l'équation différentielle", [
    "uC + uL = 0 avec uC = q/C et uL = L di/dt = L d²q/dt².",
    "Diviser par L : q̈ + q/(LC) = 0.",
  ])], [
    "Confondre période des oscillations (T₀) et période des énergies (T₀/2).",
    "Oublier que la charge initiale fixe Qm et φ.",
  ], [
    ("L = 0,1 H, C = 10 µF. Période propre ?", [
      "T₀ = 2π √(0,1 × 10⁻⁵) = 2π × 10⁻³ ≈ 6,28 ms.",
    ]),
    ("Le condensateur (C = 2 µF) est chargé sous 10 V puis relié à L = 0,2 H. Intensité maximale ?", [
      "Énergie initiale : ½ C U² = 10⁻⁴ J.",
      "½ L Im² = 10⁻⁴, donc Im = √(10⁻³) ≈ 0,032 A.",
    ]),
  ], "Exercice lié au chapitre des équations différentielles en maths ; énergies et formule de Thomson."),

  K("P10. Oscillations électriques forcées (RLC)", 9, [
    "Un générateur impose u = Um cos ωt à un circuit RLC série ; i = Im cos(ωt − φ) en régime permanent.",
    "Impédance : Z = Um/Im = √(R² + (Lω − 1/(Cω))²).",
    "Déphasage : tan φ = (Lω − 1/(Cω))/R ; cos φ = R/Z. Circuit inductif si φ > 0, capacitif si φ < 0.",
    "Construction de Fresnel : vecteurs tensions de R (en phase avec i), L (avance de π/2) et C (retard de π/2).",
    "Résonance d'intensité : ω = ω₀ = 1/√(LC), Z = R minimale, I maximale, u et i en phase.",
    "Bande passante à −3 dB : Δω = R/L ; facteur de qualité Q = L ω₀/R = ω₀/Δω. Surtension aux bornes de C à la résonance : UC = Q U.",
    "Valeurs efficaces : U = Um/√2. Puissance moyenne : P = U I cos φ = R I² (cos φ : facteur de puissance).",
  ], [("Résoudre un exercice de RLC", [
    "Calculer Lω et 1/(Cω).",
    "En déduire Z, puis I = U/Z et φ.",
    "Comparer ω à ω₀ pour savoir si le circuit est inductif ou capacitif.",
  ])], [
    "Mélanger valeurs efficaces et valeurs maximales.",
    "Oublier ω = 2π f.",
  ], [
    ("R = 100 Ω, L = 0,5 H, C = 10 µF, U = 10 V, f = 50 Hz. Z et I ?", [
      "ω = 314 rad/s ; Lω = 157 Ω ; 1/(Cω) = 318 Ω.",
      "Z = √(100² + (157 − 318)²) ≈ 190 Ω.",
      "I = 10/190 ≈ 0,053 A ; φ < 0 : circuit capacitif.",
    ]),
    ("Même circuit : fréquence de résonance et facteur de qualité ?", [
      "ω₀ = 1/√(0,5 × 10⁻⁵) ≈ 447 rad/s, f₀ ≈ 71 Hz.",
      "Q = L ω₀ / R ≈ 0,5 × 447 / 100 ≈ 2,2.",
    ]),
  ], "Classique en S1 et S2 : impédance, déphasage, résonance, bande passante, puissance."),

  K("P11. Oscillateurs mécaniques", 10, [
    "Pendule élastique horizontal : m ẍ + k x = 0 ; x = Xm cos(ω₀ t + φ), ω₀ = √(k/m), T₀ = 2π √(m/k).",
    "Pendule élastique vertical : même période ; la position d'équilibre est décalée de m g / k.",
    "Pendule simple (petites oscillations) : θ̈ + (g/ℓ) θ = 0 ; T₀ = 2π √(ℓ/g).",
    "Pendule pesant : T₀ = 2π √(J/(m g d)) ; pendule de torsion : T₀ = 2π √(J/C).",
    "Énergie mécanique du pendule élastique : Em = ½ m v² + ½ k x² = ½ k Xm².",
    "Amortissement : régimes pseudo-périodique, critique, apériodique.",
    "Oscillations forcées : résonance quand la fréquence de l'excitateur est proche de la fréquence propre (ponts, amortisseurs).",
  ], [("Trouver Xm et φ", [
    "x(0) = Xm cos φ et ẋ(0) = −Xm ω₀ sin φ.",
    "Résoudre ; vérifier le signe de sin φ.",
  ]), ("Établir l'équation par l'énergie", [
    "Écrire Em = ½ m ẋ² + ½ k x² = constante.",
    "Dériver : m ẋ ẍ + k x ẋ = 0, puis simplifier par ẋ.",
  ])], [
    "Écrire T₀ = 2π √(k/m).",
    "Utiliser les degrés dans la phase au lieu des radians.",
  ], [
    ("m = 200 g, k = 20 N/m, écarté de 3 cm et lâché sans vitesse. Équation horaire et vitesse maximale ?", [
      "ω₀ = √(20/0,2) = 10 rad/s ; φ = 0 ; Xm = 0,03 m.",
      "x(t) = 0,03 cos(10 t).",
      "vmax = Xm ω₀ = 0,3 m/s.",
    ]),
    ("Un pendule simple bat la seconde (T₀ = 2 s). Longueur ? (g = 9,8 m/s²)", [
      "ℓ = g T₀² / (4π²) = 9,8 × 4 / 39,5 ≈ 0,99 m.",
    ]),
  ], "Équation différentielle, période, énergie : exercice récurrent."),

  K("P12. Interférences lumineuses", 11, [
    "La lumière est une onde électromagnétique ; dans le vide c = 3 × 10⁸ m/s ; λ = c/ν. Visible : 400 nm à 800 nm.",
    "Diffraction : une fente de largeur a étale la lumière ; écart angulaire θ ≈ λ/a.",
    "Interférences (fentes de Young) : deux sources cohérentes S₁ et S₂ distantes de a, écran à D.",
    "Différence de marche en un point d'abscisse x : δ = a x / D.",
    "Frange brillante si δ = kλ ; frange sombre si δ = (2k + 1) λ/2. Ordre d'interférence p = δ/λ.",
    "Interfrange : i = λ D / a.",
    "En lumière blanche : frange centrale blanche, franges irisées de part et d'autre.",
    "Ondes mécaniques : λ = v T ; les interférences prouvent la nature ondulatoire.",
  ], [("Trouver λ à partir des franges", [
    "Mesurer la largeur de n interfranges, diviser par n.",
    "λ = i a / D (tout en mètres).",
  ])], [
    "Compter les franges au lieu des interfranges (11 franges brillantes = 10 interfranges).",
    "Oublier les conversions mm et nm.",
  ], [
    ("a = 0,5 mm, D = 2 m, 10 interfranges mesurent 24 mm. λ ?", [
      "i = 2,4 mm.",
      "λ = 2,4 × 10⁻³ × 0,5 × 10⁻³ / 2 = 6,0 × 10⁻⁷ m = 600 nm.",
    ]),
    ("Avec λ = 500 nm, a = 1 mm, D = 1 m : nature du point à x = 1,25 mm ?", [
      "δ = a x / D = 10⁻³ × 1,25 × 10⁻³ / 1 = 1,25 × 10⁻⁶ m.",
      "p = δ/λ = 2,5 : demi-entier, frange sombre.",
    ]),
  ], "Aspect ondulatoire de la lumière, souvent dans le même exercice que l'effet photoélectrique."),

  K("P13. Effet photoélectrique", 12, [
    "Effet photoélectrique : émission d'électrons par un métal éclairé, seulement si ν ≥ ν₀ (fréquence seuil), quelle que soit l'intensité.",
    "Photon : énergie E = h ν = h c / λ ; h = 6,62 × 10⁻³⁴ J·s ; 1 eV = 1,6 × 10⁻¹⁹ J.",
    "Travail d'extraction : W₀ = h ν₀ = h c / λ₀.",
    "Relation d'Einstein : h ν = W₀ + Ec max.",
    "Potentiel d'arrêt : e U₀ = Ec max ; il dépend de la fréquence, pas de l'intensité.",
    "L'intensité du courant photoélectrique de saturation est proportionnelle à la puissance lumineuse reçue.",
    "Dualité onde-corpuscule : la lumière est une onde (interférences) et un flux de photons (photoélectricité).",
    "Applications : cellules photoélectriques, panneaux solaires, capteurs d'appareils photo.",
  ], [("Exploiter le graphe Ec max = f(ν)", [
    "C'est une droite de pente h.",
    "Elle coupe l'axe des fréquences en ν₀.",
    "L'ordonnée à l'origine vaut −W₀.",
  ])], [
    "Croire qu'une lumière plus intense permet l'effet sous le seuil.",
    "Oublier de convertir les eV en joules.",
  ], [
    ("Césium : W₀ = 1,9 eV. Longueur d'onde seuil ?", [
      "λ₀ = h c / W₀ = 6,62 × 10⁻³⁴ × 3 × 10⁸ / (1,9 × 1,6 × 10⁻¹⁹).",
      "λ₀ ≈ 6,5 × 10⁻⁷ m = 650 nm.",
    ]),
    ("Le même métal est éclairé à λ = 400 nm. Ec max et potentiel d'arrêt ?", [
      "E(photon) = h c / λ ≈ 4,97 × 10⁻¹⁹ J ≈ 3,1 eV.",
      "Ec max = 3,1 − 1,9 = 1,2 eV ; U₀ = 1,2 V.",
    ]),
  ], "Questions sur le seuil, Ec max, le potentiel d'arrêt et la dualité onde-corpuscule."),

  K("P14. Niveaux d'énergie de l'atome", 13, [
    "L'énergie de l'atome est quantifiée : seuls certains niveaux sont permis.",
    "Atome d'hydrogène : Eₙ = −E₀ / n², E₀ = 13,6 eV. n = 1 : état fondamental ; n > 1 : états excités ; E∞ = 0 : atome ionisé.",
    "Émission : transition d'un niveau p vers n < p, photon de fréquence ν = (Eₚ − Eₙ)/h.",
    "Absorption : seul un photon d'énergie exactement égale à un écart de niveaux est absorbé (sauf ionisation).",
    "Spectres de raies : chaque élément a ses raies (identification des étoiles).",
    "Séries de l'hydrogène : Lyman (retour à n = 1, ultraviolet), Balmer (retour à n = 2, visible), Paschen (n = 3, infrarouge).",
    "1/λ = R_H (1/n² − 1/p²), R_H ≈ 1,097 × 10⁷ m⁻¹ (constante de Rydberg).",
  ], [("Calculer la longueur d'onde d'une raie", [
    "ΔE = Eₚ − Eₙ (eV), puis conversion en joules.",
    "λ = h c / ΔE.",
  ])], [
    "Oublier que les énergies sont négatives.",
    "Croire qu'un photon de 11 eV peut être absorbé par l'hydrogène au repos (aucun écart ne vaut 11 eV).",
  ], [
    ("Raie de la transition 3 → 2 de l'hydrogène ?", [
      "E₃ = −1,51 eV ; E₂ = −3,40 eV ; ΔE = 1,89 eV = 3,02 × 10⁻¹⁹ J.",
      "λ = h c / ΔE ≈ 657 nm : raie rouge Hα (série de Balmer).",
    ]),
    ("Énergie d'ionisation de l'hydrogène depuis l'état fondamental ?", [
      "E∞ − E₁ = 0 − (−13,6) = 13,6 eV.",
    ]),
  ], "Diagramme d'énergie, raies d'émission et d'absorption."),

  K("P15. Réactions nucléaires", 14, [
    "Noyau ᴬ_Z X : Z protons, A − Z neutrons. Isotopes : même Z.",
    "Lois de Soddy : conservation de A et de Z.",
    "Radioactivité α (⁴₂He), β⁻ (électron, n → p), β⁺ (positon, p → n), γ (désexcitation).",
    "Décroissance : N(t) = N₀ e^(−λt) ; A(t) = λ N(t) = A₀ e^(−λt) (Bq) ; t₁/₂ = ln 2 / λ.",
    "Défaut de masse Δm = Z mp + (A − Z) mn − m(noyau) ; énergie de liaison El = Δm c² ; stabilité mesurée par El/A (maximum vers le fer, A ≈ 56).",
    "Énergie libérée par une réaction : E = (m(réactifs) − m(produits)) c². 1 u = 1,66 × 10⁻²⁷ kg ≈ 931,5 MeV/c².",
    "Fission : noyau lourd (uranium 235) cassé par un neutron, réaction en chaîne (centrales). Fusion : noyaux légers (Soleil, bombe H).",
    "Datation : carbone 14 (t₁/₂ = 5 730 ans), t = (1/λ) ln(A₀/A).",
  ], [("Calculer l'énergie libérée", [
    "Calculer la perte de masse en u.",
    "Multiplier par 931,5 MeV (ou convertir en kg et multiplier par c²).",
  ]), ("Dater un échantillon", [
    "λ = ln 2 / t₁/₂.",
    "t = ln(A₀/A) / λ.",
  ])], [
    "Confondre λ (constante radioactive) et longueur d'onde.",
    "Mélanger MeV et joules (1 MeV = 1,6 × 10⁻¹³ J).",
  ], [
    ("L'activité d'un bois ancien vaut 25 % de celle d'un bois vivant. Âge ? (t₁/₂ = 5 730 ans)", [
      "25 % = 1/4 = (1/2)² : deux demi-vies.",
      "t = 11 460 ans.",
    ]),
    ("Le polonium 210 émet une particule α. Écrire l'équation (Po : Z = 84 ; Pb : Z = 82).", [
      "²¹⁰₈₄Po → ⁴₂He + ᴬ_Z X avec A = 206 et Z = 82.",
      "Le noyau fils est ²⁰⁶₈₂Pb.",
    ]),
  ], "Exercice fréquent : équations, décroissance, demi-vie, énergie de liaison et énergie libérée."),

  K("C1. Les alcools", 15, [
    "Alcool : groupe hydroxyle −OH sur un carbone tétragonal. Formule générale des alcools saturés : CₙH₂ₙ₊₁OH.",
    "Classes : primaire (C fonctionnel lié à 1 C), secondaire (2 C), tertiaire (3 C).",
    "Nomenclature : chaîne la plus longue contenant le C fonctionnel, suffixe -ol, indice le plus petit (butan-2-ol).",
    "Obtention : hydratation d'un alcène (règle de Markovnikov), fermentation des sucres (éthanol).",
    "Oxydation ménagée (dichromate ou permanganate en milieu acide) : primaire → aldéhyde → acide carboxylique ; secondaire → cétone ; tertiaire : rien.",
    "Tests : DNPH (précipité jaune) pour aldéhydes et cétones ; Fehling (rouge brique), Tollens (miroir d'argent) et réactif de Schiff (rose) pour les aldéhydes seulement.",
    "Déshydratation : intramoléculaire (alcène, vers 170 °C) ou intermoléculaire (éther-oxyde, vers 140 °C).",
    "Combustion complète : CₙH₂ₙ₊₁OH + (3n/2) O₂ → n CO₂ + (n + 1) H₂O.",
  ], [("Écrire l'équation d'une oxydation ménagée", [
    "Demi-équation du couple organique : par exemple CH₃CHO + 2H⁺ + 2e⁻ ⇌ CH₃CH₂OH.",
    "Demi-équation de l'oxydant : Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O.",
    "Égaliser les électrons, additionner, simplifier.",
  ])], [
    "Oublier le carbone fonctionnel dans la chaîne principale.",
    "Dire qu'un alcool tertiaire s'oxyde en cétone.",
  ], [
    ("Un alcool A de formule C₄H₁₀O donne une cétone par oxydation ménagée. Identifier A.", [
      "Il est secondaire.",
      "Le seul alcool secondaire en C₄ est le butan-2-ol, CH₃−CHOH−CH₂−CH₃ ; la cétone est la butanone.",
    ]),
    ("Masse molaire d'un alcool saturé : 74 g/mol. Formule ?", [
      "M(CₙH₂ₙ₊₂O) = 14n + 18 = 74.",
      "n = 4 : C₄H₁₀O (4 isomères alcools).",
    ]),
  ], "Identification par tests, nomenclature, équations d'oxydoréduction."),

  K("C2. Amines et acides α-aminés", 16, [
    "Amines : dérivés de NH₃ ; primaire R−NH₂, secondaire R−NH−R′, tertiaire R−N(R′)−R″.",
    "Nomenclature : méthanamine, N-méthyléthanamine…",
    "L'atome d'azote porte un doublet libre : les amines sont des bases (R−NH₃⁺/R−NH₂, pKa ≈ 10-11) et des nucléophiles.",
    "Réaction avec les halogénoalcanes (alkylation, réaction d'Hofmann) et avec les chlorures d'acyle (formation d'amides).",
    "Acide α-aminé : R−CH(NH₂)−COOH ; le carbone α est asymétrique (sauf glycine) : molécule chirale, deux énantiomères D et L (représentation de Fischer).",
    "En solution, forme zwitterion (amphion) H₃N⁺−CHR−COO⁻ ; deux couples acide-base ; point isoélectrique.",
    "Dipeptide : condensation de deux acides α-aminés avec formation d'une liaison peptidique −CO−NH− et élimination d'eau. Il faut protéger et activer des groupes pour obtenir un seul dipeptide.",
  ], [("Écrire les dipeptides possibles à partir de deux acides aminés A et B", [
    "Sans protection : A−A, A−B, B−A, B−B (4 dipeptides).",
    "Pour obtenir A−B seulement : bloquer NH₂ de A et COOH de B, activer COOH de A.",
  ])], [
    "Oublier la molécule d'eau éliminée lors de la formation de la liaison peptidique.",
    "Confondre carbone asymétrique et double liaison.",
  ], [
    ("Glycine (H₂N−CH₂−COOH) et alanine (H₂N−CH(CH₃)−COOH) : écrire le dipeptide Gly-Ala.", [
      "Le COOH de la glycine réagit avec le NH₂ de l'alanine.",
      "H₂N−CH₂−CO−NH−CH(CH₃)−COOH + H₂O.",
    ]),
    ("Pourquoi la glycine n'est-elle pas chirale ?", [
      "Son carbone α porte deux atomes d'hydrogène.",
      "Il n'est donc pas asymétrique : la molécule est superposable à son image.",
    ]),
  ], "Acides α-aminés et dipeptides : sujet très fréquent en S2."),

  K("C3. Acides carboxyliques et dérivés", 17, [
    "Acide carboxylique R−COOH ; acide faible (pKa ≈ 4 à 5) ; nomenclature : acide …oïque.",
    "Dérivés : chlorure d'acyle R−COCl, anhydride d'acide (R−CO)₂O, ester R−COO−R′, amide R−CONH₂.",
    "Estérification directe : acide + alcool ⇌ ester + eau ; lente, limitée (rendement ≈ 67 % pour un alcool primaire en quantités égales, 60 % secondaire, 5 % tertiaire), athermique.",
    "Améliorer le rendement : excès d'un réactif ou élimination de l'eau ; H⁺ et la chaleur accélèrent sans changer l'équilibre.",
    "Avec un chlorure d'acyle ou un anhydride : estérification rapide et totale.",
    "Hydrolyse de l'ester : inverse de l'estérification, lente et limitée. Saponification : ester + HO⁻ → carboxylate + alcool, totale ; savons à partir des corps gras (triglycérides).",
    "Amides : chlorure d'acyle + amine (ou ammoniac).",
  ], [("Calculer un rendement d'estérification", [
    "n(acide) et n(alcool) initiaux.",
    "Réactif limitant : n(ester) max.",
    "Rendement = n(ester obtenu) / n(ester max).",
  ])], [
    "Écrire l'estérification directe avec une flèche simple.",
    "Croire que le catalyseur augmente le rendement.",
  ], [
    ("On mélange 0,5 mol d'acide éthanoïque et 0,5 mol d'éthanol ; on obtient 0,33 mol d'ester. Rendement ?", [
      "n max = 0,5 mol.",
      "r = 0,33 / 0,5 = 66 % : valeur caractéristique d'un alcool primaire.",
    ]),
    ("Nommer CH₃−COO−CH₂−CH₃ et donner ses réactifs.", [
      "Éthanoate d'éthyle.",
      "Acide éthanoïque + éthanol (ou chlorure d'éthanoyle + éthanol pour une réaction totale).",
    ]),
  ], "Estérification, hydrolyse, saponification : questions de cours et calculs de rendement."),

  K("C4. Cinétique chimique", 18, [
    "Vitesse volumique de formation d'un produit : v = d[P]/dt ; de disparition d'un réactif : v = −d[R]/dt.",
    "On la lit comme la pente de la tangente à la courbe [P] = f(t).",
    "La vitesse diminue au cours du temps (les réactifs s'épuisent).",
    "Temps de demi-réaction t₁/₂ : durée pour atteindre la moitié de l'avancement final.",
    "Facteurs cinétiques : température, concentration des réactifs, surface de contact, catalyseur.",
    "Catalyse homogène (même phase), hétérogène (solide), enzymatique ; un catalyseur ne modifie pas l'état final.",
    "Trempe : refroidissement brutal ou dilution pour bloquer la réaction avant un dosage.",
  ], [("Déterminer une vitesse à une date t", [
    "Tracer la tangente à la courbe au point d'abscisse t.",
    "Calculer sa pente avec deux points éloignés.",
  ])], [
    "Calculer une pente entre deux points de la courbe au lieu de la tangente.",
    "Oublier l'unité (mol·L⁻¹·min⁻¹).",
  ], [
    ("[I₂] passe de 0 à 20 mmol/L en fin de réaction ; elle vaut 10 mmol/L à t = 4 min. t₁/₂ ?", [
      "La moitié de la valeur finale est 10 mmol/L.",
      "t₁/₂ = 4 min.",
    ]),
    ("Pourquoi conserve-t-on les aliments au réfrigérateur ?", [
      "La température est un facteur cinétique.",
      "Au froid, les réactions de dégradation sont plus lentes.",
    ]),
  ], "Courbes, tangentes, temps de demi-réaction, facteurs cinétiques."),

  K("C5. Autoprotolyse de l'eau, pH et indicateurs", 19, [
    "Autoprotolyse : 2H₂O ⇌ H₃O⁺ + HO⁻ ; produit ionique Ke = [H₃O⁺][HO⁻] = 10⁻¹⁴ à 25 °C (pKe = 14). Ke augmente avec la température.",
    "pH = −log[H₃O⁺] ; [H₃O⁺] = 10⁻ᵖᴴ.",
    "Solution neutre : [H₃O⁺] = [HO⁻], pH = 7 à 25 °C ; acide : pH < 7 ; basique : pH > 7.",
    "Indicateur coloré : couple acide-base dont les deux formes ont des couleurs différentes ; zone de virage ≈ pKa ± 1.",
    "Exemples : hélianthine (3,1 – 4,4), bleu de bromothymol (6,0 – 7,6), phénolphtaléine (8,2 – 10).",
    "Électroneutralité : somme des concentrations × charges des cations = celle des anions.",
  ], [("Calculer [HO⁻] d'une solution", [
    "[H₃O⁺] = 10⁻ᵖᴴ.",
    "[HO⁻] = Ke / [H₃O⁺].",
  ])], [
    "Croire qu'une solution à pH = 7 est neutre à toute température.",
    "Oublier que log(10⁻ⁿ) = −n.",
  ], [
    ("Une solution a pH = 9. [H₃O⁺] et [HO⁻] ?", [
      "[H₃O⁺] = 10⁻⁹ mol/L.",
      "[HO⁻] = 10⁻¹⁴ / 10⁻⁹ = 10⁻⁵ mol/L : solution basique.",
    ]),
    ("Quelle couleur prend le BBT dans une solution de pH = 4 ?", [
      "pH < 6,0 : forme acide.",
      "Le BBT est jaune.",
    ]),
  ], "Bases indispensables pour tous les exercices acide-base."),

  K("C6. Acides forts et bases fortes", 20, [
    "Acide fort : totalement dissocié dans l'eau (HCl + H₂O → H₃O⁺ + Cl⁻) ; pH = −log C (pour 10⁻⁶ < C < 10⁻¹ mol/L).",
    "Base forte : totalement dissociée (NaOH → Na⁺ + HO⁻) ; pH = 14 + log C.",
    "Dilution par 10 : le pH d'un acide fort augmente de 1 ; celui d'une base forte diminue de 1.",
    "Réaction acide fort + base forte : H₃O⁺ + HO⁻ → 2H₂O, totale et exothermique.",
    "Dosage acide fort / base forte : équivalence quand Ca Va = Cb Vb,E ; pH à l'équivalence = 7 ; saut de pH important ; indicateur : BBT.",
    "Mélange non équivalent : calculer la quantité d'ions en excès pour trouver le pH.",
  ], [("Calculer le pH d'un mélange acide fort + base forte", [
    "n(H₃O⁺) = Ca Va ; n(HO⁻) = Cb Vb.",
    "Ce qui est en excès reste ; le diviser par le volume total.",
    "Calculer le pH.",
  ])], [
    "Oublier le volume total dans le calcul du mélange.",
    "Appliquer pH = −log C à un acide faible.",
  ], [
    ("pH d'une solution de soude à 10⁻² mol/L ?", ["pH = 14 + log 10⁻² = 12."]),
    ("On mélange 20 mL de HCl à 0,1 mol/L et 10 mL de NaOH à 0,1 mol/L. pH ?", [
      "n(H₃O⁺) = 2 × 10⁻³ mol ; n(HO⁻) = 10⁻³ mol ; excès d'acide : 10⁻³ mol.",
      "[H₃O⁺] = 10⁻³ / 0,030 ≈ 0,033 mol/L.",
      "pH ≈ 1,5.",
    ]),
  ], "Calculs de pH, dosages, choix de l'indicateur."),

  K("C7. Acides faibles, bases faibles et pKa", 21, [
    "Acide faible : réaction limitée avec l'eau, AH + H₂O ⇌ A⁻ + H₃O⁺. Pour un acide faible, pH > −log C.",
    "Constante d'acidité : Ka = [A⁻][H₃O⁺]/[AH] ; pKa = −log Ka.",
    "Relation : pH = pKa + log([A⁻]/[AH]).",
    "Domaines de prédominance : pH < pKa → AH prédomine ; pH > pKa → A⁻ prédomine.",
    "Plus le pKa est petit, plus l'acide est fort (et sa base conjuguée faible).",
    "Coefficient de dissociation : α = [A⁻]/C.",
    "Couples à connaître : CH₃COOH/CH₃COO⁻ (pKa 4,8), NH₄⁺/NH₃ (9,2), H₂O/HO⁻ (14), H₃O⁺/H₂O (0).",
    "Réaction entre deux couples : favorisée si l'acide le plus fort réagit avec la base la plus forte ; K = 10^(pKa₂ − pKa₁).",
  ], [("Calculer le pKa à partir du pH et de C", [
    "[H₃O⁺] = [A⁻] = 10⁻ᵖᴴ (on néglige l'autoprotolyse).",
    "[AH] = C − [A⁻].",
    "Ka = [A⁻]² / [AH], puis pKa.",
  ])], [
    "Écrire la réaction d'un acide faible avec une flèche simple.",
    "Confondre Ka et pKa.",
  ], [
    ("Acide éthanoïque à C = 10⁻² mol/L, pH = 3,4. Est-il fort ? pKa ?", [
      "Un acide fort aurait pH = 2 : 3,4 > 2, l'acide est faible.",
      "[H₃O⁺] = [A⁻] = 4 × 10⁻⁴ ; [AH] ≈ 9,6 × 10⁻³.",
      "Ka ≈ 1,7 × 10⁻⁵, pKa ≈ 4,8.",
    ]),
    ("Quelle espèce prédomine dans une solution d'ammoniac à pH = 11 ?", [
      "pKa(NH₄⁺/NH₃) = 9,2 < 11.",
      "La forme basique NH₃ prédomine.",
    ]),
  ], "Montrer qu'un acide est faible, calculer Ka et pKa, diagrammes de prédominance."),

  K("C8. Dosages et solutions tampons", 22, [
    "Équivalence : réactifs dans les proportions stœchiométriques ; Ca Va = Cb Vb,E.",
    "Acide faible dosé par base forte : pH à l'équivalence > 7 ; à la demi-équivalence pH = pKa ; indicateur : phénolphtaléine.",
    "Base faible dosée par acide fort : pH à l'équivalence < 7 ; demi-équivalence pH = pKa ; indicateur : hélianthine ou rouge de méthyle.",
    "Méthode des tangentes parallèles ou de la dérivée (dpH/dV maximale) pour trouver l'équivalence.",
    "Solution tampon : mélange équimolaire d'un acide faible et de sa base conjuguée ; pH = pKa ; varie peu par dilution ou par ajout modéré d'acide ou de base.",
    "Préparation d'un tampon : mélange AH + A⁻, ou demi-neutralisation d'un acide faible par une base forte.",
    "Le sang est tamponné (pH ≈ 7,4) par le couple CO₂,H₂O/HCO₃⁻.",
  ], [("Exploiter une courbe de dosage", [
    "Trouver VE et pHE (tangentes).",
    "Calculer la concentration inconnue.",
    "Lire le pH à VE/2 : pKa.",
    "Choisir l'indicateur dont la zone de virage contient pHE.",
  ])], [
    "Lire le pKa à l'équivalence au lieu de la demi-équivalence.",
    "Choisir le BBT pour un acide faible (pHE souvent vers 8 à 9).",
  ], [
    ("20 mL d'acide dosés par NaOH à 0,1 mol/L : VE = 16 mL ; pH(8 mL) = 4,8. Ca et pKa ?", [
      "Ca = 0,1 × 16 / 20 = 0,08 mol/L.",
      "pKa = 4,8 (pH à la demi-équivalence) : acide éthanoïque.",
    ]),
    ("Comment préparer 100 mL d'un tampon de pH 4,8 avec CH₃COOH et CH₃COONa à 0,1 mol/L ?", [
      "pH = pKa : il faut [AH] = [A⁻].",
      "Mélanger 50 mL de chaque solution.",
    ]),
  ], "Présent dans presque tous les sujets : courbe pH = f(V), équivalence, pKa, indicateur, tampon."),
]
