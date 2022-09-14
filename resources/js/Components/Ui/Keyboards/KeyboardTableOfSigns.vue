<template>
	<div>
		<div class="overflow-x-scroll my-5">
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
			<Keyboard
				v-show="showZeroesKeyboard"
				v-model="zeroes"
				v-model:tex="zeroesTex"
				:multiple="true"
				back
				key-class="bg-white"
				keyboard="exact"
				reset
			/>

			<Keyboard
				v-show="showSignsKeyboard"
				v-model="signs"
				v-model:tex="signsTex"
				:custom-keys="{
					'd': {type: 'math', display: '\\textcolor{red}{\\Vert}'},
					'z': {type: 'math', display: '0'},
				}"
				:keyboard="{
					grid: 'grid-cols-4',
					layout: ['+', '-', 'z', 'd', ['@back', 2], ['@reset', 2]]
				}"
				key-class="bg-white"
			/>
		</div>
	</div>
</template>

<script setup>

import {computed, nextTick, ref} from "vue"
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns"
import {keyboards} from "@/keyboards"
import Keyboard from "@/Components/Ui/Keyboard"

let props = defineProps({
	modelValue: {type: String, required: true},
	tex: {type: String, required: true},
	options: {type: String}
})
let emits = defineEmits(["update:modelValue", "update:tex", "validate"])

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
	btnValidate = function () {
		emits("update:modelValue", `${zeroes.value}@${signs.value}`)
		emits("update:tex", tosUI.value.$el.innerHTML)
		emits("validate")
	},
	resetKeyStrokes = function () {
		zeroes.value = ""
		signs.value = ""
	},
	wrongAnswer = function () {
		if (validateButton.value) {
			validateButton.value.style.setProperty("animation-name", "v-shake-horizontal")
			validateButton.value.style.setProperty("animation-duration", "500ms")

			setTimeout(() => {
				if (validateButton.value) { // the button may have already disappeared !
					validateButton.value.style.setProperty("animation-name", "")
				}
			}, 500)
		}
	},
	getHTML = async function(){
		await nextTick()

		return tosUI.value.$el.innerHTML
	},
	getTex = function (value) {
		const v = value.split("@")

		zeroes.value = v[0]
		signs.value = v[1]

		nextTick(() => tosUI.value.$el.innerHTML).then(resolve => {
			emits("update:tex", resolve)
		})

		return ""
	}

defineExpose({resetKeyStrokes, wrongAnswer, getTex})
</script>
