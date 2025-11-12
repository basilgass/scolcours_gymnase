import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"
import {FractionChecker, NumberChecker} from "@/Checkers"
import {PiRadian} from "@/PiMathExtended/PiRadian.ts"
import {Fraction} from "pimath"

// const name = "scientific"
const description = `trigo,p[eriodic],d[igits],deg[rees],[paramètres]

**paramètres**
`

// TODO: on doit autoriser d'autres angles orientés (modulo) ou forcé dans un quadrant

export class TrigoChecker extends CheckerAbstract {
	private readonly decimals: number
	private readonly digits: boolean
	private readonly digitsP: boolean
	private fractionChecker: FractionChecker
	private readonly isPeriodic: boolean
	private readonly isPositive: boolean
	private readonly radian: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.TRIGO
		this.description = description

		this.isPeriodic = this.config.includes('p') || this.config.includes('periodic') || this.config.includes('p+')
		this.isPositive = this.config.includes('p+')
		this.radian = !this.config.includes('deg')
		this.digits = this.config.includes('d') ||
			this.config.includes('d+') || // force la partie périodique à être en décimal aussi
			this.config.includes('digits')
		this.digitsP = this.config.includes('d+')
		this.decimals = this.config.map(Number).find(x => !isNaN(+x)) || 2

		this.secondaryChecker = this.digits
			? new NumberChecker(this.decimals.toString())
			: new FractionChecker('r')

		// TODO: Il faut utiliser le fraction checker pour les degrés ?
		this.fractionChecker = new FractionChecker('r')
	}


	get format(): string {
		// radian / degree
		// exact / digits

		const angle = `réponse en ${this.radian ? 'radians' : 'degrès'}`
		const example = this.radian
			? this.digits
				? `1.23 + k ${this.digitsP ? '6.28' : '\\dfrac{2\\pi}{3}'}`
				: `\\dfrac{5\\pi}{3}+k\\dfrac{2\\pi}{5}`
			: `42.12+k360`

		const constraint = this.isPositive
			? "L'angle doit être positif et le plus petit possible."
			: ""

		return [
			`${angle} : \\(${example}\\)`,
			constraint,
			this.digits ? this.secondaryChecker.format : ""
		]
			.filter(x => x.trim() !== "")
			.join('<br/>')

	}

	checkAsDigitsWithPeriodic(value: string): CheckerResult {
		const {angle, kPeriodic} = this.parseValue(value)
		const {angle: answer_angle, kPeriodic: answer_kPeriodic} = this.parseValue(this.answer)

		const angleNb = new Fraction(angle)
		const kPeriodicNb =
			this.digitsP
				? new Fraction(kPeriodic.replace('k', ''))
				: new Fraction(kPeriodic.replace('k', '').replace('pi', ''))
					.multiply(+Math.PI.toFixed(this.decimals))

		const answer_angleNb = new Fraction(answer_angle)
		const answer_kPeriodicNb = this.digitsP
			? new Fraction(answer_kPeriodic.replace('k', ''))
			: new Fraction(answer_kPeriodic.replace('k', '').replace('pi', ''))
				.multiply(+Math.PI.toFixed(this.decimals))

		if (!kPeriodicNb.isEqual(answer_kPeriodicNb)) {
			const result = this.secondaryChecker
				.check(kPeriodic.replace('k', ''), answer_kPeriodic.replace('k', ''))

			return makeCheckerResult([
				"La partie périodique n'est pas juste.",
				result.message
			])
		}

		const diff = angleNb.clone().subtract(answer_angleNb).divide(kPeriodicNb)

		if (!diff.isRelative()) {
			return makeCheckerResult("L'angle n'est pas juste")
		}

		if (this.isPositive) {
			// Contrôle que l'angle est le plus petit possible.
			if (angleNb.isNegative()) {
				return makeCheckerResult("L'angle doit être positif.", true)
			}
			if (angleNb.isGeq(kPeriodicNb)) {
				return makeCheckerResult("L'angle n'est pas le plus petit possible.", true)
			}
		}

		return makeCheckerResult()
	}

	checkAsDigitsWithoutPeriodic(value: string): CheckerResult {
		return this.secondaryChecker.check(value, this.answer)
	}

	override checkFormat(value: string): string {
		/**
		 * Valeurs possibles :
		 * api/b			sans période
		 * api/b+kcpi/d		avec période
		 * kcpi/d			c'est zéro plus la partie périodique
		 * 0				zéro, sans la période
		 */

		const {angle, kPeriodic, nb_of_values} = this.parseValue(value)


		// On contrôle qu'il n'y a pas de + en extra
		if (nb_of_values > 2) {
			return "Il n'y a qu'un seul signe \\(+\\) dans ce format de réponse."
		}

		// On contrôle qu'il y a la partie périodique ou pas.
		if (this.isPeriodic && kPeriodic === undefined) {
			return nb_of_values === 1
				? "Il faut ajouter la périodicité"
				: "La partie périodique doit contenir la valeur \\(k\\)."
		}

		if (!this.isPeriodic && kPeriodic) {
			// pas périodique, mais donné quand même
			return "Il ne faut pas ajouter la périodicité"
		}


		if (this.digits || !this.radian) {
			if (isNaN(Number(angle))) {
				return "La valeur de l'angle n'est pas au format décimal"
			}
		}


		// on regarde ANGLE
		if (this.radian) {
			// les valeurs sont en RADIANS mais pas en décimal, pas zéro
			if (
				!this.digits && angle !== '0' &&
				!angle.includes('pi')
			) {
				return "Un angle en radian doit contenir la valeur \\(\\pi\\)"
			}
		} else {
			// les valeurs sont en DEGRES
			if (angle.includes('pi')) {
				return "Un angle en degrés ne doit pas contenir la valeur \\(\\pi\\)"
			}
		}


		if (this.isPeriodic) {
			if (this.digitsP || !this.radian) {
				if (isNaN(Number(kPeriodic.replace('k', '')))) {
					return "La valeur de la partie périodique n'est pas au format décimal"
				}
			}
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {

		// On contrôle le format de la réponse.
		const formatError = this.checkFormat(value)
		if (formatError) {
			return makeCheckerResult(formatError)
		}


		if (this.radian && !this.digits) {
			// Radian pur, en valeur exact.
			return this.isPeriodic
				? this.checkWithPeriodic(value)
				: this.checkWithoutPeriodic(value)
		}

		// Angle en décimal, période en radian
		// tout en numérique.
		return this.isPeriodic
			? this.checkAsDigitsWithPeriodic(value)
			: this.checkAsDigitsWithoutPeriodic(value)


	}

	checkWithPeriodic(value: string): CheckerResult {
		const rad = new PiRadian(value)
		const answerRad = new PiRadian(this.answer)

		if (!rad.periodic.isEqual(answerRad.periodic)) {
			return makeCheckerResult("La partie périodique n'est pas juste.")
		}

		if (!rad.periodic.isReduced()) {
			return makeCheckerResult("La partie périodique n'est pas réduite.", true)
		}

		if (!rad.isSame(answerRad)) {
			return makeCheckerResult("L'angle n'est pas juste.")
		}

		if (!rad.angle.isReduced()) {
			return makeCheckerResult("L'angle n'est pas réduit.", true)
		}

		if (this.isPositive) {
			// Contrôle que l'angle est le plus petit possible.
			if (rad.angle.isNegative()) {
				return makeCheckerResult("L'angle doit être positif.", true)
			}
			if (rad.angle.isGeq(rad.periodic)) {
				return makeCheckerResult("L'angle n'est pas le plus petit possible.", true)
			}
		}

		return makeCheckerResult()
	}

	checkWithoutPeriodic(value: string): CheckerResult {
		const rad = new PiRadian(value)
		const answerRad = new PiRadian(this.answer)

		// Ce n'est pas le mëme angle
		if (!rad.isEqual(answerRad)) {
			return makeCheckerResult("L'angle n'est pas juste.")
		}

		// L'angle n'est pas réduit.
		if (!rad.angle.isReduced()) {
			return makeCheckerResult("L'angle n'est pas réduit.", true)
		}

		return makeCheckerResult()
	}

	parseValue(value: string): {
		angle: string, kPeriodic: string, nb_of_values: number
	} {
		const values = value.split('+')
		// const [A, B, ...otherValues] = value.split('+')
		// A => [A] => A undefined
		// A + kB => [A,kB] => A kB
		// kB => [kB] => 0 kB
		// angle: api/b
		// kPeriodic: kcpi/d

		const angle = values.find(v => !v.includes('k')) ?? '0'
		const kPeriodic = values.find(v => v.includes('k'))

		return {
			angle,
			kPeriodic,
			nb_of_values: values.length
		}
	}

}
