<template>
	<article>
		<challenge-title :title="title" />

		<div>score actuel: {{ points }}</div>
		<div v-katex="poly.tex" />
		<div v-katex="displayAnswer" />

		<div class="grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5">
			<button
				class="btn btn-primary"
				@click="resetAnswer"
			>
				recommencer
			</button>

			<button
				class="btn btn-success"
				@click="validateAnswer"
			>
				valider
			</button>
		</div>

		<div class="grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5">
			<div class="space-y-2">
				<div
					v-for="n in 10"
					:key="`terme-${n}`"
					v-katex.inline="`-${n}`"
					class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2"
					@click="updateAnswer(`-${n}`)"
				/>
			</div>
			<div class="space-y-2">
				<div
					v-for="n in 10"
					:key="`terme--${n}`"
					v-katex.inline="`+${n}`"
					class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2"
					@click="updateAnswer(`+${n}`)"
				/>
			</div>
		</div>
	</article>
</template>

<script setup>
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm";

// Valeur nécessaire pour nommer la fonction
const title = "quadratique - la forme du sommet"

// Le programme...
let answer = ref({
		a: "a",
		b: "-\\alpha",
		c: "+\\beta"
	}),
	currentGivenAnswer = ref("a"),
	points = ref(0),
	level = ref(5),
	poly = ref(newQuestion())

let displayAnswer = computed(() => {
	let texA, texB, texC

	if(answer.value.a === "+1"){
		texA = ""
	}else if(answer.value.a === "-1"){
		texA = "-"
	}else{
		texA = isNaN(answer.value.a)?answer.value.a:+answer.value.a
	}
	texA = currentGivenAnswer.value==="a"?`\\colorbox{Lime}{$ ${texA} $}`:texA

	texB = currentGivenAnswer.value==="b"?`\\colorbox{Lime}{$${answer.value.b}$}`:answer.value.b

	texC = currentGivenAnswer.value==="c"?`\\colorbox{Lime}{$${answer.value.c}$}`:answer.value.c

	return `${texA}(x${texB})^2${texC}`
})

function newQuestion () {
	resetAnswer()

	let ra = points.value >= level.value ? PiMath.Random.numberSym(6, false) : 1,
		rb = PiMath.Random.numberSym(6, false),
		rc = PiMath.Random.numberSym(10, false)

	return new PiMath.Polynom("x", ra, 2 * rb * ra, rb * rb * ra + rc)
}

function resetAnswer( ){
	answer.value = { a: "a", b: "-\\alpha", c: "+\\beta" }
	currentGivenAnswer.value = "a"

	if(points.value < level.value){
		answer.value.a = "+1"
		currentGivenAnswer.value = "b"
	}
}
function updateAnswer (value) {
	answer.value[currentGivenAnswer.value] = value

	if (currentGivenAnswer.value === undefined) {
		resetAnswer()
		// updateAnswer(value)
	} else {
		currentGivenAnswer.value = ["a", "b", "c"][(["a", "b", "c"].indexOf(currentGivenAnswer.value) + 1)%3]
		if(points.value<level.value && currentGivenAnswer.value==="a"){
			currentGivenAnswer.value = "b"
		}
	}
}

function validateAnswer () {

	let ra = +answer.value.a,
		rb = +answer.value.b,
		rc = +answer.value.c
	let P = new PiMath.Polynom("x", ra, 2 * rb * ra, rb * rb * ra + rc)

	if (P.isEqual(poly.value)) {
		points.value++
		answer.value = { a: "", b: "", c: "" }
		currentGivenAnswer.value = "a"

		// Generate new polynom
		poly.value = newQuestion()
	} else {
		points.value = 0
	}

}
</script>
