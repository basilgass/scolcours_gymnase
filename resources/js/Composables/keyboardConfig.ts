import AsciiMathParser from "@/asciimath2tex"
import {resolveLayoutKey} from "@/Composables/keyboardRegistry.ts"
import {formatFractionShortcut, type KeyboardFormatter} from "@/Composables/keyboardFormatting.ts"

export interface keyboardKey {
	display: string
	fn?: (value: string) => string
	key?: string
	span?: number | string // numérique en config (tuple), traduit en classe Tailwind (col-span-N) à l'affichage
	type: string
	visible?: boolean
}

/**
 * Une entrée de layout peut s'écrire sous trois formes :
 *  - chaîne `"1"` : touche simple ;
 *  - tuple `["=", 2]` : touche + largeur (col-span) ;
 *  - objet `{key, display, type}` : touche personnalisée inline.
 * Elles sont ramenées à une forme unique par {@link normalizeLayoutKey}.
 */
export type LayoutKey = string | [string, number] | { key: string, display: string, type: string }

/** Forme canonique unique d'une entrée de layout, consommée par le composant. */
export interface NormalizedLayoutKey {
	key: string
	span: number
	inlineKey?: keyboardKey
}

/**
 * Convertit n'importe laquelle des trois formes d'écriture d'une entrée de layout
 * en {@link NormalizedLayoutKey}. C'est l'étape « forme unique » : elle isole
 * l'interprétation de la forme, pour que le composant n'ait plus à la deviner.
 */
export function normalizeLayoutKey(entry: LayoutKey): NormalizedLayoutKey {
	if (typeof entry === "string") {
		return {key: entry, span: 0}
	}
	if (Array.isArray(entry)) {
		return {key: entry[0], span: entry[1]}
	}
	return {key: Object.hasOwn(entry, "key") ? entry.key : "", span: 0, inlineKey: entry}
}

/**
 * Descripteur déclaratif d'un clavier, tel que stocké dans le registre {@link keyboards}.
 *
 * @property grid       Classe de grille CSS (ex. `"grid-cols-7"`).
 * @property keys       Surcharges de touches par code (optionnel).
 * @property layout     Disposition des touches, chaque entrée étant un {@link LayoutKey}
 *                      (chaîne, tuple `[key, span]` ou objet inline), normalisé par
 *                      {@link normalizeLayoutKey}.
 * @property name       Nom du clavier (optionnel).
 * @property tex        Traduit la saisie en TeX ; identité si absent.
 * @property formatters Règles de formatage de la saisie brute appliquées par
 *                      KeyboardDisplay (ex. raccourci fraction `//`) ; absent = aucune.
 */
export interface KeyboardObjectType {
	grid: string
	keys?: Record<string, keyboardKey>
	layout: LayoutKey[]
	name?: string
	tex?: (value: string) => string // Type of the returned value can be changed according to actual function implementation
	// Réservé aux claviers où un numérateur composé a du sens (touche /, parenthèses et variable).
	formatters?: KeyboardFormatter[]
}


/**
 * Returns the corresponding type of keyboard given a checker parameter.
 *
 * @param {string} kbrd - The input parameter representing the type of keyboard.
 * @return {string} The type of keyboard based on the input parameter. Returns the input parameter if no match is found.
 */
export function keyboardMaps(kbrd: string): string {
	// Délègue au registre (source unique de vérité). Retourne le token inchangé
	// si aucun mapping — comportement identique à l'ancien switch.
	return resolveLayoutKey(kbrd)
}

/**
 * @typedef {Object} KeyObject
 * @property {string} type - The type of the key, either "math" or "icon".
 * @property {string} display - The display value of the key.
 */
export const keyboardKeys = {
	"0": {type: "math", display: "0"},
	"1": {type: "math", display: "1"},
	"2": {type: "math", display: "2"},
	"3": {type: "math", display: "3"},
	"4": {type: "math", display: "4"},
	"5": {type: "math", display: "5"},
	"6": {type: "math", display: "6"},
	"7": {type: "math", display: "7"},
	"8": {type: "math", display: "8"},
	"9": {type: "math", display: "9"},
	"+": {type: "math", display: "+"},
	"-": {type: "math", display: "-"},
	"*": {type: "math", display: "\\times"},
	"/": {type: "math", display: "\\div"},
	x: {type: "math", display: "x"},
	k: {type: "math", display: "k"},
	"x^2": {type: "math", display: "x^2"},
	"x^3": {type: "math", display: "x^3"},
	"x^4": {type: "math", display: "x^4"},
	"x^5": {type: "math", display: "x^5"},
	"x^6": {type: "math", display: "x^6"},
	"^2": {type: "math", display: "\\textcolor{lightgray}{x}^2"},
	"^3": {type: "math", display: "\\textcolor{lightgray}{x}^3"},
	"^": {type: "math", display: "x^y"},
	"10^": {type: "math", display: "10^x"},
	sqrt: {type: "math", display: "\\sqrt{\\phantom{x}}"},
	"root(3)": {type: "math", display: "\\sqrt[3]{\\phantom{x}}"},
	"root(": {type: "math", display: "\\sqrt[n]{\\phantom{x}}"},
	log: {type: "math", display: "\\log"},
	_: {type: "math", display: "\\textcolor{lightgray}{\\log}_a"},
	sin: {type: "math", display: "\\sin"},
	cos: {type: "math", display: "\\cos"},
	tan: {type: "math", display: "\\tan"},
	"|": {
		type: "math",
		display: "\\big\\vert \\textcolor{lightgray}{x} \\big\\vert"
	},
	y: {type: "math", display: "y"},
	"y^2": {type: "math", display: "y^2"},
	"y^3": {type: "math", display: "y^3"},
	"y^4": {type: "math", display: "y^4"},
	"y^5": {type: "math", display: "y^5"},
	"y^6": {type: "math", display: "y^6"},
	z: {type: "math", display: "z"},
	"z^2": {type: "math", display: "z^2"},
	"z^3": {type: "math", display: "z^3"},
	"z^4": {type: "math", display: "z^4"},
	"z^5": {type: "math", display: "z^5"},
	"z^6": {type: "math", display: "z^6"},
	e: {type: "math", display: "\\text{e}"},
	ln: {type: "math", display: "\\ln"},
	pi: {type: "math", display: "\\pi"},
	"(": {type: "math", display: "("},
	")": {type: "math", display: ")"},
	"{": {type: "math", display: "\\{"},
	"}": {type: "math", display: "\\}"},
	"[": {type: "math", display: "["},
	"]": {type: "math", display: "]"},
	"=": {type: "math", display: "="},
	" ": {type: "math", display: "\\cdot"},
	".": {type: "math", display: "."},
	";": {type: "math", display: ";"},
	RR: {type: "math", display: "\\mathbb{R}"},
	"RR_+": {type: "math", display: "\\mathbb{R}_+"},
	"RR_-": {type: "math", display: "\\mathbb{R}_-"},
	"^**": {type: "math", display: "\\textcolor{lightgray}{\\mathbb{R}}^*"},
	"\\\\": {
		type: "math",
		display: "\\setminus \\textcolor{lightgray}{ E } "
	},
	"+c": {type: "math", display: "+c"},
	uu: {type: "math", display: "\\cup"},
	not: {type: "math", display: "\\neg"},
	nn: {type: "math", display: "\\cap"},
	oo: {type: "math", display: "\\infty"},
	mod: {type: "math", display: "\\mod{}"},
	"+-": {type: "math", display: "\\pm"},
	"-+": {type: "math", display: "\\mp"},
	"!!": {type: "math", display: "\\varnothing"},
	"@reset": {type: "icon", display: "bi bi-trash"},
	"@back": {type: "icon", display: "bi bi-backspace"}
}

/**
 * The `keyboards` object is used to store the layout and transformation functions for different types of keyboards.
 * Each keyboard is represented as a key-value pair, where the key is the name of the keyboard and the value is an object containing the following properties:
 *
 * @typedef {Object} Keyboard
 * @property {string} name - The name of the keyboard.
 * @property {string} grid - The CSS class for the grid layout of the keyboard.
 * @property {string[]} layout - An array representing the layout of the keyboard keys.
 * @property {function} tex - A function that converts the ASCII representation of a key into its corresponding LaTeX representation.
 */
export const keyboards: Record<string, KeyboardObjectType> = {
	// "qcm": {
	// 	name: "qcm",
	// 	grid: "grid-cols-4",
	// 	layout: [],
	// 	tex(value) {
	// 		return value.startsWith("#") ? asciiToTex(value.substring(1)) : value
	// 	}
	// },
	algebra: {
		name: "algebra",
		grid: "grid-cols-7",
		layout: [
			"1", "2", "3", "+", "x", "y", "pi",
			"4", "5", "6", "-", "^2", "^", "e",
			"7", "8", "9", "*", "sqrt", "root(", "ln",
			".", "0", "=", "/", "(", ")", "|",
			["sin", 2], ["cos", 2], ["tan", 2], ";"
		],
		formatters: [formatFractionShortcut],
		tex(value) {
			return asciiToTex(value)
		}
	},
	coord: {
		name: "coord",
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "-",
			"4", "5", "6", "", "/",
			"7", "8", "9", "^2", "sqrt",
			"", "0", ".", "^", "root(",
			"(", ";", ")", "pi", "e"
		],
		tex: function (value) {
			return buildCoordinateTex(value)
		}
	},
	equation: {
		name: "equation",
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "x", "x^2",
			"4", "5", "6", "-", "y", "y^2",
			"7", "8", "9", "*", "^2", "^",
			"(", ")", "0", "/", ["=", 2]
		],
		formatters: [formatFractionShortcut],
		tex(value) {
			return asciiToTex(value)
		}
	},
	cartesian: {
		name: "cartesian",
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "-", "=",
			"4", "5", "6", "*", "/", "^2",
			"7", "8", "9", "(", ")", "^3",
			"", "0", "", "x", "y", "z",
		],
		formatters: [formatFractionShortcut],
		tex(value) {
			return asciiToTex(value)
		}
	},
	exact: {
		name: "exact",
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "-",
			"4", "5", "6", "", "/",
			"7", "8", "9", "^2", "^",
			"0", "(", ")", "sqrt", "root(",
			"log", "_", "ln", "pi", "e",
			"oo", "", "", "RR", "!!"
		],
		tex: function (value) {
			// Apply this for all splited.
			return value
				.split(",")
				.map((v) => makeExactFromAscii(v))
				.join(",")
		}
	},
	fraction: {
		name: "fraction",
		grid: "grid-cols-3",
		layout: [
			"1", "2", "3",
			"4", "5", "6",
			"7", "8", "9",
			"-", "0", "/",
		],
		tex(value) {
			return asciiToTex(value)
		}
	},
	'fraction+': {
		name: "fraction",
		grid: "grid-cols-3",
		layout: [
			"1", "2", "3",
			"4", "5", "6",
			"7", "8", "9",
			"-", "0", "/",
			["=", 3]],
		tex(value) {
			return asciiToTex(value)
		}
	},
	function: {
		name: "function",
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "x", "x^2",
			"4", "5", "6", "-", "y", "y^2",
			"7", "8", "9", "*", "^2", "^",
			"(", ")", "0", "/"
		],
		formatters: [formatFractionShortcut],
		tex(value) {
			return asciiToTex(value)
		}
	},
	limit: {
		name: "limit",
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "-",
			"4", "5", "6", "*", "/",
			"7", "8", "9", "sqrt", "root(",
			"0", "", "+-", "-+", "oo"
		],
		tex: function (value) {
			// Apply this for all values.
			return value
				.split(",")
				.map((v) => makeExactFromAscii(v))
				.join(",")
		}
	},
	number: {
		name: "number",
		grid: "grid-cols-3",
		layout: [
			"1", "2", "3",
			"4", "5", "6",
			"7", "8", "9",
			"-", "0", "."
		],
		tex(value) {
			return asciiToTex(value)
		}
	},
	polynom: {
		name: "polynom",
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "x", "x^2",
			"4", "5", "6", "-", "x^3", "x^4",
			"7", "8", "9", "*", "y", "z",
			"(", ")", "0", "/", "^2", "^"
		],
		formatters: [formatFractionShortcut],
		tex: function (value) {
			return asciiToTex(value)
		}
	},
	pow: {
		name: "pow",
		grid: "grid-cols-4",
		layout: [
			"1", "2", "3", "-",
			"4", "5", "6", "^",
			"7", "8", "9", "/",
			"", "0", "(", ")"
		],
		tex(value) {
			return asciiToTex(value)
		}
	},
	primitive: {
		name: "primitive",
		grid: "grid-cols-7",
		layout: [
			"1", "2", "3", "+", "x", "y", "e",
			"4", "5", "6", "-", "^2", "^", "ln",
			"7", "8", "9", "*", "sqrt", "root(", "|",
			"0", "=", "/", "(", ")", ["+c", 2]
		],
		formatters: [formatFractionShortcut],
		tex(value) {
			return asciiToTex(value)
		}
	},
	rational: {
		name: "rational",
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "x", "x^2",
			"4", "5", "6", "-", "x^3", "x^4",
			"7", "8", "9", "/", "^2", "^",
			"(", ")", "0", "", "", ""
		],
		formatters: [formatFractionShortcut],
		tex: function (value) {
			const [Pnum, Pden] = value.split("/")
			return Pden === undefined
				? asciiToTex(Pnum)
				: `\\frac{ ${asciiToTex(Pnum)} }{ ${asciiToTex(Pden)} }`
		}
	},
	scientific: {
		name: "scientific",
		grid: "grid-cols-4",
		layout: [
			"1", "2", "3", "-",
			"4", "5", "6", "*",
			"7", "8", "9", "10^",
			"", "0", ".", ""
		],
		tex(value) {
			return asciiToTex(value)
		}
	},
	simple: {
		name: "simple",
		grid: "grid-cols-4",
		layout: [
			"1", "2", "3", "+",
			"4", "5", "6", "-",
			"7", "8", "9", "*",
			"", "0", ".", "/"
		],
		tex(value) {
			return asciiToTex(value)
		}
	},
	solution: {
		name: "solution",
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "^2",
			"4", "5", "6", "-", "^",
			"7", "8", "9", "/", "sqrt",
			".", "0", "(", ")", "root(",
			"log", "_", "ln", "e", "pi",
			"{", ";", "}", "[", "]",
			"RR", "RR_+", "RR_-", "^**", "!!",
			"\\\\", "uu", "oo", "", "k"
		],
		tex: function (value) {

			let tex = asciiToTex(
				value
					.replace(/([0-9]*pi)\/([0-9]*)/g, (match, num, den) => `(${num})/${den}`)
					.replace("RR_+", "RR_(+)")
					.replace("RR_-", "RR_(-)")
			)

			let isOpened = false
			tex = tex
				.replaceAll("\\left [", "[")
				.replaceAll("\\left ]", "]")
				.replaceAll("\\right [", "[")
				.replaceAll("\\right ]", "]")
				.replaceAll("\\right.", "")
				.replaceAll("\\left.", "")
				.split("")
				.map((c) => {
					if (c === "]" || c === "[") {
						const bigBracket = `\\${isOpened ? "right" : "left"
						} ${c}`
						isOpened = !isOpened
						return bigBracket
					} else {
						return c
					}
				})
				.join("")

			while (tex.split("\\left").length !== tex.split("\\right").length) {
				tex += "\\right."
			}

			return tex
		}
	},
	angle: {
		name: "angle",
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "-",
			"4", "5", "6", "/",
			"7", "8", "9", "+",
			".", "0", "k", "pi"
		],
		tex(value) {
			// the angle input should be 2pi/3+k2pi/2
			// convert to: (2pi)/3+k(2pi)/3

			const converted = value.replaceAll(/([0-9]*pi)\//g, '($1)/')
			return asciiToTex(converted)
		}
	},
	vector: {
		name: "vector",
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "-",
			"4", "5", "6", "", "/",
			"7", "8", "9", "^2", "sqrt",
			"", "0", ".", "^", "root(",
			"(", ";", ")", "pi", "e"
		],
		tex: function (value) {
			return buildVectorialTex(value)
		}
	},
	mod: {
		name: "modulo",
		grid: "grid grid-cols-3",
		layout: [
			"1", "2", "3",
			"4", "5", "6",
			"7", "8", "9",
			"-", "0", "mod",
		],
		tex: function (value) {
			return asciiToTex(value)
		}
	}
}

function buildCoordinateTex(value: string) {
	const [...coords] = value.split(";")
	let lp = ""
	let rp = ""

	if (coords[0].startsWith("(")) {
		lp = "\\left("
		coords[0] = coords[0].substring(1)
		rp = "\\right."
	}

	if (coords[coords.length - 1].endsWith(")")) {
		if (lp === "") {
			lp = "\\left."
		}
		rp = "\\right)"
		coords[coords.length - 1] = coords[coords.length - 1].substring(
			0,
			coords[coords.length - 1].length - 1
		)
	}

	return `${lp}${coords
		.map((x) => {
			const tex = makeExactFromAscii(x)
			return tex === "" ? "\\phantom{ }" : tex
		})
		.join(";")}${rp}`
}

function buildVectorialTex(value: string) {
	const [...coords] = value.split(";")
	let lp = ""
	let rp = ""

	if (coords[0].startsWith("(")) {
		lp = "\\left("
		coords[0] = coords[0].substring(1)
		rp = "\\right."
	}
	if (coords[coords.length - 1].endsWith(")")) {
		if (lp === "") {
			lp = "\\left."
		}
		rp = "\\right)"
		coords[coords.length - 1] = coords[coords.length - 1].substring(
			0,
			coords[coords.length - 1].length - 1
		)
	}

	return `${lp}\\begin{matrix}${coords
		.map((x) => {
			const tex = makeExactFromAscii(x)
			return tex === "" ? "\\phantom{ }" : tex
		})
		.join("\\\\")}\\end{matrix}${rp}`
}

/**
 * Converts ASCII math expression to TeX format.
 *
 * @param {string} value - The ASCII math expression to be converted.
 * @return {string} - The TeX formatted string.
 */
export function asciiToTex(value: string): string {
	const parser = new AsciiMathParser()

	// if value ends with '^', add a box
	if (value.endsWith('^')) {
		// asciimath boxed
		value += 'square'
	}

	// Force display style
	return parser.parse(value)
}

/**
 * Converts an ASCII string to an exact string.
 *
 * @param {string} value - The ASCII string to convert.
 * @return {string} - The converted exact string.
 */
function makeExactFromAscii(value: string): string {
	// REFACTOR : could be refactored using checker helper functions ?
	if (value === undefined || value === "") {
		return ""
	}

	// Aucune division - pas de problème, c'est du ascii.
	if (!value.includes("/")) {
		return asciiToTex(value)
	}

	const numden = value.split("/")
	let stack = []
	let parentheses = 0
	const result: string[] = []

	for (const item of numden) {
		parentheses += item.split("(").length - item.split(")").length
		if (parentheses !== 0) {
			stack.push(item)
		} else {
			stack.push(item)
			result.push(stack.join("/"))
			stack = []
		}
	}

	if (stack.length > 0) {
		result.push(stack.join("/"))
	}

	return asciiToTex(
		result.length === 1 ? result[0] : result.map((x) => `(${x})`).join("/")
	)
}
