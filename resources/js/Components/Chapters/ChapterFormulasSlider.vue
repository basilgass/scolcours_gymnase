<!--
Affichage du formulaire en menu "slide-in" depuis la gauche.
-->
<script lang="ts" setup>
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import { ref } from "vue"

defineProps<{
	chapterSlug: string
}>()

const afficherFormulaires = ref(false)

</script>

<template>
	<div>
		<button
			class="fixed z-20
			bottom-5 left-0
			px-4 py-2 hover:pl-6 transition-all
			text-xs
			bg-white dark:bg-gray-800 dark:text-white
			rounded-r-full border border-l-0 border-gray-200
			shadow dark:shadow-gray-400"
			@click="afficherFormulaires=!afficherFormulaires"
		>
			formulaire
		</button>
		<transition name="fade">
			<div
				v-if="afficherFormulaires"
				class="fixed inset-0 z-20
				bg-gray-800/60"
				@click.self="afficherFormulaires=false"
			/>
		</transition>
		<transition name="slide-fade">
			<div
				v-if="afficherFormulaires"
				class="fixed z-20
				bottom-0 left-0
				w-full md:w-[400px] h-full
				py-3
				bg-white dark:bg-gray-700
				overflow-y-scroll scrollbar-scolcours"
			>
				<div>
					<button
						class="absolute top-0 right-0 p-3 text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
						@click="afficherFormulaires=false"
					>
						<i class="bi bi-x-circle" />
					</button>
					<chapter-formulas
						:chapter-slug="chapterSlug"
					/>
				</div>
			</div>
		</transition>
	</div>
</template>


