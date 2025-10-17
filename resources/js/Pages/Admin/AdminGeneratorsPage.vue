<script lang="ts" setup>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {computed, PropType, ref} from "vue"
import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import GeneratorItem from "@/Components/Elements/GeneratorItem.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {slugify} from "@/scolcours.ts"
import Card from "@/Components/Ui/Card.vue"

defineOptions({layout: LayoutMain})
defineProps({
	generators: {type: Object as PropType<GeneratorInterface[]>, required: true}
})
const flash = useStoreFlashMessage()

const title = ref("")
const themeId = ref(1)
const slug = computed<string>(() => {
	return slugify(title.value)
})

function addGenerator() {
	axios.post(route("api.admin.generators.store"), {
		title: title.value,
		slug: slug.value,
		theme_id: themeId.value
	})
		.then((res) => {
			title.value = ""
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
		<card class="max-w-2xl mx-auto my-12">
			<form-maker
				v-model="title"
				label="nouveau générateur"
			/>
			<div class="font-code text-xs">
				> {{ slug }}
			</div>
			<form-maker
				v-model="themeId"
				label="theme"
				type="theme"
			/>

			<template #footer>
				<div class="flex justify-end">
					<sc-button
						:class="slug==='' ? 'opacity-30' : ''"
						:disabled="slug===''"
						class="btn btn-add btn-xs"
						type="add"
						@click="addGenerator"
					>
						Ajouter un générateur
					</sc-button>
				</div>
			</template>
		</card>

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


