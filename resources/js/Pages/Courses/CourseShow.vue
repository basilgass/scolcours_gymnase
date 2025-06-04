<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"
import MermaidWidget from "@/Components/Widgets/mermaid-widget.vue"
import {ref} from "vue"
import {router} from "@inertiajs/vue3"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface
}>()

const graph = ref(generateMermaidGraph(props.course.lessons))

function generateMermaidGraph(lessons: LessonInterface[]): string {
	const lines: string[] = ['graph TD']
	const lessonMap = new Map<string, string>()

	lessons.forEach(lesson => {
		lessonMap.set(`node${lesson.id}`, lesson.title || `Lesson ${lesson.id}`)
	})

	lessons.forEach(lesson => {
		const from = lessonMap.get(`node${lesson.id}`)
		if (!lesson.requires.length) {
			lines.push(`node${lesson.id}["${from}"]`)
		}

		for (const reqId of lesson.requires) {
			const to = lessonMap.get(`node${reqId}`) || `Lesson ${reqId}`
			lines.push(`node${reqId}["${to}"] --> node${lesson.id}["${from}"]`)
		}
	})

	// Ajout des événements de clic
	lessons.forEach(lesson => {
		lines.push(`click node${lesson.id}`)
		// lines.push(`click node${lesson.id} call mermaidCallback()`)
	})

	return lines.join('\n')
}

function nodeClickedCourse(e) {
	const lessonId = +e.split('node')[1]
	const lesson: LessonInterface = props.course.lessons.find(lesson => lessonId === lesson.id)

	router.visit(route('lessons.show', {course: props.course.slug, lesson: lesson.id}))
}
</script>

<template>
	<main>
		<h1 class="text-3xl font-semibold mb-3">
			{{ course.title }}
		</h1>
		<block-show :block="course.block" />

		<mermaid-widget
			:illustration="{
				parameters: '',
				code:graph
			}"
			@node-click="nodeClickedCourse"
		/>
	</main>
</template>

