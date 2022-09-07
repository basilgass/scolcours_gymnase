<template>
	<div class="keyboard">
		<button
			ref="validateButton"
			:class="`key-cmd bg-white  w-full border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800`"
			@click="btnValidate"
		>
			<i class="bi bi-check"/> <span class="hidden md:inline md:ml-2">Valider</span>
		</button>

		<div class="overflow-x-scroll my-5">
			<pi-table-of-signs ref="tosUI" :tos="tos"/>
		</div>
		<div>
			<form-input v-model="zeroes" label="zéro(s)" name="zereos"/>
			<form-input v-model="signs" label="signes" name="signs"/>
		</div>
	</div>
</template>

<script setup>

import {computed, nextTick, ref} from "vue";
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns";
import {asciiToTex} from "@/keyboards";
import FormInput from "@/Components/Form/FormInput";

let props = defineProps({
	modelValue: {type: String, required: true},
	tex: {type: String, required: true},
	options: {type: String}
})
let emits = defineEmits(['update:modelValue', 'update:tex', 'validate'])

let zeroes = ref(''),
	signs = ref(''),
	validateButton = ref(null),
	tosUI = ref(null),
	tos = computed(() => {
		return {
			zeroes: zeroes.value.split(',').map(x => {
				return {tex: asciiToTex(x)}
			}),
			factors: [],
			signs: [['', ...signs.value.split(''), '']]
		}
	}),
	btnValidate = function () {
		emits('update:modelValue', `${zeroes.value}@${signs.value}`)
		emits('update:tex', tosUI.value.$el.innerHTML)
		emits('validate')
	},
	resetKeyStrokes = function () {
		zeroes.value = ''
		signs.value = ''
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
		const v = value.split('@')
		zeroes.value = v[0]
		signs.value = v[1]

		let html = nextTick(()=>tosUI.value.$el.innerHTML)

		html.then(resolve=>{
			emits('update:tex', resolve)
		})

		return ''
	}

defineExpose({resetKeyStrokes, wrongAnswer, getTex})
</script>
