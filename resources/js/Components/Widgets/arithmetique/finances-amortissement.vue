<!--<info>
parameters:
code: A=MONTANT
i=INTERETS
n=DUREE (ANNEE)
p=DECOUPAGE (optionnel): A, S, T, M, H, nombre
</info>-->
<script setup lang="ts">
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

type periodsType = 'A' | 'S' | 'T' | 'M' | 'H' | number

interface TVMType {
	A: number,
	i: number,
	n: number,
	R: number,
	p: periodsType
}

const periods = ['A', 'S', 'T', 'M', 'H']
const DIGITS = 2

const parameters = computed(() => props.illustration.parameters)
const TVM = computed<TVMType>(() => {
	let A = undefined
	let i = undefined
	let n = undefined
	let p: periodsType = 'A'
	let R = undefined

	props.illustration.code.split('\n').forEach((line => {
		const [key, value] = line.split('=')
		if (key === 'A') {
			if (!isNaN(+value) && +value > 0) A = +value
		} else if (key === 'i') {
			if (!isNaN(+value) && +value > 0) i = +value
		} else if (key === 'n') {
			if (Number.isSafeInteger(+value) && +value > 0) n = +value
		} else if (key === 'p') {
			if (periods.includes(value.toUpperCase())) {
				p = value.toUpperCase() as periodsType
			} else if (Number.isSafeInteger(+value) && +value > 0) {
				p = +value
			}
		}
	}))

	if (A && i && n && p) {
		const periods = periodsCount(p)
		i /= periods
		n *= periods

		R = +(A * i / (1 - Math.pow((1 + i), -n))).toFixed(DIGITS)
	}

	return {A, i, n, p, R}
})


function periodsCount(p: periodsType) {
	if (!isNaN(+p)) return +p

	if (p === 'S') return 2
	if (p === 'T') return 4
	if (p === 'M') return 12
	if (p === 'H') return 52

	return 1
}

const amortissements = computed<[number, number, number, number, number][]>(() => {
	if (!isValid.value) return

	const arr: [number, number, number, number, number][] = []
	let an = 1
	let solde = TVM.value.A
	let interets = +(solde * TVM.value.i).toFixed(DIGITS)
	let annuites = TVM.value.R
	let amortissement = +(annuites - interets).toFixed(DIGITS)

	while (an <= TVM.value.n) {
		arr.push([an, solde, interets, annuites, amortissement])
		an++
		solde = +(solde - amortissement).toFixed(DIGITS)
		interets = +(solde * TVM.value.i).toFixed(DIGITS)
		
		if (an < TVM.value.n) {
			amortissement = +(annuites - interets).toFixed(DIGITS)
		} else {
			annuites = solde + interets
			amortissement = solde
		}
	}


	return arr
})

const sums = computed(() => {
	let interets = 0
	let annuites = 0
	let amortissement = 0

	amortissements.value.forEach(row => {
		interets += row[2]
		annuites += row[3]
		amortissement += row[4]
	})

	return {
		interets: interets.toFixed(DIGITS),
		annuites: annuites.toFixed(DIGITS),
		amortissement: amortissement.toFixed(DIGITS)
	}
})
const isValid = computed(() => {
	return TVM.value.A &&
		TVM.value.i &&
		TVM.value.n &&
		TVM.value.p &&
		TVM.value.R
})

</script>

<template>
	<article>
		<div v-if="isValid">
			<div class="overflow-x-auto">
				<div class="amort-grid">
					<div class="cell th center border-b-2 border-gray-500 dark:border-gray-400">
						an
					</div>
					<div class="cell th border-b-2 border-gray-500 dark:border-gray-400">
						solde
					</div>
					<div class="cell th border-b-2 border-gray-500 dark:border-gray-400">
						intérets
					</div>
					<div class="cell th border-b-2 border-gray-500 dark:border-gray-400">
						annuités
					</div>
					<div class="cell th border-b-2 border-gray-500 dark:border-gray-400">
						amortissement
					</div>
					<template
						v-for="(row, rowIndex) in amortissements"
						:key="row[0]"
					>
						<div
							v-for="(item, index) in row"
							:key="`${row[0]}-${index}`"
							class="cell"
							:class="{
								'center': index === 0,
								'border-t-2': rowIndex === 0,
								'border-gray-500': rowIndex === 0,
								'dark:border-gray-400': rowIndex === 0,
							}"
						>
							<span v-katex="index===0 ? item : item.toFixed(DIGITS)" />
						</div>
					</template>
					<div
						class="cell tf center text-sm bg-gray-200 dark:bg-gray-700 border-t-2 border-gray-500 dark:border-gray-400"
					>
						<span v-katex.inline="'\\scriptsize\\sum'" />
					</div>
					<div
						class="cell tf text-sm bg-gray-200 dark:bg-gray-700 border-t-2 border-gray-500 dark:border-gray-400"
					/>
					<div
						class="cell tf text-sm bg-gray-200 dark:bg-gray-700 border-t-2 border-gray-500 dark:border-gray-400"
					>
						<span v-katex.inline="sums.interets" />
					</div>
					<div
						class="cell tf text-sm bg-gray-200 dark:bg-gray-700 border-t-2 border-gray-500 dark:border-gray-400"
					>
						<span v-katex.inline="sums.annuites" />
					</div>
					<div
						class="cell tf text-sm bg-gray-200 dark:bg-gray-700 border-t-2 border-gray-500 dark:border-gray-400"
					>
						<span v-katex.inline="sums.amortissement" />
					</div>
				</div>
			</div>
		</div>
		<div
			v-else
			class="font-code text-red-500 bg-red-50 border border-red-500 rounded p-2"
		>
			{{ TVM }}
		</div>
	</article>
</template>

<style scoped>
.amort-grid {
	display: grid;
	grid-template-columns: 2.5rem repeat(4, minmax(min-content, 1fr));
}

.cell {
	text-align: right;
	border: 1px solid #ccc;
	padding: 2px 6px;
	white-space: nowrap;
}

.center {
	text-align: center;
}

.cell.th {
	font-weight: bold;
}

</style>
