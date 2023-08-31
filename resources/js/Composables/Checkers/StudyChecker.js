const name = "study"
const description = `study

**paramètres**
aucun
`

export function StudyChecker(options) {
	options = options ?? []

	return {
		name, description,
		format: () => {
			return ""
		},
		check: (expectedAnswer, answer = []) => {
			const arrayAnswer = answer.split(",").sort(),
				arrayExpected = expectedAnswer.split(",").sort(),
				d = arrayExpected.length - arrayAnswer.length

			if (d > 0) {
				return {
					result: false,
					message: `il manque ${d} élément${d > 1 ? "s" : ""}`
				}
			} else if (d < 0) {
				return {
					result: false,
					message: `il y a ${-d} élément${-d > 1 ? "s" : ""} en trop`
				}
			}

			let erreurs = [],
				traceErrors = []
			for (let i = 0; i <= arrayAnswer.length; i++) {
				if (arrayAnswer[i] !== arrayExpected[i]) {

					if (arrayExpected[i].split("&")[0] === arrayAnswer[i].split("&")[0]) {
						traceErrors.push(i + 1)
					} else {
						erreurs.push(i + 1)
					}
				}
			}

			if (erreurs.length > 0) {
				return {
					result: false,
					message: `il y a ${erreurs.length} erreur${erreurs.length > 1 ? "s" : ""}`
				}
			}

			if (traceErrors.length > 0) {
				return {
					result: false,
					message: `il y a ${traceErrors.length} erreur${traceErrors.length > 1 ? "s" : ""} dans le tracé`
				}
			}

			return {
				result: true,
				message: ""
			}
		}
	}

}
