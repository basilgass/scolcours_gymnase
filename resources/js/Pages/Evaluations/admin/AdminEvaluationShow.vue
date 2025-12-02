<script setup lang="ts">

import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import {EvaluationAdminInterface, QuestionInterface, ScoreInterface, UserInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import axios from "axios"
import {AxiosResponseModel} from "@/types"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"

defineOptions({layout: LayoutAdmin})
const props = defineProps<{
	evaluation: EvaluationAdminInterface
}>()

interface UserScore {
	user: UserInterface,
	scores: ScoreInterface[]
}

const scores = ref<UserScore[]>([])

function loadScores(team: string) {
	axios.get(route('api.admin.evaluations.teams.scores', {evaluation: props.evaluation.id, team}))
		.then((res: AxiosResponseModel<UserScore[]>) => {
			scores.value = res.data
			selectedTeam.value = team
		})
}

const total = computed(() => props.evaluation.questions.length)

function result(scores: ScoreInterface[]) {
	return scores.filter(score => score.is_resolved).length
}

const selectedTeam = ref<string>('')
const selectedUser = ref<UserInterface>(null)
const selectedQuestion = ref<QuestionInterface>(null)
onMounted(() => {
	const params = new URLSearchParams(window.location.search)
	const team = params.get('team')

	if (team) {
		loadScores(team)
	}
})
</script>

<template>
	<main>
		<h2
			class="text-2xl"
			v-katex.auto="evaluation.title"
		/>

		<div class="text-lg mt-10 mb-3">
			Les équipes
		</div>
		<div class="flex gap-3">
			<sc-button
				v-for="team in evaluation.teams"
				:key="team.name"
				@click="loadScores(team.name)"
				xs1
				:type="team.name===selectedTeam ? 'primary' : 'default'"
			>
				{{ team.name }}
			</sc-button>
		</div>

		<div>
			<h3 class="text-lg mt-10 mb-3">
				score
			</h3>
			<div
				v-if="scores.length"
				class="space-y-2"
			>
				<div
					v-for="score in scores"
					:key="score.user.id"
					class="flex flex-col md:gap-3 md:flex-row md:items-center"
				>
					<div class="flex">
						<div
							class="w-[200px] gap-3 overflow-auto"
							@click="selectedUser = score.user"
						>
							{{ score.user.fullname }}
						</div>
						<div>
							{{ result(score.scores) }} / {{ total }}
						</div>
					</div>
					<div class="flex gap-0.5">
						<div
							v-for="q in evaluation.questions"
							:key="`user-${score.user.id}-${q.id}`"
							class="w-4 h-4 border border-content cursor-pointer"
							:class="{
								'bg-gray-300 border-gray-500': score.scores.find(s => s.scoreable_id === q.id)===undefined || score.scores.find(s => s.scoreable_id === q.id).is_resolved===null,
								'bg-green-100 border-green-600': score.scores.find(s => s.scoreable_id === q.id)?.is_resolved,
								'bg-red-100 border-red-600': score.scores.find(s => s.scoreable_id === q.id)?.is_resolved===false,
							}"
							@click="selectedQuestion = q"
						/>
					</div>
				</div>
			</div>
			<div
				v-else
				class="min-h-[5em] font-code"
			>
				Chargement des scores...
			</div>
		</div>

		<div
			v-if="selectedQuestion"
			class="mt-10 max-w-lg mx-auto"
		>
			<question-show
				:question="selectedQuestion"
				:key="`question-${selectedQuestion.id}`"
			/>
		</div>

		<div
			v-if="selectedUser"
			class="mt-10"
			:key="`user-${selectedUser.id}`"
		>
			<h3 class="text-xl font-semibold">
				{{ selectedUser.fullname }}
			</h3>
			<div> charger les questions avec le score des utilisateurs.</div>
			<pre>{{ selectedUser }}</pre>
			<questions-index
				:container="{id: evaluation.id, type: 'Evaluation' }"
				:questions="evaluation.questions"
				:user-id="selectedUser.id"
			/>
		</div>
	</main>
</template>

<style scoped>

</style>
