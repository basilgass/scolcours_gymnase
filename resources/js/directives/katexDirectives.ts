import AsciiMathParser from "@/asciimath2tex.ts"
import {useKatexMacros} from "@/Composables/useHelpers"
import renderMathInElement from "katex/contrib/auto-render"
import {numberCorrection} from "@/helpers/helperFunctions"
import type {Directive, DirectiveBinding} from "vue"
import katex from "katex"

type KatexModifier =
	| "clear" | "boxed" | "lg" | "left" | "right" | "nomargin"
	| "inline" | "dense" | "auto" | "ascii" | "display" | "output" | "number" | `number:${number}`

type KatexBinding = DirectiveBinding<string | null, KatexModifier>
type KatexModifiers = KatexBinding["modifiers"]

// Modifiers dont l'effet est simplement d'ajouter une classe.
const MODIFIER_CLASSES: Partial<Record<KatexModifier, string>> = {
	boxed: "katex-boxed",
	lg: "katex-boxed-lg",
	left: "katex-left",
	right: "katex-right",
	nomargin: "katex-m-0",
	dense: "katex-m-1",
}

function katexAutoRender(el: HTMLElement): void {
	renderMathInElement(el, {
		// $$ et $ sont volontairement désactivés :
		delimiters: [
			{left: "\\[", right: "\\]", display: true},
			{left: "\\(", right: "\\)", display: false},
		],
		throwOnError: false,
		macros: useKatexMacros,
	})
}

function applyModifierClasses(el: HTMLElement, modifiers: KatexModifiers): void {
	if (!modifiers.clear) {
		el.classList.add("katex-container")
	}

	for (const [modifier, className] of Object.entries(MODIFIER_CLASSES)) {
		if (modifiers[modifier as KatexModifier] && className !== undefined) {
			el.classList.add(className)
		}
	}
}

// Si la valeur est numérique et qu'un modifier number(:n) est présent, arrondit à n décimales.
function formatNumberValue(rawTex: string, modifiers: KatexModifiers): string {
	if (isNaN(Number(rawTex))) {
		return rawTex
	}

	const numberModifier = Object.keys(modifiers).find((key) => key.startsWith("number"))
	if (numberModifier === undefined) {
		return rawTex
	}

	const [, digits] = numberModifier.split(":")
	return numberCorrection(rawTex, digits === undefined ? 2 : +digits)
}

function renderTex(el: HTMLElement, rawTex: string, modifiers: KatexModifiers): void {
	if (modifiers.auto) {
		el.innerHTML = rawTex
		katexAutoRender(el)
		return
	}

	const tex = modifiers.ascii ? new AsciiMathParser().parse(rawTex) : rawTex
	if (tex.length === 0) {
		return
	}

	const displayMode = !modifiers.inline && el.tagName !== "SPAN"
	el.innerHTML = katex.renderToString(
		(modifiers.display ? "\\displaystyle " : "") + tex,
		{
			throwOnError: false,
			displayMode,
			macros: useKatexMacros,
		}
	)
}

// Ajoute un bloc cliquable qui sélectionne tout le TeX source au clic.
function appendCopyableOutput(el: HTMLElement, rawTex: string): void {
	const output = document.createElement("div")
	output.classList.add("katex-output")
	output.innerHTML = rawTex
	output.addEventListener("click", () => {
		const range = document.createRange()
		range.selectNodeContents(output)
		const selection = window.getSelection()
		selection?.removeAllRanges()
		selection?.addRange(range)
	})
	el.appendChild(output)
}

function katexUpdate(el: HTMLElement, binding: KatexBinding): void {
	el.innerHTML = ""

	const value = binding.value
	if (value === null || value === undefined || value.length === 0) {
		return
	}

	applyModifierClasses(el, binding.modifiers)

	const rawTex = formatNumberValue(value, binding.modifiers)

	renderTex(el, rawTex, binding.modifiers)

	if (binding.modifiers.output) {
		appendCopyableOutput(el, rawTex)
	}
}

export const katexDirective: Directive<HTMLElement, string | null, KatexModifier> = {
	mounted(el, binding) {
		katexUpdate(el, binding)
	},
	updated(el, binding) {
		katexUpdate(el, binding)
	},
	unmounted(el) {
		el.innerHTML = ""
	},
}
