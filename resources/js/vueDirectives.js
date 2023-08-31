import katex from "katex/dist/katex.mjs"
import AsciiMathParser from "./asciimath2tex"
import {usePage} from "@inertiajs/vue3"
import {useKatexMacros} from "@/Composables/useHelpers"
import {numberCorrection} from "pidraw/esm/Calculus"

function katexUpdate(el, binding, vnode) {
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
		for (let key in binding.modifiers) {
			if (key.startsWith("number")) {
				let [b, digits] = key.split(":")
				if (digits === undefined) {
					digits = 2
				}
				rawTex = numberCorrection(rawTex, digits).toString()
			}
		}
		rawTex = rawTex.toString()
	}

	rawTex = rawTex.replaceAll(/\$[a-z]/g, "\\textcolor{red}{A}")
	if (binding.modifiers.auto) {
		el.innerHTML = rawTex
		katexAutoRender(el)
	} else {
		let tex = binding.modifiers.ascii
			? new AsciiMathParser().parse(rawTex)
			: rawTex
		let displayMode = !binding.modifiers.inline && el.tagName !== "SPAN"

		if (tex !== undefined && tex.length > 0) {
			el.innerHTML = katex.renderToString(
				(binding.modifiers.display ? "\\displaystyle " : "") + tex,
				{
					throwOnError: false,
					displayMode: displayMode,
					macros: useKatexMacros,
				}
			)
		}
	}
}

export const katexDirective = {
	mounted(el, binding, vnode) {
		katexUpdate(el, binding, vnode)
	},
	updated(el, binding, vnode) {
		katexUpdate(el, binding, vnode)
	},
	unmounted(el) {
		el.innerHTML = ""
	}
}

export const visibleDirective = {
	mounted(el, binding, vnode) {
		el.style.visibility = binding.value ? "visible" : "hidden"
	}
}

function adminUpdate(el, binding, vnode) {
	if (!usePage().props.auth.can.admin) {
		el.remove()
	}

	if(binding.value){
		el.classList.add("hide")
	}else{
		el.classList.remove("hide")
	}
}

export const adminDirective = {
	mounted(el, binding, vnode) {
		adminUpdate(el, binding, vnode)
	},
	updated(el, binding, vnode) {
		adminUpdate(el, binding, vnode)
	},
}

function themeUpdate(el, binding, vnode){
	const themes = usePage().props.themes.map(theme => theme.slug)
	let chapter

	if(!isNaN(+binding.value)){
		// it's a number -> get the theme id.
		let theme = usePage().props.themes.filter(th=>th.id===+binding.value)

		if(theme.length===1) {
			chapter = theme[0].slug
		}
	}else if(themes.indexOf(binding.value) === -1){
		chapter = usePage().props?.theme?.slug
	}else{
		chapter = binding.value
	}

	if(chapter!==undefined){
		const keys = ["btn", "bg", "text", "border", "active", "scrollbar"]
		Object.keys(binding.modifiers).forEach(key =>{
			if(keys.indexOf(key)!==-1){
				if(key==="text" && binding.modifiers.hasOwnProperty("bg")){
					el.classList.add("text-white")
				}else {
					el.classList.add(`${key}-scolcours-${chapter}`)
				}
			}
		})

	}
}
export const themeDirective = {
	mounted(el, binding, vnode) {
		themeUpdate(el, binding, vnode)
	},
	updated(el, binding, vnode) {
		themeUpdate(el, binding, vnode)
	}
}
