
const name="exact"
const description = "exact"
export function ExactChecker(options){
	options = options??[]
	return {
		name, description,
		format: () => {
			return "réponse sous forme exacte, réduite"
		},
		check: (expectedAnswer, answer = []) => {
			// Le résultat est exactement ce qui est demandé
			const stringAnswer = answer.toString(),
				asciiAnswer = stringAnswer.startsWith("#")?stringAnswer.substring(1):stringAnswer

			if (asciiAnswer === expectedAnswer.toString()) {
				return {
					result: true,
					message: ""
				}
			} else {
				return {
					result: false,
					message: "La réponse donnée n'est pas juste."
				}
			}
		}
	}

}
