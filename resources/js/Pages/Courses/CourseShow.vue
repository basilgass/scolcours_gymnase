<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"
import {router} from "@inertiajs/vue3"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import CourseGraph from "@/Components/Courses/CourseGraph.vue"
import AdminHeader from "@/Components/Admin/AdminHeader.vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
}>()

function nodeClickedCourse(lesson: LessonInterface) {
	router.visit(route('students.lessons.show', {
		course: props.course.slug,
		lesson: lesson.id
	}))
}
</script>

<template>
	<admin-header>
		<sc-button
			type="edit"
			icon
			xs
			:href="route('admin.courses.edit', {course: props.course.slug})"
		>
			éditer le cours
		</sc-button>
	</admin-header>

	<article-title
		:title="course.title"
		theme
		:return-link="{
			label: 'Retour à mes cours',
			url: route('courses.index')
		}"
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
		<block-show :block="course.block" />

		<course-graph
			:course
			@node-click="nodeClickedCourse"
		/>
	</div>
</template>

