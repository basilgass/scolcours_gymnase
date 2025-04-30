import {CheckerAbstract} from "../CheckerAbstract";
import {CHECKERS} from "../checker.config";

const name = "type"
const description = "type"

export class TypeChecker extends CheckerAbstract {
    constructor(config:string[]|string) {
        super(config)
        this.type = CHECKERS.TYPE
        this.description = description
    }


    readonly format = "Cliquer sur les bonnes lettres."

}
