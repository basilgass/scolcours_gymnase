import {defineStore} from "pinia"
import {ref} from "vue"
import axios from "axios"
import type {FormulaInterface} from "@/types/modelInterfaces.ts"
import type {ChapterInterface} from "@/types/chapterInterfaces.ts"
import {AxiosResponseModel} from "@/types"

interface ChapterData {
	formular: FormulaInterface[]
	chapters: ChapterInterface[]
}

// Pending promises pour éviter les requêtes parallèles sur la même ressource
let pendingAll: Promise<FormulaInterface[]> | null = null
const pendingChapters = new Map<number, Promise<ChapterData>>()

export const useStoreFormular = defineStore('formular', () => {

	const allFormulas = ref<FormulaInterface[] | null>(null)
	const chapterCache = ref<Record<number, ChapterData>>({})

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

	async function getChapterData(chapterId: number): Promise<ChapterData> {
		if (chapterCache.value[chapterId]) {
			return chapterCache.value[chapterId]
		}

		if (pendingChapters.has(chapterId)) {
			return pendingChapters.get(chapterId)!
		}

		const p = axios
			.get(route('api.chapters.formulas.index', {chapter: chapterId}))
			.then(res => {
				chapterCache.value[chapterId] = {
					formular: res.data.formular,
					chapters: res.data.chapters
				}
				return chapterCache.value[chapterId]
			})
			.finally(() => {
				pendingChapters.delete(chapterId)
			})

		pendingChapters.set(chapterId, p)
		return p
	}

	function invalidateChapter(chapterId: number): void {
		delete chapterCache.value[chapterId]
	}

	function removeFormula(formulaId: number): void {
		if (allFormulas.value) {
			const idx = allFormulas.value.findIndex(f => f.id === formulaId)
			if (idx !== -1) {
				allFormulas.value.splice(idx, 1)
			}
		}

		Object.values(chapterCache.value).forEach(data => {
			const idx = data.formular.findIndex(f => f.id === formulaId)
			if (idx !== -1) {
				data.formular.splice(idx, 1)
			}
		})
	}

	return {
		allFormulas,
		chapterCache,
		getAll,
		getChapterData,
		invalidateChapter,
		removeFormula,
	}
})
