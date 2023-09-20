import {PiMath} from "pimath/esm"
import {CheckerBase} from "@/Checkers/CheckerBase";


const name = "polynom"
const description = `polynom,[paramètres]

**paramètres**
- f=factorisé
- F=entièrement factorisé \\((2x+4)(x-3)\\) ne passe pas.
- d=développé
- s=forme du sommet \\(a(x-b)^2+c\\)
`

export class PolynomChecker extends CheckerBase {
    constructor(config:string[]|string) {
        super(config);
        this.name = name
        this.description = description
    }

    check(expected: string, given: string): { result: boolean; message: string } {
        // Make sur the polynom is constructable
        let A, Q

        try{
            A = new PiMath.Polynom(given)
            Q = new PiMath.Polynom(expected)
        }catch{
            return {
                result: false,
                message: "Le polynôme n'est pas formé correctement."
            }
        }

        // Polynom must be equals.
        if (!Q.isEqual(A)) {
            return {
                result: false,
                message: "Le polynôme n'est pas le même."
            }
        }

        /** Polynom checker config */
        // Factorized
        if (this.config.includes("f") || this.config.includes("factor") || this.config.includes("F") || this.config.includes("FACTORS")) {
            try {
                if (!A.isFactorized(given, this.config.includes("f") || this.config.includes("factor"))) {
                    return {
                        result: false,
                        message: "Le polynôme n'est pas (entièrement) factorisé."
                    }
                }
            } catch {
                return {
                    result: false,
                    message: "Le polynôme n'est pas (entièrement) factorisé."
                }
            }
        }

        // Developed
        if (this.config.includes("d") || this.config.includes("develop")) {
            if (!A.isDeveloped(given)) {
                return {
                    result: false,
                    message: "Le polynôme n'est pas (entièrement) développé."
                }
            }
        }

        // Forme du sommet
        if (this.config.includes('s') || this.config.includes("sommet")) {
            if (
                given.match(/(-?[\d](\/\d+)?)?\(x([+-][\d]+(\d+)?)?\)\^2([+-]\d+(\/\d+)?)?/)
            ) {
                return {result: true, message: ""}
            } else {
                return {result: false, message: "L'équation n'est pas dans le bon format."}
            }
        }

        // If all tests passes, it is correct !
        return {
            result: true,
            message: ""
        }

    }

    get format(): string {
        let opts = []

        if (this.config.includes("f") || this.config.includes("factors")) {
            opts.push("factorisé")
        } else if (this.config.includes("F") || this.config.includes("FACTORS")) {
            opts.push("entièrement factorisé")
        } else if (this.config.includes("d") || this.config.includes("develop")) {
            opts.push("développé")
        }

        return `polynôme ${opts.join(", ")}`
    }

}
