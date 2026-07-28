**SCOLCOURS**
Feuille de route — Migration `strictNullChecks`
Juillet 2026

# Contexte

Durcissement TypeScript progressif de `tsconfig.strict.json`. Le flag `noImplicitAny` est
TERMINÉ (0 erreur). L'activation de `strictNullChecks` révèle **937 erreurs / 189 fichiers**
(mesure initiale 2026-07-09). Ce document découpe la résorption en lots et suit l'avancement.

Étape suivante après ce chantier : évaluer `strictPropertyInitialization`, puis basculer les
flags dans le `tsconfig.json` principal.

## Commande de vérification

```
npx vue-tsc -p tsconfig.strict.json --noEmit
```

Filtrer par dossier de lot avec `Select-String` (PowerShell) sur la sortie.
Exit code ≠ 0 tant qu'il reste des erreurs ailleurs — normal, compter par filtre.

## Décisions structurantes (validées 2026-07-09)

1. **Accès nullish** (515 err : TS18047/18048/2531/2532/2454/18049) → **guard / narrowing early**
   (`if (x == null) return`, puis usage). `?.` / `??` acceptés au point d'accès quand le flux le
   justifie. `!` (non-null assertion) réservé aux invariants prouvés, documenté par commentaire.
2. **Interfaces nullable Laravel** (ex. `LessonInterface.lessonable_type: X | null`) → **garder
   nullable + guard au point d'usage**. On ne raffine PAS l'interface par défaut (évite la cascade
   inverse aux points d'assignation).
3. **Ordonnancement** → **par domaine, source-first** (socle partagé d'abord).
4. **Domaine Languages** → **traité comme le reste**, PAS exclu du tsconfig.

## Familles d'erreurs (mesure initiale)

| Famille | Codes | Nb | Recette |
| --- | --- | --- | --- |
| Accès nullish | 18047/18048/2531/2532/2454/18049/18046 | 515 | guard/narrowing early, `?.`, `??` |
| Assignabilité | 2322/2345/2769/2722/2538/2783 | 366 | narrow avant appel OU décision interface (garder nullable) |
| Propriété inexistante | 2339 | 44 | cas par cas (vrais mismatchs) |
| Flow/return + implicit any | 2366/2774/7006 | 12 | cas par cas |

## Recettes verrouillées (pilote Lot 1)

- **Type-guard `is`** : quand une comparaison (`x > 0`, `x !== ""`) est utilisée à répétition sur
  un `T | null` puis la valeur passée à une fonction attendant `T`, une comparaison brute **ne
  rétrécit pas** le type. Extraire un type-guard `function isPositive(v: number | null): v is number`
  fait la vérif ET le narrowing en un seul appel. DRY et zéro `!`. (a réglé ~110 err d'un fichier)
- **`let` non initialisé réassigné conditionnellement** (TS2454) : initialiser `= null` avec type
  `T | null` puis garder chaque usage (`x !== null && x.prop`).
- **Union de retour avec propriété optionnelle** (`raw?`) : garder par `!result.value.raw` avant
  d'y accéder, en plus du garde `=== false`.
- **Coercion `?? 0` fidèle** : `null` valait déjà 0 en arithmétique JS (`null * x`, `null < 0`,
  `null + x`) → `(x ?? 0)` préserve exactement le comportement runtime sur les chaînes de calcul.
- **Fonction retournant parfois `null`** : déclarer le type de retour `T | null` et garder les
  champs en tête du bloc « résolu » (early `return null`) pour rétrécir en une fois.
- **Bugs latents** : les gardes révèlent les usages non gardés (ex. un `value.a` copié-collé là où
  `value.b` était attendu). Les corriger, pas les masquer avec `!` — masqués par un `try/catch` ici.

---

# Vue d'ensemble — Lots

| Lot | Zone | Err. initiales | État |
| --- | --- | --- | --- |
| Lot 0 | Socle partagé (Composables + helpers + Checkers + stores) | ~85 | ✅ Terminé (0.A→0.D) |
| Lot 2 | Reste de Tools | ~47 | ✅ Terminé (2.A→2.D) |
| Lot 3 | Keyboards | 122 | ✅ Terminé (3.A→3.F) |
| Lot 4 | Widgets | 80 | 🟨 En cours (4.A→4.C ✅) |
| Lot 5 | Languages | ~77 | ⬜ À faire |
| Lot 6 | Courses + Pages/Courses | ~79 | ⬜ À faire |
| Lot 7 | Decks | ~68 | ⬜ À faire |
| Lot 8 | Pi + ProbabilityTree + Grapheur + Elements + Questions | ~118 | ⬜ À faire |
| Lot 9 | Reste dispersé (Devs, Challenges, Form, Ui, Chapters, Blocks, Pages/*, racine) | ~110 | ⬜ À faire |
| Lot 10 | Tests + bascule config finale | ~10 + config | ⬜ À faire |

Note : les compteurs baissent par cascade (source-first). Re-mesurer avant chaque nouveau lot.

Légende état : ⬜ À faire · 🟨 En cours · ✅ Terminé

## Suivi du compteur global

| Date | Après lot | Total erreurs |
| --- | --- | --- |
| 2026-07-09 | (initial) | 937 |
| 2026-07-09 | Lot 1 | 814 |
| 2026-07-09 | Lot 0.A (useTextEditor) | 790 |
| 2026-07-09 | Lot 0.B (score/challenge) | 764 |
| 2026-07-27 | Lot 0.C (Checkers) | 750 |
| 2026-07-27 | Lot 0.D (helpers/modèles) → **Lot 0 clos** | 739 |
| 2026-07-27 | Lot 2.A (etude-de-fonction-rationnelle) | 728 |
| 2026-07-27 | Lot 2.B (statistiques + positions-relatives) | 710 |
| 2026-07-28 | Lot 2.C (vecteurs + tableau-des-valeurs) | 704 |
| 2026-07-28 | Lot 2.D (triangle/venn/ToolForm/quadratique/valeur-absolue/ToolsSearch) → **Lot 2 clos** | 691 |
| 2026-07-28 | Lot 3.A (KeyboardDisplay) | 680 |
| 2026-07-28 | Lot 3.B (KeyboardStudyHelpers + CreatedList) | 650 |
| 2026-07-28 | Lot 3.C (KeyboardStudy) | 631 |
| 2026-07-28 | Lot 3.D (KeyboardTableOfSigns + KeyboardMatrix) | 602 |
| 2026-07-28 | Lot 3.E (KeyboardDraw + KeyboardDrawZones) | 592 |
| 2026-07-28 | Lot 3.F (reste Keyboards + FormKeyboard) — **Lot 3 clos** | 567 |
| 2026-07-28 | Lot 4.A (matrixSolver.ts) | 563 |
| 2026-07-28 | Lot 4.B (matrice-augmentee + PiMatrix source) | 524 |
| 2026-07-28 | Lot 4.C (matrice-visualisation + graphe-de-markov) | 515 |

---

# Fiches détaillées

## Lot 0 — Socle partagé — 86 err (mesure post-Lot 1, 21 fichiers, hétérogène)
**À faire en premier** (propagation maximale : ces modules sont importés partout).
Lot le plus décisionnel : trancher ici la nullabilité des interfaces partagées décide la forme des
gardes dans les lots aval (Decks/Courses).

**Exécution : sous-groupe par sous-groupe** (décision validée), vue-tsc à chaque étape, plan
détaillé par sous-groupe avant édition.

### Sous-groupes
- **0.A — Éditeur** — `useTextEditor.ts`. ✅ **TERMINÉ** — voir section « Lots terminés ».
- **0.B — Score/Challenge** — `useChallenge`/`useTos`/`useKeyboard`. ✅ **TERMINÉ** — voir section
  « Lots terminés ». Cascade laissée au Lot 2 : `etude-de-fonction-rationnelle.vue` (+3 err, nullabilité
  `ETUDE.YIntercept` / `EXTREMA.answer` / `ASYMPTOTE.delta.roots.{x,y}.display`).
- **0.C — Checkers** — TrigoChecker/SolutionChecker/FractionChecker/CheckerAbstract/PiChecker/
  FunctionChecker/EquationChecker. ✅ **TERMINÉ** — voir section « Lots terminés ».
- **0.D — Helpers/Modèles** — `makeModel`/`useStoreScore`/`mdAutofill`/`helperFunctions`/
  `katexDirectives`/`scolcours`/`useToolsStorage` + 5 interfaces. ✅ **TERMINÉ** — voir « Lots terminés ».

### Décisions validées (2026-07-09)
1. **Interfaces modèles placeholder → nullable** : `makeModel` produit légitimement `null` sur des
   champs non-null. Rendre nullable dans l'interface :
   - `WidgetInterface.theme_id: number` → `number | null`
   - `DeckInterface.chapter` → `ChapterInterface | null` ; `DeckInterface.user` → `ScoreInterface<…> | null`
   - `CardInterface.user.data` : utiliser `undefined` (le type est déjà `… | undefined`) plutôt que `null`
   - `component` dupliqué (TS2783) : fallback explicite `config.widget?.component ?? 'draw-parser-widget.vue'`
   Cascade attendue vers Decks (Lot 7) / Courses (Lot 6) → gardes au point d'usage.
2. **Refs numériques → `number | null` + garde** (useChallenge currentTimeLimit/targetScore,
   useStoreScore states) : refléter honnêtement « pas encore défini », garder aux usages.

Pièges : imports directs des checkers ([[project_checkers_barrel_cycle]]), `markRaw` pimath
([[project_pimath_vue_reactivity]]).

## Lot 2 — Reste de Tools — 50 err (mesure 2026-07-27, 11 fichiers)
Découpé en sous-groupes (exécution sous-groupe par sous-groupe, vue-tsc + diff à chaque étape) :
- **2.A — `etude-de-fonction-rationnelle.vue`** (11). ✅ **TERMINÉ** — voir « Lots terminés ».
- **2.B — `statistiques.vue` (9) + `positions-relatives.vue` (9)**. ✅ **TERMINÉ** — voir « Lots terminés ».
- **2.C — `vecteurs.vue` (5) + `tableau-des-valeurs.vue` (2)**. ✅ **TERMINÉ** — voir « Lots terminés ».
- **2.D — reste** : `triangle.vue` (4), `venn.vue` (3), `Parts/ToolForm.vue` (3), `quadratique.vue` (2),
  `fonction-valeur-absolue.vue` (1), `Parts/ToolsSearch.vue` (1). ✅ **TERMINÉ** — voir « Lots terminés ». **Lot 2 clos.**

## Lot 3 — Keyboards — 122 err (mesure 2026-07-28, 15 fichiers)
Découpé en sous-groupes source-first (deux sources en amont : `KeyboardDisplay.vue` importé par ~10 claviers ;
`KeyboardStudyHelpers.ts` source du cluster Study). Exécution 3.A→3.F, vue-tsc + diff isolé (`git stash`) à chaque étape.

- **3.A — `KeyboardDisplay.vue`** (11). ✅ **TERMINÉ** — voir « Lots terminés ».
- **3.B — `KeyboardStudyHelpers/KeyboardStudyHelpers.ts` (30) + `KeyboardStudyHelpers/KeyboardStudyCreatedList.vue` (1)** (31). ✅ **TERMINÉ** — voir « Lots terminés ». Cascade +1 différée vers 3.C.
- **3.C — `KeyboardStudy.vue`** (19, dont +1 cascade de 3.B). ✅ **TERMINÉ** — voir « Lots terminés ».
- **3.D — `KeyboardTableOfSigns.vue` (14) + `KeyboardMatrix.vue` (14)** (28). ✅ **TERMINÉ** — voir « Lots terminés ».
- **3.E — `KeyboardDraw.vue` (6) + `KeyboardDrawZones.vue` (3)** (9) — cluster Draw. ✅ **TERMINÉ** — voir « Lots terminés ».
- **3.F — reste (25)** : `KeyboardResolutionHelpers/KeyboardResolutionSolution.vue` (6), `KeyboardResolutionHelpers/KeyboardResolutionFactorisation.vue` (2), `KeyboardBasic.vue` (3), `KeyboardType.vue` (3), `KeyboardSentence.vue` (2), `KeyboardOrder.vue` (1), `Form/FormKeyboard.vue` (8, clavier-adjacent, indépendant de Display → sans contrainte d'ordre). ✅ **TERMINÉ** — voir « Lots terminés ». **Lot 3 clos.**

Docs : consulter `.claude/docs/keyboards.md` (guide K6, familles display-driven/custom) avant chaque sous-groupe ; activer skill `question-system` si `Components/Questions` touché.

## Lot 4 — Widgets — 80 err (mesure 2026-07-28, 13 fichiers ; total global re-mesuré 570, dérive +3)
Découpé en sous-groupes source-first (`matrixSolver.ts` est la source, importé uniquement par
`matrice-augmentee.vue`). Exécution 4.A→4.E, vue-tsc + diff isolé (`git stash`) à chaque étape.

- **4.A — `algebre/matrixSolver.ts`** (7). ✅ **TERMINÉ** — voir « Lots terminés ».
- **4.B — `algebre/matrice-augmentee.vue`** (35, + bonus PiMatrix). ✅ **TERMINÉ** — voir « Lots terminés ».
- **4.C — `algebre/matrice-visualisation.vue` (6) + `algebre/graphe-de-markov.vue` (3)** (9). ✅ **TERMINÉ** — voir « Lots terminés ».
- **4.D — `arithmetique/algorithme-bezout.vue` (12) + `algorithme-bezout-table.vue` (3) + `algorithme-euclide.vue` (1)** (16). ⬜ Cluster Bézout/Euclide.
- **4.E — reste (13)** : `arithmetique/finances-amortissement.vue` (5), `statistiques/permutation-mot.vue` (3),
  `arithmetique/Parts/crypto-header.vue` (2), `etapes-par-etapes.vue` (1), `analyse/tableau-de-signes.vue` (1), `Card-widget.vue` (1).

## Lot 5 — Languages — ~77 err
`Languages/LanguageMatch.vue` (23), `LanguageType.vue` (22), `LanguageGuess.vue` (13), + `useLanguage`.
Traité comme le reste (décision validée), même si sous-système mis de côté.

## Lot 6 — Courses + Pages/Courses — ~79 err
`Courses/LessonAsideScore.vue` (23), `CourseAgenda.vue` (12), `Pages/Courses/CourseEdit.vue` (9)…
Dépend des interfaces Lesson/Score tranchées au Lot 0.

## Lot 7 — Decks — ~68 err
`Decks/DeckCards.vue` (27), `Decks/Parts/DeckCardEdit.vue` (22), `Pages/Decks`.
Cascade Lot 0.D (nullabilité `DeckInterface.chapter`/`user`, `WidgetInterface.theme_id`) : +6 sites à
garder — `DeckDisplay.vue` (`props.deck.user` possibly null, l.91), `DeckCardsEditIndex.vue`,
`DeckEdit.vue`, `DeckIndex.vue`, `admin/AdminDeck.vue`.

## Lot 8 — Pi + ProbabilityTree + Grapheur + Elements + Questions — ~118 err
`ProbabilityTree.ts` (30), `Components/Pi/*` (30), `Grapheur/GrapheurFunction.vue` (18),
`Elements/ToolEditItem.vue` (15) + Elements, `Components/Questions/*` (17).

## Lot 9 — Reste dispersé — ~110 err
`Devs` (25, dont DevVenn 13), `Challenges` (14), `Form` (hors FormKeyboard), `Ui` (10),
`Chapters` (8), `Blocks` (8), `Evaluations`, `Pages/*` (Admin 8, Evaluations 7, Quizzs 6, Teams 5…),
composants racine (`MoveItemTo`, `MermaidDiagram`, `ScolcoursSearch`), `PiMathExtended/PiRadian.ts`.
Cascade Lot 0.D : `types/postInterfaces.ts:15` TS2430 — `QuestionInterface extends QuestionDynamicInterface`
échoue car `ScoreInterface.is_resolved` est désormais `boolean | null`. Fix : aligner
`QuestionDynamicInterface.user.is_resolved` (inline `boolean`, l.11) en `boolean | null`.

## Lot 10 — Tests + bascule config — ~10 err + config
`tests/ts/**` (10 err, `possibly undefined` sur helpers de test). Puis décommenter définitivement
`strictNullChecks` dans `tsconfig.strict.json` et lancer l'évaluation de
`strictPropertyInitialization` (décision config séparée à valider).

---

# Risques identifiés

- **Cascade inverse** : raffiner une interface au Lot 0 peut créer des erreurs aux assignations
  ailleurs → décision « garder nullable + guard » pour minimiser.
- **Vrais bugs révélés** : les TS2339/2322 cachent parfois des `undefined` runtime (comme au lot
  noImplicitAny). À corriger réellement, pas masquer avec `!`.
- **pimath / reactivity** : `markRaw` avant de stocker une instance pimath dans un ref/reactive.
- **Cycle barrel Checkers** : imports directs `@/Checkers/Basic/X`.
- **Vite verrou Windows** : ne pas renommer de dossiers pendant `npm run dev` (aucun renommage prévu).
- **Compteurs mouvants** : re-mesurer le total avant de dimensionner le lot suivant.

---

# Lots terminés

| Lot | Titre | Date fin | Résumé |
| --- | --- | --- | --- |
| Lot 1 | `trigonometrie.vue` (pilote mono-cause) | 2026-07-09 | 124 → 0 err. Recette pilote verrouillée : type-guard `isPositive(v): v is number` remplaçant les `> 0` (narrowing DRY), gardes early-return sur `triangle2`/`raw`/`formatTriangle`, coercion `?? 0` fidèle dans `isNotResvoled`/`isResolvable`, signature `drawTriangle` nullable. Zéro `!`. 1 bug runtime corrigé (thmSinusAngle utilisait `value.a` non gardé au lieu de `value.b`). Total global 937 → 814. |
| Lot 0.A | `useTextEditor.ts` (éditeur) | 2026-07-09 | 24 → 0 err. Gardes `if (!el) return` (updateCurrentLine/handleKeydown/indenter/deindenter) ; `el` mort supprimé (applyTabStops) ; `removeTabStops` retour `: string` → `: void` ; `greekLaTeX[event.data ?? '']` ; garde DOM dans updateValue. Zéro `!`, aucun changement fonctionnel. Total global 814 → 790. |
| Lot 4.C | `algebre/matrice-visualisation.vue` (6) + `algebre/graphe-de-markov.vue` (3) | 2026-07-28 | 9 → 0 err, contribution nette **−9** (524 → 515), **zéro cascade**. **Deux sémantiques de `null`** : (1) *signal métier* — `graphe-de-markov` `nodes` (`computed<number>`→`<number \| null>`, null = compte de nœuds hors [2,4], déjà gardé par `if (!nodes.value)`) et `matrix` (`computed<string[][]>`→`<string[][] \| null>`) ; cascade template refermée par `v-if="matrix"` sur `<pi-markov-graph>` (prop `matrix: string[][]` requis ; comportement identique, le composant garde déjà `v-if="matrix"` en interne). `.split('\n').shift()` (`string \| undefined`) → `(... ?? '')`. (2) *faux-optionnel resserré* — `matrice-visualisation` `transformMatrix(type, value?: string)` → `value: string` (toujours fourni par `appTransform`, seul appelant) + type de retour `: Matrix` + `throw` final (exhaustivité des 6 valeurs d'enum non prouvée par `if` successifs) → supprime d'un coup les 4 `value possibly undefined` ET le `M possibly undefined` (l.259). Interface `figures.transform.type` → `TRANSFORMATION \| null` (figure de base sans transformation ; unique lecture = `{{ fig.transform }}` interpolé l.343, zéro consommateur cassé). Aucun `!`, 0 cast. 505 tests passés. Total global 524 → 515. |
| Lot 4.B | `algebre/matrice-augmentee.vue` (35) + ajustement `matrixSolver.ts` + source `Pi/Parts/PiMatrix.vue` | 2026-07-28 | 35 → 0 err sur le fichier, contribution nette **−39** (563 → 524 : −35 Widgets + **−4 bonus Pi**), **zéro cascade sortante** (2 seuls consommateurs de l'interface, tous deux en scope — vérifié avant élargissement ; pas de `git stash` nécessaire car matrice-augmentee tombe pile à 0). **Cause unique** : `matriceAugmenteeInterface` déclarait ses champs non-null alors que tout le fichier traite `operationData` comme un brouillon de saisie (init `null`, reset `null`, checks `=== null`). Fix : **interface élargie** (`description`/`operation`/`target`/`value` → `\| null`, `reference` déjà nullable) → corrige les 8 TS2322 init/reset. **Gardes `== null`** (décision #1) dans les 3 fonctions consommant `Partial<...>` : `getOperationDescription` (`=== null`→`== null`, garde `reference` branche `x`), `getShortDescription` (gardes d'entrée `target`/`value` + locales `reference` par branche), `updateMatrix` script (garde `target` → `matrixLine` typé fait tomber en cascade les TS7006 l.278/294 et TS2538 l.269/276 ; `new Fraction(operation.value ?? 0)` ; gardes `reference` branches `+`/`-`/`x`). **Bug latent corrigé** : `+item.value.toFixed()` l.213 (`Polynom.value` = `number \| undefined`, planterait sur polynôme non-numérique) → `... && item.value !== undefined ? ... : item.tex`. Template : `valueKeyboard.value?.reset()`, computed `fractionKeyboard = getKeyboards('fraction')[0]?.keyboard` + `v-if` sur `keyboard-basic`. **`matrixSolver.ts`** : gardes 4.A ajustées `=== undefined`→`== null` / `!== undefined`→`!= null` (l'interface élargie ajoute `null`). **`PiMatrix.vue`** (source, hors-lot Pi assumé, précédent 3.D) : `defineModel<number>('target'/'reference', {default: null})` → `<number \| null>` (aligne le model sur son `default` et ses checks `=== null` internes) → corrige les v-model l.510/511 ET 4 des 5 erreurs strict de PiMatrix (reste `dimension` l.131 pour Lot 8). Aucun `!`, 0 cast. 505 tests passés. Total global 563 → 524. |
| Lot 4.A | `algebre/matrixSolver.ts` (source de matrice-augmentee, import unique) | 2026-07-28 | 7 → 0 err, contribution nette **−7** (baseline re-mesurée 570 → 563 ; le « 567 » de fin 3.F portait une dérive −3 du compteur), **zéro cascade** (méthode interne, aucune signature exposée). Cause unique : `updateMatrix(op: Partial<matriceAugmenteeInterface>)` — `Partial` rend `op.target`/`op.value`/`op.reference` tous `\| undefined`, et l'interface déclare déjà `reference: number \| null` (double nullabilité). Fix : déstructuration `const {target, value, reference} = op` + garde d'entrée `if (target === undefined) return op` + garde **par branche** du `switch` sur les seuls champs utilisés (`'x'`→reference ; `'+'`/`'-'`→value+reference ; `'*'`/`'/'`→value), chaque garde couvrant `!== undefined && !== null`. Aucun `!`, 0 cast, comportement runtime identique (champs manquants = no-op déjà de fait). 505 tests passés. Total global 570 → 563. |
| Lot 3.F | reste Keyboards (7 fichiers) : `KeyboardResolutionSolution.vue` (6), `KeyboardResolutionFactorisation.vue` (2), `KeyboardBasic.vue` (3), `KeyboardType.vue` (3), `KeyboardSentence.vue` (2), `KeyboardOrder.vue` (1), `Form/FormKeyboard.vue` (8) | 2026-07-28 | 25 → 0 err, contribution nette **−25** (mesure `git stash` : baseline réelle 592 → 567, compteur exact), **zéro cascade** (tout local au module). **Clôture du Lot 3 (Keyboards).** **2 motifs dominants** : (1) *signature de contrat* — `setInput(value: string)` → `(value?: string)` dans `KeyboardBasic`/`KeyboardOrder` (l'interface `KeyboardExposeInterface.setInput` attend l'optionnel ; un paramètre requis est contravariant-incompatible) ; (2) *corrélation invisible* — `selectedMethod`/`selectedPolynom` (`T \| null`) gardés par une autre ref via `v-if` → `?.` dans le template. **FormKeyboard** : `theValue` (`defineModel<string>` = `string \| undefined`) coercé `?? ""` (currentRows) + gardes `if (inputRef.value === null \|\| theValue.value === undefined) return` (onKeyup/tabber) ; template `@click="inputRef.value = k"` → `inputRef && (inputRef.value = k)`. **KeyboardBasic** : `const v = value ?? ""`, `config.tex?.(v) ?? v` (tex optionnel), `keyboardUI.value?.resetKeyStrokes()`. **KeyboardType** : `props.reference ?? ""` ; `typoButtons = ref(null)` → `ref<HTMLElement \| null>(null)` + narrowing `el instanceof HTMLElement` (`children[index]` est `Element`, l'helper veut `HTMLElement`). **KeyboardSentence** : `.find(...)` → capture `const` + garde (2×). **KeyboardResolutionFactorisation** : `selectedMethod?.name`/`?.component`. **KeyboardResolutionSolution** : `s.display ?? ""` (`Solution.display` = `string \| null`) ; `let delta/delta2: Fraction` → `Fraction \| undefined` (corrige assignation + les 2 « used before assigned », un type incluant `undefined` supprime TS2454) ; template `:key="factorId ?? undefined"`. Aucun `!`, 0 cast de valeur. 334 tests passés. Total global 592 → 567. |
| Lot 3.E | `KeyboardDraw.vue` (6) + `KeyboardDrawZones.vue` (3) | 2026-07-28 | 9 → 0 err, contribution nette **−9** (mesure `git stash` : baseline réelle 601 → 592, dérive +1 du compteur), **zéro cascade** (tous les types touchés sont locaux au module). **Racine commune** : `let pidraw: PiDraw = null` dans les deux fichiers — sentinel honnête (assigné seulement dans `onComponentMounted`) → élargi en `PiDraw \| null`. **Piège closure documenté** : le narrowing d'un `let` mutable ne traverse pas un callback imbriqué (`.map(key => pidraw.figures[key])`) → capture `const draw = pidraw` après la garde, usages basculés sur `draw` (KeyboardDraw `getLineEquation` + `setInput`). **KeyboardDraw** : `getLineEquation(): Line` → `Line \| null` (renvoyait déjà `null` 2×) + garde chez l'appelant ; `validate = ref<string>(null)` → `ref<string \| null>(null)` (aligne défaut + `?? null`) ; `onChange` param `mouse` → `\| null` (appel de montage `mouse: null`) ; gardes `if (… === null) return` en tête de `setInput`/`updatePoint`. **KeyboardDrawZones** : `type FigureType = typeof pidraw.figures[0]` → `PiDraw['figures'][0]` (découplage de la variable nullable) ; `onChange(value?)` → `value` requis (corrige `value.mouse` possiblement undefined) + `mouse \| null` (appel `mouse: null`) ; gardes en tête de `setInput`/`getSvg` + capture `const draw` dans le `nextTick` d'`onMounted`. Aucun `!`, 0 cast de valeur. 334 tests passés. Total global 602 → 592. |
| Lot 3.D | `KeyboardTableOfSigns.vue` (14) + `KeyboardMatrix.vue` (14) | 2026-07-28 | 28 → 0 err, contribution nette **−30** (2 erreurs pré-résolues dans les sources Pi), **zéro cascade** (baseline réelle 632, dérive +1 du compteur). **3 types-sources trop étroits élargis (source-first, hors-lot Pi assumé)** : `PiMatrix.matrix` → `(…\| null)[][]` (cellules vides, template gère déjà `item?.tex ?? '?'`) ; `PiMatrix.aij` `defineModel<…>` → `<… \| null>` (défaut `null`, corrige aussi l'assignation interne `aij.value = null` → PiMatrix 6→5) ; `TableOfSigns.extremes` `?: string[]` → `?: string[] \| null` (défaut `null`, corrige aussi son propre défaut → TableOfSigns 4→3). Consommateurs vérifiés (aucun autre ne lie `aij` ; `extremes` toujours passé en `string[]`). **KeyboardTableOfSigns** : `props.reference` optionnel → computed `reference = props.reference ?? ""` (6 usages) ; `tosUI` template-ref → garde `if (tosUI.value === null) return` en tête de `updateKeyboardActiveCell` + `?.$el.innerHTML ?? ""` ; `coordsForTos` null gardé dans le `case "coords"`. **KeyboardMatrix** : type `dimension` → `{ rows: number \| null, columns: number \| null }` (sentinel « non défini » honnête), inductions `Array.from({length: … ?? 0})` et `% (… ?? 1)` ; `fixedDimension` tuple → `[number \| null, number \| null]` ; `updateDimension` m/n → `number \| null` avec conditions regroupées (`< 1 \|\| >= 10`, supprime la relecture post-null) + garde de boucle `if (m !== null && n !== null)` ; `matrixToTex` param `dim` élargi + `repeat(… ?? 0)` ; checker `getOneKeyboard(kbrd).keyboard?.config.name ?? 'fraction'` (retour `Partial`). Aucun `!`, 0 cast de valeur. 334 tests passés. Total global 631 → 602. |
| Lot 3.C | `KeyboardStudy.vue` (consommateur de 3.A + 3.B) | 2026-07-28 | 19 → 0 err (dont +1 cascade 3.B absorbée). **Annotation élargie retirée** : `const output: IGraphConstructorConfig = {…}` → `const output = {…}` dans `makeConfig` (le littéral fournit toujours `axis`/`origin`, l'annotation les rendait optionnels ; type de retour de la fonction conservé comme contrat) → corrige 4 err `output.axis`/`output.origin`. **`let` non initialisés → `T | undefined = undefined` + garde** : `item` (addItemToGraph, révèle que la branche `btn==="!"` renvoyait déjà `undefined` → push gardé, évite un item cassé dans `loadedItems`), `el` (parseStringToKeyboard, `addItemToGraph` renvoie `| undefined`). `output` de validateOutput → `(string|null)[]` (L.90 filtre déjà). `plot.fx: null` → `""`. Refs : garde `if (draw.value === null) return` en tête de `onMounted` (StudyGraph/ResizeObserver), `keyboardUI.value?.resetKeyStrokes()`. `props.reference` optionnel → `?? ""` (2×). Retour vide `computed` → `return []`. **Cascade 3.B absorbée** : `Object.values(obj.controls)` gardé (`controls === null` → return) après élargissement de `itemGraphInterface.controls`. Zéro cascade sortante. Aucun `!`. 334 tests passés. Total global 650 → 631. |
| Lot 3.B | `KeyboardStudyHelpers.ts` (30) + `KeyboardStudyCreatedList.vue` (1) | 2026-07-28 | 31 → 0 err (fichier le plus intriqué du chantier). **`BBox` en accesseur-invariant** : `return null` → `throw` (invariant « repère cartésien 2D » ; 4 appelants déréférencent aussitôt → zéro cascade vs `\|null` qui aurait touché 4 sites ; remplace un crash `null.x` silencieux). **Nullabilités légitimes élargies** (source-first) : `itemGraphInterface.element` → `\| null` (env de trace sans élément), `.controls` → `... \| { bar: Path\|null } \| null` ; retours `addBezierControls`/`addControls`/`addEnvTracePoints` → `\| null` (`!_loadControls`). **Restructuration `el.bezier`** (16 err addAH/addAV) : bezier extrait en local **avant** l'objet, 8 mutations sous `if (bezier !== null)`, puis `bezier: bezier ?? undefined` (garde `bezier?` optionnel). `kind: null` → `undefined` (4×, addAH/addAO/addAV/env). `bar: Path` → `Path\|null`. `parsePlot` `shift() ?? ""`. `plotGraph` : garde `addPlot` null avant push, `beziercontrol ?? SMOOTH`, `IBezierPointInterface.controls` gardé, **`ILineConfig.director` optionnel gardé** (happy-path identique). `CreatedList` : `kbrdStudyButtons[item.kind]` gardé (`item.kind !== undefined` + `?.group ?? ''`). Cascade **+1 différée** vers 3.C (`KeyboardStudy.vue` 18→19), **zéro hors-cible** (`KeyboardStudyButton.vue` reste 0), vérifié. Aucun `!`. 334 tests passés. Total global 680 → 650. |
| Lot 3.A | `KeyboardDisplay.vue` (socle display-driven, source de ~10 claviers) | 2026-07-28 | 11 → 0 err. Les 11 erreurs étaient **toutes internes** (aucune signature de prop/emit touchée) → **zéro cascade** malgré le rôle de source (leçon : ce qui cascade est l'élargissement d'un type *exposé*, pas un `null` local). 3 clusters : (1) `withDefaults` — defaults `null` → `false` pour 5 props booléens consommés en pure véracité (`if (props.back)`…) + `customKeys: null` retiré (reste `Record\|undefined`, falsy) ; (2) placeholders `kdata: keyboardKey` — `type`/`display` `null` → `""` (champs typés `string`), `fn: null` → `fn: undefined` (optionnel) ; (3) invocations : `keyboards[X].tex ? keyboards[X].tex()` ne narrowe pas (deux accès indexés distincts) → extrait `const kb = keyboards[X]` ; `k.fn("")` → `k.fn?.("") ?? ""` (KeyStroke.fn optionnel). Net −11 avec 0 résidu sur le fichier = zéro cascade (pas besoin de `git stash`). 334 tests passés. Total global 691 → 680. |
| Lot 2.D | `triangle.vue` + `venn.vue` + `Parts/ToolForm.vue` + `quadratique.vue` + `fonction-valeur-absolue.vue` + `Parts/ToolsSearch.vue` (**clôt le Lot 2**) | 2026-07-28 | 14 → 0 err. `triangle` : `intersection` (`Point \| null`, type pimath) gainé par `v-if` sur chaque `<div>` (narrowing même-élément). `quadratique` : `let poly: Polynom` → `let poly: Polynom \| null = null` (corrige d'un coup TS2322 assignation `getPolyFromThreePoints(): Polynom\|null` **et** TS2454 « utilisé avant assignation »). `ToolsSearch` : `filterListRef.value?.focus()` (template ref nullable). `ToolForm` : index gardé `type !== undefined ? componentMap[type] : undefined`, filtre `.filter((f): f is IToolForm & {fromUrl:string} => Boolean(f.fromUrl))` (prédicat type-guard, sémantique truthy conservée), `focus?.()` optionnel. `venn` : `ref<string[]>([])` + `ref<HTMLElement\|null>(null)` (template ref) + garde `if (draw.value === null) return` avant `PiGraph`. **`fonction-valeur-absolue`** (le morceau lourd) : `getOneExpression`/`checkValue` **traitaient déjà `null` mais leurs signatures mentaient** (`min: Solution`) → params + `borders` élargis en `Solution \| null`, ternaires imbriqués `v`/`condition` restructurés en `if/else if` gardant chaque branche (l'invariant « au plus un null » n'est pas type-exprimable) + fallback both-null défini (`v=0`/`condition=""`/`checkValue→false`) qui **supprime un crash latent** ; `borders` reste interne (zéro cascade template). Aucun `!`, aucun cast ajouté. Baseline réel isolé `git stash` = 705 → 691 (−14 exact, zéro cascade). 334 tests passés. |
| Lot 2.C | `vecteurs.vue` + `tableau-des-valeurs.vue` | 2026-07-28 | 7 → 0 err (cluster `TS2769` : `computed<T>` renvoyant `null` sous un `T` non-nullable — mensonge de type). Deux traitements selon la sémantique du `null` : (1) **signal métier** — `pV1`/`pV2`/`pV3` élargis en `computed<Vector \| null>` (le `null` = « vecteur invalide », déjà gardé par `v-if="pV1"` en template) ; **cascade interne neutralisée** en amont par un prédicat type-guard sur le filtre `vectors` (`.filter((v): v is Vector => …)`), qui retrouve `Vector[]` et évite la propagation vers `result`/`matrix`/`dimension`/`draw2D`/`draw3D`. (2) **« rien à dessiner »** — `draw2D`/`draw3D` (vecteurs) et `draw` (tableau) `return null` → `{parameters:'', code:''}` (précédent 2.A ; prop `:draw` reste non-nullable, zéro cascade template ; plus sûr qu'un `null` sur prop requis). `tableau` : garde sur `forms.find(...)` (`const numForm = …; if (numForm) …`, TS2532). Baseline réel vérifié par `git stash` isolé = 711 → 704 (−7 exact, zéro cascade). 334 tests passés. |
| Lot 2.B | `statistiques.vue` + `positions-relatives.vue` | 2026-07-27 | 18 → 0 err. `positions-relatives` : `objets1`/`objets2` (`computed<…[] \| null>`) gardés (`?.[]`, `=== null`), `ObjectTypeInterface.pi` (`\| undefined`, l.232) gainé en template `v-if="obj.pi"`. **Cascade interne maîtrisée** : élargir `objet1`/`objet2` en `\| undefined` a propagé +19 err sur le computed `positionRelative` → refermées par UN garde d'entrée (`if (objet1.value===undefined \|\| objet2.value===undefined) return "indéterminée"`), après quoi `const [obj1,obj2] = [...].sort()` retrouve `ObjectTypeInterface`. `statistiques` : **bug latent corrigé** — `randn_bm` param `flatten?` → requis + récursion de rééchantillonnage l.294 propage `flatten` (produisait `NaN`) ; `let rnd = NaN` ; garde `x !== undefined` dans filter ; `ni = customNi.shift() ?? 0` (rend `StatTableRow.ni` valide). 334 tests passés. Zéro cascade sortante. Total global 728 → 710. |
| Lot 2.A | `etude-de-fonction-rationnelle.vue` (consommateur cascade 0.B) | 2026-07-27 | 11 → 0 err (dont 8 issues de la cascade 0.B, refermées au point d'usage). Script : computed `draw` `return null` → `{parameters:'', code:''}` (forme vide jamais affichée, évite `\|null` vers `pi-draw-parser`) ; garde `genFx === undefined` ; gardes `study.value.YIntercept` et filtre truthy `extremes` transformé en `forEach`+`if` (narrows `EXTREMA.answer`). Template : `v-if="study.YIntercept"` + `v-else` (message calqué sur bloc « zéros ») ; `<template v-if="item.delta">` gainant delta+table-of-signs sur asymptotes horizontales/obliques (le `v-if` parent ne rétrécit pas à travers le `v-for`). 334 tests passés. Zéro cascade. Total global 739 → 728. |
| Lot 0.D | Helpers/modèles + 5 interfaces (`makeModel`/`useStoreScore`/`mdAutofill`/`helperFunctions`/`katexDirectives`/`scolcours`/`useToolsStorage` ; `WidgetInterface`/`DeckInterface`/`ScoreInterface`) | 2026-07-27 | 16 → 0 err. **Clôture du Lot 0.** 5 nullabilités d'interface (décision « garder nullable ») : `WidgetInterface.theme_id`, `DeckInterface.chapter`, `DeckInterface.user`, `ScoreInterface.is_resolved`, `ScoreInterface.user_id` → `\| null`. `makeModel` : suppression du défaut `component` mort (TS2783, toujours écrasé par `...config.widget`), `data: null → undefined` (CardInterface.user est `Partial`). `useStoreScore` : `let arr: … \| undefined` (préserve le retour `undefined` pour Deck/Lesson, corrige TS2454). Gardes isolées : `sessionStorage.key()` (`string\|null`), `className` (`string\|undefined`), `txt.pop()` (`string\|undefined`), `Number(value)` (unknown), `defineAsyncComponent(… as AsyncComponentLoader)`. **Cascade source-first +6** : Decks (Lot 7 : DeckDisplay `deck.user` nullable, DeckCardsEditIndex, DeckEdit, DeckIndex, AdminDeck) + `postInterfaces.ts` (Lot 9 : TS2430, `QuestionDynamicInterface.user.is_resolved` inline `boolean` à aligner en `boolean\|null`). 334 tests passés. Zéro `!`. Total global 750 → 739. |
| Lot 0.C | Checkers (`CheckerAbstract` + Basic/TrigoChecker/SolutionChecker/FractionChecker/FunctionChecker/EquationChecker + `PiChecker`) | 2026-07-27 | 14 → 0 err. Cause commune : getter `secondaryChecker: CheckerAbstract \| null` accédé nu à 8 sites → nouvel accesseur d'invariant `requireSecondaryChecker(): CheckerAbstract` (throw si null ; invariant câblé par PiChecker) réutilisé partout. `PiChecker` : garde `cls === null` (EXACT toujours enregistré). `CheckerAbstract` : `cb(chk.index ?? 0, …)`. `TrigoChecker` : `values.find(...) ?? ''` (kPeriodic). `FractionChecker` : garde `first === undefined` après `shift()`. **Bug réel corrigé** : `EquationChecker` l.167 `isEquationPeak` (référence de fonction, toujours truthy) → `isEquationPeak(value)` — la validation « forme du sommet » était inopérante. 334 tests Checkers passés. Zéro `!`, zéro cascade. Total global 764 → 750. |
| Lot 0.B | Composables score/challenge (`useChallenge`/`useTos`/`useKeyboard`) | 2026-07-09 | 30 → 0 err. `useChallenge` : gardes `if (!score.value) return` (2 closures updateScore), `targetScore` par accumulateur local, handles timer `ReturnType<setInterval> \| undefined`, `persistScore` garde. **Bug latent runtime corrigé** (l.320) : question sans limite de temps expirait immédiatement (`>= null` coercé en 0) → garde `currentTimeLimit.value !== null`. `useTos` : garde `trou.x`, cast mensonger `as number` → union honnête `Fraction \| number`, `keyboards.exact.tex` extrait `exactTex` + garde-throw. **Interfaces nullable** : `ETUDE.YIntercept`, `EXTREMA.answer`, `ASYMPTOTE.delta.roots.{x,y}.display` (cascade +3 vers `etude-de-fonction-rationnelle.vue`, traitée au Lot 2). `useKeyboard` : `shift() ?? ""`, `getKeyboardConfig(): … \| undefined`, `getKeyboards` `null → []`. Test caractérisation `useKeyboard` passé. Zéro `!`. Total global 790 → 764. |
