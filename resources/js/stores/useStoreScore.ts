import {defineStore} from "pinia"
import {computed, ref} from "vue"
import {ScoreInterface} from "@/types/modelInterfaces.ts"
import {usePage} from "@inertiajs/vue3"
import {AxiosResponseModel} from "@/types"
import axios from "axios"
import {scoreableClassName, ScoreDataInterface} from "@/types/scoreInterfaces.ts"

const pendingGetScores = new Map<string, Promise<ScoreInterface[]>>()
const pendingScoreById = new Map<string, Map<string, Promise<ScoreInterface>>>()

function makeKey(type: scoreableClassName, ids: number[]): string {
	const sortedIds = [...ids].sort((a, b) => a - b)
	return `${type}:${sortedIds.join(',')}`
}

export const useStoreScore = defineStore(
	"score_user_store",
	() => {

		const version = ref(0)

		const lastUpdated = ref<ScoreInterface>()

		function bumpVersion() {
			version.value++
		}

		function bumpLastUpdated(score: ScoreInterface) {
			lastUpdated.value = score
		}

		// Liste des scores de l'utilisateur
		const scores = ref<ScoreInterface[]>([])

		// Id de l'utilisateur.
		const userId = computed(() => usePage().props.auth.user?.id ?? null)

		// Charge (et créé si nécessaire) les scores pour un modèle / utilisateur
		async function loadModelScores(type: scoreableClassName, ids: number[]) {
			const existing = new Set(scores.value
				.filter(s => s.scoreable_type === type)
				.map(s => s.scoreable_id)
			)

			const loadingIds = ids.filter(id => !existing.has(id))

			// Aucune ids à charger
			if (loadingIds.length === 0) {
				return
			}

			// Il n'y a pas d'utilisateur, création d'un `fake` id.
			if (!userId.value) {
				loadingIds.forEach(id => {
					scores.value.push(fakeScore(type, id))
				})
				return
			}

			const res: AxiosResponseModel<ScoreInterface[]> = await axios
				.get(route('api.students.scores.index', {
					ids: loadingIds,
					type
				}))

			// Keep the scores live
			res.data.forEach(score => {
				// On vérifie que le score contient bien les valeurs par défaut du data.
				if (!score.data) {
					score.data = defaultScoreData(type)
				}

				scores.value.push(score)
			})
		}

		// Faux score : utilie si l'utilisateur n'est pas connecté par exemple.
		function fakeScore<T extends ScoreDataInterface>(type: scoreableClassName, id: number): ScoreInterface<T> {
			return {
				id: scores.value.length + 1,
				user_id: null,
				score: 0,
				scoreable_id: id,
				scoreable_type: type,
				is_resolved: null,
				attempts: 0,
				data: defaultScoreData(type),
				updated_at: 'fake score'
			}
		}

		function defaultScoreData<T extends ScoreDataInterface>(type: scoreableClassName): T {

			let arr: Partial<ScoreDataInterface>
			if (type === 'Question') {
				arr = {
					answers: []
				}
			}

			if (type === 'Deck') {
				// Nothing here
			}

			if (type === 'Card') {
				arr = {
					current_score: 0,
					current_appearances: 0,
					current_time_spent: 0,
					appearances: 0,
					success: 0,
					time_spent: 0
				}
			}

			if (type === "Challenge") {
				arr = {
					current_score: 0,
					current_level: 0,
					level: 0,
				}
			}

			if (type === "Generator") {
				arr = {
					current_score: 0
				}
			}

			if (type === "Lesson") {
				// Nothing here
			}

			return arr as T
		}

		// function oldVersionOfScoreData(typeName: string): ScoreDataInterface {
		// 	const type = typeName.split('\\').pop() as scoreableClassName
		//
		// 	if (type === "Card") {
		// 		return {
		// 			success: 0,
		// 			appearances: 0,
		// 			time_spent: 0,
		// 			current_score: 0,
		// 			current_appearances: 0,
		// 			current_time_spent: 0
		// 		}
		// 	}
		//
		// 	return null
		// }

		function updateScoreData<T extends ScoreDataInterface>(score: ScoreInterface): ScoreInterface<T> {
			if (score.data === null) {
				// MAYBE REDUNDANT AS BY DEFAULT
				if (score.scoreable_type !== 'Lesson' && score.scoreable_type !== 'Deck') {
					console.warn('UPDATE SCORE DATA', score.scoreable_type, score.scoreable_id)
				}
				score.data = defaultScoreData(score.scoreable_type)
			}
			return score as ScoreInterface<T>
		}

		// Réinitialise le score
		async function resetScore(score) {
			score.score = 0
			score.is_resolved = null
			score.attempts = 0
			score.data = defaultScoreData(score.scoreable_type)
			return updateScore(score)
		}

		async function resetData(score) {
			score.data = defaultScoreData(score.scoreable_type)
			return updateScore(score)
		}

		// Vérifie si une promise est en attente pour une clé donnée dans les valeurs du Map
		function getPendingPromiseForKey(key: string): Promise<ScoreInterface> | undefined {
			for (const perIdMap of pendingScoreById.values()) {
				if (perIdMap.has(key)) {
					return perIdMap.get(key)
				}
			}
			return undefined
		}

		// Récupère le score d'un modèle
		async function getScore<T extends ScoreDataInterface>(type: scoreableClassName, id: number): Promise<ScoreInterface<T>> {
			// l'id n'est pas conforme - retourne un score "faux"
			if (id === undefined || id <= 0) {
				return fakeScore<T>(type, id)
			}

			const pending = getPendingPromiseForKey(makeKey(type, [id]))
			if (pending) {
				return pending as Promise<ScoreInterface<T>>
			}

			// On recherche le score en faisant une recherche multiple sur un élément.
			const scores = await getScores<T>(type, [id])
			if (!scores.length) throw new Error(`Score not found for ${type}#${id}`)
			return scores[0]
		}

		// Récupère les scores d'un type de modèle
		async function getScores<T extends ScoreDataInterface>(
			type: scoreableClassName,
			ids: number[]
		): Promise<ScoreInterface<T>[]> {
			const key = makeKey(type, ids)

			if (pendingGetScores.has(key)) {
				return pendingGetScores.get(key) as Promise<ScoreInterface<T>[]>
			}

			const promise = (async () => {
				let check = validateMatchingScores<T>(type, ids)

				// Un score a été trouvé.
				if (check.valid) {
					return check.result
				}

				if (check.duplicates) {
					// Il y a des duplicatats !
					return check.result
				}

				// Le score n'a pas été trouvé - on le recherche dans la DB
				await loadModelScores(type, ids)

				check = validateMatchingScores<T>(type, ids)

				if (!check.valid) {
					throw new Error('Failed to load all scores')
				}

				return check.result
			})()

			pendingGetScores.set(key, promise)

			// Création de la map par id
			const perIdMap = pendingScoreById.get(key) ?? new Map<string, Promise<ScoreInterface>>()
			pendingScoreById.set(key, perIdMap)

			ids.forEach(id => {
				const keyId = makeKey(type, [id])
				if (!perIdMap.has(keyId)) {
					const p = promise.then(scores => {
						const match = scores.find(s => s.scoreable_id === id)
						if (!match) throw new Error(`Score ${id} not found in group ${key}`)
						return match
					})
					perIdMap.set(keyId, p)
				}
			})

			// Nettoyage des caches une fois la promesse terminée
			promise.finally(() => {
				pendingGetScores.delete(key)
				pendingScoreById.delete(key)
			})

			return promise
		}

		function validateMatchingScores<T extends ScoreDataInterface>(
			type: scoreableClassName,
			ids: number[]
		): { valid: boolean; result: ScoreInterface<T>[]; duplicates: boolean } {
			const matching = scores.value.filter(
				s => s.scoreable_type === type && ids.includes(s.scoreable_id)
			) as ScoreInterface<T>[]

			const result = matching.map(s => updateScoreData<T>(s))
			const valid = matching.length === ids.length
			const duplicates = matching.length > ids.length

			return {valid, result, duplicates}
		}

// Supprime les scores d'un utilisateur.
		async function reset(scoreIds: number[]) {
			// TODO: Multi reset score => needs to make multi update.
			const affectedScores = await axios
				.get(route('api.students.scores.index', {ids: scoreIds}))

			affectedScores.data.forEach((score: ScoreInterface) => {
				score.score = 0
				score.is_resolved = false
				score.data = defaultScoreData(score.scoreable_type)
				updateScore(score, true)
			})

			bumpVersion()
			// return axios.delete(route('api.admin.scores.destroy.multiple', {ids: scoreIds}))
		}

		function getIndexFromScoreId(id: number): number {
			return scores.value.findIndex(s => s.id === id)
		}

// Mise à jour d'un score.
		async function updateScore(score: ScoreInterface, silent?: boolean) {
			const index = getIndexFromScoreId(score.id)

			if (!userId.value) {
				scores.value.splice(index, 1, score)
				return
			}

			axios.patch(
				route('api.students.scores.update', {score: score.id}),
				score
			).then((response: AxiosResponseModel<ScoreInterface>) => {
				// Remplacer dans scores: Ref<ScoreInterface> par le nouveau score
				const updated = response.data as ScoreInterface

				if (index !== -1) {
					scores.value.splice(index, 1, updated)
					if (silent !== true) {
						bumpVersion()
						bumpLastUpdated(updated)
					}
				}
			})
		}


		return {
			version,
			lastUpdated,
			scores,
			getScore,
			getScores,
			reset,
			updateScore,
			resetScore,
			resetData
		}
	}
)
