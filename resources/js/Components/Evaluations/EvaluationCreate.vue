<script lang="ts" setup>
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, nextTick, ref, useTemplateRef} from "vue"
import axios from "axios"
import ScButton from "@/Components/Ui/scButton.vue"
import {slugify} from "@/scolcours.ts"
import {AxiosErrorMessage} from "@/types"

const showModal = ref(false)
const title = ref("")

const input = useTemplateRef<InstanceType<typeof FormMaker>>('input')

async function onShowModal() {
	showModal.value = true
	await nextTick()

	input.value.focus()
}

const slug = computed(() => {
	return slugify(title.value)
})

function create() {
	axios
		.post(route("api.admin.evaluations.store"), {
			slug: slug.value,
			title: title.value,
		})
		.then((res) => {
			console.log(res)
		})
		.catch((err: AxiosErrorMessage) => console.log(err.response.data.message))
}
</script>
<template>
	<div>
		<sc-button
			type="add"
			@click="onShowModal"
		>
			<i class="bi bi-plus-circle mr-3" />Créer une évaluation
		</sc-button>

		<dialog-modal
			v-model="showModal"
			class="max-w-md h-auto"
		>
			<template #header>
				<h2 class="pt-3 px-5 text-2xl">
					nouvelle évaluation
				</h2>
			</template>
			<div class="p-5 flex items-end gap-3">
				<form-maker
					ref="input"
					v-model="title"
					label="titre"
					@enter="create"
					placeholder="entrer un titre"
				>
					<template #message>
						<div class="font-code text-xs text-gray-400 min-h-[1.6em] pt-1">
							{{ slug }}
						</div>
					</template>
				</form-maker>
			</div>

			<template #footer>
				<div class="flex justify-end px-3 pb-2">
					<sc-button
						v-admin
						type="add"
						@click="create"
					>
						créer
					</sc-button>
				</div>
			</template>
		</dialog-modal>
	</div>
</template>
