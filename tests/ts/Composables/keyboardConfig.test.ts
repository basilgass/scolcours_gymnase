import {describe, expect, test} from "vitest"
import {normalizeLayoutKey} from "@/Composables/keyboardConfig"

/**
 * Tests de normalizeLayoutKey (lot K2 — layout à forme unique).
 * Chaque forme d'écriture d'une entrée de layout doit produire la même forme
 * canonique { key, span, inlineKey? }. L'intégration est vérifiée par le filet
 * de caractérisation de KeyboardDisplay ; ce fichier verrouille la fonction pure.
 */

describe("normalizeLayoutKey", () => {
	test("forme chaîne : touche simple, span 0", () => {
		expect(normalizeLayoutKey("1")).toEqual({key: "1", span: 0})
	})

	test("forme chaîne vide (touche invisible)", () => {
		expect(normalizeLayoutKey("")).toEqual({key: "", span: 0})
	})

	test("forme tuple : touche + span", () => {
		expect(normalizeLayoutKey(["=", 2])).toEqual({key: "=", span: 2})
		expect(normalizeLayoutKey(["=", 3])).toEqual({key: "=", span: 3})
	})

	test("forme objet : touche inline conservée dans inlineKey", () => {
		const inline = {key: "foo", display: "FOO", type: "text"}
		expect(normalizeLayoutKey(inline)).toEqual({key: "foo", span: 0, inlineKey: inline})
	})

	test("forme objet sans key : key vide, objet conservé", () => {
		const inline = {display: "X", type: "math"} as unknown as { key: string, display: string, type: string }
		expect(normalizeLayoutKey(inline)).toEqual({key: "", span: 0, inlineKey: inline})
	})
})
