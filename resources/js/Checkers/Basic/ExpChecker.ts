import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {splitAtSigns, splitIfOutsideParentheses} from "../checkerHelperFunctions.ts"
import {Polynom} from "pimath"
import {CheckerResult, CHECKERS} from "../checker.config"

// const name = "exp"
const description = `exp,[paramètres]

**paramètres**
aucun
`

export class ExpChecker extends CheckerAbstract {
    constructor(config?: string[] | string) {
        super(config)
        this.type = CHECKERS.EXPONENTIAL
        this.description = description
    }

    readonly format = "polynôme avec des exponentielles <br/>\\((x-3)e^{x^2-3}\\)"

    override checkValue(value: string): CheckerResult {
        // plusieurs possible:
        // ae^(polynom)
        // ae^(polynom) + be^(polynom)
        // ae^(polynom) + be^(polynom) / ae^(polynom) + be^(polynom)

        // on coupe en numérateur / dénominateur
        // on recherche un endroit qui n'est pas entre parenthèse.
        const [N, D] = splitIfOutsideParentheses(value, "/"),
            [eN, eD] = splitIfOutsideParentheses(this.answer, "/")

        if (D === undefined && eD !== undefined) {
            return makeCheckerResult("Un dénominateur est attendu...")
        }

        if (D !== undefined && eD === undefined) {
            return makeCheckerResult("Aucun dénominateur n'est prévu dans cette réponse.")
        }

        const resultatNumerateur = expCompare(eN, N)

        if (resultatNumerateur !== "") return makeCheckerResult(resultatNumerateur)

        // On contrôle les dénominateurs
        if (D !== undefined && eD !== undefined) {
            return makeCheckerResult(expCompare(eD, D))
        }

        return makeCheckerResult()
    }

}


function expCompare(eValue: string, value: string): string {
    if (eValue === value) {
        return ""
    }

    // On contrôle maintenant les numérateurs
    const elements = splitAtSigns(value),
        expectedElements = splitAtSigns(eValue)

    if (expectedElements.length !== elements.length) {
        return "Il n'y a pas le bon nombre d'éléments au numérateur"
    }

    // Chaque élément est maintenant de la forme
    // (polynom)e^(polynom)

    // Préparation de tous les éléments sous la forme d'un tableau:
    // [ {polynom, exponent} ]
    const elementsArr: {
        polynom: string,
        exponent: string,
        sort: string
    }[] = elements.map(element => {
        return displayPolynomForSorting(element)
    }).sort((a, b) => {
        return a.sort < b.sort ? 1 : -1
    })

    const expectedElementsArr: {
        polynom: string,
        exponent: string,
        sort: string
    }[] = expectedElements.map(element => {
        return displayPolynomForSorting(element)
    }).sort((a, b) => {
        return a.sort < b.sort ? 1 : -1
    })

    // Tous les éléments sont "alignés"
    let errors = 0
    for (let i = 0; i < expectedElementsArr.length; i++) {
        if (expectedElementsArr[i].sort !== elementsArr[i].sort) {
            errors++
        }
    }
    if (errors > 0) {
        return `Il y a ${errors} élément${errors === 1 ? "" : "s"} qui ${errors === 1 ? "est" : "sont"} faux.`
    }

    return ""
}

function displayPolynomForSorting(element: string): { polynom: string, exponent: string, sort: string } {
    const match = element.match(/^(\S+)?(e\^(\S+))$/)

    let poly1, poly2
    if (match) {
        try {
            poly1 = new Polynom(match[1]).reorder().display
        } catch {
            poly1 = match[1] ? match[1] : ""
        }
        try {
            poly2 = new Polynom(match[3]).reorder().display
        } catch {
            poly2 = match[3] ? match[3] : ""
        }

        return {
            polynom: match[1],
            exponent: match[3],
            sort: poly1 + poly2,
        }
    }

    let poly3
    try {
        poly3 = new Polynom(element).reorder().display
    } catch {
        poly3 = element
    }
    return {
        polynom: element,
        exponent: "",
        sort: poly3
    }

}
