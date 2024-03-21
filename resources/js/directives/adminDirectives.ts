import { usePage } from "@inertiajs/vue3"


function adminUpdate(el, binding) {
	if (!usePage().props.auth.can.admin) {
		el.remove()
	}

	if (binding.value===false) {
		el.classList.add("hidden")
	} else {
		el.classList.remove("hidden")
	}
}

export const adminDirective = {
	mounted(el, binding) {
		adminUpdate(el, binding)
	},
	updated(el, binding) {
		adminUpdate(el, binding)
	}
}
