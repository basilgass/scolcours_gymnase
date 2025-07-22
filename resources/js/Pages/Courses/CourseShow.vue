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

//
// function generateMermaidGantt(lessons: LessonInterface[]): string {
// 	const lines: string[] = [
// 		'gantt',
// 		'title Planification des leçons',
// 		'dateFormat  YYYY-MM-DD',
// 		'todayMarker stroke-width:5px,stroke:#0f0,opacity:0.5',
// 		// 'section Leçons'
// 	]
//
// 	lessons.forEach((lesson, idx) => {
// 		// Dates fictives pour l'exemple, à adapter selon vos données
// 		const start = lesson.calendar.opened_at.split('T')[0]
// 		const end = lesson.calendar.scheduled_at.split('T')[0]
// 		const tag = lesson.calendar.remaining_days<0?
// 			'crit, ':
// 				lesson.calendar.is_opened?'active, ': ''
//
// 		lines.push(`${lesson.title.replaceAll(':', '-')} :${tag} node${lesson.id}, ${start}, ${end}`)
// 	})
//
// 	// lines.push(...[
// 	// 	'',
// 	// 	'%% Définition de la classe',
// 	// 	'classDef custom1 fill:#f96,stroke:#333,stroke-width:2px;',
// 	// 	'class node2,node4,node7 custom1;'
// 	// ])
// 	console.log(lines)
// 	return lines.join('\n')
// }


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


	<block-show :block="course.block" />

	<course-graph
		:course
		@node-click="nodeClickedCourse"
	/>
</template>

