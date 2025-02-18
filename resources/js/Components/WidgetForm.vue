<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import type { WidgetInterface } from "@/types/modelInterfaces"
import { computed, inject, PropType, ref } from "vue"
import axios from "axios"
import { router } from "@inertiajs/vue3"
import { flashInterface } from "@/types"

const props = defineProps({
	widget: { type: Object as PropType<WidgetInterface>, required: true }
})
const theWidget = ref({ ...props.widget })

const flash = inject<flashInterface>("flash")

function update() {
	axios.patch(route("widgets.update", [props.widget.id]), {
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
	if (props.widget.description !== theWidget.value.description) return true

	return false
})
</script>

<template>
	<article class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<form-maker
				v-model="theWidget.name"
				label="name"
			/>
			<form-maker
				v-model="theWidget.slug"
				label="slug"
			/>
			<form-maker
				v-model="theWidget.component"
				label="path"
			/>
		</div>
		<div>
			<form-maker
				v-model="theWidget.description"
				label="description"
				rows="5"
				type="textarea"
			/>

			<button
				v-show="isModified"
				class="btn btn-xs mt-3 float-right btn-primary"
				@click="update"
			>
				mise à jour
			</button>
		</div>
	</article>
</template>


