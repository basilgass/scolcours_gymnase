<script lang="ts" setup>

import { computed, PropType } from "vue"
import { parserPreprocess } from "pidraw/esm/Parser"
import { Graph } from "pidraw/esm/Graph"

const props = defineProps({
	graph: { type: Object as PropType<Graph>, required: true },
	draw: { type: Object, required: true }
})

/** Get the visibility buttons for figures
 * name=code->options,btn
 */
type ParserPrepocessType = { label: string, key: string, code: string[], options: string[] }
type visibilityButtonType = { label: string, figure: string, visible: boolean, related: string[] }
// let visibilityButtons = ref<visibilityButtonType[]>([])

/**
 * Add / Remove buttons to hide or show svg elements from the graph.
 * It comes from    code->btn:name
 */
const visibilityButtons = computed<visibilityButtonType[]>(() => {

	// Check if btn is somewhere in the code.
	if (props.draw.code.split("btn").length === 1) {
		return []
	}

	let btns = []

	// There is at least one button.
	for (let row of props.draw.code.split("\n")) {
		// Parse the current row, without creating any element.
		const c = parserPreprocess(row) as ParserPrepocessType

		// Check if the "btn" options is here!
		const optionCode = c.options.filter(x => x.split(":")[0] === "btn")
		if (optionCode.length === 1) {
			// The btn code is       btn:name
			const [, name] = optionCode[0].split(":")

			// check if the name is not already used.
			// if it's the case, add the figure to the "related" array.
			const btnWithRelations = btns.filter(btn => btn.label === name)

			if (btnWithRelations.length === 1) {
				// The button already exist. Add it to the relations
				btnWithRelations[0].related.push(c.label)
			} else {
				// The button does not exist: create a new one !
				btns.push(
					{
						// button name
						label: name,
						// figure to be shown/hidden
						figure: c.label,
						// initial value
						visible: !c.options.includes("hide"),
						// related figures to be shown/hidden
						related: []
					}
				)
			}
		}
	}

	console.log("HERE")
	return btns
})

/**
 * Toggle the visibility when clicked.
 * @param btn
 */
function visibilityButtonsToggle(btn) {
	// Change the visibility of the button
	btn.visible = !btn.visible

	// Apply the ne visiblity settings to main figure and all related figures.
	props.graph.figures.forEach(fig => {
		if (fig.name === btn.figure || btn.related.includes(fig.name)) {
			btn.visible ? fig.show() : fig.hide()
		}
	})
}

</script>

<template>
	<div>
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
	</div>
</template>

<style scoped>

</style>
