<script
	lang="ts"
	setup
>

import FormMaker from "@/Components/Form/FormMaker.vue"
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

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
			<div
				v-for="deck in theDecks"
				:key="deck.id"
			>
				<div
					v-theme.bg.text.admin
					v-admin="editMode"
					class="flex justify-between p-2 items-middle"
				>
					<div class="font-code text-xs">
						{{ deck.slug }}
					</div>
					<Link
						:href="route('decks.edit', [deck.slug])"
						class="cursor-pointer"
					>
					éditer <i class="bi bi-pencil" />
					</Link>
				</div>
				<div class="relative aspect-video">
					<div
						v-theme.border="deck.theme.id ?? ''"
						class="absolute inset-0 translate-x-2 translate-y-2 bg-white border rounded z-0"
					/>
					<div
						v-theme.border="deck.theme.id ?? ''"
						class="absolute inset-0 translate-x-1 translate-y-1 bg-white border rounded z-0"
					/>
					<div
						@click="router.visit(route('decks.show', deck.slug))"
						v-theme.bg.text="deck.theme.id ?? ''"
						class="absolute inset-0 z-10 border rounded px-3 py-5 grid place-items-center cursor-pointer"
					>
						<h3 class="text-xl">
							{{ deck.title }}
						</h3>
					</div>
				</div>
			</div>
		</div>

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
