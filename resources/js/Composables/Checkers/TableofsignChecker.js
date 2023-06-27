import {ExactChecker} from "@/Composables/Checkers/ExactChecker"

export function TableofsignChecker(options) {

	return {
		name: "table of signs",
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
						provided: answer.split("@")[1] ?? ""
					},
					grows = {
						expected: expectedAnswer.split("@")[2] ?? "",
						provided: answer.split("@")[2] ?? ""
					},
					coords = {
						expected: expectedAnswer.split("@")[3] ?? "",
						provided: answer.split("@")[3] ?? ""
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

				if(grows.expected!== grows.provided){
					return {
						result: false,
						message: "la croissance n'est pas juste"
					}
				}

				// Check the coordinates
				if(coords.expected.length>0){
					let expectedCoordinates = coords.expected.split(","),
						providedCoordinates = coords.provided.split(",")

					if(expectedCoordinates.length!==providedCoordinates.lenght){
						return {
							result: false,
							message: "toutes les valeurs des extrêmes n'ont pas été données..."
						}
					}

					let eChecker = ExactChecker(options)
					for(let i=0; i<expectedCoordinates.length; i++){
						let check = eChecker.check(expectedCoordinates[i], providedCoordinates[i])

						if(!check.result){
							return {
								result: false,
								message: `il y a une erreur avec ${i===0?"la 1ère":"la "+(i+1)+"ème"} coordonnée`
							}
						}
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
