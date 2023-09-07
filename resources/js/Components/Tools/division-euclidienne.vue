<template>
	<Panel>
		<form-input
			v-model="numerator"
			label="numérateur"
			name="numerator"
			focus
		/>

		<form-input
			v-model="denominator"
			label="dénominateur"
			name="denominator"
		/>
		<pi-euclidian
			:fx="`${numerator}/${denominator}`"
			fundamental
			asymptote
			@update="updateEuclidian"
		/>
	</Panel>
</template>

<script setup>
/** Tools
 * title: division de polynômes
 * body: division euclidienne avec des polynômes
 * parameters: numerator=Polynom, denominator=Polynom
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {ref} from "vue"
import PiEuclidian from "@/Components/Pi/PiEuclidian.vue"

// TODO: Rework the euclidian division output as table - it's complicated :)
// TODO:  Make the display array of euclidian fraction as tex -> should be put in PiMath

let numerator = ref("3x^2-4"),
	denominator = ref("x-5")

let updateEuclidian = function(event){
	//TODO: update euclidian
	console.log(event)
}
</script>
