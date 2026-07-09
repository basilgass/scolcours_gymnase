# Créer un nouveau clavier — SCOLCOURS

> Guide pas-à-pas. Issu du lot **K6** du refactoring claviers/checkers
> (`.claude/specs/2026-07-07-refactoring-claviers-checkers.md`).
> Docs liées : `.claude/docs/checkers.md` (tableaux de contrôle des checkers),
> `.claude/docs/question.md` (consommation runtime des claviers côté question).
> Skill à activer avant toute modif dans `Components/Questions/` : `question-system`.

Un « clavier » est le couple **{disposition de touches à l'écran} + {validation de la
réponse}**. Les deux moitiés ne communiquent que par une **chaîne de code** (le champ
`question.keyboard`, ex. `frac,2` ou `coord,checker:fraction`). Ce guide montre comment
ajouter un clavier de bout en bout.

---

## 1. Le flux, en une image

```
question.keyboard = "frac,2"   (chaîne stockée en base)
        │
        ▼
getOneKeyboard()                        resources/js/Composables/useKeyboard.ts
  ├─ getKeyboardConfig(value) ─────────▶ keyboards[layout]   (disposition)   keyboardConfig.ts
  │        via resolveLayoutKey()                             keyboardRegistry.ts
  ├─ resolveComponentName(value) ──────▶ "Basic" ou composant dédié           keyboardRegistry.ts
  │        puis getComponent() ────────▶ Keyboard{Name}.vue via glob          scolcours.ts
  └─ new PiChecker("frac,2") ──────────▶ checkerNameToEnum() → CHECKERS.X      keyboardRegistry.ts
                                          getCheckerClass()  → classe          checkerRegistry.ts
```

**Registres à connaître (tous déclaratifs et à source unique) :**

| Registre | Fichier                                                              | Rôle                                                   |
|----------|----------------------------------------------------------------------|--------------------------------------------------------|
| Layouts  | `resources/js/Composables/keyboardConfig.ts` (`keyboards`)           | disposition des touches, grille, `tex()`, `formatters` |
| Claviers | `resources/js/Composables/keyboardRegistry.ts` (`KEYBOARD_REGISTRY`) | alias → `{component, layout, checker par défaut}`      |
| Checkers | `resources/js/Checkers/checkerRegistry.ts` (`CHECKER_CLASSES`)       | membre d'enum `CHECKERS` → classe de validation        |
| Enum     | `resources/js/Checkers/checker.config.ts` (`CHECKERS`)               | noms/types de checkers (feuille sans import)           |

**Principe clé.** Le registre clavier ne fournit que des **défauts**. La chaîne de code
d'une question garde le dernier mot : la surcharge `checker:` (ex.
`coord,checker:fraction`) et les options courtes sont réappliquées par `PiChecker`
par-dessus le checker par défaut.

---

## 2. Les deux familles de clavier

Le champ `component` du descripteur les distingue :

- **Display-driven** (`component` absent → défaut `"Basic"`) : juste un *layout* + une
  fonction `tex`. Rendu par le composant générique `KeyboardBasic.vue` (qui enveloppe
  `KeyboardDisplay.vue`). **On ne crée aucun `.vue`.** Exemples : `number`, `fraction`,
  `algebra`, `coord`, `equation`…
- **Custom** (`component: "Xxx"`) : un composant Vue dédié `KeyboardXxx.vue`, pour les
  claviers qui ne se réduisent pas à une grille de touches (interactions propres, saisie
  structurée). Exemples : `Matrix`, `Qcm`, `TableOfSigns`, `Study`, `Draw`, `Order`…

Choisis **display-driven** dès que ta saisie est « une expression tapée touche par
touche ». Ne pars sur un composant custom que si l'UI l'exige.

---

## 3. Recette A — clavier display-driven (le cas courant)

Aucun composant `.vue` à créer.

### A.1 — Ajouter le layout

Dans `keyboardConfig.ts`, ajoute une entrée à l'objet `keyboards` :

```ts
export const keyboards: Record<string, KeyboardObjectType> = {
	// …
	moncalvier: {
		name: "moncalvier",
		grid: "grid-cols-5",              // classe Tailwind de la grille
		layout: [
			"1", "2", "3", "+", "-",        // chaîne = touche simple
			"4", "5", "6", "", "/",         // "" = case vide
			"7", "8", "9", "^2", "sqrt",
			"(", ")", "0", "^", ["=", 2],   // tuple [key, span] = touche large (col-span-2)
		],
		formatters: [formatFractionShortcut], // optionnel — voir A.4
		tex(value) {
			return asciiToTex(value)        // traduction saisie → TeX pour l'affichage
		},
	},
}
```

- Chaque token du `layout` doit exister dans `keyboardKeys` (même fichier) OU être fourni
  inline sous forme d'objet `{key, display, type}`. Les trois formes d'écriture d'une
  entrée (`string | [string, number] | objet`) sont ramenées à une forme unique par
  `normalizeLayoutKey` — voir sa JSDoc.
- Les touches spéciales `@back` / `@reset` sont gérées par `KeyboardDisplay`, pas dans le
  layout (props `back` / `reset` du composant).

### A.2 — Déclarer le clavier dans le registre

Dans `keyboardRegistry.ts`, ajoute **une** entrée à `RAW_REGISTRY` :

```ts
{
	aliases: ["mc", "moncalvier"], layout
:
	"moncalvier", checker
:
	CHECKERS.EXACT
}
,
```

- `aliases` : tous les tokens de code qui doivent résoudre vers ce clavier (**en
  minuscules** ; la résolution du checker/composant est insensible à la casse, celle du
  layout est sensible à la casse).
- `component` omis → `"Basic"`.
- `checker` : le checker **par défaut**. Réutilise un `CHECKERS` existant si possible ;
  sinon, passe par la recette C.

### A.3 — (si besoin) le checker → recette C

Si aucun checker existant ne convient, crée-le (section 5).

### A.4 — Formatage de saisie optionnel

`formatters` applique des règles pures à la saisie brute avant qu'elle ne parte au check.
La seule règle actuelle est `formatFractionShortcut` (`//` → `(num)/den`), réservée aux
claviers où **un numérateur composé a du sens** (présence de `/`, parenthèses, variable).
Ne l'ajoute pas à un clavier de simple fraction. Pour une nouvelle règle, ajoute une
fonction pure dans `keyboardFormatting.ts` et référence-la ici.

---

## 4. Recette B — clavier custom (composant dédié)

### B.1 — Créer le composant

Crée `resources/js/Components/Keyboards/Keyboard{Name}.vue`. **La convention de nommage
est un contrat** : `getComponent(name)` charge `Keyboard${name}.vue` où `name` est le
champ `component` du descripteur. Le glob (`scolcours.ts`) ne balaie qu'**un seul
niveau** : `./Components/Keyboards/*.vue` (avec `KeyboardDisplay.vue` exclu). Un nom qui
ne correspond pas = clavier `null` silencieux.

Le composant doit respecter le **contrat commun** (voir `types/keyboardInterfaces.ts`) :

- **props** : `KeyboardPropsInterface` (`keyboard`) ;
- **emits** : `change` avec un payload `{input, tex, raw}` (`KeyboardInputInterface`) ;
- **expose** : `{reset, setInput, parameters}` (`KeyboardExposeInterface`).

Le plus simple est d'envelopper `KeyboardDisplay.vue` comme le fait `KeyboardBasic.vue`
(gestion du `@change`, `setInput`, `reset`). Regarde `KeyboardMatrix.vue` ou
`KeyboardTableOfSigns.vue` pour un modèle custom réel.

### B.2 — Déclarer le clavier dans le registre

```ts
{
	aliases: ["mycustom"], component
:
	"MyCustom", checker
:
	CHECKERS.X
}
,
```

- `layout` omis → le clavier retombe sur le layout `"exact"` (souvent inutilisé par un
  composant custom qui gère sa propre UI).

### B.3 — le checker → recette C.

---

## 5. Recette C — ajouter un checker

Un checker vit dans la couche `Checkers/` (jamais importé par le registre clavier : la
couture reste une **string**, l'enum `CHECKERS`). Trois éditions, un seul flux :

1. **Nom** — ajoute un membre à l'enum `CHECKERS` (`checker.config.ts`) :
   ```ts
   MON_CHECKER = "monchecker",
   ```
   `checker.config.ts` doit rester une **feuille sans import** (évite le cycle traité en
   K1b) : n'y importe aucune classe.

2. **Classe** — crée `resources/js/Checkers/Basic/MonChecker.ts` (ou `Custom/`) étendant
   `CheckerAbstract` :
   ```ts
   export class MonChecker extends CheckerAbstract {
     constructor(config?: string[] | string) {
       super(config)
       this._type = CHECKERS.MON_CHECKER
       this._description = "…"          // aide affichée dans l'admin
     }
     get format(): string { return "…" }
     checkValue(value: string): CheckerResult {
       // renvoie makeCheckerResult()          → correct
       // ou     makeCheckerResult("message")  → faux
     }
     // Optionnel : override checkFormat(value) pour un pré-contrôle de forme.
   }
   ```
   `CheckerAbstract.check()` gère déjà : préfixe `@`, alternatives `||`, égalité stricte,
   valeur vide, puis `checkFormat` → `checkValue`.

3. **Enregistrement** — ajoute la classe à `CHECKER_CLASSES` (`checkerRegistry.ts`) et
   exporte-la depuis le barrel de son dossier (`Basic/index.ts` ou `Custom/index.ts`) :
   ```ts
   [CHECKERS.MON_CHECKER]: MonChecker,
   ```
   `checkerRegistry` est la **source unique** du lien enum → classe. La table est
   volontairement **partielle** (certains membres d'enum n'ont pas de classe et retombent
   sur `EXACT`). L'annotation `Partial<Record<CHECKERS, CheckerClass>>` valide les clés à
   la compilation sans exiger la complétude.

Le checker est alors utilisable comme défaut (`checker:` du descripteur) **et** comme
surcharge dans une chaîne de code (`monclavier,checker:monchecker`).

---

## 6. Vérifier

- **Tests** : `npx vitest run tests/ts/Composables/useKeyboard.characterization.test.ts`
  (résolution composant/layout/checker) et `tests/ts/Checkers/pichecker.test.ts`. Si tu
  ajoutes un checker, écris ses cas dans `tests/ts/Checkers/…` et documente son tableau de
  contrôle dans `checkers.md` (`/checker-analyse`).
- **Typecheck** : `npx vue-tsc --noEmit`.
- **Build** : un changement non reflété dans l'UI demande souvent `npm run build` /
  `npm run dev` (le glob et le manifeste Vite sont regénérés au build).

---

## 7. Pièges connus

- **Nom de composant custom** : `component:"Foo"` ⇒ fichier `KeyboardFoo.vue` exactement,
  à la racine de `Components/Keyboards/`. Sinon `getModule` renvoie `null` sans erreur.
- **Casse des alias** : mets les alias en minuscules. `resolveComponentName` /
  `checkerNameToEnum` normalisent en minuscules, mais `resolveLayoutKey` est sensible à la
  casse (comportement historique figé).
- **Table checker partielle** : un `checker: CHECKERS.X` sans classe dans `CHECKER_CLASSES`
  retombe silencieusement sur `EXACT` (avec un `console.warn`). Vérifie que ton enum a bien
  une entrée dans `checkerRegistry`.
- **Divergences d'alias historiques** : certains alias sont volontairement câblés vers
  `string` (`scientific`, `tableofsigns`, `resol`, `order`, `input`, `sentence`…). Elles
  sont commentées dans `keyboardRegistry` et figées par le snapshot de caractérisation ; ne
  les « corrige » pas sans migration.
- **Layout fallback** : un descripteur sans `layout` utilise `keyboards["exact"]`.
