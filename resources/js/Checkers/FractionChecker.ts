import {PiMath} from "pimath/esm"
import {CheckerBase} from "@/Checkers/CheckerBase";

const name="fraction"

const description = `fraction,[paramètres]

**paramètres**
- r=réduit
`

export class FractionChecker extends CheckerBase {
    private expectReduced: boolean;
    constructor(config?:string[]|string) {
        super(config);
        this.name = name
        this.description = description

        this.expectReduced = this.config.includes("r") || this.config.includes("reduced")
    }

    check(expected: string, given: string): { result: boolean; message: string } {
        // Le résultat est exactement ce qui est demandé
        if(given===expected){
            return {
                result: true,
                message: ""
            }
        }

        let FAnswer, FExpected

        try{
            FAnswer = new PiMath.Fraction(given)
            FExpected = new PiMath.Fraction(expected)
        }catch{
            return {
                result: false,
                message: "La fraction n'est pas formatée correctement."
            }
        }

        if(FAnswer.isNotEqual(FExpected)){
            return {
                result: false,
                message: "La réponse donnée n'est pas juste."
            }
        }

        if(FAnswer.denominator<0){
            return {
                result: false,
                message: "Le dénominateur doit être positif."
            }
        }

        if(!FAnswer.isReduced() && this.expectReduced){
            return {
                result: false,
                message: "La fraction n'est pas réduite."
            }
        }


        return {
            result: true,
            message: ""
        }

    }

    get format(): string {
        let opts = []
        if (this.expectReduced) {
            opts.push("réduite")
        }

        return `réponse sous forme de fraction ${opts.join(",")}`
    }


}
