import {CheckerBase} from "@/Checkers/CheckerBase";

const name="exact"
const description = "exact"

export class ExactChecker extends CheckerBase {
	constructor(config:string[]|string) {
		super(config);
		this.name =name
		this.description = description
	}

	check(expected: string, given: string): { result: boolean; message: string } {
        // Le résultat est exactement ce qui est demandé
        const stringAnswer = given.toString(),
            asciiAnswer = stringAnswer.startsWith("#")?stringAnswer.substring(1):stringAnswer

        if (asciiAnswer === expected.toString()) {
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
		return "réponse sous forme exacte, réduite"
	}

}
