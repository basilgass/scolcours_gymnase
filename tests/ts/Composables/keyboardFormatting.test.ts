import {describe, expect, test} from "vitest"
import {
	countFractionShortcuts,
	formatFractionShortcut,
	formatKeyboardInput,
	hasTooManyFractionShortcuts
} from "@/Composables/keyboardFormatting.ts"

/**
 * Tests du module de formatage clavier extrait de KeyboardDisplay (lot K2).
 * Le comportement doit être identique à l'ancien bloc inline `changeEvent`.
 * Le filet de caractérisation de KeyboardDisplay vérifie l'intégration ;
 * ce fichier verrouille la logique en isolation.
 */

describe("formatFractionShortcut — raccourci fraction //", () => {
	test("un seul // : (numérateur)/dénominateur", () => {
		expect(formatFractionShortcut("1//2")).toBe("(1)/2")
	})

	test("dénominateur vide : (num)/...", () => {
		expect(formatFractionShortcut("1//")).toBe("(1)/...")
	})

	test("numérateur vide : ()/...", () => {
		expect(formatFractionShortcut("//")).toBe("()/...")
	})

	test("numérateur composé conservé tel quel entre parenthèses", () => {
		expect(formatFractionShortcut("1+2//3")).toBe("(1+2)/3")
	})

	test("plusieurs // : inchangé (garde extras.length === 0)", () => {
		expect(formatFractionShortcut("1//2//3")).toBe("1//2//3")
	})

	test("pas de // : inchangé", () => {
		expect(formatFractionShortcut("1/2")).toBe("1/2")
		expect(formatFractionShortcut("abc")).toBe("abc")
		expect(formatFractionShortcut("")).toBe("")
	})
})

describe("formatKeyboardInput — pipeline paramétré", () => {
	test("applique la règle fraction quand elle est fournie", () => {
		expect(formatKeyboardInput("1//2", [formatFractionShortcut])).toBe("(1)/2")
	})

	test("laisse passer une entrée sans règle applicable", () => {
		expect(formatKeyboardInput("x+1", [formatFractionShortcut])).toBe("x+1")
	})

	test("aucun formatter (défaut) : saisie brute intacte", () => {
		expect(formatKeyboardInput("1//2")).toBe("1//2")
		expect(formatKeyboardInput("1//2", [])).toBe("1//2")
	})
})

describe("countFractionShortcuts / hasTooManyFractionShortcuts", () => {
	test("compte les occurrences de //", () => {
		expect(countFractionShortcuts("1")).toBe(0)
		expect(countFractionShortcuts("1/2")).toBe(0)
		expect(countFractionShortcuts("1//2")).toBe(1)
		expect(countFractionShortcuts("1//2/")).toBe(1)
		expect(countFractionShortcuts("1//2//3")).toBe(2)
	})

	test("un seul // est autorisé (pas trop)", () => {
		expect(hasTooManyFractionShortcuts("1//2")).toBe(false)
		expect(hasTooManyFractionShortcuts("1//2/")).toBe(false)
	})

	test("deux // ou plus : trop", () => {
		expect(hasTooManyFractionShortcuts("1//2//")).toBe(true)
		expect(hasTooManyFractionShortcuts("1//2//3")).toBe(true)
	})
})
