const name = "input"
const description = `input,[paramètres]

**paramètres**
- checker
`

export function InputChecker(options){
	options = options??[]

	return {
		name, description,
		format: () => {
			return null
		},
		check: (expectedAnswer, answer = []) => {
			return null
		}
	}

}
