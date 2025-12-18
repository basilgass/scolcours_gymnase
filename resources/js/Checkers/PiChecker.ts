import type {CheckerAbstract} from "./CheckerAbstract"
import {checkerNameToEnum, type CheckerResult, CHECKERS} from "./checker.config"
import {
	CoordChecker,
	EquationChecker,
	ExactChecker,
	ExpChecker,
	FractionChecker,
	FunctionChecker,
	InputChecker,
	LogChecker,
	NumberChecker,
	PolynomChecker,
	PrimitiveChecker,
	RationalChecker,
	ScientificChecker,
	SolutionChecker,
	StringChecker,
	VectorChecker
} from "./Basic"
import {MatrixChecker, OrderChecker, QcmChecker, StudyChecker, TableofsignChecker, TypeChecker} from "./Custom"
import {TrigoChecker} from "@/Checkers/Basic/TrigoChecker.ts"
import {DrawChecker} from "@/Checkers/Custom/DrawChecker.ts"

type CheckerClass = (new (...args: any[]) => CheckerAbstract)

export function checkersList(): Record<CHECKERS, CheckerClass> {
	let list: Partial<Record<CHECKERS, CheckerClass>> = {}

	// list[CHECKERS.CARTESIAN] = CartesianChecker
	list[CHECKERS.COORDINATES] = CoordChecker
	list[CHECKERS.EQUATION] = EquationChecker
	list[CHECKERS.EXACT] = ExactChecker
	list[CHECKERS.EXPONENTIAL] = ExpChecker
	list[CHECKERS.FRACTION] = FractionChecker
	list[CHECKERS.FUNCTION] = FunctionChecker
	list[CHECKERS.INPUT] = InputChecker
	list[CHECKERS.LOGARITHM] = LogChecker
	list[CHECKERS.NUMBER] = NumberChecker
	list[CHECKERS.POLYNOMIAL] = PolynomChecker
	list[CHECKERS.PRIMITIVE] = PrimitiveChecker
	list[CHECKERS.RATIONAL] = RationalChecker
	list[CHECKERS.SCIENTIFIC] = ScientificChecker
	list[CHECKERS.SOLUTION] = SolutionChecker
	list[CHECKERS.STRING] = StringChecker
	list[CHECKERS.TRIGO] = TrigoChecker
	list[CHECKERS.VECTOR] = VectorChecker

	list[CHECKERS.ORDER] = OrderChecker
	list[CHECKERS.QCM] = QcmChecker
	list[CHECKERS.STUDY] = StudyChecker
	list[CHECKERS.TABLE_OF_SIGNS] = TableofsignChecker
	list[CHECKERS.TYPE] = TypeChecker
	list[CHECKERS.MATRIX] = MatrixChecker
	list[CHECKERS.DRAW] = DrawChecker

	return list as Record<CHECKERS, CheckerClass>
}

export class PiChecker {
	#checker: CheckerAbstract

	constructor(config?: string) {
		// Split the config to get the main checker and the sub checker
		// name,a,b,c,[checker:name,d,e,f,g]
		const [mainCheckerConfig, subCheckerConfig] = config?.split("checker:") ?? []

		this.#checker = this.#loadCheckerTo(mainCheckerConfig ?? '')

		if (subCheckerConfig !== undefined) {
			this.#checker.secondaryChecker = this.#loadCheckerTo(subCheckerConfig)
		} else {
			this.#checker.secondaryChecker = this.#loadCheckerTo('exact')
		}

		return this
	}

	get answer(): string {
		return this.#checker.answer
	}

	get checker(): CheckerAbstract {
		return this.#checker
	}

	set checker(value: CheckerAbstract) {
		this.#checker = value
	}

	get description(): string {
		return this.#checker.description
	}

	get format(): string {
		return this.#checker.format
	}

	get secondaryChecker(): CheckerAbstract | null {
		return this.#checker.secondaryChecker
	}

	set secondaryChecker(value: CheckerAbstract) {
		this.#checker.secondaryChecker = value
	}

	check(givenValue: string, expectedAnswer: string): CheckerResult {
		return this.#checker.check(givenValue, expectedAnswer)
	}

	#loadChecker(checker: CHECKERS): (new (...args: any[]) => CheckerAbstract) | null {
		const list = checkersList()
		return list[checker] ?? null
	}

	#loadCheckerTo(config: string): CheckerAbstract {
		const {checker, options} = this.#parseConfig(config)
		const checkerClass = this.#loadChecker(checker)

		if (checkerClass === null) {
			console.warn(`Checker ${checker} not found`)
			const cls = this.#loadChecker(CHECKERS.EXACT)
			return new cls(options)
			// throw new Error(`Checker ${checker} not found`)
		}

		return new checkerClass(options)
	}

	#parseConfig(config: string): { checker: CHECKERS, options: string[] } {
		const [checker, ...options] = config.split(',')
		return {checker: checkerNameToEnum(checker), options: options.filter(o => o !== "")}
	}
}
