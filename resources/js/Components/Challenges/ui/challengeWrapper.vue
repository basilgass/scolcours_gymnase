<template>
	<h1 class="text-xl">
		<slot name="title" />
	</h1>

	<div v-if="$page.props.auth.can.admin">
		Démarrer une nouvelle session.
	</div>

	<div class="flex flex-col md:flex-row justify-between my-4">
		<div>Nombre de vie: {{ props.lives }}</div>
		<div>score actuel: {{ props.points }}</div>
	</div>

	<div v-bind="$attrs">
		<!-- Information (optional) -->
		<div
			v-if="$slots.information"
			class="mb-5"
		>
			<slot name="information" />
		</div>

		<!-- Question display - it's generated -->
		<div ref="questionWrapper">
			<slot name="question" />
		</div>

		<!-- Answer display -->
		<div class="min-h-[3em]">
			<slot name="answer" />
		</div>

		<!-- Answer format (static - optional) -->
		<div
			v-if="$slots.answerFormat"
			class="text-gray-400 text-xs text-center"
		>
			<div
				class="my-3 cursor-pointer"
				@click="showAnswerFormat = !showAnswerFormat"
			>
				Format des réponses
			</div>

			<transition name="slide-right">
				<div
					v-show="showAnswerFormat"
					class="pb-4"
				>
					<slot name="answerFormat" />
				</div>
			</transition>
		</div>

		<!-- Validate button TODO: Must add a "skip question" -->
		<div class="text-center pt-1 pb-5">
			<button
				class="btn btn-success w-64"
				@click="emits('validate')"
			>
				Valider
			</button>
		</div>

		<!-- Inputs, usually a keyboard TODO: ability to add default keyboard without using a slot -->
		<div>
			<slot name="inputs" />
		</div>

		<!-- Display the results already given -->
		<div>
			<h3
				v-show="props.results.length>0"
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
							v-for="(item, index) in props.results"
							:key="`result-${index}`"
						>
							<span
								v-if="item.ascii===true"
								v-katex.ascii.display.inline="item.tex"
								:class="{'text-green-600': item.correct, 'text-red-600': !item.correct}"
							/>
							<span
								v-else
								v-katex.display.inline="item.tex"
								:class="{'text-green-600': item.correct, 'text-red-600': !item.correct}"
							/>
						</div>
					</div>
				</Panel>
			</transition>
		</div>
	</div>
</template>

<script setup>
/*------------------------
The wrapper should handle
- counting points
- counting lives
- communicate with server to store results.

The component should handle.
- generating question
- validating answer
*/
import Panel from "@/Components/Ui/Panel"
import {inject, ref} from "vue"

const emits = defineEmits(["validate", "reset"])

const props = defineProps({
	points: {type: Number, default: 0},
	results: {type: Array, default: ()=>[]},
	lives: {type: Number, default: 3}
})

let challenge = inject("challenge")

let currentLife = ref(props.life),
	currentPoints = ref(0),
	maxPoints = ref(0),
	results = ref([])


function shake() {
	questionWrapper.value.style.setProperty("animation-name", "v-shake-horizontal")
	questionWrapper.value.style.setProperty("animation-duration", "500ms")

	setTimeout(() => {
		questionWrapper.value.style.setProperty("animation-name", "")
	}, 500)

}

let showResults = ref(false),
	showAnswerFormat = ref(false),
	questionWrapper = ref(null)

function validateAnswer(){
	props.validate()
}

defineExpose({shake})
</script>{
