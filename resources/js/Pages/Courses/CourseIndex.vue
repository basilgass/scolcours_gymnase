<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {CourseInterface} from "@/types/modelInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import {AxiosErrorMessage} from "@/types"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {computed, ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {slugify} from "@/scolcours.ts"

defineOptions({layout: LayoutMain})

defineProps<{
	courses: CourseInterface[]
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
			console.log(res.data)
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

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<Card
					v-for="course in courses"
					:key="course.id"
				>
					<template #header>
						<h1
							class="text-lg md:text-xl lg:text-2xl"
							v-katex.auto="course.title"
						/>
					</template>

					<block-show
						v-if="course.block"
						:block="course.block"
					/>
					<div
						v-else
						class="font-code"
					>
						Il n'y a pas de description pour ce cours... quel dommage !
					</div>

					<template #footer>
						<div class="flex justify-end">
							<sc-button
								xs
								type="primary"
								class="my-3"
								:href="route('students.courses.show', { course: course.slug })"
							>
								Commencer le cours <i class="bi bi-arrow-right" />
							</sc-button>
						</div>
					</template>
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
		</div>
	</main>
</template>

<style scoped></style>
