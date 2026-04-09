<script lang="ts" setup>

import FormCodearea from "@/Components/Form/FormCodearea.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import type {WidgetInterface} from "@/types/modelInterfaces"
import {computed, PropType, ref} from "vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = defineProps({
	widget: {type: Object as PropType<WidgetInterface>, required: true}
})
const theWidget = ref({...props.widget})

const flash = useStoreFlashMessage()

function update() {
	axios.patch(route("api.admin.widgets.update", [props.widget.id]), {
		_method: "PATCH",
		...theWidget.value
	}).then((res) => {
		// Reload the page
		router.reload()

		theWidget.value = res.data


		flash.success("Le widget a été mis à jour")
	}).catch((res) => {
		console.error(res.response.data.message)
		flash.error("Une erreur est survenue:" + res.response.data.message)
	})
}

const isModified = computed(() => {
	if (props.widget.name !== theWidget.value.name) return true
	if (props.widget.slug !== theWidget.value.slug) return true
	if (props.widget.component !== theWidget.value.component) return true


	return props.widget.description !== theWidget.value.description
})
</script>

<template>
	<article class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<FormInput
				v-model="theWidget.name"
				label="name"
			/>
			<FormInput
				v-model="theWidget.slug"
				label="slug"
			/>
			<FormInput
				v-model="theWidget.component"
				label="path"
			/>
		</div>
		<div>
			<FormCodearea
				v-model="theWidget.description"
				label="description"
				language="latex"
				:rows="5"
			/>

			<sc-button
				v-show="isModified"
				class="mt-3 float-right"
				type="primary"
				@click="update"
			>
				mise à jour
			</sc-button>
		</div>
	</article>
</template>


