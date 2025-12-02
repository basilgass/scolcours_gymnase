<script
	lang="ts"
	setup
>
import FilteredList from "@/Components/Ui/FilteredList.vue"
import type {CourseInterface, TeamInterface, UserInterface} from "@/types/modelInterfaces.ts"
import SchoolTimetable from "@/Components/Courses/SchoolTimetable.vue"
import CourseCard from "@/Components/Courses/CourseCard.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
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
	// chapters: ChapterShowInterface[],
	// challenges: ChallengeInterface[],
	// calendars: TeamCalendarInterface[]
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
				<form-maker
					v-model="active"
					label="actif"
					type="switch"
					@update="updateActiveState"
				>
					actif
				</form-maker>
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
			<school-timetable
				:team
			/>
			<!--			<div class="grid grid-cols-5 gap-2 md:gap-5">-->
			<!--				<div-->
			<!--					v-for="(day, index) in days"-->
			<!--					:key="`calendar-day-${day}`"-->
			<!--					class="text-center"-->
			<!--				>-->
			<!--					<h3 class="font-semibold">-->
			<!--						{{ day }}-->
			<!--					</h3>-->
			<!--					<div-->
			<!--						v-for="item in calendars.filter(x=>x.day===index+1)"-->
			<!--						:key="`calendar-item-${item.id}`"-->
			<!--					>-->
			<!--						<div class="rounded-full border bg-content border-content px-3 py-1">-->
			<!--							{{ item.time }}-->
			<!--						</div>-->
			<!--					</div>-->
			<!--				</div>-->
			<!--			</div>-->
		</div>


		<!--		 Utile : pour les challenges uniquement.-->
		<!--		<div class="grid grid-cols-1 md:grid-cols-2 gap-5">-->
		<!--			<filtered-list-->
		<!--				:item-background="(item) => item.theme_id"-->
		<!--				:list="props.chapters"-->
		<!--				:route-data="(item) => [props.team.name, item.slug]"-->
		<!--				:route-name="'teams.chapters.stats'"-->
		<!--				list-class="grid grid-cols-1 gap-3 xl:grid-cols-2"-->
		<!--				title="chapitres"-->
		<!--			/>-->

		<!--			<filtered-list-->
		<!--				:item-background="(item) => item.chapter.theme_id"-->
		<!--				:list="props.challenges"-->
		<!--				:route-data="(item) => [props.team.name, item.slug]"-->
		<!--				:route-name="'teams.challenge'"-->
		<!--				list-class="grid grid-cols-1 gap-3 xl:grid-cols-2"-->
		<!--				title="challenges"-->
		<!--			/>-->
		<!--		</div>-->
	</article>
</template>
