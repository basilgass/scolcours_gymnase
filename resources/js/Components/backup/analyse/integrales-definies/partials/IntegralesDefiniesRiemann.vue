<template>
	<div
		ref="root"
		class="max-w-lg flex flex-col"
	>
		<div ref="riemann" />
		<div class="space-x-5 flex justify-center items-center mt-5">
			<button
				class="btn"
				:disabled="rectangles<=2"
				@click="updateRectangles(-1)"
			>
				-
			</button>
			<span>
				{{ rectangles }}
			</span>
			<button
				class="btn"
				@click="updateRectangles(1)"
			>
				+
			</button>
		</div>
	</div>
</template>
<script setup>
import {onMounted, ref} from "vue"
import {PiDraw} from "pidraw/esm"

const root = ref(null),
	riemann = ref(null),
	rectangles = ref(8)


let graph, riemannfx

function loadRieman() {
	// Generate the graph function
	graph = new PiDraw(riemann.value)
	graph.axis()
	// Load the function
	riemannfx = graph.plot("(x-1)*(x-5)*(x-7)/20+3")
	// Draw the rieman
	riemannfx.riemann(2, 8, rectangles.value)
}

function updateRectangles (value) {
	if (rectangles.value <= 2 && value < 0) {return}
	rectangles.value = rectangles.value + value

	// update the rectangle
	riemannfx.riemann(2, 8, rectangles.value)
}

onMounted(() => {
	katexAutoRender(root.value)

	loadRieman()
})
</script>
