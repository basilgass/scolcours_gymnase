<script
	setup
	lang="ts"
>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })
defineProps({
	error: { type: String, default: "erreur inconnue" }
})
</script>

<template>
	<ArticleTitle title="Page introuvable" />

	<div class="w-full h-[300px] grid place-items-center">
		<div class="flex flex-col gap-10">
			<div>Apparemment, la page <code class="px-4">{{ error }}</code> n'a pas été trouvée...</div>

			<InertiaLink
				href="/"
				class="hover:underline"
			>
				retour à l'accueil
			</InertiaLink>
		</div>
	</div>
</template>
