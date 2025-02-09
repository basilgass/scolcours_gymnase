import {CheckerAbstract} from "@/Checkers/CheckerAbstract.ts"

const name = "order"
const description = `order,[paramètres]

**paramètres**
aucun
`

export class OrderChecker extends CheckerAbstract {

	constructor(config: string[] | string) {
		super(config)
		this.name = name
		this.description = description
	}

	checkFormat(value: string): string {
		return value ? "" : "La valeur ne doit pas être vide"
	}

	checkValue(value: string): string {
		return value ? "" : "La valeur ne doit pas être vide"
	}

	readonly format = ""

}
