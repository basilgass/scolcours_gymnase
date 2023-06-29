import {PiMath} from "pimath/esm"

export function FractionChecker(options){
	if(options===undefined){options = []}

	const expectReduced = options.includes("r") || options.includes("reduced")

	return {
		name: "fraction",
		format: () => {
			let opts = []
			if (expectReduced) {
				opts.push("réduite")
			}

			return `réponse sous forme de fraction ${opts.join(",")}`
		},
		check: (expectedAnswer, answer = []) => {
			// Le résultat est exactement ce qui est demandé
			if(answer===expectedAnswer){
				return {
					result: true,
					message: ""
				}
			}

			let FAnswer, FExpected

			try{
				FAnswer = new PiMath.Fraction(answer)
				FExpected = new PiMath.Fraction(expectedAnswer)
			}catch{
				return {
					result: false,
					message: "La fraction n'est pas formatée correctement."
				}
			}

			if(FAnswer.isNotEqual(FExpected)){
				return {
					result: false,
					message: "La réponse donnée n'est pas juste."
				}
			}

			if(FAnswer.denominator<0){
				return {
					result: false,
					message: "Le dénominateur doit être positif."
				}
			}

			if(!FAnswer.isReduced() && expectReduced){
				return {
					result: false,
					message: "La fraction n'est pas réduite."
				}
			}


			return {
				result: true,
				message: ""
			}
		}
	}

}
