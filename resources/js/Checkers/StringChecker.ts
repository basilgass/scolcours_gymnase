import {CheckerBase} from "@/Checkers/CheckerBase";

const name = "string"
const description = "string"

export class StringChecker extends CheckerBase {
	constructor(config?:string[]|string) {
		super(config);
		this.name = name
		this.description = description
	}

	check(expected: string, given: string): { result: boolean; message: string } {
		return {
			result: expected === given.toString(),
			message: ""
		}

	}

	get format(): string {
		return "réponse textuelle";
	}

}
