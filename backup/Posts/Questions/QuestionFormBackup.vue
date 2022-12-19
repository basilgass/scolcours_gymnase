<template>
	<div class="w-full">
		<div class="flex justify-between gap-3 mb-4">
			<button
				v-if="props.hideable"
				class="btn-xs btn-edit"
				@click="showEditForm=!showEditForm"
			>
				éditer la question <i class="bi bi-pencil" />
			</button>

			<div v-show="showEditForm">
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
		<div
			v-show="showEditForm"
			class="grid grid-cols-1 gap-4 border-t -mx-4 -mb-2 px-4 pb-2"
		>
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
					/>
				</div>

				<div class="grow">
					<form-input
						v-model="form.keyboard"
						label="clavier"
						name="clavier"
						class="font-code"
					/>
				</div>
			</div>
			<div>
				<button
					v-for="(item, key) in checkersList"
					:key="key"
					class="btn btn-xs"
					@click="form.checker=key"
				>
					{{ `${key}${item.length>0?` @${item.join(' @')}`:''}` }}
				</button>
			</div>
			<div>
				<button
					v-for="item of keyboardsList"
					:key="item"
					class="btn btn-xs"
					@click="form.keyboard=item"
				>
					{{ item }}
				</button>
			</div>

			<div>
				<form-textarea
					v-model="form.parameters"
					name="parameters"
					label="paramètres du clavier"
				/>
			</div>
		</div>
	</div>
</template>
<script setup>
import FormInput from "@/Components/Form/FormInput.vue"
import {useForm} from "@inertiajs/inertia-vue3"
import {ref} from "vue"
import {checkersList} from "@/Composables/useCheckers"
import {keyboardsList} from "@/keyboards"
import Button from "@/Components/Auth/Button.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"

let props = defineProps({
	modelValue: {type: Object, required: true},
	hideable: {type: Boolean, default: false}
})

let emits = defineEmits(["update:modelValue", "cancel", "updated", "save", "close"])
let form = useForm({...props.modelValue})
let showEditForm = ref(!props.hideable)

function cancelQuestion(){
	emits("cancel")
	emits("close")
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
		emits("save")
		emits("close")
		showEditForm.value = false
	})
}


</script>
