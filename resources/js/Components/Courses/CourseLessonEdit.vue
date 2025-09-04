<script setup lang="ts">

import {LessonInterface} from "@/types/modelInterfaces.ts"
import {computed, inject, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {AxiosErrorMessage, flashInterface} from "@/types"
import axios from "axios"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {useCourse} from "@/Pages/Courses/useCourse.ts"

const props = defineProps<{
	lesson: LessonInterface
}>()

const flash = inject<flashInterface>('flash')

const showScoreRules = ref(false)

const scoreRules = ref(props.lesson.scoreRules ?? {})

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

const jsonMap = computed(()=>{
	return useCourse().lessonScoreRulesMap(props.lesson.lessonable_type)
})

</script>

<template>
	<div>
		<div
			v-if="!showScoreRules"
			@click="showScoreRules=true"
			class="cursor-pointer text-xs font-code -mt-2 -my-3"
		>
			afficher les règles
		</div>
		<div
			v-else
			class="flex max-w-sm gap-3"
		>
			<div>
				<sc-button
					type="save"
					icon
					xs
					@click="updateLesson"
				/>
			</div>
			<div class="font-code">
				<form-maker
					label="configuration"
					type="json"
					:map="jsonMap"
					v-model="scoreRules"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
