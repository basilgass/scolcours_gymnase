<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import { widgetInterface } from "@/types/modelInterfaces"
import { computed, PropType, ref } from "vue"
import axios from "axios"
import { router } from "@inertiajs/vue3"

const props = defineProps({
	widget: { type: Object as PropType<widgetInterface>, required: true }
})
const theWidget = ref({ ...props.widget })

function update() {
	axios.patch(route("widgets.update", [props.widget.id]), {
		_method: "PATCH",
		...theWidget.value
	}).then(() => {
		// Reload the page
		router.reload({
			preserveScroll: true,
			preserveState: true
		})
	}).catch((res) => {
			console.error(res.response.data.message)
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
				class="btn-xs mt-3 float-right btn-primary"
				@click="update"
			>
				mise à jour
			</button>
		</div>
	</article>
</template>

<style scoped>

</style>
