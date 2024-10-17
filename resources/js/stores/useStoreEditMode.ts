import { usePage } from "@inertiajs/vue3"
import { useMagicKeys, whenever } from "@vueuse/core"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useStoreEditMode = defineStore(
	"editMode",
	() => {
		const enable = ref(false)

		function toggle(){
			enable.value = !enable.value
		}

		// Keystroke detection
		const keys = useMagicKeys()
		whenever(keys.ctrl_alt_a, () => {
			if (usePage().props.auth.user && usePage().props.auth.can.admin) {
				enable.value = !enable.value
			}
		})

		// Return values
		return { enable, toggle }
	})