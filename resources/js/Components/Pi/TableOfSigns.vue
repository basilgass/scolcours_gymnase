<script lang="ts" setup>

import TableOfSignsExtremesLine from "@/Components/Pi/Parts/TableOfSignsExtremesLine.vue"
import TableOfSignsFactorRow from "@/Components/Pi/Parts/TableOfSignsFactorRow.vue"
import TableOfSignsHeader from "@/Components/Pi/Parts/TableOfSignsHeader.vue"
import TableOfSignsResultLine from "@/Components/Pi/Parts/TableOfSignsResultLine.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import {type TABLE_OF_SIGNS_VALUES} from "pimath"
import {computed, onMounted} from "vue"

// TODO: extremeType should be in pimath, with TABLE_OF_SIGNS_VALUES
export type TABLE_OF_SIGNS_VALUES_WITH_EXTREMES = TABLE_OF_SIGNS_VALUES | "m" | "M" | "_" | "I"

interface TableOfSignsType {
	roots: string[],
	signs: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[],
	mode?: "auto" | "signs" | "grows" | "curves"
	label?: string,
	previousLabel?: string,
	factors?: { label: string, signs: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[] }[],
	extremes?: string[],
	resultLine?: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[],
	texOutput?: boolean
}

const props = withDefaults(defineProps<TableOfSignsType>(), {
	mode: "signs",
	label: "f(x)",
	previousLabel: null,
	factors: () => [],
	extremes: null,
	texOutput: false,
	resultLine: null
})

const tosMode = computed<'signs' | 'grows' | 'curves'>(() => {
	if (props.mode !== 'auto') {
		return props.mode
	}

	if (props.resultLine === null) {
		return 'signs'
	}

	if (props.resultLine.includes('u') ||
		props.resultLine.includes('n') ||
		props.resultLine.includes('I')) {
		return 'curves'
	}

	return 'grows'
})

const computedPreviousLabel = computed(() => {
	if (props.previousLabel) {
		return props.previousLabel
	}

	const functionName = props.label.split("(")[0]
	if (props.mode === 'grows') {
		return `${functionName}'(x)`
	}
	if (props.mode === 'curves') {
		return `${functionName}''(x)`
	}

	return `${functionName}(x)`
})

const computedGrows = computed(() => {
	if (props.resultLine !== null) {
		return props.resultLine
	}


	const signs = [...props.signs]
	for (let i = 1; i < signs.length - 1; i++) {
		if (signs[i] === "z") {
			if (signs[i - 1] === "-" && signs[i + 1] === "+") {
				signs[i] = "m" // min
			} else if (signs[i - 1] === "+" && signs[i + 1] === "-") {
				signs[i] = "M" // max
			} else if (signs[i - 1] === signs[i + 1]) {
				signs[i] = "_" // replat
			}
		}
	}

	return signs
})

const LaTeX_output = computed(() => {
	if (!props.texOutput) {
		return ""
	}

	// TODO: the tex output doesn't handle grows and curves extra lines !
	return `\\begin{tikzpicture}
\\tkzTabInit[lgt=2,espcl=1.2]
{/1,${props.factors.map(x => `\\(${x.label}\\)/1`).join(",")},/.1,\\(${props.label}\\)/1}
{\\footnotesize \\(-\\infty\\), ${props.roots.map(x => `\\(${x}\\)`).join(",")}, \\footnotesize \\(+\\infty\\)}
${props.factors.map(x => `\\tkzTabLine{ ,${x.signs.join(",")} }\n`)}
${props.factors.length > 0 ? "\\tkzTabLine{}" : ""}
\\tkzTabLine{,${props.signs.join(",")}}
\\end{tikzpicture}`
})
</script>
<template>
	<div class="table-of-sign-wrapper">
		<div class="not-prose">
			<table class="border-r tos border-gray-400 mx-auto">
				<table-of-signs-header :roots="roots" />

				<tbody v-if="factors.length>0">
					<table-of-signs-factor-row
						v-for="(factor, index) of factors"
						:key="`tos-${index}`"
						:label="factor.label"
						:roots="roots"
						:signs="factor.signs"
					/>
				</tbody>

				<tfoot class="border-t-2 border-gray-400">
					<table-of-signs-factor-row
						v-if="tosMode!=='signs'"
						:label="computedPreviousLabel"
						:roots="roots"
						:signs="signs"
					/>

					<table-of-signs-result-line
						v-if="tosMode!=='signs'"
						:label="label"
						:mode="tosMode"
						:roots="roots"
						:signs="computedGrows"
					/>

					<table-of-signs-extremes-line
						v-if="tosMode!=='signs' && extremes!==null"
						:extremes="extremes"
						:roots="roots"
					/>

					<table-of-signs-factor-row
						v-if="tosMode==='signs'"
						:label="label"
						:roots="roots"
						:signs="signs"
					/>
				</tfoot>
			</table>
		</div>
		<tex-code
			v-if="texOutput"
			:tex="LaTeX_output"
		/>
	</div>
</template>
