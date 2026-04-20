# Système de Questions — Documentation de référence

> Dernière mise à jour : 2026-04-20  
> Périmètre : frontend uniquement (`resources/js/Components/Questions/`)

---

## 1. Architecture générale

Le système repose sur un composant racine `QuestionShow.vue` qui :
- reçoit une `QuestionInterface` en prop
- instancie l'état partagé via `useQuestion()`
- le distribue à tous ses enfants via `provide(questionDataKey, questionData)`

Les composants enfants n'ont **aucune prop** liée à la question : ils consomment uniquement `inject(questionDataKey)`.

```
QuestionShow.vue  (provide)
├── QuestionHeader.vue      (inject)
├── QuestionBlock.vue       (inject)  ← useQuestionBlock()
├── QuestionAnswer.vue      (inject)  ← useQuestionValidation()
│   └── <keyboard-component> (dynamique, via validator.keyboard.component)
└── QuestionFooter.vue      (inject)
```

---

## 2. Composants

### `QuestionShow.vue` — Racine

**Rôle :** Orchestrateur. Seul composant qui connaît la `QuestionInterface` brute.

**Props :**

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `question` | `QuestionInterface` | — | Données de la question |
| `showInput` | `questionUserInputDisplayType \| '' \| boolean` | `false` | État initial du clavier |
| `isDynamic` | `boolean` | `false` | Question générée dynamiquement (pas en DB) |
| `editorMode` | `boolean` | `false` | Mode prévisualisation dans l'éditeur |
| `blockOnly` | `boolean` | `false` | Affiche uniquement le bloc (pas de réponse/footer) |
| `autoAnswer` | `boolean` | `false` | Pré-remplit avec les bonnes réponses |
| `hideSuccess` | `boolean` | `false` | Supprime le feedback visuel de réussite |

**Emit :** `validate(event: questionResultInterface)` — déclenché par `QuestionAnswer` après validation.

**Expose :**
- `loadAnswers({ show: boolean, value?: string })` — charge/vide les réponses dans les claviers
- `questionData` — accès direct au store de la question (utilisé par `useQuestionAdmin`)

---

### `QuestionHeader.vue` — En-tête

**Rôle :** Numéro d'ordre, icône de réussite, titre.

**Props :** `showNumber?: boolean` (défaut `true`)

**Données consommées depuis `questionData` :**
- `question.value.order` — numéro affiché dans le badge
- `question.value.block.title` — titre (rendu avec KaTeX)
- `user.score.value` — icône check/ban

---

### `QuestionBlock.vue` — Corps

**Rôle :** Affiche le texte de la question et l'illustration, avec les réponses incrustées.

**Données consommées depuis `questionData` :**
- `block.value.body` + `block.value.illustration` — via `useQuestionBlock()`
- `answers.coherences.value` — affiche une alerte si incohérence
- `user.answers.value` — pour l'incrustation des réponses dans le texte
- `current.id.value` — index de la réponse active (couleur bleue vs rouge)

**Comportement clé :** délégation de clics sur `[data-answer-index]` pour changer `current.id`.

---

### `QuestionAnswer.vue` — Zone de saisie

**Rôle :** Toggle clavier, sélecteur multi-réponses, validation, affichage du clavier dynamique.

**Données consommées depuis `questionData` :**
- `config.showInput` — état du toggle (hide/show/force)
- `config.editorMode` — affiche les paramètres du clavier en overlay
- `config.animation` + `config.silent` — contrôle animation d'erreur
- `current.id.value` — index affiché
- `validators.value` — liste des claviers/checkers par réponse
- `answers.values.value` — pour le compteur de réponses
- `user.answers.value` — mise à jour à chaque frappe

**Emit :** `validate(event: questionResultInterface)` — propagé vers `QuestionShow`.

**Expose :** `getKeyboards()` — retourne un `Record<number, keyboardComponentType>` indexé par position.

---

### `QuestionFooter.vue` — Pied de page

**Rôle :** Historique des réponses de l'utilisateur, bouton "voir la réponse" (admin + après réussite).

**Données consommées depuis `questionData` :**
- `user.score.value` — accès au `ScoreQuestionDataInterface` (historique des réponses)
- `hasSuccess.value` — affiche le bouton "voir la réponse"
- `answers.values.value` — affiche la bonne réponse

**Emit :** `loadAnswers({ show: boolean, value?: string })` — remonté vers `QuestionShow.loadAnswers()`.

**N'émet PAS** `validate`.

---

## 3. Composables et fichiers TypeScript

### `useQuestion.ts` — Composable principal

**Signature :** `useQuestion(question: QuestionInterface, config: questionConfigInterface): questionDataInterface`

**Responsabilités :**
- Crée le `ref` sur la question
- Connecte `userScore` au store Pinia (`useStoreScore`) comme source unique de vérité
- Calcule `correctAnswers` (split par `\n`)
- Calcule `answersVariables` (regex sur `$a`, `$b`... dans le body)
- Initialise `userAnswers` (tableau de `KeyboardInputInterface`)
- Vérifie la cohérence nombre-réponses / nombre-variables (`answersCoherences`)
- Construit la liste `validators` (keyboard + checker par réponse) avec support du mode **loop**
- Gère `current.id` (index de la réponse active) et ses computed (`currentKeyboard`, `currentChecker`)
- Calcule `hasSuccess` depuis `userScore.is_resolved`

**Mode loop :** si `question.keyboard` se termine par `\n\nloop`, le dernier clavier défini est réutilisé en cycle pour toutes les réponses suivantes.

---

### `useQuestionValidation.ts` — Logique de validation

**Signature :** `useQuestionValidation(questionData: questionDataInterface)`

**Responsabilités :**
- Détecte le type de validation par réponse : `single` / `multiple` (séparateur `||`) / `mixed` (préfixe `@`)
- Délègue à la stratégie appropriée : `validateSingle`, `validateMultiple`, `validateMixed`
- Supporte la validation par **équation** (`question.equationControl`) via `validateBoundedVariables()`
- Sauvegarde le score en DB (via `useStoreScore.updateScore`) si : question en DB, non dynamique, utilisateur connecté, pas déjà résolue
- Gère un `lock` pour éviter les doubles soumissions

**Retourne :** `{ validate, lock, errors, answersCount, count, buttonLabel, result, save, resolveValidators, reduce }`

---

### `computeQuestionBlock.ts` — Pipeline d'incrustation

**Rôle :** transforme le body markdown en incrustant les réponses utilisateur selon leur format.

**Pipeline (ordre important) :**

| Fonction | Pattern source | Rendu |
|---|---|---|
| `replace_abc_toTex` | `$a`, `$b` (lowercase) | Inline TeX coloré |
| `replace_ABC_toBlock` | `\n$A` (début de ligne) | `<div>` bloc avec bordure |
| `replace_ABC_without_placeholder` | `@$A` | `<div>` sans placeholder vide |
| `replace_ABC_inline_no_div` | `_$A` | Inline sans div |
| `replace_ABC_inline` | `$A` (restant) | `<span>` inline |

**Couleur :** réponse active → bleu (`cornflowerblue` / `border-blue-600`), autres → rouge.

---

### `useQuestionAdmin.ts` — Gestion admin d'une liste de questions

**Rôle :** opérations sur un conteneur de questions (Post, Quizz, Evaluation).

**Retourne :**
- `add` — crée une nouvelle question via API et redirige vers l'éditeur
- `displayIf.auto` / `displayIf.remove` — gestion des conditions d'apparition
- `answers.show(components)` / `answers.reset` — toggle affichage réponses sur tous les `QuestionShow`
- `updateQuestionsOrder` — déclenché automatiquement par un watcher sur la liste
- `updateGrid(grid)` — met à jour la classe CSS de la grille

---

### `useQuestionHelpers.ts` — Utilitaire

Contient uniquement `onClick_answerIndex(event)` : remonte le `data-answer-index` depuis un clic délégué.

---

### `QuestionInterface.ts` — Types et clé d'injection

Définit :
- `questionDataKey` — symbole d'injection (`InjectionKey<questionDataInterface>`)
- `questionDataInterface` — voir section 2 ci-dessous
- `questionConfigInterface`
- `questionValidatorInterface`, `questionResultInterface`, `checkAnswerInterface`, `keyboardEventInterface`
- `questionUserInputDisplayType` = `"hide" | "show" | "force"`
- `questionDataInterfaceOLD` — **ancienne interface, en cours de suppression** (ne pas utiliser)

---

## 4. Composants consommateurs externes

Ces composants utilisent `QuestionShow` mais ne font pas partie du système interne.

| Composant | Usage de `validate` | Notes |
|---|---|---|
| `QuestionsIndex.vue` | Oui — propage `@validate` vers le parent | Gère l'affichage en grille, le `displayIf`, les scores |
| `QuizzQuestion.vue` | Oui — `@validate="$emit('validate')"` | Attend le score avant d'afficher la question |
| `EvaluationQuestions.vue` | Oui — `@validate="validateQuestion"` | `validateQuestion` ne fait que `console.log` pour l'instant |
| `QuizzQuestionProjection.vue` | Non | Mode `blockOnly` + `autoAnswer`, affichage projection |

---

## 5. Structure de `QuestionData` (provide / inject)

Objet retourné par `useQuestion()` et distribué via `provide(questionDataKey, questionData)`.

```typescript
questionData: {

  // ── Données brutes ────────────────────────────────────────────────────────
  question: Ref<QuestionInterface>          // question complète depuis DB ou génération

  // ── Contenu du bloc ───────────────────────────────────────────────────────
  block: ComputedRef<BlockMinInterface>     // raccourci vers question.value.block

  // ── Réponses correctes et variables ──────────────────────────────────────
  answers: {
    values:     ComputedRef<string[]>       // correctAnswers — split de question.answer par \n
    variables:  ComputedRef<string[]>       // lettres $a, $b... extraites du body
    coherences: ComputedRef<boolean>        // values.length === variables.length === userAnswers.length
  }

  // ── État utilisateur ──────────────────────────────────────────────────────
  user: {
    answer:  Ref<string>                    // non utilisé activement (vestige de l'ancienne interface)
    answers: Ref<KeyboardInputInterface[]>  // { input, tex, raw } par réponse
    score:   Ref<ScoreInterface | undefined> // computed writable → synchro avec useStoreScore
    errors:  Ref<string[]>                  // messages d'erreur après validation
  }

  // ── Réponse courante (multi-réponses) ────────────────────────────────────
  current: {
    id:      Ref<number>                     // index de la réponse active
    keyboard: ComputedRef<KeyboardInterface> // clavier de validators[current.id]
    checker:  ComputedRef<KeyboardCheckerInterface> // checker de validators[current.id]
  }

  // ── Validateurs ───────────────────────────────────────────────────────────
  validators: ComputedRef<questionValidatorInterface[]>
  // questionValidatorInterface = { key: "$a"|"$b"..., answer: string, keyboard, checker }

  // ── Configuration ─────────────────────────────────────────────────────────
  config: {
    animation:  boolean    // active l'animation d'erreur
    editorMode: boolean    // mode prévisualisation
    isDynamic:  boolean    // question générée, sans ID DB
    raw:        string     // valeur brute de question.keyboard
    showInput:  Ref<questionUserInputDisplayType>  // "hide"|"show"|"force"
    silent:     boolean    // cache le feedback de réussite (hideSuccess)
  }

  // ── Succès ────────────────────────────────────────────────────────────────
  hasSuccess: ComputedRef<boolean>   // false si silent, sinon userScore.is_resolved
}
```

### Consommation par composant

| Champ | QuestionHeader | QuestionBlock | QuestionAnswer | QuestionFooter |
|---|:---:|:---:|:---:|:---:|
| `question.value.order` | ✓ | | | |
| `question.value.block.title` | ✓ | | | |
| `block.value` | | ✓ (via composable) | | |
| `user.score.value` | ✓ (icône) | | | ✓ (historique) |
| `user.answers.value` | | ✓ (incrustation) | ✓ (mise à jour) | |
| `answers.values.value` | | | ✓ (compteur) | ✓ (affichage réponse) |
| `answers.coherences.value` | | ✓ (alerte) | | |
| `current.id.value` | | ✓ (couleur) | ✓ (sélecteur) | |
| `current.keyboard/checker` | | | ✓ (format, intégrité) | |
| `validators.value` | | | ✓ (claviers dynamiques) | |
| `config.showInput` | | | ✓ (toggle) | |
| `config.silent` | | | ✓ | |
| `config.animation` | | | ✓ | |
| `config.editorMode` | | | ✓ (overlay params) | |
| `hasSuccess.value` | | | | ✓ (voir réponse) |

---

## 6. TODO — Améliorations identifiées

### Correctifs prioritaires

- [ ] **`user.answer` inutilisé** — `questionData.user.answer` (Ref<string>) est initialisé dans `useQuestion` mais n'est jamais lu. Vestige de l'ancienne interface. À supprimer proprement.
- [ ] **`questionDataInterfaceOLD`** — l'ancienne interface est encore dans `QuestionInterface.ts`. La supprimer une fois la migration confirmée terminée.
- [ ] **`EvaluationQuestions.vue` — `validateQuestion` ne fait que `console.log`** — la logique de validation côté évaluation n'est pas implémentée.
- [ ] **`QuizzQuestion.vue` — `defineEmits(["validate"])` sans TypeScript** — non typé, contrairement aux autres composants. À aligner avec `defineEmits<{ validate: [event: questionResultInterface] }>()`.

### Qualité et robustesse

- [ ] **`currentKeyboard` et `currentChecker` peuvent crasher** — dans `useQuestion.ts` ligne 127-128, si `validators.value` est vide (keyboard invalide), les computed accèdent à `validators.value[answerId.value]` sans garde. Ajouter un guard ou un computed protégé.
- [ ] **`answerId` (current.id) non réinitialisé** — si la question change (prop dynamique), `current.id` reste à sa valeur précédente, potentiellement hors-bornes. Ajouter un `watch` sur `question` pour remettre `current.id` à 0.
- [ ] **`loadAnswers` : index hors-borne possible** — si le nombre de claviers retournés par `getKeyboards()` diffère du nombre de réponses, la boucle peut tenter d'accéder à un clavier inexistant.

### Architecture

- [ ] **`useQuestionValidation` instancié dans `QuestionAnswer`** — cela couple la logique de validation au composant UI. Envisager de l'instancier dans `useQuestion` et de l'exposer via `questionData` pour permettre une validation depuis l'extérieur (ex. auto-validation).
- [ ] **`computeQuestionBlock.ts` : pipeline non composable** — les fonctions `replace_*` sont exportées individuellement et appelées dans un ordre fixe dans `useQuestionBlock`. Un objet pipeline ou un tableau de transformations rendrait l'ajout de nouveaux formats plus sûr.
- [ ] **Pas de type-guard sur `inject(questionDataKey)`** — tous les enfants utilisent `inject(questionDataKey)!` (non-null assertion). Un wrapper `useQuestionData()` qui lève une erreur explicite si le contexte manque serait plus robuste.

### UX / Fonctionnel

- [ ] **Mode `silent` et sauvegarde** — en mode `silent` (hideSuccess), les erreurs ne sont pas affichées mais la validation est quand même sauvegardée si les conditions sont remplies. Le comportement est correct mais peu documenté.
- [ ] **`equationControl` prioritaire sur les validateurs individuels** — si `equationControl` est défini, il remplace entièrement le résultat des validateurs individuels. Ce comportement est puissant mais invisible dans l'interface.