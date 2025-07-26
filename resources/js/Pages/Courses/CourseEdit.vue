<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {inject, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import CourseLessonEdit from "@/Components/Courses/CourseLessonEdit.vue"
import CourseGraph from "@/Components/Courses/CourseGraph.vue"
import axios from "axios"
import {AxiosErrorMessage, flashInterface} from "@/types"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
}>()

const flash = inject<flashInterface>('flash')
const theCourse = ref<CourseInterface>(props.course)


function addLesson() {
	// Se mettre en mode "panier de leçon". On parcourt ensuite le site avec la possibilité d'ajouter le cours.
}

const itemSource = ref<LessonInterface>(undefined)
const counter = ref(1)

function onClick(lesson: LessonInterface, event: MouseEvent) {
	if (itemSource.value) {
		// Toggle requires to the itemSource.
		toggleIdInPlace(itemSource.value.requires, lesson.id)
		counter.value++

		// Mise à jour de la DB.
		axios.patch(route('api.admin.lessons.update', {lesson: itemSource.value.id}), {
			requires: itemSource.value.requires.join(','),
			parameters: itemSource.value.scoreRules
		}).then(() => {
			flash.success('Le cours a été mis à jour')
		}).catch((err: AxiosErrorMessage) => {
			flash.error('Il y a un problème avec ce cours.')
			console.warn(err.response.data.message)
		})
		return
	}
}

function setItemSource(lesson: LessonInterface) {
	itemSource.value = lesson.id === itemSource.value?.id ? undefined : lesson
}

function toggleIdInPlace(array: (string | number)[], id: string | number): void {
	const index = array.indexOf(id)
	if (index === -1) {
		array.push(id)
	} else {
		array.splice(index, 1)
	}
}
</script>

<template>
	<main>
		<article-title
			prefix="édition"
			:title="course.title"
			:return-link="{
				label: 'retour aux cours',
				url: route('courses.index')
			}"
		/>

		<div>
			<form-maker v-model="theCourse.title" />
			<form-maker
				xs
				disabled
				v-model="theCourse.slug"
			/>
			<form-maker
				label="thème du cours"
				type="theme"
				theme-key="id"
				v-model="theCourse.theme_id"
			/>
		</div>

		<article>
			<h2>Leçons</h2>


			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div class="flex flex-col gap-3">
					<Card
						v-for="lesson in theCourse.lessons"
						:key="`lesson-${lesson.id}`"
						:class="{
							' bg-blue-100 border-blue-600 text-blue-600': itemSource?.id===lesson.id
						}"
					>
						<template #header>
							<div
								class="flex justify-between"
							>
								<div
									class="flex gap-3 items-baseline cursor-pointer"
									@click="setItemSource(lesson)"
								>
									<lesson-type-icon :lesson />

									<!--									<div-->
									<!--										class="text-lg font-[400]"-->
									<!--										v-katex.auto="lesson.lessonable?.title"-->
									<!--									/>-->
									<div class="font-code w-[16px] text-xs">
										({{ lesson.id }})
									</div>
								</div>

								<div v-if="itemSource?.id===lesson.id">
									{{ lesson.requires }}
								</div>
								<i
									v-else-if="itemSource"
									@click="onClick(lesson, $event)"
									class="bi bi-link text-xl text-blue-600 cursor-pointer"
								/>
							</div>
						</template>
						<course-lesson-edit
							:lesson
						/>
					</Card>

					<div
						class="mt-10 py-10
							 border border-dashed rounded
							  bg-blue-100 border-blue-600 text-blue-600
							  text-center cursor-pointer"
						@click="addLesson"
					>
						<i class="bi bi-plus-circle mr-2" />ajouter une leçon...
					</div>
				</div>
				<div>
					<course-graph
						:key="counter"
						:course
						@node-click="onClick"
					/>
				</div>
			</div>
		</article>
	</main>
</template>

<style scoped>

</style>
