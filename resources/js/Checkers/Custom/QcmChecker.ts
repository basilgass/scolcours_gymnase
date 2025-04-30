import {CheckerAbstract} from "../CheckerAbstract";
import {CHECKERS} from "../checker.config";

const name = "qcm"
const description = "qcm,[paramètres]"

export class QcmChecker extends CheckerAbstract{
	readonly format = ""

	constructor(config: string[]|string){
		super(config)
		this.type = CHECKERS.QCM
		this.description = description
	}

}
