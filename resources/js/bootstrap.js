window._ = require("lodash")

window.axios = require("axios")
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"

import renderMathInElement from "katex/dist/contrib/auto-render.mjs"

window.katexAutoRender = function (el, display) {
	console.log(display??true)
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
	})
}
