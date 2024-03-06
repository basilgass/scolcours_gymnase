<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })
</script>
<template>
	<h1 class="text-3xl pt-5 mb-10">
		Admin dashboard
	</h1>

	<div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
		<Link
			:href="route('admin.config')"
			as="button"
			class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
		>
			configuration générale
		</Link>

		<Link
			:href="route('admin.pages')"
			as="button"
			class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
		>
			gestion des pages
		</Link>

		<Link
			:href="route('admin.users')"
			as="button"
			class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
		>
			gestion des utilisateurs
		</Link>

		<Link
			:href="route('teams.index')"
			as="button"
			class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
		>
			équipes
		</Link>

		<Link
			:href="route('quizzs.admin')"
			as="button"
			class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
		>
			gestion des quizz
		</Link>

		<Link
			:href="route('translation.import')"
			as="button"
			class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
		>
			import des langues
		</Link>

		<Link
			:href="route('admin.widgets')"
			as="button"
			class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
		>
			widgets
		</Link>
	</div>
</template>
