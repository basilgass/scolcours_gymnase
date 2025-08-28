<script lang="ts" setup>
/** Tools
 * title: statistiques
 * body: tableau statistique à distribution normale
 * parameters:
 * tags: statistique,2C
 */

import BarChart from "@/Components/Charts/barChart.vue"
import BoxPlotChart from "@/Components/Charts/boxPlotChart.vue"
import LineChart from "@/Components/Charts/lineChart.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { Chart } from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"
// TODO: apparemment, l'output TeX ne correspond pas à ce qui se trouve dans le tableau (pied du tableau)
import { computed, reactive, ref } from "vue"
import Card from "@/Components/Ui/Card.vue"

defineOptions({ layout: LayoutMain })

const showTex = ref(false)

Chart.register(annotationPlugin)
// import {Chart} from "chart.js/auto"
// Chart.defaults.font.family = "Source Code Pro"

// Configuration générale
const statConfig = reactive({
	samples: 100, // Taille de l'échantillon
	samplesExact: true, // La taille de l'échantillon doit être exact.
	min: 100, // Valeur minimale des modalités
	max: 900, // Valeur maximale des modalités
	length: 100, // Taille des classes de modalité
	skew: 1, // Paramètre pour la génération des valeurs
	flatten: 10, // Paramètre pour la génération des valeurs
	round: 3, // Arrondir les valeurs
	percent: true, // Mets les valeurs en pourcent lorsque nécessaire
	customData: [] // Valeurs données par l'utilisateur
})

const statCustomNi = ref("4 12 20 27 39 85 92 75 40")

const statRaw = computed(() => {
	if (
		isNaN(statConfig.samples) ||
		isNaN(statConfig.min) ||
		isNaN(statConfig.max) ||
		isNaN(statConfig.length) ||
		isNaN(statConfig.skew)
	) {
		return []
	}
	// Check the values.
	if (statConfig.samples < 1) {
		return []
	}
	if (statConfig.min >= statConfig.max) {
		return []
	}
	if (statConfig.length < 1) {
		return []
	}
	if (statConfig.skew <= 0.05) {
		return []
	}

	if (statConfig.customData.length === 0) {
		return statsBuildData_auto()
	}
	return statsBuildData_customData()
})

const statTable = computed(() => {
	if (statConfig.length === 1) {
		return statsBuildTable_discrete()
	}

	if (statRaw.value.length > 0) {
		return statsBuildTable_continuous()
	}

	return []
})

const statSum = computed<{
	ni: number
	fi: number
	fixi: number
	fixii: number
}>(() => {
	return statTable.value.reduce(
		(acc, value) => {
			acc.ni += value.ni
			acc.fi += value.fi
			acc.fixi += value.fixi
			acc.fixii += value.fixii
			return acc
		},
		{ ni: 0, fi: 0, fixi: 0, fixii: 0 }
	)
})

const graphLabels = computed(() => {
		return ["", ...statTable.value.map((x) => `[${x.bi};${x.bii}[`), ""]
	}),
	graphBarValues = computed(() => {
		return [0, ...statTable.value.map((x) => x.ni), 0]
	}),
	graphDataset = computed(() => {
		return [
			{
				type: "line",
				data: graphBarValues.value,
				borderColor: "rgb(75, 192, 192)"
			},
			{
				barPercentage: 1,
				categoryPercentage: 1,
				data: graphBarValues.value,
				backgroundColor: "rgba(54, 162, 235, 0.2)",
				borderColor: "rgb(54, 162, 235)"
			}
		]
	}),
	graphAccumulatesLabel = computed(() => {
		return [...statTable.value.map((x) => x.bi), statConfig.max]
	}),
	graphAccumulates = computed(() => {
		return [
			{
				type: "line",
				data: [0, ...statTable.value.map((x) => x.Fi), 1],
				borderColor: "rgb(75, 192, 192)"
			},
			{
				type: "line",
				data: [1, ...statTable.value.map((x) => x.Fid), 0],
				borderColor: "rgb(54, 162, 235)"
			}
		]
	}),
	graphAccumulatesOptions = computed(() => {
		return {
			scales: {
				x: {
					type: "linear",
					min: statConfig.min,
					max: statConfig.max
				}
			},
			plugins: {
				annotation: {
					annotations: {
						median: {
							type: "line",
							scaleID: "x",
							value: statCentralValues.value.q2,
							borderColor: "rgba(255, 99, 132, 0.75)",
							borderWith: 2,
							label: {
								display: true,
								content: "médiane",
								position: "start"
							}
						}
					}
				}
			}
		}
	}),
	graphBoxPlot = computed(() => {
		return [
			{
				label: "min / max",
				data: {
					whiskerMin: statConfig.min,
					q1: statCentralValues.value.q1,
					median: statCentralValues.value.q2,
					q3: statCentralValues.value.q3,
					whiskerMax: statConfig.max
					// items: [104, 106, 185, 192]
				}
			},
			{
				label: "1.5*IQ",
				data: {
					whiskerMin: Math.max(
						statCentralValues.value.q1 -
						1.5 * statCentralValues.value.iq,
						statConfig.min
					),
					q1: statCentralValues.value.q1,
					median: statCentralValues.value.q2,
					q3: statCentralValues.value.q3,
					whiskerMax: Math.min(
						statCentralValues.value.q3 +
						1.5 * statCentralValues.value.iq,
						statConfig.max
					)
					// items: [104, 106, 185, 192]
				}
			}
		]
	}),
	graphBoxPlotOptions = computed(() => {
		return {
			scales: {
				x: {
					min: statConfig.min - statConfig.length,
					max: statConfig.max + statConfig.length
				}
			}
		}
	})

/**
 * Calculates various central values for a given statistical table.
 *
 * @returns {Object} An object containing the following central values:
 * - modal: The mode of the statistical table.
 * - q1: The first quartile of the statistical table.
 * - q2: The median of the statistical table.
 * - q3: The third quartile of the statistical table.
 * - mean: The mean mean of the statistical table.
 * - variance: The variance of the statistical table.
 * - sigma2: The squared standard deviation of the statistical table.
 * - sigma: The standard deviation of the statistical table.
 */
const statCentralValues = computed<{
	modal: { classe: string; mode: number }
	q1: number
	q2: number
	q3: number
	iq: number
	mean: number
	sigma2: number
	sigma: number
}>(() => {
	// statistics.mustaches.Q = statistics.middle.quartiles.last - statistics.middle.quartiles.first
	// statistics.mustaches.bm = statistics.middle.quartiles.first - 1.5 * statistics.mustaches.Q
	// statistics.mustaches.bp = statistics.middle.quartiles.last + 1.5 * statistics.mustaches.Q

	const mean = statTable.value.reduce(
			(previous, row) => previous + row.fi * row.xi,
			0
		),
		sigma2 = statTable.value.reduce(
			(previous, row) =>
				previous + row.fi * Math.pow(+row.xi - mean, 2),
			0
		),
		q1 = stats_median(statTable.value, 0.25),
		q3 = stats_median(statTable.value, 0.75)

	return {
		modal: stats_mode(statTable.value),
		q1,
		q2: stats_median(statTable.value, 0.5),
		q3,
		iq: q3 - q1,
		mean,
		sigma2,
		sigma: Math.sqrt(sigma2)
	}
})

/**
 * Generates a random number from a skewed normal distribution within a given range.
 *
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @param {number} skew - The skewness of the distribution.
 * @param {number} flatten - The flatten factor of the distribution.
 * @returns {number} - A random number from the skewed normal distribution within the specified range.
 */
function randn_bm(
	min: number,
	max: number,
	skew: number,
	flatten?: number
) {
	let u = 0,
		v = 0
	while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random()
	let num =
		Math.sqrt(-flatten * Math.log(u)) * Math.cos(flatten * Math.PI * v)

	num = num / 10.0 + 0.5 // Translate to 0 -> 1
	if (num > 1 || num < 0) num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
	num = Math.pow(num, skew) // Skew
	num *= max - min // Stretch to fill range
	num += min // offset to min
	return num
}

/**
 * Builds custom statistical data based on the given configuration.
 *
 * @returns {Array} The custom statistical data.
 */
function statsBuildData_customData() {
	const raw = []

	// TODO : Generate data with random ni values
	let bi = +statConfig.min,
		dataIndex = 0
	while (bi < statConfig.max) {
		const ni =
			statConfig.customData[dataIndex] === undefined
				? 0
				: +statConfig.customData[dataIndex]
		for (let i = 0; i < ni; i++) {
			raw.push(bi)
		}

		bi += statConfig.length > 0 ? statConfig.length : 1
		dataIndex++
	}
	return raw
}

/**
 * Builds statistical data based on the given configuration.
 *
 * @returns {Array} The raw statistical data generated.
 */
function statsBuildData_auto() {
	const raw = []
	// Build the data randomly
	for (let i = 0; i < statConfig.samples; i++) {
		let rnd
		while (isNaN(rnd)) {
			rnd = Math.round(
				randn_bm(
					statConfig.min,
					statConfig.max,
					statConfig.skew,
					statConfig.flatten
				)
			)
			if (statConfig.samplesExact === false) {
				break
			}
		}

		if (!isNaN(rnd)) {
			// Add to the raw list
			raw.push(rnd)
		}
	}

	return raw
}

function statsBuildTable_discrete() {
	return []
}

function statsBuildTable_continuous(): {
	bi: number
	bii: number
	xi: number
	Li: number
	ni: number
	fi: number
	Fi: number
	Fid: number
	fixi: number
	fixii: number
}[] {
	// The length must be greater than 1.
	if (statConfig.length <= 1) {
		return []
	}

	// Generate the table
	// item: {
	// 	    bi,     lower bound
	// 	    bii,    upper bound
	// 	    xi,     central value
	// 	    xi,     length
	// 	    ni,     number
	// 	    fi,     frequency
	// 	    Fi,    cumulative frequency ascending
	//      F1d,    cumulative frequency descending
	//      fixi,    cumulative frequency descending
	//      fixii,    cumulative frequency descending
	//  }
	const table = []

	let bi = statConfig.min,
		securityCount = 0,
		customNi = statCustomNi.value
			.split(" ")
			.filter((x) => x !== "")
			.map((x) => +x)

	while (bi < statConfig.max) {
		let bii = bi + statConfig.length,
			xi = (bi + bii) / 2,
			ni

		if (customNi.length === 0) {
			ni = statRaw.value.filter((x) => x >= bi && x < bii).length
		} else {
			ni = customNi.shift()
		}

		// Add item to the table
		table.push({
			bi,
			bii,
			xi,
			ni,
			Li: bii - bi,
			fi: 0,
			Fi: 0,
			Fid: 0,
			fixi: 0,
			fixii: 0
		})

		// Prepare next line of data.
		bi += statConfig.length

		// Security exit.
		securityCount++
		if (securityCount > 100) {
			break
		}
	}

	// Get the ni sum.
	const sum = table.reduce((acc, value) => (acc += value.ni), 0)

	// Build the accumulate frequencies
	let Fi = 0.0,
		Fid = 1.0
	table.forEach((item) => {
		item.fi = item.ni / sum
		item.fixi = item.fi * item.xi
		item.fixii = item.fi * item.xi ** 2

		Fi = Fi + item.fi
		item.Fi = Fi

		Fid = Fid - item.fi
		item.Fid = Fid
	})

	return table
}

function statRoundValue(value) {
	return statConfig.round > 0 ? +value.toFixed(statConfig.round) : value
}

/**
 * Calculates the mode (stats_mode) of a given table.
 * The mode is the value(s) that appears most frequently in the table.
 *
 * @param {Array} table - The table containing the data.
 * @returns {number} - The mode of the table.
 */
function stats_mode(table): { classe: string; mode: number } {
	if (statTable.value.length === 0) {
		return { classe: "", mode: 0 }
	}

	// xm = b(i-1) + (D1)/(D1+D2)*Li
	let niMax = Math.max(...table.map((o) => o.ni)),
		niMaxID

	for (let i = 0; i < table.length; i++) {
		if (table[i].ni === niMax) {
			niMaxID = +i
			break
		}
	}

	const D1 =
			table[niMaxID].fi -
			(niMaxID - 1 === -1 ? 0 : table[niMaxID - 1].fi),
		D2 =
			table[niMaxID].fi -
			(niMaxID + 1 === table.length ? 0 : table[niMaxID + 1].fi)

	return {
		classe: `[${table[niMaxID].bi} - ${table[niMaxID].bii}[`,
		mode:
			table[niMaxID].bi +
			(D1 / (D1 + D2)) * (table[niMaxID].bii - table[niMaxID].bi)
	}
}

/**
 * Calculate the median value based on a given table and break point.
 *
 * @param {Array} table - The table containing the values and frequencies.
 * @param {number} [breakPoint=0.5] - The break point to calculate the median value.
 * @returns {number} - The calculated median value.
 */
function stats_median(table, breakPoint = 0.5) {
	for (let i = 0; i < table.length; i++) {
		if (table[i].Fi >= breakPoint) {
			return (
				table[i].bi +
				((breakPoint -
						(table[i - 1] === undefined ? 0 : table[i - 1].Fi)) /
					table[i].fi) *
				(table[i].bii - table[i].bi)
			)
		}
	}

	return 0
}

// OUTPUT
const tableToTexOutput = computed(() => {
	const outputTable = []

	for (const row of statTable.value) {
		outputTable.push(
			[
				`\\(\\bigl[${row.bi};${row.bii}\\bigr[\\)`,
				row.xi,
				row.ni,
				row.Li,
				statConfig.percent
					? `${(row.fi * 100).toFixed(1)}\\%`
					: row.fi.toFixed(3),
				statConfig.percent
					? `${(row.Fi * 100).toFixed(1)}\\%`
					: row.Fi.toFixed(3),
				statConfig.percent
					? `${(row.Fid * 100).toFixed(1)}\\%`
					: row.Fid.toFixed(3),
				(row.fi * row.xi).toFixed(2),
				(row.fi * row.xi ** 2).toFixed(2)
			].join(" & ")
		)
	}

	const header =
			"\\(" +
			[
				"\\bigl[b_{i-1};b_i\\bigr[",
				"c_i",
				"n_i",
				"L_i",
				"f_i",
				"F_i",
				"F'_i",
				"f_i\\cdot x_i",
				"f_i\\cdot x_i^2"
			].join("\\)&\\(") +
			"\\)\\\\ \n",
		footer =
			[
				"TOTAUX",
				"",
				statConfig.samples,
				"",
				"1",
				"",
				"",
				statCentralValues.value.mean.toFixed(2),
				""
			].join(" & ") + " \n"

	return (
		"\\begin{tblr}{ colspec={| X[c,2cm] | *{7}{X[c]|} X[c,2cm] |}, hlines, row{1}={lightgray}, row{Z}={lightgray} }\n" +
		header +
		"\\hline" +
		outputTable.join("\\\\ \n") +
		"\\\\ \\hline \n" +
		footer +
		"\\end{tblr}"
	)
})

// function makeGraph(stats) {
//     // Removev previous graph
//     // TODO : make it possible to only UPDATE the data.
//     makeGraphHist(stats)
//     makeGraphMustache(stats)
// }
//
// function makeGraphHist(stats) {
//     // TODO: Graph alignement.
//     let $el = document.getElementById("svgGraphiqueHist").firstChild
//     if ($el) {
//         $el.remove()
//     }
//
//     let maxH = Math.max(...stats.table.map(x => x.fi)),
//         factor = 10,
//         w = stats.table.length + 3
//
//     let graph = new PiGraph("svgGraphiqueHist", w, Math.round(maxH * 10 + 0.5) + 2)
//     graph.origin = {
//         x: 1,
//         y: 1
//     }
//
//     graph.xAxis.ticks = 1
//     let labels = stats.table.map(x => x.bi)
//     labels.push(stats.table[stats.table.length - 1].bii)
//     graph.xAxis.ticksLabels = i => (labels[i - 1] !== undefined ? labels[i - 1] : "")
//     graph.xAxis.tickOrigine = false
//     graph.yAxis.ticks = 1
//     graph._yAxis.ticksLabels = i => (i * 10)
//     graph.yAxis.tickOrigine = false
//     graph.showGrid()
//
//     let f = graph.plot("stat").hist(stats.table.map(x => x.fi * factor), stats.table.map(x => x.xi)).histFrequency()
// }
//
// function makeGraphMustache(stats) {
//     let $el = document.getElementById("svgGraphiqueMustache").firstChild
//     if ($el) {
//         $el.remove()
//     }
//
//     let maxValue = Math.max(...stats.table.map(x => x.bii)),
//         minValue = Math.min(...stats.table.map(x => x.bi)),
//         factorValue = 10.0 / maxValue
//
//     let graph = new PiGraph("svgGraphiqueMustache", 12, 6)
//     graph.origin = {
//         x: 1,
//         y: 1
//     }
//
//     graph.xAxis.ticks = 1
//     graph.xAxis.ticksLabels = i => (i / factorValue)
//     graph.xAxis.tickOrigine = false
//     graph.yAxis.ticks = 1
//     graph.yAxis.showTicks(false)
//     graph.showGrid()
//
//     let m = graph.plot("stat").mustache({
//         x1: Math.max(stats.middle.quartiles.first * factorValue, 0),
//         x2: stats.middle.mediane * factorValue,
//         x3: Math.min(stats.middle.quartiles.last * factorValue, 10),
//         minX: minValue * factorValue,
//         maxX: maxValue * factorValue,
//         height: 2,
//         width: 2
//     })
// }
</script>
<template>
	<!-- Title -->
	<article>
		<Card class="my-6">
			<div class="grid grid-cols-1 md:grid-cols-6">
				<form-maker
					v-model.number="statConfig.samples"
					label="samples"
				/>
				<form-maker
					v-model.number="statConfig.min"
					label="valeur modale minmale"
				/>
				<form-maker
					v-model.number="statConfig.max"
					label="valeur modale maximale"
				/>
				<form-maker
					v-model.number="statConfig.length"
					label="amplitude de la classe"
				/>
				<form-maker
					v-model.number="statConfig.skew"
					label="biais de la distribution"
				/>
				<form-maker
					v-model.number="statConfig.flatten"
					label="applatissement de la distribution"
				/>

				<form-maker
					v-model="statConfig.percent"
					label="en pourcent"
					name="percent"
					type="switch"
				/>

				<form-maker
					v-model="statConfig.round"
					label="précision"
					max="5"
					min="0"
					type="number"
				/>
			</div>

			<div>
				<form-maker
					v-model="statCustomNi"
					label="valeurs custom pour ni"
				/>
			</div>
		</Card>
		<Card v-if="statTable.length > 0">
			<template #header>
				<h2 class="text-lg">
					Tableau des valeurs
				</h2>
			</template>
			<table class="w-full text-center table-fixed">
				<thead class="bg-gray-600 text-white">
					<tr>
						<th
							v-katex="`\\left[b_i; b_ii\\right[`"
							class="w-[150px]"
							title="classe modale"
						/>
						<th
							v-katex="'c_i'"
							title="valeur centrale"
						/>
						<th
							v-katex="'n_i'"
							title="effectif"
						/>
						<th
							v-katex="'L_i'"
							title="amplitude"
						/>
						<th
							v-katex="'f_i'"
							title="fréquence"
						/>
						<th
							v-katex="'F_i'"
							title="fréquence cumulée croissante"
						/>
						<th
							v-katex="'F_i\''"
							title="fréquence cumulée décroissante"
						/>
						<th
							v-katex="'f_i\\cdot x_i'"
							title="fixi"
						/>
						<th
							v-katex="'f_i\\cdot x_i^2'"
							title="fixi2"
						/>
					</tr>
				</thead>
				<tbody class="font-code">
					<tr
						v-for="(item, index) in statTable"
						:key="`stats-${index}`"
						class="odd:bg-gray-200 border-t border-b border-gray-300"
					>
						<td class="border-x border-gray-300 py-2">
							[{{ item.bi }} - {{ item.bii }}[
						</td>
						<td class="border-x border-gray-300 py-2">
							{{ item.xi }}
						</td>
						<td class="border-x border-gray-300 py-2">
							{{ item.ni }}
						</td>
						<td class="border-x border-gray-300 py-2">
							{{ item.bii - item.bi }}
						</td>
						<td class="border-x border-gray-300 py-2">
							{{
								statConfig.percent
									? statRoundValue(item.fi * 100) + `%`
									: statRoundValue(item.fi)
							}}
						</td>
						<td class="border-x border-gray-300 py-2">
							{{
								statConfig.percent
									? statRoundValue(item.Fi * 100) + `%`
									: statRoundValue(item.Fi)
							}}
						</td>
						<td class="border-x border-gray-300 py-2">
							{{
								statConfig.percent
									? statRoundValue(item.Fid * 100) + `%`
									: statRoundValue(item.Fid)
							}}
						</td>
						<td class="border-x border-gray-300 py-2">
							{{ statRoundValue(item.fixi) }}
						</td>
						<td class="border-x border-gray-300 py-2">
							{{ statRoundValue(item.fixii) }}
						</td>
					</tr>
				</tbody>
				<tfoot class="font-code">
					<tr>
						<td />
						<td />
						<td class="bg-gray-300 border border-gray-300">
							{{ statSum.ni }}
						</td>
						<td />
						<td class="bg-gray-300 border border-gray-300">
							{{ statRoundValue(statSum.fi) }}
						</td>
						<td />
						<td />
						<td class="bg-gray-300 border border-gray-300">
							{{ statRoundValue(statSum.fixi) }}
						</td>
						<td class="bg-gray-300 border border-gray-300">
							{{ statRoundValue(statSum.fixii) }}
						</td>
					</tr>
				</tfoot>
			</table>

			<div>
				<h4
					@click="showTex=!showTex"
					class="cursor-pointer"
				>
					TeX output <i
						:class="{
							'bi bi-eye-slash': !showTex,
							'bi bi-eye': showTex,
						}"
					/>
				</h4>
				<pre
					v-show="showTex"
					class="font-code border rounded-sm bg-gray-200 p-3 overflow-x-scroll"
				>{{ tableToTexOutput }}</pre>
			</div>

			<h2 class="font-xl uppercase font-semibold mt-10">
				Valeurs centrales
			</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
				<div
					class="bg-white text-center border rounded-lg min-h-[120px] flex flex-col justify-around"
				>
					<div class="font-semibold">
						Moyenne ou espérance
					</div>
					<div class="font-code text-xl">
						{{ statRoundValue(statCentralValues.mean) }}
					</div>
				</div>
				<div
					class="bg-white text-center border rounded-lg min-h-[120px] flex flex-col justify-around"
				>
					<div class="font-semibold">
						Classe modale
					</div>
					<div class="font-code text-xl">
						{{ statCentralValues.modal.classe }}<br>
						{{ statRoundValue(statCentralValues.modal.mode) }}
					</div>
				</div>
				<div
					class="bg-white text-center border rounded-lg min-h-[120px] flex flex-col justify-around"
				>
					<div class="font-semibold">
						Médiane
					</div>
					<div class="font-code text-xl">
						{{ statRoundValue(statCentralValues.q2) }}
					</div>
				</div>
				<div
					class="bg-white text-center border rounded-lg min-h-[120px] flex flex-col justify-around"
				>
					<div class="font-semibold">
						Quartiles
					</div>
					<div class="font-code text-xl">
						<span v-katex="'q_{1/4}='" />
						{{ statRoundValue(statCentralValues.q1) }} <br>
						<span v-katex="'q_{3/4}='" />
						{{ statRoundValue(statCentralValues.q3) }}
					</div>
				</div>
				<div
					class="bg-white text-center border rounded-lg min-h-[120px] flex flex-col justify-around"
				>
					<div class="font-semibold">
						Ecart-type <span v-katex="'\\sigma'" />
					</div>
					<div class="font-code text-xl">
						{{ statRoundValue(statCentralValues.sigma) }}
					</div>
				</div>
				<div
					class="bg-white text-center border rounded-lg min-h-[120px] flex flex-col justify-around"
				>
					<div class="font-semibold">
						Variance <span v-katex="'\\sigma^2'" />
					</div>
					<div class="font-code text-xl">
						{{ statRoundValue(statCentralValues.sigma2) }}
					</div>
				</div>
			</div>

			<h2 class="font-xl uppercase font-semibold mt-10">
				Graphiques
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
				<div>
					<h2 class="text-lg font-extralight">
						histogramme et polygon des fréquences
					</h2>
					<bar-chart
						:chart-dataset="graphDataset"
						:chart-labels="graphLabels"
					/>
				</div>

				<div>
					<h2 class="text-lg font-extralight">
						Graphe des fréquences cumulées
					</h2>
					<line-chart
						:chart-dataset="graphAccumulates"
						:chart-labels="graphAccumulatesLabel"
						:chart-options="graphAccumulatesOptions"
					/>
				</div>

				<div>
					<h2 class="text-lg font-extralight">
						Boîte à moustaches
					</h2>
					<box-plot-chart
						:chart-dataset="graphBoxPlot"
						:chart-labels="['']"
						:chart-options="graphBoxPlotOptions"
					/>
				</div>
			</div>
		</Card>
	</article>
</template>
