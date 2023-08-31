const name = "type"
const description = "type"
export function TypeChecker(options){
	options = options ?? []

	return {
		name, description,
		format: () => {
			return "réponse sous forme ?"
		},
		check: (expectedAnswer, answer = []) => {
			if (answer === expectedAnswer) {
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
