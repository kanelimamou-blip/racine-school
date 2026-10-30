# Compléments propres à Racine School (contenu neuf, aucune question reprise) : 3 notions par chapitre en économie,
# comptabilité et espagnol de Tle, QCM de français et de philosophie pour atteindre 150, sujets types de S pour que
# chaque série S (S1 à S5) ait au moins 3 sujets corrigés en maths, PC et SVT.
from notions_prog import C
from sujets_tle2 import P, noter, A, S

NRC = {
  "g-eco": [
    C("Les agrégats : PIB, croissance, valeur ajoutée", "x-geco-pib-reel", ["Le PIB nominal (en valeur) est calculé aux prix de l'année : il augmente quand on produit plus, mais aussi quand les prix montent.", "Pour mesurer la vraie hausse de la production, on retire l'effet des prix : c'est le PIB réel (en volume), obtenu avec le déflateur du PIB."],
      ["PIB nominal (en valeur) : mesuré aux prix courants de l'année.", "PIB réel (en volume) = PIB nominal / déflateur × 100.", "Déflateur du PIB = PIB nominal / PIB réel × 100 (100 l'année de base).", "Croissance réelle = (PIB réel n − PIB réel n−1)/PIB réel n−1 × 100."],
      [("Calcul", ["PIB nominal 18 000 milliards F, déflateur 120 (base 100) : PIB réel = 18 000/120 × 100 = 15 000 milliards F."]), ("Lecture", ["Une croissance nominale de 7 % avec 3 % de hausse des prix donne une croissance réelle d'environ 4 %."])],
      "Année 1 (année de base, déflateur 100) : PIB nominal 10 000 milliards F. Année 2 : PIB nominal 11 220 milliards F, déflateur 102.",
      [("PIB réel de l'année 2 :", "11 000 milliards F", "11 220 milliards F", "11 444 milliards F", "10 200 milliards F", "11 220/102 × 100."),
       ("Croissance nominale :", "12,2 %", "10 %", "2 %", "1,22 %", "(11 220 − 10 000)/10 000 × 100."),
       ("Croissance réelle :", "10 %", "12,2 %", "2 %", "8 %", "(11 000 − 10 000)/10 000 × 100."),
       ("Hausse des prix entre les deux années :", "2 %", "10 %", "12,2 %", "102 %", "Le déflateur passe de 100 à 102.")], title="PIB nominal, PIB réel et déflateur"),
    C("Les secteurs d'activité et les entreprises", "x-geco-couts", ["Pour savoir si elle gagne de l'argent, l'entreprise compare son chiffre d'affaires à ses coûts.", "Certains coûts ne dépendent pas de la quantité produite (loyer, salaires fixes), d'autres augmentent avec elle (matières premières)."],
      ["Coût total = coûts fixes + coûts variables.", "Coût variable unitaire = coûts variables / quantité produite.", "Bénéfice = chiffre d'affaires − coût total.", "Seuil de rentabilité (en quantité) = coûts fixes / (prix de vente − coût variable unitaire)."],
      [("Boulangerie", ["Coûts fixes 300 000 F par mois, coût variable 100 F par pain, prix 150 F : seuil = 300 000/(150 − 100) = 6 000 pains par mois."])],
      "Un atelier de couture a 400 000 F de coûts fixes par mois. Chaque tenue coûte 3 000 F de tissu et de fil et se vend 5 000 F.",
      [("Seuil de rentabilité :", "200 tenues", "80 tenues", "133 tenues", "400 tenues", "400 000/(5 000 − 3 000)."),
       ("Coût total pour 300 tenues :", "1 300 000 F", "900 000 F", "1 500 000 F", "1 700 000 F", "400 000 + 300 × 3 000."),
       ("Chiffre d'affaires pour 300 tenues :", "1 500 000 F", "1 300 000 F", "900 000 F", "600 000 F", "300 × 5 000."),
       ("Bénéfice pour 300 tenues :", "200 000 F", "600 000 F", "−200 000 F", "1 500 000 F", "1 500 000 − 1 300 000.")], title="Coûts, chiffre d'affaires et seuil de rentabilité"),
    C("Le marché, les prix et l'inflation", "x-geco-marche", ["Sur un marché, les acheteurs (la demande) et les vendeurs (l'offre) se rencontrent.", "Le prix s'ajuste jusqu'à ce que la quantité offerte soit égale à la quantité demandée : c'est l'équilibre."],
      ["La demande baisse quand le prix monte ; l'offre augmente quand le prix monte.", "Prix d'équilibre : quantité offerte = quantité demandée.", "Excès de demande ⟹ le prix monte ; excès d'offre ⟹ le prix baisse.", "Élasticité-prix de la demande = variation de la quantité demandée (%) / variation du prix (%)."],
      [("Équilibre", ["Qd = 1 000 − 2p et Qo = 3p − 500 : 1 000 − 2p = 3p − 500, donc p = 300 F et Q = 400."]), ("Élasticité", ["Le prix monte de 10 % et la quantité demandée baisse de 20 % : élasticité = −20/10 = −2, demande très sensible au prix."])],
      "Marché de l'oignon : demande Qd = 900 − 3p et offre Qo = 2p − 100 (p en F le kg, Q en tonnes).",
      [("Prix d'équilibre :", "200 F le kg", "160 F le kg", "250 F le kg", "300 F le kg", "900 − 3p = 2p − 100 ⟺ 5p = 1 000."),
       ("Quantité échangée à l'équilibre :", "300 t", "200 t", "500 t", "100 t", "900 − 3 × 200."),
       ("Si le prix est fixé à 150 F le kg :", "excès de demande de 250 t, le prix tend à monter", "excès d'offre de 250 t, le prix tend à baisser", "le marché est à l'équilibre", "excès de demande de 650 t", "Qd = 450 t et Qo = 200 t."),
       ("Le prix monte de 10 % et la quantité demandée baisse de 5 %. Élasticité :", "−0,5 : demande peu sensible au prix", "−2 : demande très sensible au prix", "+0,5", "−15", "−5/10.")], title="Offre, demande et prix d'équilibre"),
    C("La monnaie et la banque centrale", "x-geco-cfa", ["Huit pays de l'UEMOA utilisent la même monnaie, le franc CFA, émise par la BCEAO.", "Le franc CFA a une parité fixe avec l'euro : sa valeur ne change pas d'un jour à l'autre, ce qui facilite les échanges avec l'Europe."],
      ["1 € = 655,957 F CFA (parité fixe).", "UEMOA : Bénin, Burkina Faso, Côte d'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal, Togo.", "Objectif principal de la BCEAO : la stabilité des prix (inflation autour de 2 %).", "Instruments : taux directeurs, réserves obligatoires, refinancement des banques."],
      [("Conversion", ["200 € = 200 × 655,957 = 131 191,4 F CFA ; 10 000 F CFA ≈ 15,24 €."]), ("Politique monétaire", ["Pour freiner l'inflation, la BCEAO relève ses taux directeurs : le crédit coûte plus cher et la demande ralentit."])],
      "Un commerçant de Dakar importe d'Europe des marchandises pour 5 000 €.",
      [("Montant en F CFA :", "3 279 785 F CFA", "3 000 000 F CFA", "655 957 F CFA", "7 622 F CFA", "5 000 × 655,957."),
       ("Pour freiner l'inflation, la BCEAO peut :", "relever ses taux directeurs", "baisser ses taux directeurs", "supprimer les réserves obligatoires", "prêter sans limite aux banques", "Crédit plus cher, moins de monnaie créée."),
       ("Le siège de la BCEAO est à :", "Dakar", "Abidjan", "Lomé", "Ouagadougou", "Siège à Dakar."),
       ("Avantage de la parité fixe avec l'euro :", "le coût des échanges avec la zone euro est prévisible", "les prix ne montent jamais", "les exportations sont toujours gratuites", "la BCEAO n'a plus de rôle", "Pas de risque de change avec l'euro.")], title="La BCEAO et le franc CFA"),
    C("L'emploi et le chômage", "x-geco-politiques-emploi", ["Le chômage n'a pas une seule cause : il faut adapter la réponse à sa cause.", "Contre un chômage dû à une crise, on soutient la demande ; contre un chômage dû au manque de qualification, on forme."],
      ["Relance (politique keynésienne) : soutenir la demande pour créer des emplois, contre le chômage conjoncturel.", "Formation et apprentissage : adapter les qualifications aux besoins, contre le chômage structurel.", "Aides à l'embauche et baisse du coût du travail : encourager les entreprises à recruter.", "Auto-emploi : microcrédit, financement des jeunes et des femmes, formalisation du secteur informel."],
      [("Effet d'une mesure", ["8 millions d'actifs dont 1,6 million de chômeurs : 20 %. Si 200 000 chômeurs trouvent un emploi : 1,4/8 = 17,5 %."])],
      "Un pays compte 5 000 000 d'actifs, dont 750 000 chômeurs.",
      [("Taux de chômage :", "15 %", "7,5 %", "17,6 %", "20 %", "750 000/5 000 000 × 100."),
       ("Un programme fait embaucher 150 000 chômeurs. Nouveau taux :", "12 %", "3 %", "15 %", "13,5 %", "600 000/5 000 000 × 100."),
       ("Contre un chômage dû au manque de qualification, la mesure la plus adaptée :", "la formation professionnelle", "la hausse des impôts", "la fermeture des frontières", "la baisse des dépenses d'éducation", "Chômage structurel."),
       ("Une politique de relance budgétaire consiste à :", "augmenter les dépenses publiques pour soutenir la demande", "augmenter les impôts", "baisser les salaires des fonctionnaires", "relever les taux directeurs", "Plus de demande, plus de production, plus d'emplois.")], title="Les politiques de lutte contre le chômage"),
    C("L'État : impôts et politique budgétaire", "x-geco-fonctions-etat", ["L'État intervient dans l'économie de trois façons : il produit des services pour tous, il corrige les inégalités et il soutient l'activité.", "Les pays de l'UEMOA se fixent des critères communs pour que la dette et le déficit restent soutenables."],
      ["Allocation : l'État fournit les biens collectifs (routes, écoles, sécurité) que le marché fournit mal.", "Redistribution : impôts progressifs et transferts (bourses, aides sociales) réduisent les inégalités.", "Régulation : l'État agit sur la conjoncture (relance ou rigueur) pour la croissance et l'emploi.", "Taux d'endettement public = dette publique / PIB × 100 (norme UEMOA : 70 % au plus).", "Déficit budgétaire / PIB × 100 : norme UEMOA de 3 % au plus."],
      [("Calcul", ["Dette 9 000 milliards F pour un PIB de 15 000 milliards F : 60 % du PIB."])],
      "Un pays de l'UEMOA a un PIB de 20 000 milliards F, une dette publique de 13 000 milliards F et un déficit budgétaire de 900 milliards F.",
      [("Taux d'endettement :", "65 % du PIB", "6,5 % du PIB", "70 % du PIB", "153 % du PIB", "13 000/20 000 × 100."),
       ("Par rapport à la norme UEMOA de la dette :", "elle est respectée (65 % ≤ 70 %)", "elle est dépassée", "elle ne s'applique pas", "il faudrait 100 %", "Plafond de 70 %."),
       ("Déficit en % du PIB :", "4,5 %", "0,45 %", "3 %", "45 %", "900/20 000 × 100 : au-dessus de la norme de 3 %."),
       ("Les bourses d'études relèvent de la fonction :", "de redistribution", "d'allocation", "de régulation", "monétaire", "Transfert vers les ménages.")], title="Les fonctions de l'État et la dette publique"),
    C("Le commerce extérieur", "x-geco-libre-echange", ["Faut-il ouvrir les frontières aux échanges ou protéger la production nationale ? C'est le débat entre libre-échange et protectionnisme.", "Les pays africains s'organisent en zones d'intégration pour élargir leurs marchés."],
      ["Libre-échange : suppression des obstacles aux échanges (droits de douane, quotas).", "Protectionnisme : droits de douane, quotas, normes ou subventions pour protéger la production nationale.", "Avantage comparatif (Ricardo) : chaque pays gagne à se spécialiser là où il est relativement le plus efficace.", "Union douanière = libre-échange entre membres + tarif extérieur commun (TEC de l'UEMOA et de la CEDEAO) ; ZLECAf : zone de libre-échange continentale africaine."],
      [("Droit de douane", ["Un produit importé à 1 000 F avec 20 % de droit de douane coûte 1 200 F sur le marché national."])],
      "Le Sénégal importe du riz au prix mondial de 300 F le kg ; un droit de douane de 10 % est appliqué.",
      [("Prix du riz importé après le droit :", "330 F le kg", "310 F le kg", "300 F le kg", "390 F le kg", "300 × 1,10."),
       ("Effet pour les producteurs de riz de la vallée du fleuve :", "ils deviennent plus compétitifs face au riz importé", "ils vendent moins cher que le riz importé de 30 F de moins", "rien ne change", "ils doivent payer le droit de douane", "Le riz importé est plus cher."),
       ("Une union douanière, c'est :", "une zone de libre-échange avec un tarif extérieur commun", "une monnaie unique", "la fermeture de toutes les frontières", "une banque centrale commune", "Exemple : UEMOA."),
       ("La théorie de l'avantage comparatif est de :", "David Ricardo", "Adam Smith", "Keynes", "Karl Marx", "Smith parlait d'avantage absolu.")], title="Libre-échange, protectionnisme et intégration régionale"),
  ],
  "g-compta": [
    C("Le cadre comptable : SYSCOHADA", "x-gcpt-principes", ["La comptabilité suit des principes communs à tous les pays de l'OHADA, pour que les comptes soient fiables et comparables.", "Ces principes guident chaque choix : à quelle valeur enregistrer un bien, à quelle année rattacher une charge, comment traiter un risque."],
      ["Prudence : on enregistre les pertes probables, pas les gains seulement probables.", "Coût historique : un bien reste enregistré à sa valeur d'entrée (coût d'achat).", "Permanence des méthodes : les mêmes méthodes d'une année à l'autre.", "Spécialisation des exercices : chaque charge et chaque produit sont rattachés à l'année qui les concerne.", "Intangibilité du bilan d'ouverture : il est identique au bilan de clôture de l'exercice précédent."],
      [("Prudence", ["Un client en difficulté doit 500 000 F : on constate une dépréciation de la créance, même s'il n'a pas encore refusé de payer."])],
      "Pour chaque situation, retrouve le principe comptable appliqué.",
      [("Un client risque de ne pas payer : on déprécie la créance. Principe :", "prudence", "coût historique", "permanence des méthodes", "continuité d'exploitation", "Perte probable constatée."),
       ("Un terrain acheté 10 000 000 F il y a 10 ans vaut 25 000 000 F. Au bilan, il figure pour :", "10 000 000 F (coût historique)", "25 000 000 F", "15 000 000 F", "0 F", "Pas de gain enregistré sans vente."),
       ("Le bilan d'ouverture de l'année N+1 est identique au bilan de clôture de N. Principe :", "intangibilité du bilan d'ouverture", "prudence", "importance significative", "coût historique", "Continuité des comptes."),
       ("La facture d'électricité de décembre N, payée en janvier N+1, est une charge de :", "l'exercice N", "l'exercice N+1", "aucun exercice", "moitié N, moitié N+1", "Spécialisation des exercices.")], title="Les principes comptables"),
    C("Le bilan", "x-gcpt-ratios", ["Le bilan ne sert pas qu'à décrire le patrimoine : on en tire des ratios qui disent si l'entreprise est solide.", "Un banquier les regarde avant d'accorder un prêt."],
      ["Fonds de roulement = ressources stables − actif immobilisé.", "Autonomie financière = capitaux propres / dettes financières (au moins 1 souhaité).", "Liquidité générale = (actif circulant + trésorerie-actif) / (passif circulant + trésorerie-passif) ; plus de 1 souhaité.", "Solvabilité générale = total de l'actif / total des dettes ; plus de 1 : l'entreprise peut rembourser."],
      [("Lecture", ["Capitaux propres 3 000 000 F et dettes financières 6 000 000 F : autonomie 0,5, l'entreprise dépend trop des prêteurs."])],
      "Bilan : actif immobilisé 6 000 000 F, actif circulant 2 500 000 F, trésorerie-actif 500 000 F ; capitaux propres 5 000 000 F, dettes financières 2 000 000 F, passif circulant 2 000 000 F.",
      [("Fonds de roulement :", "1 000 000 F", "3 000 000 F", "−1 000 000 F", "500 000 F", "(5 000 000 + 2 000 000) − 6 000 000."),
       ("Autonomie financière :", "2,5", "0,4", "1", "5", "5 000 000/2 000 000."),
       ("Liquidité générale :", "1,5", "1,25", "0,67", "4,5", "(2 500 000 + 500 000)/2 000 000."),
       ("Solvabilité générale :", "2,25", "1,8", "0,44", "4,5", "9 000 000/(2 000 000 + 2 000 000).")], title="Les ratios du bilan"),
    C("Le compte de résultat", "x-gcpt-hao", ["Le compte de résultat sépare l'activité courante de l'entreprise et les opérations exceptionnelles.", "On voit ainsi si le bénéfice vient du métier de l'entreprise ou d'une vente exceptionnelle."],
      ["Activités ordinaires (AO) : charges et produits de l'activité courante (classes 6 et 7).", "Hors activités ordinaires (HAO) : opérations exceptionnelles, comme la cession d'une immobilisation (classe 8).", "Résultat des activités ordinaires = produits AO − charges AO.", "Résultat HAO = produits HAO − charges HAO ; résultat net = résultat AO + résultat HAO − impôt sur le résultat."],
      [("Exemple", ["Produits AO 8 000 000 F, charges AO 7 000 000 F, résultat HAO −100 000 F, impôt 270 000 F : résultat net = 1 000 000 − 100 000 − 270 000 = 630 000 F."])],
      "Produits AO 12 000 000 F ; charges AO 10 500 000 F ; produit de cession d'un camion 800 000 F ; valeur comptable du camion cédé 600 000 F ; impôt sur le résultat 510 000 F.",
      [("Résultat des activités ordinaires :", "1 500 000 F", "22 500 000 F", "1 700 000 F", "10 500 000 F", "12 000 000 − 10 500 000."),
       ("Résultat HAO :", "200 000 F", "800 000 F", "1 400 000 F", "−200 000 F", "800 000 − 600 000."),
       ("Résultat net :", "1 190 000 F", "1 700 000 F", "1 500 000 F", "990 000 F", "1 500 000 + 200 000 − 510 000."),
       ("La vente d'un ancien camion de l'entreprise est :", "une opération HAO", "une vente de marchandises", "une charge AO", "un apport en capital", "Opération exceptionnelle.")], title="Activités ordinaires et HAO"),
    C("Les comptes et la partie double", "x-gcpt-tva", ["L'entreprise collecte la TVA sur ses ventes pour le compte de l'État et récupère celle payée sur ses achats.", "Chaque mois, elle reverse à l'État la différence."],
      ["TVA = prix HT × 18 % (taux normal au Sénégal) ; prix TTC = prix HT × 1,18.", "TVA facturée sur les ventes (collectée) : compte 443, au crédit.", "TVA récupérable sur les achats (déductible) : compte 445, au débit.", "TVA due = TVA collectée − TVA déductible (crédit de TVA si le résultat est négatif)."],
      [("Écriture d'achat", ["Achat de marchandises 500 000 F HT à crédit : débit 601 pour 500 000, débit 445 pour 90 000, crédit 401 pour 590 000."])],
      "En mars, une entreprise vend pour 2 000 000 F HT et achète des marchandises pour 1 200 000 F HT (TVA 18 %).",
      [("TVA collectée :", "360 000 F", "216 000 F", "2 360 000 F", "144 000 F", "2 000 000 × 0,18."),
       ("TVA déductible :", "216 000 F", "360 000 F", "1 416 000 F", "144 000 F", "1 200 000 × 0,18."),
       ("TVA due à l'État :", "144 000 F", "576 000 F", "360 000 F", "−144 000 F", "360 000 − 216 000."),
       ("Montant TTC des ventes :", "2 360 000 F", "2 000 000 F", "2 180 000 F", "1 640 000 F", "2 000 000 × 1,18.")], title="La TVA : collectée, déductible, due"),
    C("Journal, grand livre et balance", "x-gcpt-factures", ["La facture est la pièce justificative qu'on enregistre au journal.", "Elle peut contenir des réductions : on les calcule dans l'ordre, chacune sur le montant précédent."],
      ["Réductions commerciales : rabais (défaut de qualité), remise (quantité, fidélité), ristourne (sur le chiffre d'affaires d'une période).", "Net commercial = montant brut − réductions commerciales, en cascade.", "Escompte (réduction financière pour paiement comptant) : calculé sur le net commercial ; compte 673 chez le vendeur, 773 chez l'acheteur.", "La TVA se calcule sur le net financier ; net à payer = net financier + TVA."],
      [("Cascade", ["Brut 200 000 F, remise 10 % puis rabais 5 % : 200 000 × 0,9 = 180 000 ; 180 000 × 0,95 = 171 000 F."])],
      "Facture : montant brut 1 000 000 F ; remise 10 % ; rabais 5 % ; escompte 2 % ; TVA 18 %.",
      [("Net commercial :", "855 000 F", "850 000 F", "900 000 F", "837 900 F", "1 000 000 × 0,90 × 0,95."),
       ("Montant de l'escompte :", "17 100 F", "20 000 F", "18 000 F", "17 000 F", "855 000 × 2 %."),
       ("TVA :", "150 822 F", "153 900 F", "180 000 F", "150 000 F", "(855 000 − 17 100) × 18 %."),
       ("Net à payer :", "988 722 F", "1 008 900 F", "837 900 F", "1 180 000 F", "837 900 + 150 822.")], title="Factures et réductions"),
    C("Les amortissements", "x-gcpt-cession", ["Quand l'entreprise vend une immobilisation, elle compare le prix obtenu à ce que vaut encore le bien dans ses comptes.", "La différence est une plus-value ou une moins-value, classée hors activités ordinaires."],
      ["Prix de cession : produit HAO (compte 82).", "Valeur comptable du bien cédé = valeur d'origine − amortissements cumulés : charge HAO (compte 81).", "Plus-value = prix de cession − valeur comptable ; moins-value si le résultat est négatif.", "Avant de solder le bien, on passe la dotation de l'année jusqu'à la date de cession."],
      [("Exemple", ["Machine de 4 000 000 F amortie de 3 000 000 F, vendue 1 500 000 F : valeur comptable 1 000 000 F, plus-value 500 000 F."])],
      "Un matériel acheté 6 000 000 F le 1er janvier N−2, amorti en linéaire sur 5 ans, est vendu 2 800 000 F le 31 décembre N.",
      [("Annuité d'amortissement :", "1 200 000 F", "2 000 000 F", "1 000 000 F", "600 000 F", "6 000 000/5."),
       ("Amortissements cumulés au 31 décembre N :", "3 600 000 F", "2 400 000 F", "1 200 000 F", "4 800 000 F", "3 années : N−2, N−1 et N."),
       ("Valeur comptable du matériel cédé :", "2 400 000 F", "3 600 000 F", "2 800 000 F", "6 000 000 F", "6 000 000 − 3 600 000."),
       ("Résultat de la cession :", "plus-value de 400 000 F", "moins-value de 400 000 F", "plus-value de 2 800 000 F", "moins-value de 3 200 000 F", "2 800 000 − 2 400 000.")], title="La cession d'une immobilisation"),
  ],
  "tle-espagnol": [
    C("Le discours indirect", "x-es-relato", ["Contar un diálogo en un relato obliga a transformar cada réplica en estilo indirecto.", "Con un verbo introductor en pasado, cambian los tiempos, los pronombres y las referencias de lugar y de tiempo."],
      ["Variar los verbos introductores: decir, contestar, añadir, explicar, preguntar, pedir, ordenar.", "Presente → imperfecto; pretérito perfecto o indefinido → pluscuamperfecto; futuro → condicional.", "Imperativo → imperfecto de subjuntivo: «¡Cállate!» → Le ordenó que se callara.", "Pregunta sin palabra interrogativa → si: «¿Vienes?» → Le preguntó si venía."],
      [("Diálogo contado", ["Ana: «Mañana iré al mercado.» Pedro: «¿Puedo acompañarte?» → Ana dijo que al día siguiente iría al mercado. Pedro le preguntó si podía acompañarla."])],
      "«He perdido mi cuaderno», dijo Moussa. «¿Dónde lo dejaste?», le preguntó su madre. «Búscalo en tu habitación», añadió.",
      [("Moussa dijo que…", "había perdido su cuaderno", "ha perdido mi cuaderno", "perdía su cuaderno", "perdiera su cuaderno", "Pretérito perfecto → pluscuamperfecto ; mi → su."),
       ("Su madre le preguntó…", "dónde lo había dejado", "dónde lo dejas", "si lo dejaste", "dónde lo dejara", "Indefinido → pluscuamperfecto ; se mantiene «dónde»."),
       ("Añadió que…", "lo buscara en su habitación", "lo busca en tu habitación", "lo buscaba en su habitación", "búscalo en su habitación", "Imperativo → imperfecto de subjuntivo ; tu → su."),
       ("«¿Tienes hambre?», le preguntó. En estilo indirecto:", "Le preguntó si tenía hambre.", "Le preguntó que tenía hambre.", "Le preguntó qué tiene hambre.", "Le preguntó si tuviera hambre.", "Pregunta total: si + imperfecto.")], title="Contar un diálogo en estilo indirecto"),
  ],
}


def _q(lst):
    return [(q, [ok, a, b, c], 0, e) for q, ok, a, b, c, e in lst]


QCM_RC = {
  "tle-francais": {
    "Figures de style": _q([
      ("« Vêtu de probité candide et de lin blanc » (Hugo) relie à un même verbe un mot abstrait et un mot concret : c'est", "un zeugma", "une hypallage", "un chiasme", "une antithèse", "Un même mot commande deux compléments de nature différente."),
      ("« Un vieillard en or avec une montre en deuil » (Prévert) déplace les adjectifs d'un nom à l'autre : c'est", "une hypallage", "un zeugma", "une métaphore filée", "une litote", "L'or va à la montre, le deuil au vieillard."),
    ]),
    "La poésie : formes et versification": _q([
      ("Le rejet consiste à :", "placer au début du vers suivant un mot court qui termine la phrase du vers précédent", "répéter un mot en début de vers", "couper l'alexandrin en deux hémistiches", "supprimer la rime", "Le mot rejeté est mis en valeur."),
    ]),
    "La Négritude et la littérature africaine": _q([
      ("« Le Mauvais Sang » (1955), premier recueil d'un poète congolais, est de :", "Tchicaya U Tam'si", "David Diop", "Bernard Dadié", "Birago Diop", "Poète du Congo-Brazzaville."),
    ]),
    "Le roman et les mouvements littéraires": _q([
      ("« L'Étrange Destin de Wangrin » (1973), récit d'un interprète de l'administration coloniale, est de :", "Amadou Hampâté Bâ", "Cheikh Hamidou Kane", "Seydou Badian", "Yambo Ouologuem", "Grand prix littéraire de l'Afrique noire 1974."),
    ]),
    "Méthodes : dissertation et commentaire": _q([
      ("Dans une dissertation, la transition sert à :", "faire le bilan d'une partie et annoncer la suivante", "donner son avis final", "recopier le sujet", "citer l'auteur du sujet", "Elle relie les parties du développement."),
    ]),
  },
  "tle-philo": {
    "La politique, l'État et la société": _q([
      ("Pour Hannah Arendt, le totalitarisme repose sur :", "la terreur et l'idéologie", "la séparation des pouvoirs", "le libre débat public", "le contrat social", "Les Origines du totalitarisme (1951)."),
      ("Dans La République, Platon confie le gouvernement de la cité :", "aux philosophes", "aux marchands", "au peuple tiré au sort", "aux guerriers seuls", "Les philosophes-rois."),
    ]),
    "La morale et la liberté": _q([
      ("Hannah Arendt parle de « banalité du mal » à propos d'Eichmann pour dire que :", "de grands crimes peuvent venir d'hommes ordinaires qui ne pensent pas ce qu'ils font", "le mal n'existe pas", "seuls les monstres font le mal", "le mal est toujours puni", "Eichmann à Jérusalem (1963)."),
      ("Pour Emmanuel Levinas, le visage d'autrui :", "m'oblige moralement : « Tu ne tueras point »", "n'a aucune importance morale", "est seulement un objet de connaissance", "doit être dominé", "Éthique de la responsabilité pour autrui."),
    ]),
    "L'homme, la conscience et l'inconscient": _q([
      ("Pour Bergson, la conscience signifie d'abord :", "mémoire : elle retient le passé et anticipe l'avenir", "oubli du passé", "simple réflexe du corps", "calcul mécanique", "L'Énergie spirituelle."),
    ]),
  },
}


ANNALES_RC = [
  A("bac-type-s-maths-4", "Mathématiques", S, "S1, S2, S3, S4, S5", "4 h", ["Exercice : nombres complexes et géométrie", "Exercice : probabilités et loi binomiale", "Problème : fonction exponentielle et calcul d'aire"]),
  A("bac-type-s-pc-4", "Physique-Chimie", S, "S1, S2, S3, S4, S5", "4 h", ["Chimie : estérification et acides α-aminés", "Physique : satellite, dipôle RC, radioactivité"]),
  A("bac-type-s-svt-4", "SVT", S, "S1, S2, S3, S4, S5", "4 h", ["Maîtrise des connaissances : la contraction musculaire", "Compétences : génétique (dihybridisme) et régulation de la pression artérielle"]),
]

GUIDED_RC = {
  "bac-type-s-maths-4": noter([
    P("Exercice 1 : nombres complexes", "Dans le plan complexe, A, B et C ont pour affixes a = 2, b = 1 + i√3 et c = 1 − i√3.", [
      ("|b| =", "2", "4", "√3", "1 + √3", "√(1 + 3)."),
      ("Un argument de b :", "π/3", "π/6", "−π/3", "2π/3", "cos θ = 1/2 et sin θ = √3/2."),
      ("c est :", "le conjugué de b", "l'opposé de b", "égal à b", "l'inverse de b", "Même partie réelle, partie imaginaire opposée."),
      ("OA = OB = OC = 2, donc A, B et C sont :", "sur le cercle de centre O et de rayon 2", "alignés", "confondus", "sur l'axe des réels", "Même module 2."),
      ("Le triangle ABC est :", "isocèle en A", "équilatéral", "rectangle en A", "aplati", "AB = |−1 + i√3| = 2, AC = |−1 − i√3| = 2, BC = |−2i√3| = 2√3."),
    ]),
    P("Exercice 2 : probabilités", "Un QCM a 5 questions ; à chacune, un élève répond au hasard parmi 4 réponses dont une seule est juste. X compte les bonnes réponses.", [
      ("X suit la loi binomiale de paramètres :", "n = 5 et p = 1/4", "n = 4 et p = 1/5", "n = 5 et p = 1/2", "n = 20 et p = 1/4", "5 épreuves indépendantes, succès 1/4."),
      ("P(X = 0) =", "(3/4)⁵ ≈ 0,237", "(1/4)⁵", "0", "3/4", "Aucune bonne réponse."),
      ("Espérance E(X) =", "1,25", "1", "2,5", "0,25", "np = 5 × 1/4."),
      ("P(X ≥ 1) =", "1 − (3/4)⁵ ≈ 0,763", "(3/4)⁵", "1/4", "5/4", "Événement contraire de X = 0."),
    ]),
    P("Problème : fonction exponentielle", "f(x) = (2 − x)eˣ sur ℝ ; C sa courbe.", [
      ("f'(x) =", "(1 − x)eˣ", "−eˣ", "(2 − x)eˣ", "(3 − x)eˣ", "(uv)' avec u = 2 − x, v = eˣ : −eˣ + (2 − x)eˣ."),
      ("f est croissante sur :", "]−∞ ; 1]", "[1 ; +∞[", "ℝ", "]−∞ ; 2]", "eˣ > 0, signe de 1 − x."),
      ("Maximum de f :", "f(1) = e", "f(2) = 0", "f(0) = 2", "f(1) = 1", "(2 − 1)e¹."),
      ("Limite de f en −∞ :", "0", "−∞", "+∞", "2", "xeˣ → 0 et eˣ → 0 en −∞."),
      ("C coupe l'axe des abscisses en :", "x = 2", "x = 0", "x = 1", "x = −2", "2 − x = 0."),
      ("Une primitive de f est F(x) = (3 − x)eˣ. Aire entre C, l'axe des abscisses, x = 0 et x = 2 :", "e² − 3", "e²", "3", "e² + 3", "F(2) − F(0) = e² − 3 ≈ 4,39 u.a. (f ≥ 0 sur [0 ; 2])."),
    ]),
  ]),
  "bac-type-s-pc-4": noter([
    P("Chimie : estérification et acides α-aminés", "On fait réagir 1 mol d'acide éthanoïque avec 1 mol d'éthanol ; on étudie aussi la glycine H₂N–CH₂–COOH.", [
      ("Le produit organique obtenu est :", "l'éthanoate d'éthyle", "l'éthanal", "l'acide propanoïque", "l'éther diéthylique", "Acide + alcool → ester + eau."),
      ("L'estérification est :", "lente, limitée et athermique", "rapide et totale", "très exothermique", "une réaction acide-base", "Caractères de l'estérification."),
      ("Avec un alcool primaire et des quantités égales, le rendement est voisin de :", "67 %", "100 %", "33 %", "50 %", "Environ 2/3 à l'équilibre."),
      ("Pour améliorer le rendement, on peut :", "utiliser un réactif en excès ou éliminer l'eau", "ajouter de l'eau", "refroidir fortement", "ajouter un catalyseur seulement", "Le catalyseur accélère sans déplacer l'équilibre."),
      ("La glycine est chirale ?", "non, son carbone α porte deux atomes H", "oui, toujours", "oui, comme tous les acides α-aminés", "seulement en solution acide", "La glycine est le seul acide α-aminé non chiral."),
      ("En solution aqueuse, la forme majoritaire d'un acide α-aminé au pH isoélectrique est :", "l'amphion (zwittérion) H₃N⁺–CHR–COO⁻", "la forme cationique seule", "la forme anionique seule", "la molécule neutre H₂N–CHR–COOH", "Ion dipolaire."),
    ]),
    P("Physique : satellite, dipôle RC, radioactivité", "Satellite en orbite circulaire ; condensateur qui se charge ; noyau radioactif.", [
      ("Le mouvement d'un satellite en orbite circulaire autour de la Terre est :", "circulaire uniforme", "rectiligne uniforme", "uniformément accéléré", "circulaire ralenti", "Force centrale de module constant."),
      ("Sa vitesse v vérifie :", "v = √(G·M/r)", "v = G·M/r²", "v = √(g·r²)", "v = 2πr", "Deuxième loi de Newton : v²/r = G·M/r²."),
      ("Constante de temps d'un dipôle RC avec R = 1 kΩ et C = 100 µF :", "0,1 s", "10 s", "100 s", "0,001 s", "τ = RC = 10³ × 10⁻⁴."),
      ("À t = τ, la tension aux bornes du condensateur qui se charge vaut :", "63 % de E", "37 % de E", "100 % de E", "50 % de E", "u = E(1 − e⁻¹)."),
      ("Demi-vie de 8 jours : après 24 jours, il reste :", "1/8 des noyaux", "1/3 des noyaux", "1/24 des noyaux", "la moitié", "3 demi-vies : (1/2)³."),
      ("La désintégration β⁻ émet :", "un électron (et un antineutrino)", "un noyau d'hélium", "un positon", "un photon seulement", "Un neutron devient un proton."),
    ]),
  ]),
  "bac-type-s-svt-4": noter([
    P("Maîtrise des connaissances : la contraction musculaire", "La contraction d'une fibre musculaire striée.", [
      ("L'unité contractile de la myofibrille est :", "le sarcomère", "le neurone", "la synapse", "le noyau", "Entre deux stries Z."),
      ("Pendant la contraction, les myofilaments :", "glissent les uns sur les autres sans changer de longueur", "raccourcissent", "s'allongent", "disparaissent", "Modèle du glissement."),
      ("L'ion qui déclenche la contraction en libérant les sites de l'actine :", "Ca²⁺", "Na⁺", "K⁺", "Cl⁻", "Libéré par le réticulum sarcoplasmique."),
      ("L'énergie directement utilisée par les têtes de myosine vient :", "de l'hydrolyse de l'ATP", "du glucose directement", "de la lumière", "de l'oxygène directement", "ATP → ADP + Pi."),
      ("Après la mort, la rigidité cadavérique s'explique par :", "l'absence d'ATP qui empêche le détachement des têtes de myosine", "un excès d'ATP", "la disparition de l'actine", "une contraction nerveuse", "Les ponts actine-myosine restent fixés."),
    ]),
    P("Compétences : génétique (dihybridisme)", "On croise deux lignées pures de drosophiles : ailes longues et corps gris × ailes vestigiales et corps ébène. F1 : 100 % ailes longues, corps gris. Le croisement F1 × double récessif donne 4 phénotypes en proportions égales.", [
      ("Les allèles dominants sont :", "ailes longues et corps gris", "ailes vestigiales et corps ébène", "aucun", "ailes longues et corps ébène", "Phénotype de la F1."),
      ("Le croisement F1 × double récessif est :", "un test-cross", "une autofécondation", "un croisement de lignées pures", "une mutation", "Il révèle les gamètes de la F1."),
      ("Quatre phénotypes à 25 % chacun montrent que les gènes sont :", "indépendants (sur deux paires de chromosomes)", "liés sans crossing-over", "liés au sexe", "identiques", "Brassage interchromosomique."),
      ("Proportion de drosophiles ailes vestigiales, corps ébène dans ce test-cross :", "1/4", "1/16", "3/4", "9/16", "Une des quatre classes égales."),
    ]),
    P("Compétences : régulation de la pression artérielle", "Une hausse brutale de la pression artérielle est détectée.", [
      ("Les récepteurs de la pression artérielle (barorécepteurs) sont situés :", "dans la crosse aortique et les sinus carotidiens", "dans la peau", "dans l'estomac", "dans les reins seulement", "Zones réflexogènes."),
      ("La hausse de pression augmente la fréquence des potentiels d'action :", "dans les nerfs de Hering et de Cyon", "dans les nerfs moteurs des jambes", "dans le nerf optique", "dans aucun nerf", "Nerfs sensitifs."),
      ("Réponse du centre bulbaire :", "stimulation du parasympathique (nerf X) et inhibition du sympathique", "stimulation du sympathique", "arrêt du cœur", "aucune", "Le cœur ralentit."),
      ("Conséquence :", "ralentissement du cœur et baisse de la pression", "accélération du cœur", "hausse de la pression", "vasoconstriction générale", "Rétrocontrôle négatif."),
    ]),
  ]),
}
for _a in ANNALES_RC:
    assert abs(sum(s[4] for p in GUIDED_RC[_a["id"]] for s in p["steps"]) - 20) < 1e-9, _a["id"]
