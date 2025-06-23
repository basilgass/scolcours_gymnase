<script lang="ts" setup>
import {computed, onMounted, ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {type CHECKERS, checkersList, PiChecker} from "@/Checkers"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"

const theValue = defineModel<string>()

defineOptions({
	inheritAttrs: false
})

const inp = ref(null)

function focusFn(select: boolean) {
	inp.value.focus()
	if (select === true) {
		inp.value.select()
	}
}

defineExpose({focus: focusFn})
// const emits = defineEmits(["update"])
const props = defineProps({
	rows: {type: Number, default: 2},
	focus: {type: Boolean, default: false}
})

const update = () => {
	// emits("update", theValue.value)
}

onMounted(() => {
	if (props.focus) focusFn(false)
})

const showKeyboardHelper = ref(false),
	currentLine = ref(""),
	currentLineKeyboardKey = computed(() => {
		return currentLine.value.split(",")[0]
	}),
	currentLineKeyboardDescription = computed(() => {
		const checker = new PiChecker(currentLineKeyboardKey.value)
		return checker.description
	}),
	currentLineKeyboards = computed(() => {
		return Object.keys(checkersList())
			.map((x: CHECKERS) => x.toString())
			.filter((x: string) =>
				x.startsWith(currentLineKeyboardKey.value)
			)
	}),
	keyboardHelper = computed(() => {
		return `${currentLineKeyboardDescription.value}\n- @format:custom format`
	})
const onKeyup = () => {
	const pos = inp.value.selectionStart,
		lines = theValue.value.split("\n"),
		lineIndex = theValue.value.substring(0, pos).split("\n").length - 1

	currentLine.value = lines[lineIndex]
}
const tabber = () => {
	if (currentLineKeyboards.value.length === 1) {
		const pos = inp.value.selectionStart,
			lines = theValue.value.split("\n"),
			lineIndex =
				theValue.value.substring(0, pos).split("\n").length - 1

		if (lines[lineIndex].startsWith(currentLineKeyboards.value[0]))
			return
		lines[lineIndex] = currentLineKeyboards.value[0]

		theValue.value = lines.join("\n")
	}
}

const currentRows = computed(() => {
	try {
		return Math.max(props.rows, theValue.value.split("\n").length + 1)
	} catch {
		return props.rows
	}
})

</script>
<template>
	<form-maker-wrapper
		v-bind="{...$attrs,...props}"
	>
		<div class="bg-gray-200">
			<textarea
				ref="inp"
				v-model="theValue"
				:rows="currentRows"
				class="w-full px-2 py-1 focus:outline-hidden focus:ring-0 font-code border-b bg-content border-content"
				v-bind="$attrs"
				@blur="showKeyboardHelper = false"
				@focus="showKeyboardHelper = true"
				@input="update"
				@keyup="onKeyup"
				@mouseup="onKeyup"
				@keydown.tab.prevent="tabber"
				@current-line="currentLine = $event"
			/>
			<div class="font-code text-xs">
				laisser une ligne vide entre deux claviers<br>
				@if &lt;réponse&gt;?&lt;message&gt;
			</div>

			<transition name="fade">
				<div
					v-if="showKeyboardHelper"
					class="fixed right-2 bottom-2 w-[60vw] md:w-[40vw] lg:w-[30vw] z-10"
				>
					<markdown-it
						:text="keyboardHelper"
						class="font-code text-[12px]! mt-5 bg-gray-200 border border-gray-300 p-3 shadow-sm rounded-sm"
					/>
				</div>
			</transition>
		</div>
	</form-maker-wrapper>
</template>
