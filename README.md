# QCM avec Formules LaTeX

Ce projet contient un exemple de QCM (Questionnaire à Choix Multiples) avec des formules mathématiques en LaTeX.

## Fichiers

- `qcm_test.tex` : Document LaTeX contenant 10 questions avec formules mathématiques

## Compilation du document

Pour compiler le document LaTeX et générer un PDF :

```bash
pdflatex qcm_test.tex
```

Pour une meilleure qualité (compilation multiple pour les références) :

```bash
pdflatex qcm_test.tex
pdflatex qcm_test.tex
```

## Contenu du QCM

Le QCM contient des questions sur :

1. Équations du second degré (discriminant, formule quadratique)
2. Dérivées de fonctions polynomiales
3. Calcul d'intégrales
4. Limites de fonctions
5. Multiplication de matrices
6. Séries géométriques
7. Probabilités élémentaires
8. Identités trigonométriques
9. Logarithmes népériens
10. Produit scalaire de vecteurs

## Formules LaTeX utilisées

Le document utilise divers environnements et commandes LaTeX :

- `equation` : pour les formules numérotées
- `align` : pour les alignements multi-lignes
- Matrices avec `pmatrix`
- Fractions avec `\frac` et `\dfrac`
- Symboles mathématiques : $\infty$, $\in$, $\mathbb{R}$, $\mathbb{N}$
- Intégrales : $\int$
- Limites : $\lim$
- Sommes : $\sum$
- Vecteurs : $\vec{u}$

## Pré-requis

Pour compiler le document, vous avez besoin de :

- Une distribution LaTeX (TeX Live, MiKTeX, etc.)
- Les packages : `amsmath`, `amssymb`, `amsthm`, `babel`, `enumitem`
