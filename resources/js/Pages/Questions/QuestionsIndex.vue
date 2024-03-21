<script lang="ts" setup>
import { computed, inject, PropType, provide, Ref, ref } from "vue"
import QuestionShow from "@/Pages/Questions/QuestionShow.vue"
import { ChapterInterface, PostInterface } from "@/types/modelInterfaces"
import axios from "axios"
import { flashInterface } from "@/types"
import QuestionsIndexAdmin from "@/Pages/Questions/QuestionsIndexAdmin.vue"

const editMode = inject<Ref<boolean>>("editMode")
const flash = inject<flashInterface>("flash")

const props = defineProps({
	post: {
		type: Object as PropType<PostInterface>,
		required: true
	},
	chapter: {
		type: Object as PropType<ChapterInterface>,
		required: true
	}
})

const answeredIds = computed(() => {
	return props.post.questions
		.filter((question) => question.user.result)
		.map((question) => +question.id)
})

const questionsGrid = computed(() => {
	if (props.post.questionsGrid) return props.post.questionsGrid

	let grid = "grid grid-cols-1"

	if (props.post.questions.length > 1) {
		grid += " md:grid-cols-2"
	}

	if (props.post.questions.length > 2) {
		grid += " lg:grid-cols-3"
	}

	return grid + " gap-x-3 gap-y-6"
})


provide("questionsIds", props.post.questions.map((q) => q.id))

const isQuestionLocked = function(question) {
	return !(
		question.displayIf === null ||
		question.displayIf
			.split(",")
			.map((id) => +id)
			.every((id) => answeredIds.value.indexOf(id) !== -1)
	)
}

const updateQuestionsOrder = function() {
	axios
		.post(
			route("questions.updateOrder", [
				"Post",
				props.post.id
			]),
			{
				_method: "PATCH",
				order: props.post.questions.map((x, index) => {
					return { id: x.id, order: index + 1 }
				})
			}
		)
		.then(() => {
			flash.success("les questions ont bien été mis à jour !")
		})
		.catch((res) => {
			console.warn(res.data)
			flash.error("update questions order failed")
			}
		)
}


const questionsComponents = ref<Array<InstanceType<typeof QuestionShow>>>([])
function addQuestionRef(element: InstanceType<typeof QuestionShow>) {
	if (questionsComponents.value.indexOf(element) === -1) {
		questionsComponents.value.push(element)
	}
}
</script>
<template>
	<article>
		<!-- title -->
		<div
			v-if="post.questions.length"
			v-theme.bg.text
			class="flex justify-between items-center px-10 py-4"
		>
			<h3 class="uppercase text-2xl relative">
				<i class="bi bi-question-square mr-5" />questions
			</h3>

			<div>{{ answeredIds.length }} / {{ post.questions.length }}</div>
		</div>

		<questions-index-admin
			v-admin="editMode"
			:chapter="chapter"
			:questions="props.post.questions"
			:components="questionsComponents"
			:post="post"
		/>

		<!-- questions list -->
		<draggable
			v-if="post.questions.length"
			:list="post.questions"
			:class="questionsGrid"
			class="mt-10"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: editMode === false,
			}"
			@end="updateQuestionsOrder"
		>
			<template #item="{ element }">
				<question-show
					:key="element.id"
					:ref="addQuestionRef"
					:class="element.css ?? ''"
					:locked="isQuestionLocked(element)"
					:question="element"
				/>
			</template>
		</draggable>
	</article>
</template>
