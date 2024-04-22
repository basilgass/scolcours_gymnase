import { Ref, unref } from "vue"

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
		inline: "start",
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
export function useMenuScrollTo(id?: string) {
	const el = id === undefined ? document.body : document.getElementById(id)

	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start",
	})
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
export function useFormattedBody(body: string|Ref<string>, mabyeRefValues: Ref<{[Key: string]: string}>): string {
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
	// TODO: robust solution to replace the double signs only when "replace" all items.
	output = output.replaceAll("-REPLACE_VALUE-", "+")
	output = output.replaceAll("-REPLACE_VALUE+", "-")
	output = output.replaceAll("+REPLACE_VALUE-", "-")
	output = output.replaceAll("+REPLACE_VALUE+", "+")
	output = output.replaceAll("REPLACE_VALUE", "")

	return output
}

export const useKatexMacros: { [key: string]: string } = {
	"\\IR": "\\mathbb{R}",
	"\\IN": "\\mathbb{N}",
	"\\ds": "\\displaystyle",
	"\\vect": "\\overrightarrow",
	"\\dx": "\\hspace{0.5em}\\text{d}x",
}
