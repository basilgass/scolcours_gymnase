<script setup lang="ts">

import ScolcoursSearch, {searchFilter, searchResult, searchResultItem} from "@/Components/ScolcoursSearch.vue"
import {ref} from "vue"
import Card from "@/Components/Ui/Card.vue"

interface resultItem extends searchResultItem {
	chapter: { theme_id: number }
}

const searchText = ref<string>('')
const results = ref<resultItem[]>([])
const filter = ref<searchFilter>('posts')
const resultMessage = ref("")

function onFound(event: searchResult){
	results.value = event[filter.value] as unknown as resultItem[]

	// Update message
	resultMessage.value = `Il y a ${ results.value.length } élément(s) trouvé.`
}

</script>

<template>
	<main class="scolcours-container flex flex-col gap-4">
		<scolcours-search
			@found="onFound"
			v-model="searchText"
		/>

		<div class="text-gray-500">
			{{ resultMessage }}
		</div>
		<div
			v-if="results.length>0"
			class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3"
		>
			<InertiaLink
				as="div"
				v-for="result in results"
				:key="result.id"
				class="cursor-pointer"
				:href="route('posts.show', [result.id])"
			>
				<card
					class="h-full border-l-8"
					v-theme.border="result.chapter.theme_id"
				>
					<div v-katex.auto="result.title" />
				</card>
			</InertiaLink>
		</div>
	</main>
</template>

<style scoped>

</style>
