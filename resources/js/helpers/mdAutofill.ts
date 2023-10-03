type TriggersFunction = (textBefore: string, textAfter: string) => [string, string];

type TriggersObject = {
    [key: string]: [string, string] | TriggersFunction;
};

export const latexTriggers: TriggersObject = {
	"BPM": ["\\begin{pmatrix}", "\\end{pmatrix}"],
	"BAL": ["\\begin{aligned}\n", "\n\\end{aligned}"],
	"BEQ": ["\\begin{array}{rl|l}\n", "\n\\end{array}"],
	"BFR": ["\\frac{", "}{}"],
	"=>": ["\\implies ", ""],
	"<>": ["\\Longleftrightarrow ", ""],
	"**": ["\\cdot ", ""],
	"==": ["&= ", ""],
	"\"\"": ["\\text{ ", " }"],
	"<=": ["\\leq ", ""],
	">=": ["\\geq ", ""],
	",.": (textBefore, textAfter)=>{
		return [
			wrapLastWord(textBefore.slice(0, -2), " \\overrightarrow{", "} "),
			textAfter
		]
	},
	",,": (textBefore, textAfter)=>{
		return [
			wrapLastWord(textBefore.slice(0, -2), " \\overline{", "} "),
			textAfter
		]
	},
	"(.": ["\\left(", "\\right)"],
	"[.": ["\\left[", "\\right]"],
	"TT":(textBefore, textAfter) => {
		return [
			wrapLastWord(textBefore.slice(0, -2), " \\text{", "} "),
			textAfter
		]
	},
	"//": (textBefore, textAfter) => {
		return [
			wrapLastWord(textBefore.slice(0, -2), " \\frac{", "}{"),
			'}'+textAfter
		]
	}
}

export const javascriptTriggers: TriggersObject = {
	"PRN": ["PiMath.Random.number(", ")"],
	"PRP": ["PiMath.Random.polynom({degree: ", "})"],
}

function wrapLastWord(text:string, wrapperBefore:string, wrapperAfter:string): string {
	let txt = text.split(/(\s|\n|\t|\r|\\\[|\\\()/g)

	if(txt.length===1){
		return `${wrapperBefore}${text}${wrapperAfter}`
	}

	let item = txt.pop()
    return item.length>0?
        `${text.slice(0, -item.length)}${wrapperBefore}${item}${wrapperAfter}`:
        `${text}${wrapperBefore}${item}${wrapperAfter}`

}
