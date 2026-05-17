<script lang="ts" setup>
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import TableOfSigns, {TABLE_OF_SIGNS_VALUES_WITH_EXTREMES} from "@/Components/Pi/TableOfSigns.vue"
import {computed, nextTick, onMounted, ref, useTemplateRef, watch} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"

// TODO: ajouter la possibilité de n'avoir qu'une ligne à remplir (donc pré-construire le tableau et cacher les boutons inutiles.
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

	if (growsOnly.value) {
		const [z, s, g, c] = props.reference.split("@")

		zeroes.value = {input: z, tex: "", raw: ""}
		signs.value = {input: s ?? "", tex: "", raw: ""}
	}

	// Wait for the DOM to be updated.
	await nextTick()

	updateKeyboardActiveCell()

	return {
		input: answerValue.value,
		tex: "",
		raw: tosUI.value.$el.innerHTML
	}
}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
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

const growsOnly = computed(() => {
	console.log(props.keyboard.parameters)
	return props.keyboard.parameters.includes('grows')
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

function updateKeyboardActiveCell() {
	let cell: HTMLElement | null = null

	const activeClassName = 'active-cell'

	// Remove all active cells
	tosUI.value.$el.querySelectorAll(`.${activeClassName}`).forEach(x => x.classList.remove(activeClassName))

	switch (showKeyboard.value) {
		case "zeroes": {
			const i = zeroes.value.input.split(',').length - 1
			cell = tosUI.value.$el.querySelector(`[data-tos="zero-${i}"]`)
			break
		}
		
		case "signs": {
			const i = signs.value.input.length
			cell = tosUI.value.$el.querySelector(`[data-tos="sign-${i}"]`)
			break
		}

		case "grows":
		case "curves": {
			const i = grows.value.input.length
			cell = tosUI.value.$el.querySelector(`[data-tos="result-${i}"]`)
			break
		}

		case "coords": {
			const i = coordsForTos.value.length * 2 - 1
			cell = tosUI.value.$el.querySelector(`[data-tos="extreme-${i}"]`)
			break
		}
	}

	if (cell) cell.classList.add(activeClassName)
}

// Génération de la réponse pour comparaison et de l'affichage.
const zeroesKeyboard = ref(props.keyboard.parameters.includes("float") ? "algebra" : "exact")

const zeroes = ref({input: "", tex: "", raw: ""})
const signs = ref({input: "", tex: "", raw: ""})
const grows = ref({input: "", tex: "", raw: ""})
const coords = ref({input: "", tex: "", raw: ""})

const tosUI = useTemplateRef<InstanceType<typeof TableOfSigns>>('tosUI')

const answerValue = computed(() => {
	let r = `${zeroes.value.input}@${signs.value.input}`

	if (withGrows.value) {
		r += `@${grows.value.input}`
	}

	if (withExtremes.value) {
		r += `@${coords.value.input}`
	}

	return r
})

watch(showKeyboard, () => {
	onChange()
})

const coordsForTos = computed(() => {
	if (!withExtremes.value) return null

	const c = coords.value.input.split(',')
	if (showKeyboard.value === 'coords' && c[c.length - 1] === '') {
		c[c.length - 1] = '?'
	}

	return c
})

// Initialisation au démarrage.
onMounted(() => {
	onChange()

	if (growsOnly.value) {
		showKeyboard.value = "grows"
	}
})


function fillLine(values: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[], length: number) {
	const line: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[] = []

	for (let i = 0; i < length; i++) {
		line.push(values[i] ?? "t")
	}

	return line
}

const tos_data = computed(() => {
	const roots = zeroes.value.input.split(',').filter(x => x !== '')
	const n = roots.length * 2 + 1

	return {
		roots: zeroes.value.input.split(','),
		signs: fillLine(signs.value.input.split('') as TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[], n),
		result: fillLine(grows.value.input.split('') as TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[], n),
	}
})

</script>

<template>
	<article>
		<div
			class="overflow-x-scroll my-5 hidden"
		>
			<table-of-signs
				ref="tosUI"
				:mode="tosMode"
				:label="tosName"
				:roots="tos_data.roots"
				:signs="tos_data.signs"
				:result-line="tos_data.result"
				:extremes="coordsForTos"
			/>
		</div>


		<div class="max-w-xl mx-auto flex flex-col gap-3 keyboard">
			<div
				v-if="!growsOnly"
				:class="(withGrows && !withExtremes)?'grid-cols-3':'grid-cols-2'"
				class="grid gap-3"
			>
				<sc-button
					:outline="showKeyboard!=='zeroes'"
					class="py-0 px-5"
					theme
					@click="showKeyboard='zeroes'"
				>
					zéros
				</sc-button>
				<sc-button
					:outline="showKeyboard!=='signs'"
					class="py-0 px-5"
					theme
					@click="showKeyboard='signs'"
				>
					signes
				</sc-button>
				<sc-button
					v-if="withGrows"
					:outline="showKeyboard!=='grows'"
					class="py-0 px-5"
					theme
					@click="showKeyboard='grows'"
				>
					croissance
				</sc-button>
				<sc-button
					v-if="withCurves"
					:outline="showKeyboard!=='curves'"
					class="py-0 px-5"
					theme
					@click="showKeyboard='curves'"
				>
					courbure
				</sc-button>
				<sc-button
					v-if="withExtremes"
					:outline="showKeyboard!=='coords'"
					class="py-0 px-5"
					theme
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
					'h': {type: 'bg', display: 'striped-background'},
					't': {type: 'math', display: '|'}
				}"
				:keyboard="{
					grid: 'grid-cols-6',
					layout: [['+', 2], ['-', 2], ['h', 2], ['z', 2], ['d', 2], ['t', 2], ['@back', 3], ['@reset', 3]]
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
					'h': {type: 'bg', display: 'striped-background'}
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
					'h': {type: 'bg', display: 'striped-background'}
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
