<script lang="ts" setup>
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import TableOfSigns from "@/Components/Pi/TableOfSigns.vue"
import {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	type KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/Composables/useKeyboard.ts"
import {TABLE_OF_SIGNS_VALUES} from "pimath"
import {computed, nextTick, onMounted, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const props = defineProps<KeyboardPropsInterface>()

const emits = defineEmits<KeyboardEmitsInterface>()

function onChange(value?: string) {
	setInput(value).then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	// Display the correct answer
	if (value !== undefined) {
		const [z, s, g, c] = value.split("@")

		zeroes.value = {input: z, tex: "", raw: ""}
		signs.value = {input: s ?? "", tex: "", raw: ""}
		grows.value = {input: g ?? "", tex: "", raw: ""}

		if (c !== undefined) {
			showKeyboard.value = "coords"
			coords.value = {input: c, tex: "", raw: ""}
		}
	}
	// Wait for the DOM to be updated.
	await nextTick()

	return {
		input: answerValue.value,
		tex: "",
		raw: tosUI.value.$el.innerHTML
	}
}

defineExpose<KeyboardExposeInterface>({
	reset: ()=>{
		// reset function
	},
	setInput,
	parameters: "@<name>(x)"
})

/**
 * Keyboards custom configuration
 */

/* FONCTIONS SPECIFIQUES */
// Les configurations du clavier TOS
const tosName = computed(() => {
	// le nom de la fonction
	const names = props.keyboard.parameters.filter(x => x.includes("(") && x.includes(")"))
	return names.length === 0 ? "f(x)" : names[0]
})

const withGrows = computed(() => {
	return props.reference.split("@").length > 2 &&
		props.reference.split("@")[2].match(/[+-]/g)
})

const withCurves = computed(() => {
	return props.reference.split("@").length > 2 &&
		props.reference.split("@")[2].match(/[un]/g)
})

const withExtremes = computed(() => {
	// s'il faut donner les coordonnées
	return props.reference.split("@").length > 3
})

const tosMode = computed<"signs" | "grows" | "curves">(() => {
	if (withGrows.value) return "grows"
	if (withCurves.value) return "curves"

	return "signs"
})

// Le clavier a afficher
const showKeyboard = ref("zeroes")

const changeKeyboard = function (event) {
	// event = {input, raw, tex}

	// mise à jour du tableau de signes
	switch (showKeyboard.value) {
		case "zeroes":
			zeroes.value = event
			break
		case "signs":
			signs.value = event
			break
		case "grows":
		case "curves":
			grows.value = event
			break
		case "coords":
			coords.value = event
			break
	}

	onChange()
}

// Génération de la réponse pour comparaison et de l'affichage.
const zeroes = ref({input: "", tex: "", raw: ""}),
	zeroesKeyboard = ref(props.keyboard.parameters.includes("float") ? "algebra" : "exact"),
	signs = ref({input: "", tex: "", raw: ""}),
	grows = ref({input: "", tex: "", raw: ""}),
	coords = ref({input: "", tex: "", raw: ""}),
	tosUI = ref(null),
	answerValue = computed(() => {
		let r = `${zeroes.value.input}@${signs.value.input}`
		if (withGrows.value) {
			r += `@${grows.value.input}`
		}
		if (withExtremes.value) {
			r += `@${coords.value.input}`
		}

		return r
	})

// Initialisation au démarrage.
onMounted(() => {
	onChange()
})


</script>

<template>
	<article>
		<div
			class="overflow-x-scroll my-5 hidden"
		>
			<table-of-signs
				ref="tosUI"
				:label="tosName"
				:mode="tosMode"
				:roots="zeroes.input.split(',')"
				:signs="signs.input.split('') as TABLE_OF_SIGNS_VALUES[]"
				:result-line="grows.input.split('') as TABLE_OF_SIGNS_VALUES[]"
				:extremes="withExtremes ? coords.input.split(','): null"
			/>
		</div>


		<div class="max-w-xl mx-auto flex flex-col gap-3 keyboard">
			<div
				:class="(withGrows && !withExtremes)?'grid-cols-3':'grid-cols-2'"
				class="grid gap-3"
			>
				<sc-button
					:outline="showKeyboard!=='zeroes'"
					theme
					class="py-0 px-5"
					@click="showKeyboard='zeroes'"
				>
					zéros
				</sc-button>
				<sc-button
					:outline="showKeyboard!=='signs'"
					theme
					class="py-0 px-5"
					@click="showKeyboard='signs'"
				>
					signes
				</sc-button>
				<sc-button
					v-if="withGrows"
					theme
					:outline="showKeyboard!=='grows'"
					class="py-0 px-5"
					@click="showKeyboard='grows'"
				>
					croissance
				</sc-button>
				<sc-button
					v-if="withCurves"
					theme
					:outline="showKeyboard!=='curves'"
					class="py-0 px-5"
					@click="showKeyboard='curves'"
				>
					courbure
				</sc-button>
				<sc-button
					v-if="withExtremes"
					theme
					:outline="showKeyboard!=='coords'"
					class="py-0 px-5"
					@click="showKeyboard='coords'"
				>
					coordonnées
				</sc-button>
			</div>

			<!-- Add keyboard to input the zeros -->

			<KeyboardDisplay
				v-show="showKeyboard==='zeroes'"
				:keyboard="zeroesKeyboard"
				:multiple="true"
				back
				reset
				@change="changeKeyboard"
			/>

			<KeyboardDisplay
				v-show="showKeyboard==='signs'"
				:custom-keys="{
					'd': {type: 'math', display: '\\textcolor{red}{\\Vert}'},
					'z': {type: 'math', display: '0'},
					'h': {type: 'bg', display: 'bg-stripes bg-stripes-red-100'}
				}"
				:keyboard="{
					grid: 'grid-cols-6',
					layout: [['+', 2], ['-', 2], ['h', 2], ['z', 3], ['d', 3], ['@back', 3], ['@reset', 3]]
				}"
				@change="changeKeyboard"
			/>

			<KeyboardDisplay
				v-show="showKeyboard==='grows'"
				:custom-keys="{
					'-': {type: 'icon', display: 'bi bi-arrow-down-right'},
					'+': {type: 'icon', display: 'bi bi-arrow-up-right'},
					'd': {type: 'math', display: '\\textcolor{red}{\\Vert}'},
					'M': {type: 'text', display: 'max'},
					'm': {type: 'text', display: 'min'},
					'_': {type: 'text', display: 'replat'},
					'h': {type: 'bg', display: 'bg-stripes bg-stripes-red-100'}
				}"
				:keyboard="{
					grid: 'grid-cols-3',
					layout: ['+', '-', 'h', 'm', 'M', '_', 'd', '@back', '@reset']
				}"
				@change="changeKeyboard"
			/>

			<KeyboardDisplay
				v-show="showKeyboard==='curves'"
				:custom-keys="{
					'u': {type: 'math', display: '\\cup'},
					'n': {type: 'math', display: '\\cap'},
					'd': {type: 'math', display: '\\textcolor{red}{\\Vert}'},
					'I': {type: 'text', display: 'infl.'},
					'h': {type: 'bg', display: 'bg-stripes bg-stripes-red-100'}
				}"
				:keyboard="{
					grid: 'grid-cols-4',
					layout: ['u', 'n', 'I', 'h', '@back', '@reset', '', 'd']
				}"
				@change="changeKeyboard"
			/>

			<KeyboardDisplay
				v-show="showKeyboard==='coords'"
				:keyboard="zeroesKeyboard"
				:multiple="true"
				back
				reset
				@change="changeKeyboard"
			/>
		</div>
	</article>
</template>
