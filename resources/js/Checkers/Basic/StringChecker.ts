import { CheckerAbstract } from "@/Checkers/CheckerAbstract"

const name = "string"
const description = "string"

export class StringChecker extends CheckerAbstract {
	constructor(config?: string[] | string) {
		super(config)
		this.name = name
		this.description = description
	}

	readonly format = "réponse textuelle"

	checkFormat(value: string): string {
		return value ? "" : "Veuillez entrer une réponse"
	}

	checkValue(value: string): string {
		return value ? "" : "Veuillez entrer une réponse"
	}
}
