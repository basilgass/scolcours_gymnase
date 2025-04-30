import {CheckerAbstract} from "../CheckerAbstract";
import {Fraction} from "pimath";
import {CHECKERS} from "../checker.config";

const name="fraction"

const description = `fraction,[paramètres]

**paramètres**
- r=réduit
`

export class FractionChecker extends CheckerAbstract {
    private expectReduced: boolean
    constructor(config?:string[]|string) {
        super(config)
        this.type = CHECKERS.FRACTION
        this.description = description

        this.expectReduced = this.config.includes("r") || this.config.includes("reduced")
    }

    get format(): string {
        const opts = []
        if (this.expectReduced) {
            opts.push("réduite")
        }

        return `réponse sous forme de fraction ${opts.join(",")}`
    }

	override checkFormat(value: string): string {
		try {
			new Fraction(value)
			return ""
		}catch {
			return "La fraction n'est pas formatée correctement."
		}
	}

	override checkValue(value: string): string {

		const FAnswer = new Fraction(value)
		const FExpected = new Fraction(this.answer)

		if(FAnswer.isNotEqual(FExpected)){
			return  "La réponse donnée n'est pas juste."
		}

		if(FAnswer.denominator<0){
			return  "Le dénominateur doit être positif."
		}

		if(!FAnswer.isReduced() && this.expectReduced){
			return  "La fraction n'est pas réduite."
		}

		return ""
	}


}
