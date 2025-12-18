<script lang="ts" setup>
// TODO: permettre l'affichage de la réponse.
// TODO: retravailler pour être plus facile à modifier / debogguer
import {computed, onMounted, ref, useTemplateRef} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"
import {
	itemGraphInterface,
	kbrdStudyButtons,
	POINT_TYPES,
	studyButtonKeys,
	studyButtonsKeysType,
	studyConfigInterface,
	studyDrawConfigInterface,
	StudyGraph
} from "@/Components/Keyboards/KeayboardHelpers/KeyboardStudyHelpers.ts"
import KeyboardStudyButton from "@/Components/Keyboards/KeayboardHelpers/KeyboardStudyButton.vue"
import KeyboardStudyCreatedList from "@/Components/Keyboards/KeayboardHelpers/KeyboardStudyCreatedList.vue"

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
		parseStringToKeyboard(value)
	}

	const output = validateOutput()

	return {
		input: output,
		tex: "",
		raw: config.value.show.raw ? graph.rootSVG.svg() : ""
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
 * Conversion des réponses en un texte utilisé pour comparer (checker)
 */
function validateOutput(): string {
	let output = ""

	// cas où la fonction est appelée avant la création du graphe.
	if (!graph) return ""

	if (config.value.plot.enable) {
		const arr = []

		for (const item of graph.items) {
			arr.push(graph.itemToAnswer(item))
		}

		const envCtrls = graph.itemToAnswer(graph.getItem('env'))
		if (envCtrls !== "env") arr.push(envCtrls)

		output = arr.sort().join(",")
	} else {
		output = [...graph.items.map(el => el.id)].sort().join(",")
	}

	return output
}

// Code specific to Study.
// le graph principal, créé lors du montage du composant.
let graph: StudyGraph

// utilisé pour la réactivité dans les sous-composants
const loadedItems = ref<itemGraphInterface[]>([])

// Objet de référence pour le SVG
const draw = useTemplateRef<HTMLDivElement>('draw')

// Composant du clavier, utilisé pour remettre à zéro
const keyboardUI = useTemplateRef<InstanceType<typeof KeyboardDisplay>>('keyboardUI')

// paramètres du graphe.
const config = computed<studyConfigInterface>(() => {
	const cfg = props.keyboard.parameters.concat(props.keyboard.values)

	// Valeurs par défaut
	const dict: studyConfigInterface = {
		show: {
			fx: [],
			graph: false,
			raw: false
		},
		plot: {
			enable: false,
			fx: null
		},
		buttons: {
			available: [...studyButtonKeys],
			auto: false,
			live: false
		},
		draw: {
			config: makeConfig()
		}
	}

	if (cfg.length > 0) {
		for (const opt of cfg) {
			if (opt.startsWith('btns=')) {
				dict.buttons.available = opt.substring(5)
					.split(",")
					.filter(x => Object.hasOwn(kbrdStudyButtons, x)) as studyButtonsKeysType[]
			} else if (opt === "g") {
				dict.show.graph = true
			} else if (opt === "auto") {
				dict.buttons.auto = true
				dict.buttons.live = false
			} else if (opt === "hint") {
				dict.buttons.auto = true
				dict.buttons.live = true
			} else if (opt === "trace") {
				dict.show.graph = true
				dict.plot.enable = true
			} else if (opt === "raw") {
				dict.show.raw = true
			} else if (opt.startsWith("f=")) {
				dict.show.fx.push(opt.split("f=")[1])
			} else if (opt.startsWith("p=")) {
				dict.plot.enable = true
				dict.plot.fx = opt.split("p=")[1]
			} else if (opt.startsWith("cfg=")) {
				const cfgValues = opt.split("=")
				cfgValues.shift()
				dict.draw.config = makeConfig(cfgValues.join('='))
			}
		}
	}
	return dict
})

// configration de l'objet PiDraw.
function makeConfig(value?: string): studyDrawConfigInterface {
	// value= cfg=x=-3:3,y=-3:3,unit=3;4
	const output = {
		xMin: -10,
		xMax: 10,
		yMin: -10,
		yMax: 10,
		xUnit: 1,
		yUnit: 1,
		ppu: 40
	}

	if (value === undefined || value === '') return output

	value.split(',')
		.forEach(item => {
			if (item.startsWith('x=')) {
				const [min, max] = item.substring(2).split(':').map(Number)
				output.xMin = min
				output.xMax = max
			} else if (item.startsWith('y=')) {
				const [min, max] = item.substring(2).split(':').map(Number)
				output.yMin = min
				output.yMax = max
			} else if (item.startsWith('unit=')) {
				const [x, y] = item.substring(5).split(';').map(Number)
				output.xUnit = x
				output.yUnit = y
			} else if (item.startsWith('ppu=')) {
				output.ppu = +item.substring(4)
			}
		})

	return output
}

const display = ref({input: "", tex: "", raw: ""})
const message = ref("")

// const items = ref<studyItemType[]>([])
// const itemsGraph = ref<Record<string, itemGraphInterface>>({})

const availableButtons = computed<studyButtonsKeysType[]>(() => {
	if (config.value.buttons.auto === false) return config.value.buttons.available

	// on filtre les boutons en fonction de la réponse attendue
	// live===true ? et de ce qui est déjà donné.
	const arr: string[] = parseAnswerToKeys(props.reference)
	if (config.value.buttons.live) {
		const given: string[] = parseAnswerToKeys(validateOutput())

		given.forEach(item => {
			const index = arr.findIndex(x => x === item)
			if (index !== -1) {
				arr.splice(index, 1)
			}
		})
	}

	return [...new Set(arr)] as studyButtonsKeysType[]
})

function parseAnswerToKeys(value: string): studyButtonsKeysType[] {
	const arr: studyButtonsKeysType[] = []

	value.split(',').forEach(item => {
		if (item.startsWith('y=')) {
			// AO ou AH
			arr.push(item.includes('x') ? 'ao' : 'ah')
		} else if (item.startsWith('x=')) {
			// AV
			arr.push('av')
		} else if (item.startsWith('env')) {
			// pas de bouton environnement
		} else {
			arr.push(item.split('(')[0] as studyButtonsKeysType)
		}
	})

	return arr
}

onMounted(() => {
	graph = new StudyGraph(draw.value, config.value.plot.enable)

	// Création des plots de départ
	if (config.value.show.fx.length > 0) {
		config.value.show.fx.forEach((f, index) => {
			graph.addInitialPlot(f, index)
		})
	}

	// Création des points de contrôle de l'environnement
	graph.addEnvTracePoints()

	// Add resize observer
	const resizeObserver = new ResizeObserver(() => {
		graph.update()
	})
	resizeObserver.observe(draw.value)

	// debug
	// parseStringToKeyboard('o(0;3),z(-4;0),x=-3&LT&RT,_(3;4),env&LB&RT')
})

function addItemToGraph(btn: string): undefined | itemGraphInterface {
	// Checker.
	message.value = ""

	let item: itemGraphInterface

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
			item = graph.addAO(display.value.input)

		} else if (btn === "av") {
			if (equ[0] !== "x") {
				message.value = "Ce n'est pas une asymptote verticale"
				return
			}
			item = graph.addAV(equ[1])

		} else if (btn === "ah") {
			if (equ[0] !== "y") {
				message.value = "Ce n'est pas une asymptote horizontale"
				return
			}
			item = graph.addAH(equ[1])
		}
	} else if (btn === "!") {
		display.value.input = "!!"
		// TODO: le cas où il n'y a rien à mettre ?
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

		item = graph.addPoint(btn as POINT_TYPES, {x, y})
	}

	// Hide controls if necessary
	if (!config.value.plot.enable) {
		// TODO: handle much better the enablePlot system
		// basically: do not create them if not needed!
		// removeControlsAndBezier(display.value.input)
	}

	// Reset the keyboard
	keyboardUI.value.resetKeyStrokes()

	// Update the graph
	onChange()

	loadedItems.value.push(item)
	return item
}

function removeAllItems() {
	graph.removeAllItems(config.value.plot.enable)
	loadedItems.value = []
	onChange()
}


function removeItem(item: itemGraphInterface) {
	graph.removeItem(item)
	loadedItems.value = [...graph.items.filter(el => el.id !== 'env')]
	onChange()
}

function plotGraph() {
	graph.plotGraph()
	onChange()
}

function getCoordinates(item: string): [string | undefined, string | undefined] {
	const [a, b] = item.split(';')

	if (b === undefined) return [undefined, undefined]

	const x = a.split('(')
	x.shift()
	const y = b.split(')')
	y.pop()
	return [
		x.join('('),
		y.join(')')
	]
}

function parseStringToKeyboard(value: string) {

	value.split(",")
		.forEach((item) => {
			// Adding points.
			const [x, y] = getCoordinates(item)

			if (x !== undefined && y !== undefined) {
				let type = item.split("(")[0]

				display.value.input = `(${x};${y})`
				addItemToGraph(type === "" ? "p" : type)
			} else {
				// Plotting asymptotes
				// Adding asymptotes.
				const [equ, ...ctrls] = item.split("&")

				display.value.input = equ

				let el: itemGraphInterface
				if (equ.substring(0, 2) === "x=") {
					el = addItemToGraph("av")
				} else if (equ.match(/x/) && equ.match(/y/)) {
					el = addItemToGraph("ao")
				} else if (equ.substring(0, 2) === "y=") {
					el = addItemToGraph("ah")
				} else if (equ === 'env') {
					el = graph.getItem('env')
				}

				if (el) {
					ctrls.forEach((key) => {
						graph.onClick(el.controls[key])
					})
				}
			}
		})

	plotGraph()
}


const showControls = ref(true)

function toggleControls() {
	showControls.value = !showControls.value

	graph.items
		.filter(obj => obj.controls)
		.forEach(obj => {
			Object.values(obj.controls).forEach(pt => {
				if (showControls.value) {
					pt.show()
				} else {
					pt.hide()
				}
			})
		})

}
</script>

<template>
	<article class="keyboard-study grid grid-cols-1 @xl:grid-cols-2 gap-3">
		<div>
			<!-- Visual output - qui est remonte en tant que "raw"-->
			<div
				ref="draw"
				class="min-w-[1em]"
			/>
			<div
				class="text-xs cursor-pointer"
				@click="toggleControls"
			>
				<i :class="['bi mr-1', showControls?'bi-eye':'bi-eye-slash']" /> contrôles
			</div>

			<!-- Trace button -->
			<div
				v-if="config.plot.enable"
				class="text-center mt-2"
			>
				<button
					class="btn btn-primary btn-xs px-10 py-2"
					@click="plotGraph"
				>
					tracer le graphe
				</button>
			</div>
		</div>

		<!-- keyboard -->
		<div
			class="keyboard keyboard-study-keyboard flex flex-col gap-3"
		>
			<div class="min-h-[3.4em] grid place-items-center">
				<!-- Keyboard inputs -->
				<div
					v-katex.boxed.nomargin="display.input ? display.tex : '\\color{#999}\\text{entrer une valeur...}'"
					class="w-full"
				/>
			</div>

			<!-- types d'objet à insérer -->
			<div class="keyboard flex flex-wrap gap-3 justify-center">
				<keyboard-study-button
					v-for="key of availableButtons"
					:key="key"
					:button="key"
					@click="addItemToGraph(key)"
				/>
			</div>
			<transition name="slide-down">
				<div
					v-if="message"
					v-katex.auto="message"
					class="text-center text-red-500 text-sm bg-red-50 rounded border border-red-200"
				/>
			</transition>

			<KeyboardDisplay
				ref="keyboardUI"
				back
				keyboard="algebra"
				reset
				@change="display = $event"
				@clear="message=''"
			/>

			<!-- currently loaded elements (point, max, min, av, ...) -->
			<keyboard-study-created-list
				:items="loadedItems as itemGraphInterface[]"
				@remove-item="removeItem"
				@remove-all="removeAllItems"
			/>
		</div>
	</article>
</template>
