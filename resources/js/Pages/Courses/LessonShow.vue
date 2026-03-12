<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {CourseInterface, LessonInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LessonMain from "@/Components/Courses/LessonMain.vue"
import LessonAside from "@/Components/Courses/LessonAside.vue"
import {lessonableModel} from "@/types/lessonInterfaces.ts"
import {usePage} from "@inertiajs/vue3";
import {computed} from "vue";

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface,
	lesson: LessonInterface,
	lessonable: lessonableModel,
	team?: TeamInterface | null,
}>()

const returnLink = computed(() => {
	if (props.team && usePage().props.auth?.can.admin) {
		return {
			label: 'retour au dashboard',
			url: route('admin.courses.dashboard', {course: props.course.slug, team: props.team.name}),
		}
	}
	return {
		label: 'retour au cours',
		url: route('students.courses.show', {course: props.course.slug}),
	}
})
</script>

<template>
	<main>
		<header>
			<article-title
				:title="lesson.title"
				:return-link="returnLink"
			/>
		</header>

		<div class="flex flex-col sm:flex-row gap-3 w-full">
			<lesson-main
				:lessonable
				:lesson
			/>

			<lesson-aside
				:course
				:lesson
				:lessonable
			/>
		</div>
	</main>
</template>

<style scoped>

</style>
