import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {Fraction, NumExp} from "pimath"
import {CheckerResult, CHECKERS} from "../checker.config"
import {normalizeExpression} from "@/Checkers/normalizeExpression"

// const name = "exact"
const description = `exact

**paramètres**
soft = valeur numérique juste, mais pas sous la forme attendue
`

/**
 * Compare deux séquences RPN token à token. Deux expressions ont la même
 * structure mathématique lorsque leur RPN est identique — la RPN ne contient
 * aucune parenthèse, donc les parenthèses redondantes n'influent pas.
 *
 * Le type `NumExp["rpn"]` (soit `Token[]`) évite d'importer `Token` séparément.
 */
function rpnEquals(a: NumExp["rpn"], b: NumExp["rpn"]): boolean {
	return a.length === b.length
		&& a.every((token, index) => token.token === b[index].token && token.tokenType === b[index].tokenType)
}

export class ExactChecker extends CheckerAbstract {
	readonly format = "réponse sous forme exacte, réduite"
	#isSoft: boolean

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.EXACT
		this.description = description

		this.#isSoft = this.config.includes("soft")
	}

	override checkValue(value: string): CheckerResult {
		// Le résultat est exactement ce qui est demandé
		const stringAnswer = value.toString()
		const asciiAnswer = stringAnswer.startsWith("#")
			? stringAnswer.substring(1)
			: stringAnswer

		// Normalisation canonique (partagée avec les autres checkers) avant évaluation.
		const expectedExpression = normalizeExpression(this.answer)
		const givenExpression = normalizeExpression(asciiAnswer)

		// Maybe with the reformating, the answers is exactly the same.
		if (expectedExpression === givenExpression) {
			return makeCheckerResult()
		}

		// Parse une expression en NumExp. Renvoie null (au lieu de lever) si l'entrée
		// est malformée : le constructeur NumExp peut lancer sur une entrée invalide.
		const toNumExp = (expression: string): NumExp | null => {
			try {
				return new NumExp(expression)
			} catch {
				return null
			}
		}

		const givenExp = toNumExp(givenExpression)
		if (givenExp === null) {
			return makeCheckerResult("La réponse n'est pas une valeur exacte reconnue.")
		}

		const expectedExp = toNumExp(expectedExpression)
		if (expectedExp === null) {
			return makeCheckerResult("La réponse attendue n'est pas une valeur exacte reconnue.")
		}

		// Comparaison structurelle via la RPN (notation polonaise inverse). La RPN
		// n'a pas de parenthèses et absorbe les multiplications implicites : deux
		// écritures de même structure — (3sqrt(5))/7 et 3sqrt5/7 — y sont identiques.
		// C'est plus strict que l'égalité numérique (5*3 ≠ 3*5), donc la « forme »
		// reste distinguée, mais insensible au bruit syntaxique redondant.
		if (rpnEquals(expectedExp.rpn, givenExp.rpn)) {
			return makeCheckerResult()
		}

		// Évalue une expression en valeur numérique, ou null si elle référence des
		// variables non fournies (isValid() renvoie false) ou n'est pas évaluable.
		const toNumber = (exp: NumExp): number | null => {
			return exp.isValid() ? exp.evaluate() : null
		}

		const givenValue = toNumber(givenExp)
		if (givenValue === null) {
			return makeCheckerResult("La réponse n'est pas une valeur exacte reconnue.")
		}

		const expectedValue = toNumber(expectedExp)
		if (expectedValue === null) {
			return makeCheckerResult("La réponse attendue n'est pas une valeur exacte reconnue.")
		}

		if (givenValue.toFixed(10) === expectedValue.toFixed(10)) {
			if (this.#isSoft) {
				// Si les deux nombres sont les mêmes valeurs...
				return makeCheckerResult()
			}

			// On a la bonne réponse, mais pas sous la forme attendue.
			const message: string[] = [
				"La réponse donnée est juste, mais pas sous la forme attendue.",
			]

			// Contrôle si c'est une fraction.
			if (Fraction.isFraction(this.answer) && Fraction.isFraction(value)) {
				const F = new Fraction(value)
				if (!F.isReduced()) {
					message.push('Il faut réduire la fraction.')
				}
			}

			const [, den] = value.split('/')
			if (den !== undefined && den.includes('sqrt')) {
				message.push("Il y a encore une racine au dénominateur")
			}

			return makeCheckerResult(message, 0.3)
		}

		return makeCheckerResult("La réponse donnée n'est pas juste.")
	}

}
