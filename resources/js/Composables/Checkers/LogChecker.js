import {NumExp} from "pimath/esm/maths/numexp"

const name = "log"
const description = `log,[paramètres]

**paramètres**
`
export function LogChecker(options) {
	options = options ?? []

	return {
		name, description,
		format: () => {
			return "réponse sous forme exacte, réduite"
		},
		check: (expectedAnswer, answer = []) => {
			// Le résultat est exactement ce qui est demandé
			const stringAnswer = answer.toString(),
				asciiAnswer = stringAnswer.startsWith("#") ? stringAnswer.substring(1) : stringAnswer

			if (asciiAnswer === expectedAnswer.toString()) {
				return {
					result: true,
					message: ""
				}
			}

			// Il ne peut pas y avoir de point.
			if(asciiAnswer.includes(".")){
				return{
					result: false,
					message: "La réponse n'est pas sous forme exact (nombres entiers)"
				}
			}

			// Il ne doit y avoir qu'une fraction.
			let ND = asciiAnswer.split("/")
			if(ND.length>2){
				// TODO: on devrait autoriser les fractions dans le log - ne pas les compter si c'est entre deux parenthèses...

				return {
					result: false,
					message: "La réponse ne peut contenir qu'une seule barre de fraction."
				}
			}

			let userN, userD, expN, expD
			try{
				userN = new NumExp(ND[0]).evaluate()
			}catch{
				return {
					result: false,
					message: `${ND.length===1?"La réponse":"Le numérateur"} n'est pas correctement formé.`
				}
			}

			if(ND.length===2) {
				try {
					userD = new NumExp(ND[1]).evaluate()
				} catch {
					return {
						result: false,
						message: "Le dénominateur n'est pas correctement formé."
					}
				}
			}else{
				ND = 1
			}

			[expN, expD] = expectedAnswer.split("/")
			try{
				expN = new NumExp(expN).evaluate()
			}catch{}
			if(expD===undefined){expD = 1}else{
				try{
					expD = new NumExp(expD).evaluate()
				}catch{}
			}


			let answerDecimal = userN/userD,
				expectedDecimal = expN / expD

			if(answerDecimal.toFixed(8) !== expectedDecimal.toFixed(8)){
				return {
					result: false,
					message: "La répnse sous forme exacte ne donne pas la bonne valeur."
				}
			}

			return {
				result: true,
				message: ""
			}
		}
	}
}
