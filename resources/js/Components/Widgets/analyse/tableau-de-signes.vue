<!--<info>
parameters: name=<nom>(x),min[imal],extreme=3|4|5<br/>
code: rational fraction ou <zero>@<signs>@<croissance>@<extremes>
</info>-->
<script lang="ts" setup>
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import TableOfSigns, {TABLE_OF_SIGNS_VALUES_WITH_EXTREMES} from "@/Components/Pi/TableOfSigns.vue"
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {TABLE_OF_SIGNS_VALUES} from "pimath"
import {computed} from "vue"
// Paramètres
//      - name=<nom>(x)          permet de déterminer le nom de la fonction
//      - min[imal]         n'afficher que la dernière ligne
//      - extrema=3|4|5     liste des coord y des extremes pour l'affichage des coordonnées
// Deux modes pour code
// 1.   PiMath.Rational
// 2.   <zero>@<signs>@<croissance>@<extremes>

// TODO: améliorer avec les options : croissance (dx) ou courbure (ddx)

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const params = computed(() => props.illustration.parameters)
const code = computed(() => props.illustration.code)


const config = computed(() => {
	return props.illustration.parameters?.split(",") ?? []
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

const mode = computed<"signs" | "grows" | "curves">(() => {
	if (config.value.some(x => x === 'dx')) return 'grows'
	if (config.value.some(x => x === 'ddx')) return 'curves'

	return 'signs'
})

const size = computed(() => {
	if (config.value.includes('xs')) return 'xs'
	if (config.value.includes('sm')) return 'sm'
	if (config.value.includes('base')) return 'base'

	return null
})

// Define the way the table of signs is generated.
const use_Pi_table_of_signs = computed(() => {
	return !code.value.includes("@")
})

const custom_table_of_signs = computed<{
	roots: string[],
	signs: TABLE_OF_SIGNS_VALUES[],
	result: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[],
	extremes: string[]
}>(() => {
	const [roots, signs, result, extremes] = code.value.split("@")

	return {
		roots: roots.split(","),
		signs: signs?.split("") as TABLE_OF_SIGNS_VALUES[] ?? undefined,
		result: (result?.split("") as TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[]) ?? undefined,
		extremes: extremes?.split(",") ?? []
	}
})

</script>

<template>
	<pi-table-of-signs
		v-if="use_Pi_table_of_signs"
		:fx="code"
		:label="fnName"
		:minimal="minimal"
		:mode
	/>
	<table-of-signs
		v-else
		:label="fnName"
		:mode="'auto'"
		:roots="custom_table_of_signs.roots"
		:signs="custom_table_of_signs.signs"
		:result-line="custom_table_of_signs.result"
		:extremes="custom_table_of_signs.extremes"
		:size
	/>
</template>
