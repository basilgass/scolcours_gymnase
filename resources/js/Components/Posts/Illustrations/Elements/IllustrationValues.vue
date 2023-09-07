<!--<info>
parameters: min:max:step,[rounded:2]

code: [f(x)=]function (multiple line possible)
</info>-->
<template>
	<div
		class="overflow-x-auto relative"
		:class="`scrollbar-scolcours-${$page.props.theme.slug}`"
	>
		<table class="border-collapse border border-slate-300">
			<tr class="bg-gray-100 font-semibold border-b border-slate-300">
				<td
					v-katex="'x'"
					class="border-r border-slate-300 px-4"
				/>
				<td
					v-for="(x, index) in tableX"
					:key="`x-${index}`"
					v-katex="x"
					class="border-r border-slate-300"
				/>
			</tr>
			<tr
				v-for="fx in tableFunctions"
				:key="fx.name"
			>
				<td
					v-katex="fx.name"
					class="border-r border-slate-300 px-4"
				/>
				<td
					v-for="(y, index) in fx.values"
					:key="`${fx.name}-${index}`"
					v-katex="y.fx"
					class="border-r border-slate-300 px-2"
				/>
			</tr>
		</table>
	</div>
</template>

<script setup>
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import {Polynom} from "pimath/esm/maths/algebra/polynom"
import {numberCorrection} from "pidraw/esm/Calculus"

let props = defineProps({
		illustration: { type: Object, required: true },
	}),
	params = ref(props.illustration.parameters.split(",")),
	code = ref(props.illustration.code),
	roundedTo = computed(() => {
		for (let param of params.value) {
			if (param.startsWith("rounded:")) {
				let [tmp, rounded] = param.split(":")
				return +rounded
			}
		}
		return 0
	}),
	tableParameters = computed(() => {
		let min = 0,
			max = 10,
			step = 1
		// get the min:max:step
		for (let param of params.value) {
			// must be numeric
			if (isNaN(param[0]) && param[0] !== "-") {
				continue
			}
			// it should be numbers
			[min, max, step] = param.split(":")

			if (min === undefined || min === "") {
				min = 0
			}
			if (max === undefined || max === "" || +max <= min) {
				max = min + 10
			}
			if (step === undefined || +step < 0) {
				step = (max - min) / 10
			}
			if ((max - min) / step > 100) {
				step = (max - min) / 20
			}
		}

		return { min: +min, max: +max, step: +step }
	}),
	tableX = computed(() => {
		let arr = []
		for (
			let x = tableParameters.value.min;
			x <= tableParameters.value.max;
			x += tableParameters.value.step
		) {
			arr.push(x)
		}
		return arr
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

			let numExp
			if (roundedTo.value > 0) {
				numExp = new PiMath.NumExp(exp)
			} else {
				numExp = new PiMath.Polynom(exp)
			}

			let values = []
			for (
				let x = tableParameters.value.min;
				x <= tableParameters.value.max;
				x += tableParameters.value.step
			) {
				if (numExp instanceof Polynom) {
					let v = numExp.evaluate(x)
					values.push({
						x,
						fx: v.tex,
					})
				} else {
					let v = numExp.evaluate({ x: x })
					values.push({
						x,
						fx: numberCorrection(v, 0, 0, roundedTo.value),
					})
				}
			}
			return { name, values }
		})
	})
</script>
