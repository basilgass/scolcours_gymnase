<!--<info>
parameters:
min:max:step ou 3,5,8,9
options: [digits:2],[col:width],[table:class],[oo<detection infini>]
code: [f(x)=]function (multiple line possible)
</info>-->
<script
	lang="ts"
	setup
>
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {Fraction, NumExp, Polynom} from "pimath"
import {computed} from "vue"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const params = computed(() => props.illustration.parameters.split(",")),
	code = computed(() => props.illustration.code),
	roundedTo = computed(() => {
		for (let param of params.value) {
			if (param.startsWith("digits:")) {
				let [, rounded] = param.split(":")
				return +rounded
			}
		}
		return 0
	}),
	detectInfinite = computed(() => {
		return params.value.includes('oo')
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
			for (let x of tableX.value) {
				if (numExp instanceof Polynom) {
					let v: Fraction = (numExp as Polynom).evaluate(+x) as Fraction
					values.push({
						x: nbToString(x),
						fx: v.tex
					})
				} else {
					const ev: number = (numExp as NumExp).evaluate({x: +x})
					let v: string
					if (isNaN(ev)) {
						v = `\\varnothing`
					} else if (!Number.isFinite(ev)) {
						// On recherche juste avant et juste après pour déterminer le signe de l'infini.
						const evBefore = (numExp as NumExp).evaluate({x: +x - 0.01})
						const evAfter = (numExp as NumExp).evaluate({x: +x + 0.01})

						if (detectInfinite.value) {
							if (evAfter > 0) {
								v = evBefore > 0 ? '+\\infty' : '\\pm\\infty'
							} else {
								v = evBefore > 0 ? '\\mp\\infty' : '-\\infty'
							}
						} else {
							v = '\\varnothing'
						}
						// v = detectInfinite.value ? (ev < 0 ? '-\\infty' : '+\\infty') : '\\varnothing'
					} else {
						v = ev.toFixed(roundedTo.value)
					}
					values.push({
						x: nbToString(x),
						fx: v
					})
				}
			}

			return {name, values}
		})
	})

function nbToString(value: number, digits?: number, separator = {thousands: '\\ ', digits: '\\ '}): string {
	// transforme un nombre 12345678.123456 en texte "12 345 678.123 45"
	if (!isFinite(value)) return String(value)

	const sign = value < 0 ? '-' : ''
	const abs = Math.abs(value)

	// Détermine le nombre à afficher (nombre de décimales)
	const raw = digits === undefined ? String(abs) : abs.toFixed(digits)
	const [intPartRaw, fracRaw = ''] = raw.split('.')

	const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, separator.thousands)
	const fracGroups = fracRaw.match(/.{1,3}/g) || []
	const fracPart = fracGroups.join(separator.digits)

	return fracPart ? `${sign}${intPart}.${fracPart}` : `${sign}${intPart}`
}

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
					v-for="(value, index) in tableFunctions[0].values"
					:key="`x-${index}`"
					v-katex="value.x"
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
