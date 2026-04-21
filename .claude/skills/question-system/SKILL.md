---
name: question-system
description: "Référence pour toute modification du système de questions. Activez ce skill avant toute modification dans resources/js/Components/Questions/, les composants QuestionShow, QuestionBlock, QuestionAnswer, QuestionHeader, QuestionFooter, les composables useQuestion, useQuestionValidation, computeQuestionBlock, useQuestionAdmin, useQuestionHelpers, ou QuestionInterface.ts."
---

# Question System — Skill de référence

## Quand activer ce skill

Activer **systématiquement** avant toute modification touchant :
- `resources/js/Components/Questions/` (tous les fichiers)
- `QuestionShow.vue` ou ses composants enfants (`QuestionHeader`, `QuestionBlock`, `QuestionAnswer`, `QuestionFooter`)
- Les composables : `useQuestion`, `useQuestionValidation`, `computeQuestionBlock`, `useQuestionAdmin`, `useQuestionHelpers`
- `QuestionInterface.ts` (types, interfaces, clé d'injection)
- Les consommateurs directs : `QuestionsIndex.vue`, `QuizzQuestion.vue`, `EvaluationQuestions.vue`, `QuizzQuestionProjection.vue`

## Documentation de référence

Lire **obligatoirement** avant tout changement structurel :

```
.claude/docs/question.md
```

Ce document contient :
1. L'architecture complète du système (composants, composables, fichiers TS)
2. La structure exacte de `questionData` (provide/inject)
3. La liste des améliorations identifiées (TODO)

## Règles à respecter

### Provide / Inject
- `QuestionShow.vue` est le **seul** composant autorisé à appeler `useQuestion()` et `provide(questionDataKey, ...)`.
- Tous les composants enfants consomment via `inject(questionDataKey)!`.
- Ne jamais passer `questionData` en prop — utiliser le mécanisme provide/inject.

### Interface `questionDataInterface`
- Toute modification de `questionDataInterface` dans `QuestionInterface.ts` doit être répercutée dans `useQuestion.ts` (qui retourne cet objet).
- L'interface `questionDataInterfaceOLD` est obsolète — ne pas l'utiliser, ne pas la faire évoluer.

### Emit `validate`
- L'emit `validate` est défini dans `QuestionShow` et `QuestionAnswer`.
- Les consommateurs externes (`QuestionsIndex`, `QuizzQuestion`, `EvaluationQuestions`) doivent toujours écouter `@validate` s'ils ont besoin du résultat de validation.
- `QuestionFooter` n'émet **pas** `validate` (il émet `loadAnswers`).
- `QuizzQuestionProjection` n'utilise **pas** `@validate` (mode affichage uniquement).

### Ajout d'un nouveau composant enfant
1. Il doit consommer `questionData` via `inject(questionDataKey)!`.
2. Le déclarer dans le tableau de consommation de la doc (section 5).
3. Ne pas dupliquer la logique déjà présente dans les composables.

### Modification de `questionDataInterface`
Toute modification de la structure de `questionData` (ajout, suppression, renommage de champ) nécessite :
1. Modifier `QuestionInterface.ts`
2. Modifier `useQuestion.ts` (retour de fonction)
3. Mettre à jour la doc `.claude/docs/question.md` section 5

## Mise à jour de la documentation

Après toute modification touchant :
- La structure de `questionDataInterface` → mettre à jour la section 5 de `question.md`
- L'ajout/suppression d'un composant → mettre à jour les sections 2 et 4
- L'ajout/suppression d'un composable → mettre à jour la section 3
- Un TODO résolu → le cocher ou le supprimer de la section 6
- La date de dernière mise à jour en tête de fichier

## Checklist avant de soumettre une modification

- [ ] La doc `.claude/docs/question.md` est à jour si la structure a changé
- [ ] Aucun composant enfant ne reçoit `questionData` en prop
- [ ] `questionDataInterfaceOLD` n'a pas été utilisée
- [ ] L'emit `validate` est correctement typé (`questionResultInterface`) dans tout nouveau consommateur
- [ ] `validators.value[current.id.value]` est accédé avec un guard si `validators` peut être vide