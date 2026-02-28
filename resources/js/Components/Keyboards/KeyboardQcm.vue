<script lang="ts" setup>
import {asciiToTex} from "@/Composables/keyboardConfig"
import {computed, onMounted, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"

interface QCMItem {
	key: string,
	label: string,
	tex: string,
	ascii: boolean,
	selected: boolean
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
		let keys = value.split(",")

		// (un)select each item
		qcmItems.value.forEach(item => {
			item.selected = keys.includes(item.key)
		})
	}

	const answers = qcmSelections()
	const answersKeys = answers.map(x => x.key)

	return {
		input: answersKeys.join(","),
		tex: answers.map(x => x.tex).join(joinCharacter.value),
		raw: asList.value
			? answers.map(x => `- ${x.label}`).join("\n")
			: answers.map(x => x.label).join(joinCharacter.value)
	}
}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
		// reset function
	},
	setInput,
	parameters: "full (pleine largeur)\nflex (utilisation de flex)\ntex (converti en TeX)\nlist (affichage sous forme de liste)\njoin:<caractère>\nmulti (force le multi réponse)\n\n<key>||<label?>||<TeX?>"
})

/* ------------------*/
// Options du QCM
// TODO: ajouter un "@sort" et "@sort:desc"
const inRandomOrder = computed(() => {
	return props.keyboard.parameters.includes("random")
})
const isFullWidth = computed(() => {
	return props.keyboard.parameters.includes("full")
})
const isFlex = computed(() => {
	return props.keyboard.parameters.includes("flex")
})
const isTex = computed(() => {
	return props.keyboard.parameters.includes("tex")
})
const multiAnswers = computed(() => {
	return props.reference.split(",").length > 1 ||
		props.keyboard.parameters.includes("multi")
})
const asList = computed(() => {
	return props.keyboard.parameters.includes("list")
})
const joinCharacter = computed(() => {
	const key = 'join:'

	const join = props.keyboard.parameters.find(p => p.startsWith(key))

	return join ? join.substring(key.length) : ", "
})
const sortValues = computed(() => {
	const sort = props.keyboard.parameters.find(p => p.startsWith('sort'))

	if (!sort) return null

	const [_, direction] = sort.split(':')

	return direction === 'desc' ? 'desc' : 'asc'
})

/* ---------------- */
// Gestion du QCM
let qcmItems = ref<QCMItem[]>([])

function qcmSelections(): QCMItem[] {
	// Retourne la ou les valeur(s) sélectionnée(s).
	let values: QCMItem[] = [
		...qcmItems.value
			.filter((x) => x.selected)
	]

	if (sortValues.value) {
		values = sortSmart(values, sortValues.value)
	}

	return values
}

function sortSmart(values: QCMItem[], order: 'asc' | 'desc' = 'asc'): QCMItem[] {
	const isNumeric = values.every(v => {
		const t = v.key.trim()
		return t !== '' && !Number.isNaN(Number(t))
	})

	return [...values].sort((keyA, keyB) => {
		const a = keyA.key
		const b = keyB.key
		if (isNumeric) {
			const diff = Number(a) - Number(b)
			return order === 'asc' ? diff : -diff
		}

		// tri alphabétique naturel (ex: 2 < 10)
		const diff = a.localeCompare(b, undefined, {
			numeric: true,
			sensitivity: 'base'
		})

		return order === 'asc' ? diff : -diff
	})
}

function qcmButtonClick(element) {
	if (!multiAnswers.value) {
		// Si on n'est pas dans une "Multi-réponses", on désactive tout.
		qcmItems.value.forEach((e) => (e.selected = false))
	}

	element.selected = !element.selected
	onChange()
}

onMounted(() => {
	// Build the Items.
	// key|TeX|Button
	// key|Tex
	// TeX

	// REFACTOR: Reformat conversion code <key>|<label>|<TeX>
	const items: QCMItem[] = props.keyboard.values
		.map((x) => {
			let [key, label, tex] = x.split("|")

			// S'il n'y a pas de label
			if (label === undefined) {
				label = "" + key
			}

			// Si on est en mode TeX, le label peut être la valeur à afficher.
			if (tex === undefined && isTex.value) {
				tex = label
			}

			// Si le label commence par un #, c'est du TeX en mode ASCII.
			const ascii = label.startsWith("#")
			if (ascii) {
				// remove the #
				label = label.substring(1)

				// convert the tex value
				if (tex === undefined) tex = asciiToTex(label)
			}

			return {
				key,
				label,
				tex: tex === undefined ? "" : tex,
				ascii,
				selected: false
			}
		})

	if (inRandomOrder.value) {
		items.sort(() => Math.random() - 0.5)
	}

	qcmItems.value = items
})

</script>

<template>
	<div>
		<div class="flex flex-wrap gap-1 md:gap-3 my-5">
			<sc-button
				v-for="element of qcmItems"
				:key="element.key"
				:class="{
					'w-full': isFullWidth,
					'flex-1': isFlex,
				}"
				:outline="!element.selected"
				theme
				@click="qcmButtonClick(element)"
			>
				<span
					v-if="element.ascii"
					v-katex.ascii="element.label"
				/>
				<span
					v-else-if="isTex"
					v-katex="element.label"
				/>
				<span
					v-else
					v-katex.auto="element.label"
				/>
			</sc-button>
		</div>
	</div>
</template>
