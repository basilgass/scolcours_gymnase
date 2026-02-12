<script lang="ts" setup>
import {computed, ref} from "vue"
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
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"

defineOptions({layout: LayoutAdmin})

const props = defineProps<{
	generators: GeneratorInterface[]
}>()

const flash = useStoreFlashMessage()
const title = ref("")
const themeId = ref(1)
const slug = computed<string>(() => {
	return slugify(title.value)
})

const filterErrorsOnly = ref<boolean>(false)
const filteredGenerators = computed<GeneratorInterface[]>(() => {

	const withErrors = generatorsErrorsStatus.value.filter(el => el.errors).map(el => el.id)

	return filterErrorsOnly.value && (generatorsErrorsStatus.value.length === props.generators.length)
		? props.generators.filter(el => withErrors.includes(el.id))
		: props.generators
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


const generatorsErrorsStatus = ref<{ id: number, errors: boolean }[]>([])

function generateAll() {
	generatorRefs.value.forEach(el => {
		el.generate()
	})

	filterErrorsOnly.value = !filterErrorsOnly.value
}

function hasErrors(id: number, errors: boolean) {
	generatorsErrorsStatus.value.push({id, errors})
}

const generatorRefs = ref<InstanceType<typeof GeneratorItem>[]>([])

function addToRef(el: InstanceType<typeof GeneratorItem>) {
	generatorRefs.value.push(el)
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

		<sc-button
			type="primary"
			:outline="!filterErrorsOnly"
			@click="generateAll"
		>
			Vérifier les erreurs
			<span v-show="filterErrorsOnly">{{ filteredGenerators.length }} / {{ generators.length }}</span>
		</sc-button>

		<filtered-list
			:list="filteredGenerators"
			list-class="flex flex-col gap-12"
		>
			<template #card="{ item }: { item: GeneratorInterface }">
				<generator-item
					:ref="addToRef"
					:generator="item"
					@generator-has-errors="hasErrors(item.id, $event)"
				/>
			</template>
		</filtered-list>
	</main>
</template>


