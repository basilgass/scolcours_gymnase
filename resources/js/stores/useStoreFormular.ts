import {defineStore} from "pinia"
import {ref} from "vue"
import axios from "axios"
import type {FormulaInterface} from "@/types/modelInterfaces.ts"
import {AxiosResponseModel} from "@/types"

// Promesse en vol pour éviter les requêtes parallèles sur la même ressource.
let pendingAll: Promise<FormulaInterface[]> | null = null

// Source unique : toutes les formules (avec, par formule, la liste de ses chapitres et
// l'ordre pivot par chapitre). Les vues « bibliothèque » et « chapitre » sont dérivées
// côté client de cette même liste — les objets sont partagés, donc aucun remount au
// changement de contexte.
export const useStoreFormular = defineStore('formular', () => {

	const allFormulas = ref<FormulaInterface[] | null>(null)

	async function getAll(): Promise<FormulaInterface[]> {
		if (allFormulas.value !== null) {
			return allFormulas.value
		}

		if (pendingAll) {
			return pendingAll
		}

		pendingAll = axios
			.get(route('api.formulas.index'))
			.then((res: AxiosResponseModel<FormulaInterface[]>) => {
				allFormulas.value = res.data
				return allFormulas.value!
			})
			.finally(() => {
				pendingAll = null
			})

		return pendingAll
	}

	// Invalidation du cache : le prochain getAll refera la requête. Utilisé après une
	// mutation, en complément de la mise à jour locale de la liste (pour rester cohérent
	// avec le serveur au prochain montage).
	function invalidateAll(): void {
		allFormulas.value = null
	}

	return {
		allFormulas,
		getAll,
		invalidateAll,
	}
})
