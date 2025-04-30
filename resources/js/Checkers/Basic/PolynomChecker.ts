import {CheckerAbstract} from "../CheckerAbstract";
import {Polynom} from "pimath";
import {CHECKERS} from "../checker.config";

const name = "polynom"
const description = `polynom,[paramètres]

**paramètres**
- f=factorisé
- F=entièrement factorisé \\((2x+4)(x-3)\\) ne passe pas.
- d=développé
- s=forme du sommet \\(a(x-b)^2+c\\)
`
export class PolynomChecker extends CheckerAbstract {
	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.POLYNOMIAL
		this.description = description
	}

	get format(): string {
		const opts = []

		if (this.config.includes("f") || this.config.includes("factors")) {
			opts.push("factorisé")
		} else if (
			this.config.includes("F") ||
			this.config.includes("FACTORS")
		) {
			opts.push("entièrement factorisé")
		} else if (
			this.config.includes("d") ||
			this.config.includes("develop")
		) {
			opts.push("développé")
		}

		return `polynôme ${opts.join(", ")}`
	}

	override checkFormat(value: string): string {
		try {
			new Polynom(value)
			return ""
		} catch{
			return "Le polynôme n'est pas formé correctement."
		}
	}

	override checkValue(value: string): string {
		// Make sur the polynom is constructable
		const A = new Polynom(value)
		const Q = new Polynom(this.answer)

		// Polynom must be equals.
		if (!Q.isEqual(A)) {
			return "Le polynôme n'est pas le même."
		}

		/** Polynom checker config */
		// Factorized
		if (
			this.config.includes("f") ||
			this.config.includes("factor") ||
			this.config.includes("F") ||
			this.config.includes("FACTORS")
		) {
			try {
				// TODO: Check if the polynom is fully factorized
				// if (
				// 	!A.isFactorized(
				// 		value,
				// 		this.config.includes("f") ||
				// 		this.config.includes("factor"),
				// 	)
				// ) {
				// 	return "Le polynôme n'est pas (entièrement) factorisé."
				// }
				return ""
			} catch {
				return "Le polynôme n'est pas (entièrement) factorisé."
			}
		}

		// Developed
		if (this.config.includes("d") || this.config.includes("develop")) {
			if (!A.isDeveloped(value)) {
				return "Le polynôme n'est pas (entièrement) développé."
			}
		}

		// Forme du sommet
		if (this.config.includes("s") || this.config.includes("sommet")) {
			if (
				value.match(
					/(-?[\d]+(\/\d+)?)?\(x([+-](\d+(\/\d+)?)?)?\)\^2([+-]\d+(\/\d+)?)?/,
				) ||
				value.match(/(-?[\d]+(\/\d+)?)?x\^2([+-]\d+(\/\d+)?)?/)
			) {
				return ""
			} else {
				return "L'équation n'est pas dans le bon format."
			}
		}

		// If all tests passes, it is correct !
		return ""

	}

}
