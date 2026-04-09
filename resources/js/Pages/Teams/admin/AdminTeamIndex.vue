<script
	lang="ts"
	setup
>

import FilteredList from "@/Components/Ui/FilteredList.vue"
import Card from "@/Components/Ui/Card.vue"
import {router} from "@inertiajs/vue3"
import {computed, ref} from "vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"

defineOptions({layout: LayoutAdmin})

interface simpleTeam {
	active: boolean;
	id: number;
	name: string;
	users_count: number;
}

const props = defineProps<{
	teams: simpleTeam[]
}>()

const activeTeams = computed(() => {
	return props.teams.filter(team => team.active)
})
const showInactiveTeams = ref(false)
const inactiveTeams = computed(() => {
	return props.teams.filter(team => !team.active)
})

</script>
<template>
	<article class="scolcours-container">
		<article-title
			:return-link="{
				url: route('admin.index'),
				label: 'administration'
			}"
			title="équipes"
		>
			<template #right>
				<FormSwitch
					v-model="showInactiveTeams"
					label="afficher les équipes inactives"
				/>
			</template>
		</article-title>

		<div>
			<filtered-list
				:list="activeTeams"
				list-class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5"
				title="équipes actives"
			>
				<template #card="{item}: {item: simpleTeam}">
					<Card
						as="button"
						class="cursor-pointer flex flex-col gap-2 text-center"
						@click="router.visit(route('admin.teams.show', [item.name]))"
					>
						<div class="font-semibold text-xl">
							{{ item.name }}
						</div>
						<div>{{ item.users_count }} étudiants</div>
					</Card>
				</template>
			</filtered-list>
		</div>

		<div
			v-if="showInactiveTeams"
			class="mt-10"
		>
			<filtered-list
				:list="inactiveTeams"
				list-class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5"
				title="équipes inactives"
			>
				<template #card="{item}: {item: simpleTeam}">
					<Card
						as="button"
						class="cursor-pointer flex flex-col gap-2 text-center opacity-40"
						@click="router.visit(route('admin.teams.show', [item.name]))"
					>
						<div class="font-semibold text-xl">
							{{ item.name }}
						</div>
						<div>{{ item.users_count }} étudiants</div>
					</Card>
				</template>
			</filtered-list>
		</div>
	</article>
</template>
