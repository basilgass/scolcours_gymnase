import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import  PiMath from "pimath"

const name = "log"
const description = `log,[paramètres]

**paramètres**
`

export class LogChecker extends CheckerAbstract {
	constructor(config?: string[] | string) {
		super(config)
		this.name = name
		this.description = description
	}

	get format(): string {
		return "réponse sous la forme \\(\\log(a)-3/5\\)"
	}

	check(expected: string, given: string): { result: boolean; message: string } {
		{
			// Le résultat est exactement ce qui est demandé
			const stringAnswer = given.toString(),
				asciiAnswer = stringAnswer.startsWith("#") ? stringAnswer.substring(1) : stringAnswer

			if (asciiAnswer === expected.toString()) {
				return {
					result: true,
					message: ""
				}
			}

			// Il ne peut pas y avoir de point.
			if (asciiAnswer.includes(".")) {
				return {
					result: false,
					message: "La réponse n'est pas sous forme exact (nombres entiers)"
				}
			}

			// Il ne doit y avoir qu'une fraction.
			const ND: string[] = asciiAnswer.split("/")
			if (ND.length > 2) {
				// TODO: on devrait autoriser les fractions dans le log - ne pas les compter si c'est entre deux parenthèses...

				return {
					result: false,
					message: "La réponse ne peut contenir qu'une seule barre de fraction."
				}
			}

			let userN, userD
			try {
				userN = new PiMath.NumExp(ND[0]).evaluate()
			} catch {
				return {
					result: false,
					message: `${ND.length === 1 ? "La réponse" : "Le numérateur"} n'est pas correctement formé.`
				}
			}
			if (ND.length === 2) {
				try {
					userD = new PiMath.NumExp(ND[1]).evaluate()
				} catch {
					return {
						result: false,
						message: "Le dénominateur n'est pas correctement formé."
					}
				}
			} else {
				userD = 1
			}


			const [expN, expD] = expected.split("/")
			let expNValue: number, expDValue: number
			try {
				expNValue = new PiMath.NumExp(expN).evaluate()
			} catch {
				// Do nothing
			}
			if (expD === undefined) {
				expDValue = 1
			} else {
				try {
					expDValue = new PiMath.NumExp(expD).evaluate()
				} catch {
					// Do nothing
				}
			}


			const answerDecimal = userN / userD,
				expectedDecimal = expNValue / expDValue

			if (answerDecimal.toFixed(8) !== expectedDecimal.toFixed(8)) {
				return {
					result: false,
					message: "La répnse sous forme exacte ne donne pas la bonne valeur."
				}
			}

			return {
				result: true,
				message: ""
			}
		}

	}

}


