import AsciiMathParser from "@/asciimath2tex"

export function keyboardMaps(kbrd) {
	switch (kbrd){
	case "nb":
		return "number"
	case "fr":
	case "frac":
		return "fraction"
	case "sol":
		return "solution"
	case "scn":
		return "scientific"
	}
	return kbrd
}

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
	"x": {type: "math", display: "x"},
	"x^2": {type: "math", display: "x^2"},
	"x^3": {type: "math", display: "x^3"},
	"x^4": {type: "math", display: "x^4"},
	"x^5": {type: "math", display: "x^5"},
	"x^6": {type: "math", display: "x^6"},
	"^2": {type: "math", display: "\\textcolor{lightgray}{x}^2"},
	"^": {type: "math", display: "x^y"},
	"10^": {type: "math", display: "10^x"},
	"sqrt": {type: "math", display: "\\sqrt{\\phantom{x}}"},
	"root(3)": {type: "math", display: "\\sqrt[3]{\\phantom{x}}"},
	"root(": {type: "math", display: "\\sqrt[n]{\\phantom{x}}"},
	"log": {type: "math", display: "\\log"},
	"_": {type: "math", display: "\\textcolor{lightgray}{\\log}_a"},
	"|": {type: "math", display: "\\big\\vert \\textcolor{lightgray}{x} \\big\\vert"},
	"y": {type: "math", display: "y"},
	"y^2": {type: "math", display: "y^2"},
	"e": {type: "math", display: "\\text{e}"},
	"ln": {type: "math", display: "\\ln"},
	"pi": {type: "math", display: "\\pi"},
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
	"RR": {type: "math", display: "\\mathbb{R}"},
	"^**": {type: "math", display: "\\textcolor{lightgray}{\\mathbb{R}}^*"},
	"\\\\": {type: "math", display: "\\setminus \\textcolor{lightgray}{ E } "},
	"uu": {type: "math", display: "\\cup"},
	"not": {type: "math", display: "\\neg"},
	"nn": {type: "math", display: "\\cap"},
	"oo": {type: "math", display: "\\infty"},
	"+-": {type: "math", display: "\\pm"},
	"-+": {type: "math", display: "\\mp"},
	"!!": {type: "math", display: "\\varnothing"},
	"@reset": {type: "icon", display: "bi bi-trash"},
	"@back": {type: "icon", display: "bi bi-backspace"}
}

export 	const keyboards = {
	"qcm": {
		grid: "grid-cols-4",
		layout: [],
		tex(value) {
			return value.startsWith("#") ? asciiToTex(value.substring(1)) : value
		}
	},
	"number": {
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
	"fraction": {
		grid: "grid-cols-3",
		layout: [
			"1", "2", "3",
			"4", "5", "6",
			"7", "8", "9",
			"-", "0", "/"
		],
		tex(value) {
			return asciiToTex(value)
		}
	},
	"simple": {
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
	"pow": {
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
	"scientific": {
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
	"algebra": {
		grid: "grid-cols-7",
		layout: [
			"1", "2", "3", "+", "x", "y", "e",
			"4", "5", "6", "-", "^2", "^", "ln",
			"7", "8", "9", "*", "|", "sqrt", "root(",
			".", "0", "=", "/", "(", ")", ";"
		],
		tex(value) {
			return asciiToTex(value)
		}
	},
	"polynom": {
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "x", "x^2",
			"4", "5", "6", "-", "x^3", "x^4",
			"7", "8", "9", "*", "", "",
			"(", ")", "0", "/", "^2", "^"
		],
		tex: function (value) {
			return asciiToTex(value)
		}
	},
	"equation": {
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "x", "x^2",
			"4", "5", "6", "-", "y", "y^2",
			"7", "8", "9", "*", "^2", "^",
			"(", ")", "0", "/", ["=", 2]
		],
		tex(value) {
			return asciiToTex(value)
		}
	},
	"rational": {
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "x", "x^2",
			"4", "5", "6", "-", "x^3", "x^4",
			"7", "8", "9", "/", "^2", "^",
			"(", ")", "0", "", "", ""
		],
		tex: function (value) {
			let [Pnum, Pden] = value.split("/")
			return Pden === undefined ? asciiToTex(Pnum) : `\\frac{ ${asciiToTex(Pnum)} }{ ${Pden} }`
		}
	},
	"exact": {
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
			return value.split(",").map(v => makeExactFromAscii(v)).join(",")
		}
	},
	"coord": {
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "-",
			"4", "5", "6", "", "/",
			"7", "8", "9", "^2", "sqrt",
			"", "0", ".", "^", "root(",
			"(", ";", ")", "pi", "e"
		],
		tex: function (value) {
			let [...coords] = value.split(";"),
				lp = "", rp = ""

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
				coords[coords.length - 1] = coords[coords.length - 1].substring(0, coords[coords.length - 1].length - 1)
			}

			return `${lp}${coords.map(x => makeExactFromAscii(x)).join(";")}${rp}`
		}
	},
	"vector": {
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "-",
			"4", "5", "6", "", "/",
			"7", "8", "9", "^2", "sqrt",
			"", "0", ".", "^", "root(",
			"(", ";", ")", "pi", "e"
		],
		tex: function (value) {
			let [...coords] = value.split(";"),
				lp = "", rp = ""

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
				coords[coords.length - 1] = coords[coords.length - 1].substring(0, coords[coords.length - 1].length - 1)
			}

			return `${lp}\\begin{matrix}${coords.map(x => {
				let tex = makeExactFromAscii(x)
				return tex === "" ? "\\phantom{ }" : tex
			}).join("\\\\")}\\end{matrix}${rp}`
		}
	},
	"limit": {
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "-",
			"4", "5", "6", "*", "/",
			"7", "8", "9", "sqrt", "root(",
			"0", "", "+-", "-+", "oo"
		],
		tex: function (value) {
			// Apply this for all values.
			return value.split(",").map(v => makeExactFromAscii(v)).join(",")
		}
	},
	"solution": {
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+", "-",
			"4", "5", "6", "*", "/",
			"7", "8", "9", "^2", "^",
			"0", "(", ")", "sqrt", "root(",
			"log", "_", "ln", "pi", "e",
			"{", ";", "}", "RR", "!!",
			"^**", "\\\\", "uu", "", "",
			"[", "]", "oo", "", ""
		],
		tex: function (value) {
			//TODO: parse correctly solutions when using setminus.
			if (value.startsWith("RR")) {
				return `${asciiToTex(value)}`
			} else if (value === "!!") {
				return "\\varnothing"
			}

			if (value.includes("]") || value.includes("[")) {
				// TODO: handle intervals : extract value.
				return `${value.split(";").map(x => makeExactFromAscii(x)).join(";")} `
			}

			// remove the braces...
			let beforeBrace = value.startsWith("{") ? "\\left\\{" : "",
				afterBrace = value.endsWith("}") ? "\\right\\}" : ""

			if (afterBrace !== "" && beforeBrace === "") {
				beforeBrace = " \\left. "
			}
			if (beforeBrace !== "" && afterBrace === "") {
				afterBrace = " \\right. "
			}

			value = value.replace("{", "").replace("}", "")

			return `${beforeBrace} ${value.split(";").map(x => makeExactFromAscii(x)).join(";")} ${afterBrace}`
		}
	}
}

function asciiToTex(value) {
	const parser = new AsciiMathParser()

	// Force display style
	return parser.parse(value)
}

function makeExactFromAscii(value) {
	if (value === undefined || value === "") {
		return ""
	}

	// Aucune division - pas de problème, c'est du ascii.
	if (!value.includes("/")) {
		return asciiToTex(value)
	}

	const numden = value.split("/")
	let stack = [], result = [], parentheses = 0

	for (let item of numden) {
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

	return asciiToTex(result.length === 1 ? result[0] : result.map(x => `(${x})`).join("/"))
}
