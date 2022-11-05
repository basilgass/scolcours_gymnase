import katex from "katex/dist/katex.mjs"
import AsciiMathParser from "./asciimath2tex"
import {number} from "tailwindcss/lib/util/dataTypes"

function katexUpdate(el, binding, vnode) {
	el.innerHTML = ""

	if (binding.value=== null || binding.value === undefined || binding.value.length === 0) {
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

	let rawTex = binding.value.replaceAll(/\$[a-z]/g, "\\textcolor{red}{A}")
	if(binding.modifiers.auto){
		el.innerHTML = rawTex
		katexAutoRender(el)
	}else {
		let tex = binding.modifiers.ascii ? new AsciiMathParser().parse(rawTex) : rawTex

		if (typeof tex === number) {
			tex = tex.toString()
		}

		let displayMode = !binding.modifiers.inline && el.tagName !== "SPAN"

		if (tex !== undefined && tex.length > 0) {
			el.innerHTML = katex.renderToString(
				(binding.modifiers.display ? "\\displaystyle " : "") + tex,
				{
					throwOnError: false,
					displayMode: displayMode
				})
		}
	}
}

export const katexDirective = {
	mounted (el, binding, vnode) {
		katexUpdate(el, binding, vnode)
	},
	updated (el, binding, vnode) {
		katexUpdate(el, binding, vnode)
	},
	unmounted(el){
		el.innerHTML = ""
	}
}

export const visibleDirective = {
	mounted (el, binding, vnode) {
		el.style.visibility = binding.value ? "visible" : "hidden"
	}
}
