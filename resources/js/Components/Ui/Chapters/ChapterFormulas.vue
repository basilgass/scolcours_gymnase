<template>
	<div
		class="divide-y divide-gray-200"
	>
		<div v-if="formulas.length>0">
			<div class="flex justify-between items-center">
				<div>{{ title }}</div>
				<button @click="showComments = !showComments">
					<i :class="{'bi bi-eye':showComments, 'bi bi-eye-slash':!showComments}" />
					commentaires
				</button>
			</div>
			<div
				v-for="item in formulas"
				:key="item.id"
				class="grid grid-cols-1 items-center"
				:class="showComments?'md:grid-cols-2':''"
			>
				<div v-katex.left="item.formula" />

				<div
					v-show="showComments"
					class="flex gap-4 justify-between items-center"
				>
					<div v-katex.auto="item.comment" />
					<div v-if="$page.props.auth.can.admin">
						<button
							class="btn-delete btn-xs"
							@click="delFormula(item.id)"
						>
							<i class="bi bi-x-lg" />
						</button>
					</div>
				</div>
			</div>
		</div>
		<div v-if="$page.props.auth.can.admin">
			<form
				class="flex items-end gap-5"
				@submit.prevent="addFormula"
			>
				<div class="flex-1">
					<form-input
						v-model="form.formula"
						name="formula"
						label="formule"
					/>
				</div>
				<div class="flex-1">
					<form-input
						v-model="form.comment"
						name="comment"
						label="commentaire"
					/>
				</div>
				<form-button class="mb-1">
					+
				</form-button>
			</form>
		</div>
	</div>
</template>
<script setup>

import {ref} from "vue"
import FormInput from "@/Components/Form/FormInput"
import FormButton from "@/Components/Form/FormButton"
import {useForm, usePage} from "@inertiajs/inertia-vue3"

let props = defineProps({
	title: {type: String, default: "Formules"},
	chapter: {type: Object, required: true}
})
let formulas = ref([]),
	showComments = ref(true)

const form = useForm({
	chapter_id: usePage().props.value.chapter.id,
	formula: "",
	comment: ""
})

// make an ajax request.
async function getFormulas() {
	axios.get(
		"/formula/fetch/" + props.chapter.slug,
	).then(res => {
		formulas.value = res.data
	}).catch(
		err => {
			console.error(err.response)
		}
	)
}

formulas.value = getFormulas()

function addFormula() {
	form.post("/formula",
		{
			preserveScroll: true,
			onSuccess: () => {
				form.reset("formula", "comment")
				formulas.value = getFormulas()
			}
		})
}

function delFormula(id) {
	// TODO: add a dialog for validation
	form.delete("/formula/delete/" + id,
		{
			preserveScroll: true,
			onSuccess: () => {
				formulas.value = getFormulas()
			}
		})
}
</script>
