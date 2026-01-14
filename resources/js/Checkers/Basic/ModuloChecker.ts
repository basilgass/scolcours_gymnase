import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"

// const name = "number"
const description = `mod,[paramètres]

**paramètres**
- +: le plus petit nombre positif possible
`

export class ModuloChecker extends CheckerAbstract {
	#minPos: boolean

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.MODULO
		this.description = description

		this.#minPos = this.config.includes('+')
	}

	get format(): string {
		return this.#minPos
			? "réponse sous forme de congruence modulo, avec une valeur positive la plus petite possible."
			: "réponse sous forme de congruence modulo"
	}

	override checkFormat(value: string): string {
		if (!value.includes('mod')) {
			return "une congruence a forcément le signe \\(\\mod{}\\)"
		}

		const [a, n] = value.split('mod')
		if (a === '') {
			return "il faut donner un nombre avant le modulo"
		}
		if (n === undefined) {
			return "il faut donner le modulo !"
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {
		const [givenA, givenN] = value.split('mod').map(Number)
		const [expectedA, expectedN] = this.answer.split('mod').map(Number)

		// le modulo n'est pas just
		if (givenN !== expectedN) {
			return makeCheckerResult("le modulo n'est pas correct.", 0.3)
		}

		// On vérifie que la réponse donnée est une bonne congruence.
		if ((expectedA - givenA) % givenN !== 0) {
			return makeCheckerResult("la valeur n'est pas correcte.", 0)
		}


		// Dans le cas où l'on veut le plus petit positif possible
		if (this.#minPos) {
			if (givenA < 0) {
				return makeCheckerResult("la valeur doit être positive", 0.3)
			}

			if (givenA % givenN !== givenA) {
				return makeCheckerResult("la valeur n'est pas le plus petit possible", 0.4)
			}
		}

		return makeCheckerResult()
	}
}
