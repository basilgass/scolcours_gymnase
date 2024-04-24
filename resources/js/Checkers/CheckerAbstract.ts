import { CheckerResult } from "@/Composables/checkersConfig"

export abstract class CheckerAbstract {
    protected constructor(config?: string[] | string) {
        if (config === undefined) {
            this._config = []
        } else if (typeof config === "string") {
            this._config = config.split(',')
        } else {
            this._config = [...config]
        }

        // Sub-checker : we suppose that everything after is for the sub-checker
        const [, chk] = this._config.join(',').split('checker:')
        if (chk !== undefined) {
            const [chkName, ...opts] = chk.split(',')
            this._secondaryCheckerName = chkName
            this._secondaryCheckerOptions = opts || []
        }
    }

    protected _secondaryCheckerName?: string

    get secondaryCheckerName(): string {
        return this._secondaryCheckerName
    }

    set secondaryCheckerName(value: string) {
        this._secondaryCheckerName = value
    }

    protected _secondaryCheckerOptions?: string[]

    get secondaryCheckerOptions(): string[] {
        return this._secondaryCheckerOptions
    }

    set secondaryCheckerOptions(value: string[]) {
        this._secondaryCheckerOptions = value
    }

    protected _config: string[]

    get config(): string[] {
        return this._config
    }

    set config(value: string[]) {
        this._config = value
    }

    protected _name: string

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    protected _description: string

    get description(): string {
        return this._description
    }

    set description(value: string) {
        this._description = value
    }

    abstract get format(): string

    abstract check(expected: string, given: string): CheckerResult
}

