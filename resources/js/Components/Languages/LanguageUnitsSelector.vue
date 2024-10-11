<script lang="ts" setup>

import { TranslationUnitInterface, TranslationUnitInterfaceExtended } from "@/types/modelInterfaces"
import axios from "axios"
import { computed, ref } from "vue"

const units = defineModel<TranslationUnitInterfaceExtended[]>()

interface BookInterface {
	id: number,
	slug: string,
	name: string
}
defineProps<{
	books: BookInterface[]
}>()

const selectedBook = ref(-1)

const updateUnits = function(item: TranslationUnitInterfaceExtended) {
	// Change the state
	item.selected = !item.selected

	// Load the missing words
	if (item.words.length===0) {
		axios.get(route("translations.words", [item.id])).then(res => {
			item.words = res.data
		})
	}
}

const numberOfWords = computed(()=>{
	// sum for all units selected, get the number of words
	return units.value.reduce((acc, item) => {
		return item.selected ? acc + item.words.length : acc
	}, 0)
})

function getUnits_from_Book(book_id: number){
	if(selectedBook.value===book_id){
		selectedBook.value = -1
		units.value = []
		return
	}
	selectedBook.value = book_id

	axios.get(route("translations.units", [book_id])).then(res => {
		units.value = res.data.map((value: TranslationUnitInterface)=>{
			return {
				...value,
				selected: false,
				words: []
			}
		})
	})
}
</script>

<template>
	<div class="border-y border-gray-400 pt-3 pb-5">
		<div>
			<h2 class="text-lg mb-2 uppercase">
				sélection des livres
			</h2>
			<div class="flex flex-col md:flex-row gap-3">
				<div
					v-for="book in books"
					:key="book.id"
					class="cursor-pointer border rounded
					md:aspect-square md:max-w-[200px] md:w-1/3 lg:w-1/4
					py-5 px-3"
					:class="selectedBook===book.id ? 'bg-green-200': 'bg-white'"
					@click="getUnits_from_Book(book.id)"
				>
					<h2 class="text-lg font-extralight">
						{{ book.name }}
					</h2>
				</div>
			</div>
		</div>
		<div class="flex justify-between font-extralight ">
			<h2 class="text-lg mb-2 uppercase">
				sélection des unités
			</h2>
			<div v-show="numberOfWords>0">
				{{ numberOfWords }} mots
			</div>
		</div>

		<div class="flex flex-wrap gap-3">
			<button
				v-for="(item, key) of units"
				:key="key"
				:class="item.selected?'btn-success':'bg-white'"
				class="btn !px-10"
				@click="updateUnits(item)"
			>
				{{ item.unit }}
			</button>
		</div>
	</div>
</template>

<style scoped>

</style>