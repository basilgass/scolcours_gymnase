
export const latexTriggers = {
	"BPM": ["\\begin{pmatrix}","\\end{pmatrix}"],
	"BAL": ["\\begin{aligned}", "\\end{aligned}"],
	"BEQ": ["\\begin{array}{rl|l}\n","\n\\end{array}"],
	"BFR": ["\\frac{", "}{}"],
	"=>": ["\\implies ", ""],
	"<=>": ["\\Longleftrightarrow ", ""],
	"**": ["\\cdot ", ""],
	",.": ["\\overrightarrow{", "}"]
}

export const javascriptTriggers = {
	"PRN": ["new PiMath.Random.number(", ")"],
	"PRP": ["new PiMath.Random.polynom({degree: ", "})"]
}
