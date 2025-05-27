import type {IMacro, IMacroRecords} from "@/helpers/Macros/macros_interface.ts"

const latex_macros_suffix: IMacroRecords = {
	'..-': {
		suffix: true,
		math: false,
		template: '\\( @ \\) '
	},
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
	'.,': {
		suffix: true,
		math: true,
		template: '\\overrightarrow{ @ }'
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
	'.{': {
		suffix: true,
		math: true,
		template: '\\left\\lbrace @ \\right\\rbrace'
	}

}

export const latex_macros: Record<string, IMacro> = {
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
		template: "\\begin{array}{rl|l}\n\t@\n\\end{array}"
	},
	"BFN": {
		math: true,
		template: "\\begin{array}{rcll}\n@ : & @ & \\longrightarrow & @ \\\\\n & @ & \\longmapsto & @ \n\\end{array}"
	},
	"LIM": {
		math: true,
		template: "\\lim_{x\\to @}\\ @"
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
	...latex_macros_suffix
}
