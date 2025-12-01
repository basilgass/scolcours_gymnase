<script lang="ts" setup>
import {EvaluationAdminInterface, EvaluationInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import Card from "@/Components/Ui/Card.vue"
import EvaluationCreate from "@/Components/Evaluations/EvaluationCreate.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import {Link as InertiaLink} from "@inertiajs/vue3"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {ref} from "vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutAdmin})

const flash = useStoreFlashMessage()

let props = defineProps<{
	evaluations: EvaluationAdminInterface[],
	teams: TeamInterface[]
}>()

const theEvaluations = ref<EvaluationAdminInterface[]>(props.evaluations)

function toggleTeam(evaluation: EvaluationInterface, team: TeamInterface) {
	axios
		.patch(route('api.admin.evaluations.toggle-team', {evaluation: evaluation.id, team: team.id}))
		.then((res: AxiosResponseModel<boolean>) => {
			if (res.data) {
				// On ajoute la team
				theEvaluations.value
					.find(e => evaluation.id === e.id)
					.teams.push(team)
			} else {
				// On supprime la team
				const c = theEvaluations.value.findIndex(e => evaluation.id === e.id)
				const t = theEvaluations.value[c].teams.findIndex(t => t.id === team.id)
				theEvaluations.value[c].teams.splice(t, 1)
			}
			flash.success('édition effectuée')
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
			flash.error('problème')
		})

}
</script>

<template>
	<article>
		<article-title title="évaluations">
			<template #right>
				<evaluation-create />
			</template>
		</article-title>

		<filtered-list
			:list="theEvaluations"
			list-class="grid grid-cols-1 gap-3"
		>
			<template #card="{item}: {item: EvaluationAdminInterface}">
				<Card>
					<template #header>
						<div class="flex justify-between">
							<div>
								<h3 v-katex.auto="item.title" />
								<div class="font-code text-xs">
									{{ item.slug }}
								</div>
							</div>
							<div class="flex gap-3 items-baseline">
								<sc-button
									v-admin
									type="edit"
									icon
									xs
									:href="route('admin.evaluations.edit', {evaluation: item.id})"
								>
									éditer
								</sc-button>
								<sc-button
									type="default"
									xs
									:href="route('students.evaluations.show', {evaluation: item.id})"
								>
									<i class="bi bi-eye" />voir
								</sc-button>
							</div>
						</div>
					</template>
					<div class="flex gap-3">
						<div
							v-for="team in item.teams"
							:key="`eval-${item.id}-team-${team.id}`"
						>
							<InertiaLink
								:href="route('admin.evaluations.show', {evaluation: item.id, team: team.name})"
							>
								{{ team.name }}
							</InertiaLink>
						</div>
					</div>
					<template #footer>
						<div class="flex flex-wrap gap-3">
							<sc-button
								v-for="team in teams"
								:key="`toggle-${team.id}`"
								:type="item.teams.filter(t=>team.id===t.id).length ? 'primary' : 'default'"
								xs
								@click="toggleTeam(item, team)"
							>
								{{ team.name }}
							</sc-button>
						</div>
					</template>
				</Card>
			</template>
		</filtered-list>
	</article>
</template>


