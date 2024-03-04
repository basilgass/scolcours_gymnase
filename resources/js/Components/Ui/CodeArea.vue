<script setup lang="ts">
import { computed, ref } from "vue"

import Prism from "prismjs"
import "prismjs/themes/prism.css"
import "prismjs/components/prism-latex"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-json"

Prism.manual = true

// let inp = ref(null)

// function focusFn(select) {
// 	inp.value.focus()
// 	if (select === true) {
// 		inp.value.select()
// 	}
// }

const props = defineProps({
	code: {type: String, default: ""},
	rows: {type: Number, default: 4},
	language: {type: String, default: "javascript"},
	wrap: {type: Boolean, default: true}
})

let pre = ref(null),
	highlighted = computed(() => {
		if (props.code) {
			try {
				if (props.language.toLowerCase() === "latex") {
					return Prism.highlight(props.code, Prism.languages.latex, "latex")
				}
				if (props.language.toLowerCase() === "json") {
					return Prism.highlight(props.code, Prism.languages.json, "json")
				}
				return Prism.highlight(props.code, Prism.languages.javascript, "javascript")
			} catch (e) {
				return props.code
			}
		}
		return ""
	})

</script>
<template>
	<div
		:class="`${props.wrap?'whitespace-pre-wrap':'whitespace-pre'} language-${props.language.toLowerCase() }`"
		class="tracking-normal font-normal code-input border bg-white text-[1.1em]"
		v-bind="$attrs"
	>
		<pre ref="pre"><code
				v-html="highlighted"
		/></pre>
	</div>
</template>

<style scoped>
.code-input {
	/* Allow other elems to be inside */
	top: 0;
	left: 0;
	display: block;
	/* Only scroll inside elems */
	overflow: hidden;

	/* Normal inline styles */
	padding: 0;
	margin: 0;
	width: 100%;
	/*height: 250px;*/

	/*font-size: inherit;*/
	font-family: monospace;
	line-height: inherit;
	tab-size: 2;
	caret-color: darkgrey;
}

.code-input pre {
	/* Both elements need the same text and space styling so they are directly on top of each other */
	margin: 0 !important;
	padding: 16px !important;
	border: 0;
	width: 100%;
	height: 100%;
	white-space: inherit;
}

.code-input pre, .code-input pre * {
	/* Also add text styles to highlighing tokens */
	font-size: inherit !important;
	font-family: inherit !important;
	line-height: inherit !important;
	tab-size: inherit !important;
}

</style>
