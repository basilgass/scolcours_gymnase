<script
	lang="ts"
	setup
>

import FormMaker from "@/Components/Form/FormMaker.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import DeckGroup from "@/Components/Decks/DeckGroup.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import type { DeckInterface } from "@/types/modelInterfaces"
import axios from "axios"
import { PropType, ref } from "vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	decks: { type: Array as PropType<DeckInterface[]>, required: true }
})


const editMode = useStoreEditMode()
const theDecks = ref(props.decks)

const newDeckTitle = ref(""),
	newDeckSlug = ref("")

function addDeck() {
	axios.post(route("decks.store"),
		{
			title: newDeckTitle.value,
			slug: newDeckSlug.value
		})
		.then(res => {
			theDecks.value.push(res.data)
		})
}
</script>

<template>
	<section class="scolcours-container">
		<h3 class="text-3xl py-4">
			Decks de révision
		</h3>

		<FilteredList
			list-class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
			:list="props.decks"
			filter-by-theme
		>
			<template #card="{ item }: { item: DeckInterface }">
				<deck-group
					:key="item.id"
					:deck="item"
				/>
			</template>
		</FilteredList>


		<div
			class="mt-10 flex flex-col gap-5 justify-center max-w-[300px] mx-auto"
			v-admin="editMode.enable"
		>
			<form-maker
				v-model="newDeckTitle"
				inline-label
				label="titre"
				type="text"
			/>
			<form-maker
				v-model="newDeckSlug"
				inline-label
				label="slug"
				type="text"
			/>
			<button
				class="btn btn-add"
				@click="addDeck"
			>
				ajouter un deck
			</button>
		</div>
	</section>
</template>

