# Liste de RÉFÉRENCES (non publiée dans l'appli, à la demande d'Est) : sources publiques dont s'inspire le contenu maison.
# Cours, exercices corrigés, devoirs et QCM gratuits en ligne, publiés par des plateformes sénégalaises :
# - le ministère de l'Éducation nationale (bibliothèque numérique scolaire lancée le 20 avril 2026 : Promet et Senkala),
# - l'Office du BAC (grilles officielles de correction),
# - sunudaara.com (cours, séries d'exercices avec solutions, devoirs corrigés, QCM et corrigés du BFEM, conformes au programme sénégalais).
# Chaque entrée : (niveaux, matière, type, titre, url). Relevé le 2026-10-30.

SD = "https://www.sunudaara.com/"
M, P, SV, HG = "Mathématiques", "Physique-Chimie", "SVT", "Histoire-Géographie"
ALL = ["6e", "5e", "4e", "3e", "2nde", "1ère", "Tle"]
LYC_S = ["2nde S", "1ère S", "Tle S"]

def _sd(levels, subject, kind, pairs):
    return [(levels, subject, kind, t, u if u.startswith("http") else SD + u) for t, u in pairs]

RESSOURCES = [
  (ALL, "Toutes matières", "Ministère", "Promet : cours en vidéo et contenus téléchargeables (bibliothèque numérique du ministère, gratuite)", "https://apprendre.education.sn"),
  (ALL, "Toutes matières", "Ministère", "Senkala : exercices et révisions en ligne (ministère, gratuit)", "https://senprof2.education.sn"),
  (["Tle"], "Français", "Office du BAC", "Grilles officielles de correction du français au BAC (résumé, discussion, commentaire, dissertation)", "https://officedubac.sn/wp-content/uploads/2025/07/Grilles-de-correction-des-copies-pour-les-epreuves-du-premier-groupe.pdf"),
]

# --- 6e ---
RESSOURCES += _sd(["6e"], M, "Exercices corrigés", [
  ("Nombres décimaux : rangement", "mathematiques/solution-des-exercices-rangement-des-nombres-d%C3%A9cimaux-arithm%C3%A9tiques-6e"),
  ("Soustraction des décimaux", "mathematiques/solution-des-exercices-soustraction-des-nombres-d%C3%A9cimaux-arithm%C3%A9tiques-6e"),
  ("Multiplication des décimaux", "mathematiques/solution-des-exercices-multiplication-des-nombres-d%C3%A9cimaux-arithm%C3%A9tiques-6e"),
  ("Division des décimaux", "mathematiques/solution-des-exercices-division-des-nombres-d%C3%A9cimaux-arithm%C3%A9tiques-6e"),
  ("Organisation d'un calcul", "mathematiques/solution-des-exercices-organisation-dun-calcul-6e"),
  ("Les fractions", "mathematiques/solution-des-exercices-les-fractions-6e"),
  ("Introduction à la géométrie : le plan et ses parties", "mathematiques/solution-des-exercices-introduction-%C3%A0-la-g%C3%A9om%C3%A9trie-le-plan-et-ses-parties-6e"),
  ("Droites perpendiculaires et parallèles", "mathematiques/solution-des-exercices-droites-perpendiculaires-et-droites-parall%C3%A8les-6e"),
  ("Les angles", "mathematiques/solution-des-exercices-les-angles-6e"),
  ("Les triangles", "mathematiques/solution-des-exercices-les-triangles-6e"),
  ("Symétrie orthogonale", "mathematiques/solution-des-exercices-sym%C3%A9trie-orthogonale-6e"),
  ("Repérage sur une droite et dans le plan", "mathematiques/solution-des-exercices-rep%C3%A9rage-sur-une-droite-et-dans-le-plan-6e"),
]) + _sd(["6e"], M, "Devoirs corrigés", [(f"Corrigé du devoir n° {i}", f"mathematiques/corrig%C3%A9-devoir-n%C2%B0-{i}-maths-6e") for i in range(1, 6)]) \
  + _sd(["6e"], M, "QCM", [(f"QCM {i} de maths", f"content/qcm-{i}-maths-6e") for i in range(4, 9)]) \
  + _sd(["6e"], SV, "Exercices corrigés", [
  ("Classification et répartition des êtres vivants", "svt/solution-des-exercices-sur-classification-et-r%C3%A9partition-des-%C3%AAtres-vivants-6e"),
  ("Cellules et division cellulaire", "svt/solution-s%C3%A9rie-dexercices-sur-lintroduction-aux-notions-de-cellules-et-division-cellulaire-6e"),
  ("Déplacement des animaux en milieu terrestre", "svt/solution-des-exercices-le-d%C3%A9placement-chez-les-animaux-adaptation-aux-d%C3%A9placements-en-milieu"),
  ("Déplacement des animaux en milieu aérien", "svt/solution-des-exercices-le-d%C3%A9placement-chez-les-animaux-adaptation-aux-d%C3%A9placements-en-milieu-0"),
  ("Déplacement des animaux en milieu aquatique", "svt/solution-des-exercices-le-d%C3%A9placement-chez-les-animaux-adaptation-aux-d%C3%A9placements-en-milieu-1"),
  ("Comment obtenir une nouvelle plante", "svt/solution-des-exercices-comment-obtenir-une-nouvelle-plante-6e"),
  ("Production d'aliments par les végétaux chlorophylliens", "svt/solution-des-exercices-la-production-daliments-par-les-v%C3%A9g%C3%A9taux-chlorophylliens-6e"),
  ("Amélioration de la production d'aliments", "svt/solution-des-exercices-lam%C3%A9lioration-de-la-production-daliments-par-les-animaux-et-les-v%C3%A9g%C3%A9taux"),
  ("Le paludisme", "svt/solution-des-exercices-le-paludisme-6e"),
]) + _sd(["6e"], SV, "Cours", [("Classification et répartition des êtres vivants", "svt/classification-et-r%C3%A9partition-des-%C3%AAtres-vivants-6e")]) \
  + _sd(["6e"], HG, "Cours", [
  ("L'Éthiopie antique", "histo-geo/l%C3%A9thiopie-antique-6e"),
  ("La civilisation carthaginoise", "histo-geo/la-civilisation-carthaginoise-6e"),
  ("La Mésopotamie", "histo-geo/la-m%C3%A9sopotamie-le-pays-les-hommes-les-grandes-p%C3%A9riodes-de-lhistoire-6e"),
  ("La Palestine", "histo-geo/la-palestine-6e"),
  ("La Grèce : le pays, les hommes, les grandes périodes", "histo-geo/la-gr%C3%A8ce-le-pays-les-hommes-les-grandes-p%C3%A9riodes-de-lhistoire-6e"),
  ("Les civilisations grecques", "histo-geo/les-civilisations-grecques-6e"),
  ("Rome, de la cité à l'empire", "histo-geo/rome-de-la-cit%C3%A9-%C3%A0-lempire-6e"),
  ("La civilisation romaine", "histo-geo/la-civilisation-romaine-et-son-%C3%A9volution-6e"),
  ("Le christianisme dans le monde romain", "histo-geo/le-christianisme-et-son-expansion-dans-le-monde-romain-6e"),
  ("Les grandes invasions en Europe et en Afrique", "histo-geo/les-grandes-invasions-en-europe-et-en-afrique-6e"),
  ("Dakar et le littoral central : étude de situation", "histo-geo/dakar-et-le-littoral-central-%C3%A9tude-de-situation-6e"),
  ("La vallée du fleuve Sénégal : étude de situation", "histo-geo/la-vall%C3%A9e-du-fleuve-s%C3%A9n%C3%A9gal-%C3%A9tude-de-situation-6e"),
  ("Le Ferlo : étude de situation", "histo-geo/le-ferlo-%C3%A9tude-de-situation-6e"),
  ("La Casamance : étude de situation", "histo-geo/la-casamance-%C3%A9tude-de-situation-6e"),
  ("Le Haut-Sénégal (Sud-Est) : étude de situation", "histo-geo/le-haut-s%C3%A9n%C3%A9gal-sud-est-%C3%A9tude-de-situation-6e"),
])

# --- 5e ---
RESSOURCES += _sd(["5e"], M, "Exercices corrigés", [
  ("Nombres décimaux relatifs", "mathematiques/solution-des-exercices-ensemble-d-des-nombres-d%C3%A9cimaux-relatifs-5e"),
  ("Puissances dans D", "mathematiques/solution-s%C3%A9rie-dexercices-puissances-dans-d-5e"),
  ("Multiples et diviseurs", "mathematiques/solution-des-exercices-multiples-et-diviseurs-5e"),
  ("Proportionnalité", "mathematiques/solution-des-exercices-proportionnalit%C3%A9-5e"),
  ("Les angles", "mathematiques/solution-des-exercices-les-angles-5e"),
  ("Les triangles", "mathematiques/solution-des-exercices-les-triangles-5e"),
  ("Symétrie centrale", "mathematiques/solution-des-exercices-sym%C3%A9trie-centrale-5e"),
  ("Les parallélogrammes", "mathematiques/solution-des-exercices-les-parall%C3%A9logrammes-5e"),
  ("Le rectangle", "mathematiques/solution-des-exercices-le-rectangle-5e"),
  ("Repérage dans le plan", "mathematiques/solution-des-exercices-rep%C3%A9rage-dans-le-plan-5e"),
]) + _sd(["5e"], M, "Cours", [("Proportionnalité", "mathematiques/proportionnalit%C3%A9-5e"), ("Le quadrilatère", "mathematiques/le-quadrilat%C3%A8re-5e"), ("Géométrie dans l'espace", "mathematiques/g%C3%A9om%C3%A9trie-dans-lespace-5e")]) \
  + _sd(["5e"], M, "Devoirs corrigés", [(f"Corrigé du devoir n° {i}", f"mathematiques/corrig%C3%A9-devoir-n%C2%B0-{i}-maths-5e") for i in range(1, 6)]) \
  + _sd(["5e"], SV, "Exercices corrigés", [
  ("Besoins de l'organisme et mauvaise alimentation", "svt/solution-des-exercices-sur-les-besoins-de-lorganisme-et-cons%C3%A9quences-dune-mauvaise-alimentation"),
  ("L'alimentation chez les animaux", "svt/solution-des-exercices-sur-lalimentation-chez-les-animaux-adaptation-aux-diff%C3%A9rents-r%C3%A9gimes"),
  ("La respiration chez les animaux", "svt/solution-des-exercices-la-respiration-chez-les-animaux-adaptation-aux-diff%C3%A9rents-milieux-de-vie"),
  ("La reproduction chez les plantes à fleurs", "svt/solution-des-exercices-sur-la-reproduction-chez-les-plantes-%C3%A0-fleurs-5e"),
  ("La reproduction chez les plantes sans fleurs", "svt/solution-des-exercices-sur-la-reproduction-chez-les-plantes-sans-fleurs-5e"),
  ("La reproduction chez les animaux", "svt/solution-des-exercices-la-reproduction-chez-les-animaux-poule-vache-criquet-5e"),
  ("Les sols : diversité et importance", "svt/solution-des-exercices-les-sols-diversit%C3%A9-et-importance-5e"),
  ("Genèse et évolution des sols", "svt/solution-des-exercices-la-gen%C3%A8se-et-l%C3%A9volution-des-sols-5e"),
  ("L'origine des roches sédimentaires", "svt/solution-des-exercices-lorigine-des-roches-s%C3%A9dimentaires-5e"),
  ("Les pollutions et leurs conséquences", "svt/solution-des-exercices-sur-les-pollutions-et-leurs-cons%C3%A9quences-5e"),
  ("Le cadre de vie", "svt/solution-des-exercices-le-cadre-de-vie-5e"),
]) + _sd(["5e"], HG, "Cours", [
  ("La naissance de l'islam", "histo-geo/la-naissance-de-lislam-larabie-pr%C3%A9islamique-mohamed-le-coran-5e"),
  ("L'expansion musulmane", "histo-geo/lexpansion-musulmane-5e"),
  ("L'empire du Ghana", "histo-geo/lempire-du-ghana-formation-et-expansion-civilisation-5e"),
  ("Le mouvement almoravide", "histo-geo/le-mouvement-almoravide-5e"),
  ("L'empire du Mali", "histo-geo/lempire-du-mali-5e"),
  ("L'empire Songhaï", "histo-geo/lempire-songhai-5e"),
  ("Le Tékrour et le Fouta", "histo-geo/le-t%C3%A9krour-et-le-fouta-5e"),
  ("L'empire du Jolof", "histo-geo/lempire-du-jolof-5e"),
  ("L'empire du Gaabou", "histo-geo/lempire-du-gaabou-5e"),
  ("Le système féodal en Europe", "histo-geo/le-syst%C3%A8me-f%C3%A9odal-en-europe-5e"),
  ("Humanisme et Renaissance", "histo-geo/humanisme-et-renaissance-en-europe-5e"),
  ("Les grands voyages de découvertes", "histo-geo/les-grands-voyages-de-d%C3%A9couvertes-5e"),
  ("Le Sénégal : étude de situation", "histo-geo/le-s%C3%A9n%C3%A9gal-%C3%A9tude-de-situation-5e"),
  ("Le relief du Sénégal", "histo-geo/le-relief-5e"),
  ("Le climat", "histo-geo/le-climat-5e"),
  ("Construire un diagramme climatique", "histo-geo/m%C3%A9thodologie-de-construction-dun-diagramme-climatique-5e"),
  ("Hydrographie", "histo-geo/hydrographie-5e"),
  ("Accroissement de la population", "histo-geo/accroissement-de-la-population-5e"),
  ("Construire une pyramide des âges", "histo-geo/construire-une-pyramide-des-ages-5e"),
  ("Les villes", "histo-geo/les-villes-5e"),
  ("Agriculture", "histo-geo/agriculture-5e"),
  ("Pêche", "histo-geo/p%C3%A8che-5e"),
  ("Élevage", "histo-geo/%C3%A9levage-5e"),
  ("Tourisme", "histo-geo/tourisme-5e"),
])

# --- 4e ---
RESSOURCES += _sd(["4e"], M, "Cours", [
  ("Nombres rationnels", "mathematiques/nombres-rationnels-4e"), ("Calcul algébrique", "mathematiques/calcul-alg%C3%A9brique-4e"),
  ("Triangle rectangle et Pythagore", "mathematiques/triangle-rectangle-th%C3%A9or%C3%A8me-de-pythagore-4e"), ("Distance", "mathematiques/distance-4e"), ("Statistique", "mathematiques/statistique-4e"),
]) + _sd(["4e"], M, "Exercices corrigés", [
  ("Série : distances", "mathematiques/s%C3%A9rie-dexercices-distances-4e"), ("Série : vecteurs et translations", "mathematiques/s%C3%A9rie-dexercices-vecteurs-et-translations-4e"),
  ("Solutions : droite des milieux", "mathematiques/solution-des-exercices-droites-des-milieux-4e"),
]) + _sd(["4e"], M, "QCM", [("QCM 1 de maths", "content/qcm1-math-4e")]) \
  + _sd(["4e"], P, "Cours", [
  ("Grandeurs physiques et mesures", "physique_chimie/grandeurs-physiques-et-mesures-4e"), ("Mélanges et corps purs", "physique_chimie/m%C3%A9langes-et-corps-purs-4e"),
  ("Structure de la matière", "physique_chimie/structure-de-la-mati%C3%A8re-4e"), ("Introduction à l'électricité", "physique_chimie/introduction-%C3%A0-l%C3%A9lectricit%C3%A9-4e"),
  ("Réflexion et réfraction de la lumière", "physique_chimie/r%C3%A9flexion-et-r%C3%A9fraction-de-la-lumi%C3%A8re-4e"),
]) + _sd(["4e"], P, "Devoirs corrigés", [("Corrigé du devoir n° 1", "physique_chimie/corrig%C3%A9-devoir-n%C2%B0-1-physique-chimie-4e")]) \
  + _sd(["4e"], SV, "Cours", [
  ("Le volcanisme", "svt/le-volcanisme-4e"), ("Les séismes et la structure du globe", "svt/les-s%C3%A9ismes-et-structure-du-globe-4e"),
  ("Les roches magmatiques", "svt/les-roches-magmatiques-4e"), ("Le sang : composition et maladies", "svt/le-sang-composition-et-maladies-4e"),
  ("La circulation et le rôle du sang", "svt/la-circulation-et-le-role-du-sang-4e"), ("Comment éviter une grossesse", "svt/comment-%C3%A9viter-une-grossesse-4e"),
  ("La transmission des caractères héréditaires", "svt/la-transmission-des-caract%C3%A8res-h%C3%A9r%C3%A9ditaires-4e"),
]) + _sd(["4e"], SV, "Exercices corrigés", [("Solutions : le volcanisme", "svt/solution-des-exercices-le-volcanisme-4e")]) \
  + _sd(["4e"], HG, "Cours", [
  ("La traite négrière au Sénégal", "histo-geo/la-traite-n%C3%A9gri%C3%A8re-au-s%C3%A9n%C3%A9gal-4e"), ("Le mouvement abolitionniste", "histo-geo/le-mouvement-abolitionniste-4e"),
  ("La Révolution française de 1789", "histo-geo/la-r%C3%A9volution-fran%C3%A7aise-de-1789-et-ces-cons%C3%A9quences-4e"), ("L'empire ottoman", "histo-geo/lempire-ottoman-4e"),
  ("Le relief et le climat", "histo-geo/le-relief-et-le-climat-4e"), ("L'Europe : la population", "histo-geo/leurope-la-population-4e"), ("L'Amérique : étude de situation", "histo-geo/lam%C3%A9rique-%C3%A9tude-de-situation-4e"),
])

# --- 3e ---
RESSOURCES += _sd(["3e"], M, "Cours", [
  ("Racine carrée", "mathematiques/racine-carr%C3%A9e-3e"), ("Calcul algébrique", "mathematiques/calcul-alg%C3%A9brique-3e"),
  ("Équations et inéquations à une inconnue", "mathematiques/%C3%A9quation-et-in%C3%A9quation-%C3%A0-une-seule-inconnue-3e"),
  ("Équations et inéquations à deux inconnues", "mathematiques/%C3%A9quations-et-in%C3%A9quations-du-1er-degr%C3%A9-%C3%A0-deux-inconnues-3e"),
  ("Application affine", "mathematiques/application-affine-application-affine-par-intervalle-3e"), ("Statistique", "mathematiques/statistique-3e"),
  ("Théorème de Thalès", "mathematiques/th%C3%A9or%C3%A8me-de-thal%C3%A8s-3e"), ("Relations trigonométriques", "mathematiques/relations-trigonom%C3%A9triques-dans-un-triangle-rectangle-3e"),
  ("Vecteurs", "mathematiques/vecteurs-3e"), ("Repérage dans le plan", "mathematiques/rep%C3%A9rage-dans-le-plan-3e"),
  ("Angle inscrit, angle au centre", "mathematiques/angle-inscrit-angle-au-centre-3e"), ("Géométrie dans l'espace", "mathematiques/g%C3%A9om%C3%A9trie-dans-lespace-3e"),
]) + _sd(["3e"], M, "Exercices corrigés", [
  ("Calcul algébrique", "mathematiques/solution-des-exercices-calcul-alg%C3%A9brique-3e"), ("Racine carrée", "mathematiques/solution-des-exercices-racine-carr%C3%A9e-3e"),
  ("Équations et inéquations à une inconnue", "mathematiques/solution-des-exercices-%C3%A9quations-et-in%C3%A9quations-du-1er-degr%C3%A9-%C3%A0-une-inconnue-3e"),
  ("Systèmes d'équations à deux inconnues", "mathematiques/solution-des-exercices-syst%C3%A8mes-d%C3%A9quations-%C3%A0-deux-inconnues-3e"),
  ("Inéquations et systèmes d'inéquations", "mathematiques/solution-des-exercices-in%C3%A9quations-et-syst%C3%A8mes-din%C3%A9quations-%C3%A0-deux-inconnues-3e"),
  ("Application affine", "mathematiques/solution-des-exercices-application-affine-3e"), ("Statistique", "mathematiques/solution-des-exercices-statistique-3e"),
  ("Théorème de Thalès", "mathematiques/solution-des-exercices-th%C3%A9or%C3%A8me-de-thal%C3%A8s-3e"), ("Trigonométrie", "mathematiques/solution-des-exercices-trigonom%C3%A9trie-3e"),
  ("Vecteurs", "mathematiques/solution-des-exercices-les-vecteurs-3e"), ("Repérage", "mathematiques/solution-des-exercices-rep%C3%A9rage-3e"),
  ("Angle au centre, angle inscrit", "mathematiques/solution-des-exercices-angle-au-centre-angle-inscrit-3e"), ("Géométrie dans l'espace", "mathematiques/solution-des-exercices-g%C3%A9om%C3%A9trie-dans-lespace-3e"),
]) + _sd(["3e"], M, "Devoirs corrigés", [(f"Corrigé du devoir n° {i}", f"mathematiques/corrig%C3%A9-devoir-n%C2%B0-{i}-maths-3e") for i in (1, 2, 3, 4, 6)]) \
  + _sd(["3e"], M, "QCM", [("QCM 1", "content/qcm1-maths-3e"), ("QCM 2", "content/qcm2-maths-3e"), ("QCM 3", "content/qcm-3-math-3e"), ("QCM 4", "content/qcm4-maths-3e"), ("QCM 5", "content/qcm-5-maths-3e"), ("QCM 6", "content/qcm-6-maths-3e"), ("QCM 7", "content/qcm-7-maths-3e"), ("QCM 8", "content/qcm-8-maths-3e"), ("QCM 9", "content/qcm-9-maths-3e"), ("QCM 10", "content/qcm10-maths-3e"), ("QCM 11", "content/qcm11-maths-3e")]) \
  + _sd(["3e"], M, "Vidéos", [("Cours vidéo : racine carrée", "content/cours-vid%C3%A9o-racine-carr%C3%A9e"), ("Vidéo : exercice sur les vecteurs", "content/vid%C3%A9o-exercice-vecteur-3e"), ("Vidéo : exercice de calcul algébrique", "content/vid%C3%A9o-exercice-calcul-alg%C3%A9brique-3e"), ("Vidéo : angle inscrit, angle au centre", "content/vid%C3%A9o-angle-inscrit-angle-au-centre-dans-un-cercle"), ("Vidéo : Pythagore et trigonométrie", "content/vid%C3%A9o-th%C3%A9or%C3%A8me-de-pythagore-et-relation-trigonom%C3%A9trique-dans-un-triangle-rectangle")]) \
  + _sd(["3e"], P, "Cours", [
  ("Notions de solutions", "physique_chimie/notions-de-solutions-3e"), ("Solutions acides, solutions basiques", "physique_chimie/solutions-acides-solutions-basiques-3e"),
  ("Action des acides dilués sur les métaux", "physique_chimie/action-%C3%A0-froid-des-acides-dilu%C3%A9s-sur-les-m%C3%A9taux-usuels-3e"),
  ("Les métaux : action de l'air et combustion", "physique_chimie/les-m%C3%A9taux-action-de-lair-et-combustion-3e"), ("Les hydrocarbures", "physique_chimie/les-hydrocarbures-3e"),
]) + _sd(["3e"], P, "Exercices corrigés", [
  ("Lentilles minces", "physique_chimie/solution-des-exercices-les-lentilles-minces-3e"), ("Dispersion de la lumière blanche", "physique_chimie/solution-des-exercices-la-dispersion-de-la-lumi%C3%A8re-blanche-3e"),
  ("Les forces", "physique_chimie/solution-des-exercices-les-forces-3e"), ("Principe des actions réciproques", "physique_chimie/solution-des-exercices-principes-des-actions-r%C3%A9ciproques-3e"),
  ("Équilibre d'un solide soumis à deux forces", "physique_chimie/solution-des-exercices-%C3%A9quilibre-dun-solide-soumis-%C3%A0-laction-de-deux-forces-3e"),
  ("Travail et puissance mécaniques", "physique_chimie/solution-des-exercices-le-travail-et-la-puissance-m%C3%A9caniques-3e"),
  ("Électrisation par frottement", "physique_chimie/solution-des-exercices-%C3%A9lectrisation-par-frottement-3e"), ("Le courant électrique", "physique_chimie/solution-des-exercices-le-courant-%C3%A9lectrique-3e"),
  ("La résistance électrique", "physique_chimie/solution-des-exercices-la-r%C3%A9sistance-%C3%A9lectrique-3e"), ("La loi d'Ohm", "physique_chimie/solution-des-exercices-la-loi-dohm-3e"),
  ("Association de conducteurs ohmiques", "physique_chimie/solution-des-exercices-association-de-conducteurs-ohmiques-3e"),
  ("Énergie et rendement", "physique_chimie/solution-des-exercices-%C3%A9nergie-et-rendement-3e"), ("La calorimétrie", "physique_chimie/solution-des-exercices-la-calorim%C3%A9trie-3e"),
  ("Les solutions", "physique_chimie/solution-des-exercices-les-solutions-3e"), ("Solutions acides et basiques", "physique_chimie/solution-des-exercices-solutions-acides-solutions-basiques-3e"),
  ("Action des acides sur les métaux", "physique_chimie/solution-des-exercices-action-%C3%A0-froid-des-acides-dilu%C3%A9s-sur-les-m%C3%A9taux-usuels-3e"),
  ("Les métaux", "physique_chimie/solution-des-exercices-les-m%C3%A9taux-3e"), ("Les hydrocarbures", "physique_chimie/solutions-des-exercices-les-hydrocarbures-3e"),
]) + _sd(["3e"], P, "QCM", [("QCM 1 de physique-chimie", "content/qcm-1-physique-chimie-3e"), ("QCM 2 de physique-chimie", "content/qcm-2-physique-chimie-3e")]) \
  + _sd(["3e"], SV, "Cours", [("Le système immunitaire", "svt/le-syst%C3%A8me-immunitaire-3e"), ("Étude de la vision", "svt/etude-de-la-vision-3e")]) \
  + _sd(["3e"], SV, "Exercices corrigés", [
  ("Le système nerveux", "svt/solution-des-exercices-le-fonctionnement-du-syst%C3%A8me-nerveux-3e"), ("La vision", "svt/solution-des-exercices-%C3%A9tude-de-la-vision-3e"),
  ("Le système immunitaire", "svt/solution-des-exercices-le-syst%C3%A8me-immunitaire-3e"), ("Les groupes sanguins", "svt/solution-des-exercices-les-groupes-sanguins-3e"),
  ("La tectonique des plaques", "svt/solution-des-exercices-la-tectonique-des-plaques-3e"), ("Le cycle des roches", "svt/solution-des-exercices-le-cycle-des-roches-3e"),
  ("Série : la fermentation", "svt/s%C3%A9rie-dexercices-sur-la-fermentation-3e"), ("Série : la respiration chez l'Homme", "svt/s%C3%A9rie-dexercices-sur-la-respiration-chez-lesp%C3%A8ce-humaine-3e"),
  ("Série : chronologie en géologie", "svt/s%C3%A9rie-dexercices-sur-la-chronologie-en-g%C3%A9ologie-3e"), ("Série : roches métamorphiques", "svt/s%C3%A9rie-dexercices-sur-la-formation-des-roches-m%C3%A9tamorphiques-3e"),
]) + _sd(["3e"], HG, "Méthode", [
  ("Méthode du commentaire d'histoire et de géographie", "histo-geo/m%C3%A9thodologie-de-commentaire-d%E2%80%99histoire-et-de-g%C3%A9ographie-3e"),
  ("L'épreuve d'HG au BFEM : le commentaire", "histo-geo/l%E2%80%99%C3%A9preuve-d%E2%80%99histoire-g%C3%A9ographie-au-bfem-le-commentaire"),
  ("L'épreuve d'HG au BFEM : la dissertation", "histo-geo/l%E2%80%99%C3%A9preuve-d%E2%80%99histoire-g%C3%A9ographie-au-bfem-la-dissertation"),
]) + _sd(["3e"], HG, "Cours", [
  ("Les découvertes scientifiques et les mutations économiques", "histo-geo/les-d%C3%A9couvertes-scientifiques-et-les-mutations-%C3%A9conomiques-3e-0"),
  ("Le développement du capitalisme", "histo-geo/le-d%C3%A9veloppement-du-capitalisme-et-les-mutations-sociales-3e"),
  ("Les doctrines sociales", "histo-geo/les-doctrines-sociales-syndicalisme-et-socialisme-3e"),
  ("Missions et explorations", "histo-geo/les-missions-et-les-explorations-3e"),
  ("Le congrès de Berlin", "histo-geo/les-rivalit%C3%A9s-coloniales-le-congr%C3%A8s-de-berlin-et-ses-cons%C3%A9quences-3e"),
  ("Les résistances en Afrique", "histo-geo/les-r%C3%A9sistances-en-afrique-formes-exemples-et-bilan-3e"),
  ("Les systèmes coloniaux français et britannique", "histo-geo/les-syst%C3%A8mes-coloniaux-en-afrique-le-syst%C3%A8me-fran%C3%A7ais-et-le-syst%C3%A8me-britannique-3e"),
  ("La révolution russe", "histo-geo/la-r%C3%A9volution-russe-et-la-consolidation-du-r%C3%A9gime-3e"),
  ("La crise des années 30", "histo-geo/la-crise-des-ann%C3%A9es-30-3e"),
  ("La Seconde Guerre mondiale", "histo-geo/la-deuxi%C3%A8me-guerre-mondiale-causes-et-cons%C3%A9quences-3e-0"),
  ("Les révolutions chinoises", "histo-geo/les-r%C3%A9volutions-chinoises-de-sun-yat-sen-%C3%A0-mao-zedong-3e"),
  ("La décolonisation", "histo-geo/la-d%C3%A9colonisation-causes-et-formes-3e"),
  ("Bandung et le Tiers-monde", "histo-geo/bandung-et-%C3%A9mergence-du-tiers-monde-3e"),
  ("Le Sénégal de 1944 à 1962", "histo-geo/le-s%C3%A9n%C3%A9gal-vie-politique-de-1944-%C3%A0-1962-3e"),
  ("La Terre, un village planétaire", "histo-geo/la-terre-un-village-plan%C3%A9taire-3e"),
  ("Inégalités de développement", "histo-geo/in%C3%A9galit%C3%A9s-de-d%C3%A9veloppement-3e"),
  ("La coopération multilatérale", "histo-geo/la-coop%C3%A9ration-multilat%C3%A9rale-3e"),
  ("Surexploitation des ressources", "histo-geo/la-surexploitation-des-ressources-et-des-cons%C3%A9quences-3e"),
])

# --- 2nde ---
RESSOURCES += _sd(["2nde"], M, "Cours", [
  ("Calcul dans ℝ", "mathematiques/calcul-dans-r-2nd"), ("Équation du second degré", "mathematiques/%C3%A9quation-du-second-degr%C3%A9-2nd"),
  ("Systèmes d'équations et d'inéquations", "mathematiques/les-syst%C3%A8mes-d%C3%A9quations-et-din%C3%A9quations-2nd"), ("Polynômes", "mathematiques/polyn%C3%B4mes-2nd"),
  ("Généralités sur les fonctions", "mathematiques/g%C3%A9n%C3%A9ralit%C3%A9s-sur-les-fonctions-2nd"), ("Calcul vectoriel", "mathematiques/calcul-vectoriel-2nd"),
  ("Barycentre", "mathematiques/barycentre-2nd"), ("Repère cartésien", "mathematiques/rep%C3%A8re-cart%C3%A9sien-2nd"),
  ("Angles et trigonométrie", "mathematiques/angles-trigonom%C3%A9trie-2nd"), ("Produit scalaire", "mathematiques/produit-scalaire-2nd"),
]) + _sd(["2nde"], M, "Exercices corrigés", [
  ("Calcul dans ℝ", "mathematiques/solutions-exercices-calcul-dans-r-2nd"), ("Ordre dans ℝ et intervalles", "mathematiques/solutions-exercices-ordre-dans-r-intervalles-et-calculs-approch%C3%A9s-2nd"),
  ("Équations et inéquations du second degré", "mathematiques/solutions-des-exercices-%C3%A9quations-et-in%C3%A9quations-du-second-degr%C3%A9-2nd"),
  ("Systèmes à deux inconnues", "mathematiques/solutions-des-exercices-syst%C3%A8mes-d%C3%A9quations-et-din%C3%A9quations-%C3%A0-deux-inconnues-2nd"),
  ("Calcul vectoriel", "mathematiques/solutions-exercices-calcul-vectoriel-2nd"), ("Calcul vectoriel : savoir-faire", "mathematiques/calcul-vectoriel-2nd-savoir-faire"),
  ("Révision des acquis du collège", "mathematiques/solutions-des-exercices-r%C3%A9vision-activit%C3%A9s-num%C3%A9riques-coll%C3%A8ge-2nd-s"),
  ("Série : polynômes", "mathematiques/s%C3%A9rie-dexercices-les-polyn%C3%B4mes-2nd"), ("Série : fonctions", "mathematiques/s%C3%A9rie-dexercices-fonctions-2nd"),
  ("Série : barycentre", "mathematiques/s%C3%A9rie-dexercices-barycentre-2nd"), ("Série : trigonométrie", "mathematiques/s%C3%A9rie-dexercices-angles-trigonom%C3%A9trie-2nd"),
]) + _sd(["2nde S"], M, "Devoirs", [(f"Devoir n° {i} (2nde S)", f"mathematiques/devoir-n%C2%B0-{i}-2nd-s") for i in range(1, 34)]) \
  + _sd(["2nde L"], M, "Devoirs", [(f"Devoir n° {i} (2nde L)", f"mathematiques/devoir-n%C2%B0-{i}-2nd-l") for i in (1, 2, 3)]) \
  + _sd(["2nde"], M, "QCM", [("QCM 1", "content/qcm1-maths-2e"), ("QCM 2", "content/qcm-2-maths-2e"), ("QCM 3", "content/qcm3-maths-2e"), ("QCM 4", "content/qcm-4-maths-2e"), ("QCM 5", "content/qcm5-maths-2e"), ("QCM 6", "content/qcm6-maths-2e")]) \
  + _sd(["2nde S"], P, "Cours", [
  ("Mélanges et corps purs", "physique_chimie/m%C3%A9langes-et-corps-purs-2nd-s"), ("Éléments, atomes, classification", "physique_chimie/%C3%A9l%C3%A9ments-atomes-classifications-des-%C3%A9l%C3%A9ments-2nd-s"),
  ("Liaisons chimiques", "physique_chimie/liaisons-chimiques-2nd-s"), ("Mole et grandeurs molaires", "physique_chimie/mole-et-grandeurs-molaires-2nd-s"),
  ("Réactions chimiques, équation-bilan", "physique_chimie/r%C3%A9actions-chimiques-%C3%A9quation-bilan-2nd-s"), ("Solutions aqueuses", "physique_chimie/g%C3%A9n%C3%A9ralit%C3%A9s-sur-les-solutions-aqueuses-2nd-s"),
  ("Solutions acides", "physique_chimie/solutions-aqueuses-acides-2nd-s"), ("Solutions basiques", "physique_chimie/solutions-aqueuses-basiques-2nd-s"),
  ("Notion de pH, indicateurs colorés", "physique_chimie/notion-de-ph-indicateurs-color%C3%A9s-2nd-s"), ("Caractérisation de quelques ions", "physique_chimie/caract%C3%A9risation-de-quelques-ions-2nd-s"),
]) + _sd(["2nde S"], P, "Exercices", [
  ("Généralités sur le mouvement (avec solutions)", "physique_chimie/solution-des-exercices-g%C3%A9n%C3%A9ralit%C3%A9s-sur-le-mouvement-2nd-s"),
  ("Généralités sur les forces", "physique_chimie/s%C3%A9rie-dexercices-g%C3%A9n%C3%A9ralit%C3%A9s-sur-les-forces-2nd-s"), ("Poids et masse", "physique_chimie/s%C3%A9rie-dexercices-le-poids-la-masse-relation-entre-poids-et-masse-2nd-s"),
  ("Équilibre d'un solide soumis à des forces", "physique_chimie/s%C3%A9rie-dexercices-%C3%A9quilibre-dun-solide-soumis-%C3%A0-des-forces-2nd-s"),
  ("Équilibre d'un solide mobile autour d'un axe", "physique_chimie/s%C3%A9rie-dexercices-%C3%A9quilibre-dun-solide-mobile-autour-dun-axe-2nd-s"),
  ("Phénomènes d'électrisation", "physique_chimie/s%C3%A9rie-dexercices-ph%C3%A9nom%C3%A8nes-d%C3%A9lectrisation-2nd-s"), ("Intensité du courant", "physique_chimie/s%C3%A9rie-dexercices-intensit%C3%A9-du-courant-%C3%A9lectrique-2nd-s"),
  ("Tension électrique", "physique_chimie/s%C3%A9rie-dexercices-tension-%C3%A9lectrique-2nd-s"), ("Dipôles passifs", "physique_chimie/s%C3%A9rie-dexercices-dip%C3%B4les-passifs-2nd-s"),
  ("Dipôles actifs", "physique_chimie/s%C3%A9rie-dexercices-dip%C3%B4les-actifs-2nd-s"), ("Amplificateur opérationnel", "physique_chimie/s%C3%A9rie-dexercices-amplificateur-op%C3%A9rationnel-2nd-s"),
]) + _sd(["2nde"], SV, "Cours", [("Le fonctionnement de l'écosystème", "svt/le-fonctionnement-et-l%C3%A9volution-de-l%C3%A9cosyst%C3%A8me-2nd"), ("L'eau", "svt/leau-2nd"), ("Les sols", "svt/les-sols-2nd")])

# --- 1ère et Terminale : pages de rubrique (listes de cours, d'exercices et de devoirs) ---
RESSOURCES += _sd(["1ère S"], M, "Cours", [("Tous les cours de maths de 1ère", "cours-maths-1ere")]) \
  + _sd(["1ère S"], M, "Exercices", [("Toutes les séries d'exercices de maths de 1ère", "exercices-maths-1ere"), ("Transformations du plan (1ère S)", "mathematiques/s%C3%A9rie-dexercices-sur-les-transformations-du-plan-1e-s")]) \
  + _sd(["1ère S"], M, "Devoirs", [("Tous les devoirs de maths de 1ère", "devoir_math_premiere")]) \
  + _sd(["1ère S"], P, "Cours", [("Tous les cours de physique-chimie de 1ère", "cours-pc-premi%C3%A8re")]) \
  + _sd(["1ère S"], P, "Exercices", [("Toutes les séries de physique-chimie de 1ère", "http://www.sunudaara.com/exo-pc-premi%C3%A8re"), ("Les alcanes (1ère S)", "physique_chimie/s%C3%A9rie-dexercices-les-alcanes-1e-s")]) \
  + _sd(["1ère S"], SV, "Cours", [("Tous les cours de SVT de 1ère", "http://www.sunudaara.com/cours-svt-premi%C3%A8re"), ("Organisation d'une cellule", "svt/organisation-dune-cellule-1er-s")]) \
  + _sd(["Tle S"], M, "Cours", [("Tous les cours de maths de Terminale", "cours-maths-terminale-s")]) \
  + _sd(["Tle S"], M, "Exercices", [("Toutes les séries d'exercices de maths de Terminale", "exercices-maths-Terminale")]) \
  + _sd(["Tle S"], M, "Devoirs", [("Tous les devoirs de maths de Terminale", "devoir_math_terminale")]) \
  + _sd(["Tle S"], P, "Cours", [("Tous les cours de physique-chimie de Terminale", "cours-pc-terminale")]) \
  + _sd(["Tle S"], P, "Exercices", [("Toutes les séries de physique-chimie de Terminale", "exo-pc-terminale")]) \
  + _sd(["Tle S"], SV, "Exercices", [("Toutes les séries de SVT de Terminale", "exos_svt_terminale")]) \
  + _sd(["Tle L"], M, "Exercices corrigés", [
  ("Type BAC : suites numériques (TL)", "mathematiques/correction-exercices-dentrainement-types-bac-suite-num%C3%A9riques-tl"),
  ("Type BAC : statistiques (TL)", "mathematiques/correction-exercices-dentrainement-types-bac-statistiques-tl"),
  ("Type BAC : dénombrement et probabilités (TL)", "mathematiques/correction-exercices-dentrainement-types-bac-d%C3%A9nombrement-et-probabilit%C3%A9-tl"),
]) + _sd(["Tle"], "Philosophie", "Cours", [("Cours de philosophie", "http://www.sunudaara.com/cours-philo"), ("Savoir-faire : dissertation et commentaire", "http://www.sunudaara.com/savoir-faire-philo"), ("Textes philosophiques", "http://www.sunudaara.com/texte-philo"), ("Exercices de philosophie", "http://www.sunudaara.com/exercices-philo")]) \
  + _sd(["Tle"], HG, "Cours", [("Histoire de Terminale", "http://www.sunudaara.com/histoire-terminale"), ("Géographie de Terminale", "http://www.sunudaara.com/geographie-terminale")])

# Corrigés du BFEM (sunudaara), année par année
BFEM_CORRIGES = [(y, "Mathématiques", SD + f"bfem/bfem-math%C3%A9matiques-{y}") for y in range(2010, 2024)] \
  + [(2025, "Mathématiques", SD + "mathematiques/bfem-math%C3%A9matiques-2025"), (2019, "Mathématiques (2e groupe)", SD + "bfem/bfem-math%C3%A9matiques-2019-2i%C3%A8me-groupe"), (2018, "Mathématiques (2e groupe)", SD + "bfem/bfem-math%C3%A9matiques-2018-2i%C3%A8me-groupe")] \
  + [(y, "Physique-Chimie", SD + f"bfem/bfem-physique-chimie-{y}") for y in range(2005, 2023)] \
  + [(y, "SVT", SD + (f"bfem/bfem-svt-{y}" if y != 2009 else "node/1156")) for y in [2005] + list(range(2008, 2023))]
BFEM_CORRIGES = [e for e in BFEM_CORRIGES if not (e[1] == "Mathématiques" and e[0] == 2023)] + [(2023, "Mathématiques", SD + "bfem/bfem-math%C3%A9matiques-1er-groupe-2023")]

RESSOURCES += [(["3e"], s.split(" (")[0], "Sujets du BFEM", f"BFEM {y} {s} : sujet, avec le lien vers sa correction", u) for y, s, u in sorted(BFEM_CORRIGES, key=lambda e: -e[0])]

# --- Terminale : cours et séries chapitre par chapitre ---
RESSOURCES += _sd(["Tle S"], M, "Cours", [
  ("Révisions de trigonométrie", "mathematiques/r%C3%A9visions-de-trigonom%C3%A9trie-t-s"),
  ("Limites et continuité", "mathematiques/limites-et-continuit%C3%A9-rappels-et-compl%C3%A9ments-t-s"),
  ("Dérivabilité", "mathematiques/d%C3%A9rivabilit%C3%A9-t-s"),
  ("Dérivation et études de fonctions", "d%C3%A9rivation-et-%C3%A9tudes-de-fonctions-t-s"),
  ("Fonctions numériques : savoir-faire (S2)", "mathematiques/fonctions-num%C3%A9riques-t-s2-savoir-faire"),
  ("Fonctions logarithmes", "mathematiques/fonctions-logarithmes-t-s"),
  ("Exponentielles, puissances, croissances comparées", "mathematiques/fonctions-exponentielles-fonctions-puissances-croissances-compar%C3%A9es-t-s"),
  ("Suites numériques", "mathematiques/suites-num%C3%A9riques-t-s"),
  ("Calcul intégral", "mathematiques/calcul-int%C3%A9gral-t-s"),
  ("Équations différentielles", "mathematiques/%C3%A9quations-diff%C3%A9rentielles-t-s"),
  ("Nombres complexes", "mathematiques/les-nombres-complexes-t-s"),
  ("Similitudes planes directes", "mathematiques/similitudes-planes-directes-t-s"),
  ("Dénombrement", "mathematiques/d%C3%A9nombrement-t-s"),
  ("Probabilités", "mathematiques/probabilit%C3%A9s-t-s"),
]) + _sd(["Tle S1", "Tle S3"], M, "Cours", [
  ("Arithmétique (S1)", "mathematiques/arithm%C3%A9tique-t-s1"),
  ("Courbes paramétrées (S1)", "mathematiques/courbes-param%C3%A9tr%C3%A9es-t-s1"),
  ("Coniques (S1)", "coniques-t-s1"),
  ("Géométrie dans l'espace (S1)", "g%C3%A9om%C3%A9trie-dans-lespace-t-s1"),
  ("Isométries du plan (S1)", "transformations-isom%C3%A9tries-du-plan-t-s1"),
  ("Les angles (S1)", "les-angles-t-s1"),
  ("Fonctions de Leibniz (S1)", "fonctions-scalaires-et-vectorielles-de-leibniz-t-s1"),
]) + _sd(["Tle S"], M, "Exercices", [
  ("Limites et continuité", "mathematiques/s%C3%A9rie-dexercices-limites-et-continuit%C3%A9-ts"),
  ("Trigonométrie", "mathematiques/s%C3%A9rie-dexercices-trigonom%C3%A9trie-ts"),
  ("Dérivabilité", "mathematiques/s%C3%A9rie-dexercices-d%C3%A9rivabilit%C3%A9-ts"),
  ("Études de fonctions", "mathematiques/s%C3%A9rie-dexercices-etudes-de-fonctions-ts"),
  ("Logarithme népérien", "mathematiques/s%C3%A9rie-dexercices-fonction-logarithme-n%C3%A9p%C3%A9rien-ts"),
  ("Exponentielle", "mathematiques/s%C3%A9rie-dexercices-fonctions-exponentielle-ts"),
  ("Suites numériques", "mathematiques/s%C3%A9rie-dexercices-suites-num%C3%A9riques-ts"),
  ("Calcul intégral", "mathematiques/s%C3%A9rie-dexercices-calcul-int%C3%A9gral-ts"),
  ("Équations différentielles", "mathematiques/s%C3%A9rie-dexercices-%C3%A9quations-diff%C3%A9rentielles-ts"),
  ("Nombres complexes", "mathematiques/s%C3%A9rie-dexercice-nombres-complexes-ts"),
  ("Dénombrement", "mathematiques/s%C3%A9rie-dexercices-d%C3%A9nombrement-ts"),
  ("Probabilités", "mathematiques/s%C3%A9rie-dexercices-probabilit%C3%A9s-ts"),
  ("Statistiques", "mathematiques/s%C3%A9rie-dexercices-statistiques-ts"),
]) + _sd(["Tle L"], M, "Cours", [
  ("Applications et polynômes", "mathematiques/application-et-polyn%C3%B4me-tl"), ("Suites numériques", "mathematiques/suite-num%C3%A9riques-tl"),
  ("Fonction ln", "mathematiques/fonction-ln-tl"), ("Statistique", "mathematiques/statistique-tl"), ("Dénombrement et probabilités", "mathematiques/d%C3%A9nombrement-et-probabilit%C3%A9s-tl"),
]) + _sd(["Tle L"], M, "Exercices", [
  ("Logarithme népérien", "mathematiques/s%C3%A9rie-dexercices-fonction-logarithme-n%C3%A9p%C3%A9rien-tl"), ("Dénombrement", "mathematiques/s%C3%A9rie-dexercices-d%C3%A9nombrement-tl"), ("Combinaisons", "mathematiques/s%C3%A9rie-dexercice-combinaison-tl"),
]) + _sd(["Tle S"], P, "Cours", [
  ("Cinématique du point", "physique_chimie/cin%C3%A9matique-du-point-mat%C3%A9riel-ts"), ("Bases de la dynamique", "physique_chimie/bases-de-la-dynamique-ts"),
  ("Solide sur un plan incliné", "physique_chimie/mouvement-dun-solide-sur-un-plan-inclin%C3%A9-ts"), ("Chute verticale", "physique_chimie/mouvement-de-chute-verticale-dun-solide-ts"),
  ("Mouvement d'un projectile", "physique_chimie/mouvement-dun-projectile-dans-le-champ-de-pesanteur-terrestre-ts"),
  ("Particule chargée dans un champ électrique", "physique_chimie/mouvement-dune-particule-charg%C3%A9e-dans-un-champ-%C3%A9lectrostatique-e-uniforme-ts"),
  ("Pendule conique", "physique_chimie/mouvement-dun-pendule-conique-ts"), ("Gravitation universelle", "physique_chimie/gravitation-universelle-ts"),
  ("Mouvement des satellites", "physique_chimie/application-de-la-gravitation-universelle-au-mouvement-des-satellites-ts"),
  ("Champs magnétiques", "physique_chimie/g%C3%A9n%C3%A9ralit%C3%A9s-sur-les-champs-magn%C3%A9tiques-champs-magn%C3%A9tiques-des-courants-ts"),
  ("Loi de Laplace", "physique_chimie/loi-de-laplace-ts"), ("Induction et dipôle RL", "physique_chimie/induction-magn%C3%A9tique-%C3%A9tude-dun-dip%C3%B4le-r-l"),
  ("Dipôle RC", "physique_chimie/le-dip%C3%B4le-r-c-ts"), ("Oscillations électriques (S2)", "physique_chimie/oscillations-%C3%A9lectriques-libres-et-oscillations-%C3%A9lectriques-forc%C3%A9es-ts2"),
  ("Interférences lumineuses", "physique_chimie/interf%C3%A9rences-lumineuses-ts"), ("Effet photoélectrique", "physique_chimie/leffet-photo%C3%A9lectrique-ts"),
  ("Niveaux d'énergie de l'atome", "physique_chimie/niveaux-d%C3%A9nergie-dun-atome-ts"), ("Réactions nucléaires", "physique_chimie/r%C3%A9action-nucl%C3%A9aire-ts"),
  ("Les alcools", "physique_chimie/les-alcools-ts"), ("Les amines", "physique_chimie/les-amines-ts"),
  ("Acides carboxyliques et dérivés", "physique_chimie/les-acides-carboxyliques-et-d%C3%A9riv%C3%A9s-ts"), ("Cinétique chimique", "physique_chimie/cin%C3%A9tique-chimique-ts"),
  ("pH, autoprotolyse, indicateurs colorés", "physique_chimie/ph-dune-solution-aqueuse-autoprotolyse-de-leau-produit-ionique-indicateurs-color%C3%A9s"),
  ("Acide fort et base forte", "physique_chimie/notion-dacide-fort-et-de-base-forte-r%C3%A9action-entre-acide-fort-et-base-forte-ts"),
  ("Acides et bases faibles, dosages", "physique_chimie/acides-et-bases-faibles-dosage-des-acides-faibles-et-des-base-faibles-ts"),
  ("Acides α-aminés", "physique_chimie/les-acides-amin%C3%A9s-ts"),
]) + _sd(["Tle S"], P, "Exercices", [
  ("Cinématique", "physique_chimie/s%C3%A9rie-dexercices-cin%C3%A9matique-ts"), ("Dynamique", "physique_chimie/s%C3%A9rie-dexercices-dynamique-ts"),
  ("Gravitation universelle", "physique_chimie/s%C3%A9rie-dexercices-gravitation-universelle-ts"), ("Loi de Laplace", "physique_chimie/s%C3%A9rie-dexercices-loi-de-laplace-ts"),
  ("Induction, dipôle RL", "physique_chimie/s%C3%A9rie-dexercices-induction-magn%C3%A9tique-%C3%A9tude-dun-dip%C3%B4le-rl-ts"), ("Dipôle RC", "physique_chimie/s%C3%A9rie-dexercices-%C3%A9tude-du-dip%C3%B4le-rc-ts"),
  ("Oscillations mécaniques libres", "physique_chimie/s%C3%A9rie-dexercices-oscillations-m%C3%A9caniques-libres-ts"), ("Interférences lumineuses", "physique_chimie/s%C3%A9rie-dexercices-interf%C3%A9rences-lumineuses-ts"),
  ("Effet photoélectrique", "physique_chimie/s%C3%A9rie-dexercices-effet-photo%C3%A9lectrique-ts"), ("Niveaux d'énergie", "physique_chimie/s%C3%A9rie-dexercices-niveaux-d%C3%A9nergie-de-latome-ts"),
  ("Réactions nucléaires", "physique_chimie/s%C3%A9rie-dexercices-r%C3%A9actions-nucl%C3%A9aires-ts"), ("Les alcools", "physique_chimie/s%C3%A9rie-dexercices-sur-les-alcools-ts"),
  ("Les amines", "physique_chimie/s%C3%A9rie-dexercices-sur-les-amines-ts"), ("Acides carboxyliques", "physique_chimie/s%C3%A9rie-dexercices-sur-les-acides-carboxyliques-et-d%C3%A9riv%C3%A9s-ts"),
  ("Cinétique chimique", "physique_chimie/s%C3%A9rie-dexercices-sur-la-cin%C3%A9tique-chimique-ts"), ("pH et autoprotolyse", "physique_chimie/s%C3%A9rie-dexercices-sur-le-ph-dune-solution-aqueuse-autoprotolyse-de-leau-ts"),
  ("Acide fort, base forte", "physique_chimie/s%C3%A9rie-dexercices-sur-acide-fort-base-forte-r%C3%A9action-acide-fort-base-forte-ts"),
  ("Dosages acide-base", "physique_chimie/s%C3%A9rie-dexercices-sur-dosage-acide-base-ts"), ("Acides α-aminés", "physique_chimie/s%C3%A9rie-dexercices-sur-les-acides-amin%C3%A9s-ts"),
]) + _sd(["Tle L"], P, "Cours", [
  ("Production et transport de l'énergie électrique", "physique_chimie/production-transport-utilisation-de-l%C3%A9nergie-%C3%A9lectrique-tl"),
  ("Matières plastiques", "physique_chimie/mati%C3%A8res-plastiques-tl"), ("Les textiles", "physique_chimie/les-textiles-tl"), ("Les savons", "physique_chimie/les-savons-tl"),
  ("Signaux et ondes mécaniques", "physique_chimie/g%C3%A9n%C3%A9ralit%C3%A9s-sur-les-signaux-et-ondes-m%C3%A9caniques-tl"),
  ("Aspect ondulatoire de la lumière", "physique_chimie/aspect-ondulatoire-de-la-lumi%C3%A8re-tl"),
  ("Dualité onde-corpuscule", "physique_chimie/aspect-corpusculaire-de-la-lumi%C3%A8re-dualit%C3%A9-onde-corpuscule-tl-0"),
  ("Énergie nucléaire : fusion et fission", "physique_chimie/%C3%A9nergie-nucl%C3%A9aire-r%C3%A9actions-spontan%C3%A9es-fusion-et-fission-tl"),
])
