<template>
	<ArticleTitle :title="`profil de ${$page.props.auth.user.name}`" />

	<div
		v-admin
		class="flex flex-col gap-3 my-3 admin-wrapper"
	>
		<Link
			href="/admin/"
			class="hover:underline"
		>
			Administration
		</Link>
	</div>

	<div class="space-y-4">
		<h2 class="text-xl">
			Cours ouvert(s)
		</h2>

		<div>
			La liste des cours disponibles / ouverts pour {{ $page.props.auth.user.name }} s'affichera ici :)
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


</script>
