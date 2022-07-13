<template>
	<div
		ref="root"
		class="prose lg:prose-lg katex-boxed max-w-full"
		v-html="mdit"
	/>
</template>

<script setup>
import {ref, watchEffect} from "vue"

let root = ref(null),
	mdit = ref("")

const props = defineProps({
	text: {type: String, default: ""},
	delimiters: {type: String, default: "brackets"}
})

const tm = require("markdown-it-texmath")
const md = require("markdown-it")({html: true})
	.use(tm, {
		engine: require("katex"),
		delimiters: props.delimiters,
		katexOptions: {
			macros: {
				"\\RR": "\\mathbb{R}"
			}
		}
	})

watchEffect(()=>{
	if(props.text) {
		mdit.value = md.render(props.text)
	}else{
		mdit.value = ""
	}
})

</script>
