const name = "order"
const description = `order,[paramètres]

**paramètres**
aucun
`
export function OrderChecker(options){
	options = options ?? []

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
