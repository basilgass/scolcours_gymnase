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
				name="title"
				:error="Form.errors.title"
			/>
		<form-textarea
				v-model="Form.body"
				name="body"
				:error="Form.errors.body"
			/>

		<form-input
				v-model="Form.answer"
				name="answer"
			/>

		<form-textarea
				v-model="Form.explanation"
				name="explanation"
				:error="Form.errors.explanation"
			/>

		<form-file
				name="file"
				@input="Form.illustrations = $event.target.files"
			/>

		<button
				type="submit"
				class="mt-10 border-2 px-5 py-2 uppercase rounded-xl hover:bg-white"
			>
			créer un exercice
		</button>
	</form>
</template>

<script setup>
	import FormInput from "@/Components/Form/FormInput"
	import FormTextarea from "@/Components/Form/FormTextarea"
	import {useForm} from "@inertiajs/inertia-vue3"
	import FormFile from "@/Components/Form/FormFile"
	import FormSelect from "@/Components/Form/FormSelect"

	const Form = useForm({
		chapter_id: 1,
		title: "",
		body: "",
		answer: "3/6",
		explanation: "",
		illustrations: ""
	})

	function createExercise(){
		Form.post("/exercise", {
			preserveScroll: true,
			onSuccess: () => console.log("SUCCESS"),
			onError: ()=>console.log(Form.errors)
		})
	}
</script>
