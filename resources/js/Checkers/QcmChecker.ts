const name = "qcm"
const description = "qcm,[paramètres]"

export function QcmChecker(options){
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
