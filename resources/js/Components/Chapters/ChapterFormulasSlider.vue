<!--
Affichage du formulaire en menu "slide-in" depuis la gauche.
-->
<script setup lang="ts">
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import { ref } from "vue"

let props = defineProps({
		chapter: { type: Object, required: true }
	}),
	afficherFormulaires = ref(false),
	theChapter = ref(props.chapter)

</script>

<template>
	<div>
		<button
			class="fixed z-20
			bottom-5 left-0
			px-4 py-2
			text-xs
			bg-white rounded-r-full border border-gray-200 shadow"
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
				class="fixed z-20 bottom-0 left-0 w-full md:w-[400px] h-full py-3 bg-white border-gray-200 overflow-y-scroll"
			>
				<div>
					<button
						class="absolute top-0 right-0 p-3 text-gray-400"
						@click="afficherFormulaires=false"
					>
						<i class="bi bi-x-circle" />
					</button>
					<chapter-formulas
						:chapter-slug="theChapter.slug"
					/>
				</div>
			</div>
		</transition>
	</div>
</template>


