import {CheckerBase} from "@/Checkers/CheckerBase"

const name = "study"
const description = `study

**paramètres**
aucun
`

export class StudyChecker extends CheckerBase {
    constructor(config:string[]|string) {
        super(config)
        this.name = name
        this.description = description
    }

    check(expected: string, given: string): { result: boolean; message: string } {
        const arrayAnswer = given.split(",").sort(),
            arrayExpected = expected.split(",").sort(),
            d = arrayExpected.length - arrayAnswer.length

        if (d > 0) {
            return {
                result: false,
                message: `il manque ${d} élément${d > 1 ? "s" : ""}`
            }
        } else if (d < 0) {
            return {
                result: false,
                message: `il y a ${-d} élément${-d > 1 ? "s" : ""} en trop`
            }
        }

        const erreurs = [],
            traceErrors = []
        for (let i = 0; i <= arrayAnswer.length; i++) {
            if (arrayAnswer[i] !== arrayExpected[i]) {

                if (arrayExpected[i].split("&")[0] === arrayAnswer[i].split("&")[0]) {
                    traceErrors.push(i + 1)
                } else {
                    erreurs.push(i + 1)
                }
            }
        }

        if (erreurs.length > 0) {
            return {
                result: false,
                message: `il y a ${erreurs.length} erreur${erreurs.length > 1 ? "s" : ""}`
            }
        }

        if (traceErrors.length > 0) {
            return {
                result: false,
                message: `il y a ${traceErrors.length} erreur${traceErrors.length > 1 ? "s" : ""} dans le tracé`
            }
        }

        return {
            result: true,
            message: ""
        }

    }

    get format(): string {
        return "Tracer le graphe"
    }

}

