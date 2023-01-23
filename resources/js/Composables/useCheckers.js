import {NumberChecker} from "@/Composables/Checkers/NumberChecker"
import {PolynomChecker} from "@/Composables/Checkers/PolynomChecker"
import {ScientificChecker} from "@/Composables/Checkers/ScientificChecker"
import {StringChecker} from "@/Composables/Checkers/StringChecker"
import {TableofsignChecker} from "@/Composables/Checkers/TableofsignChecker"
import {SolutionChecker} from "@/Composables/Checkers/SolutionChecker"
import {ExactChecker} from "@/Composables/Checkers/ExactChecker"
import {StudyChecker} from "@/Composables/Checkers/StudyChecker"
import {RationalChecker} from "@/Composables/Checkers/RationalChecker"
import {CoordChecker} from "@/Composables/Checkers/CoordChecker"
import {VectorChecker} from "@/Composables/Checkers/VectorChecker"

export const checkersList = {
	"polynom": ["factors", "develop"],
	"qolynom": ["factors", "develop", "reduced"],
	"nb":  ["1", "2", "3", "4"],
	"scn": ["1", "2", "3", "4"],
	"tos": [],
	"sol": [],
	"exact": [],
	"study": [],
}

export function useCheckers(checkerData) {
	// checkerData = checker,opt1,opt2,opt3
	let options = checkerData.split(",")
	let checker = options.shift()

	switch (checker) {
	case "exact":
		return ExactChecker(options)
	case "polynom":
		return PolynomChecker(options)
	case "rational":
		return RationalChecker(options)
	case "nb" || "number":
		return NumberChecker(options)
	case "scn":
		return ScientificChecker(options)
	case "tos":
		return TableofsignChecker(options)
	case "study":
		return StudyChecker(options)
	case "sol":
		return SolutionChecker(options)
	case "coord":
		return CoordChecker(options)
	case "vector":
		return VectorChecker(options)

	default:
		return StringChecker(options)
	}
}


export function stripFirstCharacter(value){
	return value.substring(1)
}
export function stripLastCharacter(value){
	return value.substring(0, value.length-1)
}
