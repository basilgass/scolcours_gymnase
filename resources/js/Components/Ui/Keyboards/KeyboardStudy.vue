<template>
	<div class="max-w-xl mx-auto">
		<div
			v-show="showGraph"
			class="overflow-x-scroll my-5"
		>
			<!-- Visual output -->
			<div
				ref="draw"
			/>
			<div ref="outputHTML" />
		</div>

		<div>
			<div class="flex gap-5 items-baseline justify-center">
				<button
					v-for="item in items"
					:key="item"
					v-katex.ascii.nomargin="item"
					class="btn py-2 bg-white hover:bg-amber-300 transition-colors"
					@dblclick="removeItem(item)"
				/>
			</div>
			<div
				v-show="items.length>0"
				class="text-xs text-gray-700 text-center"
			>
				double-cliquer pour supprimer
			</div>
		</div>

		<div class="flex flex-col gap-3 keyboard">
			<button
				ref="validateButton"
				class="key-cmd bg-white w-full
				border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800
				mb-3"
				@click="btnValidate"
			>
				<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
			</button>

			<!-- Keyboard selection -->
			<div class="flex gap-3 justify-center">
				<button
					v-for="btn of addButtons"
					:key="btn"
					class="py-0 px-10 btn bg-white py-3"
					@click="addItemToGraph(btn)"
				>
					{{ btn }}
				</button>
			</div>
			<!-- Keyboard inputs -->
			<div class="min-h-[4em]">
				<div v-katex="tex" />
				<div
					class="text-center text-red-500 text-sm"
					v-html="message"
				/>
			</div>

			<Keyboard
				ref="keyboardUI"
				v-model="display"
				v-model:tex="tex"
				keyboard="algebra"
				key-class="bg-white"
				class="max-w-xl mx-auto"
				reset
				back
				@clear="message=''"
			/>
		</div>
	</div>
</template>

<script setup>

import {nextTick, onMounted, ref} from "vue"
import {wrongAnswerAnimation} from "@/Composables/useHelpers"
import {PiDraw} from "pidraw/esm"
import Keyboard from "@/Components/Ui/Keyboard.vue"
import katex from "katex"
import Button from "@/Components/Auth/Button.vue"

let props = defineProps({
	modelValue: {type: String, required: true},
	tex: {type: String, required: true},
	options: {type: String}
})
let emits = defineEmits(["update:modelValue", "update:tex", "validate"])

let outputHTML = ref(null),
	validateButton = ref(null),
	btnValidate = function () {
		// Get all outputs
		emits("update:modelValue", items.value.sort().join(","))
		emits("update:tex", items.value.sort().join(","))
		emits("validate")
	},
	resetKeyStrokes = function () {
		// Reset keystrokes
	},
	wrongAnswer = function () {
		wrongAnswerAnimation(validateButton.value)
	},
	getTex = function (value) {
		const v = value.split("@")

		nextTick(() => outputHTML.value.$el.innerHTML).then(resolve => {
			emits("update:tex", resolve)
		})

		return ""
	}

defineExpose({resetKeyStrokes, wrongAnswer, getTex})

// Code specific to Study.
let PiGraph,
	draw = ref(null),
	keyboardUI = ref(null),
	theOptions = ref(props.options.toLowerCase().split(",")),
	addButtons = ref([]),
	tex = ref(""),
	display = ref(""),
	message = ref(""),
	showGraph = ref(true),
	items = ref([])


onMounted(()=>{
	if(theOptions.value.length>0){
		for(let opt of theOptions.value){
			if(opt==="ah"){
				addButtons.value.push("AH")
			}else if(opt==="av"){
				addButtons.value.push("AV")
			}else if(opt==="ao"){
				addButtons.value.push("AO")
			}else if(opt==="p" || opt==="z" || opt==="o"){
				if(addButtons.value.indexOf("point")===-1) {
					addButtons.value.push("point")
				}
			}else if(opt==="e"){
				addButtons.value.push("extremum")
			}else if(opt==="g"){
				showGraph.value=false
			}
		}
	}else{
		addButtons.value = ["AV", "AH", "AO", "extremum", "point"]
	}
	PiGraph = new PiDraw(draw.value, {
		width: 800,
		height: 800,
		origin: {
			x: 400,
			y: 400
		},
		grid: {
			x: 20,
			y: 20
		}
	})
	PiGraph.axis()

	PiGraph.texConverter = {
		toTex: katex.renderToString,
		options: {
			throwOnError: false
		}
	}
})

function addItemToGraph(btn){

	// Checker.
	message.value = ""
	if(btn.startsWith("A")){
		let equ = display.value.split("=")


		if(equ.length!==2){
			message.value = "L'équation de la droite n'est pas correcte"
			return
		}

		if(equ[1].includes("x") || equ[1].includes("y")){
			message.value = "L'équation de la droite n'est pas correcte"
			return
		}

		if(btn==="AO"){
			if(equ[1].match(/x/).length!==1 && equ[1].match(/y/).length!==1){
				message.value="Ce n'est pas une asymptote oblique"
				return
			}

		}else if(btn==="AV"){
			if(equ[0]!=="x"){
				message.value="Ce n'est pas une asymptote verticale"
				return
			}

		}else if(btn==="AH") {
			if (equ[0]!=="y") {
				message.value = "Ce n'est pas une asymptote horizontale"
				return
			}

		}
	}else if(btn==="point"){
		if(!(display.value.startsWith("(") && display.value.endsWith(")") && display.value.split(";").length===2)){
			message.value="Ce n'est pas un point"
			return
		}
	}else{
		console.log("Btn not handled")
		return
	}

	items.value.push(display.value)

	// Reset the keyboard
	keyboardUI.value.resetKeyStrokes()
}

function removeItem(item) {
	items.value.splice(items.value.indexOf(item), 1)
}
</script>
