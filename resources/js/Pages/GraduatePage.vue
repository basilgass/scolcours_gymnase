<!--suppress ALL -->
<template>
	<!-- Title -->
	<ArticleTitle title="Echelle" />

	<div>
		<form-number
			v-model="maxPoints"
			focus
			label="nombre de maxPoints"
			name="points"
		/>
		<form-textarea
			v-model="pointsData"
			helper-text="notes séparées par des espaces"
			label="valeurs"
			name="points"
		/>
	</div>

	<div>
		<p>Nombre de notes: {{ evaluations.length }}</p>
		<p>Moyenne: {{ average.points.toFixed(2) }} ( {{ average.evaluation.toFixed(2) }} )</p>
		<p>Médiane: {{ median.points.toFixed(2) }} ( {{ median.evaluation }} )</p>
	</div>

	<div
		class="relative max-w-xl mx-auto w-[80vw] h-[40vw]"
	>
		<canvas ref="chart" />
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
	chart = ref(null)

let points = computed(()=>{
		return pointsData.value.split(" ")
			.filter(x=>x!=="")
			.map(x=>+x)
			.filter(x=>!isNaN(x))
	}),
	evaluations = computed(() => {
		return points.value
			.map(x => {
				let e = (x / maxPoints.value * 5) + 1
				return Math.round(e * 2) / 2
			})
	}),
	average = computed(() => {
		if(evaluations.value.length===0){return {
			points: "-",
			evaluation: "-"
		}}
		return {
			points: points.value.reduce((a,b)=>a+b)/points.value.length,
			evaluation: evaluations.value.reduce((a, b)=>a+b)/evaluations.value.length
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
	numberByEvaluation = computed(()=>{
		let arr = {}
		for(let i=1; i<=6; i+=0.5){
			arr[`${i.toPrecision(2)}`] = evaluations.value.filter(x=>x===i).length
		}
		return arr
	})

let chartObject
onMounted(()=>{
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
			plugins: {
				legend: {
					display: false
				}
			}
		}
	})

	console.log(chartObject.options.scales["y"])
})

watch(numberByEvaluation, (newValue, oldValue)=>{
	chartObject.config.data.datasets[0].data = Object.values(numberByEvaluation.value)
	chartObject.update()
})
</script>

