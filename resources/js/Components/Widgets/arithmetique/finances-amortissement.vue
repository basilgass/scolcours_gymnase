<!--<info>
parameters:
code: A=MONTANT
i=INTERETS
n=DUREE (ANNEE)
p=DECOUPAGE (optionnel): A, S, T, M, H, nombre
</info>-->
<script setup lang="ts">
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"

const editMode = useStoreEditMode()
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

const showMarkdown = ref<boolean>(false)
const toMarkdown = computed(() => {
	if (!isValid.value) return ''

	const header = `| an | solde | intérets \\( \\scriptsize ${TVM.value.i * 100} \\% \\) | annuités | amortissement |`
	const separator = '|:---:|---:|---:|---:|---:|'

	const rows = amortissements.value.map(row =>
		`| \\(${row[0]}\\) | \\(${row[1].toFixed(DIGITS)}\\) | \\(${row[2].toFixed(DIGITS)}\\) | \\(${row[3].toFixed(DIGITS)}\\) | \\(${row[4].toFixed(DIGITS)}\\) |`
	)

	const footer = `| \\(\\sum\\) | | \\(${sums.value.interets}\\) | \\(${sums.value.annuites}\\) | \\(${sums.value.amortissement}\\) |`

	return [header, separator, ...rows, footer].join('\n')
})

const showTex = ref<boolean>(false)
const toTex = computed(() => {
	if (!isValid.value) return ''

	const header =
		'\\(' +
		['n', '\\text{solde}', `\\text{intérêts} ( \\( \\scriptsize ${TVM.value.i * 100} \\% \\) )`, '\\text{annuités}', '\\text{amortissement}'].join('\\)&\\(') +
		'\\)\\\\ \n'

	const rows = amortissements.value.map(row =>
		[
			row[0],
			row[1].toFixed(DIGITS),
			row[2].toFixed(DIGITS),
			row[3].toFixed(DIGITS),
			row[4].toFixed(DIGITS),
		].join(' & ')
	)

	const footer =
		['\\(\\sum\\)', '', sums.value.interets, sums.value.annuites, sums.value.amortissement].join(' & ') + ' \n'

	return (
		'\\begin{tblr}{ colspec={| c | *{4}{X[r]|} }, hlines, row{1}={lightgray}, row{Z}={lightgray} }\n' +
		header +
		'\\hline\n' +
		rows.join('\\\\ \n') +
		'\\\\ \\hline \n' +
		footer +
		'\\end{tblr}'
	)
})

</script>

<template>
	<article>
		<div v-if="isValid">
			<div
				class="prose
		prose-strong:text-inherit
		prose-table:my-0
		dark:prose-invert
		lg:prose-lg
		max-w-full
		item overflow-x-auto"
			>
				<table>
					<colgroup>
						<col class="w-10">
						<col>
						<col>
						<col>
						<col>
					</colgroup>
					<thead>
						<tr>
							<th class="cell center">
								an
							</th>
							<th class="cell">
								solde
							</th>
							<th class="cell">
								intérets <span v-katex="`\\scriptsize(${TVM.i*100} \\%)`" />
							</th>
							<th class="cell">
								annuités
							</th>
							<th class="cell">
								amortissement
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="row in amortissements"
							:key="row[0]"
						>
							<td class="cell center">
								<span v-katex="row[0]" />
							</td>
							<td class="cell">
								<span v-katex="row[1].toFixed(DIGITS)" />
							</td>
							<td class="cell">
								<span v-katex="row[2].toFixed(DIGITS)" />
							</td>
							<td class="cell">
								<span v-katex="row[3].toFixed(DIGITS)" />
							</td>
							<td class="cell">
								<span v-katex="row[4].toFixed(DIGITS)" />
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr class="text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700">
							<td class="cell py-1! center">
								<span v-katex.inline="'\\scriptsize\\sum'" />
							</td>
							<td class="cell py-1!" />
							<td class="cell py-1!">
								<span v-katex.inline="sums.interets" />
							</td>
							<td class="cell py-1!">
								<span v-katex.inline="sums.annuites" />
							</td>
							<td class="cell py-1!">
								<span v-katex.inline="sums.amortissement" />
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
		<div
			v-else
			class="font-code text-red-500 bg-red-50 border border-red-500 rounded p-2"
		>
			{{ TVM }}
		</div>

		<div
			v-admin="editMode.enable && isValid"
			class="flex flex-col gap-5"
		>
			<div class="flex gap-3 justify-end font-code text-xs">
				<span
					class="cursor-pointer"
					@click="showTex=!showTex"
				>TeX</span>
				<span
					class="cursor-pointer"
					@click="showMarkdown=!showMarkdown"
				>md</span>
			</div>
			<pre
				v-if="showTex"
				class="border rounded bg-gray-200 text-gray-600 text-xs p-2"
			>{{ toTex }}</pre>

			<pre
				v-if="showMarkdown"
				class="border rounded bg-gray-200 text-gray-600 text-xs p-2"
			>{{ toMarkdown }}</pre>
		</div>
	</article>
</template>

<style scoped>
.cell {
	text-align: right;
	white-space: nowrap;
}

.center {
	text-align: center;
}
</style>
