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
			<div class="flex gap-3 justify-center">
				<button
					:class="showZeroesKeyboard?'btn-primary':''"
					class="py-0 px-10"
					@click="showZeroesKeyboard=true;showSignsKeyboard=false"
				>
					zéros
				</button>
				<button
					:class="showSignsKeyboard?'btn-primary':''"
					class="py-0 px-10"
					@click="showSignsKeyboard=true;showZeroesKeyboard=false"
				>
					signes
				</button>
			</div>

			<!-- Add keyboard to input the zeros -->
			<KeyboardElement
				v-show="showZeroesKeyboard"
				:multiple="true"
				back
				key-class="bg-white"
				keyboard="exact"
				reset
				@change="zeroes = $event; updateTos()"
				@tex="zeroesTex = $event"
			/>

			<KeyboardElement
				v-show="showSignsKeyboard"
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

let showZeroesKeyboard = ref(true),
	showSignsKeyboard = ref(false)

let zeroes = ref(""),
	zeroesTex = ref(""),
	signs = ref(""),
	signsTex = ref(""),
	validateButton = ref(null),
	tosUI = ref(null),
	tosName = computed(()=>{
		let names = props.options.split("\n").filter(x=>x.includes("(x)")).map(x=>x.split("(")[0])

		return names.length===0 ? "f" : names[0]
	}),
	tos = computed(() => {
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
