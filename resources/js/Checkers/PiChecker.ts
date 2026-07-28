import type {CheckerAbstract} from "./CheckerAbstract"
import {type CheckerResult, CHECKERS} from "./checker.config"
import {checkerNameToEnum} from "@/Composables/keyboardRegistry.ts"
import {getCheckerClass} from "./checkerRegistry"

export class PiChecker {
	#checker: CheckerAbstract

	constructor(config?: string) {
		// Split the config to get the main checker and the sub checker
		// name,a,b,c,[checker:name,d,e,f,g]
		const [mainCheckerConfig, subCheckerConfig] = config?.split("checker:") ?? []

		// Création du checker
		this.#checker = this.#loadCheckerTo(mainCheckerConfig ?? '')

		if (subCheckerConfig !== undefined) {
			// Si on définit un subchecker, on le crée ici.
			this.#checker.secondaryChecker = this.#loadCheckerTo(subCheckerConfig)
		} else if (this.#checker.secondaryChecker === null) {
			// Si le subchecker n'est pas défini, on crée la version par défaut.
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
		return getCheckerClass(checker)
	}

	#loadCheckerTo(config: string): CheckerAbstract {
		const {checker, options} = this.#parseConfig(config)
		const checkerClass = this.#loadChecker(checker)

		if (checkerClass === null) {
			console.warn(`Checker ${checker} not found`)
			const cls = this.#loadChecker(CHECKERS.EXACT)
			if (cls === null) throw new Error("Checker EXACT introuvable")
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
