<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {inject, PropType, ref} from "vue"
import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import GeneratorItem from "@/Components/Elements/GeneratorItem.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {useMenuScrollToData} from "@/Composables/useHelpers.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {flashInterface} from "@/types"

defineOptions({layout: LayoutMain})
defineProps({
	generators: {type: Object as PropType<GeneratorInterface[]>, required: true}
})
const flash = inject<flashInterface>('flash')


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
	<main
		class="scolcours-container"
	>
		<div class="bg-white max-w-lg mx-auto px-3 py-2 shadow-sm rounded-sm">
			<form-maker
				v-model="slug"
				label="nouveau générateur (slug)"
			/>
			<form-maker
				label="theme"
				type="theme"
				v-model="themeId"
			/>
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

		<sc-button
			type="danger"
			@click="useMenuScrollToData('withErrors', true)"
		>
			Rechercher la première erreur
		</sc-button>
		<filtered-list
			:list="generators"
			list-class="flex flex-col gap-12"
		>
			<template #card="{ item }: { item: GeneratorInterface }">
				<generator-item :generator="item" />
			</template>
		</filtered-list>
	</main>
</template>


