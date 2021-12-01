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
				label="titre (optionnel)"
				:error="Form.errors.title"
			/>
		<form-textarea
				v-model="Form.body"
				name="body"
				label="question"
				:error="Form.errors.body"
			/>

		<collapse-transition>
			<form-textarea
					v-show="Form.body.includes('@@')"
					v-model="Form.generators"
					name="generators"
					rows="10"
					label="generateur"
				/>
		</collapse-transition>

		<collapse-transition>
			<form-input
					v-show="!Form.body.includes('@@')"
					v-model="Form.answer"
					name="answer"
					label="réponse"
				/>
		</collapse-transition>

		<collapse-transition>
			<form-textarea
					v-show="!Form.body.includes('@@')"
					v-model="Form.explanation"
					name="explanation"
					label="développement"
					:error="Form.errors.explanation"
				/>
		</collapse-transition>
		<collapse-transition>
			<form-file
					v-show="!Form.body.includes('@@')"
					name="file"
					label="images"
					@input="Form.illustrations = $event.target.files"
				/>
		</collapse-transition>

		<button
				type="submit"
				class="mt-10 border-2 px-5 py-2 uppercase rounded-xl hover:bg-white"
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
	import { useForm } from "@inertiajs/inertia-vue3"
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

	function createExercise(){
		Form.post("/exercise", {
			preserveScroll: true,
			onSuccess: () => {Form.answer = ""},
			onError: ()=>console.log(Form.errors)
		})
	}
</script>
