<script setup lang="ts">

import {LessonInterface} from "@/types/modelInterfaces.ts"
import {inject, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {AxiosErrorMessage, flashInterface} from "@/types"
import axios from "axios"

const props = defineProps<{
	lesson: LessonInterface
}>()

const flash = inject<flashInterface>('flash')

const scoreRules = ref(props.lesson.scoreRules)

function updateLesson() {
	axios
		.patch(route('api.admin.lessons.update', {lesson: props.lesson.id}), {
			scoreRules: scoreRules.value
		})
		.then(() => {
			flash.success('La leçon a bien été mise à jour.')
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

// TODO: edition d'un cours
</script>

<template>
	<div class="flex max-w-sm gap-3">
		<div>
			<sc-button
				type="save"
				icon
				xs
				@click="updateLesson"
			/>
		</div>
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
