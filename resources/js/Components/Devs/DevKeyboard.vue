<template>
	<div>
		<h1 class="text-xl">
			Test clavier
		</h1>

		<div class="flex flex-col gap-3">
			<div class="flex flex-wrap justify-between gap-3">
				<button
					v-for="item in choices"
					:key="item"
					class="btn btn-xs"
					:class="keyboard===item?'btn-success':''"
					@click="keyboard=item"
				>
					{{ item }}
				</button>
			</div>
			<div class="flex justify-between">
				<label>validate <input
					v-model="validate"
					type="checkbox"
				></label>
				<label>reset <input
					v-model="reset"
					type="checkbox"
				></label>
				<label>back <input
					v-model="back"
					type="checkbox"
				></label>
				<label>next <input
					v-model="next"
					type="checkbox"
				></label>
				<label>multiple <input
					v-model="multiple"
					type="checkbox"
				></label>
			</div>
			<div>
				<input v-model="letters">
			</div>
		</div>

		<div
			v-katex.display="tex"
			class="katex-block"
		/>
		<div
			v-html="raw"
		/>

		<div
			class="font-code border px-3 py-2 bg-amber-200 my-5"
			v-text="result"
		/>

		<div v-if="isKeyboardComponent">
			Regular keyboard
		</div>
		<div v-else>
			Component keyboard
		</div>
		<!--		keyboard + (letters===''?'':`@${letters}`)-->
		<KeyboardBase
			v-if="isKeyboardComponent"
			v-model="result"
			:keyboard="keyboard"
			math-output
			text-output
			:validate="validate"
			:reset="reset"
			:back="back"
			:next="next"
			:multiple="multiple"
			class="max-w-3xl mx-auto"
			@tex="tex = $event"
			@raw="raw = $event"
		/>
		<component
			:is="keyboardComponent"
			v-else
			ref="componentUI"
			v-model="result"
			class="max-w-xl mx-auto"
			:options="keyboardComponentProps"
			@tex="tex = $event"
			@raw="raw = $event"
			@validate="checkValidation"
		/>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {keyboardsList} from "@/keyboards"

import {computed, defineAsyncComponent, ref} from "vue"
import KeyboardBase from "@/Components/Keyboards/KeyboardBase.vue"

let keyboard = ref("#Study"),
	choices = ref(keyboardsList),
	result = ref(""),
	validate=ref(true),
	reset=ref(true),
	next=ref(true),
	back=ref(true),
	multiple=ref(true),
	letters=ref("a,b,c,n,m"),
	tex = ref(""),
	raw = ref("")

let isKeyboardComponent = computed(() => {
		return !(keyboard.value[0]=== "#")
	}),
	keyboardComponentProps = computed(()=>{
		// let kbrd = keyboard.value.split("@")
		// return kbrd.length === 2 ? kbrd[1] : null
		if(keyboard.value==="#Study"){
			return "trace,f=(2*x-3)/x&red&500|2/3*x-5&-1:10&green"
		}else {
			return letters.value.length > 0 ? letters.value : null
		}
	}),
	keyboardComponent = computed(() => {
		let kbrd = keyboard.value.split("@")
		return defineAsyncComponent(() => import(`@/Components/Keyboards/Keyboard${kbrd[0].substring(1)}`))
	})

function checkValidation() {
	console.log(result.value)
}
</script>
