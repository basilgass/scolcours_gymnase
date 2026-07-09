<script setup lang="ts">
import {Line} from "vue-chartjs"
import {computed} from "vue"
import _ from "lodash"
import {buildChartData, type ChartComponentProps, chartPropDefaults} from "@/Components/Charts/chartHelpers.ts"

const props = withDefaults(defineProps<ChartComponentProps>(), chartPropDefaults)

const chartData = computed(() =>
	buildChartData<"line">(props.chartDataset, props.chartLabels, props.chartColorset),
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
		<Line
			:data="chartData"
			:options="chartOptionsMerged"
		/>
	</div>
</template>
