import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {NumberChecker} from "./NumberChecker"
import {CheckerResult, CHECKERS} from "../checker.config"
import {FractionChecker} from "@/Checkers"
import {Fraction} from "pimath"

// const name = "scientific"
const description = `trigo,p[eriodic],[paramètres]

**paramètres**
`

export class TrigoChecker extends CheckerAbstract {
	private withPeriodic: boolean
    constructor(config:string[]|string) {
        super(config)
        this.type = CHECKERS.TRIGO
        this.description = description

		this.withPeriodic = this.config.includes('p') || this.config.includes('periodic')

		this.secondaryChecker = new FractionChecker('r')
    }


    get format(): string {
		if(this.withPeriodic) {
			return "réponse en radians : \\( \\dfrac{5\\pi}{3}+k\\dfrac{2\\pi}{5}\\)"
		}else{
			return "réponse en radians : \\(\\dfrac{5\\pi}{2}\\)"
		}
    }


	override checkValue(value: string): CheckerResult {
		const [angle, periodic] = value.split('+k')
		const [answerAngle, answerPeriodic] = this.answer.split('+k')

		if(answerPeriodic && !periodic){
			return makeCheckerResult("Il faut ajouter la périodicité")
		}

		if(!answerPeriodic && periodic){
			return makeCheckerResult("Il ne faut pas ajouter la périodicité")
		}

		const angleF = parseAngle(angle)
		const answerAngleF = parseAngle(answerAngle)
		if(!angleF.isEqual(answerAngleF)){
			return makeCheckerResult("L'angle n'est pas juste.")
		}
		if(!angleF.isReduced()){
			return makeCheckerResult("L'angle n'est pas réduit.", true)
		}

		if(periodic && answerPeriodic){
			const periodicF = parseAngle(periodic)
			const answerPeriodicF = parseAngle(answerPeriodic)

			if(!periodicF.isEqual(answerPeriodicF)){
				return makeCheckerResult("La partie périodique n'est pas juste.")
			}
			if(!periodicF.isReduced()){
				return makeCheckerResult("La partie périodique n'est pas réduite.", true)
			}

		}


		return makeCheckerResult()
	}

}

function parseAngle(value: string): Fraction{
	const [num, den] = value.split('/')

	const F = new Fraction()

	F.numerator = num==='pi' ? 1 : Number(num.replace('pi', ''))

	if(den && !isNaN(+den)){
		F.denominator = +den
	}

	return F
}
