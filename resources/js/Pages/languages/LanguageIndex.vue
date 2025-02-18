<script
	setup
	lang="ts"
>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { TranslationLanguageInterface } from "@/types/modelInterfaces.ts"

defineOptions({ layout: LayoutMain })
defineProps<{
	language: TranslationLanguageInterface
}>()

const games = {
	memory: 'memory',
	guess: 'suggestions',
	type: 'typographie',
	list: "liste de mots",
	deck: "deck de cartes",
	match: "association de mots",
}
</script>
<template>
	<article class="scolcours-container">
		<ArticleTitle :title="language.name" />

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<InertiaLink
				v-for="(game, key) in games"
				:key="key"
				:href="`/${language.slug}/${key}`"
				class="text-xl bg-white border rounded-sm hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				{{ game }}
			</InertiaLink>
		</div>
	</article>
</template>
