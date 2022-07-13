<template>
	<section
		ref="root"
		class="katex-boxed"
	>
		<!-- User input -->
		<div class="max-w-md mx-auto pb-6 pt-2 px-10 border border-gray-400 rounded-xl mb-6">
			<form-input
				v-model="fx"
				name="fx"
				label="fonction rationnelle"
				@keyup.enter="updateStudy"
			/>
			<div class="text-sm">
				Entrer la fonction en utilisant <code>/</code> pour la division. Il n'est pas nécessaire d'englober le
				numérateur ou le dénominateur dans des parenthèses supplémentaires.
			</div>
			<div v-katex.display="fxAsTex" />
		</div>

		<function-study
			:fx="doWithThisFx"
		/>
	</section>
</template>

<script setup>
/** Chapter
 * title: étude de signe
 * body: étude de signe d'une fonction rationnelle.
 */
import {computed, onMounted, ref} from "vue"
import FormInput from "@/Components/Form/FormInput"
import FunctionStudy from "@/Components/Tools/etude-de-signe"

let root = ref(null),
	fx = ref("(3x-4)(2x+5)/(x-4)(x+4)"),
	doWithThisFx = ref("")

function updateStudy() {
	doWithThisFx.value = fx.value
}

onMounted(() => {
	updateStudy()
})

let fxAsTex = computed(() => {
	let numden = fx.value.split("/")

	if (numden.length === 1) {
		return fx.value
	} else {
		return `\\frac{ ${numden[0]} }{ ${numden[1]} }`
	}
})

</script>
