<template>
	<Panel
		class="max-w-md mt-4"
	>
		<div class="py-2 h-20 flex items-center">
			<div>Calculer une primitive de <span v-katex.inline.clear="`f(x)=${state.question}`" /></div>
		</div>
		<KatexEditor
			v-model="state.userAnswer"
			:correct="state.correct"
			@keypress.enter="validate"
			@validate="validate"
		/>
	</Panel>
</template>
<script setup>
import KatexEditor from "@/Components/Ui/KatexEditor"
import Panel from "@/Components/Ui/Panel"
import {onMounted, reactive} from "vue"
import {PiMath} from "pimath/esm"

let state = reactive({
	userAnswer: "",
	question: "",
	answer: "",
	correct: false
})

onMounted(() => {
	newQuestion()
})

function validate () {
	if (state.correct) {newQuestion()}
	state.correct = state.userAnswer === state.answer
}

function newQuestion () {
	const M = PiMath.Random.monom({
		letter: "x",
		degree: PiMath.Random.number(1, 8),
		fraction: true
	})

	state.userAnswer = ""
	state.question = M.tex
	state.answer = M.primitive().display
}
</script>
