import { CheckerAbstract } from "@/Checkers/CheckerAbstract"

const name = "string"
const description = "string"

export class StringChecker extends CheckerAbstract {
	constructor(config?: string[] | string) {
		super(config)
		this.name = name
		this.description = description
	}

	get format(): string {
		return "réponse textuelle"
	}

	check(
		expected: string,
		given: string,
	): { result: boolean; message: string } {
		return {
			result: expected === given.toString(),
			message: "",
		}
	}
}
