<!--
Affichage d'un tableau de signes ou de croissance.
// TODO: Refactor the footer.
-->
<script lang="ts" setup>
import TableOfSigns from "@/Components/Pi/TableOfSigns.vue"
import {Point, PolyFactor, type POLYFACTOR_TABLE_OF_SIGNS, type TABLE_OF_SIGNS} from "pimath"
import {computed} from "vue"


export interface PiTableOfSignsPropsType {
	fx: string,
	label?: string,
	previousLabel?: string,
	minimal?: boolean,
	texOutput?: boolean,
	mode?: "signs" | "grows" | "curves"
}

const props = withDefaults(defineProps<PiTableOfSignsPropsType>(), {
	label: "f(x)",
	previousLabel: "",
	minimal: false,
	mode: "signs",
	texOutput: false
})

const emits = defineEmits(['update'])

const computedPreviousLabel = computed(() => {
	if (props.previousLabel !== "") {
		return props.previousLabel
	}

	const [name, ...items] = props.label.split("(")
	return `${name}HELLO${items.join("(")}`
})

const tos = computed(() => {
	let fn: PolyFactor
	try {
		fn = createPolyFactor()
	} catch (e) {
		console.log(e)
		throw new Error("La chaîne de caractères donnée n'est pas un polynôme valide")
	}

	const dfn = props.mode !== 'signs' ? fn.clone().derivative() : null
	const ddfn = props.mode === 'curves' && dfn !== undefined ? dfn.clone().derivative() : null

	emits('update', {
		fx: fn.asRoot.tex,
		dx: dfn ? dfn.asRoot.tex : "",
		ddx: ddfn ? ddfn.asRoot.tex : ""
	})

	let table_of_signs: POLYFACTOR_TABLE_OF_SIGNS
	switch (props.mode) {
		case 'signs':
			table_of_signs = fn.tableOfSigns()
			break
		case 'grows':
			table_of_signs = dfn.tableOfSigns()
			break
		case 'curves':
			table_of_signs = ddfn.tableOfSigns()
			break
	}

	return {
		roots: table_of_signs.roots.map(x => x.tex),
		signs: table_of_signs.signs,
		factors: props.minimal ? [] : getFactors(table_of_signs),
		extremes: getExtremes(fn, table_of_signs)
	}

})

function createPolyFactor() {
	// TODO: much more robust splitter !
	const [num, den] = props.fx.split("/")

	if (den === undefined) {
		return new PolyFactor().fromPolynom(props.fx).factorize()
	}

	// TODO: non nécessaire d'ajouter factorize() une fois la mise à jour de PiMath faite !
	return new PolyFactor().fromPolynom(num, den).factorize()
}

function getFactors(tos: POLYFACTOR_TABLE_OF_SIGNS) {
	const arr = tos.factors

	arr.sort((a, b) => {
		return b.factor.degree().value - a.factor.degree().value
	})


	return arr.map(x => {
		return {
			label: x.factor.power.value > 0 ? x.factor.tex : x.factor.clone().inverse().tex,
			signs: x.signs
		}
	})
}

function getExtremes(fn: PolyFactor, tos: TABLE_OF_SIGNS) {
	return tos.roots.map((root, index) => {
		if (tos.signs[2 * index + 1] !== "z") {
			return ""
		}
		return new Point(
			root.value,
			fn.evaluate(root.value)
		).tex
	})
}

</script>
<template>
	<table-of-signs
		:factors="tos.factors"
		:label="label"
		:mode="mode"
		:previous-label="computedPreviousLabel"
		:roots="tos.roots"
		:signs="tos.signs"
		:extremes="tos.extremes"
		:tex-output="texOutput"
		class="mb-10"
	/>
</template>
