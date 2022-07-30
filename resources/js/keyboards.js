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
	"sqrt": {type: "math", display: "\\sqrt{\\phantom{x}}"},
	"|": {type: "math", display: "\\big\\vert \\textcolor{lightgray}{x} \\big\\vert"},
	"y": {type: "math", display: "y"},
	"e": {type: "math", display: "\\text{e}"},
	"ln": {type: "math", display: "\\ln"},
	"pi": {type: "math", display: "\\pi"},
	"(": {type: "math", display: "("},
	")": {type: "math", display: ")"},
	"=": {type: "math", display: "="},
	" ": {type: "math", display: "\\cdot"},
	".": {type: "math", display: "."},
	"@reset": {type: "icon", display: "bi bi-trash"},
	"@back": {type: "icon", display: "bi bi-backspace"}
}

export const keyboards = {
	"number": {
		grid: "grid-cols-3",
		layout: [
			"1", "2", "3",
			"4", "5", "6",
			"7", "8", "9",
			".", "0", "-"
		]
	},
	"fraction": {
		grid: "grid-cols-3",
		layout: [
			"1", "2", "3",
			"4", "5", "6",
			"7", "8", "9",
			"/", "0", "-"
		]
	},
	"simple": {
		grid: "grid-cols-4",
		layout: [
			"1", "2", "3", "+",
			"4", "5", "6", "-",
			"7", "8", "9", "*",
			"@back", ["0", 2], "/"
		]
	},
	"algebra": {
		grid: "grid-cols-7",
		layout: [
			"1", "2", "3", "+", "x", "y", "e",
			"4", "5", "6", "-", "^2", "^", "ln",
			"7", "8", "9", "*", "|", "sqrt", "",
			"@reset", "@back", "0", "/", "(", ")", "="
		]
	},
	"polynom": {
		grid: "grid-cols-6",
		layout: [
			"1", "2", "3", "+", "x", "x^2",
			"4", "5", "6", "-", "x^3", "x^4",
			"7", "8", "9", "*", "x^5", "x^6",
			"(", ")", "0", "/", ["^", 2]
		]
	},
	"exact": {
		grid: "grid-cols-5",
		layout: [
			"1", "2", "3", "+","-",
			"4", "5", "6", "*","/",
			"7", "8", "9", ["sqrt", 2],"",
			"@reset", "@back", "0", "",""
		],
		format: function(value){
			// No answer actually...
			if(value===""){return ""}

			let match = value.match(/([0-9]*)?([+-]?[0-9]*)?(sqrt([0-9]+))?(\/([0-9]+))?/)

			// a +b sqrt (c) / d
			const a = match[1], b = match[2], c=match[4], d=match[6]
			let numerator = `${a===undefined?"":a}${b===undefined?"":b}`
			if(match.input.includes("sqrt")){
				numerator+=`\\sqrt{ ${c===undefined?"\\quad":c} }`
			}
			if(match.input.includes("/")){
				return `\\frac{ ${numerator} }{ ${ d===undefined?"\\quad":d } }`
			}else{
				return numerator
			}
		}
	}
}
