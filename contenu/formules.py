# Formulaire chapitre par chapitre, construit à partir des synthèses et des notions de cours (lignes qui contiennent
# une formule), complété à la main pour les chapitres dont le cours n'a pas de formule écrite.
import re
from formules_memo import MEMO

MATIERES = re.compile(r"maths|-pc|eco|compta|svt")
FORMULE = re.compile(r"[=≈≤≥×÷√²³ⁿ∑∫→⇌]|\b(ln|exp|cos|sin|tan)\b|\d\s*%")

# formules ajoutées pour les chapitres sans formule dans le cours : {matière: {titre exact du chapitre: [formules]}}
PLUS = {
  "6e-maths": {"Droites, angles et triangles": [
    "Somme des angles d'un triangle : Â + B̂ + Ĉ = 180°.",
    "Angle droit = 90° ; angle plat = 180° ; angle aigu < 90° < angle obtus < 180°.",
    "Triangle équilatéral : trois angles de 60°.",
    "Périmètre d'un triangle = a + b + c ; d'un carré = 4 × c ; d'un rectangle = 2 × (L + l).",
  ]},
  "4e-maths": {
    "Équations": [
      "Si a = b, alors a + c = b + c et a − c = b − c.",
      "Si a = b et c ≠ 0, alors a × c = b × c et a ÷ c = b ÷ c.",
      "ax + b = c ⟺ x = (c − b) ÷ a (a ≠ 0).",
      "Produit nul : A × B = 0 ⟺ A = 0 ou B = 0.",
    ],
    "Droite des milieux et cercle circonscrit": [
      "I milieu de [AB], J milieu de [AC] ⟹ (IJ) // (BC) et IJ = BC ÷ 2.",
      "I milieu de [AB] et (d) // (BC) passant par I ⟹ (d) coupe [AC] en son milieu.",
      "Triangle ABC rectangle en A ⟹ centre du cercle circonscrit = milieu de [BC], rayon = BC ÷ 2.",
      "Médiatrice : M sur la médiatrice de [AB] ⟺ MA = MB.",
    ],
  },
  "4e-pc": {
    "Le circuit électrique": [
      "Circuit série : I est la même partout ; U = U₁ + U₂ (loi d'additivité des tensions).",
      "Circuit en dérivation : U est la même aux bornes des branches ; I = I₁ + I₂ (loi des nœuds).",
      "Unités : intensité en ampères (A), tension en volts (V) ; 1 A = 1 000 mA.",
      "Ampèremètre branché en série ; voltmètre branché en dérivation.",
    ],
    "La propagation de la lumière": [
      "Vitesse de la lumière dans le vide : c ≈ 300 000 km/s = 3 × 10⁸ m/s.",
      "Distance parcourue : d = c × t.",
      "Année-lumière : 1 al ≈ 9,46 × 10¹² km.",
      "Propagation rectiligne dans un milieu transparent et homogène.",
    ],
  },
  "1ere-maths-g": {"Équations, inéquations et systèmes": [
    "Système { ax + by = c ; a'x + b'y = c' } : déterminant D = ab' − a'b ; si D ≠ 0, une solution unique.",
    "x = (cb' − c'b) ÷ D ; y = (ac' − a'c) ÷ D (méthode de Cramer).",
    "Substitution : exprimer x en fonction de y dans une équation, puis remplacer dans l'autre.",
    "Inéquation : multiplier ou diviser par un nombre négatif change le sens (−2x > 6 ⟺ x < −3).",
  ]},
  "g-compta": {"Le cadre comptable : SYSCOHADA": [
    "Équation du bilan : Actif = Passif (Ressources = Emplois).",
    "Résultat = Produits (classe 7) − Charges (classe 6).",
    "Capitaux propres = Capital + Réserves + Résultat.",
    "Classes : 1 ressources durables, 2 actif immobilisé, 3 stocks, 4 tiers, 5 trésorerie, 6 charges, 7 produits, 8 autres charges et produits.",
  ]},
}

# séries L et G : formulaire complet de chaque chapitre (même niveau de détail que la série S)
PLUS_LG = {
  "tle-maths-l": {
    "Fonctions : dérivée et variations": [
      "(xⁿ)' = n xⁿ⁻¹ ; (1/x)' = −1/x² ; (√x)' = 1/(2√x).",
      "(ku)' = k u' ; (uv)' = u'v + uv' ; (u/v)' = (u'v − uv')/v².",
      "(u²)' = 2u u' ; (1/u)' = −u'/u².",
      "f'(x) > 0 sur I ⟹ f croissante sur I ; f'(x) < 0 sur I ⟹ f décroissante sur I.",
      "f'(a) = 0 avec changement de signe ⟹ extremum local en a.",
      "Nombre dérivé : f'(a) = lim (f(a + h) − f(a))/h quand h → 0 = coefficient directeur de la tangente.",
      "Limites : en ±∞, un polynôme a la limite de son terme de plus haut degré.",
      "Asymptote verticale x = a si lim f(x) = ±∞ en a ; horizontale y = b si lim f(x) = b en ±∞.",
    ],
    "Suites arithmétiques et géométriques": [
      "Arithmétique : uₙ = uₚ + (n − p) r ; u₀ + u₁ + … + uₙ = (n + 1)(u₀ + uₙ)/2.",
      "Géométrique : uₙ = uₚ × qⁿ⁻ᵖ ; u₀ + … + uₙ = u₀ (1 − qⁿ⁺¹)/(1 − q), q ≠ 1.",
      "1 + 2 + … + n = n(n + 1)/2.",
      "Trois termes a, b, c consécutifs : arithmétiques ⟺ 2b = a + c ; géométriques ⟺ b² = ac.",
      "Sens de variation : uₙ₊₁ − uₙ > 0 ⟹ croissante ; arithmétique croissante si r > 0.",
      "Géométrique de premier terme > 0 : croissante si q > 1, décroissante si 0 < q < 1.",
      "Si 0 < q < 1 : qⁿ → 0 ; si q > 1 : qⁿ → +∞.",
      "Placement à t % par an : Cₙ = C₀ × (1 + t/100)ⁿ.",
    ],
    "Logarithme et exponentielle": [
      "(ln x)' = 1/x ; (ln u)' = u'/u ; (eˣ)' = eˣ ; (eᵘ)' = u' eᵘ.",
      "ln x < 0 si 0 < x < 1 ; ln x > 0 si x > 1 ; ln 2 ≈ 0,693 ; e ≈ 2,718.",
      "ln a = ln b ⟺ a = b ; ln a < ln b ⟺ a < b (a, b > 0).",
      "eᵃ = b ⟺ a = ln b (b > 0) ; eᵃ < eᵇ ⟺ a < b.",
      "lim ln x = +∞ en +∞ ; lim ln x = −∞ en 0⁺ ; lim eˣ = +∞ en +∞ ; lim eˣ = 0 en −∞.",
      "Croissances comparées : ln x/x → 0 et eˣ/x → +∞ quand x → +∞.",
      "eˣ/eʸ = eˣ⁻ʸ ; (eˣ)ⁿ = eⁿˣ ; e⁻ˣ = 1/eˣ.",
    ],
    "Dénombrement et probabilités": [
      "Principe multiplicatif : n₁ × n₂ × … choix successifs.",
      "Arrangements (ordre, sans répétition) : Aₙᵖ = n!/(n − p)!.",
      "Combinaisons (sans ordre) : Cₙᵖ = n!/(p!(n − p)!) ; Cₙ⁰ = Cₙⁿ = 1 ; Cₙᵖ = Cₙⁿ⁻ᵖ.",
      "p-listes (avec répétition, ordre) : nᵖ ; permutations : n! = 1 × 2 × … × n.",
      "Incompatibles : A ∩ B = ∅ ⟹ P(A ∪ B) = P(A) + P(B).",
      "Probabilité conditionnelle : P_B(A) = P(A ∩ B)/P(B).",
      "Indépendants : P(A ∩ B) = P(A) × P(B).",
      "Espérance d'une variable aléatoire : E(X) = Σ xᵢ pᵢ.",
    ],
    "Statistiques à deux variables": [
      "Point moyen G(x̄ ; ȳ) avec x̄ = (1/N)Σ xᵢ et ȳ = (1/N)Σ yᵢ.",
      "Variance V(x) = (1/N)Σ xᵢ² − x̄² ; écart type σ(x) = √V(x).",
      "Coefficient de corrélation r = cov(x, y)/(σ(x) σ(y)) ; −1 ≤ r ≤ 1.",
      "|r| proche de 1 (≥ 0,87) : bonne corrélation linéaire, ajustement justifié.",
      "Droite de régression de x en y : x = a'y + b' avec a' = cov(x, y)/V(y).",
      "Méthode de Mayer : G₁ et G₂ points moyens des deux moitiés ; la droite passe par G₁ et G₂.",
      "Estimation : on remplace x par la valeur voulue dans y = ax + b.",
    ],
  },
  "tle-maths-g": {
    "Intérêts composés": [
      "Valeur acquise : Cₙ = C₀ (1 + i)ⁿ (i = taux par période).",
      "Valeur actuelle : C₀ = Cₙ (1 + i)⁻ⁿ.",
      "Intérêt total : I = Cₙ − C₀.",
      "Durée : n = ln(Cₙ/C₀)/ln(1 + i).",
      "Taux : i = (Cₙ/C₀)^(1/n) − 1.",
      "Taux équivalents : (1 + iₐ) = (1 + iₘ)¹² (annuel / mensuel).",
      "Intérêts simples (rappel) : I = C × t × n/100 (n en années) ; I = C t j/36 000 (j en jours).",
    ],
    "Suites et annuités": [
      "Valeur acquise de n annuités constantes a : Vₙ = a × ((1 + i)ⁿ − 1)/i.",
      "Valeur actuelle de n annuités : V₀ = a × (1 − (1 + i)⁻ⁿ)/i.",
      "Annuité de remboursement d'un emprunt E : a = E × i/(1 − (1 + i)⁻ⁿ).",
      "Tableau d'amortissement : intérêt = capital restant × i ; amortissement = a − intérêt.",
      "Amortissements successifs en progression géométrique : Mₖ₊₁ = Mₖ (1 + i).",
      "Somme des amortissements = capital emprunté E.",
      "Suite géométrique : uₙ = u₀ qⁿ ; somme = u₀ (1 − qⁿ)/(1 − q).",
    ],
    "Fonctions économiques : coût, recette, bénéfice": [
      "Coût total CT(q) = coût fixe + coût variable ; coût moyen CM(q) = CT(q)/q.",
      "Coût marginal Cm(q) = CT'(q).",
      "Recette R(q) = p × q ; bénéfice B(q) = R(q) − CT(q).",
      "Bénéfice maximal quand B'(q) = 0, soit R'(q) = Cm(q).",
      "Seuil de rentabilité : B(q) = 0 (R = CT).",
      "Coût moyen minimal quand CM(q) = Cm(q).",
      "Élasticité de la demande : e = (Δq/q)/(Δp/p) ≈ p f'(p)/f(p).",
      "Offre et demande : prix d'équilibre quand offre(p) = demande(p).",
    ],
    "Statistiques à deux variables": [
      "Point moyen G(x̄ ; ȳ) ; V(x) = (1/N)Σ xᵢ² − x̄².",
      "cov(x, y) = (1/N)Σ xᵢyᵢ − x̄ȳ.",
      "r = cov(x, y)/(σ(x) σ(y)) ; ajustement valable si |r| ≥ 0,87.",
      "Méthode de Mayer : droite (G₁G₂) passant par les points moyens des deux moitiés.",
      "Prévision : y estimé = a × x + b.",
    ],
    "Probabilités": [
      "Cₙᵖ = n!/(p!(n − p)!) ; Aₙᵖ = n!/(n − p)!.",
      "P(A ∩ B) = P(A) × P_A(B) ; P_B(A) = P(A ∩ B)/P(B).",
      "Probabilités totales : P(B) = P(A) P_A(B) + P(Ā) P_Ā(B).",
      "E(X) = Σ xᵢ pᵢ ; V(X) = Σ xᵢ² pᵢ − E(X)².",
      "Loi binomiale : P(X = k) = Cₙᵏ pᵏ (1 − p)ⁿ⁻ᵏ ; E(X) = np ; V(X) = np(1 − p).",
    ],
  },
  "1ere-maths-l": {
    "Pourcentages et calcul numérique": [
      "Hausse de t % : multiplier par (1 + t/100) ; baisse de t % : multiplier par (1 − t/100).",
      "Taux réciproque : retrouver la valeur initiale en divisant par le coefficient.",
      "Proportion : p = partie/total ; pourcentage de pourcentage : p × p'.",
      "Puissances : aᵐ × aⁿ = aᵐ⁺ⁿ ; aᵐ/aⁿ = aᵐ⁻ⁿ ; (aᵐ)ⁿ = aᵐⁿ.",
      "Écriture scientifique : a × 10ⁿ avec 1 ≤ a < 10.",
    ],
    "Équations et inéquations": [
      "Somme des racines x₁ + x₂ = −b/a ; produit x₁x₂ = c/a.",
      "Factorisation : ax² + bx + c = a(x − x₁)(x − x₂) si Δ > 0.",
      "Signe de ax² + bx + c : signe de a à l'extérieur des racines, signe contraire entre.",
      "Signe de ax + b : signe de a à droite de −b/a.",
      "Système 2×2 : substitution ou combinaison ; D = ab' − a'b ≠ 0 ⟹ une solution.",
    ],
    "Fonctions et représentations graphiques": [
      "Coefficient directeur a = (yB − yA)/(xB − xA).",
      "f(x) = ax² + bx + c : sommet d'abscisse −b/(2a) ; tournée vers le haut si a > 0.",
      "Ensemble de définition : dénominateur ≠ 0 ; sous une racine ≥ 0.",
      "Point A(x ; y) sur la courbe ⟺ y = f(x).",
      "Dérivée : (ax + b)' = a ; (x²)' = 2x ; f'(a) = pente de la tangente en a.",
    ],
    "Suites numériques": [
      "Géométrique : somme = premier terme × (1 − qⁿ)/(1 − q), n termes.",
      "Arithmétique : uₙ = uₚ + (n − p)r ; géométrique : uₙ = uₚ × qⁿ⁻ᵖ.",
      "Croissante si uₙ₊₁ − uₙ > 0 ; décroissante si uₙ₊₁ − uₙ < 0.",
      "Nombre de termes de uₚ à uₙ : n − p + 1.",
    ],
    "Statistiques": [
      "Moyenne pondérée x̄ = (Σ nᵢxᵢ)/N ; avec classes, xᵢ = centre de classe.",
      "Variance V = (Σ nᵢxᵢ²)/N − x̄² ; écart type σ = √V.",
      "Médiane : valeur qui partage l'effectif en deux moitiés (effectifs cumulés N/2).",
      "Mode : valeur (ou classe) d'effectif maximal.",
      "Fréquence en % = effectif × 100/N ; Σ fréquences = 100 %.",
    ],
  },
  "1ere-maths-g": {
    "Pourcentages et proportionnalité": [
      "Prix TTC = HT × (1 + taux TVA) ; TVA au Sénégal : 18 %.",
      "Prix de vente = prix d'achat + marge ; taux de marque = marge/prix de vente.",
      "Taux de marge = marge/prix d'achat × 100.",
      "Remise de r % : net = brut × (1 − r/100) ; remises successives : on multiplie.",
      "Partage proportionnel : part = total × coefficient/somme des coefficients.",
    ],
    "Intérêts simples": [
      "I = C × t × n/100 (n en années) ; I = C t m/1 200 (m en mois) ; I = C t j/36 000 (j en jours).",
      "Valeur acquise A = C + I.",
      "Escompte commercial : e = V t j/36 000 ; valeur actuelle = V − e.",
      "Taux moyen de plusieurs placements : t = Σ Cᵢtᵢjᵢ/Σ Cᵢjᵢ.",
      "Échéance commune : effets équivalents à la même date ont la même valeur actuelle.",
    ],
    "Équations, inéquations et systèmes": [
      "Second degré : Δ = b² − 4ac ; racines (−b ± √Δ)/(2a).",
      "Signe d'un trinôme : signe de a sauf entre les racines.",
      "Programmation linéaire : contraintes = inéquations, solution à un sommet de la zone.",
    ],
    "Fonctions affines et du second degré": [
      "Affine f(x) = ax + b : a = (f(x₂) − f(x₁))/(x₂ − x₁).",
      "Second degré : sommet S(−b/(2a) ; f(−b/(2a))) ; maximum si a < 0.",
      "Recette R = p × q ; coût C = coût fixe + coût unitaire × q ; bénéfice = R − C.",
      "Seuil de rentabilité : R(q) = C(q).",
    ],
    "Statistiques": [
      "Moyenne x̄ = Σ nᵢxᵢ/N ; variance V = Σ nᵢxᵢ²/N − x̄² ; σ = √V.",
      "Médiane par les effectifs cumulés (N/2) ; quartiles Q₁ (N/4) et Q₃ (3N/4).",
      "Indice simple : I = (valeur/valeur de base) × 100.",
      "Coefficient de variation : σ/x̄.",
    ],
  },
  "g-eco": {
    "Les secteurs d'activité et les entreprises": [
      "Chiffre d'affaires = prix de vente × quantités vendues.",
      "Valeur ajoutée = production − consommations intermédiaires.",
      "Productivité du travail = production/nombre de travailleurs (ou d'heures).",
      "Part d'un secteur (%) = VA du secteur/PIB × 100.",
    ],
    "La monnaie et la banque centrale": [
      "Masse monétaire M2 = M1 (billets, pièces, dépôts à vue) + dépôts à terme.",
      "Équation quantitative : M × V = P × T (Fisher).",
      "Multiplicateur de crédit k = 1/r (r = taux de réserves obligatoires).",
      "Intérêt bancaire : I = capital × taux × durée.",
      "Parité fixe : 1 € = 655,957 F CFA (BCEAO, UEMOA).",
    ],
  },
  "g-compta": {
    "Les comptes et la partie double": [
      "Partie double : total des débits = total des crédits pour chaque opération.",
      "Solde = total débit − total crédit (solde débiteur si > 0, créditeur si < 0).",
      "Comptes d'actif et de charges : augmentent au débit ; passif et produits : au crédit.",
      "Achat de marchandises : débit 601 et 445 (TVA), crédit 401 ou 52/57.",
    ],
    "Le bilan": [
      "Fonds de roulement = ressources stables − actif immobilisé.",
      "Besoin en fonds de roulement = actif circulant − passif circulant.",
      "Trésorerie nette = FR − BFR.",
    ],
  },
}
for _sid, _chs in PLUS_LG.items():
    for _t, _f in _chs.items():
        PLUS.setdefault(_sid, {}).setdefault(_t, []).extend(_f)



def _cle(k):
    """Clé de comparaison : sans espaces, ponctuation ni majuscules (« a = b. » et « A=b » sont la même ligne)."""
    return re.sub(r"[\s.,;:!?…'’\"«»_\-–—]|annuel|mensuel|ₐ|ₘ", "", k.lower())


def formulaire(fiches, notions, programmes, main=None):
    """{matière: [{"p": indice du chapitre, "t": titre, "f": [lignes]}]} : formules des matières scientifiques et de gestion,
    repères à retenir (formules_memo.py) des matières littéraires et de la SVT.
    main : formulaire écrit à la main (formulaire.py), un bloc par chapitre du programme, placé en tête de chaque chapitre."""
    main = main or {}
    out = {}
    for sid, prog in programmes.items():
        if (not MATIERES.search(sid) and sid not in MEMO and sid not in main) or "annales" in sid:
            continue
        titres = [t for t, _ in prog]
        chs = []
        for i, t in enumerate(titres):
            a_la_main = list(main[sid][i]) if sid in main and i < len(main[sid]) else []
            lignes = a_la_main + ([k for c in fiches.get(sid, []) if c.get("p") == i for k in c["cles"]] if MATIERES.search(sid) else [])
            lignes += [k for n in notions.get(sid, []) if n["pch"] == i for k in n["enonce"]]
            lignes += PLUS.get(sid, {}).get(t, [])
            memo = MEMO.get(sid, {}).get(t, [])
            vus, f = set(), []
            for k in lignes + memo:
                if not (k in a_la_main or k in memo or FORMULE.search(k)):
                    continue
                # même ligne écrite deux fois (espaces, ponctuation, intitulé ou précision entre parenthèses) : gardée une fois
                cles = {_cle(k)}
                if FORMULE.search(k):
                    cles.add("=" + _cle(re.sub(r"\s*\([^()]*\)\.?$", "", k.split(" : ", 1)[-1])))
                if cles & vus:
                    continue
                vus |= cles
                f.append(k)
            if f:
                chs.append({"p": i, "t": t, "f": f})
        if chs:
            out[sid] = chs
    return out
