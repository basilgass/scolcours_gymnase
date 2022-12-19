<template>
	<div
		:id="`question-${theQuestion.id}`"
		:class="{
			'bg-gray-50 border-gray-200': !theQuestion.user.correct,
			'bg-green-50 border-green-600/60': theQuestion.user.correct,
		}"
		class="relative rounded border h-full"
	>
		<div
			v-if="theQuestion.order"
			class="absolute -left-2 -top-2 rounded-full bg-white border w-8 h-8 text-xs flex justify-center items-center draggable-handle"
			:class="{'draggable-handle cursor-move':$page.props.auth.can.admin}"
		>
			{{ theQuestion.order }}
		</div>

		<button
			v-if="$page.props.auth.can.admin"
			class="absolute right-2 top-0 text-xs"
			@click="showEditForm=true"
		>
			<i class="bi bi-pencil mr-2" />{{ theQuestion.id }}
		</button>

		<div class="flex flex-col h-full justify-between">
			<!-- Admin edition mode -->

			<!-- the body of question -->
			<div class="px-5 py-3">
				<illustration-show
					v-if="theQuestion.block.illustration"
					:illustration="theQuestion.block.illustration"
					class="bg-white"
				/>
				<markdown-it
					:text="theQuestionBody"
				/>
			</div>

			<!-- the user input container -->
			<div class="mt-5 border-t border-gray-200 px-5 py-2">
				<!-- Open / Close user input -->
				<div
					v-if="!displayInput"
					:class="showInput?'text-right':'text-center'"
				>
					<button
						v-if="showInput"
						@click="showInput=!showInput"
					>
						<span class="text-xs font-ultralight">Fermer </span><i class="bi bi-x-lg" />
					</button>
					<button
						v-else
						class="w-full"
						@click="showInput=!showInput"
					>
						Donner la réponse
					</button>
				</div>

				<!-- user input -->
				<question-user-input
					v-show="showInput"
					:question="theQuestion"
					@change="theQuestionBody = $event"
					@validate="onValidate"
				/>

				<!-- footer - display previous answers -->
			</div>
		</div>

		<div v-if="$page.props.auth.can.admin && showEditForm">
			<component
				:is="editForm"
				v-model="showEditForm"
				:question="props.question"
				@change="updateQuestion"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</div>
</template>

<script setup>
import {computed, defineAsyncComponent, ref} from "vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import QuestionUserInput from "@/Components/Posts/Questions/QuestionUserInput.vue"

let emits = defineEmits(["destroy", "validate"])
let props = defineProps({
		question: {type: Object, required: true},
		displayInput: {type: Boolean, default :false}
	}),
	theQuestion = ref(props.question),
	theQuestionBody = ref(props.question.block.body),
	showInput = ref(props.displayInput),
	onValidate = function (event) {
		if (props.question.id === undefined) {
			emits("validate", {
				...event,
				question: theQuestionBody.value
			})
			return
		}
		theQuestion.value.user.correct = event.result

		// need answer (string: min1), , result (boolean)
		// Save the information to the database
		axios.post(route("questions.validate", [props.question.id]), {
			...event
		}).then(res => {
			emits("validate", {
				...event,
				question: theQuestionBody.value
			})
		})
	}

let showEditForm = ref(props.question.isNew === true),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/Questions/QuestionForm")
		)
	}),
	updateQuestion = function (q) {
		theQuestion.value = q
		theQuestionBody.value = q.block.body
	}
</script>
