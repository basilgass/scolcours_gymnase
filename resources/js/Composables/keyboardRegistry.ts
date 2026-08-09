import {CHECKERS} from "@/Checkers/checker.config.ts"

/**
 * Registre des claviers — SOURCE UNIQUE DE VÉRITÉ.
 *
 * Chaque descripteur décrit un clavier (ou une famille d'alias) et co-localise
 * les trois informations qui, auparavant, étaient dispersées dans trois `switch`
 * séparés :
 *   - `component`   : quel composant Vue rend le clavier (ex. "Basic", "Matrix")
 *                     — remplace getComponentKeyboardName()
 *   - `layout`      : quelle entrée de `keyboards` (keyboardConfig) fournit la
 *                     disposition — remplace keyboardMaps()
 *   - `checker`     : quel checker par DÉFAUT valide la réponse — remplace
 *                     checkerNameToEnum()
 *
 * Ajouter un nouveau clavier = ajouter UNE entrée ici (+ le composant .vue et,
 * au besoin, un layout dans keyboardConfig et une classe de checker).
 *
 * IMPORTANT — le registre ne fournit que des DÉFAUTS. La chaîne de code d'une
 * question conserve le dernier mot : la surcharge `checker:` (ex.
 * `coord,checker:fraction`) et les options courtes continuent d'être appliquées
 * par PiChecker par-dessus le checker par défaut.
 *
 * Les divergences historiques sont conservées TELLES QUELLES et signalées par un
 * commentaire (elles sont figées par le snapshot de caractérisation) :
 *   - `scn` → checker `scientific`, mais `scientific` (mot complet) → `string`
 *   - `tos` → checker `tos`, mais `tableofsigns` → `string`
 *   - `resolution` → checker `solution`, mais `resol` → `string`
 *   - `order` / `input` / `sentence` → checker `string` (non câblés)
 */

interface RawKeyboardDescriptor {
	/** Tous les tokens de code qui résolvent vers ce clavier (en minuscules). */
	aliases: string[]
	/** Composant Vue (base name). Défaut : "Basic". */
	component?: string
	/**
	 * Clé de layout dans `keyboards` (keyboardConfig). Laisser absent pour les
	 * claviers sur-mesure : getOneKeyboard retombe alors sur le layout "exact".
	 */
	layout?: string
	/** Checker par défaut (surchargeable par la question). */
	checker: CHECKERS
}

export interface KeyboardDescriptor {
	aliases: string[]
	component: string
	layout: string | null
	checker: CHECKERS
}

const RAW_REGISTRY: RawKeyboardDescriptor[] = [
	// ─── Claviers "display-driven" (composant Basic + layout partagé) ─────────
	{aliases: ["nb", "number"], layout: "number", checker: CHECKERS.NUMBER},
	{aliases: ["fr", "frac", "fraction"], layout: "fraction", checker: CHECKERS.FRACTION},
	{aliases: ["fr+", "frac+", "fraction+"], layout: "fraction+", checker: CHECKERS.FRACTION_PLUS},
	{aliases: ["sol", "solution"], layout: "solution", checker: CHECKERS.SOLUTION},
	{aliases: ["scn"], layout: "scientific", checker: CHECKERS.SCIENTIFIC},
	// Divergence : le mot complet "scientific" n'était pas câblé côté checker.
	{aliases: ["scientific"], layout: "scientific", checker: CHECKERS.STRING},
	{aliases: ["equ", "equation"], layout: "equation", checker: CHECKERS.EQUATION},
	{aliases: ["fn", "function"], layout: "function", checker: CHECKERS.FUNCTION},
	{aliases: ["log"], layout: "exact", checker: CHECKERS.LOGARITHM},
	{aliases: ["exp"], layout: "algebra", checker: CHECKERS.EXPONENTIAL},
	{aliases: ["exact"], layout: "exact", checker: CHECKERS.EXACT},
	{aliases: ["algebra"], layout: "algebra", checker: CHECKERS.ALGEBRA},
	{aliases: ["polynom"], layout: "polynom", checker: CHECKERS.POLYNOMIAL},
	{aliases: ["rational"], layout: "rational", checker: CHECKERS.RATIONAL},
	{aliases: ["primitive"], layout: "primitive", checker: CHECKERS.PRIMITIVE},
	{aliases: ["coord"], layout: "coord", checker: CHECKERS.COORDINATES},
	{aliases: ["vector"], layout: "vector", checker: CHECKERS.VECTOR},
	{aliases: ["angle"], layout: "angle", checker: CHECKERS.ANGLE},
	{aliases: ["mod"], layout: "mod", checker: CHECKERS.MODULO},
	// Layouts d'affichage sans checker dédié (retombent sur "string").
	{aliases: ["cartesian"], layout: "cartesian", checker: CHECKERS.STRING},
	{aliases: ["limit"], layout: "limit", checker: CHECKERS.STRING},
	{aliases: ["pow"], layout: "pow", checker: CHECKERS.STRING},
	{aliases: ["simple"], layout: "simple", checker: CHECKERS.STRING},

	// ─── Claviers sur-mesure (composant dédié, layout "exact" par défaut) ─────
	{aliases: ["qcm"], component: "Qcm", checker: CHECKERS.QCM},
	{aliases: ["tos"], component: "TableOfSigns", checker: CHECKERS.TABLE_OF_SIGNS},
	// Divergence : "tableofsigns" n'était pas câblé côté checker.
	{aliases: ["tableofsigns"], component: "TableOfSigns", checker: CHECKERS.STRING},
	{aliases: ["study"], component: "Study", checker: CHECKERS.STUDY},
	{aliases: ["order"], component: "Order", checker: CHECKERS.STRING},
	{aliases: ["matrix"], component: "Matrix", checker: CHECKERS.MATRIX},
	{aliases: ["draw"], component: "Draw", checker: CHECKERS.DRAW},
	{aliases: ["zones"], component: "DrawZones", checker: CHECKERS.ZONES},
	{aliases: ["type"], component: "Type", checker: CHECKERS.TYPE},
	{aliases: ["input"], component: "Input", checker: CHECKERS.STRING},
	{aliases: ["sentence", "phrase", "words", "mots"], component: "Sentence", checker: CHECKERS.STRING},
	{aliases: ["resolution"], component: "Resolution", checker: CHECKERS.SOLUTION},
	// Divergence : "resol" partage le composant Resolution mais n'a pas de checker câblé.
	{aliases: ["resol"], component: "Resolution", checker: CHECKERS.STRING},
]

/** Composant par défaut lorsqu'aucun descripteur ne correspond. */
const DEFAULT_COMPONENT = "Basic"

const KEYBOARD_REGISTRY: KeyboardDescriptor[] = RAW_REGISTRY.map((raw) => ({
	aliases: raw.aliases,
	component: raw.component ?? DEFAULT_COMPONENT,
	layout: raw.layout ?? null,
	checker: raw.checker,
}))

const ALIAS_MAP: Map<string, KeyboardDescriptor> = (() => {
	const map = new Map<string, KeyboardDescriptor>()
	for (const descriptor of KEYBOARD_REGISTRY) {
		for (const alias of descriptor.aliases) {
			map.set(alias, descriptor)
		}
	}
	return map
})()

/**
 * Retourne le descripteur pour un token de code, ou `undefined` s'il est inconnu.
 * La recherche est sensible à la casse (les alias sont en minuscules).
 */
function findKeyboardDescriptor(token: string): KeyboardDescriptor | undefined {
	return ALIAS_MAP.get(token)
}

/**
 * Nom du composant Vue à charger pour ce token. Défaut : "Basic".
 * Remplace l'ancien getComponentKeyboardName() (recherche insensible à la casse).
 */
export function resolveComponentName(token: string): string {
	return findKeyboardDescriptor(token.toLowerCase())?.component ?? DEFAULT_COMPONENT
}

/**
 * Clé de layout dans `keyboards` pour ce token. Retourne le token inchangé si
 * aucun mapping (comportement identique à l'ancien keyboardMaps, sensible à la
 * casse).
 */
export function resolveLayoutKey(token: string): string {
	return findKeyboardDescriptor(token)?.layout ?? token
}

/**
 * Checker par défaut (enum) pour ce token. Défaut : CHECKERS.STRING.
 * Remplace l'ancien checkerNameToEnum() (recherche insensible à la casse).
 */
export function checkerNameToEnum(name: string): CHECKERS {
	return findKeyboardDescriptor(name.toLowerCase())?.checker ?? CHECKERS.STRING
}
