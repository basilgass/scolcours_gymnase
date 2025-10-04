import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"
import {FractionChecker} from "@/Checkers"
import {Fraction} from "pimath"

// const name = "scientific"
const description = `trigo,p[eriodic],[paramètres]

**paramètres**
`

// TODO: on doit autoriser d'autres angles orientés (modulo) ou forcé dans un quadrant
export class TrigoChecker extends CheckerAbstract {
	private isPeriodic: boolean
	private radian: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.TRIGO
		this.description = description

		this.isPeriodic = this.config.includes('p') || this.config.includes('periodic')
		this.radian = true

		this.secondaryChecker = new FractionChecker('r')
	}


	get format(): string {
		if (this.isPeriodic) {
			return "réponse en radians : \\( \\dfrac{5\\pi}{3}+k\\dfrac{2\\pi}{5}\\)"
		} else {
			return "réponse en radians : \\(\\dfrac{5\\pi}{2}\\)"
		}
	}


	override checkValue(value: string): CheckerResult {
		const [angle, periodic] = value.split('+k')

		if(this.radian && !angle.includes('pi')){
			return makeCheckerResult("Un angle en radian doit contenir la valeur \\(\\pi\\)")
		}

		if(this.radian && periodic && !periodic.includes('pi')){
			return makeCheckerResult("Une période en radian doit contenir la valeur \\(\\pi\\)")
		}

		if (this.isPeriodic && !periodic) {
			return makeCheckerResult("Il faut ajouter la périodicité")
		}

		if (!this.isPeriodic && periodic) {
			return makeCheckerResult("Il ne faut pas ajouter la périodicité")
		}

		return this.isPeriodic
			? this.checkWithPeriodic(value)
			: this.checkWithoutPeriodic(value)
	}

	checkWithoutPeriodic(value: string): CheckerResult {
		const [angle] = value.split('+k')
		const [answerAngle] = this.answer.split('+k')

		const angleF = parseAngle(angle)
		const answerAngleF = parseAngle(answerAngle)

		// Ce n'est pas le mëme angle
		if (!angleF.isEqual(answerAngleF) && !this.isPeriodic) {
			return makeCheckerResult("L'angle n'est pas juste.")
		}

		// L'angle n'est pas réduit.
		if (!angleF.isReduced()) {
			return makeCheckerResult("L'angle n'est pas réduit.", true)
		}

		return makeCheckerResult()
	}

	checkWithPeriodic(value: string): CheckerResult {
		const [angle, periodic] = value.split('+k')
		const [answerAngle, answerPeriodic] = this.answer.split('+k')

		const angleF = parseAngle(angle)
		const answerAngleF = parseAngle(answerAngle)

		const periodicF = parseAngle(periodic)
		const answerPeriodicF = parseAngle(answerPeriodic)

		// Contrôle de la partie périodique.
		if (!periodicF.isEqual(answerPeriodicF)) {
			return makeCheckerResult("La partie périodique n'est pas juste.")
		}
		if (!periodicF.isReduced()) {
			return makeCheckerResult("La partie périodique n'est pas réduite.", true)
		}

		// L'angle donné peut être k2pi
		// A ce stade, la période est identique à la réponse
		const diff = angleF.clone().subtract(answerAngleF).divide(periodicF)

		if(!diff.isRelative()){
			return makeCheckerResult("L'angle n'est pas juste.")
		}

		if (!angleF.isReduced()) {
			return makeCheckerResult("L'angle n'est pas réduit.", true)
		}

		return makeCheckerResult()
	}

}

function parseAngle(value: string): Fraction {
	const [num, den] = value.split('/')

	const F = new Fraction()

	F.numerator = num === 'pi' ? 1 : Number(num.replace('pi', ''))

	if (den && !isNaN(+den)) {
		F.denominator = +den
	}

	return F
}
