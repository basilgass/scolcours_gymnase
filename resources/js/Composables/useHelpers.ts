import {usePage} from "@inertiajs/vue3"
import {Ref, unref} from "vue"

interface KeyValue {
	key: string
	value: string
}

function isKeyValue(obj: unknown): obj is KeyValue {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'key' in obj &&
		'value' in obj &&
		typeof (obj as any).key === 'string' &&
		typeof (obj as any).value === 'string'
	)
}

export function useScrollTo(target?: string | HTMLElement | KeyValue, offset?: number) {
	let el: HTMLElement | null = null

	// to the top
	if (!target) target = 'body'

	if (typeof target === "string") {
		el = document.querySelector(target)
	} else if (target instanceof HTMLElement) {
		el = target
	} else if (isKeyValue(target)) {
		el = document.querySelector(`[data-${target.key}="${target.value}"]`)
	}

	if (!el) return

	setTimeout(() => {
		const top = el.getBoundingClientRect().top +
			window.scrollY -
			(offset === undefined ? 0 : offset)

		window.scrollTo({
			top,
			behavior: 'smooth'
		})
	}, 500)
}

/**
 * Applies a wrong answer animation to the given button element.
 *
 * @param {HTMLElement} btn - The button element to animate.
 *
 * @return {void}
 */
export function useWrongAnswerAnimation(btn: HTMLElement) {
	if (btn) {
		btn.style.setProperty("animation-name", "v-shake-horizontal")
		btn.style.setProperty("animation-duration", "500ms")

		setTimeout(() => {
			if (btn) {
				// the button may have already disappeared !
				btn.style.setProperty("animation-name", "")
			}
		}, 500)
	}
}

/**
 * Processes and formats the body text with given values.
 *
 * @param {string} body - The body text to be formatted.
 * @param mabyeRefValues
 * @returns {string|null} - The formatted body text or null if body is null.
 */
export function useFormattedBody(body: string | Ref<string>, mabyeRefValues: Ref<Record<string, string>>): string {
	// No body : no need to continue
	if (body === null) return null

	// Get the values to update
	const values = unref(mabyeRefValues)

	// There is no value for the script
	if (!unref(values)) return unref(body)

	// Edit the output
	let output = `${unref(body)}`
	for (const key in values) {
		output = output.replaceAll("$" + key, "REPLACE_VALUE" + values[key])
	}

	// Rename all "unwanted" double signs.
	// - - => +
	// + -  or  - + => -
	// + + => +
	output = output.replaceAll("-REPLACE_VALUE-", "+")
	output = output.replaceAll("-REPLACE_VALUE+", "-")
	output = output.replaceAll("+REPLACE_VALUE-", "-")
	output = output.replaceAll("+REPLACE_VALUE+", "+")
	output = output.replaceAll("REPLACE_VALUE", "")

	return output
}

export function replaceDoubleSigns(text: string): string {
	return text
		.replaceAll('++', '+')
		.replaceAll('--', '+')
		.replaceAll('+-', '-')
		.replaceAll('-+', '-')
}

export function dynamicText(rawText: string, keys: Record<string, string | number>): string {
	let result = '' + rawText

	Object.keys(keys).forEach(key => {
		result = result.replaceAll(key, `${keys[key]}`)
	})

	return replaceDoubleSigns(result)
}

export const useKatexMacros: Record<string, string> = {
	"\\IR": "\\mathbb{R}",
	"\\IN": "\\mathbb{N}",
	"\\ds": "\\displaystyle",
	"\\vect": "\\overrightarrow",
	"\\dx": "\\hspace{0.5em}\\text{d}x"
}


export function useTheme(id: number) {
	const theme = usePage().props.themes.find(theme => +theme.id === +id)

	return theme ?? {
		id: null,
		slug: null,
		title: null,
		order: null,
		color: null,
		icon: null,
		enabled: null
	}
}
