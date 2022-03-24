<template>
	<article>
		<challenge-title :title="title" />
		<div>score actuel: {{ modelProp.modelValue }}</div>
		<div v-katex="displayQuestion" />
		<div v-katex="displayAnswer" />

		<div class="text-center">
			<button
				class="btn btn-success"
				@click="validateAnswer"
			>
				Valider
			</button>
		</div>

		<div class="grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5">
			<div
				v-show="crtLetter!=='r'"
				v-katex.inline="`${crtLetter}^2`"
				class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2 col-span-2"
				@click="updateAnswer(0)"
			/>
			<div
				:class="{'col-span-2':crtLetter==='r'}"
				class="space-y-2"
			>
				<div
					v-for="n in 10"
					:key="`terme-${n}`"
					v-katex.inline="crtLetter==='r'?`${n}`:`(${crtLetter}-${n})^2`"
					class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2"
					@click="updateAnswer(n)"
				/>
			</div>
			<div
				v-show="crtLetter!=='r'"
				class="space-y-2"
			>
				<div
					v-for="n in 10"
					:key="`terme--${n}`"
					v-katex.inline="crtLetter==='r'?`${n}`:`(${crtLetter}+${n})^2`"
					class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2"
					@click="updateAnswer(-n)"
				/>
			</div>
		</div>
	</article>
</template>

<script setup>
import {computed, ref} from "vue"
import ChallengeTitle from "@/Components/Challenges/ui/challengeTitle"
import {PiMath} from "pimath/esm"

const title = "cercle"

let answer = ref({x: null, y: null, r: null}),
	question = ref(newQuestion()),
	crtLetter = ref("x")

let displayAnswer = computed(() => {
	let tex = ""

	if (answer.value.x !== null) {
		if (+answer.value.x === 0) {
			tex += "x^2"
		} else {
			tex += `(x${answer.value.x < 0 ? "+" : ""}${-answer.value.x})^2`
		}
	}
	tex += "+"
	if (answer.value.y != null) {
		if (+answer.value.y === 0) {
			tex += "y^2"
		} else {
			tex += `(y${answer.value.y < 0 ? "+" : ""}${-answer.value.y})^2`
		}
	}
	tex += "="

	if (answer.value.r !== null) {
		tex += answer.value.r
	}

	return tex
})
let displayQuestion = computed(() => {
	return question.value.tex
})

function newQuestion() {
	let ca = PiMath.Random.numberSym(10, true),
		cb = PiMath.Random.numberSym(10, true),
		r = PiMath.Random.number(1, 10)

	let Px = new PiMath.Polynom(`x${ca <= 0 ? "+" : ""}${-ca}`).pow(2),
		Py = new PiMath.Polynom(`y${cb <= 0 ? "+" : ""}${-cb}`).pow(2)

	return {
		ca, cb, r,
		tex: Px.clone().add(Py).add(new PiMath.Polynom(`${-(r)}`)).reorder("y").reorder("x").tex + "=0"
	}
}

function resetAsnwer() {
	answer.value.x = null
	answer.value.y = null
	answer.value.r = null
	crtLetter.value = "x"
}

function updateAnswer(value) {
	answer.value[crtLetter.value] = value

	if (crtLetter.value === "x") {
		crtLetter.value = "y"
	} else if (crtLetter.value === "y") {
		crtLetter.value = "r"
	} else {
		crtLetter.value = "x"
	}
}

function checkAnswer() {
	return question.value.ca === answer.value.x
		&&
		question.value.cb === answer.value.y
		&&
		question.value.r === answer.value.r
}


// Shared data for all challenges components.
const emit = defineEmits(["update:modelValue"])
const modelProp = defineProps({
	modelValue: {type: Number, default: 0},
})

function validateAnswer() {
	if (checkAnswer()) {
		resetAsnwer()
		question.value = newQuestion()
		emit("update:modelValue", modelProp.modelValue + 1)
	} else {
		emit("update:modelValue", 0)
	}
}
</script>
