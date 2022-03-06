<template>
	<div class="flex justify-between flex-col sm:flex-row sm:items-end">
		<div>
			<h2 class="text-xl font-semibold">
				A savoir
			</h2>
			<div class="text-sm text-gray-700">
				<slot />
			</div>
		</div>
		<div class="text-sm text-gray-500">
			Cliquer pour afficher la <span v-text="showAnswer?'prochaine question':'réponse'" />
		</div>
	</div>
	<Panel>
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
					<div v-katex.left.clear="generatedQuestions[questionNo].question + '\\ = \\ '" />
					<transition name="slide-right">
						<div
							v-if="showAnswer"
							v-katex.left.clear="generatedQuestions[questionNo].answer"
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

<!--	<div-->
<!--		v-for="item in generatedQuestions"-->
<!--		:key="item.question"-->
<!--	>-->
<!--		<span v-katex="`${item.question} = ${ item.answer }`" />-->
<!--	</div>-->
</template>

<script setup>
import {ref} from 'vue'
import Panel from '@/Components/Ui/Panel'
import {usePage} from '@inertiajs/inertia-vue3'

const props = defineProps({
	questions: Function
})

let downloadGenerating = ref(false),
	generatedQuestions = ref([]),
	questionNo = ref(0),
	showAnswer = ref(false),
	showFinished = ref(false)

generatedQuestions.value = props.questions(true)

function nextQuestion () {
	if (showFinished.value) {return }
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

function generatePDF () {
	downloadGenerating.value = true
	let questions = []
	for (let q of props.questions(true)) {
		questions.push({
			question: q.question,
			answer: q.answer
		})
	}

	axios.post(
		'/latex',
		{
			questions,
			theme: usePage().props.value.theme.slug,
			slug: usePage().props.value.chapter.slug,
			title: usePage().props.value.chapter.title
		}
	).then(res => {
		downloadGenerating.value = false
		document.location = '/download/' + res.data
	}).catch(
		err => {console.error(err.response)}
	)
}
</script>
