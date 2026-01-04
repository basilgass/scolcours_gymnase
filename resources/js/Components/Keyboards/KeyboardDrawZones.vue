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

		pidraw.update([], true)
		return {input: value, tex: "", raw: getSvg()}
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
const zones: Record<string, boolean> = {}
const color = ref<string>("")

const draw = computed(() => {
	return {
		parameters: parameters.value,
		code: code.value,
	}
})

onMounted(() => {
	const inputs = props.keyboard.parameters.find(p => p.startsWith('input='))?.split('input=')[1].split(',') ?? []
	inputs.forEach(inp => {
		zones[inp] = false
	})
	parameters.value = props.keyboard.parameters.find(p => p.startsWith('p='))?.substring(2) ?? "axis,grid,x=-5:5,y=-5:5"
	code.value = props.keyboard.values.join('\n')
	color.value = props.keyboard.parameters.find(p => p.startsWith('color='))?.substring(6) ?? 'yellow/0.4'

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
