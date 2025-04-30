import {type CheckerResult, CHECKERS} from "./checker.config"

export abstract class CheckerAbstract {
    protected constructor(config?: string[] | string) {
        this._description = ""
        this._answer = ""

        if (config === undefined) {
            this._config = []
        } else if (typeof config === "string") {
            this._config = config.split(',')
        } else {
            this._config = [...config]
        }

        this._secondaryChecker = null
    }

    protected _secondaryChecker: CheckerAbstract | null

    get secondaryChecker(): CheckerAbstract | null {
        return this._secondaryChecker
    }

    set secondaryChecker(value: CheckerAbstract | null) {
        this._secondaryChecker = value
    }

    protected _config: string[]

    get config(): string[] {
        return this._config
    }

    set config(value: string[]) {
        this._config = value
    }

    protected _type: CHECKERS | undefined

    get type(): CHECKERS | undefined {
        return this._type
    }

    set type(value: CHECKERS) {
        this._type = value
    }

    protected _description: string

    get description(): string {
        return this._description
    }

    set description(value: string) {
        this._description = value
    }

    protected _answer: string

    get answer(): string {
        return this._answer
    }

    set answer(value: string) {
        this._answer = value
    }

    abstract get format(): string

    check(expected: string, given: string): CheckerResult {
        // Define the answer
        this.answer = expected

        // No value given
        if (given === "") {
            return {
                result: false,
                message: "Veuillez entrer une valeur"
            }
        }

        // The result is exactly what is expected
        let message = ""
        if (expected === given) {
            return {
                result: true,
                message
            }
        }

        // The format is wrong
        message = this.checkFormat(given)
        if (message !== "") {
            return {
                result: false,
                message,
            }
        }

        // The value is not correct
        message = this.checkValue(given)
        if (message !== "") {
            return {
                result: false,
                message,
            }
        }

        // All tests passed => answer is correct
        return {
            result: true,
            message: "",
        }
    }

    checkFormat(value: string): string {
        return value ? "" : "Veuillez entrer une réponse"
    }

    checkValue(value: string): string {
        return "La réponse n'est pas correcte"
    }
}

