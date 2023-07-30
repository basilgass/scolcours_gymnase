<template>
	<h1 class="text-3xl pt-5 mb-10">
		Admin dashboard
	</h1>

	<div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
		<Link
			:href="route('admin.config')"
			as="button"
			class="min-h-[8em] bg-white border border-gray-200 rounded-xl"
		>
			configuration générale
		</Link>

		<Link
			as="button"
			class="min-h-[8em] bg-white border border-gray-200 rounded-xl"
			:href="route('admin.pages')"
		>
			gestion des pages
		</Link>

		<Link
			as="button"
			class="min-h-[8em] bg-white border border-gray-200 rounded-xl"
			:href="route('admin.users')"
		>
			gestion des utilisateurs
		</Link>

		<Link
			as="button"
			class="min-h-[8em] bg-white border border-gray-200 rounded-xl"
			:href="route('admin.stats.chapter', ['puissances'])"
		>
			statistiques
		</Link>

		<Link
			as="button"
			class="min-h-[8em] bg-white border border-gray-200 rounded-xl"
			:href="route('quizzs.admin')"
		>
			gestion des quizz
		</Link>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import Panel from "@/Components/Ui/Panel"
</script>
