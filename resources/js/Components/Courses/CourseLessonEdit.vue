<script lang="ts" setup>

// REFACTOR: reprendre la carte de CourseEdit et tout intégrer ici
// profiter pour enlever la notion de "require" ?
import {LessonInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {AxiosErrorMessage} from "@/types"
import axios from "axios"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {useCourse} from "@/Pages/Courses/useCourse.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = defineProps<{
	lesson: LessonInterface
}>()

const flash = useStoreFlashMessage()

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

const jsonMap = computed(() => {
	return useCourse().lessonScoreRulesMap(props.lesson.lessonable_type)
})

</script>

<template>
	<div>
		<div
			v-if="!showScoreRules"
			class="cursor-pointer text-xs font-code -mt-2 -my-3"
			@click="showScoreRules=true"
		>
			afficher les règles
		</div>
		<div
			v-else
			class="flex max-w-sm gap-3"
		>
			<div>
				<sc-button
					icon
					type="save"
					xs
					@click="updateLesson"
				/>
			</div>
			<div class="font-code">
				<form-maker
					v-model="scoreRules"
					:map="jsonMap"
					label="configuration"
					type="json"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
