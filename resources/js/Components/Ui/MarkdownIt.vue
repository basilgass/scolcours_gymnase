<template>
	<div
		ref="root"
		class="prose lg:prose-lg max-w-full"
		:class="katexClass"
		@click="mdClick"
		v-html="mdit"
	/>
</template>

<script setup>
import {ref, watchEffect} from "vue"
import {Inertia} from "@inertiajs/inertia"
import {useKatexMacros, useMenuScrollTo} from "@/Composables/useHelpers"

let root = ref(null),
	mdit = ref("")

const props = defineProps({
	text: {type: String, default: ""},
	delimiters: {type: Array, default: null},
	katexClass: {type: String, default: "katex-boxed"}
})

const tm = require("markdown-it-texmath")
const attr = require("markdown-it-attrs")
const md = require("markdown-it")({html: true})
	.use(tm, {
		engine: require("katex"),
		delimiters: props.delimiters??["brackets", "dollars"],
		katexOptions: {
			macros: useKatexMacros
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

let mdClick = function(event){
	if(event.target.tagName==="A"){
		event.preventDefault()
		const [url, anchor] = event.target.href.split("#")
		if(anchor){
			if(url===document.URL){
				useMenuScrollTo(anchor)
			}else{
				Inertia.visit(event.target.href)
			}
		}else {
			Inertia.visit(event.target.href)
		}
	}
}

</script>
