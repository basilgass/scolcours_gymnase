<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {CourseInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import {AxiosErrorMessage} from "@/types"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {computed, ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {slugify} from "@/scolcours.ts"
import CourseCard from "@/Components/Courses/CourseCard.vue"
import CourseCalendar from "@/Components/Courses/CourseCalendar.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	teams: UserTeamInterface[],
	teamCourses: CourseInterface[],
	// userCourses: CourseInterface[]
}>()


// TODO: La création d'un objet avec titre + slug peut être généraliser à plusieurs autres (chapitres, posts, ... à l'aide éventuellement d'un FormMakerDialog ?
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
			router.visit(route('admin.courses.edit', {id: res.data.id}))
		})
		.catch((err: AxiosErrorMessage) => {
			console.log(err.response.data.message)
		})
}
</script>

<template>
	<main>
		<article-title title="Mes cours" />

		<div
			v-if="!$page.props.auth.user"
			class="grid place-items-center h-[60vh]"
		>
			<div class="flex flex-col gap-12 items-center">
				Pour pouvoir utiliser les cours, il faut se connecter.

				<sc-button
					type="primary"
					:href="route('login')"
				>
					Se connecter
				</sc-button>
			</div>
		</div>

		<div v-else>
			<div
				v-admin
				class="admin-content p-3 flex justify-between"
			>
				<sc-button
					type="add"
					xs
					@click="showCreate = true"
				>
					<i class="bi bi-plus-circle mr-2" />Créer un nouveau cours
				</sc-button>
				<div>Droite</div>
			</div>

			<div>
				<h2 class="text-lg md:text-2xl mb-5">
					Cours de classe
				</h2>
				<div class="flex flex-col gap-3">
					<course-card
						v-for="course in teamCourses"
						:key="`team-${course.id}`"
						:course
					/>
				</div>
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
		</div>
	</main>
</template>

<style scoped></style>
