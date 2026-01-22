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
	size?: 'xs' | 'sm' | 'base'
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

export interface TABLE_OF_SIGNS_COLUMNS_SIZES {
	name: string,
	text: string,
	infty: {
		width: string,
		mr: string,
		ml: string
	},
	root: string,
	row: {
		first: string, // middle + infty et -ml-<infty>
		middle: string,
		last: string
	},
	header: string,

}

const calculatedSize = computed(() => {
	if (props.size) return props.size

	// auto calcul de la taille
	if (props.roots.length <= 2) return 'base'
	if (props.roots.length <= 3) return 'sm'

	return 'xs'
})
const columnSizes = computed<TABLE_OF_SIGNS_COLUMNS_SIZES>(() => {
	if (calculatedSize.value === 'xs') {
		return {
			name: 'xs',
			text: 'text-sm',
			infty: {
				width: 'w-3',
				mr: '-mr-3',
				ml: '-ml-3',
			},
			root: 'w-12',
			row: {
				first: 'w-9 -mr-3',
				middle: 'w-12 -ml-3 -mr-3',
				last: 'w-9 -ml-3'
			},
			header: 'w-25',
		}
	}

	if (calculatedSize.value === 'sm') {
		return {
			name: 'sm',
			text: 'text-sm',
			infty: {
				width: 'w-4',
				mr: '-mr-3',
				ml: '-ml-3',
			},
			root: 'w-16',
			row: {
				first: 'w-12 -mr-4',
				middle: 'w-16 -ml-4 -mr-4',
				last: 'w-12 -ml-4'
			},
			header: 'w-25'
		}
	}

	// x = infty
	// root = 4x
	// mr = variable, utilisé pour infty => déplacer dans sous catégorie.
	// row.first = 3x, mr/ml = x
	// row.middle = 4x
	// row.last = 3x
	// header = 25, not used ?

	return {
		name: 'base',
		text: 'text-base',
		infty: {
			width: 'w-5',
			mr: '-mr-1',
			ml: '-ml-1',
		},
		root: 'w-20',
		row: {
			first: 'w-15 -mr-5',
			middle: 'w-20 -ml-5 -mr-5',
			last: 'w-15 -ml-5'
		},
		header: 'w-25'
	}
})

</script>
<template>
	<div class="table-of-sign-wrapper">
		<div class="not-prose overflow-x-auto pb-3 ">
			<table class="border-r tos border-gray-400 mx-auto">
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

			<tex-code
				v-if="texOutput"
				class="max-w-sm mx-auto mt-3"
				:tex="LaTeX_output"
			/>
		</div>
	</div>
</template>
