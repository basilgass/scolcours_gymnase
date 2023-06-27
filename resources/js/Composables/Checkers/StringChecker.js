export function StringChecker(options) {
	return {
		name: "string",
		format: () => {
			return "réponse textuelle"
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
