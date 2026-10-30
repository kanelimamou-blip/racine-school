"""Construit les données de l'appli Racine School (docs/data/).

python contenu/build.py               -> questions.json et config.json
python contenu/build.py --codes 200   -> ajoute 200 codes premium ; la liste en clair
                                          est écrite hors du dépôt (public), seul le hachage est publié.
"""
import argparse
import hashlib
import json
import random
import re
import unicodedata
import secrets
from pathlib import Path

from annales import ANNALES, GUIDED, HOST
from q_plus import EXTRA
from q_plus_college import EXTRA_COLLEGE
from q_plus_lycee import EXTRA_LYCEE
from q_chapitres import CHAPITRE_FORCE, EXTRA_CHAPITRES
from q_programme import QCM_CH
from fiches import FICHES
from fiches_autres import FICHES_AUTRES
from syntheses import SYNTH
FICHES = {**FICHES, **FICHES_AUTRES}
# une synthèse = liste de chapitres ; les anciennes fiches (titre, points) gardent seulement « l'essentiel »
FICHES = {sid: [{"t": t, "cles": pts} for t, pts in f] for sid, f in FICHES.items()}
FICHES.update(SYNTH)
from catalogue import LIBRARY, LIB_HOST
from catalogue_devoirs import DEVOIRS
from exercices import EXERCISES
from notions import NOTIONS
from notions_autres import NOTIONS_AUTRES
from programmes import PROGRAMMES
NOTIONS = {**NOTIONS, **NOTIONS_AUTRES}
from questions import CLASSES, FAMILIES, FREE, LEVELS, SERIES, SUBJECTS

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent / "docs" / "data"
HASHES = ROOT / "code_hashes.txt"
CLES = ROOT / "cles_ecole.json"  # hachages des clés d'entrée de l'équipe
SALT = "racine-school:"
ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # sans 0/O ni 1/I

# Réglages de vente (à remplir par Est : numéro Wave et WhatsApp au format 221XXXXXXXXX)
CONFIG = {
    "price_fcfa": 1000,
    "wave_number": "78 272 19 20",
    # numéro Orange Money (même numéro que Wave tant qu'Est n'en donne pas un autre)
    "om_number": "78 272 19 20",
    "whatsapp": "221782721920",
    # classes d'examen : nom de l'examen et date indicative
    "exams": {"3e": ["BFEM", "2027-07-06"], "Tle": ["BAC", "2027-07-01"]},
}


# Règles Firestore à coller dans la console Firebase (Firestore Database > Règles).
# Elles contiennent le secret des codes : elles sont écrites hors du dépôt, à côté de la liste des codes.
# Un code = 5 caractères au hasard + « - » + 6 caractères de contrôle (début du SHA-256 de secret + partie au hasard).
RULES = """rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function validCode(code) {
      let p = code.split('-');
      return p.size() == 2 && p[0].size() == 5
        && hashing.sha256('SECRET' + p[0]).toHexString().lower()[0:6] == p[1].lower();
    }
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      // création : date fixée par le serveur et sans premium
      allow create: if request.auth != null && request.auth.uid == uid
        && request.resource.data.created == request.time
        && request.resource.data.premium == false;
      // la date de création ne change jamais ; le premium ne s'obtient qu'avec un code réclamé par cet élève
      allow update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.created == resource.data.created
        && (request.resource.data.premium == resource.data.premium
          || (request.resource.data.premium == true
            && getAfter(/databases/$(db)/documents/claims/$(request.resource.data.code)).data.uid == uid));
    }
    // sessions de groupe : chaque élève connecté écrit seulement sa propre note, le groupe lit le classement
    match /sessions/{code}/scores/{uid} {
      allow read: if request.auth != null && code.size() <= 12;
      allow create, update: if request.auth != null && request.auth.uid == uid && code.size() <= 12
        && request.resource.data.keys().hasOnly(['name', 'note', 'score', 'total', 'level', 'at'])
        && request.resource.data.name is string && request.resource.data.name.size() <= 30
        && request.resource.data.note is number && request.resource.data.note >= 0 && request.resource.data.note <= 20
        && request.resource.data.score is int && request.resource.data.total is int
        && request.resource.data.score >= 0 && request.resource.data.score <= request.resource.data.total && request.resource.data.total <= 50
        && request.resource.data.level is string && request.resource.data.level.size() <= 20
        && request.resource.data.at == request.time;
      allow delete: if false;
    }
    // un code ne peut être réclamé qu'une fois (pas de recréation possible)
    match /claims/{code} {
      allow read, update, delete: if false;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid && validCode(code);
    }

    // ---------- Espace école : direction, professeurs, surveillants, personnel, parents
    function signedIn() { return request.auth != null; }
    function staffRole() {
      let p = /databases/$(db)/documents/staff/$(request.auth.uid);
      return signedIn() && exists(p) ? get(p).data.role : '';
    }
    function isDir() { return staffRole() == 'directeur'; }
    function isStaff() { return staffRole() == 'directeur' || staffRole() == 'prof'; }
    function isEquipe() { return staffRole() in ['directeur', 'prof', 'surveillant', 'personnel']; }
    function isCaisse() { return staffRole() in ['directeur', 'personnel']; }
    function isParentDe(eleve) { return signedIn() && exists(/databases/$(db)/documents/liens/$(request.auth.uid + '_' + eleve)); }
    // clé d'entrée = préfixe + « - » + 6 caractères tirés du secret et du rôle
    function validKey(role, cle) {
      let p = cle.split('-');
      return p.size() == 2 && p[1].lower() == hashing.sha256('SECRET:' + role).toHexString().lower()[0:6];
    }
    // un membre de l'équipe s'inscrit avec la clé d'entrée de son rôle ; le directeur voit toute l'équipe
    match /staff/{uid} {
      allow read: if signedIn() && (request.auth.uid == uid || isDir());
      allow create, update: if signedIn() && request.auth.uid == uid
        && request.resource.data.role in ['directeur', 'prof', 'surveillant', 'personnel']
        && validKey(request.resource.data.role, request.resource.data.cle);
      allow delete: if isDir();
    }
    // annuaire de l'équipe (nom, rôle, téléphone), sans les clés
    match /annuaire/{uid} {
      allow read: if isEquipe();
      allow create, update: if signedIn() && request.auth.uid == uid && isEquipe();
      allow delete: if isDir() || (signedIn() && request.auth.uid == uid);
    }
    // fiche d'inscription : l'élève écrit la sienne, l'équipe de l'école et ses parents la lisent
    match /eleves/{uid} {
      allow read: if signedIn() && (request.auth.uid == uid || isEquipe() || isParentDe(uid));
      allow create, update: if signedIn() && request.auth.uid == uid && request.resource.data.keys().size() < 30;
      allow delete: if isDir();
    }
    // code remis par l'élève à ses parents : lu seulement par son code exact
    match /codesParent/{code} {
      allow get: if signedIn();
      allow list, update, delete: if false;
      allow create: if signedIn() && request.resource.data.eleve == request.auth.uid && code.size() == 8;
    }
    // lien parent -> enfant, créé par le parent avec le code de l'enfant
    match /liens/{id} {
      allow read: if signedIn() && resource.data.parent == request.auth.uid;
      allow create: if signedIn() && id == request.auth.uid + '_' + request.resource.data.enfant
        && request.resource.data.parent == request.auth.uid
        && get(/databases/$(db)/documents/codesParent/$(request.resource.data.code)).data.eleve == request.resource.data.enfant;
      allow update: if false;
      allow delete: if signedIn() && resource.data.parent == request.auth.uid;
    }
    // paiements de scolarité : tenus par la direction et la caisse, l'élève et ses parents voient les siens
    match /paiements/{uid} {
      allow read: if signedIn() && (request.auth.uid == uid || isCaisse() || isParentDe(uid));
      allow write: if isCaisse();
    }
    // devoirs publiés par les professeurs pour une classe
    match /devoirs/{id} {
      allow read: if signedIn();
      allow create: if isStaff() && request.resource.data.par == request.auth.uid;
      allow update, delete: if isDir() || (isStaff() && resource.data.par == request.auth.uid);
    }
    // ce qui a été vu en classe, pour réviser le soir
    match /seances/{id} {
      allow read: if signedIn();
      allow create: if isStaff() && request.resource.data.par == request.auth.uid;
      allow update, delete: if isDir() || (isStaff() && resource.data.par == request.auth.uid);
    }
    // appel en classe et retards au portail : vus par l'équipe
    match /appels/{id} {
      allow read: if isEquipe();
      allow create, update: if isEquipe() && request.resource.data.par == request.auth.uid;
      allow delete: if isDir();
    }
    match /portail/{jour} {
      allow read, write: if isEquipe();
    }
    // notes : une évaluation par document (équipe), et le relevé de chaque élève (lui, ses parents, l'équipe)
    match /notes/{id} {
      allow read: if isEquipe();
      allow create: if isStaff() && request.resource.data.par == request.auth.uid;
      allow update, delete: if isDir() || (isStaff() && resource.data.par == request.auth.uid);
    }
    match /releves/{uid} {
      allow read: if signedIn() && (request.auth.uid == uid || isEquipe() || isParentDe(uid));
      allow write: if isStaff();
    }
    // emplois du temps (lus par tous), absences des professeurs, avancement du programme
    match /edt/{cid} {
      allow read: if signedIn();
      allow write: if isDir();
    }
    match /absprofs/{id} {
      allow read: if isEquipe();
      allow write: if isDir();
    }
    match /progressions/{id} {
      allow read: if isEquipe();
      allow write: if isStaff();
    }
    // registres de l'école (discipline, main courante, inventaire...) ; la paie et les dépenses restent à la caisse
    match /registres/{id} {
      allow read, delete: if isEquipe() && (!(resource.data.reg in ['paie', 'depenses']) || isCaisse());
      allow create, update: if isEquipe() && (!(request.resource.data.reg in ['paie', 'depenses']) || isCaisse());
    }
    // pré-inscriptions déposées par les familles, traitées par la direction et la caisse
    match /preinscriptions/{id} {
      allow create: if signedIn();
      allow read, update, delete: if isCaisse();
    }
    // annonces et calendrier de l'école : publiés par la direction, lus par tous
    match /annonces/{id} {
      allow read: if signedIn();
      allow write: if isDir();
    }
    // classes, mensualités, année scolaire : réglés par la direction
    match /ecole/{doc} {
      allow read: if signedIn();
      allow write: if isDir();
    }
  }
}
"""
PRIVATE = Path("/mnt/project-files/racine-school/prive")
SECRET_FILE = PRIVATE / "secret-codes.txt"


def secret():
    if not SECRET_FILE.exists():
        PRIVATE.mkdir(parents=True, exist_ok=True)
        SECRET_FILE.write_text(secrets.token_hex(16))
    return SECRET_FILE.read_text().strip()


def make_code(sec):
    head = "".join(secrets.choice(ALPHABET) for _ in range(5))
    return head + "-" + hashlib.sha256((sec + head).encode()).hexdigest()[:6].upper()


def code_hash(code):
    return hashlib.sha256((SALT + code.strip().upper().replace(" ", "")).encode()).hexdigest()


def new_codes(n, dest):
    sec = secret()
    codes = [make_code(sec) for _ in range(n)]
    with HASHES.open("a") as f:
        f.writelines(code_hash(c) + "\n" for c in codes)
    dest = Path(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    with dest.open("a") as f:
        f.writelines(c + "\n" for c in codes)
    (PRIVATE / "firestore.rules").write_text(rules_texte(sec))
    print(f"{n} codes ajoutés dans {dest}")


def rules_texte(sec):
    """Règles à coller dans la console : sans commentaires ni lignes vides, en ASCII (le copier-coller depuis un téléphone abîme les accents)."""
    lignes = [l for l in RULES.replace("SECRET", sec).splitlines() if l.strip() and not l.strip().startswith("//")]
    return "\n".join(lignes) + "\n"


ROLES = {"directeur": "DIR", "prof": "PROF", "surveillant": "SURV", "personnel": "PERS"}


def new_keys():
    """Clés d'entrée de l'espace école : une par rôle (direction, professeurs, surveillants, personnel), tirées du secret."""
    sec = secret()
    keys = {r: f"{pre}-{hashlib.sha256((sec + ':' + r).encode()).hexdigest()[:6].upper()}" for r, pre in ROLES.items()}
    CLES.write_text(json.dumps({r: code_hash(k) for r, k in keys.items()}, indent=1) + "\n")
    (PRIVATE / "cles-ecole.txt").write_text("".join(f"{r} : {k}\n" for r, k in keys.items()))
    (PRIVATE / "firestore.rules").write_text(rules_texte(sec))
    print(f"Clés d'entrée écrites dans {PRIVATE / 'cles-ecole.txt'}")


def _norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def chapter_of(sid, text):
    """Indice du chapitre du programme dont les mots-clés apparaissent le plus dans le texte (−1 si aucun)."""
    t, best, top = _norm(text), -1, 0
    for i, (_, kws) in enumerate(PROGRAMMES.get(sid, [])):
        n = sum(len(re.findall(r"(?<![a-z])" + re.escape(_norm(k)), t)) for k in kws)
        if n > top:
            best, top = i, n
    return best


def build():
    questions, subjects = [], []
    for sid, levels, name, items in SUBJECTS:
        items = items + EXTRA.get(sid, []) + EXTRA_COLLEGE.get(sid, []) + EXTRA_LYCEE.get(sid, []) + EXTRA_CHAPITRES.get(sid, [])
        # QCM rangés par chapitre : le chapitre est imposé
        force = {q: t for t, qs in QCM_CH.get(sid, {}).items() for q, *_ in qs}
        items = items + [x for qs in QCM_CH.get(sid, {}).values() for x in qs]
        fams = {f"{c} {f}" for c in SERIES for f in set(FAMILIES.values())}
        assert set(levels) <= set(LEVELS) | fams, (sid, levels)
        subjects.append({"id": sid, "levels": levels, "name": name, "count": len(items), "free": min(FREE, len(items)), "fiche": sid in FICHES, "notions": len(NOTIONS.get(sid, []))})
        for i, (q, choices, a, ex, *src) in enumerate(items):
            assert len(choices) == 4 and 0 <= a < 4, (sid, q)
            qid = f"{sid}-{i + 1}"
            # ordre des choix mélangé (fixe pour chaque question) pour que la bonne réponse ne soit pas toujours à la même place
            order = list(range(4))
            random.Random(qid).shuffle(order)
            questions.append({"id": qid, "s": sid, "q": q, "c": [choices[j] for j in order], "a": order.index(a), "e": ex, "free": i < FREE, "ch": [t for t, _ in PROGRAMMES[sid]].index(force.get(q) or CHAPITRE_FORCE[q]) if q in force or q in CHAPITRE_FORCE else chapter_of(sid, f"{q} {choices[a]} {ex}"), **({"alt": "tle-maths", "ach": chapter_of("tle-maths", f"{q} {choices[a]} {ex}")} if sid.startswith("tle-annales-maths") else {}), **({"src": src[0]} if src else {})})
    # sujets guidés et exercices corrigés : choix mélangés de la même façon, étape par étape
    def guided(key, parts):
        out = []
        for k, part in enumerate(parts):
            steps = []
            for j, (q, choices, a, ex, pts) in enumerate(part["steps"]):
                assert len(choices) == 4 and 0 <= a < 4, (key, q)
                order = list(range(4))
                random.Random(f"{key}-{k}-{j}").shuffle(order)
                steps.append({"q": q, "c": [choices[i] for i in order], "a": order.index(a), "e": ex, "pts": pts})
            out.append({"title": part["title"], "context": part["context"], "steps": steps})
        return out
    for an in ANNALES:
        if GUIDED.get(an["id"]):
            an["guided"] = guided(an["id"], GUIDED[an["id"]])
    exercises = []
    for ex in EXERCISES:
        assert set(ex["levels"]) <= set(LEVELS) | fams, ex["id"]
        exercises.append({**{k: v for k, v in ex.items() if k != "parts"}, "guided": guided(ex["id"], ex["parts"])})
    # notions de cours : le cours reste dans « notions », l'exercice d'application rejoint les exercices corrigés
    notions = {}
    subj = {s[0]: s for s in SUBJECTS}
    for sid, chapters in NOTIONS.items():
        assert sid in subj, sid
        notions[sid] = []
        for i, ch in enumerate(chapters):
            notions[sid].append({k: v for k, v in ch.items() if k not in ("exo", "programme")} | {"free": i == 0, "pch": [t for t, _ in PROGRAMMES[sid]].index(ch["programme"]) if "programme" in ch else chapter_of(sid, ch["title"] + " " + " ".join(ch["cours"] + ch["enonce"]))})
            exo = ch["exo"]
            exercises.append({"id": "ch-" + ch["id"], "levels": subj[sid][1], "subject": subj[sid][2], "free": i == 0, "chapter": ch["id"],
                              "title": ch["title"], "src": "Exercice d'application du cours",
                              "guided": guided("ch-" + ch["id"], [{"title": ch["title"], "context": exo["context"], "steps": exo["steps"]}])})
    assert set(PROGRAMMES) <= {s[0] for s in SUBJECTS}
    assert set(EXTRA) | set(EXTRA_COLLEGE) | set(EXTRA_LYCEE) | set(EXTRA_CHAPITRES) | set(QCM_CH) <= {s[0] for s in SUBJECTS} and set(FICHES) <= {s[0] for s in SUBJECTS}
    for sid, chs in SYNTH.items():
        assert all("p" not in c or 0 <= c["p"] < len(PROGRAMMES[sid]) for c in chs), sid
    for e in LIBRARY + DEVOIRS:
        assert set(e["levels"]) <= set(LEVELS) | fams, e
    hashes = HASHES.read_text().split() if HASHES.exists() else []
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "questions.json").write_text(json.dumps({"classes": CLASSES, "series": SERIES, "families": FAMILIES, "levels": LEVELS, "subjects": subjects, "questions": questions, "annales": ANNALES, "annalesHost": HOST, "library": LIBRARY, "libraryHost": LIB_HOST, "fiches": FICHES, "exercises": exercises, "notions": notions, "devoirs": DEVOIRS, "programmes": {k: [t for t, _ in v] for k, v in PROGRAMMES.items()}}, ensure_ascii=False, separators=(",", ":")))
    cles = json.loads(CLES.read_text()) if CLES.exists() else {}
    (OUT / "config.json").write_text(json.dumps({**CONFIG, "salt": SALT, "codes": hashes, "cles": cles}, ensure_ascii=False, separators=(",", ":")))
    print(f"{len(questions)} questions, {len(subjects)} matières, {len(hashes)} codes")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--codes", type=int, default=0)
    p.add_argument("--dest", default="/mnt/project-files/racine-school/prive/codes-premium.txt")
    p.add_argument("--cles", action="store_true", help="écrit les clés d'entrée de l'équipe (direction, professeurs, surveillants, personnel)")
    args = p.parse_args()
    if args.cles:
        new_keys()
    if args.codes:
        new_codes(args.codes, args.dest)
    build()
