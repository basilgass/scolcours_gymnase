import axios from "axios"
import {AxiosResponseModel} from "@/types"
import {FormulaInterface} from "@/types/modelInterfaces.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {useStoreFormular} from "@/stores/useStoreFormular.ts"
import {computed, ref} from "vue"
import {router} from "@inertiajs/vue3"

interface RelatedChapter {
	id: number
	title: string
	theme_id: number
}

export function useFormular(chapterId?: number) {
	const flash = useStoreFlashMessage()
	const storeFormular = useStoreFormular()

	// Source unique : toutes les formules. Les vues chapitre/bibliothèque en sont dérivées
	// (filtrage + réordonnancement), sans jamais remplacer les objets → aucun remount.
	const formular = ref<FormulaInterface[]>([])
	const currentChapterId = ref<number | null>(chapterId ?? null)

	const loadingState = ref<boolean>(false)
	const errors = ref("")

	// Ordre pivot d'une formule pour un chapitre donné.
	function orderFor(formula: FormulaInterface, chapterId: number): number {
		return formula.chapters.find(c => c.id === chapterId)?.order ?? 0
	}

	// Amène les formules du chapitre courant en tête, dans leur ordre pivot. On réassigne
	// un nouveau tableau AVEC les mêmes objets : le v-for keyé déplace le DOM sans remonter
	// les composants (pas de flash KaTeX). En bibliothèque, on ne touche pas à l'ordre.
	function applyContextOrder(): void {
		const id = currentChapterId.value
		if (id === null) {
			return
		}
		const inChapter: FormulaInterface[] = []
		const rest: FormulaInterface[] = []
		for (const f of formular.value) {
			if (f.chapters.some(c => c.id === id)) {
				inChapter.push(f)
			} else {
				rest.push(f)
			}
		}
		inChapter.sort((a, b) => orderFor(a, id) - orderFor(b, id))
		formular.value = [...inChapter, ...rest]
	}

	// Chapitres liés (boutons de bascule) : dérivés de la liste maître — chapitres actifs
	// du même thème que le chapitre courant ayant au moins une formule. Les relations
	// manuelles inter-thèmes ne sont pas incluses (décision de la source unique).
	const relatedChapters = computed<RelatedChapter[]>(() => {
		const id = currentChapterId.value
		if (id === null) {
			return []
		}

		let themeId: number | null = null
		for (const f of formular.value) {
			const c = f.chapters.find(c => c.id === id)
			if (c) {
				themeId = c.theme_id
				break
			}
		}
		if (themeId === null) {
			return []
		}

		const byId = new Map<number, RelatedChapter>()
		for (const f of formular.value) {
			for (const c of f.chapters) {
				if (c.theme_id === themeId && c.active) {
					byId.set(c.id, {id: c.id, title: c.title, theme_id: c.theme_id})
				}
			}
		}
		return [...byId.values()]
	})

	function load() {
		loadingState.value = true
		storeFormular.getAll()
			.then((data) => {
				formular.value = data
				applyContextOrder()
			})
			.catch((err) => {
				errors.value = typeof err?.toJSON === "function" ? err.toJSON() : String(err)
			})
			.finally(() => {
				loadingState.value = false
			})
	}

	// Bascule de contexte : instantanée, sans requête (la liste maître est déjà chargée).
	function update(chapterId: number | null) {
		currentChapterId.value = chapterId
		applyContextOrder()
	}

	function updateOrder() {
		const id = currentChapterId.value
		if (id === null) {
			return
		}

		// Après le drag, les formules du chapitre sont contiguës en tête : leur nouvel ordre
		// est simplement leur index dans cette sous-séquence.
		const chapterFormulas = formular.value.filter(f => f.chapters.some(c => c.id === id))

		axios
			.post(route("api.admin.formulas.order"), {
				chapter_id: id,
				order: chapterFormulas.map((f, index) => ({id: f.id, order: index}))
			})
			.then(() => {
				// Ordre pivot local synchronisé.
				chapterFormulas.forEach((f, index) => {
					const c = f.chapters.find(c => c.id === id)
					if (c) {
						c.order = index
					}
				})
				flash.success("L'ordre des formules à bien été enregistré !")
			})
			.catch((res) => {
				flash.error("Erreur lors de la mise à jour de l'ordre des formules")
				console.warn("update ordering order: ", res.data)
			})
	}

	function addFormula(chapterId: number) {
		axios
			.post(route("api.admin.chapters.formulas.store", [chapterId]), {})
			.then((res: AxiosResponseModel<FormulaInterface>) => {
				flash.success("formule créée")
				formular.value.push(res.data)
				storeFormular.invalidateAll()

				// Go and edit the new formula
				router.visit(route('admin.blocks.edit', {id: res.data.block.id}))
			})
	}

	// Crée une formule orpheline (aucun chapitre) depuis la bibliothèque globale.
	function addOrphan() {
		axios
			.post(route("api.admin.formulas.store"))
			.then((res: AxiosResponseModel<FormulaInterface>) => {
				flash.success("formule orpheline créée")
				formular.value.push(res.data)
				storeFormular.invalidateAll()

				// Go and edit the new formula
				router.visit(route('admin.blocks.edit', {id: res.data.block.id}))
			})
			.catch(() => {
				flash.error("Erreur lors de la création de la formule.")
			})
	}

	function updateFormula(value: FormulaInterface) {
		axios.patch(route("api.admin.blocks.update", value.block.id), {
			_method: "patch",
			...value.block
		})
			.then(() => {
				flash.success("formulaire mis à jour")
			})
			.catch(() => {
				flash.error("erreur lors de la mise à jour du formulaire")
			})
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

				// Mise à jour en place pour préserver l'identité de l'objet (pas de remount).
				const existing = formular.value.find(f => f.id === formulaId)
				if (existing) {
					Object.assign(existing, res.data)
				} else {
					formular.value.push(res.data)
				}
				applyContextOrder()
				storeFormular.invalidateAll()
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
				formular.value = formular.value.filter(x => x.id !== id)
				storeFormular.invalidateAll()
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

				// La formule survit : on retire juste le chapitre courant de ses rattachements.
				const f = formular.value.find(x => x.id === id)
				if (f) {
					f.chapters = f.chapters.filter(c => c.id !== chapterId)
				}
				applyContextOrder()
				storeFormular.invalidateAll()
			})
			.catch(() => {
				flash.error("Erreur lors du détachement de la formule.")
			})
	}

	// Après un déplacement (MoveItemTo) : la formule est re-rattachée au seul chapitre cible.
	// On rafraîchit son état exact depuis le serveur, en place (identité préservée).
	function refreshFormula(id: number) {
		axios
			.get(route("api.formulas.show", id))
			.then((res: AxiosResponseModel<FormulaInterface>) => {
				const existing = formular.value.find(f => f.id === id)
				if (existing) {
					Object.assign(existing, res.data)
				}
				applyContextOrder()
				storeFormular.invalidateAll()
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
			addOrphan: addOrphan,
			update: updateFormula,
			detach: detachFormula,
			attach: attachFormula,
			deleteOrphan: deleteOrphan,
			refresh: refreshFormula
		}
	}
}
