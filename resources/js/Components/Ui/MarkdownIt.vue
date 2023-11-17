<!--
Affichage d'un texte en markdown.
-->
<script setup>
	import { computed, ref } from "vue"
	import { useKatexMacros, useMenuScrollTo } from "@/Composables/useHelpers"
	import { router, usePage } from "@inertiajs/vue3"
	import markdownIt from "markdown-it"
	import bracketed from "markdown-it-bracketed-spans"
	import attr from "markdown-it-attrs"
	import tm from "markdown-it-texmath"
	import katex from "katex"

	let root = ref(null)

	const props = defineProps({
		text: { type: String, default: "" },
		delimiters: { type: Array, default: null },
		katexClass: { type: String, default: "katex-boxed" },
	})

	const md = markdownIt({ html: true })
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

	let mdit = computed(() => {
		if (!props.text) {
			return ""
		}

		let output = props.text

		// Remplace les class courtes en classes complètes.
		// .@text = .text-scolcours-theme
		// .@bg = .bg-scolcours-theme
		output = output.replaceAll(/\.(@[a-z]+)/g, (match) => {
			const prefix = match.substring(2),
				theme = usePage().props.theme.slug

			return `.${prefix}-scolcours-${theme}`
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

		return md.render(output)
	})

	let mdClick = function (event) {
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
		:class="katexClass"
		class="prose lg:prose-lg max-w-full"
		@click="mdClick"
		v-html="mdit"
	/>
</template>
