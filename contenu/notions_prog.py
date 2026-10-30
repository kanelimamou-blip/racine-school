# Outil commun aux notions de cours qui complètent tout le programme (un chapitre = cours + exemples + exercice guidé).
# Chaque notion est rattachée à son chapitre par le titre exact du programme (programmes.py).


def C(programme, nid, cours, enonce, exemples, context, steps, title=None, svg=None):
    """steps : (question, bonne réponse, faux 1, faux 2, faux 3, explication), 1 point chacune."""
    return {"id": nid, "title": title or programme, "programme": programme, "svg": svg, "cours": cours, "enonce": enonce,
            "exemples": exemples,
            "exo": {"context": context, "steps": [(q, [ok, f1, f2, f3], 0, e, 1) for q, ok, f1, f2, f3, e in steps]}}
