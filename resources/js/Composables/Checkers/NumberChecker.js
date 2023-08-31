
const name = "number",
	description = `number|nb,[paramètres]

**paramètres**
- [1,2,3,4,...]: nombre de chiffres après la virgule
- s: significatif (donc 2.3 ne passe pas pour 2.30)
`

export function NumberChecker(options){
	options = options ?? []

	// TODO: ajouter le significatif
	return {
		name, description,
		format: () => {
			if (isNaN(options[0])) {
				return "réponse numérique"
			} else {
				return `réponse avec ${options[0]} chiffre(s) après la virgule`
			}
		},
		check: (expectedAnswer, answer = []) => {
			// Le résultat est exactement ce qui est demandé
			if (answer.toString() === expectedAnswer.toString()) {
				return {
					result: true,
					message: ""
				}
			}

			// Il n'y a pas d'option -> le résultat ne peut pas être validé.
			if (options.length === 0) {
				return {
					result: false,
					message: "ce n'est pas la bonne réponse"
				}
			}

			// Nombre de décimales souhaitées
			const nbDecimales = +options[0]
			// Nomber de décimale de la réponse
			let crtDecimales = answer.toString().split(".")

			// Le nombre de chiffres après la virgule n'est pas juste
			if (crtDecimales.length === 1 || crtDecimales[1].length !== nbDecimales) {
				return {
					result: false,
					message: `Il faut ${nbDecimales} chiffre(s) après la virgule.`
				}
			}
			crtDecimales = crtDecimales[1]

			// Le dernier chiffre n'est pas juste - il s'agit peut être d'un problème d'arrondi ?
			if (crtDecimales[crtDecimales.length - 1] - expectedAnswer.toString()[expectedAnswer.toString().length - 1] === 1) {
				return {
					result: false,
					message: "Peut être un problème d'arrondi ?"
				}
			}

			return {
				result: false,
				message: ""
			}
		}
	}

}
