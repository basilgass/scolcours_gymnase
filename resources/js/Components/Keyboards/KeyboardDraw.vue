<script lang="ts" setup>
import {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/Composables/useKeyboard.ts"
import {computed, onMounted, ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import {PiDraw} from "pidraw/types"
import {Point} from "pimath"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(value?: { draw: PiDraw, mouse: MouseEvent }): void {
	setInput(value).then((x) => emits("change", x))
}

async function setInput(value?: { draw: PiDraw, mouse: MouseEvent }): Promise<KeyboardInputInterface> {

	if (value !== undefined) {
		// Il faut déplacer les points.

	}


	// Get all draggable points
	const pts = points.value.map(key => (value.draw.figures[key] as Point) ?? null).filter(x => x !== null)
	const input = pts.map(pt=> {
		const {x, y} = pt.coordinates
		return `(${x};${y})`
	}).join(',')


	return {
		input,
		tex: "",
		raw: input
	}
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

</script>

<template>
	<div>
		<pi-draw-parser
			:draw
			@draw-click="onChange"
		/>
	</div>
</template>
