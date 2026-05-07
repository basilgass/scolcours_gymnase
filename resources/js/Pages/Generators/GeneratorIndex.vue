<script setup lang="ts">

import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import Card from "@/Components/Ui/Card.vue"
import {router} from "@inertiajs/vue3"
import FilteredList from "@/Components/Ui/FilteredList.vue"

defineOptions({layout: LayoutMain})
defineProps<{
	generators: GeneratorInterface[]
}>()
</script>

<template>
	<section>
		<article-title title="liste des générateurs" />

		<filtered-list
			:list="generators"
			list-class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
			filter-by-theme
		>
			<template #card="{item}: {item: GeneratorInterface}">
				<card
					:header-theme="item.theme_id"
					class="hover:scale-105 transition-animation duration-300 cursor-pointer"
					@click="router.visit(route('generators.show', item.slug))"
				>
					<template #header>
						<h1
							v-katex.auto="item.title"
							class="text-lg"
						/>
					</template>
					<div
						v-katex.auto="item.body"
					/>
				</card>
			</template>
		</filtered-list>
	</section>
</template>

<style scoped>

</style>
