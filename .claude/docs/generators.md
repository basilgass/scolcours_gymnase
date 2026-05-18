# Système de Générateurs — Documentation de référence

> Dernière mise à jour : 2026-05-18
> Périmètre : table `generators`, composants Vue de génération de questions, paramétrage

---

## 1. Vue d'ensemble

Un **Generator** est une fonction JavaScript stockée en base de données qui produit dynamiquement des questions mathématiques. Le code est exécuté côté **client uniquement** via `new Function(...)`. Un générateur est attaché à un ou plusieurs `generatorable` (`ChallengeLevel`, `Evaluation`, etc.) via la table pivot `generatorables`.

Le code du générateur reçoit en argument :
- `PiMath` — la lib mathématique principale
- `PiMathExt` — les extensions locales
- `params` — un objet de paramètres résolus (voir §4)

Et doit retourner un objet `generatedQuestionInterface` (`{question, answer, title?, keyboard?, illustration?}`).

---

## 2. Structure de la base de données

### Table `generators`

| Colonne              | Type     | Notes                                              |
|----------------------|----------|----------------------------------------------------|
| `id`                 | int      |                                                    |
| `theme_id`           | int      | FK vers `themes`                                   |
| `slug`               | string?  | identifiant URL                                    |
| `title`              | string   |                                                    |
| `body`               | string   | description (LaTeX/markdown)                       |
| `template`           | string?  | template KaTeX du rendu : `\[question = answer\]`  |
| `keyboard`           | string   | clavier par défaut                                 |
| `code`               | string   | corps de la `Function` JS exécutée                 |
| `parameters_schema`  | json?    | **schéma des paramètres acceptés** (voir §4)       |
| `created_at`/`updated_at` | timestamps |                                              |

### Table pivot `generatorables` (polymorphique)

| Colonne                | Type     | Rôle                                                  |
|------------------------|----------|-------------------------------------------------------|
| `generator_id`         | int      | FK vers `generators`                                  |
| `generatorable_id`     | int      | FK polymorphique (ChallengeLevel, Evaluation, ...)    |
| `generatorable_type`   | string   | type polymorphique                                    |
| `order`                | int      | ordre d'affichage dans le parent                      |
| `config`               | json?    | **config UX/runtime** (ex: `time_per_question`)       |
| `parameters`           | json?    | **valeurs de paramètres** pour cette instance         |

> **Distinction critique** entre les trois champs JSON :
> - `generators.parameters_schema` = **définition** des paramètres acceptés (typage, defaults)
> - `generatorables.parameters` = **valeurs** choisies pour cette instance (généralement strings brutes)
> - `generatorables.config` = **comportement UX** (time_per_question, etc.) — indépendant de la `Function`

---

## 3. Modèle Eloquent

`App\Models\Generator` :

```php
protected $casts = [
    "parameters_schema" => "array"
];

public function challengeLevels(): MorphToMany
{
    return $this
        ->morphedByMany(ChallengeLevel::class, 'generatorable')
        ->withPivot('order', 'config', 'parameters');
}
```

### Sérialisation (`App\Http\Resources\GeneratorResource`)

Aplatit le pivot dans la réponse JSON :

```json
{
    "id": 1,
    "slug": "...",
    "title": "...",
    "code": "...",
    "parameters_schema": { "domain": {"format":"set", "default":"-5..5", "description":"..."} },
    "order": 1,
    "config": { "time_per_question": 30 },
    "parameters": { "domain": "-3..3" }
}
```

---

## 4. Système de paramètres

### Schéma (`parameters_schema`)

Stocké sur `generators`. Format JSON :

```json
{
    "<key>": {
        "format": "number" | "string" | "set",
        "default": "string brute",
        "description": "optionnel"
    }
}
```

**Toutes les valeurs (default et override) sont stockées en string** et castées au runtime selon `format`.

### Formats supportés

| Format   | Cast côté client                       | Exemple de valeur brute |
|----------|----------------------------------------|-------------------------|
| `number` | `Number(raw)`                          | `"3"` → `3`             |
| `string` | identité                               | `"hello"` → `"hello"`   |
| `set`    | `parseNumberSet(raw).values: number[]` | `"-5..5"` → `[-5,...,5]` |

**Pour ajouter un format** : 3 endroits à toucher
1. `resources/js/types/challengeInterfaces.ts` — type `GeneratorParameterFormat`
2. `app/Http/Requests/GeneratorRequest.php` — règle `in:number,string,set,...`
3. `resources/js/Composables/useGeneratorParameters.ts` — `switch` dans `castParameterValue`

### Résolution au runtime

`resolveParameters(schema, overrides)` (dans `useGeneratorParameters.ts`) :

1. Itère sur les clés du `schema`
2. Pour chaque clé, prend la valeur d'`overrides[key]` si présente, sinon le `default` du schéma
3. Caste selon `schema[key].format`
4. Retourne un `GeneratorParams` prêt à être passé à la `Function`

Si `schema` est `null`/absent → les overrides sont passés bruts (strings) sans casting. Comportement de fallback pour les générateurs legacy.

### Source des overrides (`GeneratorDisplay.vue`)

Deux sources, fusionnées avec priorité :
1. Querystring `?domain=-3..3` (priorité basse)
2. Props `:parameters="..."` passées par le parent (priorité haute) — typiquement `gen.parameters` (valeur du pivot)

---

## 5. Composants frontend

### `useGenerator.ts` (Composable)

Expose :
- `question(value?, params?)` — produit une `QuestionDynamicInterface` consommable par `QuestionShow`
- `random(params?)` — produit une question brute
- `list(n, params?)` — produit N questions distinctes

Cœur : `randomQuestion()` instancie `new Function("PiMath", "PiMathExt", "params", g.code)` et l'invoque.

### `useGeneratorParameters.ts` (Composable)

- `castParameterValue(raw, format)` — cast unitaire
- `resolveParameters(schema, overrides)` — résolution complète

### `GeneratorDisplay.vue` (Composant)

Composant racine pour afficher un générateur en mode interactif (challenge, démo). Lit `props.generator` et `props.parameters`, applique `resolveParameters`, génère une question, la passe à `QuestionShow`.

### `GeneratorsExamples.vue` (Composant)

Affiche N exemples de questions générées (preview, admin). Utilisé dans `GeneratorEdit.vue`.

### `GeneratorEdit.vue` (Page admin)

Édition du générateur. **TODO (phase 2)** : UI pour éditer `parameters_schema`.

---

## 6. Workflows typiques

### Créer un nouveau générateur

1. Admin → `/admin/generators/create`
2. Saisir titre, slug, thème, code (Function body)
3. Tester via `GeneratorsExamples` (preview live)
4. (Phase 2) Définir `parameters_schema` si le code utilise `params.xxx`

### Attacher un générateur à un challenge

1. `ChallengeLevelEdit.vue` → ajouter un générateur à un niveau
2. Configurer `config.time_per_question` (optionnel)
3. (Phase 2) Configurer `parameters` (valeurs pour ce challenge)

### Paramétrer dynamiquement via URL (démo, lien direct)

`?domain=-3..3&level=2` — keys du schéma, valeurs en string brute. Plus de suffixe `.set` (obsolète, supprimé le 2026-05-18).

---

## 7. Validation

### Backend (`GeneratorRequest.php`)

```php
'parameters_schema'               => ['nullable', 'array'],
'parameters_schema.*'             => ['array:format,default,description'],
'parameters_schema.*.format'      => ['required', 'string', 'in:number,string,set'],
'parameters_schema.*.default'     => ['required', 'string'],
'parameters_schema.*.description' => ['nullable', 'string'],
```

### Validation des valeurs (`parameters` du pivot)

**Aucune validation backend.** Décision design : un seul endroit de logique (le front, qui détient la définition des formats). Les valeurs malformées sont gérées gracieusement par les cast functions (`Number("abc")` → `NaN`, `parseNumberSet` retourne `errors`).

---

## 8. Pièges connus

- **`new Function(...)` exécute du code arbitraire** stocké en DB. Seuls les admins doivent pouvoir éditer `code`. Le risque XSS est contenu côté client (pas d'eval serveur).
- **`pimath` + Vue reactivity** : les classes pimath utilisent des champs privés `#field` qui cassent le Proxy Vue. Toujours `markRaw()` avant de stocker une instance dans un ref/reactive. Voir mémoire `project_pimath_vue_reactivity`.
- **Aplatissement du pivot** dans `GeneratorResource` : `config`, `parameters`, `order` apparaissent au niveau racine du JSON, **pas** sous `pivot.`. Code TS adapté en conséquence (`gen.config` et non `gen.pivot.config`).
- **Le `template`** doit contenir `question` et `answer` comme placeholders littéraux remplacés par `useGenerator.question()`.

---

## 9. Fichiers de référence

### Backend
- `app/Models/Generator.php`
- `app/Http/Requests/GeneratorRequest.php` (+ `StoreGeneratorRequest`, `UpdateGeneratorRequest`)
- `app/Http/Resources/GeneratorResource.php`
- `app/Http/Controllers/api/GeneratorApiController.php` (CRUD)
- `database/migrations/2026_05_12_074804_add_parameters_schema_to_generators_table.php`
- `database/migrations/2026_05_18_120000_add_parameters_to_generatorables_table.php`

### Frontend
- `resources/js/Composables/useGenerator.ts`
- `resources/js/Composables/useGeneratorParameters.ts`
- `resources/js/Composables/useNumberSet.ts`
- `resources/js/Components/Challenges/GeneratorDisplay.vue`
- `resources/js/Components/Elements/GeneratorsExamples.vue`
- `resources/js/Pages/Generators/GeneratorEdit.vue`
- `resources/js/types/challengeInterfaces.ts` (interface + types params)

### Doc connexes
- `.claude/docs/challenge_claude.md` — Contexte des challenges qui utilisent les générateurs
- `.claude/docs/question.md` — Système de questions consommant la sortie des générateurs

---

## 10. TODO / Phase 2

- [ ] UI dans `GeneratorEdit.vue` pour éditer `parameters_schema` (liste de paramètres : key/format/default/description)
- [ ] UI dans `ChallengeLevelEdit.vue` pour saisir `pivot.parameters` à côté de `pivot.config.time_per_question`
- [ ] Faire passer `:parameters="gen.parameters"` dans tous les parents qui rendent `GeneratorDisplay`
- [ ] Port PHP de `parseNumberSet` si validation backend devient nécessaire un jour (actuellement non requis)