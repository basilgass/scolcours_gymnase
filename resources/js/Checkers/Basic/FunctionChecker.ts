import {CheckerAbstract, CheckerResult, CHECKERS, PolynomChecker} from "@/Checkers"

// const name = "function"
const description = `function|fn,[paramètres]

**paramètres**
- d=développé
`

// TODO : contrôler que cela fonctionne bien d'étendre PolynomChecker
//  et de juste changer le message.

export class FunctionChecker extends CheckerAbstract {
	private developed: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.FUNCTION
		this.description = description

		this.developed = (this.config.includes("d") || this.config.includes("developed") || this.config.includes("dev"))

		this.secondaryChecker = new PolynomChecker(this.config)
	}

	get format(): string {
		const opts = []

		if (this.developed) {
			opts.push("développée réduite")
		}

		return `fonction ${opts.join(", ")}`
	}

	override checkValue(value: string): CheckerResult {
		const check = this.secondaryChecker.check(value, this.answer)

		if (check.result) return check

		check.message = check.message.replace('le polynôme', 'la fonction')

		/**const A = new Polynom(value),
			Q = new Polynom(this.answer)

		// Must be the same equation.
		if (!A.isEqual(Q)) {
			return makeCheckerResult("la fonction n'est pas juste.")
		}

		if (this.developed) {
			// La fonction ne doit pas avoir de parenthèses.
			if (value.includes('(') || value.includes(')')) {
				return makeCheckerResult("la fonction doit être développée (pas de parenthèses)")
			}

			if (A.monoms.length !== Q.monoms.length) {
				return makeCheckerResult("la fonction doit être réduite.")
			}
		}

		return makeCheckerResult()*/
	}

}
