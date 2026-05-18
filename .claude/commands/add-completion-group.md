# Ajout d'un groupe d'autocomplétion CodeMirror

Ajoute une autocomplétion dynamique de type `<prefix>.<key>` au code JavaScript édité dans un `FormCodearea`, en réutilisant le framework `codemirror_completion.ts`.

Utilise cette commande quand l'utilisateur veut autocompléter des entrées dépendant d'un état applicatif (ex: paramètres d'un générateur, variables d'un challenge, mots d'un vocabulaire, touches d'un clavier, etc.).

---

## Contexte de référence

Le framework est défini dans `resources/js/helpers/codemirror_completion.ts` :

```ts
interface CompletionItem { label: string; detail?: string; info?: string }
interface CompletionGroup { prefix: string; items: () => CompletionItem[] }

function makeCompletionSource(groups: CompletionGroup[]): CompletionSource
function schemaToCompletionItems(schema): CompletionItem[]   // adaptateur générateurs (référence)
```

`FormCodearea` accepte une prop `completionGroups?: CompletionGroup[]` qui ajoute le source à l'éditeur CodeMirror (langage `javascript` uniquement). Voir `.claude/docs/formMaker.md` §Autocomplétion personnalisée.

Exemple existant : `Pages/Generators/GeneratorEdit.vue` autocomplète `params.<key>` à partir de `theGenerator.parameters_schema`.

---

## Étape 1 — Questions préalables

Pose ces questions à l'utilisateur **en une seule fois** :

1. **Préfixe** : quel mot avant le point déclenche l'autocomplétion ? (ex: `vars`, `keyboard`, `vocab`)
2. **Source de données** : d'où viennent les items ?
   - **a)** Une prop / un ref local au composant qui contient `FormCodearea`
   - **b)** Un store Pinia (lequel ?)
   - **c)** Une prop Inertia transmise depuis le backend
3. **Structure de la source** : décris la forme des données (clé, type/format, description optionnelle, autres champs ?)
4. **Mapping vers `CompletionItem`** : quels champs deviennent `label` / `detail` / `info` ?
   - Par défaut : label = clé, detail = type/format, info = description
5. **Fichier(s) cible(s)** : dans quel composant Vue ajouter la prop `completion-groups` ? (chemin)
6. **Adaptateur dédié ?** : la conversion source → `CompletionItem[]` est-elle réutilisable ailleurs ?
   - Si oui : créer un helper exporté dans `codemirror_completion.ts` (à côté de `schemaToCompletionItems`)
   - Si non : conversion inline dans le composant suffit

N'avance pas tant que toutes les réponses ne sont pas fournies.

---

## Étape 2 — Plan préliminaire

Présente un plan numéroté :

```markdown
# Plan : Autocomplétion `<prefix>.*` dans <Composant>

## Modifications

### 1. (Optionnel) Adaptateur réutilisable
**Fichier** : `resources/js/helpers/codemirror_completion.ts`
Action : Modifier (ajouter une fonction exportée)
Détails :
- Ajouter `export function <domain>ToCompletionItems(source): CompletionItem[]` qui mappe la structure source vers `CompletionItem[]`

### 2. Intégration dans le composant
**Fichier** : `<chemin du composant>`
Action : Modifier
Détails :
- Import : `import {type CompletionGroup, <domainAdapter>} from "@/helpers/codemirror_completion.ts"`
- Ajouter un `computed<CompletionGroup[]>` qui retourne `[{ prefix: '<prefix>', items: () => <domainAdapter>(<source.value>) }]`
- Ajouter `:completion-groups="completionGroups"` sur le `<FormCodearea>` cible

## Risques

- Vérifier que `prefix` n'entre pas en conflit avec un préfixe existant (`PiMath`, `PiMathExt`, `Random`, `Numeric`, `Geometry`, `params`, ...)
- La source doit être un ref/computed réactif pour que le getter `items()` reflète l'état courant
- Le langage du `FormCodearea` doit être `javascript` (sinon le source custom n'est pas activé)

## Résumé
- Fichiers créés : 0
- Fichiers modifiés : 1 ou 2
- Temps estimé : 10-20 min

## Action
Acceptes-tu ce plan ? (oui / non / ajustements)
```

Attends la validation explicite (`oui`, `ok`, `valide`, `go`, `procède`).

---

## Étape 3 — Exécution

Une fois validé :

### A. (Si demandé) Ajouter l'adaptateur dans `codemirror_completion.ts`

```ts
export function <domain>ToCompletionItems(
    source: <SourceType> | null | undefined
): CompletionItem[] {
    if (!source) return []
    return /* mapping vers CompletionItem[] */
}
```

### B. Modifier le composant cible

1. Import :
   ```ts
   import {type CompletionGroup, <domainAdapter>} from "@/helpers/codemirror_completion.ts"
   import {computed} from "vue"   // si pas déjà importé
   ```

2. Ajouter le `computed` après les déclarations existantes :
   ```ts
   const completionGroups = computed<CompletionGroup[]>(() => [
       {
           prefix: '<prefix>',
           items:  () => <domainAdapter>(<sourceRef>.value)
       }
   ])
   ```

3. Sur le `<FormCodearea>` cible (langage `javascript`) :
   ```html
   <FormCodearea
       v-model="..."
       :completion-groups="completionGroups"
       language="javascript"
   />
   ```

### C. Vérification

- Lance `npx vue-tsc --noEmit` et confirme l'absence d'erreur sur les fichiers touchés
- Rappelle à l'utilisateur de tester manuellement :
  1. Taper `<prefix>.` dans l'éditeur → vérifier l'apparition des suggestions
  2. Vérifier `label` / `detail` / `info`
  3. Modifier la source sans recharger → vérifier la réactivité
  4. Taper `PiMath.` → vérifier la non-régression de l'autocomplétion pimath

---

## Pièges à éviter

- **`items` doit être une fonction**, pas une valeur. Sinon perte de réactivité.
- **Le préfixe est strict** : `vars.x` matche `prefix: 'vars'`, mais `myVars.x` ne matche pas. Pas de matching partiel.
- **CodeMirror doit recevoir un `CompletionGroup[]` stable en référence** : utiliser un `computed` qui retourne le même tableau tant que la **structure** ne change pas. La réactivité du contenu passe par le getter `items()`, pas par la mutation du tableau.
- **Langage `javascript` requis** : la prop `completionGroups` est ignorée pour les autres langages (latex, json, pidraw).
- Ne **pas modifier** `pimath_completions.ts` — c'est un source séparé, statique. Pour mettre à jour les complétions PiMath/PiDraw, utiliser `/codemirror-autocomplete`.