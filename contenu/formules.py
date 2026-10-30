# Formulaire chapitre par chapitre, construit à partir des synthèses et des notions de cours (lignes qui contiennent
# une formule), complété à la main pour les chapitres dont le cours n'a pas de formule écrite.
import re

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


def formulaire(fiches, notions, programmes, main=None):
    """{matière: [{"p": indice du chapitre, "t": titre, "f": [formules]}]} pour les matières scientifiques et de gestion.
    main : formulaire écrit à la main (formulaire.py), un bloc par chapitre du programme, placé en tête de chaque chapitre."""
    main = main or {}
    out = {}
    for sid, prog in programmes.items():
        if not MATIERES.search(sid) or "annales" in sid:
            continue
        titres = [t for t, _ in prog]
        chs = []
        for i, t in enumerate(titres):
            a_la_main = list(main[sid][i]) if sid in main and i < len(main[sid]) else []
            lignes = a_la_main + [k for c in fiches.get(sid, []) if c.get("p") == i for k in c["cles"]]
            lignes += [k for n in notions.get(sid, []) if n["pch"] == i for k in n["enonce"]]
            lignes += PLUS.get(sid, {}).get(t, [])
            vus, f = set(), []
            for k in lignes:
                if (k in a_la_main or FORMULE.search(k)) and k not in vus:
                    vus.add(k)
                    f.append(k)
            if f:
                chs.append({"p": i, "t": t, "f": f})
        if chs:
            out[sid] = chs
    return out
