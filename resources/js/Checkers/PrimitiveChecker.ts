import { CheckerBase } from "@/Checkers/CheckerBase"
import { ExpChecker } from "@/Checkers/ExpChecker"
import { LogChecker } from "@/Checkers/LogChecker"
import { PolynomChecker } from "@/Checkers/PolynomChecker"

const name = "primitive"
const description = `primitive,[paramètres]

**paramètres**
aucun
`

export class PrimitiveChecker extends CheckerBase {
    constructor(config?: string[] | string) {
        super(config)
        this.name = name
        this.description = description
    }

    get format(): string {
        return "primitive d'une fonction"
    }

    check(expected: string, given: string): {
        result: boolean;
        message: string
    } {
        // Le résultat est exactement ce qui est demandé
        const asciiAnswer = given.startsWith("#") ? given.substring(1) : given

        if (asciiAnswer === expected) {
            return {
                result: true,
                message: ""
            }
        }

		// S'il y a une exponentielle ou un logarithme.
		// TODO: manière plus robuste de contrôler un polynôme "complexe"
		let subchk
		if(given.includes("e")){
			subchk = new ExpChecker(this._config)
		}else if(given.includes('ln')){
			subchk = new LogChecker(this._config)
		}else{
			subchk = new PolynomChecker(this._config)
		}

		const result = subchk.check(expected, given)

		if(!given.endsWith('+c')){
			return {
				result: false,
				message: "il manque la constante."
			}
		}

		return result
    }

}
