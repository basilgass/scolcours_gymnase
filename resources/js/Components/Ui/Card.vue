<script setup lang="ts">

import {getThemeChapter, getThemeClasses} from "@/directives/themeDirectives.ts"
import {computed} from "vue"

const props = withDefaults(defineProps<{
	theme?: false | number | string
	borderTheme?: false | number | string
	noInsideBorder?: boolean
	success?: boolean
	error?: boolean
}>(), {
	theme: false,
	borderTheme: false,
	noInsideBorder: false,
	success: false,
	error: false
})

const cardClass = computed<string>(() => {
	if (props.theme) {
		const chapter = getThemeChapter(props.theme)

		return getThemeClasses(
			chapter,
			{bg: true, text: true}
		).join(' ')
	}

	if (props.borderTheme) {
		const chapter = getThemeChapter(props.borderTheme)

		return getThemeClasses(
			chapter,
			{border: true}
		).join(' ')
	}

	if(props.success){
		return 'bg-green-100 border-green-400'
	}

	if(props.error){
		return 'bg-red-100 border-red-400'
	}


	return ''
})
</script>

<template>
	<div
		class="rounded bg-content border flex flex-col break-inside-avoid"
		:class="cardClass"
	>
		<header
			v-if="$slots['header']"
			class="px-3 py-2"
			:class="{
				'border-b border-b-inherit': !noInsideBorder
			}"
		>
			<slot name="header" />
		</header>
		<main class="flex-1 px-3">
			<slot />
		</main>
		<footer
			v-if="$slots['footer']"
			class="px-3"
			:class="{
				'border-t border-t-inherit': !noInsideBorder
			}"
		>
			<slot name="footer" />
		</footer>
	</div>
</template>


