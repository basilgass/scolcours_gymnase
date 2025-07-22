<script setup lang="ts">

import {getThemeChapter, getThemeClasses} from "@/directives/themeDirectives.ts"
import {computed} from "vue"

const props = withDefaults(defineProps<{
	theme?: false | number | string
	borderTheme?: false | number | string
}>(), {
	theme: false,
	borderTheme: false
})

const cardClass = computed<string>(() => {
	if (props.theme) {
		const chapter = getThemeChapter(props.theme)

		return getThemeClasses(
			chapter,
			{bg: true, text: true}
		).join(' ')
	}

	if(props.borderTheme){
		const chapter = getThemeChapter(props.borderTheme)

		return getThemeClasses(
			chapter,
			{border: true}
		).join(' ')
	}


	return ''
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
		<main class="flex-1 px-3">
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


