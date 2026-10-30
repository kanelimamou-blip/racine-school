# Racine School

Appli de téléphone pour réviser de la 6e à la Terminale au Sénégal (2nde L et S ; 1ère et Tle en L1a, L1b, L2, L', S1 à S5 et G) : quiz corrigés et expliqués, examens et devoirs blancs chronométrés, erreurs à revoir et progrès. Elle s'installe sur l'écran d'accueil et marche sans connexion.

En ligne : https://kanelimamou-blip.github.io/racine-school/ (version Racine School de l'appli Révision)

## Fichiers

- `contenu/` : les questions (`questions.py` pour la 3e et la Terminale, `q_college.py` de la 6e à la 4e, `q_lycee.py` pour la 2nde et la 1ère) `annales.py` pour les vrais sujets du BAC (structure, liens vers le PDF original et questions tirées de ces sujets, avec leur source), et `build.py`, qui génère `docs/data/`.
- `docs/` : l'appli (HTML/JS), publiée sur GitHub Pages à chaque modification.

## Premium

Pendant les 10 premiers jours (essai gratuit, `TRIAL_DAYS` dans `docs/app.js`), tout est débloqué ; ensuite, les 5 premières questions de chaque matière restent gratuites. Le reste et les examens blancs se débloquent avec un code vendu par Wave (prix, numéro Wave et WhatsApp dans `CONFIG` de `contenu/build.py`).
`python contenu/build.py --codes 100` ajoute des codes (format `XXXXX-XXXXXX`, contrôlés par un secret). La liste en clair, le secret et les règles Firestore à coller dans la console sont écrits hors du dépôt ; seuls les hachages sont publiés (`contenu/code_hashes.txt`).

## Comptes

`docs/compte.js` : connexion Google (Firebase Auth) et profil Firestore (date de création fixée par le serveur pour l'essai, premium accordé seulement si le code est réclamé une seule fois, progrès sauvegardés). Tant que `FIREBASE_CONFIG` est vide, l'appli fonctionne sans compte.

## Espace école (Racine School)

`docs/ecole.js` : au premier lancement, on choisit son profil. L'élève remplit sa fiche d'inscription (identité, classe, téléphones, WhatsApp, parent, photo). Le professeur et la direction entrent leur clé d'entrée (`python contenu/build.py --cles` l'écrit hors du dépôt, avec les règles Firestore). La direction voit les effectifs par classe, les progrès, les paiements de scolarité et les relances WhatsApp ; les professeurs publient des devoirs qui arrivent dans l'agenda des élèves de la classe. Sans Firebase, tout reste sur le téléphone.

`docs/vie-scolaire.js` : six profils (élève, parent, professeur, surveillant, personnel, direction ; clés DIR, PROF, SURV, PERS). Annonces et calendrier, annuaire de l'équipe (la direction peut retirer quelqu'un), appel en classe et cours du jour (affiché sur l'accueil des élèves avec les quiz qui vont avec), absents du jour et message WhatsApp au parent, portail (scan du QR code de la carte d'élève ou recherche par nom), caisse avec reçus numérotés, certificat de scolarité imprimable, export Excel (CSV), quiz en classe (au tableau ou sur les téléphones), espace parent relié par le code de la carte d'élève.

## Programme, chapitre par chapitre

Contenu repris de l'appli Révision et adapté : 58 matières (dont les maths des séries L et G et l'espagnol LV2 de la 4e à la Tle), 376 chapitres du programme officiel, chacun avec son cours (notions), sa synthèse, ses QCM et, en maths, physique-chimie, SVT, économie et comptabilité, ses formules (`contenu/formulaire.py` écrit à la main, complété par les formules des cours dans `contenu/formules.py`). `docs/chapitres.js` : parcours classe → matière → chapitre, avec les supports déposés par les professeurs de l'école en tête (champ « Chapitre du programme » à l'ajout d'un document). Formulaire, fiches flash et autres outils : `docs/vie.js` ; mieux apprendre : `docs/apprendre.js`.
