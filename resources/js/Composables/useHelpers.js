import {unref} from "vue"

export function useMenuScrollToClass(value) {
	const el = document.getElementsByClassName(value)[0]
	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}

export function useMenuScrollTo(id) {
	const el = id === undefined ? document.body : document.getElementById(id)

	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}

export function useWrongAnswerAnimation(btn) {
	if (btn) {
		btn.style.setProperty("animation-name", "v-shake-horizontal")
		btn.style.setProperty("animation-duration", "500ms")

		setTimeout(() => {
			if (btn) { // the button may have already disappeared !
				btn.style.setProperty("animation-name", "")
			}
		}, 500)
	}
}


export function useFormattedBody(body, mabyeRefValues){
	const values = unref(mabyeRefValues)

	// There is no value for the script
	if (unref(values) === {}) return unref(body)

	// Edit the output
	let output = `${unref(body)}`
	for (let key in values) {
		output = output.replaceAll("$" + key, "REPLACE_VALUE" + values[key])
	}

	// Rename all "unwanted" double signs.
	// - - => +
	// + -  or  - + => -
	// + + => +
	// TODO: robust solution to replace the duoble signs only when "replace" all items.
	output = output.replaceAll("-REPLACE_VALUE-", "+")
	output = output.replaceAll("-REPLACE_VALUE+", "-")
	output = output.replaceAll("+REPLACE_VALUE-", "-")
	output = output.replaceAll("+REPLACE_VALUE+", "+")
	output = output.replaceAll("REPLACE_VALUE", "")

	return output
}

export let useKatexMacros = {
	"\\IR": "\\mathbb{R}",
	"\\IN": "\\mathbb{N}",
	"\\ds": "\\displaystyle"
}
