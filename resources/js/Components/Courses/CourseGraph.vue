<script setup lang="ts">

import {CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"
import MermaidWidget from "@/Components/Widgets/mermaid-widget.vue"
import {ref} from "vue"

const props = defineProps<{ course: CourseInterface }>()
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
	})

	return lines.join('\n')
}

const emits = defineEmits<{
	nodeClick: [lesson: LessonInterface, event: MouseEvent]
}>()

function onClick(nodeId: string, event: MouseEvent) {

	// Find the lesson
	const id = +nodeId.slice(4)
	const lesson = props.course.lessons.find(l => l.id === id)

	emits('nodeClick', lesson, event)
}

</script>

<template>
	<article>
		<mermaid-widget
			:illustration="{
				parameters: '',
				code:graph
			}"
			@node-click="onClick"
		/>
	</article>
</template>

<style scoped>

</style>
