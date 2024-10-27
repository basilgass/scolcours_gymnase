<script lang="ts" setup>
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import TableOfSigns from "@/Components/Pi/TableOfSigns.vue"
import { customCheck } from "@/Composables/checkersConfig"
import { KeyboardEmitsInterface, KeyboardPropsInterface, useKeyboard } from "@/Composables/useKeyboard.ts"
import { TABLE_OF_SIGNS_VALUES } from "pimath"
import { computed, nextTick, onMounted, ref } from "vue"

// TODO: le clavier TableOfSigns ne fonctionne pas encore correctement (grows, curves ?, etc...)
const props = defineProps<KeyboardPropsInterface>()

const emits = defineEmits<KeyboardEmitsInterface>()

function onKeyboardChange(): void {
	onChange()
}

const { loadAnswer } = useKeyboard(
	props,
	onKeyboardChange
)

const reset = function() {
	zeroes.value = { input: "", tex: "", raw: "" }
	signs.value = { input: "", tex: "", raw: "" }
	grows.value = { input: "", tex: "", raw: "" }
	coords.value = { input: "", tex: "", raw: "" }
}

defineExpose({
	reset,
	loadAnswer: (value) => {
		loadAnswer(value, {
			reset ,
			callback: (value) =>{

				// Display the correct answer
				const [z, s, g, c] = value.split("@")

				zeroes.value = { input: z, tex: "", raw: "" }
				signs.value = { input: s, tex: "", raw: "" }
				grows.value = { input: g ?? "", tex: "", raw: "" }

				if (c !== undefined) {
					showKeyboard.value = "coords"
					coords.value = { input: c, tex: "", raw: "" }
				}
			}
		})
	},
	parameters: "@<name>(x)"
})

const onChange = async function() {
	await nextTick()
	const check = customCheck("tos", props.answer, answerValue.value)

	emits("change", {
		value: {
			input: answerValue.value,
			tex: "",
			raw: tosUI.value.$el.innerHTML
		},
		validation: {
			result: check.result,
			message: check.message
		}
	})
}


/* FONCTIONS SPECIFIQUES */
// Les config du clavier TOS
const tosName = computed(() => { // le nom de la fonction
	const names = props.keyboard.parameters.filter(x => x.includes("(") && x.includes(")"))
	return names.length === 0 ? "f(x)" : names[0]
})
const withGrows = computed(() => { // s'il y a la croissance
	return props.answer.split("@").length > 2
})
const withCoords = computed(() => { // s'il faut donner les coordonnées
	return props.answer.split("@").length > 3
})

// Le clavier a afficher
const showKeyboard = ref("zeroes")

const changeKeyboard = function(event) {
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
			grows.value = event
			break
		case "coords":
			coords.value = event
			break
	}

	onChange()
}

// Génération de la réponse pour comparaison et de l'affichage.
// const signs = ref<string>([])

const zeroes = ref({ input: "", tex: "", raw: "" }),
	zeroesKeyboard = ref(props.keyboard.parameters.includes("float") ? "algebra" : "exact"),
	signs = ref({ input: "", tex: "", raw: "" }),
	grows = ref({ input: "", tex: "", raw: "" }),
	coords = ref({ input: "", tex: "", raw: "" }),
	tosUI = ref(null),
	answerValue = computed(() => {
		let r = `${zeroes.value.input}@${signs.value.input}`
		if (withGrows.value) {
			r += `@${grows.value.input}`
		}
		if (withCoords.value) {
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
				:mode="'grows'"
				:roots="zeroes.tex.split(',')"
				:signs="signs.input.split('') as TABLE_OF_SIGNS_VALUES[]"
			/>
		</div>


		<div class="max-w-xl mx-auto flex flex-col gap-3 keyboard">
			<div
				:class="(withGrows && !withCoords)?'grid-cols-3':'grid-cols-2'"
				class="grid gap-3"
			>
				<button
					:class="showKeyboard==='zeroes'?'btn-primary':''"
					class="py-0 px-5"
					@click="showKeyboard='zeroes'"
				>
					zéros
				</button>
				<button
					:class="showKeyboard==='signs'?'btn-primary':''"
					class="py-0 px-5"
					@click="showKeyboard='signs'"
				>
					signes
				</button>
				<button
					v-if="withGrows"
					:class="showKeyboard==='grows'?'btn-primary':''"
					class="py-0 px-5"
					@click="showKeyboard='grows'"
				>
					croissance
				</button>
				<button
					v-if="withCoords"
					:class="showKeyboard==='coords'?'btn-primary':''"
					class="py-0 px-5"
					@click="showKeyboard='coords'"
				>
					coordonnées
				</button>
			</div>

			<!-- Add keyboard to input the zeros -->
			<KeyboardDisplay
				v-show="showKeyboard==='zeroes'"
				:keyboard="zeroesKeyboard"
				:multiple="true"
				back
				key-class="bg-white"
				reset
				@change="changeKeyboard"
			/>

			<KeyboardDisplay
				v-show="showKeyboard==='signs'"
				:custom-keys="{
					'd': {type: 'math', display: '\\textcolor{red}{\\Vert}'},
					'z': {type: 'math', display: '0'},
					'!': {type: 'bg', display: 'bg-stripes bg-stripes-red-100'}
				}"
				:keyboard="{
					grid: 'grid-cols-6',
					layout: [['+', 2], ['-', 2], ['!', 2], ['z', 3], ['d', 3], ['@back', 3], ['@reset', 3]]
				}"
				key-class="bg-white"
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
				}"
				:keyboard="{
					grid: 'grid-cols-3',
					layout: ['+', '-', 'd', 'm', 'M', '_', '', '@back', '@reset']
				}"
				key-class="bg-white"
				@change="changeKeyboard"
			/>

			<KeyboardDisplay
				v-show="showKeyboard==='coords'"
				:keyboard="zeroesKeyboard"
				:multiple="true"
				back
				key-class="bg-white"
				reset
				@change="changeKeyboard"
			/>
		</div>
	</article>
</template>
