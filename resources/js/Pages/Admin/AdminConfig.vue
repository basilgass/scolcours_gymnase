<template>
	<section class="flex flex-col gap-5">
		<h1 class="text-3xl pt-5">
			Configuration du site web
		</h1>

		<form-input
			v-model="title"
			label="titre du site web"
			name="title"
		/>

		<div class="flex flex-col gap-3">
			<draggable
				v-model="themes"
				item-key="id"
				class="flex flex-col gap-3"
				handle=".draggable-handle"
				v-bind="{
					animation: 200,
				}"
				@update="sortEvent"
			>
				<template #item="{ element }">
					<div class="flex gap-3 items-center">
						<div class="text-3xl draggable-handle cursor-move">
							<i class="bi bi-arrows-move" />
						</div>
						<div
							:class="element.enabled?'bg-scolcours-'+element.slug:'bg-gray-400'"
							class="text-white px-4 py-2 rounded flex-1 grid grid-cols-1 gap-3 place-items-center"
						>
							<div>{{ element.title }}</div>
							<i :class="`${element.icon}`" />
						</div>

						<form-switch
							v-model="element.enabled"
							:name="`${element}-enabled`"
							label="activé,désactivé"
							@input="saveConfig"
						/>
					</div>
				</template>
			</draggable>
		</div>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import {inject, ref} from "vue"
import axios from "axios"
import FormInput from "@/Components/Form/FormInput.vue"

const flash = inject("flash")

let props = defineProps({
	allThemes: {type: Array, required: true},
	title: {type: String, required: true}
})
let title = ref(props.title),
	themes = ref(props.allThemes),
	saveConfig = function () {
		axios.post(route("admin.config.update"), {
			title: title.value,
			themes: themes.value,
			_method: "PATCH"
		}).then(res => {
			flash.add("les modifications de configuration ont bien été changées !")
		}).catch(err => {
			console.log(err)
		})
	},
	sortEvent = function () {
		axios.post(route("admin.config.updateOrder"), {
			_method: "PATCH",
			order: themes.value.map((x, index) => {
				return {id: x.id, order: index + 1}
			})
		}).then(res => {
			flash.add("L'ordre des thèmes à bien été enregistré !")
		}).catch(res => {
			console.warn("update ordering order: ", res)
		})
	}
</script>
