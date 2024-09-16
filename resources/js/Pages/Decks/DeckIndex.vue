<script
	lang="ts"
	setup
>

import FormMaker from "@/Components/Form/FormMaker.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { deckInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"
import axios from "axios"
import { inject, PropType, ref } from "vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	decks: { type: Array as PropType<deckInterface[]>, required: true }
})
console.log(props.decks)
const editMode = inject<boolean>("editMode")

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
			<template #card="{ item }: { item: deckInterface }">
				<div :key="item.id">
					<div
						v-theme.bg.text.admin
						v-admin="editMode"
						class="flex justify-between p-2 items-middle"
					>
						<div class="font-code text-xs">
							{{ item.slug }}
						</div>
						<InertiaLink
							:href="route('decks.edit', [item.slug])"
							class="cursor-pointer"
						>
							éditer <i class="bi bi-pencil" />
						</InertiaLink>
					</div>
					<div class="relative aspect-video group">
						<div
							v-theme.bg.text="item.theme.id === null ? 'bg-white text-black' : item.theme.id"
							class="absolute inset-0
							translate-x-2 translate-y-2
							opacity-30
							border rounded z-0"
						/>
						<div
							v-theme.bg.text="item.theme.id === null ? 'bg-white text-black' : item.theme.id"
							class="absolute inset-0
							translate-x-1 translate-y-1
							group-hover:translate-x-0 group-hover:translate-y-0
							transition-all duration-600 ease-in-out
							opacity-65
							border rounded z-0"
						/>
						<div
							@click="router.visit(route('decks.show', item.slug))"
							v-theme.bg.text="item.theme.id === null ? 'bg-white text-black' : item.theme.id"
							class="absolute inset-0 z-10
							border rounded px-3 py-5
							group-hover:-translate-x-2 group-hover:-translate-y-2
							transition-all duration-600 ease-in-out
							grid place-items-center cursor-pointer"
						>
							<h3 class="text-xl">
								{{ item.title }}
							</h3>
						</div>
					</div>
				</div>
			</template>
		</FilteredList>


		<div
			class="mt-10 flex flex-col gap-5 justify-center max-w-[300px] mx-auto"
			v-admin="editMode"
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

<style scoped></style>
