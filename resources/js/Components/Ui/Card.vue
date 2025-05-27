<script setup lang="ts">

import {getThemeChapter, getThemeClasses} from "@/directives/themeDirectives.ts"
import {computed} from "vue"

const props = withDefaults(defineProps<{
	theme?: false | number | string
}>(), {
	theme: false
})

const cardClass = computed<string>(() => {
	if (!props.theme) {
		return ''
	}

	const chapter = getThemeChapter(props.theme)

	return getThemeClasses(
		chapter,
		{bg: true, text: true}
	).join(' ')
})
</script>

<template>
	<div
		class="rounded bg-content border flex flex-col"
		:class="cardClass"
	>
		<header
			v-if="$slots['header']"
			class="px-3 py-2 border-b border-b-inherit"
		>
			<slot name="header" />
		</header>
		<main class="p-3 flex-1">
			<slot />
		</main>
		<footer
			v-if="$slots['footer']"
			class="px-3"
		>
			<slot name="footer" />
		</footer>
	</div>
</template>


