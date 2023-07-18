<!--suppress ALL -->
<template>
	<!-- Title -->
	<ArticleTitle title="Echelle" />

	<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
		<div class="flex flex-col gap-5">
			<form-number
				v-model="maxPoints"
				focus
				label="nombre max de points"
				name="points"
			/>
			<form-number
				v-model="pourcentage"
				focus
				helper-text="vide pour échelle fédérale"
				label="pourcentage"
				name="points"
			/>

			<div class="min-w-[9em] max-w-[16em] w-full mx-auto bg-white rounded border border-slate-100 p-3">
				<table class="table tab w-full text-center font-code">
					<thead>
						<tr class="font-semibold">
							<td>de</td>
							<td>à</td>
							<td class="">
								éval.
							</td>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) in rangeByEvaluation"
							:key="`range-${index}`"
							class="odd:bg-amber-100"
						>
							<td>{{ item.min }}</td>
							<td>{{ item.max }}</td>
							<td>{{ item.note }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div>
			<div class="grid grid-cols-2 gap-3">
				<form-textarea
					v-model="pointsData"
					helper-text="notes séparées par des espaces, des virgules ou à la ligne."
					label="valeurs"
					name="points"
					:rows="6"
				/>

				<div
					class="relative w-[20vw] h-[15vw] max-w-full mx-auto"
				>
					<canvas ref="chartD" />
				</div>
			</div>

			<div
				v-show="points.length>0"
				class="relative w-[32vw] h-[24vw] max-w-full mx-auto"
			>
				<canvas ref="chart" />
			</div>

			<div v-if="points.length>0">
				<div class="flex justify-between">
					<p>Nombre de notes: {{ evaluations.length }}</p>
					<p>Moyenne: {{ average.points.toFixed(2) }} ( {{ average.evaluation.toFixed(2) }} )</p>
					<p>Médiane: {{ median.points.toFixed(2) }} ( {{ median.evaluation }} )</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import {computed, nextTick, onMounted, ref, watch} from "vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import {Chart} from "chart.js/auto"


let pointsData = ref("2 1.5 1 1.5 4 4.5 4 5.5 5 3 3.5 5 4.5 4 2.5 5.5 6 5.5 3 3.5"),
	maxPoints = ref(20),
	pourcentage = ref(""),
	halfPoints = ref(true),
	chart = ref(null),
	chartD = ref(null)

let points = computed(() => {
		return pointsData.value.split(/[\s,\n]/)
			.filter(x => x !== "")
			.map(x => +x)
			.filter(x => !isNaN(x))
	}),
	evaluations = computed(() => {
		return points.value
			.map(x => {
				return evalNote(x)
				// let e = (x / maxPoints.value * 5) + 1
				// return Math.round(e * 2) / 2
			})
	}),
	average = computed(() => {
		if (evaluations.value.length === 0) {
			return {
				points: "-",
				evaluation: "-"
			}
		}
		return {
			points: points.value.reduce((a, b) => a + b) / points.value.length,
			evaluation: evaluations.value.reduce((a, b) => a + b) / evaluations.value.length
		}
	}),
	median = computed(() => {
		// https://stackoverflow.com/questions/45309447/calculating-median-javascript
		if (!evaluations.value.length) return {
			points: "-",
			evaluation: "-"
		}

		const s = [...evaluations.value].sort((a, b) => a - b)
		const mid = Math.floor(s.length / 2)

		const sPt = [...evaluations.value].sort((a, b) => a - b)
		const midPt = Math.floor(s.length / 2)
		return {
			points: sPt.length % 2 === 0 ? ((sPt[midPt - 1] + sPt[midPt]) / 2) : sPt[midPt],
			evaluation: s.length % 2 === 0 ? ((s[mid - 1] + s[mid]) / 2) : s[mid]
		}
	}),
	numberByEvaluation = computed(() => {
		let arr = {}
		for (let i = 1; i <= 6; i += 0.5) {
			arr[`${i.toPrecision(2)}`] = evaluations.value.filter(x => x === i).length
		}

		return arr
	}),
	rangeByEvaluation = computed(()=> {
		let arr = {}
		for (let i = 0; i <= +maxPoints.value; i += halfPoints.value?0.5:1) {
			const note = evalNote(i)
			if(arr[note]===undefined){arr[note] = []}
			arr[note].push(i)
		}

		let sorted = []
		for (let note of Object.keys(arr)) {
			// arr[note] = [Math.min(...arr[note]), Math.max(...arr[note])]
			sorted.push({
				note,
				min: Math.min(...arr[note]),
				max: Math.max(...arr[note])
			})
		}

		sorted.sort((a,b)=>b.note-a.note)
		// Make a sorted array.
		return sorted
	})

let chartObject,
	chartDObject

onMounted(() => {
	chartObject = new Chart(chart.value, {
		type: "bar",
		data: {
			labels: ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6"],
			datasets: [{
				label: null,
				data: Object.values(numberByEvaluation.value),
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(255, 99, 132, 0.2)",
					"rgba(255, 99, 132, 0.2)",
					"rgba(255, 159, 64, 0.2)",
					"rgba(255, 159, 64, 0.2)",
					"rgba(255, 205, 86, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(40,210,72,0.2)"
				],
				borderColor: [
					"rgb(255, 99, 132)",
					"rgb(255, 99, 132)",
					"rgb(255, 99, 132)",
					"rgb(255, 159, 64)",
					"rgb(255, 159, 64)",
					"rgb(255, 205, 86)",
					"rgb(54, 162, 235)",
					"rgb(54, 162, 235)",
					"rgb(75, 192, 192)",
					"rgb(75, 192, 192)",
					"rgb(201, 203, 207)",
				],
				borderWidth: 1,
			}],
		},
		options: {
			scales: {
				y: {
					ticks: {
						stepSize: 1
					}
				}
			},
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false
				}
			}
		}
	})

	chartDObject = new Chart(chartD.value, {
		type: "line",
		data: {
			labels: [],
			datasets: [{data: []}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false
				}
			},
			scales: {
				x: {
					type: "linear",
					min: 0,
					max: maxPoints.value,
					ticks: {
						stepSize: halfPoints.value ? 0.5 : 1
					}
				}
			}
		}
	})

	updateChardD()
})

watch(numberByEvaluation, (newValue, oldValue) => {
	chartObject.config.data.datasets[0].data = Object.values(numberByEvaluation.value)
	chartObject.update()

	updateChardD()
})

watch(pourcentage, (newValue, oldValue) => {
	updateChardD()
})

watch(maxPoints, (newValue, oldValue) => {
	updateChardD()
})

function roundTo(x) {
	if (halfPoints.value) {
		return Math.floor(x * 2) / 2
	} else {
		return Math.floor(x) + 1
	}
}

function evalB1(note) {
	if (note < 1) {
		return 0
	}
	return (note - 1) * maxPoints.value * pourcentage.value / 100 / 2.75
}

function evalB2(note) {
	return (note - (6 - 2.25 / (1 - pourcentage.value / 100))) * maxPoints.value * (1 - pourcentage.value / 100) / 2.25
}

function evalF(note) {
	if (note < 1) {
		return 0
	}
	if (note > 6) {
		return maxPoints.value
	}

	return (note - 1) * maxPoints.value / 5
}

function roundNote(note){
	return Math.round(note*2)/2
}
function evalNote(x) {
	if(pourcentage.value==="" || pourcentage.value===0){
		return roundNote(x*5/maxPoints.value+1)
	}

	if(x < maxPoints.value*pourcentage.value/100){
		return roundNote(2.75/(maxPoints.value*pourcentage.value/100)*x+1)
	}else{
		return roundNote(2.25/(maxPoints.value*(1-pourcentage.value/100))*x+(6-(2.25/(1-pourcentage.value/100))))
	}
}

function evalRange(note) {
	if (note < 1 || note > 6) {
		return [0, maxPoints.value]
	}

	if (pourcentage.value === "" || pourcentage.value === 0) {
		// échelle fédérale.
		return [
			roundTo(evalF(note - 0.25)),
			roundTo(evalF(note + 0.25))
		]
	}

	if (note < 4) {
		return [
			roundTo(evalB1(note - 0.25)),
			roundTo(evalB1(note + 0.25))
		]
	} else {
		return [
			roundTo(evalB2(note - 0.25)),
			roundTo(evalB2(note + 0.25))
		]

	}

	return [0, 0]
}

function updateChardD() {
	// Mise à jours des labels
	let labels = [],
		pts = []

	// for (let note = 1; note <= 6; note += 0.5) {
	// 	labels.push(evalRange(note)[0])
	// 	labels.push(evalRange(note)[1])
	// 	pts.push(note)
	// 	pts.push(note)
	// }

	// Départ
	labels.push(0)
	pts.push(0)

	// 4
	labels.push(evalRange(4)[0])
	pts.push(4)

	// max
	labels.push(evalRange(6)[0])
	pts.push(6)

	// Mise à jours des points
	chartDObject.config.data.labels = labels
	chartDObject.config.data.datasets[0].data = pts
	chartDObject.config.options.scales.x.max = maxPoints.value

	chartDObject.update()
}
</script>

