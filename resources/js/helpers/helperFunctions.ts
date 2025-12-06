export function numberCorrection(value: unknown, corr = 2) {
	return (+value as number).toFixed(corr)
}


export function shake(item: HTMLElement) {
	item.style.setProperty("animation-name", "v-shake-horizontal")
	item.style.setProperty("animation-duration", "500ms")

	setTimeout(() => {
		item.style.setProperty("animation-name", "")
	}, 500)
}
