<script setup lang="ts">

import {LessonInterface} from "@/types/modelInterfaces.ts"

defineProps<{
	lesson: LessonInterface
}>()

// TODO: edition d'un cours
</script>

<template>
	<div class="flex max-w-sm gap-3">
		<div class="font-code">
			{{ lesson.scoreRules }}
		</div>
		<!--		<div-->
		<!--			v-if="lesson.lessonable_type==='Challenge'"-->
		<!--			class="flex gap-3"-->
		<!--		>-->
		<!--			<div>{{ lesson.parameters.selector }}</div>-->
		<!--			<div>{{ lesson.parameters.target }}</div>-->
		<!--		</div>-->
		<!--		<div v-else-if="lesson.lessonable_type==='Deck'">-->
		<!--			Deck-->
		<!--		</div>-->
		<!--		<div v-else-if="lesson.lessonable_type==='Post'">-->
		<!--			<div>Nombre de questions: {{ lesson.lessonable.questions.length }}</div>-->
		<!--		</div>-->
		<!--		<div v-else-if="lesson.lessonable_type==='Quizz'">-->
		<!--			Quizz-->
		<!--		</div>-->
		<!--		<div v-else-if="lesson.lessonable_type==='Generator'">-->
		<!--			Generator-->
		<!--		</div>-->
	</div>
</template>

<style scoped>

</style>
