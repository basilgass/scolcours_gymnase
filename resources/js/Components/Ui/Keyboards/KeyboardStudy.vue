<template>
	<div>
		<div class="overflow-x-scroll my-5">
			<!-- Visual output -->
			<div ref="draw" />
			<div ref="outputHTML" />
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

			<!-- Keyboard selection -->
			<div class="flex gap-3 justify-center">
				<button
					v-for="btn of addButtons"
					:key="btn"
					class="py-0 px-10"
					:class="selectedButton===btn?'btn-primary':'btn bg-white'"
					@click="addItemToGraph(btn)"
				>
					{{ btn }}
				</button>
			</div>
			<!-- Keyboard inputs -->
			<div v-katex="tex" />
			<div v-html="message" />
			<Keyboard
				ref="keyboardUI"
				v-model="display"
				v-model:tex="tex"
				keyboard="algebra"
				key-class="bg-white"
				class="max-w-xl mx-auto"
				validate
				reset
				back
			/>
		</div>
	</div>
</template>

<script setup>

import {nextTick, onMounted, ref} from "vue"
import {wrongAnswerAnimation} from "@/Composables/useHelpers"
import {PiDraw} from "pidraw/esm"
import Keyboard from "@/Components/Ui/Keyboard.vue"

let props = defineProps({
	modelValue: {type: String, required: true},
	tex: {type: String, required: true},
	options: {type: String}
})
let emits = defineEmits(["update:modelValue", "update:tex", "validate"])

let outputHTML = ref(null),
	validateButton = ref(null),
	btnValidate = function () {
		emits("update:modelValue", "")
		emits("update:tex", "")
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
	theOptions = ref(props.options.toLowerCase().split(",")),
	addButtons = ref([]),
	selectedButton = ref(""),
	tex = ref(""),
	display = ref(""),
	message = ref("")


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
})

function addItemToGraph(btn){
	selectedButton.value=btn

	// Checker.
	message.value = ""
	if(btn.startsWith("A")){
		let equ = btn.split("=")

		if(equ.length!==2){
			message.value = "L'équation de la droite n'est pas correcte"
		}

		if(equ[1].contains("x") || equ[1].contains("y")){
			message.value = "L'équation de la droite n'est pas correcte"
		}

		if(btn==="AO"){
			if(equ[1].match(/x/).length!==1 && equ[1].match(/y/).length!==1){
				message.value="Ce n'est pas une asymptote oblique"
			}

		}else if(btn==="AV"){
			if(equ[0]!=="x"){
				message.value="Ce n'est pas une asymptote verticale"
			}

		}else if(btn==="AH") {
			if (equ[0]!=="y") {
				message.value = "Ce n'est pas une asymptote horizontale"
			}

		}
	}else if(btn==="point"){
		
	}else{
		console.log("Btn not handled")
	}
}
</script>
