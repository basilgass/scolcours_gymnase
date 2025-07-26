<script setup lang="ts">

import Card from "@/Components/Ui/Card.vue"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {ref} from "vue"
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

const menuToggle = ref(true)

const showFormularDialog = ref(false)


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
					class="space-y-1 py-3"
					v-if="menuToggle"
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
