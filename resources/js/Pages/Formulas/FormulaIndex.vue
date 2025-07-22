<script lang="ts" setup>

import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import FormulaSearch from "@/Components/FormulaSearch.vue"

defineOptions({layout: LayoutMain})

</script>

<template>
	<main class="scolcours-container">
		<article-title
			title="formulaire"
		/>

		<formula-search />
	</main>
</template>


