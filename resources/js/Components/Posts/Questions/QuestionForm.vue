<template>
	<div>
		<div class="flex justify-end gap-3 mb-4">
			<button
				class="btn-xs btn-edit"
				@click="showEditForm=!showEditForm"
			>
				éditer <i class="bi bi-pencil" />
			</button>
			<confirm-button
				btn-class="btn-delete"
				xs
				@confirm="destroyQuestion"
			>
				supprimer <i class="bi bi-trash" />
			</confirm-button>
		</div>
		<div
			v-show="showEditForm"
			class="grid grid-cols-1 gap-4 border-t bg-green-100 -mx-4 -mb-2 px-4 pb-2"
		>
			<form-textarea
				ref="questionBodyForm"
				v-model="form.body"
				label="question"
				name="body"
				class="font-code"
				@save="patchQuestion"
			/>

			<form-input
				v-model="form.answer"
				label="réponse"
				name="answer"
				class="font-code"
			/>

			<div class="flex items-end gap-4 w-full">
				<div class="grow">
					<form-input
						v-model="form.checker"
						label="Vérification"
						name="checker"
						class="font-code"
						:datalist="checkersList"
					/>
				</div>

				<div class="grow">
					<form-input
						v-model="form.keyboard"
						label="clavier"
						name="clavier"
						class="font-code"
						:datalist="keyboardsList"
					/>
				</div>
			</div>

			<div class="text-right">
				<button
					class="btn-xs btn-edit"
					@click="patchQuestion"
				>
					<i class="bi bi-arrow-clockwise mr-3" /> Enregistrer
				</button>
				<button
					class="btn-xs btn-cancel"
					@click="cancelQuestion"
				>
					<i class="bi bi-x-lg mr-3" /> Annuler
				</button>
			</div>
		</div>
	</div>
</template>
<script setup>
import FormInput from "@/Components/Form/FormInput"
import {useForm} from "@inertiajs/inertia-vue3"
import {ref} from "vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton"
import FormTextarea from "@/Components/Form/FormTextarea"
import {checkersList} from "@/Composables/useCheckers"
import {keyboardsList} from "@/keyboards"

let props = defineProps({
	modelValue: {type: Object, required: true},
})

let emits = defineEmits(["update:modelValue", "cancel", "updated", "destroy"])
let form = useForm({...props.modelValue})
let showEditForm = ref(false)

function cancelQuestion(){
	emits("cancel")
	showEditForm.value = false
}
function patchQuestion(ev) {
	axios.post(
		route("questions.update", [props.modelValue.id]),
		{
			_method: "patch",
			...form.data()
		}
	).then(res => {
		emits("update:modelValue", res.data.data)
		emits("updated")
		showEditForm.value = false
	})
}

function destroyQuestion() {
	axios.post(
		route("questions.destroy", [props.modelValue.id]),
		{
			_method: "delete"
		}
	).then(res => {
		emits("destroy", props.modelValue.id)
	})
}

</script>
