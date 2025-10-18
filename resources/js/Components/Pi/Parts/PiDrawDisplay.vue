<script lang="ts" setup>

import {onMounted, ref, useTemplateRef, watch} from "vue"
import {PiDraw} from "pidraw"
import {useResizeObserver} from "@vueuse/core"
import katex from "katex"
import PiDrawAnimation from "@/Components/Pi/Parts/PiDrawAnimation.vue"
import {useKatexMacros} from "@/Composables/useHelpers.ts"

const props = defineProps<{
	code: string,
	parameters: string
}>()

let PiGraph: PiDraw

const emits = defineEmits<{
	drawClick: [{ draw: PiDraw, mouse: MouseEvent | TouchEvent }],
	update: [draw: PiDraw],
	mounted: [draw: PiDraw]
}>()

function getPiDraw(): PiDraw {
	return PiGraph// méthode svg.js → contenu complet du <svg>
}

defineExpose({getPiDraw})


const drawWrapper = useTemplateRef<HTMLElement>('drawWrapper')
const PiParserHasErrors = ref(false)
const showAnimation = ref(false)

function PiParserUpdate(from?: string) {
	// Update the drawing
	// TODO: PiGraph.refresh should be more smart: if it's the same code, but just the label changing, just update the labels.
	try {
		PiGraph.refresh(props.code)
		emits("update", PiGraph)
		PiParserHasErrors.value = false
		showAnimation.value = PiGraph?.animation.canBeAnimated() ?? false
	} catch {
		console.log(from)
		PiParserHasErrors.value = true
	}
}

watch(() => props.code, () => {
	PiParserUpdate("drawCode watcher")
})

watch(() => props.parameters, () => {
	try {
		PiGraph.refreshLayout(props.parameters)
	} catch {
		console.error(props.parameters)
	}
})


const drawMouseUp = function (event: MouseEvent) {
	emits("drawClick", {draw: PiGraph, mouse: event})
}
const drawTouchEnd = function (event: TouchEvent) {
	emits("drawClick", {draw: PiGraph, mouse: event})
}

// Default settings
onMounted(() => {
	PiGraph = new PiDraw(
		drawWrapper.value,
		{
			parameters: props.parameters ?? "",
			code: props.code ?? "",
			tex: (value: string) => katex.renderToString(`${value}`, {
				strict: false,
				throwOnError: false,
				displayMode: true,
				macros: useKatexMacros,
				trust: (context) => context.command.startsWith("\\html"),
			})
		}
	)

// Add a resizeObserver on the draw container
	useResizeObserver(drawWrapper.value, () => {
		PiParserUpdate("onResize")
	})

	emits("mounted", PiGraph)
})

</script>

<template>
	<!-- draw graph-->
	<div>
		<div
			ref="drawWrapper"
			class="katex-m-0 min-w-[50px] min-h-[50px] touch-manipulation"
			@mouseup="drawMouseUp"
			@touchend="drawTouchEnd"
		/>
		<pi-draw-animation
			v-if="showAnimation"
			:draw="PiGraph"
		/>
	</div>
</template>

<style scoped>

</style>
