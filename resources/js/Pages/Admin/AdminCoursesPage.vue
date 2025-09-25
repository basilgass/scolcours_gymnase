<script setup lang="ts">

import {CourseInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {computed, ref} from "vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import axios from "axios"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {slugify} from "@/scolcours.ts"
import {router} from "@inertiajs/vue3"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})
const flash = useStoreFlashMessage()
const props = defineProps<{
	courses: CourseInterface[],
	teams: UserTeamInterface[]
}>()

const showCreate = ref(false)
const newCourseTitle = ref("")
const newCourseSlug = computed(() => {
	return slugify(newCourseTitle.value)
})

function addCourse() {
	axios.post(route('api.admin.courses.store'), {
		title: newCourseTitle.value,
		slug: newCourseSlug.value
	})
		.then((res: { data: CourseInterface }) => {
			router.visit(route('admin.courses.edit', {course: res.data.slug}))
		})
		.catch((err: AxiosErrorMessage) => {
			console.log(err.response.data.message)
		})
}

function deleteCourse(id: number) {
	axios.delete(route('api.admin.courses.destroy', {id}))
		.then(() => {
			const index = theCourses.value.findIndex(course => course.id === id)
			theCourses.value.splice(index, 1)
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

const theCourses = ref<CourseInterface[]>(props.courses)

function toggleTeam(course: CourseInterface, team: UserTeamInterface) {
	axios
		.patch(route('api.admin.courses.toggle-team', {course: course.id, team: team.id}))
		.then((res: AxiosResponseModel<boolean>) => {
			if (res.data) {
				// On ajoute la team
				theCourses.value
					.find(c => course.id === c.id)
					.teams.push(team)
			} else {
				// On supprime la team
				const c = theCourses.value.findIndex(c => course.id === c.id)
				const t = theCourses.value[c].teams.findIndex(t => t.id === team.id)
				theCourses.value[c].teams.splice(t, 1)
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
	<section>
		<div>
			<article-title
				title="gestion des cours"
				:return-link="{
					url: route('admin.index'),
					label: 'retour à l\'administration'
				}"
			>
				<template #right>
					<sc-button
						type="add"
						xs
						@click="showCreate = true"
					>
						<i class="bi bi-plus-circle mr-2" />Créer un nouveau cours
					</sc-button>
				</template>
			</article-title>

			<div>Droite</div>
		</div>
		<div class="grid grid-cols-1 gap-3 mt-10">
			<Card
				v-for="course in theCourses"
				:key="course.id"
			>
				<template #header>
					<div class="flex justify-between">
						<h2 v-katex.auto="course.title" />
						<div class="flex gap-3">
							<sc-button
								type="primary"
								xs
								v-for="team in course.teams"
								:key="`course-${course.id}-${team.name}`"
								:href="route('admin.courses.show-team', {course: course.slug, team: team.name})"
							>
								{{ team.name }}
							</sc-button>
							<sc-button
								type="edit"
								xs
								icon
								:href="route('admin.courses.edit', {course: course.slug})"
							/>
							<confirm-button
								icon
								xs
								@confirm="deleteCourse(course.id)"
							>
								supprimer
							</confirm-button>
						</div>
					</div>
				</template>
				<div class="flex gap-3">
					<sc-button
						xs
						v-for="team in teams"
						:key="`team-${team.name}`"
						outline
						type="primary"
						@click="toggleTeam(course, team)"
					>
						{{ team.name }}
					</sc-button>
				</div>
			</Card>
		</div>

		<dialog-modal
			v-model="showCreate"
			class="w-[300px] h-auto p-3"
		>
			<div>
				<h2 class="text-lg font-extralight">
					Créer un nouveau cours
				</h2>
				<form-maker
					v-model="newCourseTitle"
					label="titre"
				/>
				<form-maker
					v-model="newCourseSlug"
					disabled
					label="slug"
				/>
			</div>
			<template #footer>
				<sc-button
					type="add"
					xs
					class="w-full"
					@click="addCourse"
				>
					<i class="bi bi-plus-circle mr-2" />Créer un nouveau cours
				</sc-button>
			</template>
		</dialog-modal>
	</section>
</template>

<style scoped>

</style>
