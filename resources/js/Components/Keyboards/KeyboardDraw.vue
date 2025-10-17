<script lang="ts" setup>
import {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/Composables/useKeyboard.ts"
import {PiDraw, Point as PiDrawPoint} from "pidraw/types"
import {computed, nextTick, onMounted, ref, useTemplateRef} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"

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

async function setInput(value?: string): Promise<KeyboardInputInterface> {

	// { draw: PiDraw, mouse: MouseEvent }
	if (value !== undefined) {
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
			const pixels = pidraw.toPixels(coords[index])

			const pts: PiDrawPoint[] = [
				pidraw.figures[key] as unknown as PiDrawPoint,
				pidraw.figures[`${key}_drag`] as unknown as PiDrawPoint
			]

			pts.forEach(pt => {
				if (pt) {
					pt.x = pixels.x
					pt.y = pixels.y
				}

			})
		})

		pidraw.update([], true)
		return {input: value, tex: "", raw: getSvg()}
	}


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
	parameters: ""
})

/* ------------------*/
const code = ref<string>("")
const parameters = ref<string>("")
const points = ref<string[]>([])
const draw = computed(() => {
	return {
		parameters: parameters.value,
		code: code.value,
	}
})

onMounted(() => {
	points.value = props.keyboard.parameters.find(p => p.startsWith('input='))?.split('input=')[1].split(',') ?? ["A"]
	parameters.value = props.keyboard.parameters.find(p => p.startsWith('p='))?.substring(2) ?? "axis,grid,x=-5:5,y=-5:5"
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
			@draw-click="onChange"
			@mounted="onComponentMounted"
		/>
	</div>
</template>
