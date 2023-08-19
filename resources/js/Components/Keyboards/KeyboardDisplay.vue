<template>
	<div
		v-if="theKeyboard!==''"
		class="keyboard-wrapper"
	>
		<div class="keyboard-output">
			<div
				v-if="mathOutput"
				class="grid grid-cols-1 min-h-[50px]"
			>
				<div
					v-katex.ascii.left.nomargin="getTex(answerOutput)"
					class="self-center"
				/>
			</div>
			<div
				v-if="textOutput"
				class="grid grid-cols-1 min-h-[40px] italic"
			>
				<div

					class="self-center"
					v-text="answerOutput"
				/>
			</div>
		</div>

		<!-- keyboard validate (top version) -->
		<div
			v-if="validate && !validateAtBottom"
			class="keyboard w-full my-3"
		>
			<button
				ref="validateButton"
				:class="`key-cmd ${keyClass} w-full border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800`"
				@click="btnValidate.fn()"
			>
				<i :class="btnValidate.icon" /> <span class="hidden md:inline md:ml-2">{{ btnValidate.label }}</span>
			</button>
		</div>

		<!-- keyboard keys -->
		<div
			ref="root"
			class="grid gap-1 lg:gap-2 keyboard"
			:class="(keyboardData.grid??keyboardGridDefault) + (small?' keyboard-sm':'')"
		>
			<button
				v-for="(key, index) of keyboardComputed"
				:key="`key-${key.key}-${index}`"
				class="key"
				:class="`${keyClass} ${key.span===0?'':key.span} ${key.visible?'invisible':''}`"
				@click="ButtonKeyClick(key)"
			>
				<span
					v-if="key.type==='math'"
					v-katex.clear="key.display"
				/>
				<i
					v-else-if="key.type==='icon'"
					:class="key.display"
				/>
				<span
					v-else-if="key.type==='text'"
					v-katex.auto="key.display"
				/>
				<span
					v-else
					v-html="key.display"
				/>
			</button>
		</div>

		<!-- keyboard extra buttons -->
		<div
			v-if="keyboardOptions.length>0"
			class="keyboard flex flex-wrap w-full mt-10 gap-3"
			:class="small?' keyboard-sm':''"
		>
			<button
				v-for="(key, index) of keyboardOptions"
				:key="`keyboard-options-${index}`"
				:class="`key ${keyClass} grow`"
				@click="ButtonKeyClick(key)"
			>
				<span
					v-if="key.type==='math'"
					v-katex.clear="key.display"
				/>
				<span
					v-else-if="key.type==='text'"
					v-katex.auto="key.display"
				/>
			</button>
		</div>

		<!-- keyboard commands -->
		<div
			v-if="keyboardCommands.length>0"
			class="keyboard flex w-full mt-10 gap-3"
			:class="small?' keyboard-sm':''"
		>
			<button
				v-for="(item, index) of keyboardCommands"
				:key="`keyboard-command-${index}`"
				:class="`key ${keyClass} grow ${item.atEnd?'order-last':''}`"
				@click="item.fn()"
			>
				<i :class="item.icon" /> <span class="hidden md:inline md:ml-2">{{ item.label }}</span>
			</button>
		</div>

		<!-- keyboard validate (bottom version) -->
		<div
			v-if="validate && validateAtBottom"
			class="keyboard w-full my-3"
		>
			<button
				ref="validateButton"
				:class="`key-cmd ${keyClass} w-full border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800`"
				@click="btnValidate.fn()"
			>
				<i :class="btnValidate.icon" /> <span class="hidden md:inline md:ml-2">{{ btnValidate.label }}</span>
			</button>
		</div>
	</div>
</template>

<script setup>
import {computed, ref} from "vue"
import {useKeyboard} from "@/Composables/useKeyboard"

let {asciiToTex, keyboardKeys, keyboards} = useKeyboard()

const emits = defineEmits(["tex", "raw", "validate", "next", "change", "clear"])
const props = defineProps({
	tex: String,
	keyboard: {type: [Object, String], default: () => "simple"},
	validate: {type: Boolean, default: null},
	validateAtBottom: {type: Boolean, default: false},
	erase: {type: Boolean, default: null},
	reset: {type: Boolean, default: null},
	back: {type: Boolean, default: null},
	next: {type: Boolean, default: null},
	multiple: {type: Boolean, default: null},
	mathOutput: {type: Boolean, default: false},
	textOutput: {type: Boolean, default: false},
	small: {type: Boolean, default: false},
	keyClass: {type: String, default: "bg-gray-50"},
	extraLetters: {type: Array, default: ()=>[]},
	customKeys: {
		type: Object, default: () => {
		}
	}
})

let root = ref(null),
	keyStrokes = ref([]),
	keyboardGridDefault = ref("grid-cols-4")

let theKeyboard = computed(() => {
		if (props.keyboard === null) {
			return ""
		}

		if (typeof props.keyboard === "string") {

			// Parse the keyboard value
			//TODO: is it still relevant ?
			let keyboardName = props.keyboard.split("@")[0]

			if (keyboards.hasOwnProperty(keyboardName)) {
				return keyboardName
			} else {
				return ""
			}
		}

		// It's a custom keyboard
		return props.keyboard
	}),
	keyboardOptions = computed(() => {
		if (props.extraLetters.length>0) {
			let opts = props.extraLetters.map(x => {
				const keyDisplay = x.split("|"),
					d = keyDisplay.length >= 2 ? keyDisplay[1] : keyDisplay[0],
					isMath = d.startsWith("#") || d.startsWith("\\")

				return {
					key: keyDisplay[0],
					visible: true,
					type: isMath?"math":"text",
					display: d.startsWith("#")?asciiToTex(d.substring(1)):d,
					span: 0,
					fn: (value) => {
						return value + keyDisplay[0]
					}
				}
			})

			return opts
		}

		return []
	}),
	keyboardData = computed(() => {
		if (typeof theKeyboard.value === "string") {
			return keyboards[theKeyboard.value]
		}

		return props.keyboard
	})

const btnReset = {
		label: "tout effacer",
		icon: "bi bi-trash",
		span: 1,
		fn: () => resetKeyStrokes(),
		atEnd: false
	},
	btnAddResponse = {
		label: "Ajouter",
		icon: "bi bi-plus-circle",
		span: 1,
		fn: () => {
			ButtonKeyClick({
				key: ",",
				fn: (value) => value + ","
			})
		},
		atEnd: false
	},
	btnBack = {
		label: "effacer",
		icon: "bi bi-backspace",
		span: 1,
		fn: () => backKeyStrokes(),
		atEnd: false
	},
	btnNext = {
		label: "suivant",
		icon: "bi bi-arrow-bar-right",
		span: 1,
		fn: () => emits("next"),
		atEnd: false
	},
	btnValidate = {
		label: "valider",
		icon: "bi bi-check",
		span: 3,
		fn: () => emits("validate", answerOutput.value),
		atEnd: false
	}

let keyboardComputed = computed(() => {
		let data = []
		// Loop through all keyboard keys in the layout.
		for (let key of keyboardData.value.layout) {
			let kkey, spankey, kdata = {},
				theKey
			if(typeof key==="string"){
				kkey = key
				spankey = 0
				theKey = keyboardKeys[kkey]
			}else if(key.key !== undefined) {
				kkey = key.key
				spankey = key.span?key.span:0
				theKey = key
			}else {
				kkey = key[0]
				spankey = key[1]
				theKey = keyboardKeys[kkey]
			}

			// Span the buttons
			if (spankey === 2) {
				spankey = "col-span-2"
			} else if (spankey === 3) {
				spankey = "col-span-3"
			} else if (spankey === 4) {
				spankey = "col-span-4"
			} else if (spankey === 5) {
				spankey = "col-span-5"
			}

			// Default key code data.
			kdata = {
				key: kkey,
				visible: kkey === "",
				type: theKey === undefined ? false : theKey.type,
				display: theKey === undefined ? false : theKey.display,
				span: spankey
			}

			// Maybe there is a custom keys
			if(props.customKeys?.hasOwnProperty(kkey)) {
				kdata = {
					...kdata,
					...props.customKeys[kkey]
				}
			}

			if (theKey === undefined) {
				kdata.fn = (key) => answerOutput.value + ""
			} else {
				if (theKey.fn === undefined) {
					kdata.fn = (value) => value + kkey
				} else {
					kdata.fn = theKey.fn
				}
			}

			// Overrides existing values.
			if (keyboardData.value.keys !== undefined && keyboardData.value.keys[kkey] !== undefined) {
				kdata.type = keyboardData.value.keys[kkey].type === undefined ? kdata.type : keyboardData.value.keys[kkey].type
				kdata.display = keyboardData.value.keys[kkey].display === undefined ? kdata.display : keyboardData.value.keys[kkey].display
				kdata.fn = keyboardData.value.keys[kkey].fn === undefined ? kdata.fn : keyboardData.value.keys[kkey].fn
			}

			data.push(kdata)
		}

		return data
	}),
	keyboardCommands = computed(() => {
		// Return the buttons
		let commandsBtn = []

		if (props.back) {
			commandsBtn.push(btnBack)
		}
		if (props.reset) {
			commandsBtn.push(btnReset)
		}
		if (props.multiple) {
			commandsBtn.push(btnAddResponse)
		}
		if (props.next) {
			commandsBtn.push(btnNext)
		}

		return commandsBtn

	})

function resetKeyStrokes() {
	keyStrokes.value = []
	emits("change", {
		input: "",
		tex: "",
		raw: ""
	})
	emits("clear", "")
}

function backKeyStrokes() {
	ButtonKeyClick({key: "@back"})
	changeEvent()
	emits("clear", "")
}

function ButtonKeyClick(key) {
	if (key.key === "@back") {
		keyStrokes.value.pop()
	} else if (key.key === "@reset") {
		resetKeyStrokes()
	} else {
		keyStrokes.value.push(key)
	}

	changeEvent()
}
let changeEvent = function(){
	let output = "",
		result = keyStrokes.value
			.map(k => k.fn(output))
			.join("")

	emits("change",{
		input: result,
		tex: getTex(result),
		raw: ""
	})

	// emits("change", result)
	// emits("tex", getTex(result))
	// emits("raw", "")
}
let validateButton = ref(null)

function wrongAnswer() {
	if (validateButton.value) {
		validateButton.value.style.setProperty("animation-name", "v-shake-horizontal")
		validateButton.value.style.setProperty("animation-duration", "500ms")

		setTimeout(() => {
			if(validateButton.value) { // the button may have already disappeared !
				validateButton.value.style.setProperty("animation-name", "")
			}
		}, 500)
	}
}

function getTex(value) {
	let output = []

	for(let v of value.split(",")){
		output.push(getTexFromOneValue(v))
	}
	return output.join(",")
}

function getTexFromOneValue(value){
	if (typeof theKeyboard.value === "string") {
		return keyboards[theKeyboard.value].tex ? keyboards[theKeyboard.value].tex(value) : value
	} else {
		return theKeyboard.value.tex ? theKeyboard.value.tex(value) : value
	}
}

let answerOutput = computed(()=>{
	let output = ""

	return  keyStrokes.value
		.map(k => k.fn(output))
		.join("")
})

defineExpose({resetKeyStrokes, wrongAnswer, getTex})
</script>
<style scoped>

</style>
