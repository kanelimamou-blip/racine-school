# Synthèses par chapitre pour les matières qui n'avaient qu'une fiche générale (français, histoire-géographie, anglais
# de la 6e à la 2nde). L'essentiel vient de la notion de cours du chapitre ; on ajoute la méthode, le piège et l'examen.

METHODES = {
  "francais": ("Répondre à une question de langue", [
    "Lire toute la phrase et repérer le mot ou le groupe demandé.",
    "Appliquer la règle du cours (test de remplacement, question à poser, accord).",
    "Rédiger la réponse en une phrase complète et vérifier l'orthographe.",
  ]),
  "histoire": ("Répondre à une question de cours en histoire", [
    "Repérer la période, le lieu et les acteurs.",
    "Donner les faits avec des dates précises.",
    "Expliquer les causes et les conséquences en quelques phrases.",
  ]),
  "geo": ("Répondre à une question de géographie", [
    "Localiser : continent, pays, région, repères.",
    "Décrire avec le vocabulaire précis et des chiffres.",
    "Expliquer en reliant les facteurs naturels et humains.",
  ]),
  "maths": ("Résoudre un exercice de mathématiques", [
    "Lire tout l'énoncé et noter les données utiles.",
    "Choisir la formule ou la propriété du cours qui répond à la question.",
    "Calculer proprement, vérifier l'ordre de grandeur et conclure par une phrase avec l'unité.",
  ]),
  "espagnol": ("Faire un exercice de langue en espagnol", [
    "Repérer le temps, la personne et les mots-indices de la phrase.",
    "Appliquer la règle (conjugaison, accord, place des pronoms).",
    "Relire en vérifiant les accents écrits et les signes ¡ ¿.",
  ]),
  "anglais": ("Faire un exercice de grammaire", [
    "Repérer les indices de la phrase (sujet, mots de temps, structure).",
    "Choisir la règle qui convient et l'appliquer.",
    "Relire la phrase entière pour vérifier le sens et l'accord.",
  ]),
}

# identifiant de la notion -> (piège fréquent, ce qui tombe au devoir ou à l'examen)
PE = {
  "6e-classes": ("Confondre le déterminant « le » et le pronom « le » (je le vois).", "Donner la nature des mots d'une phrase."),
  "6e-fonctions": ("Prendre le premier mot de la phrase pour le sujet sans poser la question.", "Souligner le sujet, le verbe et le COD."),
  "6e-conjugaison": ("Écrire « il finira » avec un e muet en trop (« il finiera »).", "Conjuguer un verbe à un temps donné, dans un texte à compléter."),
  "6e-orthographe": ("Oublier l'accord de l'adjectif quand il est loin du nom.", "Mettre une phrase au pluriel ou au féminin, dictée."),
  "6e-vocabulaire": ("Croire que deux synonymes sont toujours interchangeables.", "Trouver des synonymes, des contraires, ranger des mots."),
  "6e-conte": ("Confondre la morale et le résumé de l'histoire.", "Retrouver les étapes du schéma narratif d'un conte."),
  "6e-phrases": ("Oublier le « ne » de la négation à l'écrit.", "Identifier et transformer des types de phrases."),
  "6e-intro-histoire": ("Se tromper de siècle : 1850 est au XIXe siècle, pas au XVIIIe.", "Classer des sources, placer des dates sur une frise."),
  "6e-prehistoire": ("Confondre paléolithique (pierre taillée) et néolithique (pierre polie, agriculture).", "Comparer les modes de vie du paléolithique et du néolithique."),
  "6e-egypte": ("Croire que les pyramides étaient des palais : ce sont des tombeaux.", "Expliquer le rôle du Nil et du pharaon."),
  "6e-senegal-ancien": ("Confondre les cercles mégalithiques (pierres) et les amas coquilliers (coquillages).", "Situer et décrire un site ancien du Sénégal."),
  "6e-systeme-solaire": ("Confondre rotation (24 h) et révolution (365 jours).", "Expliquer l'alternance jour/nuit."),
  "6e-reperage": ("Inverser latitude (nord-sud) et longitude (est-ouest).", "Donner les coordonnées d'un point sur un planisphère."),
  "6e-carte": ("Oublier de convertir les centimètres en kilomètres.", "Calculer une distance réelle avec l'échelle."),
  "6e-continents": ("Compter l'Antarctique comme un océan.", "Nommer les continents et les océans sur une carte muette."),
  "6e-senegal-climat": ("Croire que la saison des pluies dure toute l'année au sud.", "Décrire le climat du Sénégal et ses saisons."),
  "6e-be-have": ("Dire « I have twelve years » au lieu de « I am twelve ».", "Se présenter en quelques phrases."),
  "6e-numbers": ("Confondre « thirteen » (13) et « thirty » (30).", "Écrire l'heure et la date en anglais."),
  "6e-colours": ("Mettre un s à l'adjectif : « reds pens ».", "Décrire des objets avec leurs couleurs."),
  "6e-plural": ("Écrire « childs » ou « mans ».", "Mettre des phrases au pluriel."),
  "6e-greetings": ("Dire « Good night » pour saluer le soir en arrivant.", "Compléter un petit dialogue."),
  "5e-conjugaison": ("Confondre le passé simple « il chanta » et l'imparfait « il chantait ».", "Conjuguer au passé simple dans un récit."),
  "5e-homophones": ("Écrire « a » au lieu de « à » sans faire le test « avait ».", "Compléter un texte avec les bons homophones."),
  "5e-fonctions": ("Prendre un COI pour un COD (« il parle à son ami »).", "Donner la fonction des groupes soulignés."),
  "5e-formation": ("Croire que « re- » est toujours un préfixe (renard n'en a pas).", "Décomposer des mots, trouver une famille de mots."),
  "5e-champ-lexical": ("Mélanger champ lexical et famille de mots.", "Relever le champ lexical d'un texte."),
  "5e-fable": ("Oublier les guillemets ou les tirets dans un dialogue.", "Expliquer la morale d'une fable, écrire un dialogue."),
  "5e-islam": ("Confondre la naissance du Prophète (vers 570) et l'Hégire (622).", "Présenter les cinq piliers et l'expansion de l'islam."),
  "5e-ghana": ("Confondre le Ghana médiéval (Soninké) et le Ghana actuel.", "Expliquer la richesse de l'empire du Ghana."),
  "5e-mali": ("Attribuer le pèlerinage de 1324 à Soundiata au lieu de Mansa Moussa.", "Présenter la fondation et l'apogée du Mali."),
  "5e-songhai": ("Inverser Sonni Ali Ber (conquérant) et Askia Mohammed (organisateur).", "Expliquer la chute de l'empire songhaï."),
  "5e-tekrour-djolof": ("Confondre les titres : damel (Cayor), bourba (Djolof), brak (Walo).", "Présenter l'organisation du Djolof."),
  "5e-transsaharien": ("Inverser les produits : l'or vient du Sud, le sel du Nord.", "Décrire les échanges et leurs conséquences."),
  "5e-relief": ("Confondre le Nil (le plus long) et le Congo (le plus abondant).", "Localiser les grands fleuves et reliefs sur une carte."),
  "5e-climats": ("Associer la forêt dense au climat sahélien.", "Associer climats et végétations, lire un diagramme."),
  "5e-etats": ("Confondre l'UEMOA (monnaie commune) et la CEDEAO (15 États).", "Citer des organisations d'intégration et leur rôle."),
  "5e-past-simple": ("Écrire « didn't went » au lieu de « didn't go ».", "Raconter ce qu'on a fait hier ou le week-end dernier."),
  "5e-present": ("Oublier le -s à la 3e personne : « he play ».", "Choisir entre présent simple et présent en -ing."),
  "5e-comparatives": ("Écrire « more bigger » ou « gooder ».", "Comparer deux personnes ou deux villes."),
  "5e-quantities": ("Dire « How much students » au lieu de « How many ».", "Compléter avec some, any, much, many."),
  "5e-can": ("Écrire « she cans » ou « can to swim ».", "Dire ce qu'on sait faire, écrire une date."),
  "5e-vocab": ("Confondre « kitchen » (cuisine) et « chicken » (poulet).", "Compléter un texte avec le vocabulaire du thème."),
  "4e-passif": ("Oublier d'accorder le participe passé au passif.", "Transformer des phrases à la voix passive ou au discours indirect."),
  "4e-subordonnees": ("Confondre « que » relatif (après un nom) et « que » complétif (après un verbe).", "Identifier la nature d'une subordonnée."),
  "4e-conditionnel": ("Écrire « si j'aurais » au lieu de « si j'avais ».", "Compléter des phrases avec si + imparfait + conditionnel."),
  "4e-participe": ("Accorder avec le sujet un participe employé avec avoir.", "Accorder des participes passés dans un texte, dictée."),
  "4e-figures": ("Confondre comparaison (avec outil) et métaphore (sans outil).", "Identifier une figure de style et dire son effet."),
  "4e-autobiographie": ("Croire que tout récit à la première personne est une autobiographie.", "Questions sur un extrait de roman africain."),
  "4e-theatre": ("Prendre les didascalies pour des répliques.", "Lire une scène, rédiger un paragraphe argumentatif."),
  "4e-decouvertes": ("Penser que Colomb savait qu'il arrivait sur un nouveau continent.", "Expliquer les causes et conséquences des grandes découvertes."),
  "4e-traite": ("Oublier une étape du commerce triangulaire.", "Décrire le commerce triangulaire et ses conséquences pour l'Afrique."),
  "4e-revolutions": ("Confondre 1776 (États-Unis) et 1789 (France).", "Expliquer les principes de 1789 et les effets de l'industrialisation."),
  "4e-penetration": ("Croire que la conquête s'est faite sans résistance.", "Présenter les étapes de la conquête du Sénégal."),
  "4e-resistances": ("Mélanger les résistants et leurs régions.", "Présenter un résistant et sa forme de résistance."),
  "4e-population": ("Confondre population et densité.", "Calculer une densité, expliquer la répartition de la population."),
  "4e-developpement": ("Croire que le PIB suffit à mesurer le développement.", "Comparer deux pays avec des indicateurs."),
  "4e-ensembles": ("Ranger tous les pays d'Asie dans le même ensemble.", "Localiser les grands ensembles sur un planisphère."),
  "4e-climats": ("Oublier le rôle de l'altitude.", "Lire un diagramme ombrothermique et nommer le climat."),
  "4e-present-perfect": ("Utiliser le present perfect avec « yesterday » ou « last year ».", "Choisir entre present perfect et past simple, for ou since."),
  "4e-past-continuous": ("Écrire « I was sleep » sans -ing.", "Raconter une scène passée avec when et while."),
  "4e-if": ("Mettre « will » après « if ».", "Compléter des phrases au conditionnel."),
  "4e-must": ("Confondre « mustn't » (interdit) et « don't have to » (pas obligé).", "Écrire un règlement avec must et mustn't."),
  "4e-superlatives": ("Écrire « the most big » ou « the goodest ».", "Comparer et classer des éléments."),
  "4e-relatives": ("Utiliser « which » pour une personne.", "Relier deux phrases avec un pronom relatif, ajouter un tag."),
  "4e-expressions": ("Traduire mot à mot « j'ai mal à la tête ».", "Compléter un dialogue avec des expressions utiles."),
  "2nde-epopee": ("Confondre l'épopée (héros historique et merveilleux) et le conte.", "Commentaire ou questions sur un extrait de Soundiata."),
  "2nde-resume": ("Recopier des phrases du texte ou ajouter son avis dans le résumé.", "Résumé au quart et discussion sur le thème du texte."),
  "2nde-registres": ("Confondre registre tragique et registre pathétique.", "Identifier le registre dominant d'un texte et le justifier."),
  "2nde-theatre": ("Oublier de commenter les didascalies.", "Étudier une scène : personnages, enjeux, registre."),
  "2nde-poesie": ("Compter les e muets devant une voyelle.", "Analyser la versification d'une strophe."),
  "2nde-recit": ("Confondre auteur et narrateur.", "Étudier le point de vue et le schéma narratif d'un extrait."),
  "2nde-figures": ("Nommer la figure sans expliquer son effet.", "Relever et interpréter des figures de style."),
  "2nde-antiquite": ("Confondre la démocratie athénienne et la démocratie actuelle (femmes, esclaves exclus).", "Expliquer le fonctionnement de la démocratie athénienne."),
  "2nde-prehistoire": ("Placer le début du Moyen Âge sans repère (476).", "Situer les grandes périodes et leurs ruptures."),
  "2nde-renaissance": ("Réduire l'humanisme aux arts.", "Expliquer l'humanisme et les grandes découvertes."),
  "2nde-durable": ("Oublier l'un des trois piliers du développement durable.", "Analyser un problème environnemental du Sénégal."),
  "2nde-afrique-pop": ("Confondre croissance démographique et croissance urbaine.", "Étudier la croissance des villes africaines."),
  "2nde-tenses": ("Utiliser le present perfect avec une date passée.", "Exercices de temps dans un texte à compléter."),
  "2nde-passive": ("Oublier le changement de temps au discours indirect.", "Transformer au passif et au discours indirect."),
  "2nde-modals": ("Mettre un -s ou « to » après un modal.", "Choisir le modal selon le sens (obligation, conseil, possibilité)."),
  "2nde-gerund": ("Écrire « I enjoy to read ».", "Compléter avec -ing ou to + base verbale."),
  "2nde-relatives": ("Utiliser « what » comme pronom relatif après un nom.", "Relier des phrases, choisir les prépositions."),
  "2nde-vocab": ("Enchaîner les idées sans connecteurs.", "Rédiger un paragraphe argumenté en anglais."),
}

CIBLES = ["6e-francais", "6e-histoire", "6e-geo", "6e-anglais", "5e-francais", "5e-histoire", "5e-geo", "5e-anglais",
          "4e-francais", "4e-histoire", "4e-geo", "4e-anglais", "2nde-francais", "2nde-hg", "2nde-anglais",
          "1ere-maths-l", "1ere-maths-g", "tle-maths-l", "tle-maths-g",
          "4e-espagnol", "3e-espagnol", "2nde-espagnol", "1ere-espagnol", "tle-espagnol"]
from matieres_plus import PE_PLUS
PE.update(PE_PLUS)


def auto_synth(notions, programmes):
    """Une synthèse par chapitre du programme, construite à partir des notions de cours."""
    out = {}
    for sid in CIBLES:
        titres = [t for t, _ in programmes[sid]]
        fam = sid.split("-", 1)[1]
        chs = []
        for n in notions[sid]:
            if n["id"] not in PE:
                continue
            piege, exam = PE[n["id"]]
            if fam == "hg":
                fam_n = "geo" if n["id"] in ("2nde-durable", "2nde-afrique-pop") else "histoire"
            elif "maths" in fam:
                fam_n = "maths"
            else:
                fam_n = fam
            ex_t, ex_l = n["exemples"][0]
            chs.append({"t": n["programme"], "p": titres.index(n["programme"]), "cles": n["cours"] + n["enonce"],
                        "methodes": [METHODES[fam_n]], "pieges": [piege], "exemple": (ex_t, ex_l), "exam": exam})
        chs.sort(key=lambda c: c["p"])
        assert len(chs) == len(titres), (sid, len(chs), len(titres))
        out[sid] = chs
    return out
