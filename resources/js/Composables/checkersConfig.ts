import { NumberChecker } from "@/Checkers/Basic/NumberChecker"
import { PolynomChecker } from "@/Checkers/Basic/PolynomChecker"
import { ScientificChecker } from "@/Checkers/Basic/ScientificChecker"
import { StringChecker } from "@/Checkers/Basic/StringChecker"
import { TableofsignChecker } from "@/Checkers/TableofsignChecker"
import { SolutionChecker } from "@/Checkers/Basic/SolutionChecker"
import { ExactChecker } from "@/Checkers/Basic/ExactChecker"
import { StudyChecker } from "@/Checkers/StudyChecker"
import { RationalChecker } from "@/Checkers/Basic/RationalChecker"
import { CoordChecker } from "@/Checkers/Basic/CoordChecker"
import { VectorChecker } from "@/Checkers/Basic/VectorChecker"
import { EquationChecker } from "@/Checkers/Basic/EquationChecker"
import { FractionChecker } from "@/Checkers/Basic/FractionChecker"
import { FunctionChecker } from "@/Checkers/Basic/FunctionChecker"
import { LogChecker } from "@/Checkers/Basic/LogChecker"
import { ExpChecker } from "@/Checkers/Basic/ExpChecker"
import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import { PrimitiveChecker } from "@/Checkers/Basic/PrimitiveChecker"

export interface CheckerResult {
    result: boolean,
    message: string
}

export const checkersList: string[] = [
    "coord",
    "equ", "equation",
    "exact",
    "exp",
    "fr", "frac", "fraction",
    "fn", "function",
    "input",
    "log",
    "nb", "number",
    "order",
    "polynom",
    "qcm",
    "rational",
    "scn", "scientific",
    "sol", "solution",
    "string",
    "study",
    "tos",
    "type",
    "vector"
]

export function getCheckerClass(checker: string) {
    switch (checker) {
        case "exact":
            return ExactChecker
        case "polynom":
            return PolynomChecker
        case "rational":
            return RationalChecker
        case "equ":
        case "equation":
            return EquationChecker
        case "fn":
        case "function":
            return FunctionChecker
        case "nb":
        case "number":
            return NumberChecker
        case "fr":
        case "frac":
        case "fraction":
            return FractionChecker
        case "scn":
            return ScientificChecker
        case "tos":
            return TableofsignChecker
        case "study":
            return StudyChecker
        case "sol":
        case "solution":
            return SolutionChecker
        case "coord":
            return CoordChecker
        case "vector":
            return VectorChecker
        case "log":
            return LogChecker
        case "exp":
            return ExpChecker
		case "primitive":
			return PrimitiveChecker
        default:
            return StringChecker
    }


}

export function getChecker(checker: string, options?: string[]): CheckerAbstract {
    const chkClass = getCheckerClass(checker)

    // No options are defined.
    if (options === undefined) {
        options = []
    }

    if (chkClass !== null) {
        return new chkClass(options)
    }

    return new StringChecker(options)
}

export function customCheck(checker: string, expected: string, given: string): CheckerResult {
	const chkSplit = checker.split(',')
	const [name] = chkSplit
    let [, ...config] = chkSplit

    const chkClass = getCheckerClass(name)

    if (chkClass) {
        if (config === undefined) {
            config = []
        }

        return new chkClass(config).check(expected, given)
    } else {
        return {
            result: false,
            message: "Problème de configuration du checker"
        }
    }
}
