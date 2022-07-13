<template>
	<chapter-article>
		<template #title>
			exercice {{ props.exercise.position }}
		</template>

		<template #options>
			<div
				v-if="editMode"
				class="flex gap-3"
			>
				<button
					class="btn-success btn-xs"
					@click="duplicateExercise"
				>
					dupliquer <i class="bi bi-clipboard-plus" />
				</button>
				<button
					class="btn-delete btn-xs"
					@click="destroyExercise"
				>
					supprimer <i class="bi bi-trash" />
				</button>
			</div>
		</template>

		<!-- La donnée de la question -->
		<div
			v-if="exercise.blocks.length>0"
			class="exercise-input space-y-10"
		>
			<block-show
				v-for="block in exercise.blocks"
				:key="`block-${block.id}`"
				:block="block"
				hide-blur
				hide-delete
			/>
		</div>

		<!-- Les questions -->
		<div
			v-if="questions.length>0"
			class="exercise-questions mt-10 border-t -mx-4"
		>
			<question-show
				v-for="question in questions"
				:key="`question-${question.id}`"
				:exercise-id="exercise.id"
				:question="question"
				class="even:bg-gray-50 odd:bg-gray-100 p-4 border-b"
				@destroy="destroyQuestion"
				@resolved="emits('resolved', $event)"
			/>
		</div>

		<!-- Ajouter une nouvelle question -->
		<div
			v-if="$page.props.auth.can.admin && editMode"
			class="grid grid-cols-1 md:grid-cols-4 gap-4 border-t bg-green-100 -mx-4 -mb-2 px-4 pb-2"
		>
			<div class="md:col-span-2">
				<form-textarea
					v-model="form.body"
					:rows="form.rows"
					label="question"
					name="body"
					@keyup.enter="form.rows++"
				/>
			</div>
			<form-textarea
				v-model="form.answer"
				:rows="form.rows"
				label="réponse"
				name="answer"
			/>
			<div class="flex items-end gap-4">
				<form-textarea
					v-model="form.checker"
					:rows="form.rows"
					label="Vérification"
					name="checker"
				/>
				<button
					class=" btn-add"
					@click="addQuestion"
				>
					<i class="bi bi-plus" />
				</button>
			</div>
		</div>
	</chapter-article>
</template>

<script setup>
import BlockShow from "@/Components/Posts/BlockShow"
import QuestionShow from "@/Components/Posts/QuestionShow"
import {inject, ref} from "vue"
import ChapterArticle from "@/Components/Ui/Chapters/ChapterArticle"
import {useForm} from "@inertiajs/inertia-vue3"
import FormTextarea from "@/Components/Form/FormTextarea"

let props = defineProps({
	nb: {type: Number},
	exercise: {type: Object, required: true}
})

let emits = defineEmits(["delete", "update", "resolved"])
let form = useForm({
	body: "",
	answer: "",
	checker: "",
	rows: 1
})
let questions = ref(props.exercise.questions)
let editMode = inject("editmode")

function duplicateExercise(){
	axios.post(
		route("exercises.replicate", props.exercise.id),
	)
}

function destroyExercise(){
	axios.post(
		route("exercises.destroy", [props.exercise.id]),
		{_method: "delete"}
	).then(data=> {
		emits("delete")
	})
		.catch(err => console.log(err))
}

function addQuestion(){
	axios.post(
		route("exercises.questions.store", [props.exercise.id]), {
			...form.data()
		}
	).then((res)=>{
		// Add the question.
		res.data.forEach(q=>questions.value.push(q))
		// questions.value.push(res.data)
	}).catch(res=>{
		// Show the error.
	})
}

function destroyQuestion(id){
	questions.value = questions.value.filter(question=>question.id!==id)
}

</script>
