export function ExactChecker(options){
	return {
		format: () => {
			return "réponse sous forme exacte, réduite"
		},
		check: (expectedAnswer, answer = []) => {
			// Le résultat est exactement ce qui est demandé
			if (answer.toString() === expectedAnswer.toString()) {
				return {
					result: true,
					message: ""
				}
			} else {
				return {
					result: false,
					message: ""
				}
			}
		}
	}

}
