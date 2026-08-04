import {ChapterInterface} from "@/types/chapterInterfaces.ts"
import axios from "axios"
import {AxiosResponseModel} from "@/types"
import {FormulaInterface} from "@/types/modelInterfaces.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {useStoreFormular} from "@/stores/useStoreFormular.ts"
import {ref} from "vue"
import {router} from "@inertiajs/vue3"


export function useFormular(chapterId?: number) {
	const flash = useStoreFlashMessage()
	const storeFormular = useStoreFormular()


	const formular = ref<FormulaInterface[]>([])
	const currentChapterId = ref<number | null>(chapterId ?? null)
	const relatedChapters = ref<ChapterInterface[]>([])

	const loadingState = ref<boolean>(false)
	const errors = ref("")

	function updateOrder() {
		axios
			.post(route("api.admin.formulas.order"), {
				chapter_id: currentChapterId.value,
				order: formular.value.map((x, index) => {
					return {id: x.id, order: index}
				})
			})
			.then(() => {
				flash.success(
					"L'ordre des formules à bien été enregistré !"
				)
			})
			.catch((res) => {
				flash.error("Erreur lors de la mise à jour de l'ordre des formules")
				console.warn("update ordering order: ", res.data)
			})
	}

	function load(chapterId?: number) {
		loadingState.value = true

		// Contexte chapitre : l'id explicite prime, sinon celui passé à useFormular().
		const id = chapterId ?? currentChapterId.value

		// Aucun chapitre courant : on charge la bibliothèque globale (toutes les formules).
		if (id === null) {
			storeFormular.getAll()
				.then((data) => {
					formular.value = data
				})
				.finally(() => {
					loadingState.value = false
				})
			return
		}

		storeFormular.getChapterData(id)
			.then((data) => {
				formular.value = data.formular

				// Add the new chapters to the list
				data.chapters.forEach((chapter) => {
					if (
						!relatedChapters.value.find(
							(x) => x.id === chapter.id
						)
					) {
						relatedChapters.value.push(chapter)
					}
				})
			})
			.catch((err) => {
				errors.value = err.toJSON()
			})
			.finally(() => {
				loadingState.value = false
			})
	}

	function update(chapterId: number) {
		currentChapterId.value = chapterId
		loadingState.value = true
		load(currentChapterId.value)
	}

	function addFormula(chapterId: number) {
		axios
			.post(route("api.admin.chapters.formulas.store", [chapterId]), {})
			.then((res: AxiosResponseModel<FormulaInterface>) => {
				flash.success("formule créée")
				formular.value.push(res.data)

				storeFormular.invalidateChapter(chapterId)

				// Go and edit the new formula
				router.visit(route('admin.blocks.edit', {id: res.data.block.id}))
			})
	}

	function updateFormula(value: FormulaInterface) {
		console.log(value)
		axios.patch(route("api.admin.blocks.update", value.block.id), {
			_method: "patch",
			...value.block
		})
			.then(() => {
				flash.success("formulaire mis à jour")
			})
			.catch((error) => {
				console.log(error)
				flash.error("erreur lors de la mise à jour du formulaire")
			})
	}

	function destroyFormula(id: number) {
		formular.value = formular.value.filter(x => x.id !== id)
		storeFormular.removeFormula(id)
	}

	// Rattache une formule existante au chapitre courant (partage multi-chapitres).
	function attachFormula(formulaId: number) {
		const chapterId = currentChapterId.value
		if (chapterId === null) {
			return
		}

		axios
			.post(route("api.admin.chapters.formulas.attach", [chapterId, formulaId]))
			.then((res: AxiosResponseModel<FormulaInterface>) => {
				flash.success("La formule a été rattachée à ce chapitre.")
				formular.value.push(res.data)
				storeFormular.invalidateChapter(chapterId)
			})
			.catch(() => {
				flash.error("Erreur lors du rattachement de la formule.")
			})
	}

	// Supprime définitivement une formule orpheline depuis la bibliothèque globale.
	// Le backend refuse (422) si la formule est encore rattachée à un chapitre.
	function deleteOrphan(id: number) {
		axios
			.delete(route("api.admin.formulas.destroy", id))
			.then(() => {
				flash.success("La formule orpheline a été supprimée.")
				storeFormular.removeFormula(id)
				formular.value = formular.value.filter(x => x.id !== id)
			})
			.catch(() => {
				flash.error("Impossible de supprimer : détachez-la d'abord de tous ses chapitres.")
			})
	}

	// Détache la formule du chapitre courant : elle survit dans la bibliothèque globale.
	function detachFormula(id: number) {
		const chapterId = currentChapterId.value
		if (chapterId === null) {
			return
		}

		axios
			.delete(route("api.admin.chapters.formulas.detach", [chapterId, id]))
			.then(() => {
				flash.success("La formule a été détachée de ce chapitre.")
				formular.value = formular.value.filter(x => x.id !== id)
				storeFormular.invalidateChapter(chapterId)
			})
			.catch(() => {
				flash.error("Erreur lors du détachement de la formule.")
			})
	}

	return {
		updateOrder,
		update,
		load,
		loadingState,
		errors,
		currentChapterId,
		relatedChapters,
		formular,
		formula: {
			add: addFormula,
			update: updateFormula,
			destroy: destroyFormula,
			detach: detachFormula,
			attach: attachFormula,
			deleteOrphan: deleteOrphan
		}
	}
}
