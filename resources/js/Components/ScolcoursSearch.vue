<script setup lang="ts">

import {ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import {watchDebounced} from "@vueuse/core"


interface searchResult {
	category: 'chapter' | 'post' | 'challenge' | 'quizz' | 'deck' | 'tool'
	items: {
		id: number,
		title: string,
		body: string,
	}[]
}

const terms = ref<string>('')
const results = ref<searchResult[]>([])

function searchForTerms() {
	axios.get(route("scolcours.search", [terms.value]))
		.then(res => {
			results.value = res.data
			console.log(res.data)
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

<style scoped>

</style>
