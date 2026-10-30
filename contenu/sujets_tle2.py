# Sujets types du BAC, série 2 (volume ×5) : un nouveau sujet complet par matière de terminale, corrigé pas à pas.
# Étapes : (question, bonne réponse, faux 1, faux 2, faux 3, explication) ; les 20 points sont répartis entre les étapes.

def P(title, context, steps):
    return {"title": title, "context": context, "steps": steps}

def noter(parts):
    """Répartit 20 points sur toutes les étapes, au quart de point, le plus également possible."""
    n = sum(len(p["steps"]) for p in parts)
    base = int(20 / n * 4) / 4
    extra = round((20 - base * n) / 0.25)
    out, k = [], 0
    for p in parts:
        steps = []
        for q, ok, a, b, c, e in p["steps"]:
            steps.append((q, [ok, a, b, c], 0, e, base + (0.25 if k < extra else 0)))
            k += 1
        out.append({"title": p["title"], "context": p["context"], "steps": steps})
    return out

TOUTES = ["Tle L", "Tle S", "Tle G"]
S = ["Tle S"]

def A(id_, subject, levels, series, duration, parts_desc):
    return {"id": id_, "exam": "BAC", "year": "type " + id_.rsplit("-", 1)[1], "series": series, "subject": subject, "levels": levels, "duration": duration, "modele": True, "parts": parts_desc}

ANNALES_T2 = [
  A("bac-type-philo-3", "Philosophie", TOUTES, "L, S et G", "4 h", ["Dissertation : « La technique libère-t-elle l'homme ? »"]),
  A("bac-type-fr-3", "Français", TOUTES, "L, S et G", "4 h", ["Dissertation littéraire : le roman africain et la société"]),
  A("bac-type-hg-2", "Histoire-Géographie", TOUTES, "L, S et G", "4 h", ["Histoire : l'Afrique du Sud de l'apartheid à la démocratie", "Géographie : la Chine, puissance émergente"]),
  A("bac-type-anglais-2", "Anglais", TOUTES, "L, S et G", "3 h", ["Reading comprehension : migration", "Language in use", "Writing"]),
  A("bac-type-espagnol-2", "Espagnol (LV2)", TOUTES, "L, S et G", "3 h", ["Comprensión : la emigración", "Gramática", "Expresión personal"]),
  A("bac-type-l-maths-2", "Mathématiques", ["Tle L"], "L1a, L1b, L2, L'", "2 h", ["Exercice : statistiques à deux variables", "Problème : fonction exponentielle"]),
  A("bac-type-g-maths-2", "Mathématiques", ["Tle G"], "G", "3 h", ["Exercice : probabilités et loi binomiale", "Problème : statistiques et prévision"]),
  A("bac-type-g-eco-2", "Économie", ["Tle G"], "G", "3 h", ["Connaissances", "Exercice : monnaie et budget de l'État", "Analyse : chômage des jeunes"]),
  A("bac-type-g-compta-2", "Techniques comptables", ["Tle G"], "G", "4 h", ["Dossier 1 : soldes intermédiaires", "Dossier 2 : cession d'immobilisation", "Dossier 3 : analyse du bilan"]),
  A("bac-type-s-maths-2", "Mathématiques", S, "S1, S2, S3, S4, S5", "4 h", ["Exercice : nombres complexes", "Exercice : probabilités", "Problème : fonction logarithme et intégrale"]),
  A("bac-type-s-pc-2", "Physique-Chimie", S, "S1, S2, S3, S4, S5", "4 h", ["Chimie : cinétique et pH", "Physique : mouvement dans un champ électrique, oscillateur"]),
  A("bac-type-s-svt-2", "SVT", S, "S1, S2, S3, S4, S5", "4 h", ["Maîtrise des connaissances : immunologie", "Compétences : régulation de la glycémie et génétique humaine"]),
]

GUIDED_T2 = {
  "bac-type-philo-3": noter([
    P("1. Analyser le sujet", "Sujet : « La technique libère-t-elle l'homme ? »", [
      ("La technique désigne :", "l'ensemble des procédés et outils pour transformer la nature", "seulement les ordinateurs", "la religion", "l'art", "Du grec technè : savoir-faire."),
      ("« Libérer » signifie ici :", "affranchir de contraintes (nature, travail, besoin)", "emprisonner", "enrichir uniquement", "punir", "Se libérer de quelque chose."),
      ("Le paradoxe du sujet :", "la technique affranchit de la nature mais peut créer de nouvelles dépendances", "la technique n'existe pas", "l'homme n'utilise pas d'outils", "la liberté est inutile", "Tension au cœur du sujet."),
      ("Problématique adaptée :", "La technique, qui affranchit l'homme des contraintes naturelles, ne l'asservit-elle pas à son tour ?", "Qui a inventé la roue ?", "Combien coûte un téléphone ?", "La technique est-elle récente ?", "Elle oppose deux réponses possibles."),
    ]),
    P("2. Bâtir le plan", "Thèse, antithèse, dépassement.", [
      ("Partie 1 : la technique libère car :", "elle réduit la peine du travail et protège des dangers naturels", "elle rend les hommes paresseux", "elle détruit la nature", "elle est chère", "Descartes : « nous rendre comme maîtres et possesseurs de la nature »."),
      ("Partie 2 : la technique asservit car :", "elle crée des dépendances et peut aliéner le travailleur", "elle est inutile", "elle n'existe pas", "elle rend toujours heureux", "Marx : le travailleur devient un appendice de la machine."),
      ("Un exemple actuel pour la partie 2 :", "la dépendance au téléphone et aux réseaux sociaux", "la charrue", "le feu de bois", "l'écriture", "Nouvelles formes d'aliénation."),
      ("Partie 3 : dépassement :", "la technique libère si l'homme en maîtrise les fins par la réflexion éthique", "il faut détruire toutes les machines", "la technique décide seule", "rien ne peut être fait", "Heidegger, Hans Jonas : principe responsabilité."),
    ]),
    P("3. Rédiger", "Introduction, transitions, conclusion.", [
      ("Une bonne amorce peut partir :", "d'un fait actuel comme l'essor de l'intelligence artificielle", "d'une définition du dictionnaire recopiée", "de la conclusion", "d'une blague", "Amener le sujet."),
      ("La conclusion doit :", "répondre clairement et ouvrir (par exemple sur la science)", "rester sans réponse", "répéter le sujet", "ajouter une partie", "Bilan et ouverture."),
      ("Référence utile sur la responsabilité face à la technique :", "Hans Jonas, Le Principe responsabilité", "Machiavel, Le Prince", "Pascal, Pensées", "Rousseau, Émile", "Éthique pour la civilisation technologique."),
    ]),
  ]),
  "bac-type-fr-3": noter([
    P("1. Comprendre le sujet", "Sujet : « Le roman africain n'est-il qu'un miroir de la société ? » Vous discuterez en vous appuyant sur des œuvres lues.", [
      ("Le mot clé « miroir » suggère que le roman :", "reflète fidèlement la réalité sociale", "invente un monde magique", "ne parle que de l'auteur", "est un poème", "Image du roman réaliste (Stendhal)."),
      ("« N'est-il que » invite à :", "nuancer : le roman fait aussi autre chose", "approuver totalement", "refuser de répondre", "résumer un roman", "Restriction à discuter."),
      ("Type de plan adapté :", "dialectique", "chronologique", "descriptif", "aucun", "Thèse puis nuance."),
    ]),
    P("2. Arguments et exemples", "Choisir des œuvres pertinentes.", [
      ("Un roman qui reflète une réalité sociale précise :", "Les Bouts de bois de Dieu (grève des cheminots)", "Les Fleurs du mal", "Le Cid", "Candide", "Sembène, 1960."),
      ("Un roman qui dénonce la condition de la femme :", "Une si longue lettre", "L'Enfant noir", "Ville cruelle", "L'Étranger", "Mariama Bâ, polygamie et caste."),
      ("Au-delà du miroir, le roman peut :", "dénoncer, éduquer et transformer la société", "seulement décorer", "rester neutre", "imiter l'Europe", "Fonction engagée."),
      ("Un roman qui interroge l'identité entre deux cultures :", "L'Aventure ambiguë", "Germinal", "Phèdre", "Les Misérables", "Samba Diallo."),
      ("Le roman est aussi une création esthétique :", "par son style, sa structure et son imaginaire", "seulement par son prix", "par sa couverture", "par sa longueur", "Pas un simple document."),
    ]),
    P("3. Rédiger", "Introduction et conclusion.", [
      ("L'introduction annonce :", "la problématique et le plan", "la note attendue", "la biographie complète de l'auteur", "un résumé des œuvres", "Amener, poser, annoncer."),
      ("Chaque exemple doit être :", "précis (titre, auteur, passage) et analysé", "vague", "inventé", "un film", "Preuve de lecture."),
    ]),
  ]),
  "bac-type-hg-2": noter([
    P("Histoire : l'Afrique du Sud", "Sujet : de l'apartheid à la démocratie (1948-1994).", [
      ("L'apartheid est instauré en :", "1948", "1912", "1960", "1990", "Victoire du Parti national."),
      ("Le Group Areas Act organise :", "la séparation des zones d'habitation selon la race", "le vote des Noirs", "l'indépendance", "la scolarité gratuite", "Ségrégation résidentielle."),
      ("Après Sharpeville (1960), l'ANC :", "est interdit et passe à la lutte armée", "arrive au pouvoir", "disparaît", "signe la paix", "Umkhonto we Sizwe."),
      ("La pression internationale contre l'apartheid prend la forme :", "de sanctions économiques et de boycotts sportifs", "d'une guerre mondiale", "d'aides militaires", "d'un soutien de l'ONU au régime", "Isolement du pays."),
      ("Le président qui négocie la fin de l'apartheid est :", "Frederik de Klerk", "Pieter Botha", "Thabo Mbeki", "Jacob Zuma", "Libère Mandela en 1990."),
      ("Les premières élections multiraciales ont lieu en :", "avril 1994", "1990", "1991", "1999", "Mandela président."),
    ]),
    P("Géographie : la Chine", "Sujet : la Chine, une puissance émergente.", [
      ("La Chine compte environ :", "1,4 milliard d'habitants", "400 millions", "800 millions", "3 milliards", "Deuxième ou premier pays le plus peuplé."),
      ("Les réformes d'ouverture sont lancées par :", "Deng Xiaoping", "Mao Zedong", "Xi Jinping", "Sun Yat-sen", "À partir de 1978."),
      ("Les ZES attirent :", "les investissements étrangers", "les touristes seulement", "les agriculteurs", "les armées", "Avantages fiscaux."),
      ("Un déséquilibre majeur du territoire chinois oppose :", "un littoral riche et un intérieur moins développé", "le nord et le sud égaux", "les villes vides et les campagnes pleines", "aucun déséquilibre", "Inégalités régionales."),
      ("Un défi de la Chine est :", "la pollution et le vieillissement de la population", "le manque d'usines", "l'absence de ports", "la faible population", "Coûts de la croissance."),
      ("La présence chinoise en Afrique se manifeste par :", "des infrastructures et des échanges commerciaux", "des colonies", "une monnaie commune", "l'absence de relations", "Routes, stades, ports."),
    ]),
  ]),
  "bac-type-anglais-2": noter([
    P("Reading comprehension", "Text (written for practice): \"Every year, thousands of young Africans try to reach Europe. Many risk their lives at sea. Moussa, 22, left his village after his father's farm failed because of drought. 'I wanted to help my family,' he explains. Today, he has returned home and started a small poultry business with the support of a local programme. He now employs three people.\"", [
      ("Why did Moussa leave his village?", "His father's farm failed because of drought.", "He wanted to study.", "He was on holiday.", "He hated his family.", "Cause stated in the text."),
      ("Moussa is now:", "back home and running a business", "in Europe", "a student", "unemployed", "He has returned home."),
      ("\"Drought\" means:", "a long period without rain", "a flood", "a festival", "a disease", "Sécheresse."),
      ("How many people does he employ?", "three", "twenty-two", "thousands", "none", "\"He now employs three people.\""),
      ("The main idea is:", "local opportunities can be an alternative to risky migration", "Europe is easy to reach", "farming is always profitable", "the sea is calm", "Message of the text."),
    ]),
    P("Language in use", "Grammar.", [
      ("Passive: \"A local programme supported him.\"", "He was supported by a local programme.", "He supported a local programme.", "He is support by a programme.", "A local programme was supported him.", "Past passive."),
      ("Reported: \"I wanted to help my family,\" he explained.", "He explained that he had wanted to help his family.", "He explained that I want to help my family.", "He explained he wants help.", "He explained to want help.", "Past → past perfect."),
      ("If it ___ more, the farm would not have failed.", "had rained", "rained", "rains", "would rain", "Third conditional."),
      ("He has been running his business ___ two years.", "for", "since", "during", "ago", "for + duration."),
    ]),
    P("Writing", "\"What can be done to reduce illegal migration among young Africans?\" (150 words)", [
      ("A relevant argument:", "creating jobs and training for young people", "closing all schools", "building more boats", "ignoring the problem", "Root causes."),
      ("A good connector to add an idea:", "Furthermore", "However", "Although", "Unless", "Addition."),
      ("A good conclusion starts with:", "To conclude,", "Firstly,", "For example,", "Once upon a time,", "Closing paragraph."),
    ]),
  ]),
  "bac-type-espagnol-2": noter([
    P("Comprensión del texto", "Texto (escrito para practicar): «Lucía salió de su pueblo de Bolivia para trabajar en España. Durante cinco años cuidó a ancianos en Madrid y envió dinero a sus hijos. Echaba de menos a su familia, pero quería que sus hijos estudiaran. Hoy ha vuelto y ha abierto una pequeña tienda.»", [
      ("¿De dónde es Lucía?", "De un pueblo de Bolivia", "De Madrid", "De México", "De Senegal", "Primera frase."),
      ("¿En qué trabajó en España?", "Cuidó a ancianos", "Fue profesora", "Trabajó en una tienda", "Fue médica", "«cuidó a ancianos»."),
      ("«Echaba de menos» significa:", "elle regrettait (son absence)", "elle oubliait", "elle détestait", "elle rencontrait", "Echar de menos = manquer."),
      ("¿Por qué envió dinero?", "Para que sus hijos estudiaran", "Para comprar un coche", "Para viajar", "Para pagar un hotel", "Objetivo."),
      ("Hoy Lucía:", "ha abierto una tienda en su país", "sigue en Madrid", "estudia en la universidad", "está en paro", "Final del texto."),
    ]),
    P("Gramática", "Ejercicios.", [
      ("«Quería que sus hijos ___»: forma correcta:", "estudiaran", "estudian", "estudien", "estudiarán", "Pasado → subjuntivo imperfecto."),
      ("Estilo indirecto: Lucía dijo: «Vuelvo a mi país».", "Lucía dijo que volvía a su país.", "Lucía dijo que vuelvo a mi país.", "Lucía dijo que volviera.", "Lucía dice volvía.", "Presente → imperfecto."),
      ("«Ha vuelto» está en:", "pretérito perfecto compuesto", "imperfecto", "futuro", "indefinido", "haber + participio."),
      ("Si Lucía ___ dinero, abriría otra tienda.", "tuviera", "tiene", "tendrá", "tenga", "Si + subjuntivo imperfecto."),
    ]),
    P("Expresión personal", "¿La emigración es una solución? (100 palabras)", [
      ("Para dar tu opinión:", "Creo que…", "Había una vez…", "Adiós…", "Hola…", "Opinión."),
      ("Para oponer:", "Sin embargo", "Además", "Por eso", "Primero", "Oposición."),
      ("Un buen argumento:", "la emigración separa a las familias", "la emigración no existe", "todos viajan gratis", "España está en África", "Argumento pertinente."),
    ]),
  ]),
  "bac-type-l-maths-2": noter([
    P("Exercice : statistiques à deux variables", "Ventes d'une boutique (en milliers de F) : mois xᵢ : 1, 2, 3, 4, 5 ; ventes yᵢ : 20, 24, 27, 33, 36.", [
      ("x̄ =", "3", "2,5", "15", "5", "15/5."),
      ("ȳ =", "28", "27", "140", "30", "140/5."),
      ("Méthode de Mayer avec G₁ (mois 1 et 2) et G₂ (mois 4 et 5) : G₁ =", "(1,5 ; 22)", "(1 ; 20)", "(2 ; 24)", "(1,5 ; 24)", "Moyennes."),
      ("G₂ =", "(4,5 ; 34,5)", "(4 ; 33)", "(5 ; 36)", "(4,5 ; 33)", "Moyennes."),
      ("Pente de (G₁G₂) :", "≈ 4,17", "4", "12,5", "3", "12,5/3."),
      ("Prévision pour le mois 8 (y ≈ 4,17x + 15,75) :", "≈ 49", "≈ 40", "≈ 33", "≈ 60", "4,17 × 8 + 15,75 ≈ 49,1."),
    ]),
    P("Problème : fonction exponentielle", "f(x) = (x − 1)eˣ sur ℝ.", [
      ("f'(x) =", "xeˣ", "eˣ", "(x − 1)eˣ", "(x + 1)eˣ", "(uv)' = eˣ + (x − 1)eˣ."),
      ("f est décroissante sur :", "]−∞ ; 0]", "[0 ; +∞[", "ℝ", "]−∞ ; 1]", "f'(x) a le signe de x."),
      ("Minimum de f :", "f(0) = −1", "f(1) = 0", "f(0) = 0", "f(−1) = −2/e", "(0 − 1)e⁰."),
      ("f(x) = 0 pour :", "x = 1", "x = 0", "x = e", "aucune valeur", "eˣ > 0."),
      ("Limite de f en +∞ :", "+∞", "0", "−∞", "1", "Produit de deux termes qui tendent vers +∞."),
      ("Limite de f en −∞ :", "0", "−∞", "+∞", "−1", "Croissance comparée : xeˣ → 0."),
    ]),
  ]),
  "bac-type-g-maths-2": noter([
    P("Exercice : probabilités", "Dans une entreprise, 20 % des factures comportent une erreur. On contrôle 5 factures au hasard (tirages indépendants). X = nombre de factures avec erreur.", [
      ("X suit une loi :", "binomiale B(5 ; 0,2)", "uniforme", "géométrique", "normale", "5 épreuves identiques et indépendantes."),
      ("E(X) =", "1", "0,2", "5", "2", "5 × 0,2."),
      ("P(X = 0) =", "0,32768", "0,2", "0,8", "0", "0,8⁵."),
      ("P(X ≥ 1) ≈", "0,672", "0,328", "0,2", "1", "1 − 0,328."),
      ("P(X = 1) ≈", "0,4096", "0,2", "0,08", "0,32768", "5 × 0,2 × 0,8⁴."),
    ]),
    P("Problème : statistiques et prévision", "Dépenses de publicité xᵢ (en millions) : 1, 2, 3, 4 ; chiffre d'affaires yᵢ : 10, 14, 15, 21.", [
      ("x̄ =", "2,5", "3", "10", "2", "10/4."),
      ("ȳ =", "15", "14,5", "60", "16", "60/4."),
      ("V(x) =", "1,25", "2,5", "7,5", "5", "(1 + 4 + 9 + 16)/4 − 6,25."),
      ("cov(x, y) =", "4,25", "3,5", "40,75", "17", "(10 + 28 + 45 + 84)/4 − 2,5 × 15 = 41,75 − 37,5."),
      ("a = cov/V(x) =", "3,4", "4,25", "1,25", "2", "4,25/1,25."),
      ("b = ȳ − a x̄ =", "6,5", "15", "8,5", "3,4", "15 − 8,5."),
      ("Prévision pour 6 millions de publicité :", "26,9", "21", "30", "40,5", "3,4 × 6 + 6,5."),
    ]),
  ]),
  "bac-type-g-eco-2": noter([
    P("Connaissances", "Questions de cours.", [
      ("La politique budgétaire est conduite par :", "le gouvernement (ministère des Finances)", "la BCEAO", "les banques commerciales", "les entreprises", "Budget de l'État."),
      ("La politique monétaire dans l'UEMOA est conduite par :", "la BCEAO", "chaque gouvernement", "le FMI", "la CEDEAO", "Politique commune."),
      ("Un emprunt obligataire est :", "un emprunt divisé en titres vendus au public", "un impôt", "une subvention", "un don", "Obligations."),
      ("Le budget de l'État comprend :", "des recettes et des dépenses", "seulement des recettes", "seulement des salaires", "les comptes des ménages", "Loi de finances."),
    ]),
    P("Exercice chiffré", "Taux de réserves obligatoires : 10 %. Une banque reçoit un dépôt de 50 millions. Budget de l'État : recettes 3 800 milliards, dépenses 4 180 milliards, PIB 19 000 milliards.", [
      ("Multiplicateur de crédit :", "10", "0,1", "5", "100", "1/0,1."),
      ("Dépôts maximum créés à partir des 50 millions :", "500 millions", "50 millions", "5 millions", "60 millions", "50 × 10."),
      ("Solde budgétaire :", "−380 milliards", "380 milliards", "−4 180 milliards", "0", "3 800 − 4 180."),
      ("Déficit en % du PIB :", "2 %", "3,8 %", "10 %", "0,2 %", "380/19 000."),
      ("Ce déficit respecte-t-il le critère UEMOA de 3 % ?", "oui", "non", "on ne peut pas savoir", "le critère n'existe pas", "2 % < 3 %."),
    ]),
    P("Analyse", "Le chômage des jeunes diplômés.", [
      ("Une cause du chômage des jeunes diplômés :", "l'inadéquation entre formations et besoins des entreprises", "trop d'emplois disponibles", "la baisse de la population", "la hausse des exportations", "Chômage structurel."),
      ("Une solution :", "développer la formation professionnelle et l'entrepreneuriat", "supprimer les diplômes", "fermer les universités", "interdire les entreprises", "Politique active."),
      ("Un effet du chômage des jeunes :", "l'émigration et la frustration sociale", "la hausse de l'épargne", "la hausse de la production", "la baisse de l'urbanisation", "Conséquences sociales."),
    ]),
  ]),
  "bac-type-g-compta-2": noter([
    P("Dossier 1 : soldes intermédiaires", "Ventes de marchandises 20 M ; coût d'achat des marchandises vendues 13 M ; autres consommations 2 M ; charges de personnel 2,5 M ; impôts et taxes 0,5 M.", [
      ("Marge commerciale :", "7 M", "13 M", "33 M", "5 M", "20 − 13."),
      ("Valeur ajoutée :", "5 M", "7 M", "2 M", "18 M", "7 − 2."),
      ("EBE :", "2 M", "5 M", "4,5 M", "3 M", "5 − 2,5 − 0,5."),
      ("Taux de marge commerciale sur ventes :", "35 %", "65 %", "7 %", "53,8 %", "7/20."),
    ]),
    P("Dossier 2 : cession d'immobilisation", "Une machine acquise 4 000 000 F, amortie à hauteur de 3 000 000 F, est vendue 1 500 000 F.", [
      ("VNC :", "1 000 000 F", "3 000 000 F", "4 000 000 F", "1 500 000 F", "4 − 3 millions."),
      ("Résultat de cession :", "plus-value de 500 000 F", "moins-value de 500 000 F", "2 500 000 F", "0", "1 500 000 − 1 000 000."),
      ("Le prix de cession s'enregistre au crédit du compte :", "82 (produits HAO)", "81", "701", "245", "Produit HAO."),
      ("La VNC s'enregistre au débit du compte :", "81 (valeurs comptables des cessions)", "82", "601", "28", "Charge HAO."),
    ]),
    P("Dossier 3 : analyse du bilan", "Capitaux propres 15 M ; dettes financières 5 M ; actif immobilisé 17 M ; actif circulant 8 M ; passif circulant 6 M.", [
      ("Ressources stables :", "20 M", "15 M", "26 M", "11 M", "15 + 5."),
      ("Fonds de roulement :", "3 M", "−3 M", "20 M", "8 M", "20 − 17."),
      ("BFR :", "2 M", "14 M", "−2 M", "8 M", "8 − 6."),
      ("Trésorerie nette :", "1 M", "5 M", "−1 M", "3 M", "3 − 2."),
      ("Autonomie financière (capitaux propres/dettes financières) :", "3", "0,33", "1", "20", "15/5 : l'entreprise est autonome."),
    ]),
  ]),
  "bac-type-s-maths-2": noter([
    P("Exercice 1 : nombres complexes", "On considère z₁ = 1 + i et z₂ = 1 − i√3.", [
      ("|z₁| =", "√2", "2", "1", "√3", "√(1 + 1)."),
      ("Un argument de z₁ :", "π/4", "π/2", "−π/4", "π/3", "Partie réelle = partie imaginaire > 0."),
      ("|z₂| =", "2", "4", "√3", "1", "√(1 + 3)."),
      ("Un argument de z₂ :", "−π/3", "π/3", "−π/6", "2π/3", "cos = 1/2, sin = −√3/2."),
      ("Module de z₁z₂ :", "2√2", "2", "√2", "4", "Produit des modules."),
      ("Argument de z₁z₂ :", "−π/12", "π/12", "7π/12", "−π/3", "π/4 − π/3."),
    ]),
    P("Exercice 2 : probabilités", "Une urne contient 3 boules blanches et 2 noires. On tire successivement 2 boules sans remise.", [
      ("P(2 blanches) =", "3/10", "9/25", "6/25", "1/2", "3/5 × 2/4."),
      ("P(2 noires) =", "1/10", "4/25", "2/5", "1/5", "2/5 × 1/4."),
      ("P(une de chaque couleur) =", "3/5", "1/2", "12/25", "2/5", "1 − 3/10 − 1/10."),
      ("X = nombre de blanches. E(X) =", "1,2", "1", "1,5", "0,6", "0 × 0,1 + 1 × 0,6 + 2 × 0,3."),
    ]),
    P("Problème : logarithme et intégrale", "f(x) = x − 1 − ln x sur ]0 ; +∞[.", [
      ("f'(x) =", "1 − 1/x", "1/x", "−1/x", "x − 1/x", "(x)' − (ln x)'."),
      ("Minimum de f :", "0, en x = 1", "1, en x = 0", "−1, en x = e", "e, en x = 1", "f(1) = 0."),
      ("On en déduit pour tout x > 0 :", "ln x ≤ x − 1", "ln x ≥ x", "ln x = x − 1", "ln x ≥ x − 1", "f(x) ≥ 0."),
      ("Une primitive de ln x est :", "x ln x − x", "1/x", "ln² x", "x ln x", "(x ln x − x)' = ln x."),
      ("∫ de 1 à e de ln x dx =", "1", "e", "e − 1", "0", "[x ln x − x] de 1 à e = 0 − (−1)."),
    ]),
  ]),
  "bac-type-s-pc-2": noter([
    P("Chimie", "On étudie la décomposition de l'eau oxygénée et une solution d'acide.", [
      ("La vitesse volumique de réaction est :", "la dérivée de l'avancement volumique par rapport au temps", "la concentration initiale", "la masse du produit", "le volume de la solution", "v = (1/V) dx/dt."),
      ("Le temps de demi-réaction est :", "le temps pour atteindre la moitié de l'avancement final", "la moitié de la durée totale", "le temps initial", "le temps de chauffage", "t½."),
      ("Un catalyseur :", "accélère la réaction sans être consommé", "change l'état final", "ralentit toujours", "est un réactif", "Ex. : ions fer III."),
      ("Le pH d'une solution d'acide fort de concentration 10⁻² mol/L :", "2", "12", "7", "0,01", "pH = −log C."),
      ("Le pH d'une solution de soude à 10⁻³ mol/L (25 °C) :", "11", "3", "7", "14", "pH = 14 + log C."),
      ("Un mélange d'acide faible et de sa base conjuguée en quantités égales est :", "une solution tampon de pH = pKa", "une solution neutre", "un acide fort", "une base forte", "Tampon."),
    ]),
    P("Physique", "Un électron entre dans un champ électrique uniforme ; puis on étudie un pendule élastique.", [
      ("La force électrique sur une charge q est :", "F = qE", "F = mg", "F = qvB", "F = kx", "Vecteur force électrique."),
      ("Sur un électron (q < 0), la force est :", "opposée au champ E", "dans le sens de E", "nulle", "perpendiculaire à E toujours", "Charge négative."),
      ("Dans le champ uniforme, la trajectoire d'un électron entré perpendiculairement à E est :", "une parabole", "une droite", "un cercle", "une hélice", "Mouvement analogue au projectile."),
      ("Période d'un pendule élastique :", "T₀ = 2π√(m/k)", "T₀ = 2π√(k/m)", "T₀ = 2π√(l/g)", "T₀ = m/k", "Oscillateur masse-ressort."),
      ("Avec m = 0,1 kg et k = 10 N/m, T₀ ≈", "0,63 s", "6,3 s", "1 s", "0,1 s", "2π√0,01 = 2π × 0,1."),
      ("L'énergie mécanique d'un oscillateur non amorti :", "se conserve", "diminue", "augmente", "est nulle", "Pas de frottement."),
    ]),
  ]),
  "bac-type-s-svt-2": noter([
    P("Maîtrise des connaissances : immunologie", "La réponse immunitaire adaptative.", [
      ("Les anticorps sont produits par :", "les plasmocytes", "les LT8", "les hématies", "les macrophages", "LB différenciés."),
      ("Les LT cytotoxiques détruisent :", "les cellules infectées", "les anticorps", "les globules rouges sains", "les bactéries libres uniquement", "Réponse cellulaire."),
      ("Les LT4 activent les LB et LT8 grâce à :", "l'interleukine-2", "l'insuline", "l'adrénaline", "l'hémoglobine", "Coopération cellulaire."),
      ("La réponse secondaire est plus rapide grâce aux :", "cellules mémoire", "globules rouges", "plaquettes", "neurones", "Base de la vaccination."),
    ]),
    P("Compétences : glycémie", "On mesure la glycémie d'une personne après un repas sucré : 1 g/L à jeun, 1,6 g/L 1 h après, retour à 1 g/L 3 h après.", [
      ("L'hormone responsable du retour à la normale est :", "l'insuline", "le glucagon", "l'adrénaline", "la thyroxine", "Hypoglycémiante."),
      ("Elle est sécrétée par :", "les cellules β des îlots de Langerhans", "les cellules α", "le foie", "la thyroïde", "Pancréas endocrine."),
      ("Elle agit en favorisant :", "le stockage du glucose en glycogène", "la libération de glucose par le foie", "la digestion", "la sécrétion de glucagon", "Glycogénogenèse."),
      ("Chez un diabétique de type 1, la glycémie après le repas :", "reste élevée longtemps", "baisse très vite", "reste à 1 g/L", "devient nulle", "Absence d'insuline."),
    ]),
    P("Compétences : génétique humaine", "Dans une famille, deux parents sains ont un fils atteint d'une maladie héréditaire. Seuls des garçons sont atteints dans l'arbre.", [
      ("L'allèle de la maladie est :", "récessif", "dominant", "codominant", "absent", "Parents sains, enfant atteint."),
      ("L'hypothèse la plus probable est :", "un gène porté par le chromosome X", "un gène autosomal dominant", "un gène sur le chromosome Y", "une infection", "Seuls des garçons atteints, transmis par la mère."),
      ("Le génotype de la mère est :", "XᴬXᵃ (conductrice)", "XᵃXᵃ", "XᴬXᴬ", "XᴬY", "Elle transmet l'allèle sans être malade."),
      ("Probabilité qu'un autre fils de ce couple soit atteint :", "1/2", "1/4", "0", "1", "La mère transmet Xᵃ une fois sur deux."),
    ]),
  ]),
}

for _a in ANNALES_T2:
    assert abs(sum(s[4] for p in GUIDED_T2[_a["id"]] for s in p["steps"]) - 20) < 1e-9, _a["id"]
