<script setup lang="ts">
import {CategoryScale} from "chart.js"

import {Chart as ChartJS} from "chart.js/auto"
import {computed} from "vue"
import {Bar} from "vue-chartjs"
import _ from "lodash"
import {buildChartData, type ChartComponentProps, chartPropDefaults} from "@/Components/Charts/chartHelpers.ts"

ChartJS.register(CategoryScale)

const props = withDefaults(defineProps<ChartComponentProps>(), chartPropDefaults)

const chartData = computed(() =>
	buildChartData<"bar">(props.chartDataset, props.chartLabels, props.chartColorset),
)

const chartOptionsMerged = computed(() => {
	const opts = {
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			legend: {
				display: props.chartLegend,
			},
		},
	}

	return _.merge(opts, props.chartOptions)
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
