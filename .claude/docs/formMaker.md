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
  'codearea' | 'fraction' | 'vector' | 'keyboard' | 'numberset'

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

**Composants supportés dans `map`** : tous les types de `FormJsonFieldType` (text, id, email, password, number, color, range, date, datetime-local, textarea, select, switch, codearea, fraction, vector, keyboard, numberset).

---

### FormFraction

Input pour fractions mathématiques. Utilise `FormMakerWrapper` + pimath.

**Model** : `string` (saisie brute, ex: `"3/4"`)

**Événement `@update`** : émet une instance `Fraction` de pimath (ou `null` si invalide / division par zéro). Contrairement au pattern par défaut, `@update` ne renvoie pas la string brute mais la version structurée :

```vue
<FormFraction v-model="raw" @update="frac = $event" />
```

Aucune prop spécifique. `validate()` retourne `["la fraction n'est pas reconnue"]` si le computed interne `parseFraction` est `null` avec une saisie non vide.

Prepend fixe : `\(a/b=\)`.

**Note technique — réactivité Vue + classes pimath** : l'instance émise est passée dans `markRaw()` avant émission. Les classes pimath utilisent des champs privés ES2022 (`#numerator`, `#denominator`...) qui sont incompatibles avec le `Proxy` créé par `reactive()`/`ref()` de Vue 3 — sans `markRaw`, accéder à `.tex` sur une `Fraction` stockée dans un `ref` côté consommateur lève `TypeError: Cannot read private field`. Avec `markRaw`, le consommateur peut utiliser un `ref` standard sans précaution.

---

### FormVector

Input pour vecteurs. Utilise `FormMakerWrapper` + pimath `Vector`.

**Model** : `string` (saisie brute, ex: `"(2/3;5)"`)

**Événement `@update`** : émet une instance `Vector` de pimath (ou `null` si invalide). Comme `FormFraction`, `@update` ne renvoie pas la string brute :

```vue
<FormVector v-model="raw" @update="vec = $event" />
```

Aucune prop spécifique en dehors des communes (notamment `output`).

Format attendu : `(a;b)` ou `(a;b;c)` — parenthèses obligatoires, composantes séparées par `,` ou `;` (les deux acceptés via le parser interne de pimath). Chaque composante peut être un entier ou une fraction (`2/3`).

Validation : un vecteur est considéré invalide si son `display` est `(())` (vide) ou si son `tex` contient `NaN`.

`output` : affiche le vecteur rendu en LaTeX (`\begin{pmatrix}...\end{pmatrix}`) sous l'input. Supporte `$VALUE$` comme placeholder dans une string template.

Prepend fixe : `\((a;b)=\)`.

**Note technique — réactivité Vue + classes pimath** : l'instance émise est passée dans `markRaw()` avant émission (même raison que `FormFraction` : les champs privés `#field` des classes pimath sont incompatibles avec le `Proxy` Vue).

---

### FormNumberSet

Input pour saisir un ensemble de nombres entiers via une syntaxe type "pages d'impression". Utilise `FormMakerWrapper`.

**Model** : `string` (chaîne brute saisie, ex: `"1,3-5,9"`)

**Événement `@update`** : émet le `number[]` résolu (trié, dédupliqué). Contrairement aux autres Form*, `@update` ne renvoie **pas** la valeur du model mais la version structurée. Utilisation typique :

```vue
<FormNumberSet v-model="raw" @update="values = $event" />
```

Aucune prop spécifique. La valeur stockée reste la chaîne ; pour obtenir le `number[]` sans passer par l'événement, utiliser le helper `parseNumberSet` (voir ci-dessous).

**Syntaxe acceptée** :

| Forme | Exemple | Résultat |
|---|---|---|
| Entier seul | `5` | `[5]` |
| Liste | `1,3,9` | `[1,3,9]` |
| Range avec `-` (positifs) | `3-5` | `[3,4,5]` |
| Range avec `..` (toute valeur) | `-5..-2` | `[-5,-4,-3,-2]` |
| Combinaison | `1,3-5,9` | `[1,3,4,5,9]` |

**Règles** :
- Le `-` n'est utilisable comme séparateur de range que si **les deux bornes sont positives**. Pour un range avec négatifs, utiliser `..` (sinon erreur de validation).
- L'ordre croissant est exigé : un input désordonné produit une erreur, mais le tableau résultant est trié et dédupliqué.
- Un range inversé (`5..3`) produit une erreur et est néanmoins expansé/réordonné.

**Output** (prop `output`) : affiche l'ensemble en LaTeX (`\big\{ 3;4;5;6;7 \big\}`). Au-delà de 12 éléments, l'affichage est tronqué avec le cardinal (`\big\{ 1;2;3;\ldots;99;100 \big\} \implies \# = 100`). Supporte `$VALUE$` comme placeholder.

**Helper réutilisable** : `import {parseNumberSet, formatNumberSetKatex, NUMBERSET_TRUNCATE_THRESHOLD} from "@/Composables/useNumberSet.ts"`

```typescript
const {values, errors, sorted} = parseNumberSet("1,3-5,9")
// values: [1,3,4,5,9], errors: [], sorted: true
```

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
9. **Créer l'exemple de démonstration** dans `resources/js/Components/Devs/FormExamples/ExampleForm[Nom].vue` (voir section ci-dessous)
10. **L'enregistrer** dans `resources/js/Components/Devs/DevFormMaker.vue` (import + entrée dans le template)
11. **Si `@update` émet une instance de classe pimath** (`Fraction`, `Vector`, `Polynom`, etc.) : envelopper l'instance dans `markRaw()` avant `emits('update', ...)`. Les champs privés `#field` de pimath cassent la réactivité Vue lorsque l'instance est stockée dans un `ref` consommateur. Voir la note technique dans `FormFraction` / `FormVector`.

---

## Galerie de démonstration (`Devs/FormExamples`)

Chaque composant Form possède un exemple de démonstration vivant dans `resources/js/Components/Devs/FormExamples/`. Ces exemples servent de :
- documentation interactive pour développeurs
- terrain de test visuel (les options globales injectées via `provide('formBaseProps')` s'appliquent à tous les exemples)
- vérification rapide qu'un composant fonctionne après modification

### Règle de maintenance

À chaque fois qu'un composant `Form*.vue` est **créé** ou **modifié** (nouvelle prop, changement de comportement, nouveau type de model) :

1. **Création d'un composant Form** → créer un nouveau `ExampleForm[Nom].vue` ET l'ajouter à `DevFormMaker.vue` (import + balise dans le template).
2. **Modification d'un composant Form existant** → vérifier que l'exemple correspondant couvre la nouvelle fonctionnalité ; le mettre à jour sinon (ajouter une option dans `<template #options>`, ajuster la valeur initiale, etc.).

### Pattern d'un exemple

```vue
<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormXxx from "@/Components/Form/FormXxx.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})
const value = ref(/* valeur initiale représentative */)
// refs supplémentaires pour les options spécifiques au composant
</script>

<template>
  <FormExampleWrapper title="FormXxx">
    <template #options>
      <!-- contrôles pour les props spécifiques (checkboxes, inputs...) -->
      <p class="text-xs text-gray-500">Brève explication de la syntaxe / format attendu.</p>
    </template>

    <template #default="{ baseProps: bp }">
      <FormXxx v-bind="bp" v-model="value" /* props spécifiques */ />
    </template>

    <template #value>
      <code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
    </template>
  </FormExampleWrapper>
</template>
```

### Conventions

- **Titre** : exact nom du composant (`FormVector`, `FormNumberSet`...).
- **Slot `#default`** : reçoit `baseProps` via le scope du wrapper et le binde sur le composant. Ne pas re-binder manuellement `baseProps` injecté.
- **Slot `#options`** : checkboxes / inputs pour les props **spécifiques** au composant (les props communes sont gérées par le panneau global). Inclure une `<p class="text-xs text-gray-500">` avec la doc rapide de la syntaxe.
- **Slot `#value`** : affiche la valeur courante (généralement `JSON.stringify(value)`), pour observation et débogage.
