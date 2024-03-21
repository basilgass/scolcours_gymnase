export const visibleDirective = {
	mounted(el, binding) {
		el.style.visibility = binding.value ? "visible" : "hidden"
	}
}
