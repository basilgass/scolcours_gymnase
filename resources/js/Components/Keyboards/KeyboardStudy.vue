<script lang="ts" setup>
// TODO: permettre l'affichage de la réponse.
// TODO: retravailler pour être plus facile à modifier / debogguer
import {onMounted, ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"
import {Bezier, BEZIERCONTROL, IBezierPointInterface, Point} from "pidraw"
import {
	itemGraphInterface,
	ITEMTYPES,
	kbrdStudyButtons,
	POINTTYPES,
	StudyGraph
} from "@/Components/Keyboards/KeayboardHelpers/KeyboardStudyHelpers.ts"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(): void {
	// if (check something) {
	// 	// TOOD: should trigger the validation button automatically.
	//
	// }

	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	if (value !== undefined) {
		// Load the answer
	}

	return {
		input: "",
		tex: "",
		raw: ""
	}
}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
		// no reset.
	},
	setInput,
	parameters: ""
})

/**
 * Keyboards custom configuration
 */


/*
		const output = validateOutput()
		// On valide la réponse
		const validation = new StudyChecker([]).check(props.answer, output)

		emits("change", {
			value: {
				input: output,
				tex: "",
				raw: showRawOutput.value ? graph.rootSVG.svg() : ""
			},
			validation
		})
 */


// Mise en forme de la réponse pour comparaison
const validateOutput = function (): string {
	let output = ""

	if (enablePlot.value) {
		const arr = []
		for (const item of items.value) {
			arr.push(asymptoteToAnswer(item))
		}
		const envCtrls = asymptoteToAnswer("env")
		if (envCtrls !== "env") {
			arr.push(envCtrls)
		}
		output = arr.sort().join(",")
	} else {
		output = [...items.value].sort().join(",")
	}

	return output
}

// Code specific to Study.
//TODO: KeyboardStudy : more rubstness for theOptions (parameters vs values), which are actually concatenated.
let graph: StudyGraph

let plot: Bezier,
	plotResult = ref(null),
	draw = ref(null),
	keyboardUI = ref(null),
	theOptions = ref(props.keyboard.parameters.concat(props.keyboard.values)),
	addButtons = ref([]),
	display = ref({input: "", tex: "", raw: ""}),
	message = ref(""),
	showGraph = ref(false),
	enablePlot = ref(false),
	showRawOutput = ref(false),
	items = ref([]),
	itemsGraph = ref<Record<string, itemGraphInterface>>({})


onMounted(() => {
	let fx = null,
		cfg = {
			xMin: -10,
			xMax: 10,
			yMin: -10,
			yMax: 10,
			xUnit: 1,
			yUnit: 1,
			pixelsPerUnit: 40
		},
		cfgRaw: string = null

	const withButtons = []

	if (theOptions.value.length > 0) {
		for (const opt of theOptions.value) {
			if (opt.includes(",")) {
				const btns = opt.split(",")
				for (const btn of btns) {
					if (kbrdStudyButtons[btn] !== undefined) {
						withButtons.push(btn)
					}
				}

			} else if (opt === "g") {
				showGraph.value = true
			} else if (opt === "trace") {
				showGraph.value = true
				enablePlot.value = true
			} else if (opt === "raw") {
				showRawOutput.value = true
			} else if (opt.startsWith("f=")) {
				fx = opt.split("f=")[1]
			} else if (opt.startsWith("p=")) {
				plotResult.value = opt.split("p=")[1]
			} else if (opt.startsWith("cfg=")) {
				cfgRaw = opt.split("=")[1]
			}
		}
	}

	if (withButtons.length === 0) {
		addButtons.value = ["av", "ah", "ao", "!", "p", "z", "o", "t", "m", "mm", "_"]
	} else {
		addButtons.value = [...withButtons]
	}

	if (cfgRaw !== null) {
		const d = cfgRaw.split("&")
		if (d.length >= 2) {
			cfg.xMin = +d[0].split(":")[0]
			cfg.xMax = +d[0].split(":")[1]
			cfg.yMin = +d[1].split(":")[0]
			cfg.yMax = +d[1].split(":")[1]
			cfg.xUnit = d[2] ? +d[2].split(":")[0] : 1
			cfg.yUnit = d[2] ? +d[2].split(":")[1] : 1
			// let res = d[3] ? +d[3] : 800
			// cfg.pixelsPerUnit = res / (cfg.xMax - cfg.xMin)
		}
	}

	graph = new StudyGraph(draw.value, enablePlot.value)

	if (fx !== null) {
		const fxs = fx.split("|")
		for (const f of fxs) {
			initPlot(f)
		}
	}

	itemsGraph.value["env"] = graph.addEnvTracePoints()


	// Add resize observer
	const resizeObserver = new ResizeObserver(() => {
		graph.update()
	})

	resizeObserver.observe(draw.value)

	// Update the value
	// nextTick().then(()=>changeEvent())
})

function initPlot(fx) {
	let plotData: string[] = fx.split("&"),
		plot: string = plotData.shift(),
		domain: { min: number, max: number } = {min: -8, max: 8}, // TODO: il faut gérer les domain,
		samples = 20,
		color = "blue"

	for (const d of plotData) {
		if (!isNaN(+d)) {
			samples = +d
		} else if (d.includes(":")) {
			const [min, max] = d.split(":").map(x => +x)
			domain = {min, max}
		} else {
			color = d
		}
	}

	console.log(plot, samples, domain)

	try {
		const p = graph.create.plot({
			expression: plot,
			samples,
			domain
		}, "f")
		p.stroke(color)
	} catch {
		console.warn("Error parsing", fx)
	}
}

function addItemToGraph(btn): void {
	// Checker.
	message.value = ""

	if (btn.startsWith("a")) {
		const value = display.value.input
		const equ = value.split("=")

		if (equ.length !== 2) {
			message.value = "L'équation de la droite n'est pas correcte"
			return
		}

		if (equ[0] !== "x" && equ[0] !== "y") {
			message.value = "L'équation de la droite n'est pas correcte"
			return
		}

		if (btn === "ao") {
			if (!value.match(/x/) || !value.match(/y/)) {
				message.value = "Ce n'est pas une asymptote oblique"
				return
			}
			itemsGraph.value[display.value.input] = graph.addAO(display.value.input)

		} else if (btn === "av") {
			if (equ[0] !== "x") {
				message.value = "Ce n'est pas une asymptote verticale"
				return
			}
			itemsGraph.value[display.value.input] = graph.addAV(equ[1])

		} else if (btn === "ah") {
			if (equ[0] !== "y") {
				message.value = "Ce n'est pas une asymptote horizontale"
				return
			}
			itemsGraph.value[display.value.input] = graph.addAH(equ[1])
		}
	} else if (btn === "!") {
		display.value.input = "!!"
		itemsGraph.value["!!"] = null
	} else {
		if (!(display.value.input.startsWith("(") && display.value.input.endsWith(")") && display.value.input.split(";").length === 2)) {
			message.value = "Ce n'est pas un point"
			return
		}

		const [x, y] = display.value.input
			.substring(1, display.value.input.length - 1)
			.split(";")

		if (btn === "z" && y !== "0") {
			message.value = "Ce n'est pas un zéro"
			return
		}
		if (btn === "o" && x !== "0") {
			message.value = "Ce n'est pas une ordonnée à l'origine"
			return
		}

		itemsGraph.value[display.value.input] = graph.addPoint(btn, {x, y})
	}

	// Hide controls if necessary
	if (!enablePlot.value) {
		// TODO: handle much better the enablePlot system
		// basically: do not create them if not needed!
		// removeControlsAndBezier(display.value.input)
	}

	// Add the element to the list of object created...
	items.value.push(display.value.input)

	// Reset the keyboard
	keyboardUI.value.resetKeyStrokes()

	// Update the graph
	onChange()
}

function displayItem(value): string {
	const item: itemGraphInterface = itemsGraph.value[value]

	if (item === undefined) {
		return "?"
	}

	if (item.type !== ITEMTYPES.POINT) {
		return value
	}

	if (item.kind === POINTTYPES.MIN) {
		return `\\text{min}${value}`
	} else if (item.kind === POINTTYPES.MAX) {
		return `\\text{max}${value}`
	} else if (item.kind === POINTTYPES.REPLAT) {
		return `\\text{replat}${value}`
	} else if (item.kind === POINTTYPES.TROU) {
		return `\\text{trou}${value}`
	}

	return value
}

function removeAllItems() {
	const keys = [...items.value]
	for (const item of keys) {
		removeItem(item)
	}

	if (showGraph.value) {
		if (plot) {
			plot.clear(true)
			plot = null
		}

		if (enablePlot.value) {
			removeControlsAndBezier("env")
			itemsGraph.value["env"] = graph.addEnvTracePoints()
		}
	}
}

function removeItem(item: string) {

	// On supprime l'élément dans la liste des éléments
	items.value.splice(items.value.indexOf(item), 1)

	// On supprime les contrôles et les bezier
	removeControlsAndBezier(item)

	// On supprime l'objet principal
	if (itemsGraph.value[item].element !== null) {
		itemsGraph.value[item].element.clear(true)
	}

	// On supprime l'élément de itemsGraph
	delete itemsGraph.value[item]


	// Update the graph
	onChange()
}

function removeControlsAndBezier(item: string) {
	// Remove the control maxPoints.
	Object.values(itemsGraph.value[item].controls || [])
		.forEach(el => el.clear(true))

	// Remove the bezier maxPoints.
	Object.values(itemsGraph.value[item].bezier || [])
		.forEach(group => group.forEach(el => el.clear(true)))

}

function asymptoteToAnswer(item) {
	// il n'y a rien à montrer...
	if (itemsGraph.value[item] === undefined) {
		return ""
	}

	const ctrls = []
	if (itemsGraph.value[item].type === "point") {
		switch (itemsGraph.value[item].kind) {
			case "m":
				return `m${item}`
			case "mm":
				return `M${item}`
			case "_":
				return `_${item}`
			case "t":
				return `t${item}`
			default:
				return item
		}
	}


	for (const key in itemsGraph.value[item].controls) {
		if (itemsGraph.value[item].controls[key].element.fill() === "green") {
			ctrls.push(key)
		}
	}

	return ctrls.length > 0 ? `${item}&${ctrls.sort().join("&")}` : item
}

function plotGraph() {
	// Remove existing plot.
	if (plot) {
		plot.clear(true)
	}
	// Check the validation -

	// if the result is TRUE, trace the existing value (if it exists).
	// TODO: checking directly.
	// const check = new StudyChecker().check(validateOutput(), props.answer)
	// if (check.result && plotResult.value) {
	// 	initPlot(plotResult.value)
	// 	return
	// }

	// Get all maxPoints

	// TODO: the ratio should be dynamique - do a second pass by checking the distance between two control points ?
	const ratio = 0.2
	let ctrlPoints: IBezierPointInterface[] = []

	for (const item of Object.values(itemsGraph.value)) {
		if (item.type === ITEMTYPES.POINT) {
			ctrlPoints.push({
				point: item.element as Point,
				controls: {
					type: item.beziercontrol,
					ratio,
					left: null,
					right: null
				}
			})
		} else if (item.controls && item.bezier) {
			// Check the selected buttons
			for (const key in item.controls) {
				if (item.controls[key]?.shape?.fill() === "green" && item.bezier[key]) {
					ctrlPoints = ctrlPoints.concat(
						...item.bezier[key]
							.map(pt => {
								return {
									point: pt,
									controls: {
										type: BEZIERCONTROL.SMOOTH,
										ratio,
										left: null,
										right: null
									}
								}
							})
					)
				}
			}
		}
	}

	// Sort the maxPoints.
	ctrlPoints.sort((a, b) => a.point.x - b.point.x)
	plot = graph.addBezier({points: ctrlPoints})

	onChange()
}


// defineExpose({
// 	reset,
// 	loadAnswer: (value) => {
// 		loadAnswerToKeyboard(value, reset, changeEvent, (value) => {
// 			value.split(",").forEach((item) => {
//
// 				// Adding points.
// 				const [x, y] = getCoordinates(item)
//
// 				if (x !== undefined && y !== undefined) {
// 					let type = item.split("(")[0]
//
// 					if (type === "M") {
// 						type = "mm"
// 					}
//
// 					display.value.input = `(${x};${y})`
// 					addItemToGraph(type === "" ? "p" : type)
// 				} else {
// 					// Plotting asymptotes
// 					// Adding asymptotes.
// 					const [equ, ...ctrls] = item.split("&")
//
// 					display.value.input = equ
//
// 					if (equ.substring(0, 2) === "x=") {
// 						addItemToGraph("av")
// 					} else if (equ.match(/x/) && equ.match(/y/)) {
// 						addItemToGraph("ao")
// 					} else if (equ.substring(0, 2) === "y=") {
// 						addItemToGraph("ah")
// 					}
//
// 					ctrls.forEach((key) => {
// 						itemsGraph.value[equ].controls[key].svg.fill("green")
// 					})
// 				}
// 			})
//
// 			plotGraph()
// 		})
// 	},
// 	parameters: "pleins de paramètres à donner..."
// })
</script>

<template>
	<article class="keyboard-study grid grid-cols-1 @xl:grid-cols-2 gap-3">
		<div>
			<!-- Visual output - qui est remonte en tant que "raw"-->
			<div
				ref="draw"
				class="min-w-[1em]"
			/>

			<!-- Trace button -->
			<div
				v-if="enablePlot"
				class="text-center"
			>
				<button
					class="btn btn-primary btn-xs px-10"
					@click="plotGraph"
				>
					tracer le graphe
				</button>
			</div>
		</div>

		<!-- keyboard -->
		<div class="keyboard keyboard-study-keyboard flex flex-col gap-3">
			<div class="min-h-[3.4em] grid place-items-center">
				<!-- Keyboard inputs -->
				<div
					v-katex.boxed.nomargin="display.input ? display.tex : '\\color{#999}\\text{entrer une valeur...}'"
					class="w-full"
				/>
			</div>
			<!-- Keyboard selection -->
			<div class="keyboard flex flex-wrap gap-3 justify-center">
				<button
					v-for="key of addButtons"
					:key="key"
					:title="kbrdStudyButtons[key].description"
					class="key bg-action border rounded px-2 py-1 transition-colors flex-1"
					@click="addItemToGraph(key)"
				>
					{{ kbrdStudyButtons[key].label }}
				</button>
			</div>

			<KeyboardDisplay
				ref="keyboardUI"
				back
				keyboard="algebra"
				reset
				@change="display = $event"
				@clear="message=''"
			/>

			<!-- currently loaded elements (point, max, min, av, ...) -->
			<div class="keyboard-study-items my-3 border-t">
				<h3 class="text-center mt-1 mb-3">
					{{
						items.length === 0 ? "aucun élément créé" : items.length === 1 ? "élément créé" : "éléments créés"
					}}
				</h3>
				<div class="flex gap-1 lg:gap-2 items-baseline justify-center keyboard min-h-[3em]">
					<button
						v-for="item in items"
						:key="item"
						v-katex.ascii.nomargin="displayItem(item)"
						class="key-touch
						bg-action border rounded px-3 py-1
						hover:bg-amber-300 transition-colors"
						@dblclick="removeItem(item)"
					/>
				</div>
				<div
					class="text-center text-red-500 text-sm"
					v-html="message"
				/>
				<div
					v-show="items.length>0"
					class="text-xs text-gray-700 text-center"
				>
					double-cliquer pour supprimer ou
					<button
						class="bg-content border-content px-3 py-1"
						@click="removeAllItems()"
					>
						<i class="bi bi-trash mr-3 text-red-800" />tout supprimer
					</button>
				</div>
			</div>
		</div>
	</article>
</template>
