"use strict";
// Réglages de l'espace admin. admins : identifiants Firebase (UID) des comptes qui ouvrent #admin.
// La page #admin affiche l'UID du compte connecté avec un bouton « Copier ». Après un ajout ici,
// `python contenu/build.py --regles` met la même liste dans la fonction admin() des règles Firestore.
const CONFIG_APP = {
  admins: [],
  // numéro donné aux comptes suspendus
  contact: "78 272 19 20",
};
