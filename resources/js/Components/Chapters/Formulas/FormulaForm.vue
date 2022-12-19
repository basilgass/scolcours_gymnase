<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div class="bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5">
				<h1>
					<span class="text-xl md:text-2xl">édition d'une formule</span>
					<span class="text-xs font-code ml-5">(id: {{ props.formula.id }})</span>
				</h1>
				<div class="flex gap-3 justify-end">
					<button
						class="btn-primary btn-xs"
						@click="saveFormula"
					>
						enregistrer
					</button>
					<button
						class="btn-cancel btn-xs"
						@click="emits('update:modelValue', false)"
					>
						fermer
					</button>
					<confirm-button
						class="btn-delete btn-xs"
						@confirm="deleteFormula"
					>
						supprimer
					</confirm-button>
				</div>
			</div>
		</template>

		<div class="px-5 pb-5">
			<form-input
				v-model="theFormula.block.body"
				label="body"
				name="body"
				focus
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<form-textarea
					v-model="theFormula.block.body"
					name="body"
					label="body"
				/>
				<markdown-it
					:text="theFormula.block.body"
					class="md:mt-6"
				/>
			</div>

			<div class="my-10">
				<form-illustration
					v-model="theFormula.block.illustration"
					name="illustration"
					max-illustration="1"
				/>
			</div>
		</div>
	</dialog-modal>
</template>

<script setup>

import {inject, ref} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import FormIllustration from "@/Components/Form/FormIllustration.vue"

const emits = defineEmits(["update:modelValue", "change", "destroy"])

const props = defineProps({
	modelValue: {type: Boolean, default: false},
	formula: {type: Object, required: true},
})

let theFormula = ref(props.formula)

const flash = inject("flash")
let show = ref(props.modelValue),
	saveFormula = function(){
		axios.patch(route("formulas.update", [props.formula.id]), {
			_method: "PATCH",
			...theFormula.value
		}).then(res=>{
			flash.add("La formule a été enregistrée")
			emits("update:modelValue", false)
			emits("change", res.data.data)
		})
	},
	deleteFormula = function (){

	}

</script>
