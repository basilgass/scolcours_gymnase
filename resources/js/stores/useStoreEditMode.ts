import {useMagicKeys, useStorage, whenever} from "@vueuse/core"
import {defineStore} from "pinia"
import {useIsAdmin} from "@/Composables/useHelpers.ts"

const storageKey = 'scolcours_gymnase_editmode'
export const useStoreEditMode = defineStore(
	"editMode",
	() => {
		const enable = useStorage(storageKey, false)

		function toggle() {
			enable.value = !enable.value
		}

		// Keystroke detection
		const keys = useMagicKeys()
		whenever(keys.ctrl_alt_a, () => {
			if (useIsAdmin()) {
				enable.value = !enable.value
			}
		})

		// Return values
		return {enable, toggle}
	})
