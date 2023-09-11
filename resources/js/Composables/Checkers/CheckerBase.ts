
export abstract class CheckerBase {
    private _options: string[]

    get options(): string[] {
        return this._options;
    }

    set options(value: string[]) {
        this._options = value;
    }

    private _name: string

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    private _description: string

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    protected constructor(config?: string[]) {
        this._options = config ?? []
    }

    abstract format(): string

    abstract check(expected: string, given: string): { result: boolean, message: string }
}

export class ExampleChecker extends CheckerBase {
    constructor(config?: string[]) {
        super(config)
        this.name = "HELLO WORLD"
        this.description = "MY SUPER NICE DESCRIPTION"
    }

    check(expected: string, given: string): { result: boolean; message: string } {
        return {message: "", result: false};
    }

    format(): string {
        return "";
    }
}
