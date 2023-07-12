<template>
	<h1 class="text-3xl pt-5 mb-10">
		Admin dashboard
	</h1>

	<div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
		<Panel class="min-h-[10em]">
			<Link :href="route('admin.config')">
				Configuration générale
			</Link>
		</Panel>

		<Panel class="min-h-[10em]">
			<Link :href="route('admin.pages')">
				Gestion des pages
			</Link>
		</Panel>

		<Panel class="min-h-[10em]">
			<Link :href="route('admin.users')">
				Gestion des utilisateurs
			</Link>
		</Panel>

		<Panel class="min-h-[10em]">
			<Link :href="route('admin.stats.chapter', ['puissances'])">
				Statistiques
			</Link>
		</Panel>

		<Panel class="min-h-[10em]">
			<Link :href="route('quizzs.admin')">
				Quizz
			</Link>
		</Panel>
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
