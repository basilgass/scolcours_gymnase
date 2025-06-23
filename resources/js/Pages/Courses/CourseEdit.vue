<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChapterInterface, CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import CourseLessonEdit from "@/Components/Courses/CourseLessonEdit.vue"
import CourseGraph from "@/Components/Courses/CourseGraph.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
}>()

const theCourse = ref(props.course)
//
// const courseRange = computed(() => {
// 	const dates = props.course.lessons.map((lesson: LessonInterface) => {
// 		return [lesson.calendar.opened_at, lesson.calendar.scheduled_at]
// 	}).flat()
//
// 	dates.sort()
//
// 	const minTime = new Date(dates[0]).getTime()
// 	const maxTime = new Date(dates[dates.length - 1]).getTime()
//
// 	return {
// 		min: minTime,
// 		max: maxTime,
// 		total: maxTime - minTime
// 	}
// })

function addLesson() {
	// Se mettre en mode "panier de leçon". On parcours ensuite le site avec la possibtilité d'ajouter le cours.
}

const itemSource = ref<LessonInterface>(undefined)
const counter = ref(1)
function onClick(lesson:LessonInterface, event: MouseEvent){
	if(itemSource.value && event.ctrlKey){
		// Toggle requires to the itemSource.
		toggleIdInPlace(lesson.requires, itemSource.value.id)
		counter.value++
		return
	}

	itemSource.value = lesson
}

function toggleIdInPlace(array: (string|number)[], id: string|number): void {
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
					>
						<template #header>
							<div class="flex justify-between">
								<div class="flex gap-3 items-baseline">
									<div class="font-code w-[16px] text-xs">
										{{ lesson.id }}
									</div>
									<div
										class="text-lg font-[400]"
										v-katex.auto="lesson.lessonable.title"
									/>
								</div>

								<div>{{ lesson.requires }}</div>
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
					<div>Source: {{ itemSource?.lessonable.title ?? 'aucun' }}</div>
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
