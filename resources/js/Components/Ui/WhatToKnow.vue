<!--
Génération de questions à imprimer
TODO: a retravailler de A à Z
-->
<template>
	<div class="mx-auto">
		<div>
			<h2 class="text-xl font-semibold">
				A savoir
			</h2>
			<div class="text-sm text-gray-700">
				<slot />
			</div>
		</div>
		<Panel v-if="generatedQuestions.length>0">
			<div
				class="flex md:items-center min-h-[160px] md:min-h-[80px] select-none px-10  cursor-pointer"
				@click="nextQuestion()"
			>
				<transition
					name="fade"
					mode="out-in"
				>
					<div
						v-if="!showFinished"
						class="flex items-center flex-col sm:flex-row"
					>
						<div v-katex.left.clear="generatedQuestions[questionNo].question + sep" />
						<transition name="slide-right">
							<div
								v-if="showAnswer"
								v-katex.left.clear="preAnswerSep + generatedQuestions[questionNo].answer"
							/>
						</transition>
					</div>
					<div v-else>
						Terminé !
						<button
							class="btn"
							@click="showFinished=false"
						>
							Recommencer (aléatoire)
						</button>
					</div>
				</transition>
			</div>

			<div class="text-gray-300 text-sm flex justify-between">
				<div>
					{{ questionNo + 1 }} / {{ generatedQuestions.length }}
				</div>

				<button
					class="btn py-0"
					:disabled="downloadGenerating"
					@click="generatePDF"
				>
					{{ downloadGenerating ? 'Patienter...' : 'Générer PDF' }}
				</button>
			</div>
		</Panel>
		<div class="text-xs text-gray-400 italic">
			Cliquer pour afficher la <span v-text="showAnswer?'prochaine question':'réponse'" />
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import Panel from "@/Components/Ui/Panel"
import {usePage} from "@inertiajs/inertia-vue3"

const props = defineProps({
	questions: Function,
	sep: {type: String, default: "\ =\ "},
	preAnswerSep: {type: String, default: ""},
	title: {type: String, default: usePage().props.value.chapter.title},
	slug: {type: String, default: usePage().props.value.chapter.slug}
})

let downloadGenerating = ref(false),
	generatedQuestions = ref([]),
	questionNo = ref(0),
	showAnswer = ref(false),
	showFinished = ref(false)

function nextQuestion() {
	if (showFinished.value) {
		return
	}
	showAnswer.value = !showAnswer.value

	// It's a new question
	if (!showAnswer.value) {
		if (generatedQuestions.value.length - 1 === questionNo.value) {
			showFinished.value = true
			generatedQuestions.value = props.questions(true)
			questionNo.value = 0
		} else {
			questionNo.value++
		}
	}
}

function generatePDF() {
	downloadGenerating.value = true
	let questions = []
	for (let q of props.questions(true)) {
		questions.push({
			question: q.question,
			answer: q.answer
		})
	}

	axios.post(
		"/latex",
		{
			questions,
			theme: usePage().props.value.theme.slug,
			slug: props.slug,
			title: props.title
		}
	).then(res => {
		downloadGenerating.value = false
		document.location = "/download/" + res.data
	}).catch(
		err => {
			console.error(err.response)
		}
	)
}

onMounted(()=>{
	generatedQuestions.value = props.questions(true)
})

</script>
