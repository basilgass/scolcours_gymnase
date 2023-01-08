export function StringChecker(options) {
	return {
		format: () => {
			if (isNaN(options[0])) {
				return "réponse numérique"
			} else {
				return `réponse avec ${options[0]} chiffre(s) après la virgule`
			}
		},
		check: (expectedAnswer, answer, options = []) => {
			if (typeof answer !== "string") {
				answer = answer.toString()
			}
			if (typeof expectedAnswer !== "string") {
				expectedAnswer = expectedAnswer.toString()
			}

			return {
				result: expectedAnswer === answer.toString(),
				message: ""
			}
		}
	}

}
