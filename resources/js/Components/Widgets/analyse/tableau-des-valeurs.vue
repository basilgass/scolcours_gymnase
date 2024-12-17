<!--<info>
parameters:
min:max:step ou 3,5,8,9
options: [rounded:2],[col:width],[table:class]

code: [f(x)=]function (multiple line possible)
</info>-->
<script
	lang="ts"
	setup
>
import { WidgetInterface } from "@/types/modelInterfaces.ts"
import { Fraction, NumExp, Polynom } from "pimath"
import { computed } from "vue"

const props = defineProps<{
	illustration: WidgetInterface
}>()

const	params = computed(() => props.illustration.parameters.split(",")),
	code = computed(() => props.illustration.code),
	roundedTo = computed(() => {
		for (let param of params.value) {
			if (param.startsWith("rounded:")) {
				let [, rounded] = param.split(":")
				return +rounded
			}
		}
		return 0
	}),
	tableClass = computed(() => {
		for (let param of params.value) {
			if (param.startsWith("table:")) {
				let [, w] = param.split(":")
				return w
			}
		}
		return "auto"
	}),
	colWidth = computed(() => {
		for (let param of params.value) {
			if (param.startsWith("col:")) {
				let [, w] = param.split(":")
				return w
			}
		}
		return "auto"
	}),
	rowHeight = computed(() => {
		for (let param of params.value) {
			if (param.startsWith("row:")) {
				let [, h] = param.split(":")
				return h
			}
		}
		return "auto"
	}),
	tableX = computed(() => {
		const availableValues = params.value.filter(param => !param.match(/^[a-z]+:/))

		if (availableValues[0].includes(":")) {
			return parseMinMaxStep(params.value[0])
		}

		return availableValues.map(x => +x)
	}),
	tableFunctions = computed(() => {
		// return [
		// 		{name=string, values=[]},
		// 		{name=string, values=[]},
		// ]
		return code.value.split("\n").map((fx) => {
			let f = fx.trim(),
				name,
				exp

			if (f.includes("=")) {
				[name, exp] = f.split("=")
			} else {
				name = exp = f
			}

			let numExp: NumExp | Polynom
			if (roundedTo.value > 0) {
				numExp = new NumExp(exp)
			} else {
				numExp = new Polynom(exp)
			}

			let values = []
			for (let x in tableX.value) {
				if (Object.hasOwn(numExp, "_monoms")) {
					let v: Fraction = (numExp as Polynom).evaluate(+x) as Fraction
					values.push({
						x,
						fx: v.tex
					})
				} else {
					let v = (numExp as NumExp).evaluate({ x: +x })
					values.push({
						x,
						fx: +v.toFixed(roundedTo.value)
					})
				}
			}
			return { name, values }
		})
	})

function parseMinMaxStep(value: string): number[] {
	// Output array.
	let arr = []

	// value = min:max:step
	let [min, max, step] = value.split(":").map(x => +x)

	if (min === undefined) {
		min = 0
	}
	if (max === undefined || +max <= min) {
		max = min + 10
	}
	if (step === undefined || +step < 0) {
		step = (max - min) / 10
	}
	if ((max - min) / step > 100) {
		step = (max - min) / 20
	}

	// Build the output array.
	for (
		let x = min;
		x <= max;
		x += step
	) {
		arr.push(+x.toFixed(roundedTo.value))
	}

	return arr
}
</script>

<template>
	<div
		class="overflow-x-auto relative scrollbar-scolcours"
	>
		<table
			:class="tableClass"
			class="border-collapse border border-slate-300"
		>
			<tr class="bg-gray-100 font-semibold border-b border-slate-300">
				<td
					v-katex="'x'"
					class="border-r border-slate-300 px-4"
				/>
				<td
					v-for="(x, index) in tableX"
					:key="`x-${index}`"
					v-katex="x"
					:style="`width: ${colWidth}`"
					class="border-r border-slate-300"
				/>
			</tr>
			<tr
				v-for="(fx, line) in tableFunctions"
				:key="fx.name"
				:style="`height: ${rowHeight}`"
			>
				<td
					v-katex="fx.name"
					:class="line > 0 ? 'border-t' : ''"
					class="border-r border-slate-300 px-4"
				/>
				<td
					v-for="(y, index) in fx.values"
					:key="`${fx.name}-${index}`"
					v-katex="y.fx"
					:class="line > 0 ? 'border-t' : ''"
					class="border-r border-slate-300 px-2"
				/>
			</tr>
		</table>
	</div>
</template>
