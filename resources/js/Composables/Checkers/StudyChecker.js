export function StudyChecker(options){
	return {
		format: () => {
			return ""
		},
		check: (expectedAnswer, answer = []) => {
			const arrayAnswer = answer.split(",").sort(),
				arrayExpected = expectedAnswer.split(",").sort(),
				d = arrayExpected.length-arrayAnswer.length

			if(d>0){
				return {
					result: false,
					message: `il manque ${d} élément${d>1?"s":""}`
				}
			}else if(d<0){
				return {
					result: false,
					message: `il y a ${-d} élément${-d>1?"s":""} en trop`
				}
			}

			let erreurs = []
			for(let i=0; i<=arrayAnswer.length; i++){
				if(arrayAnswer[i]!==arrayExpected[i]){
					erreurs.push(i+1)
				}
			}

			if(erreurs>0){
				return {
					result: false,
					message: `il y a ${erreurs.length} erreur${erreurs.length>1?"s":""}`
				}
			}

			return {
				result: true,
				message: ""
			}
		}
	}

}
