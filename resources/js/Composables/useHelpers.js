
export function menuScrollToClass(value) {
	const el = document.getElementsByClassName(value)[0]
	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}

export function menuScrollTo(id) {
	const el = id === undefined ? document.body : document.getElementById(id)

	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}

export function wrongAnswerAnimation(btn) {
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
