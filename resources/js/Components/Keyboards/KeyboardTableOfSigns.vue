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
				:class="withGrows?'grid-cols-3':'grid-cols-2'"
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
					'M': {type: 'text', display: 'max'},
					'm': {type: 'text', display: 'min'},
					'_': {type: 'text', display: 'replat'},
				}"
				:keyboard="{
					grid: 'grid-cols-5',
					layout: ['+', '-', 'm', 'M', '_', '', '', '', '@back', '@reset']
				}"
				key-class="bg-white"
				@change="grows = $event; updateTos()"
				@tex="growsTex = $event"
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
	validateButton = ref(null),
	tosUI = ref(null),
	tosName = computed(()=>{
		let names = props.options.split("\n").filter(x=>x.includes("(x)")).map(x=>x.split("(")[0])

		return names.length===0 ? "f" : names[0]
	}),
	withGrows = computed(()=>{
		return props.options.split("\n").filter(x=>x.startsWith("dx")).length===1
	}),
	tos = computed(() => {
		if(withGrows.value){
			let extremes = {}
			for(let i in zeroes.value.split(",")){
				let z = zeroes.value.split(",")[i],
					g = grows.value[2*i+1]

				if(g!==undefined) {
					let t = "replat"
					if (g === "M") {
						t = "max"
					} else if(g==="m") {
						t = "min"
					}

					extremes[keyboards.exact.tex(z)] = {
						tex: {x: 1, y: 2},
						type: t,
						value: {x: 1, y: 2}
					}
				}
			}
			console.log(extremes)
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
		grows.value = v[2]

		nextTick(() => tosUI.value.$el.innerHTML).then(resolve => {
			emits("tex", "")
			emits("raw", resolve)
		})

		return ""
	},
	validateEvent = function () {
		const check = useCheckers("tos").check(props.answer, `${zeroes.value}@${signs.value}`)

		emits("validate", {
			code: `${zeroes.value}@${signs.value}`,
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
defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})
</script>
