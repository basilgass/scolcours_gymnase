<script lang="ts" setup>
import {PiDraw, Point as PiDrawPoint} from "pidraw"
import {computed, nextTick, onMounted, ref, useTemplateRef} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"
import {Line, Point, Polynom} from "pimath"

const svgContainer = useTemplateRef<InstanceType<typeof PiDrawParser>>('svgContainer')

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
let pidraw: PiDraw = null

function onChange(value?: { draw: PiDraw, mouse: MouseEvent }): void {
	// pidraw = value.draw
	setInput().then((x) => emits("change", x))
}

function getLineEquation(): Line {
	if (!pidraw) return null
	if (points.value.length === 0) return null

	const pts: PiDrawPoint[] = points.value
		.map(key => (pidraw.figures[key] as unknown as PiDrawPoint) ?? null)
		.filter(x => x !== null)

	const pt1 = pidraw.toCoordinates(pts[0])
	const pt2 = pidraw.toCoordinates(pts[1])
	return new Line().fromPoints(
		new Point(pt1.x, pt1.y),
		new Point(pt2.x, pt2.y))
}

function updatePoint(key: string, value: { x: number, y: number }) {
	// coordonnées en pixels
	const pixels = pidraw.toPixels(value)

	// les points à modifier : référence et drag
	const pts: PiDrawPoint[] = [
		pidraw.figures[key] as unknown as PiDrawPoint,
		pidraw.figures[`${key}_drag`] as unknown as PiDrawPoint
	]

	// mise à jour des points
	pts.forEach(pt => {
		if (pt) {
			pt.x = pixels.x
			pt.y = pixels.y
		}

	})
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {

	// { draw: PiDraw, mouse: MouseEvent }
	if (value !== undefined) {
		if (validate.value === 'line') {
			const polynom = new Polynom(value.split('y=')[1])
			const H = {x: 0, y: polynom.evaluate(0, true) as number}
			const d = polynom.monomByDegree().coefficient.denominator
			const A = {x: d, y: polynom.evaluate(d, true) as number}

			updatePoint(points.value[0], H)
			updatePoint(points.value[1], A)
			pidraw.update([], true)

			return {input: value, tex: "", raw: getSvg()}
		}

		// Il faut déplacer les points.
		const coords = value.split(',').map(v => {
			const [x, y] = v.substring(1, v.length - 1).split(';').map(Number)
			return {x, y}
		})

		if (coords.length !== points.value.length) {
			pidraw.refresh(code.value)
			return {input: '', tex: "", raw: getSvg()}
		}

		points.value.forEach((key, index) => {
			updatePoint(key, coords[index])
		})

		pidraw.update([], true)
		return {input: value, tex: "", raw: getSvg()}
	}

	if (validate.value === null) {
		// Get all draggable points
		const pts: PiDrawPoint[] = points.value
			.map(key => (pidraw.figures[key] as unknown as PiDrawPoint) ?? null)
			.filter(x => x !== null)

		const input = pts.map(pt => {
			const {x, y} = pt.coordinates
			return `(${x};${y})`
		}).join(',')

		return {
			input,
			tex: "",
			raw: getSvg()
		}
	}

	if (validate.value === 'line' && points.value.length === 2) {
		const line = getLineEquation()

		if (helper.value) {
			helperTeX.value = `${line.asMxh.tex}`
		}

		return {
			input: line.asMxh.display,
			tex: "",
			raw: getSvg()
		}
	}


	return {
		input: "",
		tex: "",
		raw: getSvg()
	}
}

function getSvg() {
	// TODO: amélioration du keyboard pour afficher ou pas automatiquement le graphe
	return ""
	// return svgContainer.value?.getPiDraw().rootSVG.svg() ?? ""
}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
		// reset function
	},
	setInput,
	parameters: "@input=A,B,... liste des points à retourner\n" +
		"@val=line | ... d'autres à venir.\n" +
		"@p=<paramètres Draw>\n" +
		"@helper  (montre l'équation du graphe courant"
})

/* ------------------*/
const code = ref<string>("")
const parameters = ref<string>("")
const points = ref<string[]>([])
const validate = ref<string>(null) // line, '????
const helper = ref<boolean>(false)
const helperTeX = ref<string>("")
const draw = computed(() => {
	return {
		parameters: parameters.value,
		code: code.value,
	}
})

onMounted(() => {
	points.value = props.keyboard.parameters.find(p => p.startsWith('input='))?.split('input=')[1].split(',') ?? ["A"]
	parameters.value = props.keyboard.parameters.find(p => p.startsWith('p='))?.substring(2) ?? "axis,grid,x=-5:5,y=-5:5"
	validate.value = props.keyboard.parameters.find(p => p.startsWith('val='))?.substring(4) ?? null
	helper.value = props.keyboard.parameters.includes('helper')
	code.value = props.keyboard.values.join('\n')
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
		<div
			v-if="helper"
			v-katex="helperTeX"
		/>
	</div>
</template>
