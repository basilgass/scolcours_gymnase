<template>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
		<slot name="illustration" />
		<div>
			<slot />

			<h3 class="mt-8 mb-4 font-semibold">
				Marche à suivre
			</h3>
			<ol class="list-decimal list-space space-y-4">
				<li
					v-for="(item, index) of props.steps"
					:key="`step-title-${index}`"
					class="katex-boxed"
				>
					{{ item.title }}
				</li>
			</ol>
		</div>

		<div class="lg:col-span-2">
			<div class="flex items-center mt-8 mb-4 space-x-10">
				<h3 class="font-semibold">
					Résolution
				</h3>
				<button
					v-show="solutions<props.steps.length"
					class="btn px-2 py-1"
					@click="solutions++"
				>
					Etape suivante
				</button>
			</div>

			<ol class="list-decimal list-space space-y-4">
				<li
					v-for="(item, index) of props.steps"
					v-show="solutions>index"
					:key="`step-${index}`"
					class="katex-boxed katex-left"
				>
					{{ item.body }}
				</li>
			</ol>
		</div>
	</div>
</template>

<script setup>
import {ref} from "vue"

let solutions = ref(0)
const props = defineProps({
	steps: { type: Array, default: () => [] }
})

</script>
