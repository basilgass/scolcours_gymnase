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

    check(expected: string, given: string): { result: boolean; message: string } {
        const A = new Polynom(given),
            Q = new Polynom(expected)

        // Must be the same equation.
        if(!A.isEqual(Q)){
            return {
                result: false,
                message: "la fonction n'est pas juste."
            }
        }

        // If all tests passes, it is correct !
        return {
            result: true,
            message: ""
        }

    }

    get format(): string {
        const opts = []

        if (this.isDevelopped) {
            // TODO: develop function does not work for now...
            opts.push("développée")
        }

        return `fonction ${opts.join(", ")}`
    }

}
