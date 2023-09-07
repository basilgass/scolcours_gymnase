<!--
Affichage d'un texte en markdown.
-->
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
import {computed, ref} from "vue"
import {useKatexMacros, useMenuScrollTo} from "@/Composables/useHelpers"
import {router} from "@inertiajs/vue3"
import markdownIt from "markdown-it"
import bracketed from "markdown-it-bracketed-spans";
import attr from "markdown-it-attrs";
import tm from "markdown-it-texmath";
import katex from "katex";

let root = ref(null)/*,
	mdit = ref("")*/

const props = defineProps({
	text: {type: String, default: ""},
	delimiters: {type: Array, default: null},
	katexClass: {type: String, default: "katex-boxed"}
})


// const tm = require("markdown-it-texmath")
// const attr = require("markdown-it-attrs")
// const bracketed = require("markdown-it-bracketed-spans")


const md = markdownIt({html: true})
	.use(bracketed)
	.use(attr)
	.use(tm, {
		engine: katex,
		delimiters: props.delimiters??["brackets", "dollars"],
		katexOptions: {
			macros: useKatexMacros
		}
	})

let mdit = computed(()=>{
	if(!props.text){return ""}
	let output = md.render(props.text)

	//TODO: markdown pre process and post process

	return output
})

let mdClick = function(event){
	if(event.target.tagName==="A"){
		event.preventDefault()
		const [url, anchor] = event.target.href.split("#")

		// l'url peut être de deux forme.
		// https://url
		// nom,...paramètres

		if(url.includes("@")){
			const [routeName, ...routeParameters] = url.split("@")[1].split(",")
			console.log(routeName, routeParameters)
			router.visit(route(routeName, routeParameters))
		}else{
			if (anchor) {
				if (url === document.URL) {
					useMenuScrollTo(anchor)
				} else {
					router.visit(event.target.href)
				}
			} else {
				router.visit(event.target.href)
			}

		}

	}
}

</script>
