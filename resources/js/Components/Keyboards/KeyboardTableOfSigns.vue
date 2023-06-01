<template>
	<article>
		<div
			class="overflow-x-scroll my-5 hidden"
		>
			<pi-table-of-signs
				ref="tosUI"
				:fn="tosName"
				:tos="tos"
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
				}"
				:keyboard="{
					grid: 'grid-cols-4',
					layout: ['+', '-', 'z', 'd', ['@back', 2], ['@reset', 2]]
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
				:multiple="true"
				back
				key-class="bg-white"
				:keyboard="zeroesKeyboard"
				reset
				@change="changeKeyboard"
			/>
		</div>
	</article>
</template>

<script setup>
// TODO: permettre l'affichage de la réponse.
import {computed, nextTick, onMounted, ref} from "vue"
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {makeStudyFromCode} from "@/Composables/useTos"
import {useCheckers} from "@/Composables/useCheckers"
import {useKeyboard} from "@/Composables/useKeyboard"

let props = defineProps({
	options: {type: String},
	answer: {type: String}
})

let emits = defineEmits(["change", "validate"]),
	changeEvent = async function (value) {
		await nextTick()
		const check = useCheckers("tos").check(props.answer, answerValue.value)

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
// Les options du clavier TOS
let tosName = computed(() => { // le nom de la fonction
		let names = props.options.split("\n").filter(x => x.includes("(x)")).map(x => x.split("(")[0])
		return names.length === 0 ? "f" : names[0]
	}),
	withGrows = computed(() => { // s'il y a la croissance
		return props.answer.split("@").length > 2
	}),
	withCoords = computed(() => { // s'il faut donner les coordonnées
		return props.answer.split("@").length > 3
	})

// Le clavier a afficher
let showKeyboard = ref("zeroes"),
	changeKeyboard = function (event) {
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

		changeEvent()
	}

// Génération de la réponse pour comparaison et de l'affichage.
let zeroes = ref({input: "", tex: "", raw: ""}),
	zeroesKeyboard = ref(props.options.includes("float") ? "algebra" : "exact"),
	signs = ref({input: "", tex: "", raw: ""}),
	grows = ref({input: "", tex: "", raw: ""}),
	coords = ref({input: "", tex: "", raw: ""}),
	tosUI = ref(null),
	tos = computed(() => {
		return makeStudyFromCode(answerValue.value, showKeyboard.value === "coords")
	}),
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
onMounted(()=>{
	changeEvent()
})

let {loadAnswerToKeyboard} =useKeyboard(props)
let reset = function(){
	zeroes.value = {input: "", tex: "", raw: ""}
	signs.value = {input: "", tex: "", raw: ""}
	grows.value = {input: "", tex: "", raw: ""}
	coords.value = {input: "", tex: "", raw: ""}
}
defineExpose({
	reset,
	loadAnswer: (value)=>{
		loadAnswerToKeyboard(value, reset, changeEvent, (value)=>{

			// Display the correct answer
			let [z,s,g,c] = value.split("@")

			zeroes.value = {input: z, tex: "", raw: ""}
			signs.value = {input: s, tex: "", raw: ""}
			grows.value = {input: g??"", tex: "", raw: ""}

			if(c!==undefined) {
				showKeyboard.value = "coords"
				coords.value = {input: c, tex: "", raw: ""}
			}
		}
		)
	}
})


// let resetKeyStrokes = function () {
// 		zeroes.value = {input: "", tex: "", raw: ""}
// 		signs.value = {input: "", tex: "", raw: ""}
// 		grows.value = {input: "", tex: "", raw: ""}
// 		coords.value = {input: "", tex: "", raw: ""}
// 	},
// 	getRaw = function (value) {
// 		const v = value.split("@")
//
// 		zeroes.value.input = v[0]
// 		signs.value.input = v[1]
// 		if (withGrows.value) {
// 			grows.value.input = v[2]
// 		}
// 		if (withCoords.value) {
// 			coords.value.input = v[3]
// 		}
//
// 		nextTick(() => tosUI.value.$el.innerHTML).then(resolve => {
// 			changeEvent()
// 			// emits("tex", "")
// 			// emits("raw", resolve)
// 		})
//
// 		return ""
// 	},
// 	getAnswer = function (value) {
// 		return {
// 			tex: getTex(value),
// 			raw: getRaw(value)
// 		}
// 	}

</script>
