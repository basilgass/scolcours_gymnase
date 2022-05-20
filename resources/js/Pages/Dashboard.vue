<template>
	<Head title="Dashboard" />

	<ArticleTtile>Dashboard</ArticleTtile>

	<div
		v-if="$page.props.auth.can.admin"
	>
		<Link href="/admin">
			Administration
		</Link>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTtile from "@/Components/Ui/ArticleTitle"
</script>
