<script lang="ts" setup>

import TableOfSignsFactorRow from "@/Components/Pi/Parts/TableOfSignsFactorRow.vue"
import TableOfSignsHeader from "@/Components/Pi/Parts/TableOfSignsHeader.vue"
import TableOfSignsGrow from "@/Components/Pi/Parts/TableOfSignsResultLine.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import { type TABLE_OF_SIGNS_VALUES } from "pimath"
import { computed } from "vue"

interface TableOfSignsType {
	roots: string[],
	signs: TABLE_OF_SIGNS_VALUES[],
	mode?: "signs" | "grows" | "curves"
	label?: string,
	previousLabel?: string,
	factors?: { label: string, signs: TABLE_OF_SIGNS_VALUES[] }[],
	extremes?: string[],
	resultLine?: TABLE_OF_SIGNS_VALUES[],
	texOutput?: boolean
}

const props = withDefaults(defineProps<TableOfSignsType>(), {
	mode: "signs",
	label: "f(x)",
	previousLabel: "f'(x)",
	factors: () => [],
	extremes: () => [],
	texOutput: false,
	resultLine: () => []
})

const tos_mode = computed(() => {
	if (props.resultLine.length === 0) {
		return props.mode
	}

	if (props.resultLine.filter(x => x === "+" || x === "-").length > 0) {
		return "grows"
	}
	if (props.resultLine.filter(x => x === "u" || x === "n").length > 0) {
		return "curves"
	}

	return "signs"
})
const computedGrows = computed(() => {
	if (props.resultLine.length > 0) {
		return props.resultLine
	}
	return props.signs
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
			<table
				class="border-r tos border-gray-400 mx-auto"
			>
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
						v-if="tos_mode!=='signs'"
						:label="previousLabel"
						:roots="roots"
						:signs="signs"
					/>

					<table-of-signs-grow
						v-if="tos_mode!=='signs'"
						:extremes="extremes"
						:label="label"
						:mode="tos_mode"
						:roots="roots"
						:signs="computedGrows"
					/>

					<table-of-signs-factor-row
						v-if="tos_mode==='signs'"
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
