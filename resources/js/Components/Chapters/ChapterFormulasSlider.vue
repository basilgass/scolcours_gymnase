<template>
	<div>
		<button
			class="fixed bottom-5 left-0 bg-white rounded-r-full px-4 py-2 text-xs border border-gray-200 shadow"
			@click="afficherFormulaires=!afficherFormulaires"
		>
			formulaire
		</button>
		<transition name="fade">
			<div
				v-if="afficherFormulaires"
				class="fixed inset-0 bg-gray-800/60"
				@click.self="afficherFormulaires=false"
			/>
		</transition>
		<transition name="slide-fade">
			<div
				v-if="afficherFormulaires"
				class="bg-white fixed bottom-0 left-0 w-full md:w-[400px] h-full border-gray-200 py-3"
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

<script setup>
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import {ref} from "vue"

let props = defineProps({
		chapter: {type: Object, required: true}
	}),
	afficherFormulaires = ref(false),
	theChapter = ref(props.chapter)

</script>


