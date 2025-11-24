import {usePage} from "@inertiajs/vue3"
import {Ref, unref} from "vue"

/**
 * Scrolls the page to the element with the specified class.
 *
 * @param {string} className - The class name of the element to scroll to.
 */
export function useMenuScrollToClass(className: string) {
	const el = document.getElementsByClassName(className)[0]
	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}

export function useMenuScrollToData(dataName: string, dataValue: unknown) {
	const el = document.querySelector(`[data-${dataName}="${dataValue}"]`)
	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}

/**
 * Scrolls the page to a specified element with smooth behavior.
 * If no element is specified, scrolls to the top of the page.
 *
 * @param {string} id - The id of the element to scroll to. If not provided, it scrolls to the top of the page.
 *
 * @return {void}
 */
export function useMenuScrollTo(id?: string): void {
	const el = id === undefined ? document.body : document.getElementById(id)

	// TODO : Attendre qu'il apparaisse (selon le type de l'id)
	setTimeout(() => {
		el?.scrollIntoView({
			block: "start",
			behavior: "smooth",
			inline: "start"
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
