<script setup>
import {Bar} from "vue-chartjs"
import {computed} from "vue"

let props = defineProps({
	chartLabels: {type: Array, default: () => []},
	chartDataset: {type: [Object, Array], required: true},
	chartOptions: {type: Object, default: () => {}},
	chartLegend: {type: Boolean, default: false}
})

let chartData = computed(() => {
		let labels = []
		if (props.chartLabels !== []) {
			labels["labels"] = props.chartLabels
		}

		let datasets = (Array.isArray(props.chartDataset)) ?
			[{
				data: props.chartDataset,
				...chartColorset.value
			}] :
			props.chartDataset

		return {
			...labels,
			datasets
		}
	}),
	chartOptionsMerged = computed(()=>{
		let opts= {
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				legend: {
					display: props.chartLegend,
				},
			},
		}
		return {
			...opts,
			...props.chartOptions
		}
	}),
	chartColorset = computed(()=>{
		return {
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
				"rgba(40,210,72,0.2)",
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
		}
	})

</script>

<template>
	<Bar
		:data="chartData"
		:options="chartOptionsMerged"
	/>
</template>

<style scoped>

</style>
