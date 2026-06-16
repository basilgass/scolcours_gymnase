import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {Fraction} from "pimath"

// const name = "fraction"

const description = `fraction,[paramètres]

**paramètres**
- r=réduit
`

export class FractionChecker extends CheckerAbstract {
	#reduced: boolean

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.FRACTION
		this.description = description

		this.#reduced = this.config.includes("r") || this.config.includes("reduced")
	}

	get format(): string {
		const opts = []
		if (this.#reduced) {
			opts.push("réduite")
		}

		return opts.length
			? `réponse sous forme de fraction ${opts.join(", ")}`
			: "réponse sous forme de fraction"
	}

	override checkFormat(values: string): string {
		const fractions: string[] = values.split('=')

		for (let value of fractions) {
			if (value === '' || value === '-') {
				return "merci de donner une fraction..."
			}

			const [num, den] = value.split('/')
			if (isNaN(+num)) {
				return "Le numérateur n'est pas un nombre."
			}

			if (den === undefined) return ""

			if (den.startsWith('-')) {
				return "Le dénominateur doit être positif."
			}

			if (isNaN(+den)) {
				return "Le dénominateur n'est pas un nombre."
			}

			if (+den === 0) {
				return "Le dénominateur ne peut pas être zéro."
			}

			if (!Fraction.isFraction(value)) {
				return "La fraction n'est pas formatée correctement."
			}
		}

		return ""
	}

	override checkValue(values: string): CheckerResult {
		// On ne prend en compte que la dernière fraction
		const fractions = values.split('=')

		// Toutes les fractions doivent être similaires.
		if (fractions.length > 1) {
			const fracs: Fraction[] = fractions.map(f => new Fraction(f))
			const first = fracs.shift()
			for (let f of fracs) {
				if (!f.isEqual(first)) {
					return makeCheckerResult(`\\(\\displaystyle${first.tex}\\) et \\(\\displaystyle ${f.tex}\\) ne sont pas équivalents`)
				}
			}
		}

		const value = fractions[fractions.length - 1]

		// On contrôle la valeur finale.
		const FGiven = new Fraction(value)
		const FExpected = new Fraction(this.answer)

		if (FGiven.isNotEqual(FExpected)) {
			return makeCheckerResult("La réponse donnée n'est pas juste.")
		}

		if (!FGiven.isReduced() && this.#reduced) {
			return makeCheckerResult("La fraction n'est pas réduite.", 0.5)
		}

		const [, den] = value.split('/')
		if (den !== undefined && +den === 1) {
			return makeCheckerResult("Une fraction avec `1` au dénominateur peut être simplifiée.", 0.9)
		}

		return makeCheckerResult()
	}


}
