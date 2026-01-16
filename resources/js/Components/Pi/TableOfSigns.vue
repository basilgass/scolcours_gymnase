<script lang="ts" setup>

import TableOfSignsExtremesLine from "@/Components/Pi/Parts/TableOfSignsExtremesLine.vue"
import TableOfSignsFactorRow from "@/Components/Pi/Parts/TableOfSignsFactorRow.vue"
import TableOfSignsHeader from "@/Components/Pi/Parts/TableOfSignsHeader.vue"
import TableOfSignsResultLine from "@/Components/Pi/Parts/TableOfSignsResultLine.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import {type TABLE_OF_SIGNS_VALUES} from "pimath"
import {computed} from "vue"

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
	texOutput?: boolean,
	size?: 'xs' | 'sm'
}

const props = withDefaults(defineProps<TableOfSignsType>(), {
	mode: "signs",
	label: "f(x)",
	previousLabel: null,
	factors: () => [],
	extremes: null,
	texOutput: false,
	resultLine: null,
	size: null
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

	if (tosMode.value === 'grows') {
		return `${functionName}'(x)`
	}

	if (tosMode.value === 'curves') {
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
	if (tosMode.value === 'signs') {
		return `\\begin{tikzpicture}
\\tkzTabInit[lgt=2,espcl=1.2]
{/1,${props.factors.map(x => `\\(${x.label}\\)/1`).join(",")},/.1,\\(${props.label}\\)/1}
{\\footnotesize \\(-\\infty\\), ${props.roots.map(x => `\\(${x}\\)`).join(",")}, \\footnotesize \\(+\\infty\\)}
${props.factors.map(x => `\\tkzTabLine{ ,${x.signs.join(",")} }\n`)}
${props.factors.length > 0 ? "\\tkzTabLine{}" : ""}
\\tkzTabLine{,${props.signs.join(",")}}
\\end{tikzpicture}`
	}

	if (tosMode.value === 'grows') {
		return ""
	}

	if (tosMode.value === 'curves') {
		return ""
	}

	// Never !
	return `le mode n'a pas pu être détecté correctement: ${tosMode.value}`
})

export interface TOS_TABLE_OF_SIGNS {
	name: string,
	text: string,
	infty: string,
	root: string,
	row: {
		first: string, // middle + infty et -ml-<infty>
		middle: string,
		last: string
	},
	header: string,
	mr: string,
	ml: string
}

const columnSizes = computed<TOS_TABLE_OF_SIGNS>(() => {
	if (props.size === 'xs') {
		return {
			name: 'xs',
			text: 'text-sm',
			infty: 'w-3',
			root: 'w-12',
			mr: '-mr-3',
			ml: '-ml-3',
			row: {
				first: 'w-9 -mr-3',
				middle: 'w-12 -ml-3 -mr-3',
				last: 'w-9 -ml-3'
			},
			header: 'w-25',
		}
	}

	if (props.size === 'sm') {
		return {
			name: 'sm',
			text: 'text-sm',
			infty: 'w-4',
			root: 'w-16',
			mr: '-mr-3',
			ml: '-ml-3',
			row: {
				first: 'w-12 -mr-4',
				middle: 'w-16 -ml-4 -mr-4',
				last: 'w-12 -ml-4'
			},
			header: 'w-25'
		}
	}

	return {
		name: 'base',
		text: 'text-base',
		infty: 'w-6',
		root: 'w-24',
		mr: '-mr-3',
		ml: '-ml-3',
		row: {
			first: 'w-18 -mr-6',
			middle: 'w-24 -ml-6 -mr-6',
			last: 'w-18 -ml-6'
		},
		header: 'w-25'
	}
})

</script>
<template>
	<div class="table-of-sign-wrapper">
		<div class="not-prose overflow-x-auto pb-3">
			<table class="border-r tos border-gray-400">
				<table-of-signs-header
					:roots="roots"
					:sizes="columnSizes"
				/>

				<tbody v-if="factors.length>0">
					<table-of-signs-factor-row
						v-for="(factor, index) of factors"
						:key="`tos-${index}`"
						:label="factor.label"
						:roots="roots"
						:signs="factor.signs"
						:sizes="columnSizes"
					/>
				</tbody>

				<tfoot class="border-t-2 border-gray-400">
					<table-of-signs-factor-row
						v-if="tosMode!=='signs'"
						:label="computedPreviousLabel"
						:roots="roots"
						:signs="signs"
						:sizes="columnSizes"
					/>

					<table-of-signs-result-line
						v-if="tosMode!=='signs'"
						:label="label"
						:mode="tosMode"
						:roots="roots"
						:signs="computedGrows"
						:sizes="columnSizes"
					/>

					<table-of-signs-extremes-line
						v-if="tosMode!=='signs' && extremes!==null"
						:extremes="extremes"
						:roots="roots"
						:sizes="columnSizes"
					/>

					<table-of-signs-factor-row
						v-if="tosMode==='signs'"
						:label="label"
						:roots="roots"
						:signs="signs"
						:sizes="columnSizes"
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
