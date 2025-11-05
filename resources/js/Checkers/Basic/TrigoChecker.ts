import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"
import {FractionChecker} from "@/Checkers"
import {PiRadian} from "@/PiMathExtended/PiRadian.ts"

// const name = "scientific"
const description = `trigo,p[eriodic],[paramètres]

**paramètres**
`

// TODO: on doit autoriser d'autres angles orientés (modulo) ou forcé dans un quadrant
export class TrigoChecker extends CheckerAbstract {
	private readonly isPeriodic: boolean
	private readonly isPositive: boolean
	private readonly radian: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.TRIGO
		this.description = description

		this.isPeriodic = this.config.includes('p') || this.config.includes('periodic') || this.config.includes('p+')
		this.isPositive = this.config.includes('p+')
		this.radian = true

		this.secondaryChecker = new FractionChecker('r')
	}


	get format(): string {
		if (this.isPeriodic) {
			return "réponse en radians : \\( \\dfrac{5\\pi}{3}+k\\dfrac{2\\pi}{5}\\)" + (this.isPositive ? "<br/>L'angle doit être positif et le plus petit possible." : '')
		} else {
			return "réponse en radians : \\(\\dfrac{5\\pi}{2}\\)"
		}
	}

	override checkValue(value: string): CheckerResult {
		/**
		 * Valeurs possibles:
		 * api/b			sans période
		 * api/b+kcpi/d		avec période
		 * kcpi/d			c'est zéro plus la partie périodique !
		 * 0				zéro, sans la période
		 */


		if (!this.radian) {
			// comparaison en degré
			return
		}

		// BUG: Il faut revoir ce système pour gérer des valeurs particulières
		// BUG: le clavier n'affiche pas l'input de l'utilisateur, mais une version formatée "trompeuse".

		// La partie périodique est après le 'k'
		const [A, B, ...otherValues] = value.split('+')
		// A + kB => [A,kB] => A kB
		// kB => [kB] => 0 kB
		// angle: api/b
		// kPeriodic: kcpi/d
		const angle = B === undefined ? '0' : A
		const kPeriodic = B === undefined ? A : B

		// On contrôle qu'il n'y a pas de + en extra
		if (otherValues && otherValues.length > 0) {
			return makeCheckerResult("Il n'y a qu'un seul signe \\(+\\) dans ce format de réponse.")
		}

		// L'angle doit être en radian
		if (this.radian && (angle !== '0' && !angle.includes('pi'))) {
			return makeCheckerResult("Un angle en radian doit contenir la valeur \\(\\pi\\)")
		}

		if (!this.radian && angle.includes('pi')) {
			return makeCheckerResult("Un angle en degrés ne doit pas contenir la valeur \\(\\pi\\)")
		}

		// On contrôle la partie périodique.
		if (this.isPeriodic) {
			// Il faut une partie périodique
			if (kPeriodic === undefined || kPeriodic === "") {
				return makeCheckerResult("Il faut ajouter la périodicité")
			}

			// On a bien une partie périodique.
			// Il doit être de la forme k[0-9]*pi/[0-9]+
			if (!kPeriodic.match(/k[0-9]*pi(?:\/[0-9]+)?/)) {
				return makeCheckerResult("Le format de la partie périodique n'est pas reconnu.")
			}
		} else {
			// Pas de périodicité
			if (kPeriodic !== undefined) {
				return makeCheckerResult("Il ne faut pas ajouter la périodicité")
			}
		}

		return this.isPeriodic
			? this.checkWithPeriodic(value)
			: this.checkWithoutPeriodic(value)
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

}
