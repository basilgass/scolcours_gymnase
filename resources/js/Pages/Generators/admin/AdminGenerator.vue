<script lang="ts" setup>
import {computed, ref} from "vue"
import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import GeneratorItem from "@/Components/Elements/GeneratorItem.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {slugify} from "@/scolcours.ts"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue";
import DialogModal from "@/Components/Ui/DialogModal.vue";

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

const showCreate = ref(false)

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
	<section>
		<article-title
			title="gestion des générateurs"
			:return-link="{
					url: route('admin.index'),
					label: 'retour à l\'administration'
				}"
		>
			<template #right>
				<sc-button
					type="add"
					xs
					@click="showCreate = true"
				>
					<i class="bi bi-plus-circle mr-2" />créer un générateur
				</sc-button>
			</template>
		</article-title>


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
			filter-by-theme
		>
			<template #card="{ item }: { item: GeneratorInterface }">
				<generator-item
					:ref="addToRef"
					:generator="item"
					@generator-has-errors="hasErrors(item.id, $event)"
				/>
			</template>
		</filtered-list>

		<dialog-modal
			v-model="showCreate"
			class="h-auto px-5 py-2"
		>
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
				<div class="flex justify-center mt-10 mb-3">
					<sc-button
						:class="slug==='' ? 'opacity-30' : ''"
						:disabled="slug===''"
						class="btn btn-add btn-xs"
						type="add"
						icon
						@click="addGenerator"
					>
						Ajouter un générateur
					</sc-button>
				</div>
			</template>
		</dialog-modal>
	</section>
</template>


