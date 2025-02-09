import { CheckerAbstract } from "@/Checkers/CheckerAbstract"

const name = "type"
const description = "type"

export class TypeChecker extends CheckerAbstract {
    constructor(config:string[]|string) {
        super(config)
        this.name = name
        this.description = description
    }


    readonly format = "Cliquer sur les bonnes lettres."

	checkFormat(value: string): string {
		return value ? "" : "Aucune réponse donnée"
	}

	checkValue(value: string): string {
		return value ? "" : "Aucune réponse donnée"
	}

}
