import {NumberChecker} from "@/Checkers/NumberChecker"
import {PolynomChecker} from "@/Checkers/PolynomChecker"
import {ScientificChecker} from "@/Checkers/ScientificChecker"
import {StringChecker} from "@/Checkers/StringChecker"
import {TableofsignChecker} from "@/Checkers/TableofsignChecker"
import {SolutionChecker} from "@/Checkers/SolutionChecker"
import {ExactChecker} from "@/Checkers/ExactChecker"
import {StudyChecker} from "@/Checkers/StudyChecker"
import {RationalChecker} from "@/Checkers/RationalChecker"
import {CoordChecker} from "@/Checkers/CoordChecker"
import {VectorChecker} from "@/Checkers/VectorChecker"
import {EquationChecker} from "@/Checkers/EquationChecker"
import {FractionChecker} from "@/Checkers/FractionChecker"
import {FunctionChecker} from "@/Checkers/FunctionChecker"
import {LogChecker} from "@/Checkers/LogChecker"
import {ExpChecker} from "@/Checkers/ExpChecker"
import {CheckerBase} from "@/Checkers/CheckerBase";

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
        default:
            return StringChecker
    }

    return null

}

export function getChecker(checker: string, options?: string[]): CheckerBase {
    let chkClass = getCheckerClass(checker)

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
    let [name, ...config] = checker.split(',')

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
