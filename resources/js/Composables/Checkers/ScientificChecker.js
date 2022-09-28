import {NumberChecker} from "@/Composables/Checkers/NumberChecker"

export function ScientificChecker(options) {

	return {
		format: () => {
			if (isNaN(options[0])) {
				return "réponse en notation scientifique"
			} else {
				return `réponse en notation scientifique à ${options[0]} chiffre(s) significatif(s)`
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

			// On vérifie que le format est bien de type scientifique.
			const PS = +answer.split("*")[0],
				OG = answer.split("10^")[1] || 0,
				ePS = +expectedAnswer.split("*")[0],
				eOG = expectedAnswer.split("10^")[1] || 0
			if (!answer.includes("*10^")) {
				return {
					result: false,
					message: "le format de réponse n'est pas une notation scientifique."
				}
			}

			// On vérifie la partie significative
			if (PS < 1 || PS >= 10) {
				return {
					result: false,
					message: "la partie significative n'est pas entre 1 et 10 (non compris)"
				}
			}

			if (PS !== ePS) {
				return {
					result: false,
					message: new NumberChecker(options).check(ePS, PS).message
				}
			}


			// On vérifie l'ordre de grandeur.
			if (OG !== eOG) {
				return {
					result: false,
					message: "l'ordre de grandeur n'est pas juste.."
				}
			}


			// Il n'y a pas d'option -> le résultat ne peut pas être validé.
			if (options.length === 0) {
				return {
					result: false,
					message: ""
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

			// Le dernier chiffre n'est pas juste - il s'agit peut être d'un problème d'arrondi ?
			if (crtDecimales[crtDecimales.length - 1] - expectedAnswer.toString()[expectedAnswer.toString().length - 1] === 1) {
				return {
					result: false,
					message: "Peut être un problème d'arrondi ?"
				}
			}
		}

	}

}
