import {CheckerAbstract} from "@/Checkers/CheckerAbstract.ts"

const name = "qcm"
const description = "qcm,[paramètres]"

export class QcmChecker extends CheckerAbstract{
	readonly format = ""

	constructor(config: string[]|string){
		super(config)
		this.name = name
		this.description = description
	}
	checkFormat(value: string): string {
		return value ? "" : "Veuillez donner une réponse"
	}

	checkValue(value: string): string {
		return value ? "" : "Veuillez donner une réponse"
	}


}
