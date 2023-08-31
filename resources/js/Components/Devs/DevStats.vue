<template>
	<!-- Title -->
	<div ref="root">
		<form-textarea
			v-model="rawValues"
			:row="20"
			label="data, séparé par une virgule"
			name="keyboard"
		/>
	</div>

	<div
		v-if="values.length>0"
		class="flex flex-col gap-3"
	>
		<div>Taille: {{ values.length }}</div>
		<div>Moyenne: {{ statsAverage }}</div>
		<div>Médiane: {{ statsMedian }}</div>
		<div>1er quartile (25%): {{ statsQuantile25 }}</div>
		<div>3ème quartile (75%): {{ statsQuantile75 }}</div>
	</div>

	<div>{{ uniqueValues }}</div>
	<div>
		<markdown-it
			:text="frequencyMd"
			class="max-w-md mx-auto"
		/>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import {computed, onMounted, ref} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {PiMath} from "pimath/esm"

let rawValues = ref(""),
	numberOfSamples = ref(0),
	values = computed(() => {
		let arr = []
		for(let i=0; i<numberOfSamples.value; i++){
			arr.push(
				PiMath.Random.number(1,20)+
					PiMath.Random.number(1,20)+
					PiMath.Random.number(1,20)
			)
		}
		arr.sort((a, b) => a - b)

		return arr
	}),
	uniqueValues = computed(() => {
		return [...new Set(values.value)]
	}),
	frequencyArray = computed(() => {
		let arr = [],
			n = values.value.length,
			facc = 0,
			dacc = 1
		for (let v of uniqueValues.value) {
			const c = values.value.filter(x => x === v).length

			facc += c / n

			arr.push({
				value: v,
				count: c,
				frequency: c / n,
				accumulate: facc,
				deaccumulate: dacc
			})

			dacc -= c / n
		}

		return arr
	}),
	frequencyMd = computed(() => {
		let md = "| \\(x_i\\)| \\(l_i\\) | \\(f_i\\)|\\(F_i\\)|\\(\\overline{F_i}\\)| \n|---|----|----|----|----|\n"

		for (let v of frequencyArray.value) {
			md += `| ${v.value} | ${v.count} | \\(${+(v.frequency * 100).toFixed(2)}\\%\\) | \\(${+(v.accumulate * 100).toFixed(2)}\\%\\) | \\(${+(v.deaccumulate * 100).toFixed(2)}\\%\\) |\n`
		}

		return md
	})

let statsAverage = computed(() => {
		const sum = values.value.reduce((acc, adding) => acc + adding, 0)
		return sum / values.value.length
	}),
	statsMedian = computed(() => {
		const half = Math.floor(values.value.length / 2)

		// Median:
		// if nb of value is odd: half value
		if (values.value.length % 2) {
			return values.value[half]
		}

		// if nb of value is even: make the average value of both central
		return (values.value[half - 1] + values.value[half]) / 2
	}),
	statsQuantile25 = computed(() => {
		return quantileSorted(values.value, 0.25)
	}),
	statsQuantile75 = computed(() => {
		return quantileSorted(values.value, 0.75)
	})


function quantileSorted(sorted, p, fnValueFrom) {
	//Credit D3: https://github.com/d3/d3-array/blob/master/LICENSE
	var n = sorted.length
	if (!n) {
		return
	}

	fnValueFrom =
		Object.prototype.toString.call(fnValueFrom) === "[object Function]"
			? fnValueFrom
			: function (x) {
				return x
			}

	p = +p

	// Cas particuliers
	if (p <= 0 || n < 2) {
		return +fnValueFrom(sorted[0], 0, sorted)
	}

	if (p >= 1) {
		return +fnValueFrom(sorted[n - 1], n - 1, sorted)
	}

	// Dans les autres cas (dit normaux)
	var i = (n - 1) * p,
		i0 = Math.floor(i),
		value0 = +fnValueFrom(sorted[i0], i0, sorted),
		value1 = +fnValueFrom(sorted[i0 + 1], i0 + 1, sorted)
	return value0 + (value1 - value0) * (i - i0)
}

onMounted(()=>{
	numberOfSamples.value = 1000
})
</script>

