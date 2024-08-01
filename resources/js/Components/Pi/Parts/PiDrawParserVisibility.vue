<script
	lang="ts"
	setup
>
import {PiParser as PiDraw} from "pidraw"

import { computed, onMounted, PropType, ref } from "vue"

const props = defineProps({
	graph: { type: Object as PropType<PiDraw>, required: true },
	draw: { type: Object, required: true }
})

/** Get the visibility buttons for figures
 * name=code->options,btn
 */
// interface ParserPrepocessType { label: string, key: string, code: string[], options: string[] }
interface visibilityButtonType { label: string, figure: string, visible: boolean, related: string[] }

/**
 * Add / Remove buttons to hide or show svg elements from the graph.
 * It comes from    code->btn:name
 */
function visibilityButtonsInit(): visibilityButtonType[] {

	// Check if btn is somewhere in the code.
	if (props.draw.code.split("btn").length === 1) {
		return []
	}

	const btns = []

	// There is at least one button.
	for (const row of props.draw.code.split("\n")) {
		
		// Parse the current row, without creating any element.
		// const c = parserPreprocess(row) as ParserPrepocessType
		// const c = PiDraw.parse(row)

		// TODO: Button creation must be implemented !
		// console.log(c)
		
		// Check if the "btn" options is here!
		// const optionCode = Object.values.filter(x => x.split(":")[0] === "btn")
		// if (optionCode.length === 1) {
		// 	// The btn code is       btn:name
		// 	const [, name] = optionCode[0].split(":")

		// 	// check if the name is not already used.
		// 	// if it's the case, add the figure to the "related" array.
		// 	const btnWithRelations = btns.filter(btn => btn.label === name)

		// 	if (btnWithRelations.length === 1) {
		// 		// The button already exist. Add it to the relations
		// 		btnWithRelations[0].related.push(c.label)
		// 	} else {
		// 		// The button does not exist: create a new one !
		// 		btns.push(
		// 			{
		// 				// button name
		// 				label: name,
		// 				// figure to be shown/hidden
		// 				figure: c.label,
		// 				// initial value
		// 				visible: !c.options.includes("hide"),
		// 				// related figures to be shown/hidden
		// 				related: []
		// 			}
		// 		)
		// 	}
		// }
	}

	return btns
}

const visibilityButtons = ref<visibilityButtonType[]>([])


/**
 * Toggle the visibility when clicked.
 * @param btn
 */
function visibilityButtonsToggle(btn) {
	// Change the visibility of the button
	btn.visible = !btn.visible

	// Apply the ne visiblity settings to main figure and all related figures.
	Object.values(props.graph.figures).forEach(fig => {
		if (fig.name === btn.figure || btn.related.includes(fig.name)) {
			// TODO: Handle visibility
			// btn.visible ? fig.show() : fig.hide()
		}

		// TODO: Handle plugins - still needed ?
		// Maybe there are plugins
		// if (fig instanceof Plot && fig.plugins) {
		// 	fig.plugins.forEach(plugin => {
		// 		if (plugin.name === btn.figure || btn.related.includes(plugin.name)) {
		// 			btn.visible ? plugin.show() : plugin.hide()
		// 		}
		// 	})
		// }
	})
}

const availableBtns = computed<visibilityButtonType[]>(() => {
	return visibilityButtons.value.filter(btn => !btn.label.startsWith('animate'))
})

const animatedBtns = computed<visibilityButtonType[]>(() => {
	const btns = visibilityButtons.value.filter(btn => btn.label.startsWith('animate'))

	btns.sort((a, b) => a.label < b.label ? -1 : 1)
	return btns
})
// Starting
const animatedBtnsIndex = ref<number>(null)
function animateNextFrame() {
	// Frame duration
	let duration: number

	if (animatedBtnsIndex.value === null) {
		duration = 100
		animatedBtnsIndex.value = 0
	} else {
		// Default duration per frame (last one is longer)
		duration = animatedBtnsIndex.value === animatedBtns.value.length - 1 ? 2000 : 1000
		// Determine if the current frame has a custom duration
		const [, itemDuration] = animatedBtns.value[animatedBtnsIndex.value].label.split('/')
		duration = itemDuration ? parseInt(itemDuration) : duration

		// Get next frame
		animatedBtnsIndex.value = (animatedBtnsIndex.value + 1) % animatedBtns.value.length
	}

	setTimeout(() => {
		// All the previous buttons must be hidden, except if ending with +
		if (animatedBtnsIndex.value > 0) {
			animatedBtns.value.slice(0, animatedBtnsIndex.value).forEach(btn => {
				if (!btn.label.endsWith('+')) {
					if (btn.visible === true) {
						visibilityButtonsToggle(btn)
					}
				}
			})
		} else {
			// All buttons must be hidden
			animatedBtns.value.forEach(btn => {
				if (btn.visible === true) visibilityButtonsToggle(btn)
			})
		}

		// Toggle the current button on
		visibilityButtonsToggle(animatedBtns.value[animatedBtnsIndex.value])

		// Next frame
		animateNextFrame()
	}, duration)
}

onMounted(() => {
	visibilityButtons.value = visibilityButtonsInit()

	// Start animation
	if (animatedBtns.value.length > 0) {
		animateNextFrame()
	}
})
</script>

<template>
	<div>
		<!-- visibility buttons -->
		<div v-if="availableBtns.length > 0" class="w-full flex flex-wrap gap-3 mt-2">
			<button
				v-for="btn of availableBtns"
				:key="btn.figure"
				v-katex.auto="`${btn.visible ? 'cacher' : 'afficher'} ${btn.label}`"
				class="btn btn-xs"
				@click="visibilityButtonsToggle(btn)"
			/>
		</div>
	</div>
</template>

<style scoped></style>
