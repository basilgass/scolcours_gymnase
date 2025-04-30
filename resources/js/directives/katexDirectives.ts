import katex from "katex/dist/katex.mjs"
import AsciiMathParser from "@/asciimath2tex.ts"
import { useKatexMacros } from "@/Composables/useHelpers"
import renderMathInElement from "katex/contrib/auto-render"
import { numberCorrection } from "@/helpers/helperFunctions"

function katexAutoRender(el) {
	if (el) {
		renderMathInElement(el, {
			// customised config
			// • auto-render specific keys, e.g.:
			delimiters: [
				// { left: "$$", right: "$$", display: true },
				// { left: "$", right: "$", display: false },
				{ left: "\\[", right: "\\]", display: true },
				{ left: "\\(", right: "\\)", display: false }
			],
			// • rendering keys, e.g.:
			throwOnError: false,
			macros: useKatexMacros
		})
	}
}

function katexUpdate(el, binding) {
	el.innerHTML = ""

	if (
		binding.value === null ||
		binding.value === undefined ||
		binding.value.length === 0
	) {
		return
	}

	if (!binding.modifiers.clear) {
		el.classList.add("katex-container")
	}

	// Add boxed to the inline container
	if (binding.modifiers.boxed) {
		el.classList.add("katex-boxed")
	}
	if (binding.modifiers.lg) {
		el.classList.add("katex-boxed-lg")
	}
	if (binding.modifiers.left) {
		el.classList.add("katex-left")
	}
	if (binding.modifiers.nomargin) {
		el.classList.add("katex-m-0")
	}
	if (binding.modifiers.dense) {
		el.classList.add("katex-m-1")
	}

	// Create the text to display.
	let rawTex = binding.value

	if (!isNaN(rawTex)) {
		for (const key in binding.modifiers) {
			if (key.startsWith("number")) {
				const [, digits] = key.split(":")
				rawTex = numberCorrection(
					rawTex,
					digits === undefined ? 2 : +digits
				).toString()
			}
		}
		rawTex = rawTex.toString()
	}

	// Make sure rawTex is a string
	if (!rawTex) rawTex = ""

	if (binding.modifiers.auto) {
		el.innerHTML = rawTex
		katexAutoRender(el)
	} else {
		const tex = binding.modifiers.ascii
			? new AsciiMathParser().parse(rawTex)
			: rawTex
		const displayMode = !binding.modifiers.inline && el.tagName !== "SPAN"

		if (tex !== undefined && tex.length > 0) {
			el.innerHTML = katex.renderToString(
				(binding.modifiers.display ? "\\displaystyle " : "") + tex,
				{
					throwOnError: false,
					displayMode: displayMode,
					macros: useKatexMacros
				}
			)
		}
	}

	// Add TeX output to the element
	if (binding.modifiers.output) {
		const output = document.createElement("div")
		output.classList.add("katex-output")
		output.innerHTML = rawTex
		output.addEventListener("click", () => {
			// Select the whole text
			const range = document.createRange()
			range.selectNodeContents(output)
			const sel = window.getSelection()
			sel.removeAllRanges()
			sel.addRange(range)
		})
		el.appendChild(output)
	}
}

export const katexDirective = {
	mounted(el, binding) {
		katexUpdate(el, binding)
	},
	updated(el, binding) {
		katexUpdate(el, binding)
	},
	unmounted(el) {
		el.innerHTML = ""
	}
}
