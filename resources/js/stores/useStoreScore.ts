import {defineStore} from "pinia"
import {computed, ref} from "vue"
import {ScoreInterface} from "@/types/modelInterfaces.ts"
import {usePage} from "@inertiajs/vue3"
import {AxiosResponseModel} from "@/types"
import axios from "axios"
import {scoreableClassName, ScoreDataInterface} from "@/types/scoreInterfaces.ts"

export const useStoreScore = defineStore(
	"score_user_store",
	() => {

		// Liste des scores de l'utilisateur
		const scores = ref<ScoreInterface[]>([])
		// Id de l'utilisateur.
		const userId = computed(() => usePage().props.auth.user?.id ?? null)

		// Charge (et créé si nécessaire) les scores pour un modèle / utilisateur
		async function loadModelScores(type: scoreableClassName, ids: number[]) {
			const existingIds = scores.value.map(score => score.id)
			const loadingIds = ids.filter(id => !existingIds.includes(id))

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
			res.data.forEach(score => scores.value.push(score))
		}

		// Conversion en ClassName
		function typeToModelClassName(type: string): string {
			return 'App\\Models\\' + type
		}

		// Faux score : utilie si l'utilisateur n'est pas connecté par exemple.
		function fakeScore(type: scoreableClassName, id: number): ScoreInterface {
			return {
				id: scores.value.length + 1,
				user_id: null,
				score: 0,
				scoreable_id: id,
				scoreable_type: typeToModelClassName(type),
				is_resolved: null,
				attempts: 0,
				data: null,
				updated_at: 'fake score'
			}
		}

		function defaultScoreData(typeName: string): ScoreDataInterface {
			const type = typeName.split('\\').pop() as scoreableClassName

			if (type === "Card") {
				return {
					success: 0,
					appearances: 0,
					time_spent: 0,
					current_score: 0,
					current_appearances: 0,
					current_time_spent: 0
				}
			}

			return null
		}

		function updateScoreData<T extends ScoreDataInterface>(score: ScoreInterface): ScoreInterface<T> {
			if (score.data === null) {
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

// Récupère le score d'un modèle
		async function getScore<T extends ScoreDataInterface>(type: scoreableClassName, id: number): Promise<ScoreInterface<T>>{
			const modelType = typeToModelClassName(type)

			const score = scores.value.find(score =>
				score.scoreable_type === modelType &&
				score.scoreable_id === id)

			// Un score a été trouvé.
			if (score) {
				return updateScoreData<T>(score)
			}

			// Le score n'a pas été trouvé - on le recherche dans la DB
			await loadModelScores(type, [id])

			return await getScore<T>(type, id)
		}

// Récupère les scores d'un type de modèle
		let consecutiveModelLoading = 0

		async function getScores<T extends ScoreDataInterface>(type: scoreableClassName, ids: number[]): Promise<ScoreInterface<T>[]> {
			const modelType = typeToModelClassName(type)

			const arr = scores.value
				.filter(score =>
					(score.scoreable_type === modelType) &&
					ids.includes(score.scoreable_id)
				)
			// Un score a été trouvé.
			if (arr.length === ids.length) {
				consecutiveModelLoading = 0
				return arr.map(s => updateScoreData<T>(s))
			}

			// Le score n'a pas été trouvé - on le recherche dans la DB
			await loadModelScores(type, ids)

			consecutiveModelLoading++
			if (consecutiveModelLoading > 100) {
				throw new Error('troP De REPET')
			}
			return await getScores<T>(type, ids)
		}

// Supprime les scores d'un utilisateur.
		async function reset(scoreIds: number[]) {
			// TODO: le reset ne doit pas supprimer, mais mettre à jour la BD.
			return axios.delete(route('api.admin.scores.destroy.multiple', {ids: scoreIds}))
		}

		function getIndexFromScoreId(id: number): number {
			return scores.value.findIndex(s => s.id === id)
		}

// Mise à jour d'un score.
		async function updateScore(score: ScoreInterface) {
			const index = getIndexFromScoreId(score.id)

			if (!userId.value) {
				return scores.value[index] = score
			}


			axios.patch(
				route('api.students.scores.update', {score: score.id}),
				score
			).then((response: AxiosResponseModel<ScoreInterface>) => {
				// Remplacer dans scores: Ref<ScoreInterface> par le nouveau score
				const updated = response.data as ScoreInterface

				if (index !== -1) {
					scores.value[index] = updated
				}
			})
		}

		return {
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
