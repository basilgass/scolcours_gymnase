<script lang="ts" setup>
import {computed, onMounted, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"
import PiMath from "pimath"
import {useGlobalClick} from "@/Composables/useGlobalClick.ts"

interface wordItem {
	available: boolean
	id: string,
	parent: string | null,
	word: string,
}

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(): void {
	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	if (value !== undefined) {
		reset()

		value.split(',').forEach(key => {
			const item = addItemByKey(key)
			if (item) {
				items.value.push(item)
			}
		})
	}


	const input = items.value.map(x => x.id).join(',')
	const tex = items.value.map(x => x.word).join(' ')
	const btns = items.value
		.map(x => `<span data-id="${x.id}" data-uid="${uid}" class="cursor-pointer mr-1 sentence-button hover:bg-blue-100 transition-colors">${x.word}</span>`)


	return {
		input,
		tex,
		raw: btns.join(""),
	}
}

function reset() {
	items.value = []
	availableItems.value.forEach(item => item.available = true)
}

defineExpose<KeyboardExposeInterface>({
	reset,
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
const isRandom = computed(() => {
	return props.keyboard.parameters.includes("rnd") || props.keyboard.parameters.includes("random")
})

const isConditional = computed(() => {
	return props.keyboard.values.some(word => word.includes('->') && word.includes('|'))
})

const items = ref<wordItem[]>([])
const availableItems = ref<wordItem[]>([])


function addItemByKey(key: string) {
	return availableItems.value.find(available => available.id === key)
}

function addItem(item: wordItem) {
	if (!item.available) return

	items.value.push(item)
	availableItems.value.find(available => available.id === item.id).available = false
	onChange()
}

const words = computed<wordItem[]>(() => {
	if (!isConditional.value) {
		return props.keyboard.values.map((element, index) => {
			return {
				id: `${index + 1}`,
				word: element,
				available: true,
				parent: null
			}
		})
	}

	// Tous les items sont de la forme
	// key|label
	// parentKey->key|label
	return props.keyboard.values.map((element) => {
		return makeItem(element)
	})

})

function makeItem(word: string): wordItem {
	const [prefix, ...arr] = word.split('|')

	const [parent, key] = prefix.split('->')

	return {
		id: key ?? parent,
		word: arr.join('|'),
		available: true,
		parent: key === undefined ? null : parent
	}
}

const sentenceClickHandler = (event: MouseEvent) => {
	const target = event.target as HTMLElement | null
	if (!target) return

	// on vérifie que le target fait partie de ce composant vue.
	const btn = target.closest('.sentence-button') as HTMLElement | null
	if (!btn) return

	const target_uid = btn.dataset.uid
	if (!target_uid) return
	if (target_uid !== uid) return

	const id = btn.dataset.id
	if (!id) return

	const found = availableItems.value.find(available => available.id === id)
	found.available = true

	const id_to_remove = items.value.findIndex(out => out.id === id)
	if (id_to_remove === null) return

	items.value.splice(id_to_remove, isConditional.value ? Infinity : 1)

	onChange()
}

const uid = `comp-${crypto.randomUUID()}`
useGlobalClick(uid, sentenceClickHandler)
onMounted(() => {
	// Load the available words.
	availableItems.value = isRandom.value
		? PiMath.Random.shuffle(words.value)
		: words.value
})

const currentAvailableWords = computed<wordItem[]>(() => {
	if (!isConditional.value) return availableItems.value

	const parentKey = items.value.length === 0 ? null : items.value[items.value.length - 1].id

	return availableItems.value
		.filter(item => {
			if (parentKey === null) return item.parent === null
			if (item.parent === null) return false
			return item.parent.split(',').includes(parentKey)
		}).map(item => {
			item.available = true
			return item
		})
})
</script>

<template>
	<div>
		<div class="flex flex-wrap gap-3">
			<sc-button
				v-for="item in currentAvailableWords"
				:key="item.id"
				v-katex.auto="item.word"
				:class="{
					'w-full': isFullWidth,
					'flex-1': isFlex,
					'opacity-40 cursor-not-allowed': !item.available
				}"
				@click="addItem(item)"
			/>
		</div>
	</div>
</template>
