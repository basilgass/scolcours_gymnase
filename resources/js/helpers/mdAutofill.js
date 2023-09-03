export const latexTriggers = {
	"BPM": ["\\begin{pmatrix}", "\\end{pmatrix}"],
	"BAL": ["\\begin{aligned}\n", "\n\\end{aligned}"],
	"BEQ": ["\\begin{array}{rl|l}\n", "\n\\end{array}"],
	"BFR": ["\\frac{", "}{}"],
	"=>": ["\\implies ", ""],
	"<=>": ["\\Longleftrightarrow ", ""],
	"**": ["\\cdot ", ""],
	"==": ["&= ", ""],
	"<=": ["\\leq ", ""],
	">=": ["\\geq ", ""],
	",.": (textBefore, textAfter)=>{
		return [
			wrapLastWord(textBefore.slice(0, -2), " \\overrightarrow{", "} "),
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
	}
}

export const javascriptTriggers = {
	"PRN": ["PiMath.Random.number(", ")"],
	"PRP": ["PiMath.Random.polynom({degree: ", "})"],
}

function textEndSlicer(text, regex) {
	let slicedText = text.split(regex),
		endItem = slicedText.pop()

	return [slicedText.join(character), endItem]
}

function wrapLastWord(text, wrapperBefore, wrapperAfter) {
	let txt = text.split(/(\s|\n|\t|\r)/g)

	if(txt.length===1){
		return `${wrapperBefore}${text}${wrapperAfter}`
	}

	let item = txt.pop()
	return `${text.slice(0, -item.length)}${wrapperBefore}${item}${wrapperAfter}`

}
