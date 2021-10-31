<template>
	<Panel>
		<header class="underline font-semibold">
			{{ exercise.title }}
		</header>
		<section>
			{{ exercise.body }}
		</section>

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
		</footer>
	</Panel>
</template>
<script>
	import Panel from "@/Components/Ui/Panel"

	export default {
		name: "Exercise",
		components: {Panel},
		props: {
			exercise: {type: Object, default: ()=>{}}
		},
		data() {
			return {
				showAnswer: false
			}
		}
	}

</script>
