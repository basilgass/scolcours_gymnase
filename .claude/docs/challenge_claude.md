# Documentation du système Challenge

Ce document décrit l'architecture complète du système Challenge pour guider les futurs refactorisations,
compléments et modifications.

---

## Vue d'ensemble

Un **Challenge** est un mini-jeu pédagogique composé de niveaux progressifs. Chaque niveau contient des
générateurs de questions. Le joueur répond à des questions générées dynamiquement côté client — aucun appel
serveur pendant la partie.

Un challenge peut exister sans chapitre (standalone, créé via un seeder ou directement en admin).

---

## Structure de la base de données

### Table `challenges`

| Colonne      | Type    | Notes                                           |
|--------------|---------|-------------------------------------------------|
| `id`         | int     |                                                 |
| `chapter_id` | int?    | nullable — un challenge peut être sans chapitre |
| `slug`       | string  | identifiant URL unique                          |
| `title`      | string  |                                                 |
| `active`     | boolean |                                                 |
| `type`       | string  | voir types ci-dessous, default: `classic`       |
| `time_limit` | int     | en secondes (0 = sans limite selon le type)     |
| `lives`      | int     | nombre de vies (0 = sans limite selon le type)  |

### Table `challenge_levels`

| Colonne          | Type  | Notes                                           |
|------------------|-------|-------------------------------------------------|
| `id`             | int   |                                                 |
| `challenge_id`   | int   | FK → challenges (cascade delete)                |
| `level_number`   | int   | commence à 1, renuméroté automatiquement        |
| `points_to_pass` | int   | score à atteindre pour passer au niveau suivant |
| `bonus`          | json? | `{ lives?: number, time?: number }`             |

### Table pivot `generatorables`

Relation polymorphique `MorphToMany` entre `Generator` et `ChallengeLevel` (et d'autres modèles).

| Colonne  | Type  | Notes                                             |
|----------|-------|---------------------------------------------------|
| `order`  | int   | ordre d'affichage dans le niveau                  |
| `config` | json? | `{ time_per_question?: number }` — propre au lien |

> **Point d'attention** : `config` est stocké en JSON brut dans le pivot et décodé dans
> `GeneratorResource` via `json_decode($this->pivot->config, true)`. C'est le seul champ de
> configuration par générateur-niveau.

---

## Modèles Eloquent

### `Challenge`

- `$with = ['blocks', 'levels.generators']` — chargé systématiquement avec ses niveaux et leurs générateurs
- `$appends = ['url']` — via `HasUrlTrait`
- Traits : `HasScoresTrait`, `HasUrlTrait`, `BelongsToThrough`, `HasLessonTrait`
- Relations :
	- `chapter()` → `belongsTo(Chapter)`
	- `theme()` → `belongsToThrough(Theme, Chapter)` (via le package `znck/eloquent-traits`)
	- `blocks()` → `morphMany(Block)` — le premier bloc = description du challenge
	- `levels()` → `hasMany(ChallengeLevel)->orderBy('level_number')`
- Boot : crée un bloc vide automatiquement à la création
- `chapter_id` est nullable → un challenge peut être orphelin (sans chapitre)

### `ChallengeLevel`

- `bonus` casté en `array`
- Relations :
	- `challenge()` → `belongsTo(Challenge)`
	- `generators()` → `morphToMany(Generator, 'generatorable')->withPivot('order', 'config')->orderByPivot('order')`

---

## Routes

```
GET  challenges/{challenge:slug}              → ChallengeController@show     → challenges.show
GET  admin/challenges/{challenge}/edit        → ChallengeController@edit      → admin.challenges.edit

GET  api/challenges                           → ChallengeApiController@index  → api.challenges.index
GET  api/challenges/{challenge}              → ChallengeApiController@show   → api.challenges.show
POST api/admin/chapters/{chapter}/challenges  → ChallengeApiController@store  → api.admin.chapters.challenges.store
PUT  api/admin/challenges/{challenge}         → ChallengeApiController@update → api.admin.challenges.update
DEL  api/admin/challenges/{challenge}         → ChallengeApiController@destroy→ api.admin.challenges.destroy

POST   api/admin/challengelevels/{challenge}/levels            → ChallengeLevelApiController@store            → api.admin.challengelevels.store
PATCH  api/admin/challengelevels/levels/{challengeLevel}       → ChallengeLevelApiController@update           → api.admin.challengelevels.update
DEL    api/admin/challengelevels/levels/{challengeLevel}       → ChallengeLevelApiController@destroy          → api.admin.challengelevels.destroy
POST   api/admin/challengelevels/levels/{cl}/generators/{g}/attach → ChallengeLevelApiController@attachGenerator → api.admin.challengelevels.generators.attach
POST   api/admin/challengelevels/levels/{cl}/generators/{g}/detach → ChallengeLevelApiController@detachGenerator → api.admin.challengelevels.generators.detach
PATCH  api/admin/challengelevels/levels/{cl}/generators/{g}   → ChallengeLevelApiController@updateGeneratorConfig → api.admin.challengelevels.generators.update
```

> **Point d'attention** : Il n'existe plus de route `challenges.quick` ni `themes.chapters.challenges.show`.
> Toutes les URL passent par `challenges/{challenge:slug}`.

---

## Resources API

### `ChallengeResource`

```
id, slug, title, active, type, time_limit, lives, created_at, updated_at
+ block       → blocks[0] (le premier bloc brut, sans Resource)
+ chapter     → ChapterResource | null
+ levels      → ChallengeLevelResource[]
+ url         → via HasUrlTrait
```

### `ChallengeLevelResource`

```
id, challenge_id, level_number, points_to_pass, bonus
+ generators  → GeneratorResource[]
```

### `GeneratorResource` (dans le contexte d'un niveau)

```
id, slug, title, theme_id, body, template, keyboard, code
+ order   → pivot.order
+ config  → json_decode(pivot.config) → { time_per_question?: number | null }
```

---

## Types TypeScript

Fichier : `resources/js/types/challengeInterfaces.ts`

| Interface                  | Usage                                                 |
|----------------------------|-------------------------------------------------------|
| `ChallengeInterface`       | prop principale de `ChallengeShow` et `ChallengeEdit` |
| `ChallengeMinInterface`    | liste compacte (ex: `ChapterChallenges.vue`)          |
| `ChallengeLevelInterface`  | un niveau avec ses générateurs                        |
| `GeneratorInterface`       | générateur avec pivot (order, config)                 |
| `ChallengeGameInterface`   | état interne du jeu (score, lives, timers...)         |
| `ChallengeGameState`       | `"intro" \| "running" \| "finished"`                  |
| `ChallengeAnswerInterface` | une réponse enregistrée pendant la partie             |
| `ChallengeScoreInterface`  | `{ level, score }` pour best/user                     |

---

## Types de challenge (`type`)

Le type détermine les règles de la partie. Géré dans `useChallenge.ts`.

| Type        | Logique principale                                                           | `time_limit` | `lives`    |
|-------------|------------------------------------------------------------------------------|--------------|------------|
| `classic`   | Score max en temps limité, vies disponibles                                  | utilisé      | utilisé    |
| `chrono`    | Atteindre le score cible le plus vite possible                               | ignoré       | ignoré     |
| `streak`    | 1 erreur = fin de partie, score = nombre de bonnes réponses consécutives     | 0 ou ignoré  | ignoré     |
| `blitz`     | Countdown par question (via `config.time_per_question`), erreur = vie        | utilisé      | utilisé    |
| `endurance` | Pas de timer global, pas de fin de temps                                     | ignoré       | utilisé    |
| `precision` | `lives` = reprises par niveau (pas global) ; erreur reset le score du niveau | 0 ou ignoré  | par niveau |

> **Point d'attention** : Pour `blitz`, chaque générateur **doit** avoir `config.time_per_question` défini.
> L'éditeur affiche un avertissement si ce n'est pas le cas. Sans cette valeur, le timer question ne se
> déclenche pas (le jeu ne fonctionne pas correctement).

---

## Composable `useChallenge`

Fichier : `resources/js/Composables/useChallenge.ts`

Centralise toute la logique de jeu :

- `game` : état réactif (`score`, `level`, `lives`, `death`, `elapsedTime`, `remainingTime`, etc.)
- `state` : `ChallengeGameState`
- `generate()` : génère 20 questions par défaut depuis les générateurs du niveau courant, mélange si
  plusieurs générateurs, maintient un tableau parallèle `generatedTimeLimits` synchronisé avec les questions
- `controls.start()` → reset + generate + démarrage timers
- `controls.stop()` → arrêt timers + sauvegarde du score
- `controls.validate(answer)` → dispatch `_successAnswer()` ou `_failedAnswer()`
- `checkBonusLevel()` : applique les bonus du niveau (`bonus.lives`, `bonus.time`) à la passage de niveau
- `store()` : sauvegarde côté serveur via `useStoreScore` — logique différente pour `chrono` (meilleur
  temps) vs les autres (meilleur score)

> **Point d'attention** : Pour le type `chrono`, le score stocké = `elapsedTime` (plus petit = meilleur).
> Pour tous les autres types, c'est `game.score` (plus grand = meilleur).

---

## Pages Vue principales

### `ChallengeShow.vue` (`Challenges/ChallengeShow`)

- Props Inertia : `challenge: ChallengeInterface`, `teams: TeamInterface[]`
- Affiche `BlockShow` (description) quand `state === "intro"`
- Sidebar avec bouton "Challenge" (mode jeu) + liste des générateurs par niveau (mode entraînement)
- Délègue à `ChallengeDisplay` qui switche entre `ChallengeGame` et `ChallengeTraining`
- Lien retour → `chapters.show` (si le challenge a un chapitre — **attention** : pas de guard si `chapter` est null)

### `ChallengeEdit.vue` (`Challenges/ChallengeEdit`)

- Props Inertia : `challenge: ChallengeInterface`
- Sauvegarde le bloc + le challenge en deux appels axios séquentiels
- Gestion des niveaux via `ChallengeLevelEdit` (composant enfant)
- Avertissement si `type === 'blitz'` et générateurs sans `time_per_question`

---

## Composant `ChallengeLevelEdit.vue`

Édition d'un niveau en place :

- Sauvegarde `points_to_pass` via `PATCH api.admin.challengelevels.update`
- Attach/detach de générateurs via `api.admin.challengelevels.generators.attach/detach`
- Édition de `time_per_question` par générateur via `api.admin.challengelevels.generators.update`
- Suppression d'un niveau bloquée si : niveau contient des générateurs OU c'est le seul niveau
  (validations côté serveur ET côté UI)

---

## Points d'attention généraux

1. **`chapter_id` nullable** : ne jamais supposer `challenge->chapter` non null. Dans `ChallengeShow.vue`,
   le lien retour vers le chapitre existe mais n'est pas gardé — si `chapter` est null, il produira une erreur.

2. **Bloc par défaut** : un bloc est créé automatiquement via le boot du modèle ET manuellement dans
   `ChallengeController@show` si absent. Ce double mécanisme est une sécurité pour les données anciennes.

3. **Eager loading systématique** : `$with = ['blocks', 'levels.generators']` charge tout à chaque requête.
   Sur de grands datasets, envisager de le retirer du modèle et de l'expliciter dans les queries.

4. **`indexGenerator`** dans `ChallengeApiController` : recherche les générateurs disponibles via
   `challenge->chapter->theme->id`. Si `chapter` est null, cette méthode plantera. À corriger si on veut
   ajouter des générateurs à un challenge standalone.

5. **Renumérotation des niveaux** : à la suppression d'un niveau, `ChallengeLevelApiController@destroy`
   décrémente les `level_number` des niveaux suivants côté serveur. `ChallengeEdit.vue` fait la même chose
   côté client optimistiquement.

6. **`config` dans le pivot generatorable** : stocké en JSON string en base, décodé dans `GeneratorResource`.
   Actuellement, seul `time_per_question` est supporté. Toute extension doit passer par
   `ChallengeLevelApiController@updateGeneratorConfig`.
