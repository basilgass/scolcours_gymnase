<template>
	<h1 class="text-3xl pt-5 mb-10">
		Configuration du site web
	</h1>

	<form-input
		v-model="title"
		label="titre du site web"
		name="title"
	/>

	<div class="flex flex-col gap-3">
		<div
			v-for="theme of themes"
			:key="theme.slug"
			class="flex gap-3 items-center"
		>
			<div
				:class="theme.enabled?'bg-scolcours-'+theme.slug:'bg-gray-400'"
				class="text-white px-4 py-2 rounded flex-1 grid grid-cols-1 gap-3 place-items-center"
			>
				<div>{{ theme.title }}</div>
				<i :class="`${theme.icon}`" />
			</div>

			<form-switch
				v-model="theme.enabled"
				:name="`${theme}-enabled`"
				label="activé,désactivé"
			/>
		</div>
	</div>

	<div class="w-full mt-10 text-right">
		<button
			class="btn-primary"
			@click="saveConfig"
		>
			Enregistrer
		</button>
	</div>
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
	}
</script>
