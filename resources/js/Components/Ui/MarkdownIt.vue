<template>
	<div
		ref="root"
		class="prose lg:prose-lg max-w-full"
		:class="katexClass"
		v-html="mdit"
	/>
</template>

<script setup>
import {ref, watchEffect} from "vue"

let root = ref(null),
	mdit = ref("")

const props = defineProps({
	text: {type: String, default: ""},
	delimiters: {type: String, default: "brackets"},
	katexClass: {type: String, default: "katex-boxed"}
})

const tm = require("markdown-it-texmath")
const attr = require("markdown-it-attrs")
const md = require("markdown-it")({html: true})
	.use(tm, {
		engine: require("katex"),
		delimiters: props.delimiters,
		katexOptions: {
			macros: {
				"\\IR": "\\mathbb{R}",
				"\\IN": "\\mathbb{N}",
				"\\ds": "\\displaystyle"
			}
		}
	})
	.use(attr)

watchEffect(()=>{
	if(props.text) {
		mdit.value = md.render(props.text)
	}else{
		mdit.value = ""
	}
})

</script>
