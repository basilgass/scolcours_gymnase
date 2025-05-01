<!--
Affichage d'un texte en markdown.
-->
<script
	setup
	lang="ts"
>
import {useKatexMacros, useMenuScrollTo} from "@/Composables/useHelpers"
import {router, usePage} from "@inertiajs/vue3"
import katex from "katex"
import markdownIt from "markdown-it"
import attr from "markdown-it-attrs"
import bracketed from "markdown-it-bracketed-spans"
import tm from "markdown-it-texmath"
import {computed, ref} from "vue"

const root = ref(null)

const props = defineProps({
	text: {type: String, default: ""},
	delimiters: {type: Array, default: null},
	customKatex: {type: Boolean, default: false},
})


const md = markdownIt({html: true})
	.use(bracketed)
	.use(attr)
	.use(tm, {
		engine: katex,
		delimiters: props.delimiters ?? ["brackets", "dollars"],
		katexOptions: {
			strict: false,
			macros: useKatexMacros,
			trust: (context) => context.command.startsWith("\\html"),
		},
	})

const mdit = computed(() => {
	if (!props.text) {
		return ""
	}

	let output = props.text

	// Remplace les class courtes en classes complètes.
	// .@text = .text-<theme>
	// .@bg = .bg-<theme>
	// .@def = .def-<theme>
	// TODO: attention, au passage à Tailwind4, il faudra mettre à jour ici !
	output = output.replaceAll(/\.(@[a-z]+)/g, (match) => {
		const prefix = match.substring(2)
		const theme = usePage().props.theme.slug

		return `.${prefix}-${theme}`
	})

	// Remplace les liens vers les routes par des liens vers les pages
	output = output.replaceAll(/\(@\S+\)/g, (match) => {
		const [routeName, ...routeOptions] = match
			.substring(2, match.length - 1)
			.split(",")

		try {
			return `(${route(routeName, routeOptions)})`
		} catch {
			return `(${match})`
		}
	})

	// Remplace les caractères invisibles (pour les "placeholders" de macros)
	output = output.replaceAll('‎', '')

	return md.render(output)
})

const mdClick = function (event) {
	if (event.target.tagName === "A") {
		event.preventDefault()
		const [url, anchor] = event.target.href.split("#")

		// l'url peut être de deux formes.
		// https://url
		// nom,...paramètres

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
</script>

<template>
	<div
		ref="root"
		class="prose dark:prose-invert lg:prose-lg max-w-full item"
		:class="{
			'katex-boxed': !customKatex,
		}"
		@click="mdClick"
		v-html="mdit"
		@touchmove.stop
	/>
</template>
