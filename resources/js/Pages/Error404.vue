<script
	setup
	lang="ts"
>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue";

defineOptions({layout: LayoutMain})
withDefaults(defineProps<{
	error?: string
	suggestion?: { label: string; url: string; theme_id: number | null } | null
}>(), {
	error: 'Erreur inconnue !',
	suggestion: null,
})
</script>

<template>
	<ArticleTitle title="Page introuvable" />

	<div class="w-full h-75 grid place-items-center">
		<div class="flex flex-col gap-10">
			<div>Apparemment, la page <code class="px-4">{{ error }}</code> n'a pas été trouvée...</div>

			<sc-button
				v-if="suggestion"
				:href="suggestion.url"
				type="primary"
				:theme="suggestion.theme_id ?? null"
			>
				{{ suggestion.label }}
			</sc-button>

			<sc-button
				:href="route('scolcours.index')"
				type="primary"
			>
				retour à l'accueil
			</sc-button>
		</div>
	</div>
</template>
