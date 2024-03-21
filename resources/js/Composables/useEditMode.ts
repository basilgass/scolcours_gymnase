import { ref, watch } from "vue"
import { usePage } from "@inertiajs/vue3"
import { useMagicKeys, whenever } from "@vueuse/core"

export function useEditMode() {
	const editMode = ref(localStorage.getItem("scolcours_editMode") === "true")
// Add shortcut to open toggle admin mode.
	const keys = useMagicKeys()
	whenever(keys.ctrl_alt_a, () => {
		if (usePage().props.auth.user && usePage().props.auth.can.admin) {
			editMode.value = !editMode.value
		}
	})

// Watch for editMode changes...
	watch(editMode, (value) => {
		localStorage.setItem("scolcours_editMode", value.toString())
	})
	return editMode
}
