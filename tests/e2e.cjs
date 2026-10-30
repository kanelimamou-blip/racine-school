// Parcours de bout en bout de l'espace admin dans l'appli (docs/), contre les émulateurs Firebase.
// Lancer : npm test (dans tests/), avec ADMIN_EMAIL = l'e-mail du compte admin (il n'est pas écrit dans le dépôt).
// Playwright et Chromium doivent être installés ; le SDK Firebase de l'appli est servi depuis node_modules/firebase-appli.
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");
const FB = path.join(__dirname, "node_modules/firebase-appli/");
const OUT = path.join(__dirname, "captures/");
const P = "racine-school-c7395", APP = "http://localhost:5000/?emu";
const ADMIN = process.env.ADMIN_EMAIL;
if (!ADMIN) { console.log("ADMIN_EMAIL manquant"); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
let ok = 0, ko = 0;
const t = (nom, cond, info = "") => { cond ? ok++ : ko++; console.log(cond ? "OK   " : "ÉCHEC", nom, cond ? "" : info); };
const compte = (email) => fetch(`http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/${P}/accounts`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer owner" },
  body: JSON.stringify({ email, password: "secret123", emailVerified: true }) }).then((r) => r.json()).then((r) => r.localId);
const texte = async (p, sel = "body") => (await p.textContent(sel)).replace(/\s+/g, " ");

(async () => {
  const serveur = spawn("python3", ["-m", "http.server", "5000", "-d", path.join(__dirname, "../docs")], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 800));
  // base et comptes vides (les tests des règles passent avant dans le même émulateur)
  await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${P}/databases/(default)/documents`, { method: "DELETE" });
  await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${P}/accounts`, { method: "DELETE" });
  const [, aliceUid] = [await compte(ADMIN), await compte("alice@exemple.sn"), await compte("autre@exemple.sn")];
  const b = await chromium.launch();
  const ouvrir = async () => {
    const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, serviceWorkers: "block" });
    await ctx.route(/gstatic\.com\/firebasejs\/10\.12\.2\/(.*)/, (r) => r.fulfill({ path: FB + r.request().url().split("/").pop(), contentType: "text/javascript" }));
    await ctx.route(/fonts\.(googleapis|gstatic)/, (r) => r.abort());
    const p = await ctx.newPage(); p.erreurs = []; p.on("pageerror", (e) => p.erreurs.push(e.message));
    await p.goto(APP); return p;
  };
  const login = async (p, mail) => { await p.waitForSelector("#mail"); await p.fill("#mail", mail); await p.fill("#pass", "secret123"); await p.click("#login"); await p.waitForTimeout(1500); };

  // élève : fiche d'inscription, puis un plantage et une lecture refusée
  const a = await ouvrir(); await login(a, "alice@exemple.sn");
  await a.evaluate((uid) => firebase.firestore().collection("eleves").doc(uid).set({ id: uid, prenom: "Alice", nom: "Diop", classe: "3e A", classeId: "c-3e-a", level: "3e", tel: "77 111 22 33", whatsapp: "77 111 22 33", parent: "Awa Diop", telParent: "77 444 55 66", quartier: "Médina", codeParent: "ABCDEFGH" }), aliceUid);
  await a.reload(); await a.waitForTimeout(2500);
  t("l'élève arrive sur son accueil", /Rubriques|Mes missions|Question du jour/.test(await texte(a, "#view")), await texte(a, "#view"));
  await a.evaluate(() => setTimeout(() => { null.f(); }, 0));
  await a.evaluate(() => firebase.firestore().collection("erreurs").get().catch(() => {}));
  await a.waitForTimeout(1500);

  // compte qui n'est pas admin : #admin affiche son UID à copier, aucune donnée
  const o = await ouvrir(); await login(o, "autre@exemple.sn"); await o.goto(APP + "#admin"); await o.waitForTimeout(2000);
  const to = await texte(o, "#view");
  t("#admin sans droits : UID et bouton Copier", /n'est pas encore admin/.test(to) && !!(await o.$("#uid-copie")), to);
  t("#admin sans droits : aucune donnée de compte", !/alice/i.test(to));
  await o.screenshot({ path: OUT + "admin-uid.png" });

  // admin
  const e = await ouvrir(); await login(e, ADMIN); await e.goto(APP + "#admin"); await e.waitForTimeout(2000);
  let te = await texte(e, "#view");
  t("l'admin arrive sur son espace", /Espace admin/.test(te), te.slice(0, 200));
  t("chiffres : inscrits, actifs, inactifs, erreurs", /inscrits.*actifs cette semaine.*inactifs.*erreurs sur 7 jours/.test(te));
  t("Alice listée avec téléphone, quartier, activité", /Alice Diop/.test(te) && /77 111 22 33/.test(te) && /Médina/.test(te) && /1 jour d'activité sur 7/.test(te), te);
  t("bouton WhatsApp vers son numéro", !!(await e.$('a[href="https://wa.me/221771112233"]')));
  await e.screenshot({ path: OUT + "admin-comptes.png", fullPage: true });
  await e.click('[data-etat="suspendu"]'); await e.waitForTimeout(300);
  t("filtre Suspendu : personne", /Aucun compte/.test(await texte(e, "#pr-corps")));
  await e.click('[data-etat="nouveau"]'); await e.waitForTimeout(300);
  t("filtre Nouveau : Alice", /Alice Diop/.test(await texte(e, "#pr-corps")));
  await e.click('[data-etat=""]');
  await e.click('[data-onglet="erreurs"]'); await e.waitForTimeout(300);
  const je = await texte(e, "#pr-corps");
  t("journal : plantage et refus d'Alice, avec rôle et écran", /Plantage/.test(je) && /refusée/.test(je) && /alice@exemple\.sn \(Élève\)/.test(je) && /écran #accueil/.test(je), je);
  await e.screenshot({ path: OUT + "admin-erreurs.png", fullPage: true });
  await e.click('[data-onglet="comptes"]');

  // « Voir » Alice en lecture seule
  await e.fill("#pr-f", "alice"); await e.waitForTimeout(300);
  const etatAvant = await e.evaluate(() => localStorage.getItem("racine"));
  await e.click("[data-voir]"); await e.waitForTimeout(3000);
  t("Voir : bandeau « Vue de Alice Diop · lecture seule »", /Vue de Alice Diop · lecture seule/.test(await texte(e, "#barre-vue")));
  t("Voir : l'accueil de l'élève avec sa classe", /Rubriques|Question du jour/.test(await texte(e, "#view")) && (await texte(e, "#exam-tag")).includes("3e"));
  const ecriture = await e.evaluate(() => firebase.firestore().collection("eleves").doc("x").set({ a: 1 }).then(() => "écrit", (er) => er.code));
  t("Voir : toute écriture est bloquée", ecriture === "lecture-seule", ecriture);
  t("Voir : l'état du téléphone de l'admin n'est pas écrasé", (await e.evaluate(() => localStorage.getItem("racine"))) === etatAvant);
  await e.screenshot({ path: OUT + "voir-eleve.png" });
  await e.click("#vue-q"); await e.waitForTimeout(2500);
  t("Quitter : retour à l'espace admin", /Espace admin/.test(await texte(e, "#view")) && !(await e.$("#barre-vue")));

  // présentation : passer d'un rôle à l'autre
  await e.click("#pr-demo"); await e.waitForTimeout(3000);
  t("présentation : vue Direction", /Présentation/.test(await texte(e, "#barre-vue")) && /Direction|Tableau de bord|Effectifs/i.test(await texte(e, "#view")), await texte(e, "#view"));
  await e.selectOption("#vue-r", "prof"); await e.waitForTimeout(3000);
  t("présentation : vue Professeur", /Professeur|Mes classes|devoir/i.test(await texte(e, "#view")), await texte(e, "#view"));
  await e.screenshot({ path: OUT + "presentation-prof.png" });
  await e.selectOption("#vue-r", "eleve"); await e.waitForTimeout(3000);
  t("présentation : vue Élève", /Rubriques|Question du jour/.test(await texte(e, "#view")), await texte(e, "#view"));
  await e.selectOption("#vue-r", "parent"); await e.waitForTimeout(3000);
  t("présentation : vue Parent avec un enfant", /Alice/.test(await texte(e, "#view")), await texte(e, "#view"));
  await e.click("#vue-q"); await e.waitForTimeout(2500);

  // suspension
  await e.fill("#pr-f", "alice"); await e.waitForTimeout(300);
  await e.click("[data-uid]"); await e.waitForTimeout(1000);
  t("Alice suspendue dans la liste", /Suspendu/.test(await texte(e, "#pr-corps")));
  await a.reload(); await a.waitForTimeout(2500);
  t("Alice voit « suspendu, contacte l'équipe au 78 272 19 20 »", /Compte suspendu.*Contacte l'équipe au 78 272 19 20/.test(await texte(a, "#view")));
  await a.screenshot({ path: OUT + "suspendu.png" });
  const r1 = await a.evaluate(() => firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({ suspendu: false }).then(() => "écrit", (er) => er.code));
  t("Alice ne peut pas lever sa suspension", r1 === "permission-denied", r1);
  const r2 = await a.evaluate(() => firebase.firestore().collection("eleves").doc(firebase.auth().currentUser.uid).set({ nom: "x" }, { merge: true }).then(() => "écrit", (er) => er.code));
  t("Alice suspendue n'enregistre plus rien", r2 === "permission-denied", r2);
  const r3 = await a.evaluate(() => firebase.firestore().collection("erreurs").get().then(() => "lu", (er) => er.code));
  t("Alice ne lit pas le journal des erreurs", r3 === "permission-denied", r3);
  await e.click("[data-uid]"); await e.waitForTimeout(1000);
  await a.reload(); await a.waitForTimeout(2500);
  t("Alice réactivée retrouve l'appli", !/Compte suspendu/.test(await texte(a, "#view")));

  for (const [n, p] of [["élève", a], ["autre", o], ["admin", e]]) t(`aucune erreur JavaScript (${n})`, p.erreurs.filter((m) => !/reading 'f'/.test(m)).length === 0, p.erreurs.join(" | "));
  console.log(`\n${ok} réussis, ${ko} échoués`);
  await b.close(); serveur.kill();
  process.exit(ko ? 1 : 0);
})().catch((er) => { console.error(er); process.exit(1); });
