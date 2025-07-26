<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LessonMain from "@/Components/Courses/LessonMain.vue"
import LessonAside from "@/Components/Courses/LessonAside.vue"
import {onMounted} from "vue"
import {lessonableModel} from "@/types/lessonInterfaces.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface,
	lesson: LessonInterface,
	lessonable: lessonableModel
}>()


</script>

<template>
	<main>
		<header>
			<article-title
				:title="lesson.title"
				:return-link="{
					label: 'retour au cours',
					url: route('students.courses.show', {course: course.slug})
				}"
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
