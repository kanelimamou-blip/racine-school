# Sujets types du BAC, série 3 : un nouveau sujet complet par matière de terminale, corrigé pas à pas.
from sujets_tle2 import P, noter, A, TOUTES, S

ANNALES_T3 = [
  A("bac-type-philo-4", "Philosophie", TOUTES, "L, S et G", "4 h", ["Dissertation : « Le travail n'est-il qu'une contrainte ? »"]),
  A("bac-type-fr-4", "Français", TOUTES, "L, S et G", "4 h", ["Commentaire d'un extrait de roman sur l'école"]),
  A("bac-type-hg-3", "Histoire-Géographie", TOUTES, "L, S et G", "4 h", ["Histoire : la guerre froide (1947-1991)", "Géographie : les États-Unis, première puissance mondiale"]),
  A("bac-type-anglais-3", "Anglais", TOUTES, "L, S et G", "3 h", ["Reading : women and education", "Language in use", "Writing"]),
  A("bac-type-espagnol-3", "Espagnol (LV2)", TOUTES, "L, S et G", "3 h", ["Comprensión : el medio ambiente", "Gramática", "Expresión"]),
  A("bac-type-l-maths-3", "Mathématiques", ["Tle L"], "L1a, L1b, L2, L'", "2 h", ["Exercice : suites et placement", "Problème : fonction rationnelle"]),
  A("bac-type-g-maths-3", "Mathématiques", ["Tle G"], "G", "3 h", ["Exercice : emprunt et tableau d'amortissement", "Problème : optimisation du bénéfice"]),
  A("bac-type-g-eco-3", "Économie", ["Tle G"], "G", "3 h", ["Connaissances", "Exercice : commerce extérieur", "Analyse : intégration régionale"]),
  A("bac-type-g-compta-3", "Techniques comptables", ["Tle G"], "G", "4 h", ["Dossier 1 : opérations courantes", "Dossier 2 : amortissement dégressif", "Dossier 3 : travaux de fin d'exercice"]),
  A("bac-type-s-maths-3", "Mathématiques", S, "S1, S2, S3, S4, S5", "4 h", ["Exercice : suites et récurrence", "Exercice : géométrie dans l'espace", "Problème : équation différentielle et étude de fonction"]),
  A("bac-type-s-pc-3", "Physique-Chimie", S, "S1, S2, S3, S4, S5", "4 h", ["Chimie : alcools et dosage", "Physique : chute verticale, induction, ondes"]),
  A("bac-type-s-svt-3", "SVT", S, "S1, S2, S3, S4, S5", "4 h", ["Maîtrise des connaissances : message nerveux", "Compétences : reproduction et expression génétique"]),
]

GUIDED_T3 = {
  "bac-type-philo-4": noter([
    P("1. Analyser le sujet", "Sujet : « Le travail n'est-il qu'une contrainte ? »", [
      ("Le travail désigne :", "l'activité par laquelle l'homme transforme la nature pour satisfaire ses besoins", "le repos", "le jeu", "le sommeil", "Définition générale."),
      ("« N'est-il qu'une » suggère que le travail est d'abord vu comme :", "une contrainte, mais peut-être pas seulement", "un plaisir pur", "une invention récente", "une maladie", "Restriction à discuter."),
      ("Étymologie souvent rappelée :", "tripalium, instrument de torture", "travail = voyage", "labor = joie", "ergon = argent", "Image du travail pénible."),
      ("Problématique :", "Le travail est-il seulement subi, ou peut-il être un moyen de réalisation de soi ?", "Combien gagne un ouvrier ?", "Le travail existe-t-il ?", "Faut-il travailler le dimanche ?", "Deux réponses opposées."),
    ]),
    P("2. Plan et références", "Construire la discussion.", [
      ("Partie 1, le travail comme contrainte :", "nécessité vitale, effort, fatigue, aliénation", "loisir choisi", "art pur", "jeu d'enfant", "Besoin et peine."),
      ("Référence pour l'aliénation :", "Marx : le travailleur est dépossédé de son œuvre", "Descartes : cogito", "Platon : la caverne", "Pascal : le roseau", "Manuscrits de 1844."),
      ("Partie 2, le travail libère et humanise :", "Hegel : l'esclave se forme et se libère par le travail", "Hobbes : guerre de tous", "Freud : inconscient", "Épicure : ataraxie", "Dialectique du maître et de l'esclave."),
      ("Autre argument de la partie 2 :", "le travail donne une place sociale et une dignité", "le travail rend malade toujours", "le travail est inutile", "le travail est interdit", "Reconnaissance."),
      ("Dépassement possible :", "tout dépend des conditions du travail : choisi et juste, il épanouit", "il faut supprimer le travail", "le travail est toujours un esclavage", "le salaire suffit à tout", "Nuance."),
    ]),
    P("3. Rédiger", "Introduction et conclusion.", [
      ("Une amorce pertinente :", "le chômage des jeunes, qui montre que le travail est aussi recherché", "une recette de cuisine", "un match de football", "la date du BAC", "Lien avec l'actualité."),
      ("La conclusion doit :", "trancher de façon nuancée et ouvrir", "rester muette", "répéter l'introduction", "ajouter un nouvel auteur sans lien", "Réponse claire."),
    ]),
  ]),
  "bac-type-fr-4": noter([
    P("1. Comprendre l'extrait", "Extrait (rédigé pour l'entraînement) : « Chaque matin, Ndèye marchait vers l'école en serrant son cahier comme un trésor. Sa mère avait vendu ses bijoux pour payer la fourniture. Dans la classe surpeuplée, elle écoutait le maître avec une attention farouche : apprendre, c'était pour elle ouvrir une porte que la pauvreté avait voulu fermer. »", [
      ("Le genre de ce texte :", "un récit romanesque", "un poème versifié", "une pièce de théâtre", "un article de presse", "Narration à la 3e personne, personnage."),
      ("Le thème principal :", "l'école comme moyen d'échapper à la pauvreté", "la vie au marché", "un voyage", "la guerre", "Idée centrale."),
      ("« serrant son cahier comme un trésor » est :", "une comparaison", "une métaphore", "une litote", "une hyperbole", "Outil « comme »."),
      ("« ouvrir une porte que la pauvreté avait voulu fermer » contient :", "une métaphore et une personnification", "une litote", "une anaphore", "une antiphrase", "La pauvreté agit comme une personne."),
      ("Le sacrifice de la mère montre :", "la valeur accordée à l'éducation par la famille", "l'indifférence de la famille", "la richesse de la famille", "le refus de l'école", "Vendre ses bijoux."),
    ]),
    P("2. Construire le commentaire", "Deux axes de lecture.", [
      ("Axe 1 possible :", "Le portrait d'une élève déterminée", "La biographie de l'auteur", "Le résumé de l'histoire", "Les fautes d'orthographe", "Axe interprétatif."),
      ("Axe 2 possible :", "Une réflexion sur l'école et les inégalités", "La description du marché", "Le style télégraphique", "Les rimes", "Portée sociale."),
      ("« attention farouche » montre :", "une volonté intense d'apprendre", "la peur du maître", "l'ennui", "la colère contre l'école", "Adjectif fort."),
      ("« classe surpeuplée » évoque :", "les difficultés matérielles de l'école", "une fête", "le confort", "un examen", "Réalité sociale."),
      ("La conclusion du commentaire peut ouvrir sur :", "un autre roman sur l'école, comme L'Enfant noir", "un film d'action", "une recette", "une règle de grammaire", "Rapprochement d'œuvres."),
    ]),
  ]),
  "bac-type-hg-3": noter([
    P("Histoire : la guerre froide", "Sujet : la guerre froide, de la doctrine Truman à la disparition de l'URSS.", [
      ("Les deux idéologies opposées :", "capitalisme libéral et communisme", "monarchie et république", "christianisme et islam", "colonialisme et féodalité", "Bloc de l'Ouest et bloc de l'Est."),
      ("La première grande crise de la guerre froide :", "le blocus de Berlin (1948-1949)", "la crise de Cuba", "l'Afghanistan", "le printemps de Prague", "Premier affrontement indirect."),
      ("La crise la plus dangereuse (risque nucléaire) :", "Cuba, 1962", "Corée, 1950", "Berlin, 1961", "Budapest, 1956", "Treize jours d'octobre."),
      ("Un exemple de guerre « chaude » périphérique :", "le Vietnam", "la Seconde Guerre mondiale", "la guerre de 1870", "la guerre de Cent Ans", "Affrontement indirect."),
      ("La fin de la guerre froide s'explique notamment par :", "l'épuisement économique de l'URSS et les réformes de Gorbatchev", "la victoire militaire de l'URSS", "la disparition des États-Unis", "un traité de 1950", "Effondrement du bloc de l'Est."),
      ("Plan adapté à ce sujet :", "chronologique (naissance, évolution, fin)", "thématique sans dates", "un seul paragraphe", "un résumé de cours", "Sujet sur une période."),
    ]),
    P("Géographie : les États-Unis", "Sujet : les fondements de la puissance des États-Unis.", [
      ("Une force naturelle des États-Unis :", "un vaste territoire riche en ressources", "un territoire minuscule", "l'absence d'eau", "un climat uniquement polaire", "Ressources agricoles et minières."),
      ("Une force économique :", "les FTN et l'innovation (Silicon Valley)", "l'absence d'entreprises", "le troc", "une monnaie faible", "Google, Apple…"),
      ("Une force culturelle (soft power) :", "Hollywood, les universités, internet", "l'isolement", "l'absence de médias", "le refus des étrangers", "Influence mondiale."),
      ("Une force militaire :", "le premier budget militaire du monde", "aucune armée", "une armée réservée à l'Afrique", "seulement une marine", "Présence mondiale."),
      ("Une limite de la puissance américaine :", "la concurrence de la Chine et les inégalités internes", "l'absence de technologie", "l'absence d'agriculture", "un territoire vide", "Défis actuels."),
      ("La façade la plus dynamique du territoire :", "les littoraux (Nord-Est, Californie, Golfe)", "les Rocheuses seules", "l'Alaska seul", "le centre désertique", "Interfaces."),
    ]),
  ]),
  "bac-type-anglais-3": noter([
    P("Reading comprehension", "Text (written for practice): \"In many rural areas, girls still leave school early. Some must help at home; others marry young. Yet studies show that each extra year of schooling increases a woman's future income. Awa, 19, is the first girl in her village to pass the baccalauréat. She wants to become an engineer and encourages younger girls to keep studying.\"", [
      ("Why do some girls leave school early?", "To help at home or because they marry young", "Because schools are free", "Because they are engineers", "Because they passed the bac", "Two reasons given."),
      ("What does each extra year of schooling do?", "It increases a woman's future income.", "It reduces income.", "It has no effect.", "It causes early marriage.", "Studies show…"),
      ("Awa is:", "the first girl in her village to pass the bac", "a teacher", "married", "an engineer already", "Stated in the text."),
      ("\"Yet\" in the text expresses:", "contrast", "cause", "time", "addition", "Yet = however."),
      ("Find a word meaning \"salary, money earned\":", "income", "school", "village", "engineer", "Income."),
    ]),
    P("Language in use", "Grammar.", [
      ("If girls ___ in school longer, they would earn more.", "stayed", "stay", "will stay", "had stay", "Second conditional."),
      ("Awa, ___ wants to be an engineer, encourages others.", "who", "which", "whose", "where", "Person, non-defining."),
      ("Passive: \"The village celebrated her success.\"", "Her success was celebrated by the village.", "Her success celebrated the village.", "Her success is celebrate.", "The village was celebrated.", "Past passive."),
      ("She is the first girl ___ the bac in her village.", "to pass", "passing", "pass", "passed", "the first + to."),
    ]),
    P("Writing", "\"Why is girls' education important for development?\" (150 words)", [
      ("A strong argument:", "educated women improve family health and income", "girls do not need school", "school is too expensive for everyone", "development needs fewer teachers", "Relevant idea."),
      ("A useful example:", "Awa, who inspires other girls in her village", "a football match", "a pop song", "a weather report", "Concrete example."),
      ("Good closing phrase:", "In conclusion, educating girls benefits the whole society.", "Hello everybody.", "The end.", "Once upon a time.", "Clear conclusion."),
    ]),
  ]),
  "bac-type-espagnol-3": noter([
    P("Comprensión del texto", "Texto: «En muchas ciudades de América Latina, la contaminación del aire es un problema grave. Los jóvenes organizan campañas para plantar árboles y usar la bicicleta. —Si cada uno hiciera un pequeño esfuerzo, el planeta respiraría mejor—, dice Ana, estudiante de 17 años.»", [
      ("¿Cuál es el problema?", "la contaminación del aire", "el paro", "la emigración", "la sequía", "Primera frase."),
      ("¿Qué hacen los jóvenes?", "plantan árboles y usan la bicicleta", "compran coches", "emigran", "construyen fábricas", "Campañas."),
      ("¿Quién es Ana?", "una estudiante de 17 años", "una profesora", "una alcaldesa", "una médica", "Presentación."),
      ("La frase de Ana expresa:", "una hipótesis", "una orden", "una pregunta", "un recuerdo", "Si + subjuntivo imperfecto."),
    ]),
    P("Gramática", "Ejercicios.", [
      ("Si cada uno ___ (hacer) un esfuerzo…", "hiciera", "hace", "haga", "hará", "Subjuntivo imperfecto."),
      ("… el planeta ___ (respirar) mejor.", "respiraría", "respira", "respire", "respiró", "Condicional."),
      ("Es importante que los jóvenes ___ árboles.", "planten", "plantan", "plantaran", "plantarán", "Expresión impersonal + subjuntivo presente."),
      ("Estilo indirecto: Ana dijo que el planeta ___ mejor.", "respiraría", "respirará", "respira", "respire", "Se mantiene el condicional."),
      ("«Los árboles son plantados por los jóvenes» es:", "voz pasiva", "voz activa", "imperativo", "subjuntivo", "ser + participio + por."),
    ]),
    P("Expresión", "¿Qué puedes hacer tú para proteger el medio ambiente?", [
      ("Una buena idea:", "reciclar y ahorrar agua", "tirar basura en la calle", "usar más plástico", "quemar neumáticos", "Acción concreta."),
      ("Para concluir:", "En resumen,", "Primero,", "Además,", "Por ejemplo,", "Conclusión."),
      ("Para expresar obligación:", "Hay que…", "Había una vez…", "Ojalá…", "Quizás ayer…", "Hay que + infinitivo."),
    ]),
  ]),
  "bac-type-l-maths-3": noter([
    P("Exercice : suites et placement", "Awa place 100 000 F à 6 % par an (intérêts composés). Moussa place 100 000 F et ajoute 8 000 F chaque année (sans intérêts). On note aₙ et mₙ leurs capitaux après n années.", [
      ("La suite (aₙ) est :", "géométrique de raison 1,06", "arithmétique de raison 6", "arithmétique de raison 6 000", "géométrique de raison 0,06", "×1,06 chaque année."),
      ("La suite (mₙ) est :", "arithmétique de raison 8 000", "géométrique de raison 8", "constante", "géométrique de raison 1,08", "+8 000 chaque année."),
      ("a₁₀ ≈", "179 085 F", "160 000 F", "106 000 F", "190 000 F", "100 000 × 1,06¹⁰."),
      ("m₁₀ =", "180 000 F", "108 000 F", "179 085 F", "800 000 F", "100 000 + 10 × 8 000."),
      ("Au bout de 15 ans, qui a le plus ?", "Awa (≈ 239 656 F contre 220 000 F)", "Moussa", "égalité", "aucun", "La croissance géométrique finit par dépasser."),
    ]),
    P("Problème : fonction rationnelle", "f(x) = (2x + 3)/(x + 1) pour x ≠ −1.", [
      ("Limite de f en +∞ :", "2", "3", "+∞", "0", "2x/x."),
      ("Asymptote horizontale :", "y = 2", "y = 3", "x = −1", "y = 0", "Limite en ±∞."),
      ("Asymptote verticale :", "x = −1", "x = 2", "y = −1", "x = −3/2", "Dénominateur nul."),
      ("f'(x) =", "−1/(x + 1)²", "1/(x + 1)²", "2/(x + 1)²", "5/(x + 1)²", "(2(x + 1) − (2x + 3))/(x + 1)²."),
      ("f est :", "décroissante sur chaque intervalle de son domaine", "croissante sur ℝ", "constante", "croissante puis décroissante", "f'(x) < 0."),
      ("f(0) =", "3", "2", "0", "−3", "3/1."),
      ("f(x) = 0 pour :", "x = −3/2", "x = −1", "x = 3/2", "x = 0", "2x + 3 = 0."),
    ]),
  ]),
  "bac-type-g-maths-3": noter([
    P("Exercice : emprunt", "Emprunt de 3 000 000 F, taux 10 %, remboursé par 3 annuités constantes.", [
      ("Annuité a ≈", "1 206 344 F", "1 000 000 F", "1 100 000 F", "1 331 000 F", "3 000 000 × 0,1/(1 − 1,1⁻³)."),
      ("Intérêt 1re année :", "300 000 F", "120 634 F", "100 000 F", "1 206 344 F", "3 000 000 × 0,1."),
      ("Amortissement 1 ≈", "906 344 F", "1 000 000 F", "300 000 F", "1 206 344 F", "a − 300 000."),
      ("Capital restant dû après 1 an ≈", "2 093 656 F", "2 000 000 F", "1 793 656 F", "2 700 000 F", "3 000 000 − 906 344."),
      ("Amortissement 2 ≈", "996 978 F", "906 344 F", "1 096 676 F", "209 366 F", "906 344 × 1,1."),
      ("Coût total du crédit ≈", "619 032 F", "900 000 F", "300 000 F", "3 619 032 F", "3a − 3 000 000."),
    ]),
    P("Problème : optimisation", "Une coopérative vend des sacs de mil. Prix unitaire p (en milliers de F) et demande q = 100 − 2p. Coût total CT(q) = 10q + 200.", [
      ("Recette en fonction de p : R(p) =", "p(100 − 2p) = 100p − 2p²", "100p", "2p²", "p + 100", "R = p × q."),
      ("R est maximale pour p =", "25", "50", "10", "100", "R'(p) = 100 − 4p = 0."),
      ("Recette maximale :", "1 250", "2 500", "625", "5 000", "100 × 25 − 2 × 625."),
      ("Exprimer q en fonction de p puis B(p) = R − CT :", "−2p² + 120p − 1 200", "−2p² + 100p − 200", "100p − 200", "−2p² + 80p", "CT = 10(100 − 2p) + 200 = 1 200 − 20p."),
      ("B est maximal pour p =", "30", "25", "60", "20", "B'(p) = −4p + 120 = 0."),
      ("Bénéfice maximal :", "600", "1 200", "1 800", "300", "−1 800 + 3 600 − 1 200."),
    ]),
  ]),
  "bac-type-g-eco-3": noter([
    P("Connaissances", "Questions de cours.", [
      ("Le libre-échange est défendu notamment par :", "Ricardo", "List", "Marx", "Keynes", "Avantages comparatifs."),
      ("Un droit de douane est :", "une taxe sur les importations", "une subvention", "un salaire", "une monnaie", "Protectionnisme tarifaire."),
      ("La CEDEAO vise notamment :", "la libre circulation des personnes et des biens", "une armée unique mondiale", "la fin des échanges", "la colonisation", "Intégration régionale."),
      ("Le tarif extérieur commun de la CEDEAO date de :", "2015", "1960", "1975", "2030", "TEC CEDEAO."),
    ]),
    P("Exercice : commerce extérieur", "Exportations : 2 800 milliards ; importations : 4 200 milliards. Indice des prix à l'export : 105 ; à l'import : 120.", [
      ("Solde commercial :", "−1 400 milliards", "1 400 milliards", "7 000 milliards", "0", "X − M."),
      ("Taux de couverture :", "≈ 66,7 %", "150 %", "33 %", "1 400 %", "2 800/4 200."),
      ("Termes de l'échange :", "87,5", "114", "105", "120", "105/120 × 100."),
      ("Interprétation :", "les termes de l'échange se sont dégradés", "ils se sont améliorés", "pas de changement", "on ne peut pas savoir", "Indice < 100."),
      ("Une conséquence :", "il faut exporter plus pour payer les mêmes importations", "les importations deviennent gratuites", "le pays s'enrichit automatiquement", "aucune", "Perte de pouvoir d'achat extérieur."),
    ]),
    P("Analyse : intégration régionale", "Avantages et limites de l'intégration en Afrique de l'Ouest.", [
      ("Un avantage :", "un marché plus large pour les entreprises", "plus de frontières", "moins d'échanges", "des droits de douane plus élevés entre membres", "Économies d'échelle."),
      ("Une limite :", "des économies peu complémentaires et des infrastructures insuffisantes", "trop de routes", "une monnaie trop forte partout", "aucune", "Faibles échanges intra-régionaux."),
      ("Un projet structurant :", "les corridors routiers et ferroviaires régionaux", "fermer les ports", "supprimer les marchés", "interdire les exportations", "Infrastructures."),
    ]),
  ]),
  "bac-type-g-compta-3": noter([
    P("Dossier 1 : opérations courantes", "Entreprise Ndiaye : vente à crédit 1 000 000 F HT, TVA 18 % ; achat au comptant par banque 400 000 F HT, TVA 18 %.", [
      ("TVA facturée sur la vente :", "180 000 F", "18 000 F", "1 180 000 F", "72 000 F", "1 000 000 × 18 %."),
      ("Compte débité pour la vente :", "411 Clients (1 180 000 F)", "701 Ventes", "521 Banque", "401 Fournisseurs", "Créance TTC."),
      ("Comptes crédités pour la vente :", "701 (1 000 000) et 4431 (180 000)", "411 et 521", "601 et 4452", "401 et 701", "Produit et TVA collectée."),
      ("TVA récupérable sur l'achat :", "72 000 F", "180 000 F", "400 000 F", "4 000 F", "400 000 × 18 %."),
      ("TVA due à l'État pour la période :", "108 000 F", "252 000 F", "180 000 F", "72 000 F", "TVA collectée − TVA récupérable."),
    ]),
    P("Dossier 2 : amortissement dégressif", "Matériel acquis le 1er janvier N : 6 000 000 F, durée 5 ans, dégressif (coefficient 2).", [
      ("Taux dégressif :", "40 %", "20 %", "25 %", "50 %", "20 % × 2."),
      ("Annuité N :", "2 400 000 F", "1 200 000 F", "3 000 000 F", "1 440 000 F", "6 000 000 × 40 %."),
      ("VNC fin N :", "3 600 000 F", "4 800 000 F", "2 400 000 F", "6 000 000 F", "6 000 000 − 2 400 000."),
      ("Annuité N+1 :", "1 440 000 F", "2 400 000 F", "1 200 000 F", "960 000 F", "3 600 000 × 40 %."),
    ]),
    P("Dossier 3 : travaux de fin d'exercice", "Inventaire au 31 décembre.", [
      ("Une facture de loyer de décembre reçue en janvier est :", "une charge à payer de l'exercice N", "une charge de N+1", "un produit", "rien", "Indépendance des exercices."),
      ("Une créance client douteuse fait l'objet :", "d'une dépréciation", "d'un amortissement", "d'une augmentation de capital", "d'un emprunt", "Prudence."),
      ("Le stock final s'enregistre :", "au débit du compte de stock (31) par le crédit de la variation (603)", "au crédit du compte 31", "en produits HAO", "en capital", "Écriture d'inventaire."),
      ("Après inventaire, on établit :", "la balance après inventaire puis les états financiers", "le journal d'ouverture seulement", "les factures", "le budget de l'État", "Synthèse."),
    ]),
  ]),
  "bac-type-s-maths-3": noter([
    P("Exercice 1 : suites", "u₀ = 2 et uₙ₊₁ = (1/2)uₙ + 3. On pose vₙ = uₙ − 6.", [
      ("u₁ =", "4", "5", "6", "2", "1 + 3."),
      ("(vₙ) est :", "géométrique de raison 1/2", "arithmétique de raison 3", "géométrique de raison 3", "constante", "vₙ₊₁ = (1/2)uₙ + 3 − 6 = (1/2)vₙ."),
      ("v₀ =", "−4", "4", "2", "−6", "2 − 6."),
      ("uₙ =", "6 − 4(1/2)ⁿ", "6 + 4(1/2)ⁿ", "2(1/2)ⁿ", "6 − (1/2)ⁿ", "uₙ = vₙ + 6."),
      ("Limite de (uₙ) :", "6", "0", "+∞", "2", "(1/2)ⁿ → 0."),
    ]),
    P("Exercice 2 : géométrie dans l'espace", "A(1 ; 0 ; 2), B(3 ; 2 ; 0), C(0 ; 1 ; 1).", [
      ("Vecteur AB :", "(2 ; 2 ; −2)", "(4 ; 2 ; 2)", "(−2 ; −2 ; 2)", "(2 ; 2 ; 2)", "B − A."),
      ("Norme de AB :", "2√3", "√12/2", "4", "√6", "√(4 + 4 + 4)."),
      ("Milieu de [AB] :", "(2 ; 1 ; 1)", "(4 ; 2 ; 2)", "(1 ; 1 ; −1)", "(2 ; 2 ; 1)", "Moyennes."),
      ("AB · AC avec AC(−1 ; 1 ; −1) :", "2", "0", "−2", "6", "−2 + 2 + 2."),
    ]),
    P("Problème : équation différentielle", "On considère (E) : y' + y = 0, puis f(x) = (x + 1)e⁻ˣ.", [
      ("Solutions de (E) :", "y = Ce⁻ˣ", "y = Ceˣ", "y = Cx", "y = C", "y' = −y."),
      ("Solution avec y(0) = 3 :", "y = 3e⁻ˣ", "y = e⁻³ˣ", "y = 3eˣ", "y = 3 − x", "C = 3."),
      ("f'(x) =", "−xe⁻ˣ", "xe⁻ˣ", "e⁻ˣ", "(x + 2)e⁻ˣ", "e⁻ˣ − (x + 1)e⁻ˣ."),
      ("Maximum de f :", "f(0) = 1", "f(1) = 2/e", "f(−1) = 0", "aucun", "f' change de signe en 0."),
      ("Limite de f en +∞ :", "0", "+∞", "1", "−∞", "Croissance comparée."),
      ("f(x) = 0 pour :", "x = −1", "x = 0", "x = 1", "aucune valeur", "x + 1 = 0."),
    ]),
  ]),
  "bac-type-s-pc-3": noter([
    P("Chimie : alcools et dosage", "On oxyde un alcool et on dose un acide.", [
      ("L'oxydation ménagée d'un alcool primaire donne d'abord :", "un aldéhyde", "une cétone", "un ester", "un alcane", "Puis un acide carboxylique."),
      ("Un alcool secondaire oxydé donne :", "une cétone", "un aldéhyde", "un acide", "rien", "Classe de l'alcool."),
      ("Un alcool tertiaire, par oxydation ménagée :", "ne réagit pas", "donne une cétone", "donne un aldéhyde", "donne un acide", "Pas d'H sur le carbone fonctionnel."),
      ("Le test à la 2,4-DNPH positif indique :", "un groupe carbonyle (aldéhyde ou cétone)", "un alcool", "un acide", "un ester", "Précipité jaune-orangé."),
      ("Dosage : Ca × 20 mL = 0,1 mol/L × 15 mL. Ca =", "0,075 mol/L", "0,15 mol/L", "0,1 mol/L", "0,03 mol/L", "Ca = 0,1 × 15/20."),
    ]),
    P("Physique", "Chute verticale, induction et ondes.", [
      ("Chute libre depuis le repos : vitesse après 2 s (g = 10 m/s²) :", "20 m/s", "10 m/s", "40 m/s", "5 m/s", "v = gt."),
      ("Distance parcourue en 2 s :", "20 m", "40 m", "10 m", "5 m", "½gt²."),
      ("Avec frottement, la vitesse tend vers :", "une vitesse limite", "zéro", "l'infini", "g", "Poids = frottement."),
      ("Loi de Lenz : le courant induit :", "s'oppose par ses effets à la cause qui lui donne naissance", "renforce la cause", "est toujours nul", "ne dépend pas du flux", "Induction."),
      ("Une onde de fréquence 50 Hz et de célérité 340 m/s a une longueur d'onde :", "6,8 m", "17 000 m", "0,15 m", "390 m", "λ = v/f."),
      ("Les interférences lumineuses prouvent :", "le caractère ondulatoire de la lumière", "le caractère corpusculaire", "que la lumière est un son", "rien", "Fentes d'Young."),
      ("L'effet photoélectrique prouve :", "le caractère corpusculaire de la lumière", "le caractère ondulatoire", "la gravitation", "l'induction", "Photons."),
    ]),
  ]),
  "bac-type-s-svt-3": noter([
    P("Maîtrise des connaissances : message nerveux", "Le message nerveux.", [
      ("Le potentiel de repos est dû surtout :", "à une répartition inégale des ions Na⁺ et K⁺", "au glucose", "à l'ATP seul", "aux anticorps", "Pompe Na⁺/K⁺ et perméabilité."),
      ("Le potentiel d'action se propage le long d'une fibre myélinisée de façon :", "saltatoire", "continue lente", "chimique", "aléatoire", "De nœud de Ranvier en nœud de Ranvier."),
      ("Au niveau de la synapse, le message devient :", "chimique", "électrique seulement", "mécanique", "thermique", "Neurotransmetteur."),
      ("Un neurone intègre les messages par :", "sommation spatiale et temporelle", "division cellulaire", "photosynthèse", "phagocytose", "Intégration."),
    ]),
    P("Compétences : reproduction", "Chez une femme, on observe une chute de progestérone au 28e jour.", [
      ("Cette chute provoque :", "les règles", "l'ovulation", "la fécondation", "la nidation", "Fin du cycle."),
      ("Elle s'explique par :", "la régression du corps jaune en l'absence de fécondation", "un pic de LH", "la grossesse", "la puberté", "Pas d'HCG."),
      ("En cas de grossesse, le corps jaune est maintenu par :", "l'HCG", "la FSH", "l'insuline", "l'ocytocine", "Hormone embryonnaire."),
    ]),
    P("Compétences : expression génétique", "Fragment d'ARNm : AUG GCU UAC UGA.", [
      ("Nombre de codons :", "4", "3", "12", "6", "12 nucléotides / 3."),
      ("Nombre d'acides aminés de la protéine :", "3", "4", "12", "2", "UGA est un codon stop."),
      ("Le brin d'ADN transcrit correspondant au 1er codon :", "TAC", "AUG", "UAC", "ATG", "Complémentarité ADN-ARN (A–U, T–A)."),
      ("Une substitution UAC → UAA provoque :", "un arrêt prématuré de la traduction", "un acide aminé de plus", "aucun effet", "une protéine plus longue", "UAA est un codon stop."),
      ("La traduction a lieu :", "dans le cytoplasme, sur les ribosomes", "dans le noyau", "dans la mitochondrie seulement", "dans la membrane", "ARNm → protéine."),
    ]),
  ]),
}

for _a in ANNALES_T3:
    assert abs(sum(s[4] for p in GUIDED_T3[_a["id"]] for s in p["steps"]) - 20) < 1e-9, _a["id"]
