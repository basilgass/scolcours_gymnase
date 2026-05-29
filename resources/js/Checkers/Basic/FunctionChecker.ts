import {CheckerAbstract, CheckerResult, CHECKERS, PolynomChecker} from "@/Checkers"

// const name = "function"
const description = `function|fn,[paramètres]

**paramètres**
- d=développé
`

export class FunctionChecker extends CheckerAbstract {
	#developed: boolean

	constructor(config: string[] | string) {
		super(config)

		this.type = CHECKERS.FUNCTION
		this.description = description

		this.#developed = (this.config.includes("d") || this.config.includes("developed") || this.config.includes("dev"))

		// Load the polynom checker AFTER
		this.secondaryChecker = new PolynomChecker(this.config)
	}

	get format(): string {
		const opts = []

		if (this.#developed) {
			opts.push("développée réduite")
		}

		return `fonction ${opts.join(", ")}`
	}

	override checkValue(value: string): CheckerResult {
		// on utilise le checker du polynome et on transforme juste le texte
		const check = this.secondaryChecker.check(value, this.answer)

		if (check.result) return check

		check.message = check.message.replace('le polynôme', 'la fonction')

		return check
	}

}
