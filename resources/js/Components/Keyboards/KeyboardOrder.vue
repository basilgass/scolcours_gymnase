<script lang="ts" setup>
import { KeyboardEmitsInterface, KeyboardPropsInterface, useKeyboard } from "@/Composables/useKeyboard.ts"
import { Random } from "pimath"
import { computed, ref } from "vue"

const props = defineProps<KeyboardPropsInterface>()

const emits = defineEmits<KeyboardEmitsInterface>()

function onKeyboardChange(): void {
	onChange()
}

const { loadAnswer } = useKeyboard(props, onKeyboardChange)

const reset = () => sortableItems.value = randomizeItems()

defineExpose({ reset, loadAnswer })

const onChange = function() {
	// On compte le nombre de réponses au bon endroit...
	let errors = 0
	for (let i = 1; i <= sortableItems.value.length; i++) {
		if (sortableItems.value[i - 1].id !== i) {
			errors++
		}
	}

	emits("change", {
		value: {
			input: "",
			tex: "",
			raw: isList.value ?
				sortableItems.value.map(el => `- ${el.label}`).join("\n") :
				sortableItems.value.map(el => el.label).join(" ")
		},
		validation: {
			result: errors === 0,
			message: errors > 0 ? `Il y a ${errors} erreur${errors > 1 ? "s" : ""}` : ""
		}
	})
}

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

function randomizeItems(): { id: number, label: string }[] {
	return Random.shuffle(items.value)
}

const sortableItems = ref<{ id: number, label: string }[]>(randomizeItems())

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
				<button
					v-katex.auto="element.label"
					:class="{
						'w-full': isFullWidth,
						'flex-1': isFlex,
					}"
					class="btn bg-white"
				/>
			</template>
		</draggable>
	</div>
</template>
