<!--
Affichage du formulaire en menu "slide-in" depuis la gauche.
-->
<script lang="ts" setup>
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import {ref} from "vue"
import {ChapterInterface} from "@/types/modelInterfaces.ts"

defineProps<{
	chapter: ChapterInterface
}>()

const afficherFormulaires = ref(false)

</script>

<template>
	<div>
		<button
			class="fixed z-20
			bottom-5 left-0
			px-4 py-2 hover:pl-6 transition-all
			cursor-pointer
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
				class="fixed z-20 inset-0
				w-full md:w-100
				bg-white dark:bg-gray-700
				overflow-y-scroll scrollbar-scolcours"
			>
				<button
					class="absolute z-25
					top-3 right-3
						font-semibold scale-125
						text-white
						 dark:hover:text-gray-200 cursor-pointer"
					@click="afficherFormulaires=false"
				>
					<i
						class="bi bi-x-circle inline-block
					transition-transform duration-600
					hover:rotate-180"
					/>
				</button>
				<chapter-formulas
					:chapter
				/>
			</div>
		</transition>
	</div>
</template>


