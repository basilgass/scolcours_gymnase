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
	const currentChapterId = ref<number>(chapterId ?? null)
	const relatedChapters = ref<ChapterInterface[]>([])

	const loadingState = ref<boolean>(false)
	const errors = ref("")

	function updateOrder() {
		axios
			.post(route("api.admin.formulas.order"), {
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

		if (chapterId === undefined) {
			storeFormular.getAll()
				.then((data) => {
					formular.value = data
				})
			return
		}

		storeFormular.getChapterData(chapterId ?? currentChapterId.value)
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
			destroy: destroyFormula
		}
	}
}
