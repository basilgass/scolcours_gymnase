<script setup lang="ts">
import {BoxPlotChart} from "@sgratzl/chartjs-chart-boxplot"
import _ from "lodash"
import {computed, onMounted, onUnmounted, ref, watch} from "vue"
import {
	type BoxPlotComponentProps,
	type BoxPlotData,
	type ChartLabel,
	chartPropDefaults
} from "@/Components/Charts/chartHelpers.ts"

const props = withDefaults(defineProps<BoxPlotComponentProps>(), chartPropDefaults)

const chartData = computed(() => {
	const labels: { labels?: (string | number)[] } = {}
	if (props.chartLabels.length > 0) {
		labels["labels"] = props.chartLabels
	}

	return {
		...labels,
		datasets: [
			...props.chartDataset.map(d => {
				return {
					label: d.label,
					medianColor: "red",
					borderWidth: 2,
					data: [d.data]
				}
			}),
		]
	}
})
const chartOptionsMerged = computed(() => {
	const opts: { responsive: boolean, maintainAspectRatio: boolean, indexAxis: 'x' | 'y' } = {
		responsive: true,
		maintainAspectRatio: true,
		indexAxis: "y",
	}

	return _.merge(opts, props.chartOptions)
})

const graph = ref<HTMLCanvasElement | null>(null)
let chart: BoxPlotChart<BoxPlotData[], ChartLabel> | null = null
onMounted(() => {
	if (!graph.value) return

	chart = new BoxPlotChart<BoxPlotData[], ChartLabel>(graph.value, {
		data: chartData.value,
		options: chartOptionsMerged.value
	})
})

onUnmounted(() => {
	chart?.destroy()
	chart = null
})

watch(chartData, () => {
	if (!chart) return
	chart.data = chartData.value
	chart.update()
})

watch(chartOptionsMerged, () => {
	if (!chart) return
	chart.options = chartOptionsMerged.value
	chart.update()
})
</script>

<template>
	<div class="relative">
		<canvas ref="graph" />
	</div>
</template>
