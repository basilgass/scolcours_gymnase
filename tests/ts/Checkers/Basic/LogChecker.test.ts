import {describe, expect, test} from "vitest"
import {LogChecker} from "@/Checkers/Basic/LogChecker.ts"

describe("LogChecker - gestion des fractions", () => {
	const checker = new LogChecker()
	checker.answer = "5/2" // réponse attendue pour les tests

	test("fraction à l'intérieur du log", () => {
		const result = checker.checkFormat("log(3/4)")
		expect(result).toBe("") // pas d'erreur attendue
	})

	test("fraction à l'extérieur du log", () => {
		const result = checker.checkFormat("log(5)-3/4")
		expect(result).toBe("") // une seule barre de fraction hors du log
	})

	test("plus d'une barre de fraction hors du log", () => {
		const result = checker.checkFormat("log(5)-3/4/2")
		expect(result).toBe("La réponse ne peut contenir qu'une seule barre de fraction hors du log.")
	})

	test("une barre de fraction hors du log, une à l'intérieur", () => {
		const result = checker.checkFormat("log(5/2)-3/4")
		expect(result).toBe("")
	})

	test("point dans la réponse", () => {
		const result = checker.checkFormat("log(5.2)-3/4")
		expect(result).toBe("La réponse n'est pas sous forme exact (nombres entiers)")
	})

	test("valeur correcte", () => {
		const result = checker.checkValue("10/4")
		expect(result.result).toBe(true) // 10/4 == 5/2
	})

	test("valeur incorrecte", () => {
		const result = checker.checkValue("7/2")
		expect(result.message).toBe("La réponse sous forme exacte ne donne pas la bonne valeur.")
	})
})
