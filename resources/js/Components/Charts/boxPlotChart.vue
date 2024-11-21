<script setup lang="ts">
import { BoxPlotChart } from "@sgratzl/chartjs-chart-boxplot"
import _ from "lodash"
import { computed, onMounted, ref, watch } from "vue"

const props = defineProps({
	chartLabels: {type: Array, default: () => []},
	chartDataset: {type: [Object, Array], required: true},
	chartOptions: {
		type: Object, default: () => null
	},
	chartLegend: {type: Boolean, default: false},
	chartColorset: {type: String, default: null}
})

const chartData = computed(() => {
		const labels = []
		if (props.chartLabels.length>0) {
			labels["labels"] = props.chartLabels
		}

		return {
			...labels,
			datasets: [
				...props.chartDataset.map(d=>{
					return {
						label: d.label,
						medianColor: "red",
						borderWidth: 2,
						data: [d.data]
					}
				}),
			]
		}
	}),
	chartOptionsMerged = computed(() => {
		const opts:{responsive: boolean, maintainAspectRatio:boolean, indexAxis: 'x'|'y'} = {
			responsive: true,
			maintainAspectRatio: true,
			// plugins: {
			// 	legend: {
			// 		display: props.chartLegend,
			// 	},
			// },
			indexAxis: "y",
		}

		return _.merge(opts, props.chartOptions)
	})
	// chartColors = computed(() => {
	// 	if (props.chartColorset === "graduate") {
	// 		return {
	// 			backgroundColor: [
	// 				"rgba(255, 99, 132, 0.2)",
	// 				"rgba(255, 99, 132, 0.2)",
	// 				"rgba(255, 99, 132, 0.2)",
	// 				"rgba(255, 159, 64, 0.2)",
	// 				"rgba(255, 159, 64, 0.2)",
	// 				"rgba(255, 205, 86, 0.2)",
	// 				"rgba(54, 162, 235, 0.2)",
	// 				"rgba(54, 162, 235, 0.2)",
	// 				"rgba(75, 192, 192, 0.2)",
	// 				"rgba(75, 192, 192, 0.2)",
	// 				"rgba(40,210,72,0.2)",
	// 			],
	// 			borderColor: [
	// 				"rgb(255, 99, 132)",
	// 				"rgb(255, 99, 132)",
	// 				"rgb(255, 99, 132)",
	// 				"rgb(255, 159, 64)",
	// 				"rgb(255, 159, 64)",
	// 				"rgb(255, 205, 86)",
	// 				"rgb(54, 162, 235)",
	// 				"rgb(54, 162, 235)",
	// 				"rgb(75, 192, 192)",
	// 				"rgb(75, 192, 192)",
	// 				"rgb(201, 203, 207)",
	// 			],
	// 			borderWidth: 1,
	// 		}
	// 	}
	//
	// 	return {}
	// })


const graph = ref(null)
let chart
onMounted(() => {
	chart = new BoxPlotChart(graph.value, {
		data: chartData.value,
		options: chartOptionsMerged.value
	})
})

watch(() => props.chartDataset, () => {
	chart.data = chartData.value
	chart.update()
})
watch(() => props.chartOptions, () => {
	chart.options = chartOptionsMerged.value
	chart.update()
})
</script>

<template>
	<div class="relative">
		<canvas ref="graph" />
	</div>
</template>

<style scoped>

</style>
