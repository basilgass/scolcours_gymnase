import {CheckerBase} from "./CheckerBase";
import AsciiMathParser from "../asciimath2tex";
import {braceSorter} from "@/helpers/helperFunctions";
import {getCheckerClass} from "@/Composables/checkersConfig";

const name = "solution"
const description: string = `solution|sol,[paramètres]

**paramètres**
checker = par défaut, c'est le "exact"
`

export class SolutionChecker extends CheckerBase {
    private secondaryChecker: CheckerBase

    constructor(config?: string[] | string) {
        super(config)
        this.name = name
        this.description = description

        const chkClass = getCheckerClass(this.secondaryCheckerName)
        this.secondaryChecker = new chkClass(this.secondaryCheckerOptions)

    }

    get format(): string {
        if (this.secondaryCheckerName !== undefined) {
            return `Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)<br/>${this.secondaryChecker.format}`
        }
        return "Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)";
    }

    check(expected: string, given: string): { result: boolean; message: string } {

        // C'est exactement la bonne valeur.
        if (expected === given) {
            return {
                result: expected === given,
                message: ""
            }
        }

        // Ensemble vide / réelles entre accolades.
        if (isEmptyOrReal(given)) {
            // IR ou (vide) est entre accolade.
            if (given === `{${expected}} `) {
                return {
                    result: false,
                    message: `${new AsciiMathParser().parse(expected)} est déjà un ensemble.`
                }
            }

            // De toute façon, ce n'est pas le bonne ensemble de solution.
            return {result: false, message: "Ce n'est pas le bon ensemble de solution."}
        } else if (isEmptyOrReal(expected)) {
            // la réponse donnée n'est pas un cas particulier, mais on devrait l'avoir...
            return {
                result: false,
                message: "Ce n'est pas le bon ensemble de solution."
            }
        }


        // La réponse donnée et espérée ne sont pas des cas particuliers

        // La solution espérée est avec des accolades
        if (expected.startsWith("{")) {
            if (!given.startsWith("{")) {
                // Manque les accolades
                return {
                    result: false,
                    message: "L'ensemble des solutions doit avoir des \\(\\{\ \\}\\)."
                }
            }

            // vérifie qu'il y a bien le bon nombre d'accolades ouvrantes et fermantes
            if (given.split("{").length !== given.split("}").length) {
                return {
                    result: false,
                    message: "Le nombre d'accolades ouvrantes est différent des fermantes."
                }
            }

        }

        // Si la solution est avec intervalle mais pas la réponse.
        if (isWithInterval(expected) && !isWithInterval(given)) {
            return {
                result: false,
                message: isWithInterval(expected) ?
                    "La solution contient un intervalle." :
                    "La solution ne contient pas d'intervalle."
            }
        }


        // La solution n'est pas un intervalle.
        if (!isWithInterval(expected)) {
            // On devrait être dans la situation : {a;b;c;d}
            let expectedValues = expected.substring(1, expected.length - 1).split(";")

            let correctAnswers = 0
            expectedValues.forEach(checkValue => {

                let givenValues = given.substring(1, given.length - 1).split(";")
                for (let i = 0; i < givenValues.length; i++) {
                    if (this.secondaryChecker.check(checkValue, givenValues[i]).result) {
                        givenValues.splice(i, 1)[0]
                        correctAnswers++
                        break
                    }
                }
            })

            if (correctAnswers !== expectedValues.length) {
                return {
                    result: false,
                    message: `Il y a ${correctAnswers} réponse(s) juste sur ${expectedValues.length}`
                }
            } else {
                return {
                    result: true,
                    message: ""
                }
            }

        }


        // La solution peut être du type IR\setminus {a;b;c}

        // Ce n'est pas dans le bon ordre (cas des ensembles, pas des intervalles)
        if (!expected.includes("]") && !expected.includes("[")) {
            let inBracketsExpectedValue = braceSorter(expected),
                inBracketsGivenValue = braceSorter(given)

            return {
                result: inBracketsGivenValue === inBracketsExpectedValue,
                message: inBracketsGivenValue === inBracketsExpectedValue ? "" : "Une ou plusieurs valeurs sont fausses."
            }
        }

        return {
            result: false,
            message: ""
        }

    }
}

function isWithInterval(value: string): boolean {
    return value.includes('[') || value.includes(']')
}

function isEmptyOrReal(value: string): boolean {
    return value === "!!" ||
        value === "RR" ||
        value === "RR^**" ||
        value === "RR_+" ||
        value === "RR_+^**" ||
        value === "RR_-" ||
        value === "RR_-^**"
}
