<script setup lang="ts">

import {ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import {watchDebounced} from "@vueuse/core"

export interface searchResultItem {
	id: number,
	title: string,
	body: string,
}

export type searchFilter = 'chapters' | 'posts' | 'challenges' | 'quizzes' | 'decks' | 'tools' | 'howtos'
export type searchResult = Record<searchFilter, searchResultItem[]>

// export interface searchResult {
// 	type: 'chapter' | 'post' | 'challenge' | 'quizz' | 'deck' | 'tool' | 'howto'
// 	items: searchResultItem[]
// }

const props = withDefaults(
	defineProps<{
		filter?: searchFilter
	}>(), {
		filter: null
	})

const terms = defineModel<string>()
const found = ref<searchResult[]>([])

const emits = defineEmits<{
	found: [value: searchResult]
}>()


function searchForTerms() {
	axios.get(route("scolcours.search", [props.filter ?? 'all', terms.value]))
		.then(res => {
			found.value = res.data
			emits('found', res.data)
		})
}

watchDebounced(
	terms,
	searchForTerms,
	{debounce: 500}
)
</script>

<template>
	<div id="search-everywhere">
		<form-maker
			v-model="terms"
			placeholder="rechercher..."
		/>
	</div>
</template>


