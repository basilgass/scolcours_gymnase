<template>
	<form-field :hide-label="hideLabel">
		<form-label
			v-if="!hideLabel"
			:label="label"
			name="name"
		/>

		<div
			class="tracking-normal font-normal w-full code-input border bg-white language-javascript h-full text-[1.1em]"
			v-bind="$attrs"
		>
			<textarea
				ref="inp"
				v-model="theValue"
				class="w-full"
				@input="sync_scroll();$emit('update:modelValue', theValue)"
				@scroll="sync_scroll"
				@keydown.tab.prevent="tabber($event)"
			/>
			<pre ref="pre"><code
				class="w-full"
				v-html="highlighted"
			/></pre>
		</div>

		<form-error
			:message="error"
			:name="name"
		/>
	</form-field>
</template>
<script setup>
import FormField from "@/Components/Form/FormField"
import FormLabel from "@/Components/Form/FormLabel"
import FormError from "@/Components/Form/FormError"
import {computed, onMounted, ref} from "vue"

let inp = ref(null)

function focus(select) {
	inp.value.focus()
	if (select === true) {
		inp.value.select()
	}
}

defineExpose({focus})
defineEmits(["update:modelValue"])
const props = defineProps({
		modelValue: {type: String, default: ""},
		name: {type: String, required: true},
		label: {type: String, default: ""},
		error: {type: String, default: ""},
		rows: {type: Number, default: 4},
		hideLabel: {type: Boolean, default: false},
		codeWriting: {type: Boolean, default: false},
		focus: {type: Boolean, default: false}
	}),
	theValue = ref(props.modelValue)

let pre = ref(null),
	highlighted = computed(() => {
		// Calculate the output... must use debounce ?
		return Prism.highlight(theValue.value, Prism.languages.javascript, "javascript")
	}),
	tabber = function (event) {
		/* enable tab caracter */
		let text = theValue.value,
			originalSelectionStart = event.target.selectionStart,
			textStart = text.slice(0, originalSelectionStart),
			textEnd = text.slice(originalSelectionStart)

		theValue.value = `${textStart}\t${textEnd}`
		event.target.value = theValue.value // required to make the cursor stay in place.
		event.target.selectionEnd = event.target.selectionStart = originalSelectionStart + 1
	},
	sync_scroll = function(){
		/* Scroll result to scroll coords of event - sync with textarea */
		pre.value.scrollTop = inp.value.scrollTop
		pre.value.scrollLeft = inp.value.scrollLeft
	}

onMounted(()=>{
	if(props.focus){
		focus(false)
	}
})

</script>

<style scoped>
.code-input {
	/* Allow other elems to be inside */
	position: relative;
	top: 0;
	left: 0;
	display: block;
	/* Only scroll inside elems */
	overflow: hidden;

	/* Normal inline styles */
	padding: 0;
	margin: 0;
	width: 100%;
	min-height: 250px;
	max-height: 70vh;
	/*height: 250px;*/

	/*font-size: inherit;*/
	font-family: monospace;
	line-height: inherit;
	tab-size: 2;
	caret-color: darkgrey;
	white-space: pre;
}

.code-input textarea, .code-input pre {
	/* Both elements need the same text and space styling so they are directly on top of each other */
	margin: 0 !important;
	padding: 16px !important;
	border: 0;
	width: 100%;
	height: 100%;
}

.code-input textarea, .code-input pre, .code-input pre * {
	/* Also add text styles to highlighing tokens */
	font-size: inherit !important;
	font-family: inherit !important;
	line-height: inherit !important;
	tab-size: inherit !important;
}

.code-input textarea, .code-input pre {
	/* In the same place */
	position: absolute;
	top: 0;
	left: 0;
}

/* Move the textarea in front of the result */
.code-input textarea {
	z-index: 1;
}

.code-input pre {
	z-index: 0;
}


/* Make textarea almost completely transparent */
.code-input textarea {
	color: transparent;
	background: transparent;
	caret-color: inherit !important; /* Or choose your favourite color */
}

/* Can be scrolled */
.code-input textarea, .code-input pre {
	overflow: auto !important;

	white-space: inherit;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
}

/* No resize on textarea; stop outline */
.code-input textarea {
	resize: none;
	outline: none !important;
}


</style>
