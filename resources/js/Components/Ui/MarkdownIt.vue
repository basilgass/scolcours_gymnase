<!--
Affichage d'un texte en markdown.
-->
<script lang="ts">
/**
 * Résout le contenu d'une destination de lien interne (SANS parenthèses) en URL.
 * Entrée et sortie toujours sans parenthèses → double-emballage structurellement impossible.
 */
function resolveInternalLink(dest: string, isCourse: boolean): string {
	if (dest.startsWith("@")) {
		const [routeName, ...args] = dest.substring(1).split(",")
		const context = isCourse ? "course" : null

		switch (routeName) {
			case "posts.show":
				return route(routeName, {post: args[0], context})
			case "blocks.show":
				return route(routeName, {block: args[0], context})
			case "tools.show":
				return route("tools.show", {tool: args[0]})
			default:
				return dest
		}
	}

	// Ancres (#...) et tout le reste : destination inchangée
	return dest
}

/**
 * Transforme en UN seul passage tous les codes de liens internes
 * `(@route,args)` et `(#ancre)` en destinations markdown, avec la classe de thème `{.@text}`.
 */
export function replaceInternalLinks(text: string, isCourse: boolean): string {
	return text.replaceAll(
		/\(([@#]\S+)\)/g,
		(_match, dest: string) => `(${resolveInternalLink(dest, isCourse)}){.@text}`,
	)
}
</script>

<script
	lang="ts"
	setup
>
import {useKatexMacros, useScrollTo} from "@/Composables/useHelpers"
import {router, usePage} from "@inertiajs/vue3"
import katex, {type TrustContext} from "katex"
import markdownIt from "markdown-it"
import attr from "markdown-it-attrs"
import bracketed from "markdown-it-bracketed-spans"
import tm from "markdown-it-texmath"
import {computed, ref} from "vue"

const root = ref(null)

const props = withDefaults(
	defineProps<{
		text?: string,
		delimiters?: string[],
		customKatex?: boolean
	}>(),
	{
		text: "",
		delimiters: () => ["brackets", "dollars"],
		customKatex: false
	}
)

const md = markdownIt({html: true})
	.use(bracketed)
	.use(attr)
	.use(tm, {
		engine: katex,
		delimiters: props.delimiters ?? ["brackets", "dollars"],
		katexOptions: {
			strict: false,
			macros: useKatexMacros,
			trust: (context: TrustContext) => context.command.startsWith("\\html"),
		},
	})

type RenderRule = NonNullable<typeof md.renderer.rules.table_open>

const defaultTableOpen: RenderRule =
	md.renderer.rules.table_open ||
	((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

const defaultTableClose: RenderRule =
	md.renderer.rules.table_close ||
	((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
	// console.log(tokens[idx])
	return `<div class="overflow-x-auto">` + defaultTableOpen(tokens, idx, options, env, self)
}

md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
	return defaultTableClose(tokens, idx, options, env, self) + `</div>`
}

const mdit = computed(() => {
	if (!props.text) {
		return ""
	}

	let output = props.text

	// Current location: course vs other.
	const context = window.location.pathname.startsWith('/cours')

	// Résout les codes de liens internes (@route,args) et (#ancre) en un seul passage.
	output = replaceInternalLinks(output, context)

	// Remplace les class courtes en classes complètes.

	// classes génériques (raccourci)
	output = output.replaceAll('.@info', '.text-xs .text-right .-mt-1')
	output = output.replaceAll('.@alert', '.text-red-500 .bg-red-50 .border .border-red-500 .rounded .px-2')
	output = output.replaceAll('.@bi-!', 'bi bi-exclamation-triangle mr-2')

	// classes avec themes
	// .@text = .text-<theme>
	// .@bg = .bg-<theme>
	// .@def = .def-<theme>
	output = output.replaceAll(/\.(@[a-zA-Z]+)/g, (match) => {
		const prefix = match.substring(2)
		const theme = usePage().props.theme?.slug

		return prefix[0].toUpperCase() === prefix[0]
			? `.${prefix.toLowerCase()}-${theme} .font-semibold`
			: `.${prefix.toLowerCase()}-${theme}`
	})


	// Remplace les caractères invisibles (pour les "placeholders" de macros)
	output = output.replaceAll('‎', '')

	return md.render(output)
})

function mdClick(event: MouseEvent) {
	const link = (event.target as HTMLElement).closest("a")

	if (link) {
		event.preventDefault()
		const [url, anchor] = link.href.split("#")

		// l'url peut être de deux formes.
		// https://url
		// nom,...paramètres

		if (anchor) {
			if (url === document.URL) {
				useScrollTo('#' + anchor)
			} else {
				router.visit(link.href)
			}
		} else {
			router.visit(link.href)
		}
	}
}

</script>

<template>
	<div
		ref="root"
		:class="{ 'katex-boxed': !customKatex, }"
		class="prose
		prose-strong:text-inherit
		prose-table:my-0
		dark:prose-invert
		lg:prose-lg
		max-w-full
		item"
		@click="mdClick"
		v-html="mdit"
	/>
</template>
