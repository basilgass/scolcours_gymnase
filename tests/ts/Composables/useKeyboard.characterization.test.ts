import {expect, test} from "vitest"
import {getOneKeyboard} from "@/Composables/useKeyboard.ts"

/**
 * Filet de caractérisation du système de résolution des claviers.
 *
 * Ce test PHOTOGRAPHIE le comportement actuel de getOneKeyboard() : pour chaque
 * code clavier, on fige le composant résolu, le layout, le checker principal, le
 * secondaryChecker (surcharges `checker:` incluses) et la sortie tex().
 *
 * Il est écrit AVANT le refactor "registre unique" et doit rester vert (snapshot
 * identique) APRÈS. Toute différence de snapshot = régression à investiguer.
 *
 * Note : les quirks connus font partie de la photographie et doivent être
 * préservés tels quels (ex. `frac+` retombe sur le checker `exact`, `sentence`
 * retombe sur `string`, `qcm` hérite du layout `exact`).
 */

// [label lisible, code clavier]
// Matrice EXHAUSTIVE : couvre tous les alias des trois switch actuels
// (getComponentKeyboardName, keyboardMaps, checkerNameToEnum) + les layouts
// déclarés dans `keyboards`, afin que le refactor ne puisse rien casser sans
// faire diverger le snapshot.
const CODES: [string, string][] = [
	// --- alias abrégés (keyboardMaps) ---
	["nb", "nb"],
	["fr", "fr"],
	["frac", "frac"],
	["fr+", "fr+"],
	["frac+", "frac+"],
	["sol", "sol"],
	["scn", "scn"],
	["equ", "equ"],
	["fn", "fn"],
	["log", "log"],
	["exp", "exp"],
	// --- composants sur-mesure (getComponentKeyboardName) ---
	["qcm", "qcm"],
	["tos", "tos"],
	["tableofsigns", "tableofsigns"],
	["study", "study"],
	["order", "order"],
	["matrix", "matrix"],
	["draw", "draw"],
	["zones", "zones"],
	["type", "type"],
	["input", "input"],
	["sentence", "sentence"],
	["phrase", "phrase"],
	["words", "words"],
	["mots", "mots"],
	["resol", "resol"],
	["resolution", "resolution"],
	// --- noms canoniques / layouts (keyboards + checkerNameToEnum) ---
	["exact", "exact"],
	["algebra", "algebra"],
	["number", "number"],
	["fraction", "fraction"],
	["fraction+", "fraction+"],
	["solution", "solution"],
	["scientific", "scientific"],
	["equation", "equation"],
	["function", "function"],
	["polynom", "polynom"],
	["rational", "rational"],
	["primitive", "primitive"],
	["coord", "coord"],
	["vector", "vector"],
	["trigo", "trigo"],
	["mod", "mod"],
	["cartesian", "cartesian"],
	["limit", "limit"],
	["pow", "pow"],
	["simple", "simple"],
	// --- surcharges de checker (checker:) ---
	["coord+checker:fraction", "coord,checker:fraction"],
	["sol+checker:trigo,p", "sol,checker:trigo,p"],
	// --- fallback token inconnu ---
	["unknown", "zzz_unknown"],
	// --- paramètres de ligne (@var, @if) ---
	["with-var-param", "algebra\n@var:t"],
	["with-if-override", "nb\n@if x?1"],
]

function summarize(code: string): Record<string, unknown> {
	const {keyboard, checker} = getOneKeyboard(code)
	if (!keyboard || !checker) {
		throw new Error(`getOneKeyboard('${code}') n'a pas résolu keyboard/checker`)
	}
	const cfg = keyboard.config

	let tex: string | null
	try {
		tex = cfg?.tex ? cfg.tex("1+2/3") : null
	} catch (e) {
		tex = `THROW:${(e as Error).message}`
	}

	return {
		component: keyboard.name,
		layout: cfg?.name ?? null,
		grid: cfg?.grid ?? null,
		parameters: keyboard.parameters,
		values: keyboard.values,
		mainChecker: checker.checker.checker.type,
		secondaryChecker: checker.checker.secondaryChecker?.type ?? null,
		checkerOverride: checker.checkerOverride,
		tex,
	}
}

test("keyboard resolution characterization (component / layout / checker / tex)", () => {
	const snapshot: Record<string, unknown> = {}
	for (const [label, code] of CODES) {
		snapshot[label] = summarize(code)
	}
	expect(snapshot).toMatchSnapshot()
})