<script setup lang="ts">

import {getThemeChapter, getThemeClasses} from "@/directives/themeDirectives.ts"
import {computed} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"

const editMode = useStoreEditMode()

const props = withDefaults(defineProps<{
	theme?: boolean | number | string
	headerTheme?: boolean | number | string
	borderTheme?: boolean | number | string
	noInsideBorder?: boolean
	success?: boolean
	error?: boolean
}>(), {
	theme: false,
	headerTheme: false,
	borderTheme: false,
	noInsideBorder: false,
	success: false,
	error: false
})

const chapter = computed<string>(() => {
	const themeId = props.theme
		? props.theme
		: props.borderTheme
			? props.borderTheme
			: props.headerTheme
				? props.headerTheme : false

	return getThemeChapter(themeId)
})

const cardClass = computed<string>(() => {
	if (props.theme) {
		return getThemeClasses(
			chapter.value,
			{bg: true, text: true}
		).join(' ')
	}

	if (props.borderTheme) {
		return getThemeClasses(
			chapter.value,
			{border: true}
		).join(' ')
	}

	if (props.success) {
		return 'bg-green-100 border-green-400'
	}

	if (props.error) {
		return 'bg-red-100 border-red-400'
	}

	return ''
})

const headerClass = computed(() => {
	if (props.headerTheme) {
		return getThemeClasses(
			chapter.value,
			{bg: true, text: true}
		).join(' ')
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
			v-if="$slots['admin']"
			v-admin="editMode.enable"
			v-theme.admin
			class="px-3 py-1"
		>
			<slot name="admin" />
		</header>
		<header
			v-if="$slots['header']"
			:class="[
				'px-3 py-2',
				noInsideBorder ? '': 'border-b border-b-inherit',
				headerClass
			]"
		>
			<slot name="header" />
		</header>
		<main class="flex-1 w-full p-3">
			<slot />
		</main>
		<footer
			v-if="$slots['footer']"
			class="px-3 py-1"
			:class="{
				'border-t border-t-inherit': !noInsideBorder
			}"
		>
			<slot name="footer" />
		</footer>
	</div>
</template>


