<!--
Wrapper du formulaire d'un chapitre : ajoute le chrome « formulaire » et délègue tout à
FormulaSearch, préchargé sur le chapitre courant. Point d'édition unique = FormulaSearch.
-->
<script
	lang="ts"
	setup
>
import FormulaSearch from "@/Components/FormulaSearch.vue"
import {ChapterInterface} from "@/types/modelInterfaces.ts"

withDefaults(defineProps<{
		chapter: ChapterInterface,
		responsive?: boolean
	}>(),
	{
		responsive: false
	})
</script>

<template>
	<section class="bg-content rounded-lg shadow-lg">
		<div
			v-theme.bg.text
			class="p-3 flex justify-between items-center rounded-t-lg"
		>
			<h3 class="uppercase font-extralight flex gap-3 items-baseline">
				<i class="bi bi-table text-xl" />
				<p>formulaire</p>
			</h3>
		</div>

		<div class="p-3">
			<formula-search
				:chapter-id="chapter.id"
				:responsive="responsive"
			/>
		</div>
	</section>
</template>
