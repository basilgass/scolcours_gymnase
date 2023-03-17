import renderMathInElement from "katex/dist/contrib/auto-render.mjs"
import {useKatexMacros} from "@/Composables/useHelpers"

window._ = require("lodash")

window.axios = require("axios")
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"

window.katexAutoRender = function (el, display) {
	if(el) {
		renderMathInElement(el, {
			// customised options
			// • auto-render specific keys, e.g.:
			delimiters: [
				{left: "$$", right: "$$", display: true},
				{left: "$", right: "$", display: false},
				{left: "\\[", right: "\\]", display: true},
				{left: "\\(", right: "\\)", display: false},
			],
			// • rendering keys, e.g.:
			throwOnError: false,
			macros: useKatexMacros
		}
		)
	}
}
