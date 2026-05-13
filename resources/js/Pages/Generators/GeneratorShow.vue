<script setup lang="ts">

import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import GeneratorDisplay from "@/Components/Challenges/GeneratorDisplay.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"

defineOptions({layout: LayoutMain})
defineProps<{
	generator: GeneratorInterface
}>()
</script>

<template>
	<section>
		<article-title
			:title="generator.title"
			:return-link="{
				url: route('generators.index'),
				label: 'liste de tous les générateurs'
			}"
		/>

		<suspense>
			<generator-display :generator />
		</suspense>
	</section>
</template>

<style scoped>

</style>
