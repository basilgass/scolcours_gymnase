import katex from "katex/dist/katex.mjs"
import AsciiMathParser from "./asciimath2tex"
import { usePage } from "@inertiajs/vue3"
import { useKatexMacros } from "@/Composables/useHelpers"
import { numberCorrection } from "pidraw/esm/Calculus"
import renderMathInElement from "katex/contrib/auto-render"

function katexAutoRender(el) {
	if (el) {
		renderMathInElement(el, {
			// customised config
			// • auto-render specific keys, e.g.:
			delimiters: [
				{ left: "$$", right: "$$", display: true },
				{ left: "$", right: "$", display: false },
				{ left: "\\[", right: "\\]", display: true },
				{ left: "\\(", right: "\\)", display: false }
			],
			// • rendering keys, e.g.:
			throwOnError: false,
			macros: useKatexMacros
		})
	}
}

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
		for (const key in binding.modifiers) {
			if (key.startsWith("number")) {
				const [b, digits] = key.split(":")
				rawTex = numberCorrection(
					rawTex,
					digits === undefined ? 2 : +digits
				).toString()
			}
		}
		rawTex = rawTex.toString()
	}

	rawTex = rawTex.replaceAll(/\$[a-z]/g, "\\textcolor{red}{A}")
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

	if (binding.value) {
		el.classList.add("hide")
	} else {
		el.classList.remove("hide")
	}
}

export const adminDirective = {
	mounted(el, binding, vnode) {
		adminUpdate(el, binding, vnode)
	},
	updated(el, binding, vnode) {
		adminUpdate(el, binding, vnode)
	}
}

function themeUpdate(el, binding, vnode) {
	const themes = usePage().props.themes.map((theme) => theme.slug)
	const keys = ["btn", "bg", "text", "border", "active", "scrollbar"]

	let chapter

	// Remove all classes from el matching the pattern "<key>-scolcours-<theme>"
	if (el) {
		keys.forEach((key) => {
			el.classList.remove(new RegExp(`${key}-scolcours-.*`))
		})
	}

	if (binding.value === false || binding.value === 0 || binding.value === "") return

	if (
		Object.hasOwn(binding.modifiers, "admin") ||
		binding.value === "admin"
	) {
		chapter = "admin"
	} else if (themes.indexOf(binding.value) !== -1) {
		chapter = binding.value
	} else if (typeof binding.value === "number") {
		// it's a number -> get the theme id.
		const theme = usePage().props.themes.filter(
			(th) => +th.id === +binding.value
		)

		if (theme.length === 1) {
			chapter = theme[0].slug
		}
	} else {
		chapter = usePage().props?.theme?.slug
	}

	if (chapter === undefined) {
		el.classList.add(`bg-white`)
		return
	}

	Object.keys(binding.modifiers).forEach((key) => {
		if (keys.indexOf(key) !== -1) {
			if (key === "text" && binding.modifiers.hasOwnProperty("bg")) {
				el.classList.add("text-white")
			} else {
				el.classList.add(`${key}-scolcours-${chapter}`)
			}
		}
	})
}

export const themeDirective = {
	mounted(el, binding, vnode) {
		themeUpdate(el, binding, vnode)
	},
	updated(el, binding, vnode) {
		themeUpdate(el, binding, vnode)
	}
}
