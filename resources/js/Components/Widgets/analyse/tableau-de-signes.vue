<!--<info>
parameters: name=<nom>(x),min[imal],extreme=3|4|5<br/>
code: rational fraction ou <zero>@<signs>@<croissance>@<extremes>
</info>-->
<script lang="ts" setup>
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import TableOfSigns from "@/Components/Pi/TableOfSigns.vue"
import { TABLE_OF_SIGNS_VALUES } from "pimath"
import { computed } from "vue"
// Paramètres
//      - name=<nom>(x)          permet de déterminer le nom de la fonction
//      - min[imal]         n'afficher que la dernière ligne
//      - extrema=3|4|5     liste des coord y des extremes pour l'affichage des coordonnées
// Deux modes pour code
// 1.   PiMath.Rational
// 2.   <zero>@<signs>@<croissance>@<extremes>

const props = defineProps({
	illustration: { type: Object, required: true }
})
const params = computed(() => props.illustration.parameters)
const code = computed(() => props.illustration.code)


const config = computed(() => {
	return props.illustration.parameters.split(",")
})

// Function name
const fnName = computed(() => {
	const name = config.value.filter(x => x.startsWith("name=")).map(x => x.split("name=")[1])
	return name.length === 1 ? name[0] : "f(x)"
})

// Show (or not) the factors.
const minimal = computed(() => {
	if (code.value.includes("@")) {
		return true
	}

	return !!(config.value.includes("minimal") || config.value.includes("min"))
})

// Define the extremes values if given.
// const extremes = computed(() => {
// 	const extremes = config.value.filter(x => x.startsWith("extrema=")).map(x => x.split("extrema=")[1])
//
// 	if (extremes.length === 1) {
// 		return extremes[0].split("|")
// 	}
// 	return null
// })

// Define the way the table of signs is generated.
const use_Pi_table_of_signs = computed(() => {
	return !code.value.includes("@")
})

const custom_table_of_signs = computed<{
	roots: string[],
	signs: TABLE_OF_SIGNS_VALUES[],
	result: string[],
	extremes: string[]
}>(() => {
	const [roots, signs, result, extremes] = code.value.split("@")

	return {
		roots: roots.split(","),
		signs: signs.split(",") as TABLE_OF_SIGNS_VALUES[],
		result: result.split(","),
		extremes: extremes.split(",")
	}
	// return makeStudyFromCode(code.value, code.value.split("@").length === 4, true)
})
// const tableOfSigns = computed(() => {
// 	if (code.value.includes("@")) {
// 		// Building manually
// 		return makeStudyFromCode(code.value, code.value.split("@").length === 4, true)
// 	}
//
// 	const [num, den] = code.value.split("/"),
// 		p = new PolyFactor().fromPolynom(num, den)
//
// 	const study = p.study("signs" + (params.value ? ("," + params.value) : ""))
// 	if (config.value.includes("dx")) {
// 		return study.derivative
// 	} else {
// 		return study.signs
// 	}
// })

</script>

<template>
	<pi-table-of-signs
		v-if="use_Pi_table_of_signs"
		:fx="code"
		:label="fnName"
		:minimal="minimal"
		class="max-w-lg mx-auto"
	/>
	<table-of-signs
		:label="fnName"
		:roots="custom_table_of_signs.roots"
		:signs="custom_table_of_signs.signs"
		:result="custom_table_of_signs.result"
		:extremes="custom_table_of_signs.extremes"
	/>
</template>
