<script lang="ts" setup>
/**
 * KeyboardDisplay is just the display (keys)
 * emits: ["next", "change", "clear"]
 */

// TODO: Reformat to be more concise and clear !
import {asciiToTex, keyboardKey, KeyboardObjectType, normalizeLayoutKey} from "@/Composables/keyboardConfig"
import {
	formatFractionShortcut,
	formatKeyboardInput,
	hasTooManyFractionShortcuts
} from "@/Composables/keyboardFormatting.ts"
import {useKeyboard} from "@/Composables/useKeyboard.ts"
import {computed, ref} from "vue"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

const {keyboardKeys, keyboards} = useKeyboard()

const emits = defineEmits<{
	next: [],
	change: [event: KeyboardInputInterface],
	clear: [event: string]
}>()

const props = withDefaults(defineProps<{
	keyboard: string | KeyboardObjectType,
	tex?: string,
	erase?: boolean,
	reset?: boolean,
	back?: boolean,
	next?: boolean,
	multiple?: boolean,
	small?: boolean,
	keyClass?: string,
	extraLetters?: string[],
	customKeys?: Record<string, keyboardKey>
}>(), {
	tex: "",
	erase: false,
	reset: false,
	back: false,
	next: false,
	multiple: false,
	small: false,
	keyClass: "bg-action border rounded py-1 px-2 transition-colors",
	extraLetters: () => []
})


/**
 * Frappe mémorisée : seuls son code (`key`) et sa fonction de réduction (`fn`) sont lus
 * par le composant. Champs optionnels pour rester assignable depuis les deux sources —
 * un item de layout complet (keyboardKey) et le raccourci `{key, fn}` de btnAddResponse.
 */
interface KeyStroke {
	key?: string,
	fn?: (value: string) => string
}

const root = ref(null)
const keyStrokes = ref<KeyStroke[]>([])
const keyboardGridDefault = ref("grid-cols-4")

const theKeyboard = computed(() => {
	if (props.keyboard === null) {
		return ""
	}

	if (typeof props.keyboard === "string") {

		// Parse the keyboard value
		//TODO: is it still relevant ?
		const keyboardName = props.keyboard.split("@")[0]

		if (Object.hasOwn(keyboards, keyboardName)) {
			return keyboardName
		} else {
			return ""
		}
	}

	// It's a custom keyboard
	return props.keyboard
})

const keyboardOptions = computed(() => {
	if (props.extraLetters?.length > 0) {
		return props.extraLetters.map(x => {
			const keyDisplay = x.split("||")
			const display = keyDisplay.length >= 2 ? keyDisplay[1] : keyDisplay[0]
			const output = keyDisplay[0].startsWith("#") ? keyDisplay[0].substring(1) : keyDisplay[0]
			const isMath = display.startsWith("#") || display.startsWith("\\")

			return {
				key: keyDisplay[0],
				visible: true,
				type: isMath ? "math" : "text",
				display: display.startsWith("#") ? asciiToTex(display.substring(1)) : display,
				span: 0,
				fn: (value: string) => {
					return value + output
				}
			}
		})
	}

	return []
})

const keyboardData = computed<KeyboardObjectType>(() => {
	if (typeof theKeyboard.value === "string") {
		return keyboards[theKeyboard.value]
	}

	return props.keyboard as KeyboardObjectType
})

const btnReset = {
	label: "tout effacer",
	icon: "bi bi-trash",
	span: 1,
	fn: () => resetKeyStrokes(),
	atEnd: false
}
const btnAddResponse = {
	label: "Ajouter",
	icon: "bi bi-plus-circle",
	span: 1,
	fn: () => {
		ButtonKeyClick({
			key: ",",
			fn: (value: string) => value + ","
		})
	},
	atEnd: false
}
const btnBack = {
	label: "effacer",
	icon: "bi bi-backspace",
	span: 1,
	fn: () => backKeyStrokes(),
	atEnd: false
}
const btnNext = {
	label: "suivant",
	icon: "bi bi-arrow-bar-right",
	span: 1,
	fn: () => emits("next"),
	atEnd: false
}

/** Layout ramené à sa forme canonique unique (voir normalizeLayoutKey). */
const normalizedLayout = computed(() => keyboardData.value.layout.map(normalizeLayoutKey))

/** Traduit un span numérique en classe Tailwind (col-span-N) pour 2..5 ; inchangé sinon. */
function spanClass(span: number): number | string {
	return span >= 2 && span <= 5 ? `col-span-${span}` : span
}

const keyboardComputed = computed(() => {
	const data = []
	// Loop through all keyboard keys in the (normalized) layout.
	for (const entry of normalizedLayout.value) {
		const kkey = entry.key
		let kdata: keyboardKey
		let theKey: keyboardKey | undefined = entry.inlineKey ?? keyboardKeys[kkey as keyof typeof keyboardKeys]

		// Default key code data.
		kdata = {
			key: kkey,
			visible: kkey === "",
			type: theKey === undefined ? "" : theKey.type,
			display: theKey === undefined ? "" : theKey.display,
			span: spanClass(entry.span),
			fn: undefined
		}

		// Maybe there is a custom keys
		if (props.customKeys && Object.hasOwn(props.customKeys, kkey)) {
			theKey = props.customKeys[kkey]
			kdata = {
				...kdata,
				...props.customKeys[kkey]
			}
		}

		if (theKey === undefined) {
			kdata.fn = () => rawInput.value + ""
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
})

const keyboardCommands = computed(() => {
	// Return the buttons
	const commandsBtn = []

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

function ButtonKeyClick(key: KeyStroke): void {
	if (key.key === "@back") {
		keyStrokes.value.pop()
	} else if (key.key === "@reset") {
		resetKeyStrokes()
	} else {
		keyStrokes.value.push(key)
		if (fractionShortcutActive.value && hasTooManyFractionShortcuts(rawInput.value)) {
			keyStrokes.value.pop() // frappe rejetée : formerait un second "//" (clavier à raccourci)
			return                 // pas de changeEvent pour une frappe annulée
		}
	}

	changeEvent()
}

const changeEvent = function () {
	const result = formatKeyboardInput(rawInput.value, activeFormatters.value)

	emits("change", {
		input: result,
		tex: getTex(result),
		raw: ""
	})

}

function getTex(value: string): string {
	const output = []

	for (const v of value.split(",")) {
		output.push(getTexFromOneValue(v))
	}
	return output.join(",")
}

function getTexFromOneValue(value: string): string {
	if (typeof theKeyboard.value === "string") {
		const kb = keyboards[theKeyboard.value]
		return kb.tex ? kb.tex(value) : value
	} else {
		return theKeyboard.value.tex ? theKeyboard.value.tex(value) : value
	}
}

/** Source unique de la réduction des frappes (saisie brute, non formatée). */
const rawInput = computed(() => keyStrokes.value.map(k => k.fn?.("") ?? "").join(""))

/** Règles de formatage déclarées par le clavier courant (vide = aucune). */
const activeFormatters = computed(() => keyboardData.value?.formatters ?? [])

/** Le raccourci fraction "//" est-il actif sur ce clavier ? Gouverne le blocage du 2e "//". */
const fractionShortcutActive = computed(() => activeFormatters.value.includes(formatFractionShortcut))

defineExpose({resetKeyStrokes})

</script>

<template>
	<div
		v-if="theKeyboard !== ''"
		class="keyboard-wrapper"
	>
		<!-- keyboard keys -->
		<div
			ref="root"
			:class="(keyboardData.grid ?? keyboardGridDefault) + (small ? ' keyboard-sm' : '')"
			class="grid gap-1 lg:gap-2 keyboard"
		>
			<button
				v-for="(key, index) of keyboardComputed"
				:key="`key-${key.key}-${index}`"
				class="key"
				:class="`${keyClass} ${key.span === 0 ? '' : key.span} ${key.visible ? 'invisible' : ''} ${key.type === 'bg' ? key.display : ''}`"
				@click="ButtonKeyClick(key)"
			>
				<span
					v-if="key.type === 'math'"
					v-katex.clear="key.display"
				/>
				<i
					v-else-if="key.type === 'icon'"
					:class="key.display"
				/>
				<span
					v-else-if="key.type === 'text'"
					v-katex.auto="key.display"
				/>
				<span
					v-else-if="key.type !== 'bg'"
					v-html="key.display"
				/>
			</button>
		</div>

		<!-- keyboard extra buttons -->
		<div
			v-if="keyboardOptions.length > 0"
			:class="small ? ' keyboard-sm' : ''"
			class="keyboard flex flex-wrap w-full mt-10 gap-3"
		>
			<button
				v-for="(key, index) of keyboardOptions"
				:key="`keyboard-options-${index}`"
				:class="`key ${keyClass} grow`"
				@click="ButtonKeyClick(key)"
			>
				<span
					v-if="key.type === 'math'"
					v-katex.clear="key.display"
				/>
				<span
					v-else-if="key.type === 'text'"
					v-katex.auto="key.display"
				/>
			</button>
		</div>

		<!-- keyboard commands -->
		<div
			v-if="keyboardCommands.length > 0"
			:class="small ? ' keyboard-sm' : ''"
			class="keyboard flex w-full mt-10 gap-3"
		>
			<button
				v-for="(item, index) of keyboardCommands"
				:key="`keyboard-command-${index}`"
				:class="`key ${keyClass} grow flex-1 ${item.atEnd ? 'order-last' : ''}`"
				@click="item.fn()"
			>
				<i :class="item.icon" /> <span class="hidden md:inline md:ml-2">{{ item.label }}</span>
			</button>
		</div>
	</div>
</template>

<style scoped>
button {
	cursor: pointer;
}
</style>
