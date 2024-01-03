<script lang="ts">
import LayoutFullpage from "@/Layouts/LayoutFullpage.vue"

export default {
	layout: LayoutFullpage
}
</script>

<script lang="ts" setup>

import { PropType, ref } from "vue"
import { deckInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"
import axios from "axios"
import FormMaker from "@/Components/Form/FormMaker.vue"

const props = defineProps({
	decks: { type: Array as PropType<deckInterface[]>, required: true }
})

let theDecks = ref(props.decks)

let newDeckTitle = ref(""),
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
	<section>
		<h3 class="text-3xl">
			Decks de révision
		</h3>

		<div class="grid grid-cols-1 gap-5">
			<div
				v-for="deck in theDecks"
				:key="deck.id"
				class="bg-white border rounded px-3 py-5 flex"
			>
				<div>
					<h3 class="text-xl">
						{{ deck.title }}
					</h3>
					<div class="font-code text-xs">
						{{ deck.slug }}
					</div>
				</div>

				<div class="ml-auto flex flex-col gap-3">
					<Link
						:href="route('decks.show', [deck.slug])"
						as="div"
						class="cursor-pointer"
					>
						apprendre
					</Link>
					<Link
						:href="route('decks.edit', [deck.slug])"
						as="div"
						class="cursor-pointer"
					>
						éditer
					</Link>
				</div>
			</div>
		</div>

		<div class="mt-10 flex flex-col gap-5 justify-center max-w-[300px] mx-auto">
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

<style scoped>

</style>
