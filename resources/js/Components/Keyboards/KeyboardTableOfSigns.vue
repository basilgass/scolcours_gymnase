<template>
	<div>
		<div
			class="overflow-x-scroll my-5 hidden"
		>
			<pi-table-of-signs
				ref="tosUI"
				:tos="tos"
			/>
		</div>

		<div class="max-w-xl mx-auto flex flex-col gap-3 keyboard">
			<button
				ref="validateButton"
				class="key-cmd bg-white w-full
				border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800
				mb-3"
				@click="btnValidate"
			>
				<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
			</button>

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
			<KeyboardBase
				v-show="showZeroesKeyboard"
				:multiple="true"
				back
				key-class="bg-white"
				keyboard="exact"
				reset
				@change="zeroes = $event; updateTos()"
				@tex="zeroesTex = $event"
			/>

			<KeyboardBase
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
import {wrongAnswerAnimation} from "@/Composables/useHelpers"
import KeyboardBase from "@/Components/Keyboards/KeyboardBase.vue"

let props = defineProps({
	options: {type: String},
	errorMessage: {type: String, default: ""}
})
let emits = defineEmits(["change", "tex", "raw", "validate"])

let showZeroesKeyboard = ref(true),
	showSignsKeyboard = ref(false)

let zeroes = ref(""),
	zeroesTex = ref(""),
	signs = ref(""),
	signsTex = ref(""),
	validateButton = ref(null),
	tosUI = ref(null),
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
		wrongAnswerAnimation(validateButton.value)
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
	btnValidate = function () {
		emits("change", `${zeroes.value}@${signs.value}`)
		emits("tex", "")
		emits("raw", tosUI.value.$el.innerHTML)
		emits("validate", `${zeroes.value}@${signs.value}`)
	},
	updateTos = async function(){
		await nextTick()
		emits("tex", "")
		emits("raw", tosUI.value.$el.innerHTML)
	}
defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})
</script>
