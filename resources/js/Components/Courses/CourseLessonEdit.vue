<script lang="ts" setup>

import {LessonInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {AxiosErrorMessage} from "@/types"
import axios from "axios"
import FormJson from "@/Components/Form/FormJson.vue"
import {useCourse} from "@/Pages/Courses/useCourse.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import FormInput from "@/Components/Form/FormInput.vue"

const props = defineProps<{
	lesson: LessonInterface
}>()

const flash = useStoreFlashMessage()

const showScoreRules = ref(false)

const label = ref<string | null>(props.lesson.label)

const scoreRules = ref(props.lesson.scoreRules ?? {})

function updateLesson() {
	axios
		.patch(route('api.admin.lessons.update', {lesson: props.lesson.id}), {
			label: label.value,
			scoreRules: scoreRules.value
		})
		.then(() => {
			flash.success('La leçon a bien été mise à jour.')
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

const jsonMap = computed(() => {
	return useCourse().lessonScoreRulesMap(props.lesson.lessonable_type)
})

</script>

<template>
	<div>
		<form-input
			v-model="label"
			type="text"
			label="label"
			inline-label
			xs
			btn="bi bi-save"
			@button-click="updateLesson"
		/>

		<div
			class="cursor-pointer text-xs font-code"
			@click="showScoreRules=!showScoreRules"
		>
			afficher les règles
		</div>
		<div
			v-show="showScoreRules"
			class="flex flex-col max-w-sm gap-3"
		>
			<FormJson
				v-model="scoreRules"
				:map="jsonMap"
				label="configuration"
				clearable
			/>

			<sc-button
				icon
				type="save"
				xs
				@click="updateLesson"
			/>
		</div>
	</div>
</template>

<style scoped>

</style>
