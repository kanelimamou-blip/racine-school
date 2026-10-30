"use strict";
// Réglages de l'espace admin. admins : identifiants Firebase (UID) des comptes qui ouvrent #admin.
// La page #admin affiche l'UID du compte connecté avec un bouton « Copier ». Après un ajout ici,
// `python contenu/build.py --regles` met la même liste dans la fonction admin() des règles Firestore.
const CONFIG_APP = {
  admins: [],
  // essai gratuit des élèves : true = TRIAL_DAYS jours par téléphone puis code premium ; false = tout ouvert (forfait payé par l'école).
  // La direction, les professeurs, le personnel, les parents et l'admin ne sont jamais bloqués.
  essai: false,
  // numéro donné aux comptes suspendus
  contact: "78 272 19 20",
};
