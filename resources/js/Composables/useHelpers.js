
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
