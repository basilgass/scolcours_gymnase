import {useIsAdmin} from "@/Composables/useHelpers"
import type {Directive, DirectiveBinding} from "vue"

function toggleHidden(el: HTMLElement, binding: DirectiveBinding<boolean>) {
	el.classList.toggle("hidden", binding.value === false)
}

export const adminDirective: Directive<HTMLElement, boolean> = {
	mounted(el, binding) {
		if (!useIsAdmin()) {
			el.remove()
			return
		}
		toggleHidden(el, binding)
	},
	updated(el, binding) {
		if (!el.isConnected) return
		toggleHidden(el, binding)
	}
}