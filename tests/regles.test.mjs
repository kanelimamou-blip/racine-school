// Règles Firestore (contenu/build.py) testées dans l'émulateur : espace admin, erreurs, suspension, et quelques règles de l'école.
// Lancer : npm test (dans tests/). Les règles sont générées avec un secret de test ; les vraies restent hors du dépôt.
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, addDoc, serverTimestamp, writeBatch } from "firebase/firestore";

const SECRET = "secret-de-test";
const rules = execFileSync("python3", ["-c", `import build; print(build.rules_texte(${JSON.stringify(SECRET)}))`], { cwd: new URL("../contenu", import.meta.url).pathname }).toString();
fs.writeFileSync("firestore.test.rules", rules);
const env = await initializeTestEnvironment({ projectId: "racine-school-c7395", firestore: { rules, host: "127.0.0.1", port: 8080 } });
// l'admin est reconnu par l'empreinte de son e-mail ; on teste avec un compte qui a la même empreinte côté règles
const HASH = rules.match(/== '([0-9a-f]{64})'/)[1];
const EMAIL = process.env.ADMIN_EMAIL || "";
const adminTok = EMAIL && createHash("sha256").update(EMAIL.toLowerCase()).digest("hex") === HASH ? { email: EMAIL, email_verified: true } : null;
if (!adminTok) { console.log("ADMIN_EMAIL manquant ou ne correspond pas à l'empreinte des règles : tests admin impossibles."); process.exit(1); }
const admin = env.authenticatedContext("admin", adminTok).firestore();
const adminNV = env.authenticatedContext("admin2", { ...adminTok, email_verified: false }).firestore();
const imposteur = env.authenticatedContext("imp", { email: "autre@exemple.sn", email_verified: true }).firestore();
const alice = env.authenticatedContext("alice", { email: "alice@exemple.sn", email_verified: true }).firestore();
const bob = env.authenticatedContext("bob", { email: "bob@exemple.sn" }).firestore();
const anon = env.unauthenticatedContext().firestore();
let ok = 0, ko = 0;
async function t(nom, p) { try { await p; ok++; console.log("OK   ", nom); } catch (e) { ko++; console.log("ÉCHEC", nom, e.message); } }
const S = assertSucceeds, F = assertFails;

await t("alice crée son profil", S(setDoc(doc(alice, "users/alice"), { created: serverTimestamp(), premium: false, name: "Alice", data: {} })));
await t("bob ne peut pas se créer suspendu", F(setDoc(doc(bob, "users/bob"), { created: serverTimestamp(), premium: false, suspendu: true })));
await t("bob crée son profil", S(setDoc(doc(bob, "users/bob"), { created: serverTimestamp(), premium: false, name: "", data: {} })));
await t("alice note son activité", S(updateDoc(doc(alice, "users/alice"), { vu: serverTimestamp(), jours: ["2026-10-30"], email: "alice@exemple.sn", nom: "Alice Diop", role: "eleve" })));
await t("alice remplit sa fiche", S(setDoc(doc(alice, "eleves/alice"), { prenom: "Alice", nom: "Diop", tel: "77 000 00 00" })));
await t("alice lit son profil", S(getDoc(doc(alice, "users/alice"))));
await t("alice ne lit pas le profil de bob", F(getDoc(doc(alice, "users/bob"))));
await t("alice ne liste pas les comptes", F(getDocs(collection(alice, "users"))));
await t("anonyme ne liste pas les comptes", F(getDocs(collection(anon, "users"))));
await t("imposteur ne liste pas les comptes", F(getDocs(collection(imposteur, "users"))));
await t("admin avec e-mail non vérifié refusé", F(getDocs(collection(adminNV, "users"))));
await t("admin liste les comptes", S(getDocs(collection(admin, "users"))));
await t("alice ne se donne pas le premium sans code", F(updateDoc(doc(alice, "users/alice"), { premium: true })));
await t("alice ne se suspend pas elle-même", F(updateDoc(doc(alice, "users/alice"), { suspendu: true })));
await t("imposteur ne suspend pas alice", F(updateDoc(doc(imposteur, "users/alice"), { suspendu: true })));
await t("admin ne modifie que la suspension", F(updateDoc(doc(admin, "users/alice"), { suspendu: true, premium: true })));
await t("admin : suspension booléenne seulement", F(updateDoc(doc(admin, "users/alice"), { suspendu: "oui" })));

// « Voir » : l'admin lit tout chez un compte, mais n'écrit rien
await env.withSecurityRulesDisabled(async (c) => { const d = c.firestore(); await setDoc(doc(d, "annonces/a1"), { t: "Rentrée" }); await setDoc(doc(d, "paiements/alice"), { inscription: { montant: 25000 } }); await setDoc(doc(d, "liens/p_alice"), { parent: "p", enfant: "alice" }); });
await t("admin lit la fiche d'alice", S(getDoc(doc(admin, "eleves/alice"))));
await t("admin lit les paiements d'alice", S(getDoc(doc(admin, "paiements/alice"))));
await t("admin liste les liens parent-enfant", S(getDocs(collection(admin, "liens"))));
await t("admin n'écrit pas la fiche d'alice", F(setDoc(doc(admin, "eleves/alice"), { prenom: "X" }, { merge: true })));
await t("admin n'écrit pas les paiements", F(setDoc(doc(admin, "paiements/alice"), { x: 1 })));
await t("admin ne publie pas d'annonce", F(setDoc(doc(admin, "annonces/a9"), { t: "x" })));
await t("admin n'écrit pas les progrès d'alice", F(updateDoc(doc(admin, "users/alice"), { data: {} })));
await t("imposteur ne lit pas la fiche d'alice", F(getDoc(doc(imposteur, "eleves/alice"))));

// un seul essai par téléphone : devices/{id}
const TEL = "abcdefghij0123456789";
await t("alice enregistre son téléphone", S(setDoc(doc(alice, `devices/${TEL}`), { first: serverTimestamp(), uids: ["alice"] })));
await t("identifiant de téléphone invalide refusé", F(setDoc(doc(bob, "devices/court"), { first: serverTimestamp(), uids: ["bob"] })));
await t("bob ne recrée pas le téléphone d'alice", F(setDoc(doc(bob, `devices/${TEL}`), { first: serverTimestamp(), uids: ["bob"] })));
await t("création avec un autre compte refusée", F(setDoc(doc(bob, "devices/zzzzzzzzzz0123456789"), { first: serverTimestamp(), uids: ["alice"] })));
await t("création avec une date choisie refusée", F(setDoc(doc(bob, "devices/yyyyyyyyyy0123456789"), { first: new Date(2020, 0, 1), uids: ["bob"] })));
await t("bob lit le téléphone (même appareil)", S(getDoc(doc(bob, `devices/${TEL}`))));
await t("bob ne change pas la date", F(updateDoc(doc(bob, `devices/${TEL}`), { first: serverTimestamp(), uids: ["alice", "bob"] })));
await t("bob ne retire pas alice", F(updateDoc(doc(bob, `devices/${TEL}`), { uids: ["bob"] })));
await t("bob n'ajoute pas un autre compte", F(updateDoc(doc(bob, `devices/${TEL}`), { uids: ["alice", "carla"] })));
await t("bob s'ajoute au téléphone", S(updateDoc(doc(bob, `devices/${TEL}`), { uids: ["alice", "bob"] })));
await t("bob ne s'ajoute pas deux fois", F(updateDoc(doc(bob, `devices/${TEL}`), { uids: ["alice", "bob", "bob"] })));
await t("bob ne supprime pas le téléphone", F(deleteDoc(doc(bob, `devices/${TEL}`))));
await t("alice ne liste pas les téléphones", F(getDocs(collection(alice, "devices"))));
await t("anonyme ne lit pas un téléphone", F(getDoc(doc(anon, `devices/${TEL}`))));
await t("admin liste les téléphones", S(getDocs(collection(admin, "devices"))));

// suspension
await t("alice lit les annonces (active)", S(getDoc(doc(alice, "annonces/a1"))));
await t("compte sans profil lit les annonces", S(getDoc(doc(imposteur, "annonces/a1"))));
await t("admin suspend alice", S(updateDoc(doc(admin, "users/alice"), { suspendu: true })));
await t("alice suspendue : annonces refusées", F(getDoc(doc(alice, "annonces/a1"))));
await t("alice suspendue : fiche refusée", F(setDoc(doc(alice, "eleves/alice"), { nom: "x" })));
await t("alice suspendue : progrès refusés", F(updateDoc(doc(alice, "users/alice"), { data: { a: 1 } })));
await t("alice suspendue : activité refusée", F(updateDoc(doc(alice, "users/alice"), { vu: serverTimestamp() })));
await t("alice suspendue ne lève pas sa suspension", F(updateDoc(doc(alice, "users/alice"), { suspendu: false })));
await t("alice suspendue : session de groupe refusée", F(setDoc(doc(alice, "sessions/ABC/scores/alice"), { name: "A", note: 10, score: 5, total: 10, level: "3e", at: serverTimestamp() })));
await t("alice suspendue lit son profil (écran « suspendu »)", S(getDoc(doc(alice, "users/alice"))));
await t("bob actif lit toujours les annonces", S(getDoc(doc(bob, "annonces/a1"))));
await t("admin réactive alice", S(updateDoc(doc(admin, "users/alice"), { suspendu: false })));
await t("alice réactivée lit les annonces", S(getDoc(doc(alice, "annonces/a1"))));

// journal des erreurs
const err = (uid, extra = {}) => ({ uid, compte: "alice@exemple.sn", type: "plantage", message: "TypeError: x is undefined (app.js:12)", page: "#accueil", role: "eleve", tel: "Android", at: serverTimestamp(), ...extra });
await t("alice enregistre un plantage", S(addDoc(collection(alice, "erreurs"), err("alice"))));
await t("alice enregistre un refus", S(addDoc(collection(alice, "erreurs"), err("alice", { type: "refus", message: "Missing or insufficient permissions." }))));
await t("alice ne signe pas au nom de bob", F(addDoc(collection(alice, "erreurs"), err("bob"))));
await t("anonyme n'écrit pas d'erreur", F(addDoc(collection(anon, "erreurs"), err("x"))));
await t("champ inconnu refusé", F(addDoc(collection(alice, "erreurs"), err("alice", { pirate: 1 }))));
await t("message trop long refusé", F(addDoc(collection(alice, "erreurs"), err("alice", { message: "x".repeat(501) }))));
await t("type inconnu refusé", F(addDoc(collection(alice, "erreurs"), err("alice", { type: "autre" }))));
await t("date du téléphone refusée", F(addDoc(collection(alice, "erreurs"), err("alice", { at: new Date() }))));
await t("alice ne lit pas le journal", F(getDocs(collection(alice, "erreurs"))));
await t("imposteur ne lit pas le journal", F(getDocs(collection(imposteur, "erreurs"))));
const j = await getDocs(collection(admin, "erreurs"));
await t("admin lit le journal (2 erreurs)", j.size === 2 ? Promise.resolve() : Promise.reject(new Error("taille " + j.size)));
await t("alice n'efface pas le journal", F(deleteDoc(doc(alice, "erreurs/" + j.docs[0].id))));
await t("admin ne modifie pas une erreur", F(updateDoc(doc(admin, "erreurs/" + j.docs[0].id), { message: "x" })));
const b = writeBatch(admin); j.docs.forEach((d) => b.delete(d.ref));
await t("admin efface le journal", S(b.commit()));

// équipe de l'école
const cle = "DIR-" + createHash("sha256").update(SECRET + ":directeur").digest("hex").slice(0, 6).toUpperCase();
await t("bob s'inscrit comme directeur avec la clé", S(setDoc(doc(bob, "staff/bob"), { role: "directeur", cle, nom: "Bob" })));
await t("bob directeur publie une annonce", S(setDoc(doc(bob, "annonces/a2"), { t: "Réunion" })));
await t("bob directeur ne liste pas les comptes", F(getDocs(collection(bob, "users"))));
await t("bob directeur ne lit pas le journal", F(getDocs(collection(bob, "erreurs"))));
await t("admin suspend bob (directeur)", S(updateDoc(doc(admin, "users/bob"), { suspendu: true })));
await t("bob directeur suspendu ne publie plus", F(setDoc(doc(bob, "annonces/a3"), { t: "x" })));

console.log(`\n${ok} réussis, ${ko} échoués`);
await env.cleanup();
process.exit(ko ? 1 : 0);
