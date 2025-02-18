<script setup lang="ts">
import { graduateBackgroundColor, graduateBorderColor } from "@/scolcours.ts"
import { CategoryScale } from "chart.js"

import { Chart as ChartJS } from "chart.js/auto"
import _ from "lodash"
import { computed } from "vue"
import { Bar } from "vue-chartjs"

ChartJS.register(CategoryScale)


const props = defineProps({
	chartLabels: {type: Array, default: () => []},
	chartDataset: {type: [Object, Array], required: true},
	chartOptions: {type: Object, default: () => {}},
	chartLegend: {type: Boolean, default: false},
	chartColorset: {type: String, default: null}
})


const chartData = computed(() => {
		const labels = []
		if (props.chartLabels.length>0) {
			labels["labels"] = props.chartLabels
		}

		let datasets = []
		if(Array.isArray(props.chartDataset)){
			if(Object.hasOwn(props.chartDataset[0], 'data')){
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
		const opts= {
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
				backgroundColor: graduateBackgroundColor,
				borderColor: graduateBorderColor,
				borderWidth: 1,
			}
		}

		return {}
	})

</script>

<template>
	<div class="relative">
		<Bar
			:data="chartData"
			:options="chartOptionsMerged"
		/>
	</div>
</template>
