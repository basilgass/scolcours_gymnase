<!--<info>
parameters: pgcd(afficher le pgcd),-1(cacher la dernière ligne)<br/>
code: a,b
</info>-->
<script setup lang="ts">


import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const showPgcd = computed(() => {
	return props.illustration.parameters.includes('pgcd')
})
const showLastLine = computed(() => {
	return !props.illustration.parameters.includes('-1')
})

const values = computed(() => {
	return props.illustration.code.split(',').map(Number)
})

const isOK = computed(() => {
	return values.value.length === 2 &&
		values.value.every(v => Number.isSafeInteger(v) && v > 0)
})

const euclide = computed(() => {
	if (!isOK.value) {
		return []
	}

	let a: number = Math.max(...values.value)
	let b: number = Math.min(...values.value)
	let q: number
	let r: number

	const arr: { a: number, b: number, q: number, r: number }[] = []
	while (r !== 0) {
		q = Math.floor(a / b)
		r = a % b

		arr.push({a, b, q, r})

		// préparation de la ligne suivante
		a = b
		b = r
	}

	return arr
})

const TeX = computed(() => {
	const arr = euclide.value
	if (!showLastLine.value) arr.pop()

	return `\\def\\arraystretch{1.5}
\\begin{aligned}
	${arr
		.map((row) => `${row.a} &=& ${row.b} \\cdot ${row.q} &+ ${row.r} `)
		.join('\\\\')}
\\end{aligned}`
})

const PGCD = computed(() => {
	return euclide.value[euclide.value.length - 2].r
})

</script>

<template>
	<div>
		<div v-if="isOK">
			<div v-katex.boxed="TeX" />

			<div
				v-if="showPgcd"
				v-katex.boxed="`\\text{pgcd}(${values[0]};${values[1]})=${PGCD}`"
			/>
		</div>
		<div
			v-else
			class="font-code text-red-500 bg-red-50"
		>
			problème dans les nombres {{ values }}
		</div>
	</div>
</template>

<style scoped>

</style>
