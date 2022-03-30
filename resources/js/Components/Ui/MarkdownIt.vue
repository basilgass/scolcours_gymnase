<template>
	<div
		ref="root"
		class="prose lg:prose-xl"
		v-html="mdit"
	/>
</template>

<script setup>
import {ref, watchEffect} from "vue"

let root = ref(null),
	mdit = ref("")

const props = defineProps({
	text: {type: String, default: ""}
})

watchEffect(()=>{
	const tm = require("markdown-it-texmath")
	const md = require("markdown-it")({html:true})
		.use(tm, { engine: require("katex"),
			delimiters: "dollars",
			katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } })

	mdit.value = md.render(props.text)
})

</script>
