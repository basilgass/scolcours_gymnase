<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { ref } from "vue"

defineOptions({ layout: LayoutMain })

const v = ref("")
const v2 = ref("")
</script>
<template>
	<section class="scolcours-container">
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
				:href="route('admin.chapters')"
				as="button"
				class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
			>
				gestion des chapitres
			</Link>

			<Link
				:href="route('admin.tools')"
				as="button"
				class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
			>
				gestion des outils
			</Link>

			<Link
				:href="route('admin.challenges')"
				as="button"
				class="min-h-[8em] text-xl bg-white border border-gray-200 rounded-xl"
			>
				gestion des challenges
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
				:href="route('translations.import')"
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
	</section>
</template>
