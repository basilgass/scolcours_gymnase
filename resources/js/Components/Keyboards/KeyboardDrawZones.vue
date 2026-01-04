<script lang="ts" setup>
import {PiDraw} from "pidraw"
import {computed, nextTick, onMounted, ref, useTemplateRef} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"
import {NumExp} from "pimath"

const svgContainer = useTemplateRef<InstanceType<typeof PiDrawParser>>('svgContainer')

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
let pidraw: PiDraw = null
type FigureType = typeof pidraw.figures[0]

function onChange(value?: { draw: PiDraw, mouse: MouseEvent }): void {
	// pidraw = value.draw
	const target = value.mouse?.target as SVGElement

	if (target && target.dataset?.zone) {
		zones[target.dataset.zone] = !zones[target.dataset.zone]
	}

	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {

	// { draw: PiDraw, mouse: MouseEvent }
	if (value !== undefined) {
		// pidraw.update([], true)
		reset()

		value.split(',').forEach(zone => {
			if (Object.hasOwn(zones, zone)) {
				zones[zone] = true
			}
		})
	}

	const inputs: string[] = []

	for (const name in zones) {
		const poly = pidraw.figures[name] as FigureType
		if (zones[name]) {
			inputs.push(name)
			poly.fill(color.value)
		} else {
			poly.shape.fill('transparent')
		}
	}

	inputs.sort()

	return {
		input: inputs.join(','),
		tex: "",
		raw: getSvg()
	}
}

function getSvg() {
	return pidraw.rootSVG.svg()
}

function reset() {
	for (const zone in zones) {
		zones[zone] = false
	}
}

defineExpose<KeyboardExposeInterface>({
	reset,
	setInput,
	parameters: ""
})

/* ------------------*/
const code = ref<string>("")
const parameters = ref<string>("")
const zones: Record<string, boolean> = {}
const color = ref<string>("")

const draw = computed(() => {
	return {
		parameters: parameters.value,
		code: code.value,
	}
})

function makeColumnPoints(expression: NumExp, x: number, index: number, visibility: boolean): string[] {
	const y = expression.evaluate({x})

	const dy = 20

	return [
		`P${index}(${x},${y + dy})`,
		`L${index}(${x},${y})->o,fill=black${visibility ? '' : ',!'}`,
		`N${index}(${x},${y - dy})`,
	]
}

function makePolygons(index: number): string[] {
	zones[`p${index + 1}`] = false
	zones[`n${index + 1}`] = false

	return [
		`p${index + 1}=poly L${index},L${index + 1},P${index + 1},P${index}->w=0`,
		`n${index + 1}=poly L${index},L${index + 1},N${index + 1},N${index}->w=0`
	]

}

function makeInput() {
	const inputs = props.keyboard.parameters.find(p => p.startsWith('input='))?.split('input=')[1].split(',') ?? []
	if (inputs.length > 0) {
		inputs.forEach(inp => {
			zones[inp] = false
		})
		code.value = props.keyboard.values.join('\n')
		return
	}

	const ao = props.keyboard.parameters.find(p => p.startsWith('ao='))?.split('ao=')[1]
	const tos = props.keyboard.parameters.find(p => p.startsWith('tos='))?.split('tos=')[1]

	if (ao && tos) {
		const codeLines: string[] = []
		const codeZones: string[] = []
		codeLines.push(`a=line ${ao}->green,w=2`)

		const [zeroesStr, signsStr] = tos.split('@')
		const zeroes = zeroesStr.split(",")
		const signs = signsStr.split("")
		const expression = new NumExp(ao.split('=')[1])

		codeLines.push(...makeColumnPoints(expression, -20, 0, false))


		zeroes.forEach((zero, index) => {
			const sign = signs[2 * index + 1]
			if (sign === 'z') {
				// codeLines.push(`Z${index}(${zero},${expression.evaluate({x: +zero})})`)
				codeLines.push(`z${index}=line x=${zero}->dot,gray,w=2`)
			} else if (sign === 'd') {
				codeLines.push(`v${index}=line x=${zero}->red`)
			}

			codeLines.push(...makeColumnPoints(expression, +zero, index + 1, sign === 'z'))
			codeZones.push(...makePolygons(index))
		})

		codeLines.push(...makeColumnPoints(expression, 20, zeroes.length + 1, false))
		codeZones.push(...makePolygons(zeroes.length))

		codeLines.push(...codeZones)

		code.value = codeLines.join('\n')
		return
	}

	console.warn('Aucune valeur de génération reconnue pour les zones.')
}

onMounted(() => {
	parameters.value = props.keyboard.parameters.find(p => p.startsWith('p='))?.substring(2) ?? "axis,grid,x=-5:5,y=-5:5"
	color.value = props.keyboard.parameters.find(p => p.startsWith('color='))?.substring(6) ?? 'yellow/0.4'

	makeInput()

	// Pour toutes les zones clickable, on ajoute un "data-zone" après le dessin
	nextTick(() => {
		Object.keys(zones).forEach(name => {
			const poly = pidraw.figures[name]

			if (poly) {
				poly.shape.attr({'data-zone': name})
			}
		})
	})

})

function onComponentMounted(draw: PiDraw) {
	pidraw = draw

	nextTick(() => {
		onChange({draw, mouse: null})
	})

}
</script>

<template>
	<div>
		<pi-draw-parser
			ref="svgContainer"
			:draw
			@mounted="onComponentMounted"
			@draw-click="onChange"
		/>
	</div>
</template>
