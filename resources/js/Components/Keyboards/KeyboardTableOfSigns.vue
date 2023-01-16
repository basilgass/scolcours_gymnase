<template>
	<div>
		<div
			class="overflow-x-scroll my-5 hidden"
		>
			<pi-table-of-signs
				ref="tosUI"
				:tos="tos"
				:fn="tosName"
			/>
		</div>

		<keyboard-validate-button
			ref="validateButton"
			@validate="validateEvent"
		/>

		<div class="max-w-xl mx-auto flex flex-col gap-3 keyboard">
			<div
				class="grid gap-3"
				:class="(withGrows && !withCoords)?'grid-cols-3':'grid-cols-2'"
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
					@click="showKeyboard='coords';updateTos()"
				>
					coordonnées
				</button>
			</div>

			<!-- Add keyboard to input the zeros -->
			<KeyboardElement
				v-show="showKeyboard==='zeroes'"
				:multiple="true"
				back
				key-class="bg-white"
				keyboard="exact"
				reset
				@change="zeroes = $event; updateTos()"
				@tex="zeroesTex = $event"
			/>

			<KeyboardElement
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
				@change="signs = $event; updateTos()"
				@tex="signsTex = $event"
			/>

			<KeyboardElement
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
				@change="grows = $event; updateTos()"
				@tex="growsTex = $event"
			/>

			<KeyboardElement
				v-show="showKeyboard==='coords'"
				:multiple="true"
				back
				key-class="bg-white"
				keyboard="exact"
				reset
				@change="coords = $event; updateTos()"
				@tex="coordsTex = $event"
			/>
		</div>
	</div>
</template>

<script setup>

import {computed, nextTick, ref} from "vue"
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import {keyboards} from "@/keyboards"
import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import KeyboardElement from "@/Components/Keyboards/KeyboardElement.vue"
import KeyboardValidateButton from "@/Components/Keyboards/KeyboardValidateButton.vue"
import {useCheckers} from "@/Composables/useCheckers"

let props = defineProps({
	options: {type: String},
	answer: {type: String}
})
let emits = defineEmits(["change", "validate"])

let showKeyboard = ref("zeroes")
let showZeroesKeyboard = ref(true),
	showSignsKeyboard = ref(false),
	showGrowsKeyboard = ref(false)

let zeroes = ref(""),
	zeroesTex = ref(""),
	signs = ref(""),
	signsTex = ref(""),
	grows = ref(""),
	growsTex = ref(""),
	coords = ref(""),
	coordsTex = ref(""),
	validateButton = ref(null),
	tosUI = ref(null),
	tosName = computed(()=>{
		let names = props.options.split("\n").filter(x=>x.includes("(x)")).map(x=>x.split("(")[0])

		return names.length===0 ? "f" : names[0]
	}),
	withGrows = computed(()=>{
		return props.answer.split("@").length>2
	}),
	withCoords = computed(()=>{
		return props.answer.split("@").length>3
	}),
	tos = computed(() => {
		if(withGrows.value){
			let extremes = {},
				extremesValues = coords.value.split(","),
				zeroesValues = zeroes.value.split(",")

			if(showKeyboard.value!=="coords"){
				extremesValues=[]
			}

			for(let i in zeroesValues){
				let z = zeroesValues[i],
					g = grows.value[2*i+1]

				if(g!==undefined) {
					let t = ""
					if (g === "M") {
						t = "max"
					} else if(g==="m") {
						t = "min"
					} else if(g==="_"){
						t = "replat"
					}

					let label = " "
					if(extremesValues[i]!==undefined){
						label = `\\left(${z};${extremesValues[i]===""?"?":extremesValues[i]}\\right)`
					}

					extremes[keyboards.exact.tex(z)] = {
						tex: {x: 1, y: 2},
						type: t,
						value: {x: 1, y: 2},
						label
					}

					console.log(extremes[keyboards.exact.tex(z)])
				}
			}

			return {
				zeroes: zeroes.value.split(",").map(x => {
					return {tex: keyboards.exact.tex(x)}
				}),
				factors: [],
				extremes,
				type: "grows",
				grows: [...grows.value.split("")],
				signs: [
					["", ...signs.value.split(""), ""],
					["", ...signs.value.split(""), ""]
				]
			}
		}

		return {
			zeroes: zeroes.value.split(",").map(x => {
				return {tex: keyboards.exact.tex(x)}
			}),
			factors: [],
			signs: [["", ...signs.value.split(""), ""]]
		}
	}),
	resetKeyStrokes = function () {
		zeroes.value = ""
		signs.value = ""
		grows.value = ""
		coords.value = ""
	},
	wrongAnswer = function () {
		useWrongAnswerAnimation(validateButton.value)
	},
	getTex = function (value) {
		return ""
	},
	getRaw = function (value) {
		const v = value.split("@")

		zeroes.value = v[0]
		signs.value = v[1]
		if(withGrows.value) {
			grows.value = v[2]
		}
		if(withCoords.value){
			coords.value = v[3]
		}

		nextTick(() => tosUI.value.$el.innerHTML).then(resolve => {
			changeEvent()
			// emits("tex", "")
			// emits("raw", resolve)
		})

		return ""
	},
	getAnswer = function(value){
		return {
			tex: getTex(value),
			raw: getRaw(value)
		}
	},
	answerValue = computed(()=>{
		let r = `${zeroes.value}@${signs.value}`
		if(withGrows.value){
			r +=`@${grows.value}`
		}
		if(withCoords.value){
			r +=`@${coords.value}`
		}

		return r
	}),
	validateEvent = function () {
		const check = useCheckers("tos").check(props.answer, answerValue.value)

		emits("validate", {
			code: answerValue.value,
			tex: "",
			raw: tosUI.value.$el.innerHTML,
			correct: check.result,
			message: check.message
		})
	},
	updateTos = async function(){
		await nextTick()
		changeEvent()
	}

const changeEvent= function(){
	emits("change",{
		tex: "",
		raw: tosUI.value.$el.innerHTML
	})
}
defineExpose({resetKeyStrokes, wrongAnswer, getAnswer})
</script>
