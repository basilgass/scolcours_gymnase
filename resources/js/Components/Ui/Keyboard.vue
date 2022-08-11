<template>
	<div class="keyboard-wrapper">
		<div class="keyboard-output">
			<div
				v-if="mathOutput"
				class="grid grid-cols-1 min-h-[50px]"
			>
				<div
					v-katex.ascii.left.nomargin="props.modelValue"
					class="self-center"
				/>
			</div>
			<div
				v-if="textOutput"
				class="grid grid-cols-1 min-h-[40px] italic"
			>
				<div

					class="self-center"
					v-text="props.modelValue"
				/>
			</div>
		</div>

		<!-- keyboard keys -->
		<div
			ref="root"
			class="grid gap-2 keyboard"
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
			</button>
		</div>

		<!-- keyboard commands -->
		<div
			v-if="keyboardCommands.length>0"
			class="keyboard flex w-full mt-10 gap-3"
			:class="`grid-cols-${keyboardCommands.length}`+ (small?' keyboard-sm':'')"
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
		<div
			v-if="validate"
			class="keyboard w-full mt-3"
		>
			<button
				:class="`key ${keyClass} w-full`"
				@click="btnValidate.fn()"
			>
				<i :class="btnValidate.icon" /> <span class="hidden md:inline md:ml-2">{{ btnValidate.label }}</span>
			</button>
		</div>
	</div>
</template>

<script setup>
import {computed, ref} from "vue"
import {keyboardKeys, keyboards} from "@/keyboards"

const emit = defineEmits(["update:modelValue", "update:tex", "validate", "next", "key"])
const props = defineProps({
	modelValue: String,
	tex: String,
	keyboard: {type: [Object, String], default: () => "simple"},
	validate: {type: Boolean, default: null},
	erase: {type: Boolean, default: null},
	reset: {type: Boolean, default: null},
	back: {type: Boolean, default: null},
	next: {type: Boolean, default: null},
	multiple: {type: Boolean, default: null},
	mathOutput: {type: Boolean, default: false},
	textOutput: {type: Boolean, default: false},
	small: {type: Boolean, default: false},
	keyClass: {type: String, default: "bg-gray-50"}
})

let root = ref(null),
	keyStrokes = ref([]),
	keyboardGridDefault = ref("grid-cols-4")

let keyboardData = computed(() => {
	if (typeof props.keyboard === "string" && keyboards[props.keyboard] !== undefined) {
		return keyboards[props.keyboard]
	} else {
		return props.keyboard
	}
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
		fn: () => emit("next"),
		atEnd: false
	},
	btnValidate = {
		label: "valider",
		icon: "bi bi-check",
		span: 3,
		fn: () => emit("validate"),
		atEnd: false
	}

let keyboardComputed = computed(() => {
		let data = []

		// Loop through all keyboard keys in the layout.
		for (let key of keyboardData.value.layout) {
			let kkey = typeof key === "string" ? key : key[0],
				spankey = typeof key === "string" ? 0 : key[1],
				kdata = {}

			if (spankey === 2) {
				spankey = "col-span-2"
			} else if (spankey === 3) {
				spankey = "col-span-3"
			} else if (spankey === 4) {
				spankey = "col-span-4"
			} else if (spankey === 5) {
				spankey = "col-span-5"
			}

			kdata = {
				key: kkey,
				visible: kkey === "",
				type: keyboardKeys[kkey] === undefined ? false : keyboardKeys[kkey].type,
				display: keyboardKeys[kkey] === undefined ? false : keyboardKeys[kkey].display,
				span: spankey
			}

			if (keyboardKeys[kkey] === undefined) {
				kdata.fn = (key) => props.modelValue + ""
			} else {
				if (keyboardKeys[kkey].fn === undefined) {
					kdata.fn = (value) => value + kkey
				} else {
					kdata.fn = keyboardKeys[kkey].fn
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
	emit("update:modelValue", "")
	emit("update:tex", "")
}

function backKeyStrokes() {
	ButtonKeyClick({
		key: "@back"
	})
}

function ButtonKeyClick(key) {
	if (key.key === "@back") {
		keyStrokes.value.pop()
	} else if (key.key === "@reset") {
		resetKeyStrokes()
	} else {
		keyStrokes.value.push(key)
	}

	let output = "", result = keyStrokes.value.map(k => k.fn(output)).join("")
	emit("update:modelValue", result)
	emit("update:tex", keyboards[props.keyboard].tex ? keyboards[props.keyboard].tex(result) : result)
	emit("key", result)
}

defineExpose({resetKeyStrokes})
</script>
<style scoped>

</style>
