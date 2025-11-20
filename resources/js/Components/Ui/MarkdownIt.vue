<!--
Affichage d'un texte en markdown.
-->
<script
	lang="ts"
	setup
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

	// Current location: course vs other.
	const context = window.location.pathname.startsWith('/cours')

	// Remplace les liens vers les tools par des liens
	output = output.replaceAll(/\(@tools.show\S+\)/g, (match) => {
		const [, ...routeOptions] = match
			.substring(2, match.length - 1)
			.split(",")

		try {
			return `(${route('tools.show', {tool: routeOptions[0]})}){.@text}`
		} catch {
			return `(${match})`
		}
	})
	// Remplace les liens vers les routes par des liens vers les pages
	output = output.replaceAll(/\(@\S+\)/g, (match) => {
		const [routeName, ...routeOptions] = match
			.substring(2, match.length - 1)
			.split(",")

		try {
			return `(${route(routeName, {post: routeOptions[0], context: context ? 'course' : null})}){.@text}`
		} catch {
			return `(${match})`
		}
	})

	// Remplace les class courtes en classes complètes.

	// classes génériques (raccourci)
	output = output.replaceAll('.@info', '.text-xs .text-right .-mt-1')
	output = output.replaceAll('.@alert', '.text-red-500 .bg-red-50 .border .border-red-500 .rounded .px-2')
	output = output.replaceAll('.@bi-!', 'bi bi-exclamation-triangle mr-2')

	// classes avec themes
	// .@text = .text-<theme>
	// .@bg = .bg-<theme>
	// .@def = .def-<theme>
	output = output.replaceAll(/\.(@[a-z]+)/g, (match) => {
		const prefix = match.substring(2)
		const theme = usePage().props.theme.slug

		return `.${prefix}-${theme}`
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
		:class="{
			'katex-boxed': !customKatex,
		}"
		class="prose
		prose-strong:text-inherit
		dark:prose-invert
		lg:prose-lg
		max-w-full
		item"
		@click="mdClick"
		v-html="mdit"
		@touchmove.stop
	/>
</template>
