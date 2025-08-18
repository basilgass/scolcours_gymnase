<script setup lang="ts">

import Card from "@/Components/Ui/Card.vue"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {computed, ref} from "vue"
import {CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"
import FormulaSearch from "@/Components/FormulaSearch.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import LessonAsideScore from "@/Components/Courses/LessonAsideScore.vue"
import {lessonableModel} from "@/types/lessonInterfaces.ts"

const props = defineProps<{
	course: CourseInterface,
	lesson: LessonInterface,
	lessonable: lessonableModel
}>()

const menuToggle = ref<boolean>(true)

const showFormularDialog = ref(false)

const showFullCourseMenu = ref<boolean>(false)

const currentLessonIndex = computed(() => {
	return props.course.lessons.findIndex(lesson => lesson.id === props.lesson.id)
})
const prevLesson = computed(() => {
	return currentLessonIndex.value > 0
		? props.course.lessons[currentLessonIndex.value - 1]
		: null
})
const prevCounter = computed(() => {
	if (currentLessonIndex.value < 2) {
		return ""
	}

	const s = currentLessonIndex.value - 1 > 1 ? 's' : ''

	return `${currentLessonIndex.value - 1} leçon${s} précédente${s}`
})

const nextLesson = computed(() => {
	return currentLessonIndex.value < props.course.lessons.length - 1
		? props.course.lessons[currentLessonIndex.value + 1]
		: null

})

const nextCounter = computed(() => {
	if (currentLessonIndex.value >= props.course.lessons.length - 2) {
		return ""
	}

	const s = currentLessonIndex.value < props.course.lessons.length - 3 ? 's' : ''

	return `encore ${props.course.lessons.length - currentLessonIndex.value - 2} leçon${s}...`
})


</script>

<template>
	<aside
		class="w-full text-sm relative"
		:class="{
			'sm:w-[200px] md:w-[250px]': menuToggle,
			'sm:max-w-[40px]':!menuToggle
		}"
	>
		<div class="sticky top-3 space-y-3">
			<Card>
				<template #header>
					<div
						@click="menuToggle = !menuToggle"
						class="flex justify-between cursor-pointer"
						:title="menuToggle?'':'menu'"
					>
						<div v-show="menuToggle">
							menu
						</div>
						<i
							class="bi bi-chevron-double-right transition-all"
							:class="menuToggle ? '' : 'rotate-180'"
						/>
					</div>
				</template>
				<div
					v-if="menuToggle"
					class="flex flex-col gap-3 py-3"
				>
					<div class="flex flex-col gap-1">
						<div
							v-if="prevCounter"
							class="text-xs text-slate-500 mb-2"
						>
							{{ prevCounter }}
						</div>
						<div
							v-if="prevLesson"
							class="flex gap-2 hover:pl-1 transition-all"
						>
							<lesson-type-icon :lesson="prevLesson" />
							<InertiaLink
								class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
								:href="route('students.lessons.show', {course: course.slug, lesson: prevLesson.id})"
								v-katex.auto="prevLesson.title"
								:title="prevLesson.title"
							/>
						</div>

						<div
							class="flex gap-2 hover:pl-1 transition-all font-semibold"
							v-theme.text
						>
							<lesson-type-icon :lesson="lesson" />
							<InertiaLink
								class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
								:href="route('students.lessons.show', {course: course.slug, lesson: lesson.id})"
								v-katex.auto="lesson.title"
								:title="lesson.title"
							/>
						</div>

						<div
							v-if="nextLesson"
							class="flex gap-2 hover:pl-1 transition-all"
						>
							<lesson-type-icon :lesson="nextLesson" />
							<InertiaLink
								class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
								:href="route('students.lessons.show', {course: course.slug, lesson: nextLesson.id})"
								v-katex.auto="nextLesson.title"
								:title="nextLesson.title"
							/>
						</div>

						<div
							v-if="nextCounter"
							class="text-xs text-slate-500 mt-2"
						>
							{{ nextCounter }}
						</div>
					</div>

					<div
						class="cursor-pointer text-slate-500 text-sm italic"
						@click="showFullCourseMenu=!showFullCourseMenu"
					>
						<i class="bi bi-three-dots-vertical" />{{ showFullCourseMenu ? 'cacher' : 'afficher' }} le menu
						complet
					</div>
					<div
						v-if="showFullCourseMenu"
						class="space-y-1 py-3"
					>
						<div

							v-for="l in course.lessons"
							:key="`goto-${l.id}`"
							class="flex gap-2 hover:pl-1 transition-all"
							v-theme.text="l.id===lesson.id"
							:class="{
								'font-semibold': l.id===lesson.id,
							}"
						>
							<lesson-type-icon :lesson="l" />
							<InertiaLink
								class="flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
								:href="route('students.lessons.show', {course: course.slug, lesson: l.id})"
								v-katex.auto="l.title"
								:title="l.title"
							/>
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<template #header>
					<div
						class="flex justify-between cursor-pointer"
						:title="menuToggle?'':'formulaire'"
						@click="showFormularDialog=true"
					>
						<div v-show="menuToggle">
							formulaire
						</div>
						<i
							class="bi bi-book-half"
						/>
					</div>
				</template>
			</Card>

			<lesson-aside-score
				:lesson
				:lessonable
				:menu-toggle
			/>
		</div>

		<dialog-modal v-model="showFormularDialog">
			<template #header>
				<div class="p-3 flex justify-between">
					<h3
						class="text-2xl font-semibold"
					>
						Formulaire
					</h3>
					<i
						class="bi bi-x-lg cursor-pointer"
						@click="showFormularDialog=false"
					/>
				</div>
			</template>
			<formula-search
				class="px-3 pb-3"
				:theme-id="course.theme_id"
			/>
		</dialog-modal>
	</aside>
</template>

<style scoped>

</style>
