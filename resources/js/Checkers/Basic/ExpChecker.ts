import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {splitAtSigns, splitIfOutsideParentheses, stripParenthesis} from "../checkerHelperFunctions.ts"
import {normalizeExpression} from "@/Checkers/normalizeExpression"
import {NumExp} from "piexpression"

const description = `exp,[paramètres]

**paramètres**
aucun
`

/** Valeurs de x pour l'évaluation numérique (petite amplitude, non entières). */
const NUM_SAMPLES = [0, 0.5, -0.5, 1, -1, 1.5, -1.5, 2]
/** Nombre de points concordants requis pour conclure à l'égalité. */
const MIN_AGREEMENTS = 5

export interface ExpTerm {
	coefficient: string
	exponent: string | null
	denominator: string | null
	hasExp: boolean
}

/**
 * Décompose un terme signé `(p1)e^(p2)/(p3)` en ses composantes. `hasExp`
 * indique la présence d'une exponentielle au numérateur (à profondeur 0).
 */
export function parseExpTerm(term: string): ExpTerm {
	const parts = splitIfOutsideParentheses(term, "/")
	const left = parts[0]
	const denominator = parts.length > 1 ? parts.slice(1).join("/") : null

	const eIndex = findExpIndex(left)
	if (eIndex === -1) {
		return {coefficient: left, exponent: null, denominator, hasExp: false}
	}

	return {
		coefficient: left.substring(0, eIndex),
		exponent: stripParenthesis(left.substring(eIndex + 2)),
		denominator,
		hasExp: true,
	}
}

/** Index du premier `e^` à profondeur de parenthèses nulle, ou -1. */
function findExpIndex(value: string): number {
	let depth = 0
	for (let i = 0; i < value.length - 1; i++) {
		const c = value[i]
		if (c === "(") depth++
		else if (c === ")") depth--
		else if (c === "e" && value[i + 1] === "^" && depth === 0) return i
	}
	return -1
}

type EquivResult = "equal" | "different" | "unverifiable"

/**
 * Compare deux expressions par évaluation numérique sur {@link NUM_SAMPLES}.
 * Écarte les points hors domaine (NaN/Infinity), applique une tolérance
 * relative, et exige {@link MIN_AGREEMENTS} concordances.
 */
function numericEquivalence(given: string, expected: string): EquivResult {
	let a: NumExp
	let g: NumExp
	try {
		a = new NumExp(expected)
		g = new NumExp(given)
	} catch {
		return "unverifiable"
	}

	let agreements = 0
	for (const x of NUM_SAMPLES) {
		let av: number
		let gv: number
		try {
			av = a.evaluate({x})
			gv = g.evaluate({x})
		} catch {
			return "unverifiable"
		}
		if (!isFinite(av) || !isFinite(gv)) continue
		if (Math.abs(av - gv) > 1e-6 * (1 + Math.abs(av))) return "different"
		agreements++
	}

	return agreements >= MIN_AGREEMENTS ? "equal" : "unverifiable"
}

/**
 * F1 : détecte un exposant NON parenthésé suivi d'une puissance `^`
 * (ex. `e^x^2`), signe d'un oubli de parenthèses. Ne se déclenche jamais sur
 * une somme de termes légitime (`e^x + xe^x`).
 */
function hasUnparenthesizedExponentPower(value: string): boolean {
	let depth = 0
	for (let i = 0; i < value.length - 1; i++) {
		const c = value[i]
		if (c === "(") {
			depth++
			continue
		}
		if (c === ")") {
			depth--
			continue
		}
		if (c === "e" && value[i + 1] === "^" && depth === 0) {
			if (value[i + 2] === "(") {
				continue
			}
			let j = i + 2
			while (j < value.length && /[A-Za-z0-9.]/.test(value[j])) {
				j++
			}
			if (value[j] === "^") {
				return true
			}
		}
	}
	return false
}

/**
 * F2 : un terme est une fraction simplifiable ssi son numérateur ET son
 * dénominateur (dé-parenthésé, terme unique) contiennent chacun une
 * exponentielle à profondeur 0 (annulation `e^a / e^b = e^(a-b)`).
 */
function isSimplifiableFraction(term: string): boolean {
	const parsed = parseExpTerm(term)
	if (parsed.denominator === null || !parsed.hasExp) {
		return false
	}
	const denom = stripParenthesis(parsed.denominator)
	if (splitAtSigns(denom).length !== 1) {
		return false
	}
	return parseExpTerm(denom).hasExp
}

export class ExpChecker extends CheckerAbstract {
	readonly format = "polynôme × exponentielle <br/>\\((3x+5)e^{x^2-5x}\\)"

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.EXPONENTIAL
		this.description = description
	}

	override checkFormat(value: string): string {
		try {
			const expression = new NumExp(normalizeExpression(value))
			if (!expression.isValid) {
				return "L'expression n'est pas reconnue."
			}
		} catch {
			return "L'expression n'est pas reconnue."
		}

		if (hasUnparenthesizedExponentPower(value)) {
			return "Placez des parenthèses autour de l'exposant (ex : e^(x^2-5x))."
		}

		for (const term of splitAtSigns(value)) {
			if (isSimplifiableFraction(term)) {
				return "Les exponentielles peuvent être simplifiées."
			}
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {
		const given = normalizeExpression(value)
		const expected = normalizeExpression(this.answer)

		if (given === expected) return makeCheckerResult()

		switch (numericEquivalence(given, expected)) {
			case "equal":
				return makeCheckerResult()
			case "different":
				return makeCheckerResult("La réponse n'est pas équivalente.")
			default:
				return makeCheckerResult("Impossible de vérifier la réponse.")
		}
	}
}
