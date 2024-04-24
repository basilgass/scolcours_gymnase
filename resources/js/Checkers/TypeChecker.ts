import { CheckerAbstract } from "@/Checkers/CheckerAbstract"

const name = "type"
const description = "type"

export class TypeChecker extends CheckerAbstract {
    constructor(config:string[]|string) {
        super(config)
        this.name = name
        this.description = description
    }

    check(expected: string, given: string): { result: boolean; message: string } {
        if (given === expected) {
            return {
                result: true,
                message: ""
            }
        } else {
            return {
                result: false,
                message: "La réponse donnée n'est pas juste."
            }
        }
    }

    get format(): string {
        return "Cliquer sur les bonnes lettres."
    }

}
