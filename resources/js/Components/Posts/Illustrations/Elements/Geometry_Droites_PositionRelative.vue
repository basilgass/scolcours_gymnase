<!--<info>
parameters: empty

code: empty
</info>-->
<template>
	<div class="stepper-wrapper">
		<div v-katex="sequence.results.tex.equ1" />
		<div v-katex="sequence.results.tex.equ2" />

		<div>
			Calculer les vecteurs directeurs
			<div v-katex="sequence.results.equ1.d.tex" />
			<div v-katex="sequence.results.equ2.d.tex" />

			Les vecteurs directeurs sont-ils colinéaires ?
			<div v-html="sequence.results.equ1.d.isColinearTo(sequence.results.equ2.d)" />

			Les vecteurs directeurs sont-ils normaux ?
			<div v-html="sequence.results.equ1.d.isNormalTo(sequence.results.equ2.d)" />

			<div v-katex="sequence.results.equ2.n.tex" />
			<div v-katex="sequence.results.equ2.n.tex" />

			Les vecteurs normaux sont-ils colinéaires ?
			<div v-html="sequence.results.equ1.n.isColinearTo(sequence.results.equ2.n)" />

			Les vecteurs normaux sont-ils normaux ?
			<div v-html="sequence.results.equ1.n.isNormalTo(sequence.results.equ2.n)" />

			{{ sequence.results.mode }}
		</div>
	</div>
</template>
<script setup>
import {reactive, ref} from "vue"
import {PiMath} from "pimath/esm"

let props = defineProps({
		illustration: {type: Object, required: true}
	}),
	params = ref(props.illustration.parameters),
	code = ref(props.illustration.code)

let random = ref(1),
	displayEquation = function (equ) {
		equ.reduceBeforeDisplay = false
		let mode = PiMath.Random.number(1, 5), tex
		if (mode === 1) {
			tex = equ.tex.canonical
		} else if (mode === 2) {
			tex = equ.tex.parametric
		} else if (mode === 3) {
			tex = equ.tex.equation
		} else if (mode === 4) {
			tex = equ.tex.mxh
		} else if (mode === 5) {
			tex = equ.tex.system
		}
		return tex
	},
	stepper = () => {
		let mode = PiMath.Random.number(1, 4),
			equ1 = PiMath.Random.Geometry.line(),
			equ2,
			B,
			tex

		// Mode = 1 => confondue
		// mode = 2 => parallèle
		// mode = 3 => perpendiculaire
		// mode = 4 => sécante

		let k = PiMath.Random.numberSym(3, false)
		while (k === 1) {
			k = PiMath.Random.numberSym(3, false)
		}

		if (mode === 1) {
			B = equ1.randomPoint()
			equ2 = new PiMath.Geometry.Line(B, equ1.d.clone().multiplyByScalar(k))
		}

		if (mode === 2) {
			B = equ1.randomNearPoint()
			equ2 = new PiMath.Geometry.Line(B, equ1.d.clone().multiplyByScalar(k))
		}

		if (mode === 3) {
			B = PiMath.Random.Geometry.point()
			equ2 = new PiMath.Geometry.Line(B, equ1.n.clone().multiplyByScalar(k))
		}

		if (mode === 4) {
			equ2 = PiMath.Random.Geometry.line()
			while (equ2.isParallelTo(equ1) || equ2.isPerpendicularTo(equ1)) {
				equ2 = PiMath.Random.Geometry.line()
			}
		}

		tex = {equ1: displayEquation(equ1), equ2: displayEquation(equ2)}

		return {
			mode,
			equ1,
			equ2,
			tex
		}
	}


let sequence = reactive({
	results: stepper()
})
sequence["step-1"] = {
	body: "On commence par calculer les vecteurs...",
	choice: [
		{
			body: "normaux",
			goto: "step-2"
		},
		{
			body: "directeurs",
			goto: "step-3"
		}
	],
	keyboard: null
}
sequence["step-2"] = {
	body: "\\[\\vect{n_1}=$a \\text{ et } \\vect{n_2}=$b\\]",
	choice: null,
	keyboard: {
		name: null,
		parameter: "vector,co",
		goto: "step-4"
	}
}
sequence["step-3"] = {
	body: "\\[\\vect{d_1}=$a \\text{ et } \\vect{d_2}=$b\\]",
	choice: null,
	keyboard: {
		name: null,
		parameter: "vector,co",
		goto: "step-5"
	}
}
sequence["step-4"] = {
	body: "Les vecteurs \\(\\vect{n_1}=$n1\\) et \\(\\vect{n_2}=$n2\\) sont-ils colinéaires ?",
	choice: [
		{body: "oui", goto: "step-6"},
		{body: "non", goto: "step-7"}
	],
	keyboard: null
}
sequence["step-5"] = {
	body: "Les vecteurs \\(\\vect{d_1}=$d1\\) et \\(\\vect{d_2}=$d2\\) sont-ils colinéaires ?",
	choice: [
		{body: "oui", goto: "step-8"},
		{body: "non", goto: "step-9"}
	],
	keyboard: null
}
</script>
