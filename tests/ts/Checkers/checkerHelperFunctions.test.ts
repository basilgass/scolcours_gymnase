import {
	checkParentheses,
	parseCoordinates,
	splitAtSigns,
	splitIfOutsideParentheses,
	stripParenthesis,
} from "@/Checkers/checkerHelperFunctions.ts"
import {describe, expect, test} from "vitest"

describe('splitIfOutsideParentheses - découpage nominal', () => {
	test('découpe sur un séparateur simple à profondeur nulle', () => {
		expect(splitIfOutsideParentheses("a+b", "+")).toEqual(["a", "b"])
	})

	test('ignore un séparateur protégé par des parenthèses', () => {
		expect(splitIfOutsideParentheses("(a+b)+c", "+")).toEqual(["(a+b)", "c"])
	})

	test('découpe entre deux groupes parenthésés', () => {
		expect(splitIfOutsideParentheses("(a+b)+(c)", "+")).toEqual(["(a+b)", "(c)"])
	})

	test('découpe sur la division (séparateur non signé)', () => {
		expect(splitIfOutsideParentheses("N/D", "/")).toEqual(["N", "D"])
	})

	test('renvoie la chaîne entière si le séparateur est absent', () => {
		expect(splitIfOutsideParentheses("abc", "+")).toEqual(["abc"])
	})
})

describe('splitIfOutsideParentheses - signes unaires', () => {
	test('ne découpe pas sur un signe de tête', () => {
		expect(splitIfOutsideParentheses("-a", "-")).toEqual(["-a"])
	})

	test('découpe sur le "-" séparateur mais garde le "-" de tête collé', () => {
		expect(splitIfOutsideParentheses("-a+b", "+")).toEqual(["-a", "b"])
	})

	test('traite "+" après un opérateur comme unaire (pas de découpe sur "-")', () => {
		expect(splitIfOutsideParentheses("2+-3", "-")).toEqual(["2+-3"])
	})

	test('découpe sur le "+" binaire de "2+-3"', () => {
		expect(splitIfOutsideParentheses("2+-3", "+")).toEqual(["2", "-3"])
	})
})

describe('splitIfOutsideParentheses - robustesse', () => {
	test('chaîne vide renvoie un tableau à un élément vide', () => {
		expect(splitIfOutsideParentheses("", "+")).toEqual([""])
	})

	test('une parenthèse fermante en trop rend depth négatif et bloque le découpage', () => {
		// depth passe à -1 dès le ")", donc le "-" n'est jamais vu à depth 0
		expect(splitIfOutsideParentheses("a)-b", "-")).toEqual(["a)-b"])
	})

	test('une parenthèse ouvrante non fermée maintient depth > 0 et bloque le découpage', () => {
		expect(splitIfOutsideParentheses("(a+b", "+")).toEqual(["(a+b"])
	})

	test('gère les espaces autour du signe (défensif, hors format clavier)', () => {
		expect(splitIfOutsideParentheses("a + b", "+")).toEqual(["a ", " b"])
	})
})

describe('stripParenthesis', () => {
	test('retire une enveloppe de parenthèses complète', () => {
		expect(stripParenthesis("(a+b)")).toBe("a+b")
	})

	test('ne touche pas à une chaîne non parenthésée', () => {
		expect(stripParenthesis("x+1")).toBe("x+1")
	})

	test('conserve les parenthèses de deux groupes distincts', () => {
		expect(stripParenthesis("(a)(b)")).toBe("(a)(b)")
	})

	test('ne retire qu\'une seule couche d\'imbrication', () => {
		expect(stripParenthesis("((a))")).toBe("(a)")
	})

	test('gère une parenthèse vide', () => {
		expect(stripParenthesis("()")).toBe("")
	})

	test('robustesse : chaîne vide renvoyée telle quelle', () => {
		expect(stripParenthesis("")).toBe("")
	})

	test('robustesse : parenthèses déséquilibrées internes laissées intactes', () => {
		// depth atteint 0 avant la fin -> pas d'enveloppe globale reconnue
		expect(stripParenthesis("(a))")).toBe("(a))")
	})
})

describe('splitAtSigns', () => {
	test('découpe une somme de groupes en préservant les signes', () => {
		expect(splitAtSigns("(string1)+(string2)-(string3)")).toEqual([
			"(string1)",
			"(string2)",
			"-(string3)",
		])
	})

	test('rattache le signe de tête au premier terme', () => {
		expect(splitAtSigns("-3+x")).toEqual(["-3", "x"])
	})

	test('découpe une expression polynomiale simple', () => {
		expect(splitAtSigns("2x+3y-4z")).toEqual(["2x", "3y", "-4z"])
	})

	test('ne découpe pas à l\'intérieur des parenthèses', () => {
		expect(splitAtSigns("(a+b)-c")).toEqual(["(a+b)", "-c"])
	})

	test('robustesse : filtre les termes vides', () => {
		expect(splitAtSigns("")).toEqual([])
	})
})

describe('parseCoordinates', () => {
	test('extrait un couple de coordonnées', () => {
		expect(parseCoordinates("(1;2)")).toEqual(["1", "2"])
	})

	test('extrait un triplet de coordonnées', () => {
		expect(parseCoordinates("(1;2;3)")).toEqual(["1", "2", "3"])
	})

	test('gère une composante unique', () => {
		expect(parseCoordinates("(5)")).toEqual(["5"])
	})

	test('conserve les expressions comme composantes', () => {
		expect(parseCoordinates("(a+b;c-d)")).toEqual(["a+b", "c-d"])
	})
})

describe('checkParentheses', () => {
	test('accepte une chaîne encadrée de parenthèses', () => {
		expect(checkParentheses("(1;2)")).toBe(true)
	})

	test('refuse une chaîne sans parenthèses', () => {
		expect(checkParentheses("1;2")).toBe(false)
	})

	test('refuse une parenthèse fermante manquante', () => {
		expect(checkParentheses("(1;2")).toBe(false)
	})

	test('refuse une parenthèse ouvrante manquante', () => {
		expect(checkParentheses("1;2)")).toBe(false)
	})

	test('robustesse : refuse la chaîne vide', () => {
		expect(checkParentheses("")).toBe(false)
	})
})
