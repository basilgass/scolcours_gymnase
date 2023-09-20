<script setup>
import {Line} from "vue-chartjs"
import {computed} from "vue"
import _ from "lodash";

let props = defineProps({
	chartLabels: {type: Array, default: () => []},
	chartDataset: {type: [Object, Array], required: true},
	chartOptions: {type: Object, default: () => {}},
	chartLegend: {type: Boolean, default: false},
	chartColorset: {type: String, default: null}
})

let chartData = computed(() => {
		let labels = []
		if (props.chartLabels.length>0) {
			labels["labels"] = props.chartLabels
		}

		let datasets = []
		if(Array.isArray(props.chartDataset)){
			if(props.chartDataset[0].hasOwnProperty("data")){
				datasets = props.chartDataset
			}else{
				datasets = [{
					data: props.chartDataset,
					...chartColors.value
				}]
			}
		}else{
			datasets = [props.chartDataset]
		}

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

		return _.merge(opts, props.chartOptions)
	}),
	chartColors = computed(()=>{
		if(props.chartColorset==="graduate") {
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
		}

		return {}
	})

</script>

<template>
	<div class="relative">
		<Line
			:data="chartData"
			:options="chartOptionsMerged"
		/>
	</div>
</template>

<style scoped>

</style>
