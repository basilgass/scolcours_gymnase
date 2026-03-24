<script lang="ts" setup>

import {computed, onMounted, ref, useTemplateRef, watch} from "vue"
import {PiDraw, Point} from "pidraw"
import {useResizeObserver} from "@vueuse/core"
import katex from "katex"
import PiDrawAnimation from "@/Components/Pi/Parts/PiDrawAnimation.vue"
import {useKatexMacros} from "@/Composables/useHelpers.ts"
import {router} from "@inertiajs/vue3"

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

function updateLayout(from?: string) {
	try {
		PiGraph.refreshLayout(props.parameters)
	} catch {
		// console.error(props.parameters)
	}
}

function updateCode(from?: string) {
	// Update the drawing
	try {
		PiGraph.refresh(props.code)
		emits("update", PiGraph)

		PiParserHasErrors.value = false
		showAnimation.value = PiGraph.animation.canBeAnimated() ?? false
	} catch {
		PiParserHasErrors.value = true
	}
}

watch(() => props.code, () => {
	updateCode("drawCode watcher")
})

watch(() => props.parameters, () => {
	updateLayout()
})

const drawMouseUp = function (event: MouseEvent) {
	emits("drawClick", {draw: PiGraph, mouse: event})
}

// Default settings
onMounted(() => {
	// TODO: rework the PiDrawDisplay to be more robust and more fast.
	try {
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
	} catch {
		console.warn('PiDrawDisplay error',
			{parameters: props.parameters, code: props.code}
		)
		PiGraph = new PiDraw(
			drawWrapper.value,
			{
				parameters: "",
				code: "",
				tex: (value: string) => katex.renderToString(`${value}`, {
					strict: false,
					throwOnError: false,
					displayMode: true,
					macros: useKatexMacros,
					trust: (context) => context.command.startsWith("\\html"),
				})
			}
		)
	}

	// Refresh the layout with the parameters (handles errors)
	// nextTick(() => {
	// 	updateLayout()
	// 	updateCode()
	// })


// Add a resizeObserver on the draw container
	useResizeObserver(drawWrapper.value, () => {
		updateLayout("onResize")
	})

	emits("mounted", PiGraph)
})

const toggleDraggableSize = ref(1)
const hasDraggable = computed(() => props.code.includes('drag'))

function toggleDragHandler() {
	toggleDraggableSize.value++
	toggleDraggableSize.value = toggleDraggableSize.value % 3

	Object.values(PiGraph.figures)
		.filter(fig => fig.isDraggable)
		.forEach((fig: Point) => {
			fig.shape.animate(400, 0, 'now')
				.ease(">")
				.size(fig.config.size * toggleDraggableSize.value, fig.config.size * toggleDraggableSize.value)
		})
}

function displayFullscreen() {
	// load svg to fullscreen.
	const svgEl = PiGraph.rootSVG.node
	if (!document.fullscreenElement) {
		svgEl.style.background = 'white'
		svgEl.requestFullscreen?.()
	} else {
		document.exitFullscreen?.()
	}
}


function print() {
	const html = '<div class="katex-m-0">' + PiGraph.rootSVG.svg() + '</div>'

	const key = 'scolcours.widgetFS'
	window.sessionStorage.setItem(key, html)
	router.visit(route('widgets.fullscreen'))
}
</script>

<template>
	<!-- draw graph-->
	<div class="relative">
		<div
			ref="drawWrapper"
			class="katex-m-0 min-w-12.5 min-h-12.5 touch-manipulation"
			@pointerup="drawMouseUp"
		/>
		<div class="absolute left-2 bottom-1 flex gap-3">
			<div
				v-if="hasDraggable"
				class="cursor-pointer"
				@click="toggleDragHandler"
			>
				<span class="relative inline-flex items-center justify-center">
					<i class="bi bi-hand-index" />
					<i
						v-if="toggleDraggableSize === 0"
						class="bi bi-slash absolute text-[2em] text-red-600"
					/>
				</span>
			</div>

			<div
				class="cursor-pointer"
				@click="displayFullscreen"
			>
				<i class="bi bi-arrows-fullscreen" />
			</div>

			<div
				class="cursor-pointer"
				@click="print"
			>
				<i class="bi bi-printer" />
			</div>
		</div>

		<pi-draw-animation
			v-if="showAnimation"
			:draw="PiGraph"
		/>
	</div>
</template>

<style scoped>

</style>
