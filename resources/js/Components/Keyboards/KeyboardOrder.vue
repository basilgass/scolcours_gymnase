<script lang="ts" setup>
import {Random} from "pimath"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(event: KeyboardInputInterface): void {
	setInput(event.input).then((x) => emits("change", x))
}

async function setInput(value: string): Promise<KeyboardInputInterface> {
	if (value !== undefined) {
		if (value === '-') {
			// Automatic list
			sortableItems.value = items.value
		} else if (value === '') {
			// Random order
			sortableItems.value = Random.shuffle(items.value)
		}
	}
	return {
		input: "",
		tex: "",
		raw: isList.value ?
			sortableItems.value.map(el => `- ${el.label}`).join("\n") :
			sortableItems.value.map(el => el.label).join(" ")
	}

}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
		// reset function
	},
	setInput,
	parameters: "full (pleine largeur)\nflex (utilisation de flex)\ntex (converti en TeX)\nlist (affichage d'une liste)"
})

/**
 * Keyboards custom configuration
 */

// Liste des élèments qui sont à réordrer.
const isFullWidth = computed(() => {
	return props.keyboard.parameters.includes("full")
})
const isFlex = computed(() => {
	return props.keyboard.parameters.includes("flex")
})
const isList = computed(() => {
	return props.keyboard.parameters.includes("list")
})

const items = computed(() => {
	return props.keyboard.values.map((element, index) => {
		return {
			id: index + 1,
			label: element
		}
	})
})

const sortableItems = ref<{ id: number, label: string }[]>(Random.shuffle(items.value))

</script>

<template>
	<div>
		<draggable
			v-model="sortableItems"

			class="flex flex-wrap gap-3 my-5"
			item-key="id"
			v-bind="{
				animation: 200,
			}"
			@update="onChange"
		>
			<template #item="{ element }">
				<sc-button
					v-katex.auto="element.label"
					:class="{
						'w-full': isFullWidth,
						'flex-1': isFlex,
					}"
				/>
			</template>
		</draggable>
	</div>
</template>
