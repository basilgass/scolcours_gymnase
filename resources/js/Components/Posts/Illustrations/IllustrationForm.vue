<!--
Formulaire d'édition d'une illustratrion
TODO: Améliorer les illustrations de type components.
TODO: Ajouter des "helpers", pour avoir des indications des paramètres par exemple.
-->
<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div class="bg-white border-b border-gray-200 px-5 py-3 mb-5">
				<div class="flex justify-between items-baseline w-full">
					<h1>
						<span class="text-xl md:text-2xl">édition d'une illustration</span>
						<span class="text-xs font-code ml-5">(id: {{ theIllustration.id }})</span>
					</h1>
					<div class="flex gap-3 justify-end">
						<button
							class="btn btn-xs"
							@click="copyIllustration"
						>
							<i class="bi bi-clipboard-plus" />
						</button>
						<button
							v-if="hasClipboard"
							class="btn btn-xs"
							@click="pasteIllustration"
						>
							<i class="bi bi-clipboard-pulse" />
						</button>
						<button
							class="btn-primary btn-xs"
							@click="saveIllustration"
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
							@confirm="deleteIllustration"
						>
							supprimer
						</confirm-button>
					</div>
				</div>
			</div>
		</template>

		<div class="w-full px-5">
			<div
				class="grid grid-cols-1 md:grid-cols-2 gap-3"
				:class="props.overflowScroll ? 'overflow-y-scroll' : ''"
			>
				<form-illustration
					v-model="theIllustration"
					:label="`illustration`"
					:name="`illustration`"
				/>

				<illustration-show
					class="bg-white"
					:illustration="theIllustration"
					preview
				/>
			</div>
		</div>
	</dialog-modal>
</template>

<script setup>
import FormIllustration from "@/Components/Form/FormIllustration.vue"
import { computed, ref } from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"

const emits = defineEmits(["update:modelValue", "change", "destroy"])
const props = defineProps({
	illustration: { type: Object, required: true },
	modelValue: { type: Boolean, default: false }, // show or hide the block dialog
})

let show = ref(props.modelValue),
	theIllustration = ref(props.illustration)

let saveIllustration = function () {
		axios
			.post(route("illustrations.update", [theIllustration.value.id]), {
				...theIllustration.value,
				_method: "PATCH",
			})
			.then((res) => {
				emits("update:modelValue", false)
				emits("change", res.data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	deleteIllustration = function () {
		axios
			.post(route("illustrations.destroy", [props.illustration.id]), {
				_method: "delete",
			})
			.then((res) => {
				emits("update:modelValue", false)
				emits("destroy", props.illustration.id)
			})
			.catch((error) => console.error(error))
	},
	copyIllustration = function () {
		sessionStorage.setItem(
			"scolcours-clipboard-illustration",
			`${theIllustration.value.parameters}\n${theIllustration.value.code}`
		)
	},
	pasteIllustration = function () {
		let paste = sessionStorage.getItem("scolcours-clipboard-illustration")
		if (paste !== null) {
			paste = paste.split("\n")
			theIllustration.value.parameters = paste.shift()
			theIllustration.value.code = paste.join("\n")
		}
	},
	hasClipboard = computed(() => {
		return (
			sessionStorage.getItem("scolcours-clipboard-illustration") !== null
		)
	})
</script>
