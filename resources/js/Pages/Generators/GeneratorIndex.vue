<script lang="ts" setup>

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {PropType, ref} from "vue"
import {GeneratorInterface} from "@/types/modelInterfaces"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})

const flash = useStoreFlashMessage()

defineProps({
	generators: {type: Object as PropType<GeneratorInterface[]>, required: true}
})

const slug = ref("")
const themeId = ref(1)

function addGenerator() {
	if (slug.value === "") return

	axios.post(route("api.admin.generators.store"), {
		slug: slug.value,
		theme_id: themeId.value
	})
		.then((res) => {
			slug.value = ""
			flash.success("Générateur ajouté")
			router.visit(route("admin.generators.edit", [res.data]))
		})
		.catch((res) => {
			console.log(res.response.data)
		})
}
</script>

<template>
	<section class="scolcours-container">
		<h1 class="text-3xl my-3">
			Gestion des générateurs
		</h1>

		<div class="bg-white max-w-lg mx-auto px-3 py-2 shadow-sm rounded-sm">
			<form-maker
				v-model="slug"
				label="nouveau générateur (slug)"
			/>
			<form-maker
				label="theme"
				type="select"
				v-model="themeId"
			>
				<option
					v-for="theme in $page.props.themes"
					:key="theme.slug"
					:value="theme.id"
				>
					{{ theme.title }}
				</option>
			</form-maker>
			<div class="min-h-[2em] w-full text-right mt-2">
				<button
					v-show="slug!==''"
					class="btn btn-add btn-xs"
					@click="addGenerator"
				>
					Ajouter un générateur
				</button>
			</div>
		</div>

		<filtered-list
			:item-background="(item) => item.theme_id"
			:item-title="(item)=>item.title===''?item.slug:item.title"
			:list="generators"
			:route-data="(item) => [item.id]"
			:route-name="'admin.generators.edit'"
			title="générateurs"
		/>
	</section>
</template>


