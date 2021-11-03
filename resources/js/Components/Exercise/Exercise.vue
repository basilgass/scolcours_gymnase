<template>
	<Panel>
		<header class="underline font-semibold">
			{{ exercise.title }}
		</header>
		<section>
			{{ exercise.body }}
		</section>

		<div
				v-if="exercise.illustrations.length>0"
				class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
			>
			<img
					v-for="illustration of exercise.illustrations"
					:key="`illustration_${illustration.id}`"
					:src="'/storage/'+illustration.url"
					alt="illustration"
				>
		</div>

		<hr class="text-gray-200 my-2">
		<footer>
			<button
					class="mr-2 hover:underline"
					@click="showAnswer=!showAnswer"
				>
				Réponse
			</button>
			<transition name="slide-right">
				<span
						v-show="showAnswer"
						class="inline-block"
					>
					{{ exercise.answer }}
				</span>
			</transition>
			<div
					v-if="exercise.explanation!==null"
					class="mt-2 min-h-[3rem]"
				>
				<h3
						class="font-semibold"
						@click="showExplanation=!showExplanation"
					>
					développement / explication
				</h3>
				<transition name="collapse-from-top">
					<div
							v-show="showExplanation"
						>
						{{ exercise.explanation }}
					</div>
				</transition>
			</div>
		</footer>
	</Panel>
</template>
<script setup>
	import Panel from "@/Components/Ui/Panel"
	import {onMounted, ref} from "vue"

	const props = defineProps({
		exercise: {type: Object, default: ()=>{}}
	})

	let showAnswer = ref(false),
		showExplanation = ref(false)

	onMounted(()=>{
		console.log(props.exercise)
	})
</script>
