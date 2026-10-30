# Synthèses de cours : l'essentiel à savoir par matière, à lire avant de faire les quiz.
# Format : identifiant de matière -> [(titre de la partie, [points à retenir])].

FICHES = {
  "3e-maths": [
    ("Calcul littéral et racines carrées", [
      "Identités remarquables : (a + b)² = a² + 2ab + b² ; (a − b)² = a² − 2ab + b² ; (a − b)(a + b) = a² − b².",
      "√(a × b) = √a × √b et √(a / b) = √a / √b (a, b positifs). Exemple : √50 = √25 × √2 = 5√2.",
      "Pour enlever un radical du dénominateur, on multiplie par le conjugué : 1 / (√3 − 1) = (√3 + 1) / 2.",
      "Factoriser, c'est écrire sous forme de produit : on cherche un facteur commun ou une identité remarquable.",
    ]),
    ("Équations, inéquations, systèmes", [
      "Produit nul : AB = 0 si et seulement si A = 0 ou B = 0.",
      "Quand on multiplie ou divise une inéquation par un nombre négatif, on change le sens de l'inégalité.",
      "Système de deux équations : par substitution (on exprime une inconnue) ou par combinaison (on additionne les équations).",
    ]),
    ("Applications affines et repérage", [
      "f(x) = ax + b. a = (f(x₂) − f(x₁)) / (x₂ − x₁) est le coefficient directeur ; b est l'ordonnée à l'origine.",
      "Milieu de [AB] : ((xA + xB)/2 ; (yA + yB)/2). Distance : AB = √((xB − xA)² + (yB − yA)²).",
      "Deux droites sont parallèles si elles ont le même coefficient directeur ; perpendiculaires si le produit des coefficients vaut −1.",
    ]),
    ("Géométrie", [
      "Pythagore : dans un triangle rectangle, hypoténuse² = somme des carrés des deux autres côtés. La réciproque prouve qu'un triangle est rectangle.",
      "Thalès : si (MN) // (BC), alors AM/AB = AN/AC = MN/BC.",
      "Trigonométrie (SOH CAH TOA) : sin = opposé/hypoténuse ; cos = adjacent/hypoténuse ; tan = opposé/adjacent.",
      "Un angle inscrit mesure la moitié de l'angle au centre qui intercepte le même arc.",
      "Volumes : pyramide et cône = (aire de base × hauteur) / 3 ; cylindre = π r² h ; sphère = (4/3) π r³.",
    ]),
    ("Statistiques", [
      "Moyenne = somme des valeurs / effectif total (ou somme des valeurs × effectifs / effectif total).",
      "Fréquence = effectif de la valeur / effectif total. Médiane : valeur du milieu de la série rangée.",
      "Mode : valeur (ou classe) qui a le plus grand effectif.",
    ]),
  ],
  "3e-francais": [
    ("Grammaire", [
      "Natures : nom, verbe, adjectif, adverbe, pronom, déterminant, préposition, conjonction. Fonctions : sujet, COD, COI, attribut, complément circonstanciel.",
      "Participe passé avec être : accord avec le sujet. Avec avoir : accord avec le COD seulement s'il est placé avant le verbe.",
      "Subordonnées circonstancielles : cause (parce que), conséquence (si bien que), but (pour que + subjonctif), concession (bien que + subjonctif), condition (si).",
      "Discours indirect au passé : présent → imparfait, futur → conditionnel, passé composé → plus-que-parfait ; demain → le lendemain.",
    ]),
    ("Figures de style", [
      "Comparaison (avec outil : comme, tel) ; métaphore (sans outil) ; personnification (une chose agit comme un humain).",
      "Hyperbole (exagération) ; litote (dire moins pour suggérer plus) ; euphémisme (adoucir) ; antithèse (opposer deux idées) ; oxymore (deux mots contraires côte à côte).",
      "Anaphore : répétition d'un mot en début de phrase ou de vers.",
    ]),
    ("Épreuves du BFEM", [
      "Texte suivi de questions : lis tout le texte, relève des mots précis, justifie chaque réponse par une citation entre guillemets.",
      "Rédaction : introduction (on présente le sujet), développement en paragraphes (une idée + un exemple chacun), conclusion (bilan + ouverture).",
      "Dictée : relis à la fin en vérifiant les accords sujet-verbe, nom-adjectif et les participes passés.",
    ]),
    ("Œuvres africaines à connaître", [
      "Cheikh Hamidou Kane, L'Aventure ambiguë (1961) ; Mariama Bâ, Une si longue lettre (1979) ; Birago Diop, Les Contes d'Amadou Koumba (1947).",
      "Ousmane Sembène, Les Bouts de bois de Dieu (1960) ; Seydou Badian, Sous l'orage (1957) ; Camara Laye, L'Enfant noir (1953) ; Senghor, Hosties noires (1948).",
    ]),
  ],
  "3e-svt": [
    ("Immunologie et VIH", [
      "Défenses non spécifiques : peau, muqueuses, phagocytose (les phagocytes englobent et digèrent les microbes).",
      "Défenses spécifiques : les lymphocytes B deviennent plasmocytes et fabriquent des anticorps ; les lymphocytes T détruisent les cellules infectées.",
      "Vaccin : microbe atténué ou tué, crée une mémoire immunitaire durable (prévention). Sérothérapie : injection d'anticorps tout faits, effet immédiat mais court (traitement).",
      "VIH : transmis par le sang, les rapports sexuels non protégés et de la mère à l'enfant. Il détruit les lymphocytes T4. Séropositif = porteur d'anticorps anti-VIH.",
    ]),
    ("Géologie : dérive des continents et tectonique", [
      "Wegener (1912) : les continents étaient réunis (Pangée). Arguments : emboîtement des côtes Afrique / Amérique du Sud, mêmes fossiles et mêmes roches des deux côtés.",
      "Les plaques s'écartent au niveau des dorsales (création de croûte océanique) et se rapprochent au niveau des fosses (subduction).",
      "Séismes et volcans se situent surtout aux limites des plaques.",
    ]),
    ("Système nerveux et régulation", [
      "Le message nerveux est électrique le long des neurones et chimique au niveau des synapses.",
      "Un réflexe met en jeu : récepteur → nerf sensitif → centre nerveux (moelle épinière) → nerf moteur → muscle.",
      "Glycémie normale ≈ 1 g/L. Insuline (pancréas) : la fait baisser. Glucagon : la fait monter. Diabète : glycémie trop élevée.",
    ]),
    ("Sang et nutrition", [
      "Sang : plasma (liquide), globules rouges (transport du dioxygène par l'hémoglobine), globules blancs (défense), plaquettes (coagulation).",
      "Groupes ABO : O est donneur universel, AB est receveur universel.",
      "Les échanges respiratoires se font dans les alvéoles pulmonaires ; le rein filtre le sang et fabrique l'urine.",
    ]),
  ],
  "3e-pc": [
    ("Électricité", [
      "Loi d'Ohm : U = R × I (U en volts, R en ohms, I en ampères).",
      "Résistances en série : R = R₁ + R₂. En parallèle : 1/R = 1/R₁ + 1/R₂.",
      "Puissance : P = U × I (watts). Énergie : E = P × t (en Wh si t est en heures, en J si t est en secondes ; 1 Wh = 3 600 J).",
    ]),
    ("Chimie", [
      "Une équation chimique est équilibrée quand il y a le même nombre de chaque atome des deux côtés.",
      "Quantité de matière : n = m / M (mol). Masse volumique : ρ = m / V.",
      "Tests : CO₂ trouble l'eau de chaux ; H₂ fait une petite détonation ; O₂ rallume une bûchette incandescente ; l'eau bleuit le sulfate de cuivre anhydre.",
      "Ions et soude : Cu²⁺ → précipité bleu ; Fe²⁺ → vert ; Fe³⁺ → rouille ; Zn²⁺ → blanc.",
      "Laiton = cuivre + zinc. Dans l'acide chlorhydrique, le zinc réagit (dégagement de H₂), le cuivre non.",
      "pH < 7 : acide ; pH = 7 : neutre ; pH > 7 : basique.",
    ]),
    ("Mécanique et optique", [
      "Poids : P = m × g (m en kg, g ≈ 10 N/kg sur Terre). Vitesse moyenne : v = d / t.",
      "Lentille convergente : un rayon passant par le centre optique n'est pas dévié ; vergence C = 1 / f (f en mètres, C en dioptries).",
    ]),
  ],
  "3e-histoire": [
    ("Le monde de 1789 à 1945", [
      "1776 : indépendance des États-Unis. 1789 : Révolution française. XVIIIe-XIXe siècle : révolution industrielle, partie d'Angleterre.",
      "1914-1918 : Première Guerre mondiale (armistice le 11 novembre 1918). 1929 : krach de Wall Street et crise mondiale.",
      "1939-1945 : Seconde Guerre mondiale. 1945 : création de l'ONU. 1948 : Déclaration universelle des droits de l'homme.",
    ]),
    ("Colonisation et résistances", [
      "1884-1885 : conférence de Berlin. 1848 : abolition de l'esclavage dans les colonies françaises. 1895 : création de l'AOF (capitale Dakar en 1902).",
      "Résistants : El Hadj Omar Tall (empire toucouleur), Lat Dior (Cayor, contre le chemin de fer), Samory Touré (capturé en 1898), Aline Sitoé Diatta (Casamance), Cheikh Ahmadou Bamba (exil au Gabon en 1895).",
      "1914 : Blaise Diagne, premier député africain. 1944 : massacre de Thiaroye.",
    ]),
    ("Le Sénégal indépendant", [
      "1959-1960 : Fédération du Mali (Sénégal + Soudan français). 4 avril 1960 : indépendance ; 20 août 1960 : le Sénégal quitte la Fédération.",
      "Présidents : Senghor (1960), Abdou Diouf (1981), Abdoulaye Wade (2000), Macky Sall (2012), Bassirou Diomaye Faye (2024).",
      "Décembre 1962 : crise entre Senghor et Mamadou Dia.",
    ]),
  ],
  "3e-geo": [
    ("Population mondiale", [
      "Plus de 8 milliards d'habitants (2022). L'Asie est le continent le plus peuplé ; l'Inde est le pays le plus peuplé depuis 2023.",
      "Densité = habitants / km². Taux de natalité = naissances pour 1 000 habitants par an.",
      "Exode rural : départ des campagnes vers les villes.",
    ]),
    ("Le Sénégal", [
      "14 régions. Climat sahélien au nord, plus humide au sud (Ziguinchor la plus arrosée). Hivernage de juin-juillet à octobre.",
      "Ressources : arachide, pêche, phosphates (ICS), or (Kédougou), pétrole (Sangomar, depuis 2024), gaz.",
      "Fleuve Sénégal : barrages de Diama (anti-sel) et Manantali (Mali), gérés par l'OMVS (Sénégal, Mali, Mauritanie, Guinée).",
      "Sites : parc du Niokolo-Koba (Tambacounda), delta du Saloum (Fatick), lac Rose, pointe des Almadies (point le plus à l'ouest de l'Afrique).",
    ]),
    ("Environnement", [
      "Désertification : sécheresse, déboisement et surpâturage dégradent les terres du Sahel.",
      "Le climat équatorial est chaud et humide toute l'année.",
    ]),
  ],
  "3e-anglais": [
    ("Les temps", [
      "Present simple (habitude) : She goes. Present continuous (en ce moment) : She is going.",
      "Past simple (action finie, date) : I did it yesterday. Past continuous : I was reading when he came.",
      "Present perfect (lien avec le présent) : I have lived here since 2010 / for ten years. Since + point de départ, for + durée.",
      "Futur : will + verbe. Condition : If it rains, I will stay.",
    ]),
    ("Points de grammaire", [
      "Much + indénombrable (water), many + dénombrable (books). Some dans l'affirmative, any dans la question et la négation.",
      "Modaux : must (obligation), mustn't (interdiction), should (conseil), can (capacité).",
      "Relatifs : who (personne), which (chose), whose (possession). Possessifs : my, your, his, her, its, our, their.",
      "Prépositions de temps : in 2010, in July, on Monday, at 8 o'clock.",
      "Comparatif : bigger than, more interesting than. Superlatif : the biggest, the most interesting. Irréguliers : good → better → the best.",
    ]),
  ],
  "tle-maths": [
    ("Limites et dérivées", [
      "Limites à connaître : ln x / x → 0 en +∞ ; eˣ / x → +∞ ; (eˣ − 1)/x → 1 et ln(1 + x)/x → 1 quand x → 0.",
      "Dérivées : (ln u)' = u'/u ; (eᵘ)' = u'eᵘ ; (uv)' = u'v + uv' ; (u/v)' = (u'v − uv')/v².",
      "Le signe de la dérivée donne les variations ; un extremum est atteint là où f' s'annule en changeant de signe.",
    ]),
    ("Primitives et intégrales", [
      "Primitive de u'eᵘ : eᵘ ; de u'/u : ln|u| ; de xⁿ : xⁿ⁺¹/(n + 1).",
      "∫ₐᵇ f(x) dx = F(b) − F(a). Intégration par parties : ∫ u v' = [uv] − ∫ u' v.",
      "L'aire entre la courbe et l'axe (f positive) se calcule par une intégrale, en unités d'aire.",
    ]),
    ("Nombres complexes", [
      "|a + ib| = √(a² + b²). Forme exponentielle : z = r e^(iθ). Conjugué de a + ib : a − ib.",
      "Écriture complexe z' = az + b : si a = 1, translation ; si a réel ≠ 1, homothétie ; si |a| = 1, rotation d'angle arg a. Le centre est le point fixe : z = az + b.",
      "Équation du second degré à coefficients réels avec Δ < 0 : z = (−b ± i√(−Δ)) / 2a.",
    ]),
    ("Suites", [
      "Arithmétique : uₙ = u₀ + n r ; somme = nombre de termes × (premier + dernier) / 2.",
      "Géométrique : uₙ = u₀ qⁿ ; somme = premier terme × (1 − q^(nombre de termes)) / (1 − q).",
      "Une suite croissante et majorée converge.",
    ]),
    ("Probabilités et équations différentielles", [
      "P_B(A) = P(A ∩ B) / P(B). A et B indépendants si P(A ∩ B) = P(A) P(B).",
      "Loi binomiale B(n, p) : P(X = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ ; E(X) = np ; V(X) = np(1 − p).",
      "y' = ay : y = C e^(ax). y'' + ω²y = 0 : y = A cos ωx + B sin ωx.",
    ]),
  ],
  "tle-pc": [
    ("Mécanique", [
      "2e loi de Newton : ΣF = m·a. Chute libre : a = g ≈ 9,8 m/s², trajectoire parabolique pour un lancer oblique.",
      "Mouvement circulaire uniforme : accélération centripète a = v²/r. Satellite : v = √(GM/r).",
      "Énergie cinétique : ½ m v². Pendule simple : T = 2π√(l/g).",
    ]),
    ("Électricité", [
      "Condensateur : q = C·u ; dipôle RC : τ = RC ; énergie ½ C u².",
      "Bobine : u = L di/dt + r i ; énergie ½ L i². Circuit LC : ω₀ = 1/√(LC).",
      "RLC : résonance à N₀ = 1 / (2π√(LC)).",
      "Force de Lorentz : F = q v ∧ B.",
    ]),
    ("Ondes, lumière, noyau", [
      "v = λ × f. Interférences et diffraction : aspect ondulatoire. Effet photoélectrique : aspect corpusculaire, E = h·ν.",
      "Radioactivité : N = N₀ e^(−λt) ; demi-vie t½ = ln 2 / λ. α = noyau d'hélium ; β⁻ = électron ; β⁺ = positon.",
    ]),
    ("Chimie", [
      "pH = −log[H₃O⁺]. pKa = −log Ka. À la demi-équivalence (acide faible / base forte), pH = pKa ; à l'équivalence, pH > 7.",
      "Estérification : acide carboxylique + alcool ⇌ ester + eau (lente, limitée).",
      "Facteurs cinétiques : température, concentration, catalyseur.",
      "Acide α-aminé : R–CH(NH₂)–COOH ; deux acides aminés forment un dipeptide (liaison peptidique).",
    ]),
  ],
  "tle-svt": [
    ("Système nerveux et muscle", [
      "Potentiel de repos ≈ −70 mV ; potentiel d'action = message nerveux codé en fréquence.",
      "Synapse : le message devient chimique (neurotransmetteurs) ; à la plaque motrice, c'est l'acétylcholine.",
      "Réflexe myotatique : monosynaptique. Contraction : ATP + Ca²⁺, glissement de l'actine sur la myosine dans le sarcomère.",
    ]),
    ("Reproduction", [
      "Hypothalamus (GnRH) → hypophyse (FSH, LH) → gonades. Pic de LH = ovulation. Le corps jaune sécrète la progestérone.",
      "Chez l'homme, la testostérone est produite par les cellules de Leydig.",
      "Pilule : rétrocontrôle négatif qui bloque le pic de LH.",
    ]),
    ("Génétique", [
      "Méiose : 4 cellules haploïdes ; brassage interchromosomique (anaphase I) et intrachromosomique (crossing-over, prophase I).",
      "Monohybridisme avec dominance : F2 = 3/4 – 1/4. Dihybridisme, gènes indépendants : 9/3/3/1. Test-cross : croisement avec un homozygote récessif.",
      "Hérédité liée à X (hémophilie, daltonisme) : touche surtout les garçons.",
      "Transcription dans le noyau (ADN → ARNm) ; traduction dans le cytoplasme (codons de 3 nucléotides ; codons stop UAA, UAG, UGA).",
    ]),
    ("Immunologie et régulations", [
      "Soi : molécules du CMH (HLA). Réponse humorale : lymphocytes B → plasmocytes → anticorps. Réponse cellulaire : T8 cytotoxiques.",
      "Les T4 coordonnent les réponses ; le VIH les détruit.",
      "Glycémie : insuline (hypoglycémiante) et glucagon (hyperglycémiante). Pression artérielle : barorécepteurs du sinus carotidien et de la crosse aortique.",
    ]),
  ],
  "tle-philo": [
    ("Méthode", [
      "Dissertation : introduction (amorce, problématique, plan), développement en deux ou trois parties argumentées avec des références, conclusion qui répond à la question.",
      "Commentaire de texte : dégager le thème, la thèse et le problème, puis expliquer le texte et le discuter.",
    ]),
    ("Grandes thèses à connaître", [
      "Conscience : Descartes, « Je pense, donc je suis » ; Freud, l'inconscient.",
      "Liberté : Sartre, « l'existence précède l'essence » ; Spinoza, la liberté comme connaissance de la nécessité ; Épictète, ce qui dépend de nous.",
      "Politique : Aristote, « l'homme est un animal politique » ; Hobbes, état de nature ; Rousseau, contrat social ; Montesquieu, séparation des pouvoirs ; Weber, monopole de la violence légitime.",
      "Morale : Kant, impératif catégorique ; Aristote, la vertu comme juste milieu ; Épicure, l'ataraxie.",
      "Science : Bachelard, obstacle épistémologique ; Popper, réfutabilité ; Comte, positivisme et loi des trois états.",
      "Travail et technique : Marx, aliénation ; Bergson, homo faber.",
      "Pensée africaine : Senghor et la Négritude ; Cheikh Anta Diop, Nations nègres et culture ; Nkrumah, le consciencisme ; Hountondji, critique de l'ethnophilosophie.",
    ]),
  ],
  "tle-hg": [
    ("Relations internationales depuis 1945", [
      "1945 : ONU. 1947 : plan Marshall. 1949 : OTAN ; 1955 : pacte de Varsovie. Guerre froide entre États-Unis et URSS.",
      "1961 : mur de Berlin ; 1962 : crise de Cuba ; 1989 : chute du mur ; 1991 : fin de l'URSS.",
      "1944 : Bretton Woods (FMI, Banque mondiale). 1992 : traité de Maastricht (Union européenne).",
    ]),
    ("Décolonisation", [
      "Asie : Inde 1947 ; Indochine, Diên Biên Phu 1954. 1955 : conférence de Bandung.",
      "Afrique : conférence de Brazzaville 1944 ; Ghana 1957 ; loi-cadre 1956 ; Guinée 1958 (vote « non ») ; Sénégal 1960 ; Algérie 1962.",
      "OUA 1963 (Addis-Abeba) → Union africaine 2002. CEDEAO 1975. UEMOA 1994.",
      "Afrique du Sud : apartheid aboli en 1991, Mandela président en 1994.",
    ]),
    ("Géographie des puissances", [
      "États-Unis : Mégalopolis (Boston-Washington), Silicon Valley (Californie).",
      "Japon : mégalopole de Tokyo à Osaka. Chine : ouverture par Deng Xiaoping à partir de 1978 (zones économiques spéciales).",
      "Brésil : capitale Brasilia. Nigeria : pays le plus peuplé d'Afrique.",
    ]),
  ],
  "tle-francais": [
    ("Méthode", [
      "Résumé : réduire le texte au quart (ou selon la consigne), sans citer, en gardant l'ordre des idées.",
      "Commentaire : introduction (situer, thème, axes), deux ou trois axes avec citations analysées, conclusion.",
      "Dissertation : thèse, antithèse, synthèse ou plan analytique ; chaque argument illustré par une œuvre.",
    ]),
    ("Outils d'analyse", [
      "Versification : alexandrin = 12 syllabes ; sonnet = 14 vers ; rimes plates (AABB), croisées (ABAB), embrassées (ABBA).",
      "Figures : anaphore, chiasme (ABBA), antithèse, oxymore, métaphore, personnification, hyperbole, litote.",
    ]),
    ("Mouvements et œuvres", [
      "Classicisme (XVIIe, règle des trois unités) : Corneille, Racine (Phèdre), Molière (L'Avare). Lumières : Voltaire (Candide).",
      "Romantisme : Hugo. Naturalisme : Zola (Germinal). Poésie : Baudelaire (Les Fleurs du mal). Surréalisme : André Breton.",
      "Négritude : Senghor, Césaire (Cahier d'un retour au pays natal), Damas ; David Diop (Coups de pilon).",
      "Roman africain : Kane (L'Aventure ambiguë), Kourouma (Les Soleils des indépendances), Sembène (Les Bouts de bois de Dieu), Oyono (Une vie de boy), Camara Laye (L'Enfant noir), Mariama Bâ, Aminata Sow Fall (La Grève des bàttu), Fatou Diome (Le Ventre de l'Atlantique).",
    ]),
  ],
  "tle-anglais": [
    ("Grammaire du BAC", [
      "Conditionnel : If + présent, will ; If + prétérit, would (If I were) ; If + past perfect, would have + participe. Inversion : Had I known = If I had known.",
      "Passif : be + participe passé. She is said to be rich.",
      "Discours indirect : He said (that) he was tired ; She asked me where I lived.",
      "Verbes + -ing : be used to, look forward to, suggest, despite. Make / let + base verbale ; had better + base verbale.",
      "Wish / It's high time / I'd rather + prétérit pour une situation présente.",
      "Liens logiques : although (concession), unless (si … ne … pas), so that (but), because (cause).",
    ]),
    ("Épreuve", [
      "Compréhension : lis les questions avant le texte, cite les lignes pour justifier.",
      "Essay : introduction, deux ou trois paragraphes avec exemples, conclusion. Mots de liaison : firstly, moreover, however, to conclude.",
    ]),
  ],
}
