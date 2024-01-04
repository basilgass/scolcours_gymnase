<!--
Affichage d'un PiDraw
// TODO: doit être remodeler pour plus de robustesse et optimiser
-->
<script lang="ts" setup>
import { computed, inject, onMounted, ref, watch } from "vue"
import { PiDraw } from "pidraw/esm"

import VueSlider from "vue-slider-component/dist/vue-slider-component.umd.min"
import "vue-slider-component/theme/material.css"
import { PiMath } from "pimath/esm"
import katex from "katex"
import { useResizeObserver } from "@vueuse/core"
import { parserPreprocess } from "pidraw/esm/Parser"

const emits = defineEmits(["update"])

// Get the script value
let blockScriptResult = inject("blockScriptResult", ref({}))

// SVG drawing container
let drawWrapper = ref(null)

// Incoming props
let props = defineProps({
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
	axis: { type: Boolean, default: true }
})

// Sliders reactivity and methods
let sliders = ref([]),
	texCode = ref("")

let texOutput = computed(() => {
	let tex = texCode.value
	sliders.value.forEach((slider) => {
		tex = tex.replaceAll(slider.key, slider.value)
	})

	return tex.replaceAll("+-", "-").replaceAll("--", "+")
})

/** Get the visibility buttons for figures
 * name=code->options,btn
 */
type ParserPrepocessType = { label: string, key: string, code: string[], options: string[] }
let visibilityButtons = ref([])

function getVisibilityButtons() {
	visibilityButtons.value = []

	// Check if btn is somewhere in the code.
	if (props.draw.code.split("btn").length === 1) {
		return
	}

	// There is at least one button.
	for (let row of props.draw.code.split("\n")) {
		const c = parserPreprocess(row) as ParserPrepocessType

		const optionCode = c.options.filter(x => x.split(":")[0] === "btn")
		if (optionCode.length === 1) {
			// btnCode
			const [, name] = optionCode[0].split(":")

			// check if the name is not already used.
			// if it's the case, add the figure to the "related" array.
			const btnWithRelations = visibilityButtons.value.filter(btn=>btn.label===name)
			if(btnWithRelations.length===1){
				btnWithRelations[0].related.push(c.label)
			}else {
				visibilityButtons.value.push(
					{
						label: name,
						figure: c.label,
						visible: true,
						related: []
					}
				)
			}
		}
	}
}

function visibilityButtonsToggle(btn) {
	// Change the visibility of the button
	btn.visible = !btn.visible

	PiGraph.figures.forEach(fig => {
		if (fig.name === btn.figure || btn.related.includes(fig.name)) {
			btn.visible ? fig.show() : fig.hide()
		}
	})


}

/** Get the sliders from the "header" of the code parts
 * $NAME=a,b,...,c/interval=default
 */
function getSliders() {
	// All slider are like: $a=...
	sliders.value = []
	for (let row of props.draw.code.split("\n")) {
		if (row[0] === "$") {
			const rowData = row.split("="),
				rowKey = rowData.shift(),
				rowItem = rowData.join("=")

			// Output
			if (rowKey === "$tex") {
				texCode.value = rowItem
				continue
			}

			// $a=a,b,...,c/interval=default
			// interval not given => interval = b-a
			// b-a: marks separation... or maybe all given manually !
			// default value given at start.
			//TODO: add labels to pi-draw-parser

			if (rowItem !== "") {
				let marks = rowItem.match(/^([-0-9.,]+)/),
					a,
					b,
					c,
					marksInterval,
					interval = rowItem.match(/\/([0-9.]+)/),
					dft = rowItem.match(/=([-0-9.]+)$/)

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
						marks = marks.map((x) => +x)
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

let PiGraph,
	PiParser,
	PiParserHasErrors = ref(false)

let stepperStart = ref(false),
	stepperMax = computed(() => props.draw.code.split("\n\n").length),
	stepperIndex = ref(0),
	stepperText = computed(() => {
		const step = drawCode.value.split("\n\n")[stepperIndex.value]
		if (step !== undefined) {
			let steps = step.split("\n")
			if (steps[0].startsWith("%")) {
				return steps[0].substring(1)
			}
		}
		return ""
	})

let drawCode = computed(() => {
	let outputCode = props.draw.code

	// Modify the code using the local information (sliders)
	if (sliders.value.length > 0) {
		// Remove the lines starting with $ (dollar sign)
		let code = outputCode
			.split("\n")
			.filter((row) => row[0] !== "$")

		// Modify the value of all variables ($a, $b, ...)
		outputCode = code
			.map((row) => {
				sliders.value.forEach((slider) => {
					if (row.split("=")[0].includes("(x)")) {
						row = row.replaceAll(
							slider.key,
							`(${slider.value})`
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
	if (Object.values(blockScriptResult.value).length > 0) {
		for (let key in blockScriptResult.value) {
			outputCode = outputCode.replaceAll(
				`$${key}`,
				blockScriptResult.value[key]
			)
		}
	}

	if (stepperStart.value && stepperMax.value > 1) {
		return outputCode
			.split("\n\n")
			.slice(0, stepperIndex.value + 1)
			.join("\n\n")
	} else {
		return outputCode
	}
})


function PiParserUpdate(from, withSliders = false) {
	if (withSliders) {
		getSliders()
	}

	getVisibilityButtons()

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

let figures = ref({})

onMounted(() => {
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

	PiGraph.texConverter = {
		toTex: katex.renderToString,
		options: {
			throwOnError: false,
			displayMode: true
		}
	}


	if (props.axis) {
		PiGraph.axis()
	}

	PiParser = PiGraph.parse("")

	if (props.draw.parameters) {
		PiParser.updateLayout(props.draw.parameters)
	}

	if (drawCode.value) {
		PiParserUpdate("onMounted", true)
	}

	// Add a resizeObserver on the draw container
	useResizeObserver(drawWrapper.value, () => {
		PiParserUpdate("onResize", true)
		PiParser.updateLayout(props.draw.parameters)
		PiParser.update(drawCode.value, true)
	})
})

let drawMouseUp = function() {
	emits("update", PiGraph.figures)
}

// TODO: make PiDrawParser much better vue compatible (reactive) and using computed properties.
watch(drawCode, (code, before) => {
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
</script>

<template>
	<div :class="PiParserHasErrors ? 'bg-red-100' : ''">
		<!-- draw graph-->
		<div
			ref="drawWrapper"
			class="katex-m-0"
			@mouseup="drawMouseUp"
		/>

		<!-- visibility buttons -->
		<div
			v-if="visibilityButtons.length > 0"
			class="w-full flex flex-wrap gap-3 mt-2"
		>
			<button
				v-for="btn of visibilityButtons"
				:key="btn.figure"
				v-katex.auto="`${btn.visible?'cacher':'afficher'} ${btn.label}`"
				class="btn btn-xs"
				@click="visibilityButtonsToggle(btn)"
			/>
		</div>

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
			v-if="sliders.length > 0 || texCode !== ''"
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
