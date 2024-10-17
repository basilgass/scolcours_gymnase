import { defineStore } from "pinia"
import { ref } from "vue"

// TODO: implémenter le store de l'utilisateur.
export const useStoreUser = defineStore(
	'user',
	()=>{
		const admin = ref(false)
		const username = ref('invité')

		return {admin, username}
	}
)