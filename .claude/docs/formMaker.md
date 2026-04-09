# Documentation du système FormMaker

## Architecture globale

Le système FormMaker est composé de composants Vue autonomes et typés, sans routeur central par `type`. Chaque composant est importé explicitement là où il est utilisé.

```
FormMakerInterface.ts       — types partagés (props, emits, expose)
useFormMaker.ts             — composable partagé (focus, validate, errors)
FormMakerWrapper.vue        — wrapper visuel réutilisable (label, icon, btn, errors...)
Form*.vue                   — composants individuels
```

### Fichiers clés

| Fichier | Rôle |
|---|---|
| `Components/Form/FormMakerInterface.ts` | Définit `FormMakerBaseProps`, `FormElementEmits`, `FormElementExpose`, et les types `TextInputType`, `FormJsonFieldType`, `FormComponentType` |
| `Composables/useFormMaker.ts` | Fournit `errors: Ref<string[]>` et l'objet `expose` (`focus`, `validate`) à chaque composant |
| `Components/Form/FormMakerWrapper.vue` | Wrapper visuel partagé : label flottant, label inline, icône/prepend, bouton, effacement, affichage des erreurs, message, tailles (xs/sm/xl), état disabled |

### Pattern d'un composant Form

```vue
<script setup lang="ts">
defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps { /* props spécifiques */ }
const props = defineProps<Props>()
const value = defineModel<...>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLInputElement>('input')
const { errors, expose } = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)
</script>

<template>
  <form-maker-wrapper v-bind="{...$attrs, ...props}" :errors>
    <input ref="input" v-model="value" :disabled="props.disabled" v-bind="$attrs" />
  </form-maker-wrapper>
</template>
```

### Règle `inheritAttrs: false`

Tous les composants déclarent `inheritAttrs: false`. Les attributs HTML passés depuis le parent (classes, data-*, etc.) sont transmis manuellement via `v-bind="$attrs"` sur l'élément interne. Les props déclarées dans `FormMakerBaseProps` ne sont **pas** dans `$attrs`.

---

## Props communes (`FormMakerBaseProps`)

Toutes les props suivantes sont disponibles sur chaque composant Form.

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `label` | `string` | `""` | Label affiché au-dessus ou inline |
| `inlineLabel` | `boolean` | `false` | Affiche le label à gauche de l'input (inline) |
| `icon` | `boolean \| string` | `false` | Icône Bootstrap dans le prepend (ex: `"bi bi-star"`). Sur `FormInput`, des icônes par défaut sont assignées selon le type |
| `prepend` | `boolean \| string` | `false` | Texte (ou LaTeX) affiché à gauche, avant l'input |
| `btn` | `boolean \| string` | `false` | Bouton à droite de l'input. Si string, utilisé comme classe d'icône BI. Émet `@button` |
| `clearable` | `boolean` | `false` | Affiche un bouton × pour effacer la valeur |
| `disabled` | `boolean` | `false` | Désactive le composant visuellement (`opacity-50 pointer-events-none`) et fonctionnellement (`disabled` sur les éléments natifs) |
| `message` | `string` | `""` | Message d'aide affiché sous l'input (supporte LaTeX via `v-katex`) |
| `messageClass` | `string` | — | Classe CSS appliquée au message |
| `xs` | `boolean` | `false` | Taille extra-petite (`text-xs`) |
| `sm` | `boolean` | `false` | Taille petite (`text-sm`) |
| `xl` | `boolean` | `false` | Grande taille (`text-xl`) |
| `focus` | `boolean` | `false` | Donne le focus au montage du composant |
| `output` | `boolean \| string` | — | Disponible sur certains composants (FormVector) : affiche un rendu. `true` = rendu par défaut, string avec `$VALUE$` = template personnalisé |
| `inputClass` | `false \| string` | `false` | Remplace la classe CSS de la zone input dans FormMakerWrapper |

---

## Événements communs (`FormElementEmits`)

| Événement | Payload | Déclenchement |
|---|---|---|
| `@update` | `unknown` | Quand la valeur change |
| `@enter` | `unknown` | Quand l'utilisateur appuie sur Entrée |
| `@focus` | — | Quand l'input reçoit le focus |
| `@blur` | — | Quand l'input perd le focus |
| `@errors` | `string[]` | Quand la validation change (erreurs ou tableau vide) |
| `@button` | — | Quand le bouton btn est cliqué |

---

## Expose (`FormElementExpose`)

Accessible via `useTemplateRef` ou `ref` sur le composant.

| Méthode | Description |
|---|---|
| `focus()` | Donne le focus à l'élément natif |
| `validate()` | Retourne le tableau d'erreurs actuel (`string[]`) |

Sur `FormFraction` et `FormVector`, `validate()` est surchargé avec une validation pimath réelle.

---

## Types

```typescript
type TextInputType =
  'text' | 'id' | 'email' | 'password' | 'number' |
  'color' | 'range' | 'date' | 'datetime-local'

type FormJsonFieldType =
  TextInputType | 'textarea' | 'select' | 'switch' |
  'codearea' | 'fraction' | 'vector' | 'keyboard'

type FormComponentType =
  FormJsonFieldType | 'search' | 'json' | 'theme' | 'chapter' | 'team' | 'deck'
```

`FormJsonFieldType` est la liste des types utilisables comme valeurs dans le `map` de `FormJson`.

---

## Composants

### FormInput

Input texte natif. Utilise `FormMakerWrapper`.

**Model** : `string | number`

| Prop spécifique | Type | Description |
|---|---|---|
| `type` | `TextInputType` | Type HTML de l'input. `'id'` est rendu comme `type="text"`. Par défaut : `'text'` |

**Icônes automatiques selon `type`** (si `icon` non spécifié) :

| type | icône |
|---|---|
| `number` | `bi bi-123` |
| `text` | `bi bi-fonts` |
| `id` | `bi bi-key` |

---

### FormSwitch

Toggle on/off. N'utilise **pas** `FormMakerWrapper` (template autonome).

**Model** : `boolean | number`

| Prop spécifique | Type | Description |
|---|---|---|
| `invert` | `boolean` | Inverse logiquement la valeur affichée (la valeur stockée reste inchangée) |

**Format du label** : `"état actif,état inactif"` — les deux états sont affichés de part et d'autre du toggle, séparés par une virgule.

**Attributs CSS supplémentaires** : `enabled-class` et `disabled-class` (injectés via `$attrs`) permettent de personnaliser la couleur du toggle. Défauts : `bg-blue-700` / `bg-red-700`.

---

### FormTextarea

Zone de texte multi-lignes. Utilise `FormMakerWrapper` + `useTextEditor`.

**Model** : `string`

| Prop spécifique | Type | Défaut | Description |
|---|---|---|---|
| `catchTab` | `boolean` | — | Intercepte la touche Tab pour insérer une indentation au lieu de changer de focus |

---

### FormSelect

Menu déroulant custom. Utilise `FormMakerWrapper`. Fermeture automatique au clic extérieur.

**Model** : `string | Record<string, string>`

| Prop spécifique | Type | Défaut | Description |
|---|---|---|---|
| `choices` | `string[] \| Record<string, string>` | — | Liste des options. Si `Record`, la clé est la valeur stockée, la valeur est le label affiché |
| `labelMap` | `(element: unknown) => string` | `identity` | Fonction de transformation du label affiché (supporte LaTeX via `v-katex`) |

---

### FormCodearea

Éditeur de code avec coloration syntaxique (Prism.js). N'utilise **pas** `FormMakerWrapper`.

**Model** : `string`

| Prop spécifique | Type | Défaut | Description |
|---|---|---|---|
| `language` | `"latex" \| "json" \| "javascript"` | `"latex"` | Langage pour la coloration et les macros clavier |
| `rows` | `number` | `4` | Hauteur minimale en lignes |
| `autoSize` | `boolean` | `false` | Ajuste la hauteur automatiquement au contenu |
| `resizeable` | `boolean` | `false` | Affiche un bouton "agrandir" (+10 lignes) |
| `wrap` | `boolean` | `true` | Retour à la ligne automatique (`whitespace-pre-wrap` vs `whitespace-pre`) |

**Événements supplémentaires** : `@currentLine` (string), `@mathMode` (boolean).

Affiche des boutons de macros en bas selon le langage (`latex_macros`, `javascript_macros`, `json_macros`).

---

### FormKeyboard

Éditeur de configuration de clavier PiChecker. Utilise `FormMakerWrapper`.

**Model** : `string`

| Prop spécifique | Type | Défaut | Description |
|---|---|---|---|
| `rows` | `number` | `2` | Hauteur minimale en lignes |

Affiche une aide contextuelle (tooltip fixe en bas à droite) listant les checkers disponibles selon le mot-clé de la ligne courante. Tab complète automatiquement si un seul résultat correspond.

---

### FormSearch

Champ de recherche avec suggestions. Générique `T extends { id: number, title: string }`. N'utilise **pas** `FormMakerWrapper`.

**Model** : `T | undefined`

| Prop spécifique | Type | Défaut | Description |
|---|---|---|---|
| `fetch` | `string` | — | URL API pour charger les suggestions. Ajoute `?search=...` si `dynamic: true` |
| `list` | `string[]` | — | Liste statique (convertie en `{id, title}[]`). Mutuellement exclusif avec `fetch` |
| `labelMap` | `(element: T) => string` | `(e) => e.title` | Transforme l'objet en label affiché |
| `dynamic` | `boolean` | `false` | Si `true`, recharge les suggestions à chaque frappe (debounce 300ms). Si `false`, filtre côté client |

---

### FormJson

Formulaire dynamique construit depuis un schéma clé→type. Générique `T extends Record<string, unknown>`. N'utilise **pas** `FormMakerWrapper` directement (le compose via ses enfants).

**Model** : `T`

| Prop spécifique | Type | Description |
|---|---|---|
| `map` | `Record<string, FormJsonFieldType>` | Schéma du formulaire : clé = nom du champ, valeur = type de composant à utiliser |

Les champs vides sont **exclus** de l'objet résultant. Appuyer sur Entrée passe au champ suivant (boucle).

**Composants supportés dans `map`** : tous les types de `FormJsonFieldType` (text, id, email, password, number, color, range, date, datetime-local, textarea, select, switch, codearea, fraction, vector, keyboard).

---

### FormFraction

Input pour fractions mathématiques. Utilise `FormMakerWrapper` + pimath.

**Model** : `string`

Aucune prop spécifique. `validate()` retourne une erreur si la valeur n'est pas reconnue par `new Fraction(value)` ou si le dénominateur est zéro.

Prepend fixe : `\(a/b=\)`.

---

### FormVector

Input pour vecteurs. Utilise `FormMakerWrapper` + pimath.

**Model** : `string`

Aucune prop spécifique en dehors des communes (notamment `output`).

Format attendu : `(a,b)` ou `(a,b,c)` — parenthèses obligatoires, composantes séparées par des virgules. Chaque composante est validée via `new Fraction(comp)`.

`output` : affiche le vecteur rendu en LaTeX (`\begin{pmatrix}...\end{pmatrix}`) sous l'input. Supporte `$VALUE$` comme placeholder dans une string template.

Prepend fixe : `\((a,b)=\)`.

---

### FormTheme

Sélecteur de thème. Utilise `FormMakerWrapper`. Dépend de `$page.props.themes` (Inertia).

**Model** : `string | number`

| Prop spécifique | Type | Défaut | Description |
|---|---|---|---|
| `themeKey` | `string` | `"id"` | Propriété du thème stockée comme valeur du modèle (`"id"`, `"title"`, etc.) |

---

### FormChapter

Sélecteur de chapitre en deux étapes : thème → chapitres. N'utilise **pas** `FormMakerWrapper`.

**Model** : `ChapterInterface | undefined`

| Prop spécifique | Type | Défaut | Description |
|---|---|---|---|
| `theme` | `ThemeInterface \| number \| undefined` | `undefined` | Si fourni, saute l'étape de sélection du thème et charge directement les chapitres correspondants |

Charge via `api.themes.chapters.index`. Affiche `FormTheme` si `theme` est undefined, puis les chapitres sous forme de boutons.

---

### FormTeam

Sélecteur d'équipe. Utilise `FormMakerWrapper`. Charge via `api.admin.teams.index`.

**Model** : `TeamInterface | undefined`

Aucune prop spécifique. Affiche les équipes sous forme de boutons.

---

### FormDeck

Sélecteur de deck. N'utilise **pas** `FormMakerWrapper`. Charge via `api.decks.index`.

**Model** : `DeckInterface | undefined`

| Prop spécifique | Type | Défaut | Description |
|---|---|---|---|
| `theme` | `ThemeInterface \| number \| undefined` | `undefined` | Filtre optionnel (non encore implémenté côté API, réservé pour usage futur) |

---

## Composants sans `FormMakerWrapper`

Les composants suivants gèrent leur propre affichage et leur état `disabled` indépendamment :

| Composant | Raison |
|---|---|
| `FormSwitch` | Template purement visuel, pas de zone input standard |
| `FormCodearea` | Éditeur avec overlay Prism.js, structure incompatible avec le wrapper |
| `FormSearch` | Composite avec dropdown libre |
| `FormChapter` | Composite multi-étapes |
| `FormDeck` | Composite avec chargement asynchrone |
| `FormJson` | Compose d'autres Form* |

---

## Ajouter un nouveau composant Form

1. Créer `Form[Nom].vue` dans `Components/Form/`
2. Déclarer `defineOptions({inheritAttrs: false})`
3. Faire `interface Props extends FormMakerBaseProps { ... }` pour les props spécifiques
4. Utiliser `useFormMaker(inputRef)` et `defineExpose<FormElementExpose>(expose)`
5. Si compatible : utiliser `FormMakerWrapper` avec `v-bind="{...$attrs, ...props}"`
6. Si non compatible : gérer manuellement `opacity-50 pointer-events-none select-none` sur la div racine quand `disabled`
7. Ajouter le type dans `FormJsonFieldType` (si utilisable dans `FormJson`) ou `FormComponentType`
8. Ajouter l'entrée dans le `componentMap` de `FormJson.vue` si applicable
