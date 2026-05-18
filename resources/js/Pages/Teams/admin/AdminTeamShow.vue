<script
	lang="ts"
	setup
>
import FilteredList from "@/Components/Ui/FilteredList.vue"
import type {
	ChallengeInterface,
	CourseInterface,
	GeneratorInterface,
	TeamInterface,
	UserInterface
} from "@/types/modelInterfaces.ts"
import SchoolTimetable from "@/Components/Courses/SchoolTimetable.vue"
import CourseCard from "@/Components/Courses/CourseCard.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import {ref} from "vue"
import axios from "axios"
import {AxiosErrorMessage} from "@/types"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"

defineOptions({layout: LayoutAdmin})


const props = defineProps<{
	team: TeamInterface,
	students: UserInterface[],
	courses: CourseInterface[],
	challenges: ChallengeInterface[],
	generators: GeneratorInterface[],
}>()

const active = ref(props.team.active)

const flash = useStoreFlashMessage()

function updateActiveState() {
	axios.patch(route('api.admin.teams.update', {team: props.team.id}), {
		active: active.value
	})
		.then(() => {
			flash.success(`L'équipe ${props.team.name} a été ${active.value ? '' : 'dés'}activée.`)
		})
		.catch((res: AxiosErrorMessage) => {
			flash.error(res.response.data.message)
		})
}
</script>
<template>
	<article class="scolcours-container">
		<article-title
			:return-link="{
				url: route('admin.teams.index'),
				label: 'retour aux équipes'
			}"
			:title="team.name"
		>
			<template #right>
				<FormSwitch
					v-model="active"
					label="actif"
					@update="updateActiveState"
				>
					actif
				</FormSwitch>
			</template>
		</article-title>


		<filtered-list
			:item-title="(x) => x.name"
			:list="props.students"
			:title="`${props.students.length} étudiants`"
			item-class="bg-white"
		>
			<template #card="{ item }: { item: string | object }">
				<div class="bg-content rounded-lg border p-4 min-h-[3em]">
					<i class="bi bi-person mr-3" />{{ (typeof item === "string") ? item : item['name'] }}
				</div>
			</template>
		</filtered-list>

		<div class="mt-10">
			<h3 class="text-xl font-semibold mb-3">
				Liste des cours
			</h3>

			<filtered-list
				:list="courses"
				list-class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
			>
				<template #card="{item}: {item: CourseInterface}">
					<course-card
						:course="item"
						:team
					/>
				</template>
			</filtered-list>
		</div>

		<div class="mt-10">
			<h3 class="text-xl font-semibold mb-3">
				Calendrier des cours
			</h3>

			<div class="bg-content p-3 rounded">
				<school-timetable
					:team
				/>
			</div>
		</div>


		Utile : pour les challenges uniquement.
		<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
			<filtered-list
				:item-background="(item) => item.chapter?.theme_id ?? null"
				:list="props.challenges"
				:route-data="(item) => {return {team: props.team.name, challenge: item.slug}}"
				:route-name="'admin.teams.challenges.show'"
				list-class="grid grid-cols-1 gap-3 xl:grid-cols-2"
				title="challenges"
			/>

			<filtered-list
				:item-background="(item) => item.theme_id ?? null"
				:list="props.generators"
				:route-data="(item) => {return {team: props.team.name, generator: item.slug}}"
				:route-name="'admin.teams.generators.show'"
				list-class="grid grid-cols-1 gap-3 xl:grid-cols-2"
				title="générateurs"
			/>
		</div>
	</article>
</template>
