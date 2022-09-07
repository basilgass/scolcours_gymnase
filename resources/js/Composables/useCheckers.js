import {NumberChecker} from "@/Composables/Checkers/NumberChecker";
import {PolynomChecker} from "@/Composables/Checkers/PolynomChecker";
import {ScientificChecker} from "@/Composables/Checkers/ScientificChecker";
import {StringChecker} from "@/Composables/Checkers/StringChecker";
import {TableofsignChecker} from "@/Composables/Checkers/TableofsignChecker";
import {SolutionChecker} from "@/Composables/Checkers/SolutionChecker";
import {ExactChecker} from "@/Composables/Checkers/ExactChecker";

export const checkersList = [
	'polynom',
	'nb',
	'scn',
	'tos',
	'sol',
	'exact'
]
export function useCheckers(checkerData) {
	const options = checkerData.split("@"),
		checker = options.shift()

	switch(checker){
		case "exact":
			return ExactChecker(options)
		case "polynom":
			return PolynomChecker(options)
		case "nb":
			return NumberChecker(options)
		case "scn":
			return ScientificChecker(options)
		case "tos":
			return TableofsignChecker(options)
		case "sol":
			return SolutionChecker(options)

		default:
			return StringChecker(options)
	}
}
