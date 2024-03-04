<!--
Affichage d'un PiDraw
// TODO: doit être remodeler pour plus de robustesse et optimiser
-->
<script lang="ts" setup>
import { computed, inject, onMounted, provide, ref, watch } from "vue"
import { PiDraw } from "pidraw/esm"

import VueSlider from "vue-slider-component/dist/vue-slider-component.umd.min"
import "vue-slider-component/theme/material.css"
import { PiMath } from "pimath/esm"
import katex from "katex"
import { useResizeObserver } from "@vueuse/core"
import PiDrawParserVisibility from "@/Components/Pi/Parts/PiDrawParserVisibility.vue"
import type { Graph } from "pidraw/esm/Graph"
import type { Parser } from "pidraw/esm/Parser"

const emits = defineEmits(["update"])

// Get the script value
const postData = inject("postData", ref({}))

// SVG drawing container
const drawWrapper = ref<HTMLElement>(null)

// Incoming props
const props = defineProps({
	width: { type: Number, default: 400 },
	height: { type: Number, default: 320 },
	draw: {
		type: Object,
		default: () => {
			return {
				code: "",
				parameters: ""
			}
		}
	},
})

// Line by line code
const codeArray = computed(() => {
	return props.draw.code.split("\n")
})

// Main draving system - not reactive !
let PiGraph: Graph,
	PiParser: Parser,
	PiParserHasErrors = ref(false),
	figures = ref({})

// ------------------------
// SLIDER PART
// Sliders reactivity and methods
const sliders = ref([])

// Display text with sliders modifications.
const texOutput = computed(() => {
	// Get the output code: starting with $tex=
	let tex = codeArray.value.filter(line => line.startsWith("$tex="))[0]
	if (tex === undefined) return ""

	// Get the raw code
	tex = tex.split("$tex=")[1]

	// Update the raw code with the sliders values.
	sliders.value.forEach((slider) => {
		tex = tex.replaceAll(slider.key, slider.value)
	})

	// Return the tex code (reformatted)
	return tex
		.replaceAll("+-", "-")
		.replaceAll("--", "+")
})

/** Get the sliders from the "header" of the code parts
 * $NAME=a,b,...,c/interval=default
 */
function getSliders() {
	// All slider are like: $a=...
	sliders.value = []
	for (const row of codeArray.value) {
		if (row[0] === "$") {
			const rowData = row.split("="),
				rowKey = rowData.shift(),
				rowItem = rowData.join("=")

			// TeX output : no need to process
			if (rowKey === "$tex") continue

			// $a=a,b,...,c/interval=default
			// interval not given => interval = b-a
			// b-a: marks separation... or maybe all given manually !
			// default value given at start.
			// prevent parenthesis wrap

			if (rowItem !== "") {
				let marks = rowItem.match(/^([-0-9.,]+)/),
					a: number,
					b: number,
					c: number,
					marksInterval: number,
					interval = rowItem.match(/\/([0-9.]+)/),
					dft = rowItem.match(/=([-0-9.]+)/),
					wrap = !rowItem.match(/~$/)

				if (marks) {
					marks = marks[1].split(",")
					if (marks.includes("...")) {
						if (marks.length === 3) {
							// a,...,c
							a = +marks[0]
							marksInterval = 1
							c = +marks[2]

							if (c <= a) {
								continue
							}

							marks = []
							for (let i = a; i <= c; i++) {
								marks.push(i)
							}
						} else if (marks.length === 4) {
							a = +marks[0]
							b = +marks[1]
							marksInterval = b - a
							c = +marks[3]

							if (marksInterval <= 0.01) {
								continue
							}
							marks = []
							for (let i = a; i <= c; i += marksInterval) {
								marks.push(
									PiMath.Numeric.numberCorrection(i)
								)
							}
						}
					} else {
						marks = marks.map((x: number) => +x)
					}
				} else {
					continue
				}

				if (interval) {
					interval = +interval[1]
				} else {
					interval = PiMath.Numeric.numberCorrection(
						marks[1] - marks[0]
					)
				}

				if (dft) {
					dft = +dft[1]
				} else {
					dft = marks[0]
				}

				sliders.value.push({
					key: rowKey,
					value: dft,
					wrap,
					options: {
						min: marks[0],
						max: marks[marks.length - 1],
						interval: interval,
						marks: marks,
						tooltip: "none"
					}
				})
			}
		}
	}
}

// ------------------------
// STEPPER PARTS
const stepperStart = ref(false),
	stepperMax = computed(() => props.draw.code
		.split("\n\n")
		.filter((step: string) => !step.startsWith("%-FG-"))
		.length
	),
	stepperIndex = ref(0),
	stepperText = computed(() => {
		const step = drawCode.value.split("\n\n")[stepperIndex.value]
		if (step !== undefined) {
			const steps = step.split("\n")
			if (steps[0].startsWith("%")) {
				return steps[0].substring(1)
			}
		}
		return ""
	}),
	stepperForeground = function(code: string) {
		const [before, after] = code.split("%-FG-")
		return [
			before,
			(after === undefined || after.trim() === "") ? "" : after
		]
	}

/**
 * DrawCode system
 * 1. apply sliders values
 * 2. apply scripts values
 * 3. apply steppers values.
 */
const drawCode = computed(() => {
	let outputCode = props.draw.code

	// Modify the code using the local information (sliders)
	if (sliders.value.length > 0) {
		// Remove the lines starting with $ (dollar sign)
		const code = outputCode
			.split("\n")
			.filter((row: string) => row[0] !== "$")

		// Modify the value of all variables ($a, $b, ...)
		outputCode = code
			.map((row: string) => {
				sliders.value.forEach((slider) => {
					if (row.split("=")[0].includes("(x)")) {
						row = row.replaceAll(
							slider.key,
							slider.wrap?`(${slider.value})`:`${slider.value}`
						)
					} else {
						row = row.replaceAll(slider.key, slider.value)
					}
				})
				return row
			})
			.join("\n")
	}

	// Modify the code according to the script level
	if (Object.values(postData.value).length > 0) {
		for (const key in postData.value) {
			outputCode = outputCode.replaceAll(
				`$${key}`,
				postData.value[key]
			)
		}
	}

	// Split the code
	if (stepperMax.value > 1) {
		const [stepsPart, FGPart] = stepperForeground(outputCode)

		const crtIndex = stepperStart.value ? stepperIndex.value : stepperMax.value

		return stepsPart
				.split("\n\n")
				.slice(0, crtIndex + 1)
				.filter((step, index) => {
					if (step.slice(0, 2) === "%<") {
						const constrains = step.split("%<")[1].split(">")[0]

						// It contains just a star : visible only for the corresponding step
						if (constrains === "*") {
							return index === crtIndex
						}

						// Might be a list of comma separated values.
						const values = constrains
							.split(",")
							.map(value => {
								if (value.includes("-")) {
									const [min, max] = value.split("-").map(x => +x)
									const v = []
									for (let i = min; min <= max; i++) {
										v.push(i)
									}
									return v
								} else if (Number.isSafeInteger(+value)) {
									return +value
								}
							})
							.flat()

						return values.indexOf(crtIndex) !== -1
					}

					return true
				})
				.join("\n\n")
			+ FGPart
	} else {
		return outputCode
	}
})

function PiParserUpdate(from: string, withSliders = false) {
	// Get the sliders
	if (withSliders) getSliders()

	// Update the drawing
	try {
		PiParser.update(drawCode.value)
		emits("update", PiGraph.figures)
		PiParserHasErrors.value = false
	} catch (e) {
		console.warn("Cannot parse from: " + from)
		console.warn(drawCode.value)
		PiParserHasErrors.value = true
	}
}


// Create the non reactive objects on mounted
// PiGraph : display SVG
// PiParser: convert string code to PiGraph data
// Build the resizeobserver...
onMounted(() => {
	// Default settings
	PiGraph = new PiDraw(drawWrapper.value, {
		width: props.width,
		height: props.height,
		origin: {
			x: 200,
			y: 160
		},
		grid: {
			x: 20,
			y: 20
		}
	})

	// KaTeX converter
	PiGraph.texConverter = {
		toTex: katex.renderToString,
		options: {
			throwOnError: false,
			displayMode: true
		}
	}

	// Add axis
	PiGraph.axis()

	// Enable the parser system
	PiParser = PiGraph.parse("")

	// Add a resizeObserver on the draw container
	useResizeObserver(drawWrapper.value, () => {
		PiParserUpdate("onResize", true)
		PiParser.updateLayout(props.draw.parameters)
		// PiParser.update(drawCode.value, true)
	})
})

// Grab the data when on mouse up for external modifications
const drawMouseUp = function() {
	emits("update", PiGraph.figures)
}

// TODO: make PiDrawParser much better vue compatible (reactive) and using computed properties.
watch(drawCode, () => {
	// Watch changes from "inside"
	PiParserUpdate("drawCode watcher")
})

watch(
	() => props.draw,
	(newValue, oldValue) => {
		if (newValue.code !== oldValue.code) {
			PiParserUpdate("props.draw watcher", true)
		}

		if (newValue.parameters !== oldValue.parameters) {
			try {
				PiParser.updateLayout(newValue.parameters)
			} catch {
				console.warn(
					"Cannot parse (watch props.draw.parameters)",
					props.draw.params
				)
			}
		}
	}
)

defineExpose({ figures })

provide("PiDrawGraph", PiGraph)
</script>

<template>
	<div :class="PiParserHasErrors ? 'bg-red-100' : ''">
		<!-- draw graph-->
		<div
			ref="drawWrapper"
			class="katex-m-0"
			@mouseup="drawMouseUp"
		/>

		<pi-draw-parser-visibility
			v-if="PiGraph"
			:draw="props.draw"
			:graph="PiGraph"
		/>

		<!-- stepper -->
		<div
			v-if="stepperMax > 1"
			class="my-3"
		>
			<div v-if="stepperStart">
				<div class="flex items-center justify-center gap-10">
					<button
						:disabled="stepperIndex <= 0"
						class="px-3 py-2 btn btn-xs"
						@click="stepperIndex--"
					>
						<i class="bi bi-chevron-left" />
					</button>
					<div>{{ stepperIndex + 1 }} / {{ stepperMax }}</div>
					<button
						:disabled="stepperIndex >= stepperMax - 1"
						class="px-3 py-2 btn btn-xs"
						@click="stepperIndex++"
					>
						<i class="bi bi-chevron-right" />
					</button>
				</div>
				<div
					v-katex.auto="stepperText"
					class="my-3"
				/>
			</div>
			<div
				v-else
				class="w-full"
			>
				<button
					:class="`w-full btn-xs btn-scolcours-${
						$page.props.theme?.slug || 'main'
					} tracking-wider d-block`"
					@click="stepperStart = true"
				>
					Marche à suivre
				</button>
			</div>
		</div>

		<!-- slider(s) -->
		<div
			v-if="sliders.length > 0 "
			class="space-y-12 mt-6"
		>
			<vue-slider
				v-for="(slider, index) of sliders"
				:key="`slider-${index}`"
				v-model="slider.value"
				v-bind="slider.options"
				@change="slider.value"
			/>
			<div v-katex="texOutput" />
		</div>
	</div>
</template>
