import type {IMacroRecords} from "@/helpers/Macros/macros_interface.ts"

const latex_macros_suffix: IMacroRecords = {
	'.fr': {
		suffix: true,
		math: true,
		template: '\\frac{ @ }{ @ }'
	},
	'.sq': {
		suffix: true,
		math: true,
		template: '\\sqrt{ @ }'
	},
	'.txt': {
		suffix: true,
		math: true,
		template: '\\text{ @ }'
	},
	'.ca': {
		suffix: true,
		math: true,
		template: '\\mathcal{ @ }'
	},
	'.bb': {
		suffix: true,
		math: true,
		template: '\\mathbb{ @ }'
	},
	'.,': {
		suffix: true,
		math: true,
		template: '\\vect{ @ }'
	},
	'..': {
		suffix: true,
		math: true,
		template: '\\overline{ @ }'
	},
	'.(': {
		suffix: true,
		math: true,
		template: '\\left( @ \\right)'
	},
	'.br': {
		suffix: true,
		math: true,
		template: '\\left\\lbrace @ \\right\\rbrace'
	},
	'.col': {
		suffix: true,
		math: true,
		template: '\\color{ @ }'
	}

}

const md_macros: IMacroRecords = {
	"DEF": {
		math: false,
		template: "[@]{.@@def@}"
	},
	"$$": {
		math: false,
		template: "\\[\n\t@\n\\]"
	},
	".l": {
		suffix: true,
		math: false,
		template: "\\( @ \\)",
	},
	"LKP": {
		suffix: false,
		math: false,
		template: "[@](@@posts.show,@)"
	},
	"LKB": {
		suffix: false,
		math: false,
		template: "[@](@@blocks.show,@)"
	}
}
export const latex_macros: IMacroRecords = {
	"BPM": {
		math: true,
		template: '\\begin{pmatrix}\n\t@\n\\end{pmatrix}'
	},
	"BAL": {
		math: true,
		template: "\\begin{aligned}\n\t@\n\\end{aligned}"
	},
	"BEQ": {
		math: true,
		template: "\\begin{darray}{rl|l}\n\t@\n\\end{darray}"
	},
	"BFN": {
		math: true,
		template: "\\begin{darray}{rcll}\n@ : & @ & \\longrightarrow & @ \\\\\n & @ & \\longmapsto & @ \n\\end{darray}"
	},
	"LIM": {
		math: true,
		template: "\\lim_{x\\to @}\\ @"
	},
	"DAS": {
		math: true,
		template: "\\def\\arraystretch{ @ }"
	},
	"==": {
		math: true,
		template: "&=",
		space: true
	},
	"**": {
		math: true,
		template: "\\cdot",
		space: true
	},
	"-->": {
		math: true,
		template: "\\longrightarrow",
		space: true
	},
	"|->": {
		math: true,
		template: "\\longmapsto",
		space: true
	},
	"<->": {
		math: true,
		template: "\\Longleftrightarrow",
		space: true
	},
	"x->": {
		math: true,
		template: "\\xrightarrow{ @ }",
		space: true
	},
	"=>": {
		math: true,
		template: "\\implies",
		space: true
	},
	...md_macros,
	...latex_macros_suffix
}
