<template>
	<h1 class="text-xl">
		Ajouter un exercice
	</h1>
	<form @submit.prevent="createExercise">
		<form-select
			v-model="Form.chapter_id"
			name="chapter_id"
		>
			<option
				v-for="theme of $page.props.themes"
				:key="`theme-${theme.id}`"
				:value="theme.id"
			>
				{{ theme.title }}
			</option>
		</form-select>


		<form-input
			v-model="Form.title"
			:error="Form.errors.title"
			label="titre (optionnel)"
			name="title"
		/>
		<form-textarea
			v-model="Form.body"
			:error="Form.errors.body"
			label="question"
			name="body"
		/>

		<collapse-transition>
			<form-textarea
				v-show="Form.body.includes('@@')"
				v-model="Form.generators"
				label="generateur"
				name="generators"
				rows="10"
			/>
		</collapse-transition>

		<collapse-transition>
			<form-input
				v-show="!Form.body.includes('@@')"
				v-model="Form.answer"
				label="réponse"
				name="answer"
			/>
		</collapse-transition>

		<collapse-transition>
			<form-textarea
				v-show="!Form.body.includes('@@')"
				v-model="Form.explanation"
				:error="Form.errors.explanation"
				label="développement"
				name="explanation"
			/>
		</collapse-transition>
		<collapse-transition>
			<form-file
				v-show="!Form.body.includes('@@')"
				label="images"
				name="file"
				@input="Form.illustrations = $event.target.files"
			/>
		</collapse-transition>

		<button
			class="mt-10 border-2 px-5 py-2 uppercase rounded-xl hover:bg-white"
			type="submit"
		>
			créer un exercice
		</button>
	</form>
</template>

<script>
import LayoutMain from "@/Pages/Shared/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import FormInput from "@/Components/Form/FormInput"
import FormTextarea from "@/Components/Form/FormTextarea"
import {useForm} from "@inertiajs/inertia-vue3"
import FormFile from "@/Components/Form/FormFile"
import FormSelect from "@/Components/Form/FormSelect"
import CollapseTransition from "@/Components/CollapseTransition"

const Form = useForm({
	chapter_id: 1,
	title: "",
	body: "",
	answer: "",
	explanation: "",
	illustrations: "",
	generators: ""
})

function createExercise() {
	Form.post("/exercise", {
		preserveScroll: true,
		onSuccess: () => {
			Form.answer = ""
		},
		onError: () => console.log(Form.errors)
	})
}
</script>
