<template>
	<ArticleTitle title="Page introuvable" />

	<div
		class="w-full h-[300px] grid place-items-center"
	>
		<div class="flex flex-col gap-10">
			<div>Apparemment, la page <code class="px-4">{{ error }}</code> n'a pas été trouvée...</div>

			<Link
				href="/"
				class="hover:underline"
			>
				retour à l'accueil
			</Link>
		</div>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle"

defineProps({
	error: {type: String, default: "erreur inconnue"}
})
</script>
