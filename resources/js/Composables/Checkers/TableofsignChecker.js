export function TableofsignChecker(options) {

	return {
		format: () => "tableau de signes",
		check: (expectedAnswer, answer = []) => {
			//TODO: TOS checker
			if (expectedAnswer !== answer) {
				const zeroes = {
						expected: expectedAnswer.split("@")[0],
						provided: answer.split("@")[0]
					},
					signs = {
						expected: expectedAnswer.split("@")[1],
						provided: answer.split("@")[1] | ""
					}

				if (zeroes.expected !== zeroes.provided) {
					//TODO: compare each zeroes...
					return {
						result: false,
						message: "les zéros ne sont pas justes"
					}
				}

				if (signs.expected !== signs.provided) {
					return {
						result: false,
						message: "les signes ne sont pas justes"
					}
				}


				return {
					result: false,
					message: "Il y a une erreur dans le tableau de signes."
				}
			}

			return {
				result: true,
				message: ""
			}
		}
	}
}
