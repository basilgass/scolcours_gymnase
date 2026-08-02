import {describe, expect, test} from "vitest"
import {ExpChecker, parseExpTerm} from "@/Checkers/Basic/ExpChecker.ts"

describe("parseExpTerm", () => {
	test("terme polynomial pur (sans exponentielle)", () => {
		expect(parseExpTerm("2x")).toEqual({
			coefficient: "2x", exponent: null, denominator: null, hasExp: false,
		})
	})

	test("coefficient parenthésé et exposant parenthésé", () => {
		expect(parseExpTerm("(3x+5)e^(x^2-5x)")).toEqual({
			coefficient: "(3x+5)", exponent: "x^2-5x", denominator: null, hasExp: true,
		})
	})

	test("exponentielle nue sans coefficient", () => {
		expect(parseExpTerm("e^x")).toEqual({
			coefficient: "", exponent: "x", denominator: null, hasExp: true,
		})
	})

	test("coefficient négatif", () => {
		expect(parseExpTerm("-3e^(2x)")).toEqual({
			coefficient: "-3", exponent: "2x", denominator: null, hasExp: true,
		})
	})

	test("fraction : numérateur sans exp, dénominateur avec exp", () => {
		expect(parseExpTerm("(3x+5)/((2x-5)e^(x^2-5x))")).toEqual({
			coefficient: "(3x+5)", exponent: null,
			denominator: "((2x-5)e^(x^2-5x))", hasExp: false,
		})
	})

	test("fraction : numérateur avec exp", () => {
		expect(parseExpTerm("e^x/((x)e^(2x))")).toEqual({
			coefficient: "", exponent: "x",
			denominator: "((x)e^(2x))", hasExp: true,
		})
	})
})

describe("ExpChecker - équivalence de valeur", () => {
	const checker = new ExpChecker()

	test("distribution : (3x+5)e^x ≡ 3xe^x+5e^x", () => {
		expect(checker.check("3xe^x+5e^x", "(3x+5)e^x").result).toBe(true)
	})

	test("réordonnancement des termes", () => {
		expect(checker.check("e^(2x)+e^x", "e^x+e^(2x)").result).toBe(true)
	})

	test("dérivée équivalente (forme réarrangée)", () => {
		const given = "((3x+5)(2x-5)+3)e^(x^2-5x)"
		const answer = "(3+(3x+5)(2x-5))e^(x^2-5x)"
		expect(checker.check(given, answer).result).toBe(true)
	})

	test("dénominateur réordonné (exp au dénominateur, numérateur sans exp)", () => {
		const given = "(3x+5)/(e^(x^2-5x)(2x-5))"
		const answer = "(3x+5)/((2x-5)e^(x^2-5x))"
		expect(checker.check(given, answer).result).toBe(true)
	})

	test("réponse fausse", () => {
		const result = checker.check("(3x+4)e^x", "(3x+5)e^x")
		expect(result.result).toBe(false)
		expect(result.message).toBe("La réponse n'est pas équivalente.")
	})
})

describe("ExpChecker - garde-fous de forme (checkFormat)", () => {
	const checker = new ExpChecker()

	test("expression non reconnue", () => {
		expect(checker.checkFormat("x)(")).toBe("L'expression n'est pas reconnue.")
	})

	test("F1 : exposant non parenthésé contenant une puissance", () => {
		expect(checker.checkFormat("3e^x^2-5x"))
			.toBe("Placez des parenthèses autour de l'exposant (ex : e^(x^2-5x)).")
	})

	test("F1 ne se déclenche pas sur une somme de termes légitime", () => {
		expect(checker.checkFormat("e^x+xe^x")).toBe("")
	})

	test("F2 : fraction e^a/e^b simplifiable", () => {
		expect(checker.checkFormat("e^x/(2e^(2x))"))
			.toBe("Les exponentielles peuvent être simplifiées.")
	})

	test("F2 ne se déclenche pas si le numérateur n'a pas d'exp", () => {
		expect(checker.checkFormat("(3x+5)/((2x-5)e^(x^2-5x))")).toBe("")
	})

	test("F2 ne se déclenche pas si le dénominateur est une puissance de somme", () => {
		expect(checker.checkFormat("x/((e^x+1)^2)")).toBe("")
	})
})
