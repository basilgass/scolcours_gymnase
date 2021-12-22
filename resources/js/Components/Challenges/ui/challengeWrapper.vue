<template>
	<h1 class="text-xl">
		{{ title }}
	</h1>
	
	<div>score actuel: {{ points }}</div>
	
	<slot name="information" />
	<slot name="question" />
	<slot name="answer" />
	
	<div class="text-center py-5">
		<button
				class="btn btn-success w-64"
				@click="validateAnswer"
			>
			Valider
		</button>
	</div>
	
	<slot name="inputs" />
	
	
	<h3
			v-show="results.length>0"
			class="max-w-2xl mx-auto text-center cursor-pointer font-semibold mt-10 mb-2"
			@click="showResults=!showResults"
		>
		Afficher les résultats
	</h3>
	<transition name="slide-left">
		<Panel
				v-show="showResults"
				class="result-wrapper text-center max-w-2xl mx-auto"
			>
			<div class="space-y-2">
				<div
						v-for="(item, index) in results"
						:key="`result-${index}`"
					>
					<span
							v-katex.display.inline="item.tex"
							:class="{'text-green-600': item.correct, 'text-red-600': !item.correct}"
						/>
					<span
							v-katex.ascii.display.inline="item.ascii"
							:class="{'text-green-600': item.correct, 'text-red-600': !item.correct}"
						/>
				</div>
			</div>
		</Panel>
	</transition>
</template>

<script setup>
import Panel from '@/Components/Ui/Panel'
import { ref } from 'vue'

defineProps({
	title: String,
	points: Number
})

let results = ref([]),
	showResults = ref(false)
</script>