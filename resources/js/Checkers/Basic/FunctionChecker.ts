import {CheckerAbstract} from "../CheckerAbstract";
import {Polynom} from "pimath";
import {CHECKERS} from "../checker.config";

const name = "function"
const description = `function|fn,[paramètres]

**paramètres**
- d=développé
`

export class FunctionChecker extends CheckerAbstract {
    private isDevelopped: boolean
    constructor(config:string[]|string) {
        super(config)
        this.type = CHECKERS.FUNCTION
        this.description = description

        this.isDevelopped = (this.config.includes("d") || this.config.includes("developped") || this.config.includes("dev"))
    }

    get format(): string {
        const opts = []

        if (this.isDevelopped) {
            // TODO: develop function does not work for now...
            opts.push("développée")
        }

        return `fonction ${opts.join(", ")}`
    }

    override checkValue(value: string): string {
		const A = new Polynom(value),
			Q = new Polynom(this.answer)

		// Must be the same equation.
		if(!A.isEqual(Q)){
			return  "la fonction n'est pas juste."
		}

		return ""
	}

}
