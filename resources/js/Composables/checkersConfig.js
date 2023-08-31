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
import {EquationChecker} from "@/Composables/Checkers/EquationChecker"
import {FractionChecker} from "@/Composables/Checkers/FractionChecker"
import {FunctionChecker} from "@/Composables/Checkers/FunctionChecker"
import {LogChecker} from "@/Composables/Checkers/LogChecker"
import {InputChecker} from "@/Composables/Checkers/InputChecker"
import {OrderChecker} from "@/Composables/Checkers/OrderChecker"
import {QcmChecker} from "@/Composables/Checkers/QcmChecker"
import {TypeChecker} from "@/Composables/Checkers/TypeChecker"
import {ExpChecker} from "@/Composables/Checkers/ExpChecker"

export function checkersConfig(checkerData) {
	// checkerData =[checker,opt1,opt2,opt3]

	let options = []

	if(typeof checkerData === "string"){
		options = checkerData.split(",")
	}else{
		options = [...checkerData]
	}

	let checker = options.shift().toLowerCase()

	switch (checker) {
	case "exact":
		return ExactChecker(options)
	case "polynom":
		return PolynomChecker(options)
	case "rational":
		return RationalChecker(options)
	case "equ":
	case "equation":
		return EquationChecker(options)
	case "fn":
	case "function":
		return FunctionChecker(options)
	case "nb":
	case "number":
		return NumberChecker(options)
	case "fr":
	case "frac":
	case "fraction":
		return FractionChecker(options)
	case "scn":
		return ScientificChecker(options)
	case "tos":
		return TableofsignChecker(options)
	case "study":
		return StudyChecker(options)
	case "sol":
	case "solution":
		return SolutionChecker(options)
	case "coord":
		return CoordChecker(options)
	case "vector":
		return VectorChecker(options)
	case "log":
		return LogChecker(options)
	case "exp":
		return ExpChecker(options)
	default:
		return StringChecker(options)
	}
}

export function getCheckers() {
	let list = {}
	list[CoordChecker().name] = CoordChecker()
	list[EquationChecker().name] = EquationChecker()
	list[ExactChecker().name] = ExactChecker()
	list[ExpChecker().name] = ExpChecker()
	list[FractionChecker().name] = FractionChecker()
	list[FunctionChecker().name] = FunctionChecker()
	list[InputChecker().name] = InputChecker()
	list[LogChecker().name] = LogChecker()
	list[NumberChecker().name] = NumberChecker()
	list[OrderChecker().name] = OrderChecker()
	list[PolynomChecker().name] = PolynomChecker()
	list[QcmChecker().name] = QcmChecker()
	list[RationalChecker().name] = RationalChecker()
	list[ScientificChecker().name] = ScientificChecker()
	list[SolutionChecker().name] = SolutionChecker()
	list[StringChecker().name] = StringChecker()
	list[StudyChecker().name] = StudyChecker()
	list[TableofsignChecker().name] = TableofsignChecker()
	list[TypeChecker().name] = TypeChecker()
	list[VectorChecker().name] = VectorChecker()

	return list
}
export function stripFirstCharacter(value){
	return value.substring(1)
}
export function stripLastCharacter(value){
	return value.substring(0, value.length-1)
}
