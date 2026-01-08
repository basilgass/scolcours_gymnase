<!--<info>
parameters: euclide (afficher l'algo d'Euclide en parallèle),details
code: a,b
</info>-->
<script setup lang="ts">


import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

export interface BezoutType {
	bezout: { a: number, b: number, u: number, v: number },
	pgcd: number,
	euclide: { a: number, b: number, q: number, r: number }[]
}

const emits = defineEmits<{
	'updated': [e: BezoutType]
}>()

const details = computed(() => {
	return props.illustration.parameters.includes('details')
})
const withEuclide = computed(() => {
	return props.illustration.parameters.includes('euclide')
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

	arr.pop()
	return arr
})

interface euclideType {
	a: number,
	b: number,
	q: number,
	r: number
}

function rowTex(a, u, b, v): string {

	return `${a}\\cdot ${u}-${b}\\cdot${v}`
}

function euclideTex(row: euclideType): string {
	return `${row.a}-${row.b}\\cdot ${row.q}`
}

const bezout = computed(() => {
	if (euclide.value.length === 0) return false
	const arr: euclideType[] = [...euclide.value].reverse()
	const tex = []

	const row = arr.shift()

	let a: number = row.a
	let b: number = row.b
	let u = 1
	let v: number = row.q

	tex.push(`${euclideTex(row)}`)

	while (arr.length > 0) {
		const row = arr.shift()

		if (row.r === a) {
			// si détails
			if (details.value) {
				tex.push(`\\big(${euclideTex(row)}\\big)\\cdot${u}-${b}\\cdot${v}`)
			}

			// Affichage version réduite.
			a = row.a
			v = v + row.q * u
		} else {
			// si détails
			if (details.value) {
				tex.push(`${a}\\cdot ${u}-\\big(${euclideTex(row)}\\big)\\cdot${v}`)
			}

			// Affichage version réduite.
			u = u + row.q * v
			b = row.a
		}

		tex.push(rowTex(a, u, b, v))

	}

	const r = euclide.value[euclide.value.length - 1].r

	emits('updated', {
		bezout: {a, u, b, v: -v},
		pgcd: r,
		euclide: euclide.value
	})
	return {
		tex: `\\def\\arraystretch{1.5}\\begin{aligned}${tex.map(x => `${x} &= ${r}`).join('\\\\')}\\end{aligned}`,
		a, b, u, v,
		final: `${a}\\cdot ${u} + ${b} \\cdot ( ${-v} ) = ${r}`
	}
})

const TeX = computed(() => {
	return `\\def\\arraystretch{1.5}
\\begin{aligned}
	${euclide.value
		.map((row) => `${row.a} &=& ${row.b} \\cdot ${row.q} &+ ${row.r} `)
		.join('\\\\')}
\\end{aligned}`
})


</script>

<template>
	<div>
		<div v-if="isOK && bezout">
			<div
				v-if="withEuclide"
				v-katex.boxed="TeX"
			/>
			<div v-katex.boxed="bezout.tex" />
			<div v-katex.boxed="bezout.final" />
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
