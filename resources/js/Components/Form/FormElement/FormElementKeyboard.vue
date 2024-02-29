<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import "prismjs/themes/prism.css"
import "prismjs/components/prism-latex"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-json"
import { checkersList, getChecker } from "@/Composables/checkersConfig"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

defineOptions({
		inheritAttrs: false,
	})

	let inp = ref(null)

	function focusFn(select: boolean) {
		inp.value.focus()
		if (select === true) {
			inp.value.select()
		}
	}

	defineExpose({ focus: focusFn })
	const emits = defineEmits(["update:modelValue", "update"])
	const props = defineProps({
			modelValue: { type: String, default: "" },
			rows: { type: Number, default: 2 },
			focus: { type: Boolean, default: false },
		}),
		theValue = ref(props.modelValue)

	const update = () => {
		emits("update:modelValue", theValue)
		emits("update", theValue.value)
	}

	onMounted(() => {
		if (props.focus) focusFn(false)
	})

	let showKeyboardHelper = ref(false),
		currentLine = ref(""),
		currentLineKeyboardKey = computed(() => {
			return currentLine.value.split(",")[0]
		}),
		currentLineKeyboardDescription = computed(() => {
			if (checkersList.includes(currentLineKeyboardKey.value)) {
				return getChecker(currentLineKeyboardKey.value).description
			}

			return ""
		}),
		currentLineKeyboards = computed(() => {
			return checkersList.filter((x) =>
				x.startsWith(currentLineKeyboardKey.value),
			)
		}),
		keyboardHelper = computed(() => {
			if (!checkersList.includes(currentLineKeyboardKey.value)) {
				return currentLineKeyboards.value.join(", ")
			}

			return `${currentLineKeyboardDescription.value}\n- @format:custom format`
		})
	const onKeyup = () => {
		let pos = inp.value.selectionStart,
			lines = theValue.value.split("\n"),
			lineIndex = theValue.value.substring(0, pos).split("\n").length - 1

		currentLine.value = lines[lineIndex]
	}
	const tabber = () => {
		if (currentLineKeyboards.value.length === 1) {
			let pos = inp.value.selectionStart,
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
		return Math.max(props.rows, theValue.value.split("\n").length + 1)
	})
</script>
<template>
	<div class="w-full">
		<textarea
			v-bind="$attrs"
			ref="inp"
			v-model="theValue"
			class="w-full transition-all font-code"
			:rows="currentRows"
			@input="update"
			@keyup="onKeyup"
			@mouseup="onKeyup"
			@keydown.tab.prevent="tabber"
			@current-line="currentLine = $event"
			@focus="showKeyboardHelper = true"
			@blur="showKeyboardHelper = false"
		/>
		<div class="font-code text-xs">
			laisser une ligne vide entre deux claviers
		</div>

		<transition name="fade">
			<div
				class="fixed right-2 bottom-2 w-[60vw] md:w-[40vw] lg:w-[30vw] z-10"
				v-if="showKeyboardHelper"
			>
				<markdown-it
					:text="keyboardHelper"
					class="font-code !text-[12px] mt-5 bg-gray-200 border border-gray-300 p-3 shadow rounded"
				/>
			</div>
		</transition>
	</div>
</template>
