import { splitAtSigns, splitIfOutsideParentheses } from "@/helpers/helperFunctions.js"
import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import { PiMath } from "pimath/esm"

const name = "exp"
const description = `exp,[paramètres]

**paramètres**
aucun
`

export class ExpChecker extends CheckerAbstract {
    constructor(config?: string[] | string) {
        super(config)
        this.name = name
        this.description = description
    }

    get format(): string {
        return "polynôme avec des exponentielles <br/>\\((x-3)e^{x^2-3}\\)"
    }

    check(expected: string, given: string): {
        result: boolean;
        message: string
    } {
        // Le résultat est exactement ce qui est demandé
        const asciiAnswer = given.startsWith("#") ? given.substring(1) : given

        if (asciiAnswer === expected) {
            return {
                result: true,
                message: ""
            }
        }

        // plusieurs possible:
        // ae^(polynom)
        // ae^(polynom) + be^(polynom)
        // ae^(polynom) + be^(polynom) / ae^(polynom) + be^(polynom)

        // on coupe en numérateur / dénominateur
        // on recherche un endroit qui n'est pas entre parenthèse.
        const [N, D] = splitIfOutsideParentheses(given, "/"),
            [eN, eD] = splitIfOutsideParentheses(expected, "/")

        if (D === undefined && eD !== undefined) {
            return {
                result: false,
                message: "Un dénominateur est attendu..."
            }
        }

        if (D !== undefined && eD === undefined) {
            return {
                result: false,
                message: "Aucun dénominateur n'est prévu dans cette réponse."
            }
        }

        const resultatNumerateur = expCompare(eN, N)

        if (!resultatNumerateur.result) return resultatNumerateur

        // On contrôle les dénominateurs
        if (D !== undefined && eD !== undefined) {
            return expCompare(eD, D)
        }

        return {
            result: true,
            message: ""
        }

    }

}


function expCompare(eValue, value) {
    if (eValue === value) {
        return {
            result: true,
            message: ""
        }
    }

    // On contrôle maintenant les numérateurs
    const elements = splitAtSigns(value),
        expectedElements = splitAtSigns(eValue)

    if (expectedElements.length !== elements.length) {
        return {
            result: false,
            message: "il n'y a pas le bon nombre d'éléments au numérateur"
        }
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
        return {
            result: false,
            message: `Il y a ${errors} élément${errors === 1 ? "" : "s"} qui ${errors === 1 ? "est" : "sont"} faux.`
        }
    }

    return {
        result: true,
        message: ""
    }
}

function displayPolynomForSorting(element: string) {
    const match = element.match(/^(\S+)?(e\^(\S+))$/)

    let poly1, poly2
    if (match) {
        try {
            poly1 = new PiMath.Polynom(match[1]).reorder().display
        } catch {
            poly1 = match[1] ? match[1] : ""
        }
        try {
            poly2 = new PiMath.Polynom(match[3]).reorder().display
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
    try{
        poly3 = new PiMath.Polynom(element).reorder().display
    }catch{
        poly3 = element
    }
    return {
        polynom: element,
        exponent: null,
        sort: poly3
    }

}
