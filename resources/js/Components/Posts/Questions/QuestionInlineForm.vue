<template>
	<div>
		<h3 class="text-lg">
			Ajouter des questions
		</h3>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div class="md:col-span-2">
				<form-textarea
					v-model="questionForm.body"
					:rows="questionForm.rows"
					label="question"
					name="body"
					@input="questionForm.rows = questionForm.body.split('\n').length"
				/>
			</div>
			<form-textarea
				v-model="questionForm.answer"
				:rows="questionForm.rows"
				label="réponse"
				name="answer"
			/>
			<form-textarea
				v-model="questionForm.checker"
				:rows="questionForm.rows"
				label="Vérification"
				name="checker"
			/>
			<div class="flex items-end gap-4 justify-self-end md:col-span-4">
				<input
					v-model="questionForm.math"
					type="checkbox"
				>
				<form-input
					v-model="questionForm.keyboard"
					label="clavier"
					name="clavier"
				/>

				<button
					class=" btn-primary"
					@click="questionStore"
				>
					Ajouter {{ questionForm.rows }}
				</button>
			</div>
		</div>
	</div>
</template>
<script setup>

import FormInput from "@/Components/Form/FormInput"
import FormTextarea from "@/Components/Form/FormTextarea"
import {reactive} from "vue"

let props = defineProps({
		post: {type: Object, required: true}
	}),
	emits = defineEmits(["added", "cancel"])

let questionForm = reactive({
	math: true,
	body: "",
	answer: "",
	checker: "",
	keyboard: "",
	rows: 1
})

function questionStore() {
	axios.post(
		route("posts.questions.store", [props.post.id]), {
			...questionForm
		}
	).then((res) => {
		// Add the question.
		emits("added", res.data.data)
		// questions.value.push(res.data)
	}).catch(res => {
		// Show the error.
		console.log(res)
		emits("cancel")
	})
}
</script>
