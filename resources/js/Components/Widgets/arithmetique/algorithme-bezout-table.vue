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

	const arr: euclideType[] = []
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

const bezout = computed<(string | number)[][]>(() => {

	// Table header
	const header: (number | string)[] = [...euclide.value.map(x => x.a), euclide.value[euclide.value.length - 1].b, 'a - b\\cdot x']

	const arr: number[][] = []
	const algo: euclideType[] = [...euclide.value].reverse()

	const row = algo.shift()
	let u = 1
	let v: number = -row.q

	let posX = header.length - 1
	let posB = posX - 1
	let posA = posB - 1

	let brow: number[] = Array(header.length).fill(null)
	brow[posX] = algo[0].q
	brow[posA] = u
	brow[posB] = v
	arr.push(brow)

	while (algo.length > 0) {
		const row = algo.shift()

		u = brow[posB]
		v = brow[posA] - brow[posB] * row.q

		brow = Array(header.length).fill(null)
		posA--
		posB--
		brow[posX] = algo[0]?.q ?? null
		brow[posA] = u
		brow[posB] = v
		arr.push(brow)
	}

	return [header, ...arr]
})

console.table(bezout.value)


</script>

<template>
	<div>
		<div v-if="isOK && bezout">
			<div class="flex flex-col">
				<div class="flex border-b">
					<div
						v-for="(item, index) in bezout[0]"
						:key="`row-${0}-${index}`"
						v-katex.nomargin="item"
						class="flex-1 last:border-l py-1"
					/>
				</div>

				<div
					v-for="(row, rowIndex) in bezout.slice(1)"
					:key="`row-${rowIndex}`"
					class="flex"
				>
					<div
						v-for="(item, index) in row"
						:key="`row-${rowIndex}-${index}`"
						v-katex.nomargin="item"
						class="flex-1 last:border-l py-1"
					/>
				</div>
			</div>
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
