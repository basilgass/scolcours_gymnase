# Suivi des analyses de checkers

Ce fichier est mis à jour automatiquement par la commande `/checker-analyse`.

## Basic

| Checker | Chemin | Dernier `/checker-analyse` |
|---------|--------|---------------------------|
| NumberChecker | `resources/js/Checkers/Basic/NumberChecker.ts` | 2026-04-07 |
| CoordChecker | `resources/js/Checkers/Basic/CoordChecker.ts` | 2026-04-07 |
| EquationChecker | `resources/js/Checkers/Basic/EquationChecker.ts` | — |
| ExactChecker | `resources/js/Checkers/Basic/ExactChecker.ts` | — |
| ExpChecker | `resources/js/Checkers/Basic/ExpChecker.ts` | — |
| FractionChecker | `resources/js/Checkers/Basic/FractionChecker.ts` | 2026-04-02 |
| FunctionChecker | `resources/js/Checkers/Basic/FunctionChecker.ts` | — |
| InputChecker | `resources/js/Checkers/Basic/InputChecker.ts` | — |
| LogChecker | `resources/js/Checkers/Basic/LogChecker.ts` | — |
| ModuloChecker | `resources/js/Checkers/Basic/ModuloChecker.ts` | — |
| PolynomChecker | `resources/js/Checkers/Basic/PolynomChecker.ts` | — |
| PrimitiveChecker | `resources/js/Checkers/Basic/PrimitiveChecker.ts` | — |
| RationalChecker | `resources/js/Checkers/Basic/RationalChecker.ts` | — |
| ScientificChecker | `resources/js/Checkers/Basic/ScientificChecker.ts` | 2026-04-07 |
| SolutionChecker | `resources/js/Checkers/Basic/SolutionChecker.ts` | — |
| StringChecker | `resources/js/Checkers/Basic/StringChecker.ts` | — |
| TrigoChecker | `resources/js/Checkers/Basic/TrigoChecker.ts` | — |
| VectorChecker | `resources/js/Checkers/Basic/VectorChecker.ts` | 2026-04-07 |

## Custom

| Checker | Chemin | Dernier `/checker-analyse` |
|---------|--------|---------------------------|
| DrawChecker | `resources/js/Checkers/Custom/DrawChecker.ts` | — |
| MatrixChecker | `resources/js/Checkers/Custom/MatrixChecker.ts` | — |
| OrderChecker | `resources/js/Checkers/Custom/OrderChecker.ts` | — |
| QcmChecker | `resources/js/Checkers/Custom/QcmChecker.ts` | — |
| StudyChecker | `resources/js/Checkers/Custom/StudyChecker.ts` | — |
| TableofsignChecker | `resources/js/Checkers/Custom/TableofsignChecker.ts` | — |
| TypeChecker | `resources/js/Checkers/Custom/TypeChecker.ts` | — |
| ZonesChecker | `resources/js/Checkers/Custom/ZonesChecker.ts` | — |

## Racine

| Checker | Chemin | Dernier `/checker-analyse` |
|---------|--------|---------------------------|
| PiChecker | `resources/js/Checkers/PiChecker.ts` | — |

---

## Tableaux des contrôles

### NumberChecker — Tableau des contrôles

> Mis à jour le 2026-04-07. Config par défaut : 0 décimale, non-strict.

| Bonne réponse | Mauvaise réponse | Score | Message renvoyé |
|---------------|-----------------|-------|-----------------|
| `2.3` | `3-4` | — | "Le signe `-` doit être en première position." *(checkFormat)* |
| `2.3` | `--3` | — | "Le signe `-` ne peut apparaître qu'une seule fois." *(checkFormat)* |
| `0.5` | `.5` | — | "Un chiffre doit précéder le point décimal." *(checkFormat)* |
| `2.3` | `3.5.6` | — | "Le point décimal ne peut apparaître qu'une seule fois." *(checkFormat)* |
| `2.3` | `abc` | — | "Veuillez entrer un nombre" *(checkFormat)* |
| `2.30` | `5.30` (config `2`) | 0 | "La réponse n'est pas juste." *(partie entière différente)* |
| `2.30` | `2.1` (config `2`) | 0 | "La réponse n'est pas juste." *(mauvais nb de décimales ET valeur fausse)* |
| `3` | `3.5` (config `0`) | 0 | "La réponse ne doit pas avoir de décimales." |
| `2.34` | `2.36` (config `2`) | 0 | "La réponse n'est pas juste." *(écart > 1 sur dernier chiffre)* |
| `2.3` | `-2.3` | 0.5 | "Peut être un problème de signe..." |
| `1.230` | `1.23` (strict, config `3`) | 0.7 | "Il faut 3 chiffre(s) après la virgule." *(valeur arrondie correcte)* |
| `1.234` | `1.23` (config `3`) | 0.7 | "Il faut 3 chiffre(s) après la virgule." *(1.234 arrondi à 2 déc. = 1.23)* |
| `2.34` | `2.35` (config `2`) | 0.7 | "Peut être un problème d'arrondi ?" *(dernier chiffre ±1)* |
| `2.3` | `2.3` (non-strict) | 1 | *(succès)* |
| `1.230` | `1.230` (strict, config `3`) | 1 | *(succès — correspondance exacte)* |

### FractionChecker — Tableau des contrôles

> Config par défaut : fraction non réduite acceptée. Config `r` : fraction réduite obligatoire.

| Bonne réponse | Mauvaise réponse | Score | Message renvoyé |
|---------------|-----------------|-------|-----------------|
| `2/3` | `` (vide) | — | "merci de donner une fraction..." *(checkFormat)* |
| `2/3` | `-` | — | "merci de donner une fraction..." *(checkFormat)* |
| `2/3` | `abc/3` | — | "Le numérateur n'est pas un nombre." *(checkFormat)* |
| `2/3` | `2/-3` | — | "Le dénominateur doit être positif." *(checkFormat)* |
| `2/3` | `2/abc` | — | "Le dénominateur n'est pas un nombre." *(checkFormat)* |
| `2/3` | `2/0` | — | "Le dénominateur ne peut pas être zéro." *(checkFormat)* |
| `1/2` (alternatives `\|\|`) | `1/3` | 0 | "La réponse donnée n'est pas juste." |
| `2/3` (config `r`) | `4/6` | 0.5 | "La fraction n'est pas réduite." |
| `3` | `3/1` | 0.9 | "Une fraction avec `1` au dénominateur peut être simplifiée." |
| `2/3` | `2/3` | 1 | *(succès)* |
| `2/3` | `4/6` (sans config `r`) | 1 | *(succès — fractions équivalentes acceptées)* |
| `2/1` | `2` (entier) | 1 | *(succès — entier accepté comme fraction)* |
| `1/2` (alternatives `\|\|`) | `1/2` ou `2/4` | 1 | *(succès — alternatives acceptées)* |

### CoordChecker — Tableau des contrôles

> Mis à jour le 2026-04-07. Config par défaut : ExactChecker. Configs `nb` → NumberChecker, `frac` → FractionChecker.

| Bonne réponse | Mauvaise réponse | Score | Message renvoyé |
|---------------|-----------------|-------|-----------------|
| `(2;3)` | `2;3` ou `(2;3` ou `2;3)` | — | "des coordonnées commencent et se terminent par des parenthèses" *(checkFormat)* |
| `(2;3)` | `(2)` | — | "des coordonnées ont au moins deux valeurs, séparées par un \(;\)" *(checkFormat)* |
| `(2;3)` | `(2;3;4)` | 0 | "la dimension ne correspond pas" |
| `(2;3)` | `(5;3)` | 0 | "la 1ère coordonnée n'est pas juste." *(message du secondaryChecker)* |
| `(2;3)` | `(2;7)` | 0 | "la 2ème coordonnée n'est pas juste." *(message du secondaryChecker)* |
| `(2;3)` | `(2;3)` | 1 | *(succès)* |

### VectorChecker — Tableau des contrôles

> Mis à jour le 2026-04-07. Config par défaut : ExactChecker, dimension 1 acceptée. Config `co` : colinéarité. Configs `nb`/`frac` héritées de CoordChecker.

| Bonne réponse | Mauvaise réponse | Score | Message renvoyé |
|---------------|-----------------|-------|-----------------|
| `(2;3)` | `2;3` | — | "des vecteurs commencent et se terminent par des parenthèses" *(checkFormat)* |
| `(2;3)` | `(2;3;4)` | 0 | "la dimension ne correspond pas" |
| `(2;3)` | `(5;3)` | 0 | "la 1ère composante n'est pas juste." *(message du secondaryChecker)* |
| `(2;3)` (config `co`) | `(0;6)` | 0 | "la 1e composante est fausse." *(une composante nulle, l'autre non)* |
| `(2;3)` (config `co`) | `(4;7)` | 0 | "la 2e composante n'est pas proportionnelle" |
| `(2;3)` | `(2;3)` | 1 | *(succès)* |
| `(5)` | `(5)` | 1 | *(succès — dimension 1 acceptée)* |
| `(2;3)` (config `co`) | `(4;6)` | 1 | *(succès — vecteur colinéaire, k=2)* |
| `(2;3)` (config `co`) | `(-4;-6)` | 1 | *(succès — vecteur colinéaire, k=-2)* |

### ScientificChecker — Tableau des contrôles

> Mis à jour le 2026-04-07. Format attendu : `a*10^b` avec `1 ≤ |a| < 10`. Config `[n]` : n chiffres significatifs (délégué au NumberChecker). Config `s` : strict.

| Bonne réponse | Mauvaise réponse | Score | Message renvoyé |
|---------------|-----------------|-------|-----------------|
| `1.234*10^-2` | `1.234` | — | "le format de réponse n'est pas une notation scientifique." *(checkFormat)* |
| `1.234*10^-2` | `abc*10^-2` | — | "le format de réponse n'est pas une notation scientifique." *(checkFormat — partie NaN)* |
| `1.234*10^-2` | `10.234*10^-2` | — | "la partie significative n'est pas entre 1 et 10 (non compris)" *(checkFormat)* |
| `1.234*10^-2` | `0.234*10^-2` | — | "la partie significative n'est pas entre 1 et 10 (non compris)" *(checkFormat)* |
| `1.234*10^-2` | `1.234*10^2` | 0 | "l'ordre de grandeur n'est pas juste..." |
| `1.234*10^-2` | `1.200*10^-2` (config `3`) | 0 | "erreur dans la partie significative: ..." *(message du NumberChecker)* |
| `1.234*10^-2` | `1.233*10^-2` (config `3`) | 0.7 | "erreur dans la partie significative: Peut être un problème d'arrondi ?" |
| `1.234*10^-2` | `1.234*10^-2` | 1 | *(succès)* |