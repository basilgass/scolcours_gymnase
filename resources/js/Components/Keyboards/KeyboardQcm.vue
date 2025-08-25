<script lang="ts" setup>
import {asciiToTex} from "@/Composables/keyboardConfig"
import {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/Composables/useKeyboard.ts"
import {computed, onMounted, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

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
		tex: answers.map(x => x.tex).join(", "),
		raw: answers.map(x => x.label).join(", ")
	}
}

defineExpose<KeyboardExposeInterface>({
	reset: ()=>{
		// TODO: reset function
	},
	setInput,
	parameters: "full (pleine largeur)\nflex (utilisation de flex)\ntex (converti en TeX)"
})

/* ------------------*/
// Options du QCM
const inRandomOrder = computed(()=>{
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
	return props.reference.split(",").length > 1
})

/* ---------------- */
// Gestion du QCM
let qcmItems = ref([])

function qcmSelections() {
	// Retourne la ou les valeur(s) sélectionnée(s).
	let values = [
		...qcmItems.value
			.filter((x) => x.selected)
	]

	values.sort((a, b) => a.key < b.key ? -1 : 1)
	return values
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
	const items = props.keyboard.values
		.map((x) => {
			let [key, label, tex] = x.split("|")

			// S'il n'y a pas de label
			if (label === undefined) {
				label = "" + key
			}

			// Si on est en mode TeX, la label peut être la valeur a afficher.
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

	if(inRandomOrder.value) {
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
