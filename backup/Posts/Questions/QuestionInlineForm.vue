<template>
	<div>
		<h3 class="text-lg">
			Ajouter des questions
		</h3>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div class="md:col-span-3">
				<form-textarea
					v-model="questionForm.body"
					:rows="Math.max(questionForm.rows, 5)"
					label="question"
					name="body"
				/>
			</div>
			<form-textarea
				v-model="questionForm.answer"
				:rows="questionForm.rows"
				label="réponse"
				name="answer"
				@input="questionForm.rows = questionForm.answer.split('\n').length"
			/>

			<div class="flex items-end gap-4 justify-self-end md:col-span-4">
				<div class="flex">
					<form-switch
						v-model="questionForm.math"
						name="mathmode"
						label="math \[ \]"
					/>
					<form-input
						v-model="questionForm.mathAppend"
						name="mathAddLine"
						label="ajout..."
						placeholder="\[x=$a\]"
						:datalist="['\\[x=$a\\]', '\\[$a\\]']"
					/>
				</div>
				<form-input
					v-model="questionForm.checker"
					label="Vérification"
					name="checker"
				/>
				<form-input
					v-model="questionForm.keyboard"
					label="clavier"
					name="clavier"
					:datalist="keyboardsList"
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

import FormInput from "@/Components/Form/FormInput.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import {reactive} from "vue"
import {keyboardsList} from "@/keyboards"
import FormSwitch from "@/Components/Form/FormSwitch.vue"

let props = defineProps({
		post: {type: Object, required: true}
	}),
	emits = defineEmits(["added", "cancel"])

let questionForm = reactive({
	math: true,
	mathAppend: "",
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
		console.log("Question inline form")
		console.log(res)
		emits("cancel")
	})
}
</script>
