# Sujets types du BAC pour toutes les séries (matières communes) et pour les séries L et G, sur le modèle des
# épreuves officielles : même structure, même barème, corrigé étape par étape. Les textes à étudier sont rédigés
# pour l'appli. Chaque étape : (question, [4 choix, le bon en premier], 0, explication, points).

TOUTES = ["Tle L", "Tle S", "Tle G"]

ANNALES_LG = [
  {"id": "bac-type-philo-1", "exam": "BAC", "year": "type 1", "series": "L, S et G", "subject": "Philosophie", "levels": TOUTES, "duration": "4 h", "modele": True,
   "parts": ["Dissertation : « Peut-on être libre en société ? »", "Analyse du sujet, problématique, plan dialectique, introduction et conclusion"]},
  {"id": "bac-type-philo-2", "exam": "BAC", "year": "type 2", "series": "L, S et G", "subject": "Philosophie", "levels": TOUTES, "duration": "4 h", "modele": True,
   "parts": ["Commentaire de texte : la connaissance et l'erreur", "Thème, thèse, problème, structure, explication et discussion"]},
  {"id": "bac-type-fr-1", "exam": "BAC", "year": "type 1", "series": "L, S et G", "subject": "Français", "levels": TOUTES, "duration": "4 h", "modele": True,
   "parts": ["Commentaire d'un poème de la Négritude", "Situation, axes de lecture, procédés, versification, plan"]},
  {"id": "bac-type-fr-2", "exam": "BAC", "year": "type 2", "series": "L, S et G", "subject": "Français", "levels": TOUTES, "duration": "4 h", "modele": True,
   "parts": ["Résumé (au quart) suivi de discussion", "Texte sur le téléphone portable à l'école"]},
  {"id": "bac-type-hg-1", "exam": "BAC", "year": "type 1", "series": "L, S et G", "subject": "Histoire-Géographie", "levels": TOUTES, "duration": "4 h", "modele": True,
   "parts": ["Histoire (10 pts) : guerre froide et décolonisation, commentaire de document", "Géographie (10 pts) : puissances économiques et intégration régionale, exploitation d'un tableau"]},
  {"id": "bac-type-anglais-1", "exam": "BAC", "year": "type 1", "series": "L, S et G", "subject": "Anglais", "levels": TOUTES, "duration": "3 h", "modele": True,
   "parts": ["Reading comprehension (8 pts)", "Language in use (7 pts)", "Writing (5 pts)"]},
  {"id": "bac-type-espagnol-1", "exam": "BAC", "year": "type 1", "series": "L, S et G", "subject": "Espagnol (LV2)", "levels": TOUTES, "duration": "3 h", "modele": True,
   "parts": ["Comprensión del texto (8 pts)", "Gramática (7 pts)", "Expresión personal (5 pts)"]},
  {"id": "bac-type-l-maths-1", "exam": "BAC", "year": "type 1", "series": "L1a, L1b, L2, L'", "subject": "Mathématiques", "levels": ["Tle L"], "duration": "2 h", "modele": True,
   "parts": ["Exercice 1 (5 pts) : suites", "Exercice 2 (5 pts) : dénombrement et probabilités", "Problème (10 pts) : étude d'une fonction avec logarithme"]},
  {"id": "bac-type-g-maths-1", "exam": "BAC", "year": "type 1", "series": "G", "subject": "Mathématiques", "levels": ["Tle G"], "duration": "3 h", "modele": True,
   "parts": ["Exercice 1 (5 pts) : intérêts composés", "Exercice 2 (5 pts) : emprunt remboursé par annuités constantes", "Problème (10 pts) : coût, recette et bénéfice"]},
  {"id": "bac-type-g-eco-1", "exam": "BAC", "year": "type 1", "series": "G", "subject": "Économie", "levels": ["Tle G"], "duration": "3 h", "modele": True,
   "parts": ["I. Connaissances (6 pts)", "II. Exercice chiffré (8 pts) : PIB, croissance, commerce extérieur, chômage", "III. Analyse (6 pts) : inflation et politique économique"]},
  {"id": "bac-type-g-compta-1", "exam": "BAC", "year": "type 1", "series": "G", "subject": "Techniques comptables", "levels": ["Tle G"], "duration": "4 h", "modele": True,
   "parts": ["Dossier 1 (6 pts) : amortissements", "Dossier 2 (5 pts) : enregistrements au journal", "Dossier 3 (9 pts) : compte de résultat et analyse du bilan"]},
]

GUIDED_LG = {
  "bac-type-philo-1": [
    {"title": "1. Analyser le sujet (5 pts)", "context": "Sujet : « Peut-on être libre en société ? »", "steps": [
      ("Les notions clés du sujet sont :", ["la liberté et la société (avec ses lois et ses normes)", "le bonheur et le travail", "la conscience et l'inconscient", "la vérité et l'opinion"], 0, "On repère les mots qui portent le sens : « libre » et « en société ».", 1),
      ("« Peut-on » invite à se demander :", ["si c'est possible et si c'est légitime", "comment devenir riche", "qui a inventé la société", "quand la société est apparue"], 0, "« Pouvoir » a deux sens : la possibilité (est-ce réalisable ?) et le droit (est-ce permis ?).", 1),
      ("Le paradoxe qui fonde le sujet est :", ["la société limite nos actes, mais elle semble aussi nécessaire pour être libre", "la société n'existe pas", "la liberté est toujours totale", "on ne vit jamais en société"], 0, "Un bon sujet de philosophie cache une tension entre deux idées qui semblent vraies toutes les deux.", 1.5),
      ("La problématique la mieux formulée est :", ["La vie sociale, avec ses lois, détruit-elle la liberté ou en est-elle la condition ?", "Qu'est-ce que la société ?", "Les lois sont-elles écrites ?", "Pourquoi les hommes sont-ils méchants ?"], 0, "La problématique reprend la tension du sujet sous forme d'une question précise qui oppose deux réponses.", 1.5),
    ]},
    {"title": "2. Construire le plan dialectique (8 pts)", "context": "On construit trois parties : thèse, antithèse, dépassement.", "steps": [
      ("Une bonne première partie (thèse) soutient que :", ["la société contraint l'individu : lois, normes, regard des autres", "la société rend toujours heureux", "la liberté n'a pas de sens", "seul l'État est libre"], 0, "On part de l'idée la plus immédiate : vivre avec d'autres impose des limites.", 1.5),
      ("La référence adaptée à cette première partie est :", ["Rousseau : « L'homme est né libre, et partout il est dans les fers »", "Descartes : « Je pense, donc je suis »", "Pythagore et les nombres", "Darwin et l'évolution"], 0, "Rousseau ouvre le Contrat social par ce constat : la société telle qu'elle est enchaîne l'homme.", 1.5),
      ("La deuxième partie (antithèse) montre que :", ["la loi protège la liberté de chacun contre la force des autres", "il faut vivre seul dans la forêt", "les lois sont inutiles", "la liberté, c'est faire tout ce qu'on veut"], 0, "Sans loi, règne la loi du plus fort : la liberté de l'un n'est pas garantie.", 1.5),
      ("La citation qui appuie cette antithèse est :", ["Montesquieu : « La liberté est le droit de faire tout ce que les lois permettent »", "Freud : « Le moi n'est pas maître dans sa propre maison »", "Marx : « La religion est l'opium du peuple »", "Pascal : « L'homme est un roseau pensant »"], 0, "Montesquieu définit la liberté politique par la loi, non contre elle.", 1.5),
      ("La troisième partie peut dépasser l'opposition en montrant que :", ["la vraie liberté est l'autonomie : obéir à des lois qu'on s'est données et s'engager", "la société et la liberté sont sans rapport", "la question n'a pas de réponse", "il faut supprimer l'État"], 0, "Rousseau : « l'obéissance à la loi qu'on s'est prescrite est liberté » ; Sartre insiste sur la responsabilité et l'engagement.", 2),
    ]},
    {"title": "3. Rédiger l'introduction et la conclusion (7 pts)", "context": "La rédaction compte : le correcteur juge la clarté, l'enchaînement et la réponse finale.", "steps": [
      ("Une introduction complète contient, dans l'ordre :", ["une amorce, le sujet et sa problématique, l'annonce du plan", "le plan seulement", "la conclusion", "une liste de citations"], 0, "Amener le sujet, poser le problème, annoncer le plan, sans donner la réponse.", 2),
      ("Entre deux parties, on écrit :", ["une transition qui fait le bilan et montre la limite de la partie", "rien", "une nouvelle introduction", "le sujet en entier"], 0, "La transition explique pourquoi on passe à la partie suivante.", 1.5),
      ("La conclusion doit :", ["faire le bilan, répondre clairement à la question et ouvrir sur une autre question", "recopier l'introduction", "ajouter une quatrième partie", "rester sans réponse"], 0, "Bilan, réponse nuancée, ouverture (par exemple sur la désobéissance civile face à une loi injuste).", 2),
      ("L'erreur la plus grave à éviter est :", ["réciter un cours sans répondre au sujet posé", "citer un auteur", "faire trois parties", "écrire lisiblement"], 0, "Le hors-sujet est la première cause de mauvaise note : chaque paragraphe doit répondre à la question.", 1.5),
    ]},
  ],
  "bac-type-philo-2": [
    {"title": "1. Comprendre le texte (8 pts)", "context": "Texte (rédigé pour l'entraînement) : « Nous croyons volontiers que connaître, c'est accumuler des informations, comme on remplit un grenier. Pourtant, toute connaissance nouvelle commence par une erreur reconnue. Celui qui croit déjà savoir ne cherche plus ; il répète. Le savant véritable n'est pas celui qui sait tout, mais celui qui accepte de corriger sans cesse ce qu'il croyait savoir. La vérité n'est pas un trésor que l'on possède : c'est un chemin que l'on reprend chaque jour. »", "steps": [
      ("Le thème du texte est :", ["la connaissance et la vérité", "le travail et la richesse", "l'art et la beauté", "l'État et la politique"], 0, "Le thème répond à la question : de quoi parle le texte ?", 1.5),
      ("La thèse de l'auteur est :", ["connaître, c'est corriger ses erreurs, pas accumuler des informations", "connaître, c'est tout mémoriser", "la vérité est impossible", "les savants ne se trompent jamais"], 0, "La thèse répond à la question : que dit l'auteur du thème ?", 2),
      ("La thèse que l'auteur critique est :", ["la connaissance comme accumulation, « comme on remplit un grenier »", "le doute", "la recherche", "l'erreur"], 0, "« Nous croyons volontiers » annonce l'opinion commune que le texte réfute.", 1.5),
      ("Le problème posé par le texte est :", ["la connaissance progresse-t-elle par accumulation ou par rectification ?", "faut-il aller à l'école ?", "qui a raison ?", "la science est-elle utile ?"], 0, "Le problème est la question à laquelle la thèse répond.", 1.5),
      ("La structure du texte comporte :", ["deux moments : la critique de l'opinion, puis la définition de la vraie connaissance", "un seul moment", "cinq parties sans lien", "une histoire puis une morale"], 0, "« Pourtant » marque le passage de l'opinion critiquée à la thèse.", 1.5),
    ]},
    {"title": "2. Expliquer et discuter (12 pts)", "context": "Après l'explication, on discute : intérêt de la thèse, puis ses limites.", "steps": [
      ("La métaphore « la vérité n'est pas un trésor… c'est un chemin » signifie :", ["la vérité se construit et se cherche sans fin", "la vérité est cachée sous terre", "la vérité coûte cher", "la vérité est inutile"], 0, "Un trésor se possède une fois pour toutes ; un chemin se parcourt.", 2),
      ("Un auteur qui défend une idée proche est :", ["Bachelard : on connaît « contre une connaissance antérieure »", "Rousseau sur l'état de nature", "Machiavel sur le prince", "Épicure sur le plaisir"], 0, "Pour Bachelard, le progrès scientifique passe par la rectification des erreurs (obstacles épistémologiques).", 2),
      ("Un exemple qui illustre la thèse est :", ["le passage du géocentrisme à l'héliocentrisme", "apprendre l'alphabet", "compter jusqu'à dix", "aller au marché"], 0, "La science a progressé en reconnaissant que la Terre n'est pas au centre de l'univers.", 2),
      ("L'intérêt de la thèse est :", ["d'encourager l'esprit critique et l'humilité", "de rendre le savoir inutile", "d'interdire d'apprendre", "de supprimer les écoles"], 0, "Reconnaître ses erreurs est la condition pour apprendre.", 2),
      ("Une limite de la thèse est :", ["certaines connaissances acquises restent stables et doivent être transmises", "la vérité n'existe pas", "les erreurs sont toujours bonnes", "il ne faut jamais douter"], 0, "Tout n'est pas sans cesse remis en cause : on s'appuie sur des acquis (tables de multiplication, lois établies).", 2),
      ("Dans le commentaire, il faut éviter :", ["la paraphrase, qui répète le texte sans l'expliquer", "de citer le texte", "de donner un exemple", "de discuter"], 0, "Expliquer, c'est dire pourquoi et comment l'auteur affirme ce qu'il dit.", 2),
    ]},
  ],
  "bac-type-fr-1": [
    {"title": "1. Situer et comprendre le poème (8 pts)", "context": "Poème (rédigé pour l'entraînement) : Mère Afrique, je chante tes fleuves patients, / Tes baobabs debout comme des sages anciens, / Tes villages qui dansent au rythme des tam-tams, / Et la voix des griots qui réveille nos âmes. / Mère Afrique, on t'a dit sans histoire et sans nom, / Mais ta mémoire chante au fond de chaque son.", "steps": [
      ("Ce poème se rattache au mouvement :", ["de la Négritude", "du classicisme", "du surréalisme européen", "du réalisme"], 0, "Célébration de l'Afrique, de ses valeurs et de sa culture, réponse au mépris colonial : thèmes de la Négritude (Senghor, Césaire, Damas).", 1.5),
      ("Le thème principal est :", ["la célébration de l'Afrique et de sa culture", "la vie en ville", "l'amour malheureux", "la guerre"], 0, "Fleuves, baobabs, tam-tams et griots composent un éloge de l'Afrique.", 1.5),
      ("La répétition de « Mère Afrique » en tête de vers est :", ["une anaphore", "une litote", "une antithèse", "un euphémisme"], 0, "L'anaphore reprend un mot en début de vers : elle donne un ton de chant et d'hommage.", 1.5),
      ("« Tes baobabs debout comme des sages anciens » est :", ["une comparaison qui personnifie les arbres", "une métaphore filée", "une hyperbole", "une périphrase"], 0, "L'outil « comme » marque la comparaison ; les arbres sont vus comme des personnes sages.", 1.5),
      ("Les deux derniers vers opposent :", ["le mépris colonial (« sans histoire ») et la mémoire vivante de l'Afrique", "le jour et la nuit", "la ville et la campagne", "le passé et le futur proche"], 0, "« Mais » introduit la réfutation : l'Afrique a une histoire, transmise par la tradition orale.", 2),
    ]},
    {"title": "2. Analyser la forme et bâtir le plan (12 pts)", "context": "On construit un commentaire composé en deux axes.", "steps": [
      ("Les vers sont surtout :", ["des alexandrins (environ 12 syllabes) à rimes suivies", "des octosyllabes à rimes croisées", "des vers libres sans rime", "des décasyllabes à rimes embrassées"], 0, "Rimes AABBCC : rimes suivies (plates) ; vers longs proches de l'alexandrin.", 2),
      ("Le champ lexical dominant est celui :", ["de la musique et du chant (chante, tam-tams, voix, son)", "de la mer", "de la mort", "de l'argent"], 0, "Le poème se présente comme un chant : il rappelle la tradition orale africaine.", 2),
      ("Le tutoiement (« tes », « ta ») crée :", ["une relation intime et affective avec l'Afrique", "une distance froide", "un ton comique", "un dialogue de théâtre"], 0, "L'Afrique est apostrophée comme une mère : apostrophe et personnification.", 2),
      ("Le meilleur plan de commentaire est :", ["I. Un éloge de l'Afrique ; II. Une réponse au mépris colonial", "I. La vie de l'auteur ; II. Le résumé du poème", "I. Les rimes ; II. Les syllabes", "I. Introduction ; II. Conclusion"], 0, "Deux axes de lecture qui interprètent le texte, chacun appuyé par des procédés analysés.", 2),
      ("Dans chaque paragraphe, on doit :", ["citer le texte, nommer le procédé et expliquer son effet", "raconter le poème", "donner son avis sans preuve", "recopier tout le poème"], 0, "Citation + procédé + interprétation : c'est la règle du commentaire.", 2),
      ("L'introduction doit présenter :", ["le mouvement et le thème, le texte, les axes de lecture", "seulement la date", "la conclusion", "une citation au hasard"], 0, "Situer, présenter, annoncer le plan.", 2),
    ]},
  ],
  "bac-type-fr-2": [
    {"title": "1. Résumé (10 pts)", "context": "Texte (rédigé pour l'entraînement, environ 400 mots en version complète) : l'auteur constate que le téléphone portable est entré dans les classes. Il reconnaît ses atouts : accès rapide à l'information, dictionnaires, cours en ligne, contact avec les familles. Il dénonce ensuite ses dangers : distraction, triche, harcèlement, fatigue liée aux écrans. Il conclut que l'interdiction totale est illusoire et qu'il faut éduquer les élèves à un usage responsable, avec des règles claires.", "steps": [
      ("Un texte de 400 mots se résume en :", ["environ 100 mots, avec une tolérance de 10 % (90 à 110)", "200 mots", "20 mots", "autant de mots qu'on veut"], 0, "Le résumé au quart : 400 ÷ 4 = 100 mots ; on indique le nombre de mots à la fin.", 2),
      ("Dans le résumé, on écrit :", ["comme si on était l'auteur, sans « l'auteur dit »", "« le texte parle de… »", "son avis personnel", "des citations entre guillemets"], 0, "On garde la situation d'énonciation du texte : on se met à la place de l'auteur.", 2),
      ("On garde avant tout :", ["les idées essentielles et les liens logiques entre elles", "les exemples", "les chiffres", "les noms propres"], 0, "Exemples et détails disparaissent ; les connecteurs (mais, donc, ainsi) restent.", 2),
      ("Le résumé doit suivre :", ["l'ordre du texte", "l'ordre inverse", "un ordre libre", "l'ordre alphabétique"], 0, "On respecte la progression : atouts, dangers, solution.", 2),
      ("La phrase qui résume le mieux la conclusion est :", ["Plutôt qu'interdire, il faut apprendre aux élèves à bien s'en servir.", "Le téléphone est très dangereux.", "L'auteur aime les téléphones.", "Il faut acheter des tablettes."], 0, "Elle reformule l'idée avec ses propres mots, sans recopier.", 2),
    ]},
    {"title": "2. Discussion (10 pts)", "context": "Sujet de discussion : « Faut-il interdire le téléphone portable à l'école ? » Vous discuterez ce point de vue en vous appuyant sur des exemples précis.", "steps": [
      ("Discuter, c'est :", ["examiner les arguments pour et contre, puis prendre position", "résumer encore le texte", "donner uniquement son avis", "raconter une histoire"], 0, "La discussion suit un plan dialectique.", 2),
      ("Un argument pour l'interdiction est :", ["le téléphone distrait et favorise la triche", "il coûte cher", "il est petit", "il a une batterie"], 0, "Argument lié au travail scolaire, illustré par un exemple.", 2),
      ("Un argument contre l'interdiction est :", ["bien utilisé, il donne accès au savoir et rassure les familles", "il fait de la musique", "tout le monde en a un", "il est joli"], 0, "Un argument doit être justifié, pas seulement affirmé.", 2),
      ("Un exemple pertinent est :", ["un élève qui consulte un dictionnaire ou une appli de révision pendant ses devoirs", "un film d'action", "un match de football", "le prix d'un téléphone"], 0, "L'exemple illustre précisément l'argument.", 2),
      ("La conclusion de la discussion doit :", ["donner une position nuancée et justifiée", "rester sans avis", "ajouter un nouvel argument", "recopier le sujet"], 0, "Par exemple : interdit en classe sauf usage pédagogique encadré.", 2),
    ]},
  ],
  "bac-type-hg-1": [
    {"title": "Histoire (10 pts)", "context": "Document : « Les pays d'Asie et d'Afrique réunis à Bandung en avril 1955 condamnent le colonialisme sous toutes ses formes et affirment le droit des peuples à disposer d'eux-mêmes. » (d'après le communiqué final de la conférence de Bandung)", "steps": [
      ("Ce document est :", ["un texte officiel, extrait d'un communiqué de conférence internationale", "une lettre privée", "une caricature", "une carte"], 0, "Présenter un document : nature, auteur, date, contexte.", 1.5),
      ("Il s'inscrit dans le contexte :", ["de la guerre froide et de la décolonisation", "de la Première Guerre mondiale", "de la traite négrière", "de la révolution industrielle"], 0, "En 1955, le monde est divisé en deux blocs et les colonies réclament leur indépendance.", 1.5),
      ("Bandung marque la naissance politique :", ["du tiers-monde, qui conduira au mouvement des non-alignés (1961)", "de l'OTAN", "du pacte de Varsovie", "de l'Union européenne"], 0, "Les pays du Sud refusent de s'aligner sur les États-Unis ou l'URSS.", 1.5),
      ("Le Sénégal est devenu indépendant :", ["en 1960 (20 août, après l'éclatement de la Fédération du Mali)", "en 1945", "en 1975", "en 1990"], 0, "Accords du 4 avril 1960, Fédération du Mali, puis indépendance du Sénégal le 20 août 1960 avec Senghor président.", 1.5),
      ("La guerre froide oppose :", ["les États-Unis et l'URSS, sans affrontement direct entre eux", "la France et l'Allemagne", "la Chine et le Japon", "l'Afrique et l'Europe"], 0, "Rivalité idéologique (capitalisme / communisme), course aux armements, crises comme Berlin (1948, 1961) ou Cuba (1962).", 2),
      ("La guerre froide prend fin avec :", ["la chute du mur de Berlin (1989) et la disparition de l'URSS (1991)", "la crise de Cuba", "le plan Marshall", "la conférence de Yalta"], 0, "Le monde bipolaire laisse place à la domination américaine.", 2),
    ]},
    {"title": "Géographie (10 pts)", "context": "Tableau : PIB (en milliers de milliards de dollars, valeurs arrondies) : États-Unis 27 ; Chine 18 ; Japon 4,2 ; Union européenne 18,3. Population (millions) : États-Unis 335 ; Chine 1 410 ; Japon 125.", "steps": [
      ("Le PIB par habitant des États-Unis vaut environ :", ["80 600 dollars", "8 000 dollars", "27 000 dollars", "335 000 dollars"], 0, "27 000 milliards ÷ 335 millions ≈ 80 600 dollars.", 2),
      ("Celui de la Chine vaut environ :", ["12 800 dollars", "128 000 dollars", "1 280 dollars", "18 000 dollars"], 0, "18 000 milliards ÷ 1 410 millions ≈ 12 800 dollars : PIB élevé mais population très nombreuse.", 2),
      ("La puissance du Japon repose surtout sur :", ["l'industrie de haute technologie et le commerce, malgré peu de ressources naturelles", "le pétrole", "l'agriculture extensive", "l'élevage"], 0, "Le Japon importe ses matières premières et exporte des produits transformés.", 2),
      ("L'UEMOA, dont fait partie le Sénégal, a été créée en :", ["1994, avec une monnaie commune, le franc CFA", "1960", "1975", "2010"], 0, "La CEDEAO date de 1975 ; l'UEMOA de 1994 (8 pays, BCEAO).", 2),
      ("Pour commenter un tableau statistique, on :", ["présente le document, décrit les chiffres en les comparant, puis on explique", "recopie toutes les valeurs", "donne son avis", "dessine une carte"], 0, "Présenter, décrire (calculs, comparaisons), expliquer, conclure.", 2),
    ]},
  ],
  "bac-type-anglais-1": [
    {"title": "Reading comprehension (8 pts)", "context": "Text (written for practice): \"Aminata lives in a small town near Kaolack. Every morning she walks five kilometres to school. Last year, her village got electricity for the first time, so she can now study at night. She dreams of becoming a doctor because there is only one health centre in the area. 'If I become a doctor, I will come back and work here,' she says.\"", "steps": [
      ("Aminata goes to school:", ["on foot", "by bus", "by bike", "by car"], 0, "\"She walks five kilometres to school.\"", 1.5),
      ("True or false: the village has always had electricity.", ["False: it got electricity last year for the first time", "True", "Not stated", "True, since many years"], 0, "\"Last year, her village got electricity for the first time.\"", 1.5),
      ("Why does she want to become a doctor?", ["Because there is only one health centre in the area", "Because doctors are rich", "Because her father is a doctor", "Because she likes hospitals"], 0, "The reason is introduced by \"because\".", 2),
      ("The word \"dreams\" is closest in meaning to:", ["hopes", "sleeps", "forgets", "refuses"], 0, "To dream of = to hope for, to wish for.", 1.5),
      ("The main idea of the text is:", ["a girl's determination to study and help her community", "a holiday in Kaolack", "the history of electricity", "a football match"], 0, "Look for the idea that links all the sentences.", 1.5),
    ]},
    {"title": "Language in use (7 pts)", "context": "Grammar and vocabulary questions based on the text.", "steps": [
      ("Passive voice: \"The government built a new school.\"", ["A new school was built by the government.", "A new school is build by the government.", "The government was built a new school.", "A new school has build the government."], 0, "Passive: be (same tense) + past participle.", 1.5),
      ("Reported speech: She said, \"I will come back.\"", ["She said that she would come back.", "She said that I will come back.", "She said she will came back.", "She says she would came back."], 0, "will → would ; I → she.", 1.5),
      ("Conditional: If she ___ a doctor, she will work in her village.", ["becomes", "became", "would become", "had become"], 0, "First conditional: if + present, will + verb.", 1.5),
      ("Question tag: She walks to school, ___?", ["doesn't she", "isn't she", "didn't she", "won't she"], 0, "Affirmative present simple → negative tag with does.", 1.5),
      ("Choose the correct form: She is used to ___ early.", ["getting up", "get up", "got up", "gets up"], 0, "Be used to + -ing.", 1),
    ]},
    {"title": "Writing (5 pts)", "context": "Essay: \"Should girls in rural areas be encouraged to go to university? Give your opinion in about 150 words.\"", "steps": [
      ("A good essay has:", ["an introduction, two or three paragraphs with arguments, and a conclusion", "one long sentence", "a list of words", "only a title"], 0, "Clear structure = easier to read and better mark.", 1.5),
      ("A good linking word to add an argument is:", ["Moreover", "However", "Although", "Despite"], 0, "Moreover / Furthermore / In addition add an idea ; However introduces a contrast.", 1),
      ("A good opening sentence is:", ["Education is the key to development, especially for girls.", "Yes.", "I don't know.", "Girls are girls."], 0, "Introduce the topic in a general way.", 1),
      ("To conclude, you should:", ["sum up your opinion clearly", "start a new argument", "copy the subject", "write in French"], 0, "\"To sum up / In conclusion, …\".", 1.5),
    ]},
  ],
  "bac-type-espagnol-1": [
    {"title": "Comprensión del texto (8 pts)", "context": "Texto (escrito para practicar): «Diego vive en un barrio humilde de Lima. Por las tardes trabaja en el mercado para ayudar a su madre. Aunque está cansado, estudia por la noche porque quiere ser ingeniero. Su profesor le dijo un día: \"Si sigues así, conseguirás una beca\". Desde entonces, Diego no ha perdido la esperanza.»", "steps": [
      ("¿Dónde vive Diego?", ["En un barrio humilde de Lima", "En Madrid", "En el campo", "En un hotel"], 0, "Primera frase del texto.", 1.5),
      ("¿Por qué trabaja en el mercado?", ["Para ayudar a su madre", "Para comprar un móvil", "Porque no le gusta estudiar", "Para viajar"], 0, "«para ayudar a su madre».", 1.5),
      ("«Aunque está cansado» expresa:", ["una concesión (oposición)", "una causa", "una consecuencia", "un tiempo"], 0, "Aunque = bien que : concession.", 1.5),
      ("¿Qué quiere ser Diego?", ["Ingeniero", "Médico", "Profesor", "Comerciante"], 0, "«quiere ser ingeniero».", 1.5),
      ("La idea principal es:", ["el esfuerzo de un joven pobre para estudiar", "la vida de un profesor", "un viaje a Lima", "la historia del mercado"], 0, "On cherche l'idée qui relie tout le texte.", 2),
    ]},
    {"title": "Gramática (7 pts)", "context": "Ejercicios a partir del texto.", "steps": [
      ("Estilo indirecto: El profesor dijo: «Si sigues así, conseguirás una beca».", ["El profesor dijo que si seguía así, conseguiría una beca.", "El profesor dijo que si sigue así, conseguirás una beca.", "El profesor dice que si siguiera, consigue.", "El profesor dijo si sigues, conseguir."], 0, "Pasado en el verbo introductor : presente → imperfecto, futuro → condicional.", 2),
      ("Completa: Si Diego ___ una beca, estudiaría en la universidad.", ["consiguiera", "consigue", "conseguirá", "consiga"], 0, "Si + subjuntivo imperfecto, condicional.", 2),
      ("Completa: Su madre quiere que Diego ___ ingeniero.", ["sea", "es", "será", "fue"], 0, "Querer que + subjuntivo (presente si el verbo principal está en presente).", 1.5),
      ("«No ha perdido» está en:", ["pretérito perfecto compuesto", "pretérito indefinido", "futuro", "imperfecto"], 0, "haber (presente) + participio.", 1.5),
    ]},
    {"title": "Expresión personal (5 pts)", "context": "Tema: «¿Es posible estudiar y trabajar al mismo tiempo? Da tu opinión (unas 100 palabras).»", "steps": [
      ("Para dar tu opinión, empiezas con:", ["En mi opinión, …", "Hola, …", "Había una vez …", "Adiós, …"], 0, "También: Creo que…, Pienso que…, A mi parecer…", 1.5),
      ("Para oponer dos ideas usas:", ["sin embargo", "además", "porque", "por eso"], 0, "Sin embargo = cependant.", 1),
      ("Para concluir escribes:", ["En conclusión, …", "Primero, …", "Por ejemplo, …", "Además, …"], 0, "Para terminar / En resumen / En conclusión.", 1),
      ("Una buena redacción:", ["presenta argumentos con ejemplos y una conclusión", "repite el texto", "tiene una sola frase", "está en francés"], 0, "Introducción, argumentos, conclusión.", 1.5),
    ]},
  ],
  "bac-type-l-maths-1": [
    {"title": "Exercice 1 : suites (5 pts)", "context": "En 2020, une ville compte 50 000 habitants. Sa population augmente de 4 % par an. On note uₙ la population en 2020 + n. Par ailleurs, Awa épargne 1 000 F le premier mois, puis 250 F de plus chaque mois : vₙ = 1 000 + 250n (n = 0 pour le premier mois).", "steps": [
      ("La suite (uₙ) est :", ["géométrique de raison 1,04", "arithmétique de raison 4", "géométrique de raison 0,04", "arithmétique de raison 2 000"], 0, "Augmenter de 4 %, c'est multiplier par 1 + 4/100 = 1,04.", 1),
      ("La population en 2022 est :", ["54 080 habitants", "54 000 habitants", "52 000 habitants", "58 000 habitants"], 0, "u₂ = 50 000 × 1,04² = 50 000 × 1,0816.", 1),
      ("La population dépasse 70 000 habitants pour la première fois en :", ["2029", "2028", "2030", "2025"], 0, "1,04ⁿ > 1,4 ⟺ n > ln 1,4/ln 1,04 ≈ 8,58 : n = 9, soit 2029.", 1.5),
      ("Le total épargné par Awa en 11 mois (de v₀ à v₁₀) vaut :", ["24 750 F", "35 000 F", "13 750 F", "49 500 F"], 0, "v₁₀ = 3 500 ; somme = 11 × (1 000 + 3 500)/2 = 24 750 F.", 1.5),
    ]},
    {"title": "Exercice 2 : dénombrement et probabilités (5 pts)", "context": "Une urne contient 4 boules rouges et 6 boules noires indiscernables au toucher. On tire simultanément 2 boules.", "steps": [
      ("Le nombre de tirages possibles est :", ["45", "90", "100", "20"], 0, "C₁₀² = 10 × 9/2 = 45.", 1),
      ("La probabilité d'obtenir 2 boules rouges est :", ["2/15", "4/10", "6/10", "1/3"], 0, "C₄² = 6 ; 6/45 = 2/15.", 1),
      ("La probabilité d'obtenir 2 boules noires est :", ["1/3", "2/15", "3/5", "6/45"], 0, "C₆² = 15 ; 15/45 = 1/3.", 1),
      ("La probabilité d'obtenir une boule de chaque couleur est :", ["8/15", "1/2", "24/90", "2/5"], 0, "4 × 6 = 24 tirages ; 24/45 = 8/15. Vérification : 6 + 15 + 24 = 45.", 1),
      ("La probabilité d'obtenir au moins une boule rouge est :", ["2/3", "1/3", "8/15", "2/15"], 0, "Événement contraire de « 2 noires » : 1 − 1/3.", 1),
    ]},
    {"title": "Problème : étude d'une fonction (10 pts)", "context": "Soit f la fonction définie sur ]0 ; +∞[ par f(x) = x − ln x. On note C sa courbe.", "steps": [
      ("f'(x) vaut :", ["(x − 1)/x", "1 − x", "1/x", "x − 1/x"], 0, "(x)' = 1 et (ln x)' = 1/x : f'(x) = 1 − 1/x = (x − 1)/x.", 1.5),
      ("f est :", ["décroissante sur ]0 ; 1] et croissante sur [1 ; +∞[", "croissante sur ]0 ; +∞[", "décroissante sur ]0 ; +∞[", "croissante sur ]0 ; 1]"], 0, "x > 0 : f'(x) a le signe de x − 1.", 1.5),
      ("f admet un minimum égal à :", ["1, atteint en x = 1", "0, en x = 1", "e, en x = e", "−1, en x = 0"], 0, "f(1) = 1 − ln 1 = 1 − 0.", 1.5),
      ("La limite de f en 0⁺ est :", ["+∞", "0", "−∞", "1"], 0, "x → 0 et ln x → −∞, donc −ln x → +∞ : asymptote verticale x = 0.", 1.5),
      ("La tangente à C au point d'abscisse e a pour équation :", ["y = (1 − 1/e) x", "y = x − 1", "y = (1 − e) x + e", "y = e x"], 0, "f'(e) = 1 − 1/e et f(e) = e − 1 ; y = (1 − 1/e)(x − e) + e − 1 = (1 − 1/e)x.", 2),
      ("L'équation f(x) = 0 :", ["n'a pas de solution, car f(x) ≥ 1 > 0", "a une solution x = 1", "a deux solutions", "a une solution x = e"], 0, "Le minimum de f vaut 1 : f ne s'annule jamais.", 2),
    ]},
  ],
  "bac-type-g-maths-1": [
    {"title": "Exercice 1 : intérêts composés (5 pts)", "context": "Un commerçant place 500 000 F à intérêts composés au taux annuel de 6 %.", "steps": [
      ("La valeur acquise au bout de 5 ans est environ :", ["669 113 F", "650 000 F", "530 000 F", "800 000 F"], 0, "C₅ = 500 000 × 1,06⁵ ≈ 500 000 × 1,338226.", 1.5),
      ("Les intérêts produits en 5 ans sont environ :", ["169 113 F", "150 000 F", "30 000 F", "669 113 F"], 0, "I = C₅ − C₀ (en intérêts simples on aurait 150 000 F).", 1),
      ("Le capital double au bout d'environ :", ["12 ans", "17 ans", "6 ans", "10 ans"], 0, "1,06ⁿ = 2 ⟺ n = ln 2/ln 1,06 ≈ 11,9 : 12 ans.", 1.5),
      ("La valeur actuelle de 1 000 000 F payable dans 4 ans au taux de 6 % est environ :", ["792 094 F", "760 000 F", "940 000 F", "1 262 477 F"], 0, "C₀ = 1 000 000 × 1,06⁻⁴.", 1),
    ]},
    {"title": "Exercice 2 : emprunt indivis (5 pts)", "context": "Une entreprise emprunte 2 000 000 F, remboursables par 5 annuités constantes, la première un an après l'emprunt, au taux de 8 %.", "steps": [
      ("La formule de l'annuité est :", ["a = E × i/(1 − (1 + i)⁻ⁿ)", "a = E/n", "a = E × (1 + i)ⁿ", "a = E × i × n"], 0, "Formule de l'annuité constante.", 1),
      ("L'annuité vaut environ :", ["500 913 F", "400 000 F", "560 000 F", "432 000 F"], 0, "2 000 000 × 0,08/(1 − 1,08⁻⁵) = 160 000/0,319417.", 1),
      ("L'intérêt de la première année est :", ["160 000 F", "40 000 F", "500 913 F", "16 000 F"], 0, "Capital restant dû × taux : 2 000 000 × 0,08.", 1),
      ("Le premier amortissement vaut environ :", ["340 913 F", "400 000 F", "160 000 F", "500 913 F"], 0, "Amortissement = annuité − intérêt.", 1),
      ("Le coût total du crédit est environ :", ["504 565 F", "800 000 F", "160 000 F", "2 504 565 F"], 0, "5a − E = 2 504 565 − 2 000 000.", 1),
    ]},
    {"title": "Problème : coût, recette, bénéfice (10 pts)", "context": "Une entreprise fabrique q articles (q en centaines). Le coût total est CT(q) = q² + 20q + 400 (en milliers de F). Chaque centaine d'articles est vendue 100 milliers de F.", "steps": [
      ("Le coût moyen CM(q) vaut :", ["q + 20 + 400/q", "2q + 20", "q² + 20q", "400/q"], 0, "CM(q) = CT(q)/q.", 1.5),
      ("Le coût marginal Cm(q) vaut :", ["2q + 20", "q + 20", "q² + 20", "20"], 0, "Cm(q) = CT'(q).", 1.5),
      ("Le bénéfice B(q) vaut :", ["−q² + 80q − 400", "q² + 80q − 400", "100q", "−q² + 120q + 400"], 0, "B = R − CT = 100q − q² − 20q − 400.", 1.5),
      ("Le bénéfice est maximal pour :", ["q = 40 (4 000 articles)", "q = 20", "q = 80", "q = 100"], 0, "B'(q) = −2q + 80 = 0.", 2),
      ("Le bénéfice maximal vaut :", ["1 200 milliers de F", "1 600 milliers de F", "400 milliers de F", "3 200 milliers de F"], 0, "B(40) = −1 600 + 3 200 − 400.", 1.5),
      ("Le coût moyen est minimal pour q = 20 ; il vaut alors :", ["60 milliers de F, égal au coût marginal", "40 milliers de F", "20 milliers de F", "100 milliers de F"], 0, "CM(20) = 20 + 20 + 20 = 60 et Cm(20) = 60 : au minimum, CM = Cm.", 2),
    ]},
  ],
  "bac-type-g-eco-1": [
    {"title": "I. Connaissances (6 pts)", "context": "Questions de cours.", "steps": [
      ("Le PIB mesure :", ["la richesse produite sur le territoire en un an (somme des valeurs ajoutées)", "la richesse des seuls nationaux à l'étranger", "l'argent des banques", "le total des importations"], 0, "PIB = somme des valeurs ajoutées des unités résidentes + impôts sur les produits.", 1.5),
      ("L'inflation est :", ["une hausse générale et durable des prix", "une baisse des prix", "une hausse du chômage", "une hausse des salaires d'une seule entreprise"], 0, "Le contraire est la déflation.", 1.5),
      ("La banque centrale des pays de l'UEMOA est :", ["la BCEAO", "la BAD", "la Banque mondiale", "le FMI"], 0, "La BCEAO émet le franc CFA et mène la politique monétaire.", 1.5),
      ("Un impôt direct est, par exemple :", ["l'impôt sur le revenu", "la TVA", "les droits de douane", "la taxe sur les carburants"], 0, "L'impôt direct est payé par celui qui le supporte ; la TVA est indirecte.", 1.5),
    ]},
    {"title": "II. Exercice chiffré (8 pts)", "context": "Un pays a un PIB de 18 000 milliards de F en 2023 et de 19 260 milliards en 2024 (prix courants). L'inflation est de 3 %. Population : 18 millions. Exportations : 3 000 milliards ; importations : 4 500 milliards. Actifs : 6 millions dont 900 000 chômeurs.", "steps": [
      ("Le taux de croissance du PIB nominal est :", ["7 %", "3 %", "12,6 %", "1 260 %"], 0, "(19 260 − 18 000)/18 000 × 100 = 7 %.", 1.5),
      ("Le taux de croissance réel est environ :", ["3,9 %", "7 %", "10 %", "4 %"], 0, "1,07/1,03 − 1 ≈ 3,9 % (approximation : 7 − 3 = 4 %).", 1.5),
      ("Le PIB par habitant en 2024 est :", ["1 070 000 F", "107 000 F", "10 700 F", "1 000 000 F"], 0, "19 260 milliards ÷ 18 millions.", 1.5),
      ("Le taux de couverture des importations par les exportations est :", ["66,7 %", "150 %", "33,3 %", "75 %"], 0, "3 000/4 500 × 100 : moins de 100 %, la balance commerciale est déficitaire de 1 500 milliards.", 2),
      ("Le taux de chômage est :", ["15 %", "6 %", "9 %", "85 %"], 0, "900 000/6 000 000 × 100.", 1.5),
    ]},
    {"title": "III. Analyse (6 pts)", "context": "Le gouvernement veut à la fois relancer la croissance et freiner l'inflation.", "steps": [
      ("Une politique budgétaire de relance consiste à :", ["augmenter les dépenses publiques ou baisser les impôts", "augmenter les impôts", "réduire les salaires", "fermer les frontières"], 0, "Elle soutient la demande, mais peut creuser le déficit.", 1.5),
      ("Pour freiner l'inflation, la banque centrale peut :", ["relever ses taux directeurs", "imprimer plus de monnaie", "baisser les taux", "supprimer les banques"], 0, "Un crédit plus cher réduit la demande et la création monétaire.", 1.5),
      ("Un déficit commercial durable peut être réduit par :", ["le développement des exportations et la transformation locale des produits", "plus d'importations", "la hausse des prix à l'exportation sans qualité", "la fin de la production"], 0, "Exemple : transformer l'arachide ou le phosphate sur place.", 1.5),
      ("Dans une analyse, chaque argument doit être :", ["expliqué et illustré par un exemple ou un chiffre", "seulement cité", "écrit en une ligne", "recopié du sujet"], 0, "Idée, explication, exemple.", 1.5),
    ]},
  ],
  "bac-type-g-compta-1": [
    {"title": "Dossier 1 : amortissements (6 pts)", "context": "Une machine est acquise le 1er janvier N pour 6 000 000 F HT. Durée d'utilisation : 5 ans.", "steps": [
      ("Le taux d'amortissement linéaire est :", ["20 %", "5 %", "25 %", "40 %"], 0, "Taux = 100/durée = 100/5.", 1),
      ("L'annuité linéaire est :", ["1 200 000 F", "600 000 F", "2 400 000 F", "300 000 F"], 0, "6 000 000 × 20 %.", 1),
      ("La valeur nette comptable fin N+2 est :", ["2 400 000 F", "3 600 000 F", "4 800 000 F", "1 200 000 F"], 0, "VNC = 6 000 000 − 3 × 1 200 000.", 1.5),
      ("L'écriture de dotation est :", ["débit 681 Dotations aux amortissements, crédit 284 Amortissements du matériel", "débit 284, crédit 681", "débit 241, crédit 521", "débit 601, crédit 401"], 0, "La dotation est une charge (classe 6) ; l'amortissement cumulé se met au crédit du compte 28.", 1.5),
      ("En dégressif (coefficient 2 pour 5 ans), la première annuité est :", ["2 400 000 F", "1 200 000 F", "1 800 000 F", "3 000 000 F"], 0, "Taux dégressif = 20 % × 2 = 40 % ; 6 000 000 × 40 %.", 1),
    ]},
    {"title": "Dossier 2 : enregistrements au journal (5 pts)", "context": "Achat à crédit de marchandises : 500 000 F HT, TVA 18 %.", "steps": [
      ("Le montant de la TVA est :", ["90 000 F", "18 000 F", "500 000 F", "590 000 F"], 0, "500 000 × 18 %.", 1),
      ("Le montant TTC est :", ["590 000 F", "518 000 F", "500 000 F", "410 000 F"], 0, "HT + TVA.", 1),
      ("Le compte débité pour le HT est :", ["601 Achats de marchandises", "701 Ventes de marchandises", "401 Fournisseurs", "521 Banque"], 0, "L'achat est une charge (classe 6).", 1),
      ("La TVA récupérable est débitée au compte :", ["4452 État, TVA récupérable sur achats", "4431 TVA facturée", "701", "411"], 0, "La TVA sur achats est une créance sur l'État.", 1),
      ("Le compte crédité pour 590 000 F est :", ["401 Fournisseurs", "411 Clients", "601", "571 Caisse"], 0, "Achat à crédit : dette envers le fournisseur.", 1),
    ]},
    {"title": "Dossier 3 : résultat et bilan (9 pts)", "context": "Produits de l'exercice : 12 000 000 F ; charges : 10 500 000 F. Bilan : actif immobilisé net 8 000 000 F ; actif circulant 5 000 000 F ; trésorerie-actif 1 000 000 F ; capitaux propres 7 000 000 F ; dettes financières 3 000 000 F ; passif circulant 4 000 000 F.", "steps": [
      ("Le résultat de l'exercice est :", ["un bénéfice de 1 500 000 F", "une perte de 1 500 000 F", "22 500 000 F", "nul"], 0, "Résultat = produits − charges.", 1.5),
      ("Le total du bilan vaut :", ["14 000 000 F", "13 000 000 F", "10 000 000 F", "22 000 000 F"], 0, "Actif : 8 + 5 + 1 = 14 millions ; passif : 7 + 3 + 4 = 14 millions.", 1.5),
      ("Le fonds de roulement vaut :", ["2 000 000 F", "1 000 000 F", "−2 000 000 F", "10 000 000 F"], 0, "FR = ressources stables (7 + 3) − actif immobilisé (8).", 2),
      ("Le besoin en fonds de roulement vaut :", ["1 000 000 F", "2 000 000 F", "9 000 000 F", "−1 000 000 F"], 0, "BFR = actif circulant (5) − passif circulant (4).", 2),
      ("La trésorerie nette vaut :", ["1 000 000 F, ce qui est cohérent avec la trésorerie-actif", "3 000 000 F", "0 F", "−1 000 000 F"], 0, "TN = FR − BFR = 2 − 1 = 1 million.", 2),
    ]},
  ],
}

for _a in ANNALES_LG:
    _pts = sum(s[4] for p in GUIDED_LG[_a["id"]] for s in p["steps"])
    assert abs(_pts - 20) < 1e-9, (_a["id"], _pts)
