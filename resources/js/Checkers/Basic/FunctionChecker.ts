import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import { Polynom } from "pimath"

const name = "function"
const description = `function|fn,[paramètres]

**paramètres**
- d=développé
`

export class FunctionChecker extends CheckerAbstract {
    private isDevelopped: boolean
    constructor(config:string[]|string) {
        super(config)
        this.name = name
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

	checkFormat(value: string): string {
		return value?'':'Vous devez entrer une fonction.'
	}

	checkValue(value: string): string {
		const A = new Polynom(value),
			Q = new Polynom(this.answer)

		// Must be the same equation.
		if(!A.isEqual(Q)){
			return  "la fonction n'est pas juste."
		}

		return ""
	}

}
