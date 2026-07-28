<script setup lang="ts">

import {getThemeChapter, getThemeClasses} from "@/directives/themeDirectives.ts"
import {computed} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"

const editMode = useStoreEditMode()

const props = withDefaults(defineProps<{
	theme?: boolean | number | string
	headerTheme?: boolean | number | string
	borderTheme?: boolean | number | string
	markTheme?: boolean | number | string
	noInsideBorder?: boolean
	success?: boolean
	error?: boolean
	infoCard?: boolean
	compact?: boolean
}>(), {
	theme: false,
	headerTheme: false,
	borderTheme: false,
	markTheme: false,
	noInsideBorder: false,
	success: false,
	error: false,
	infoCard: false,
	compact: false
})

const chapter = computed<string>(() => {
	const themeId = props.theme || props.borderTheme || props.headerTheme || props.markTheme

	return getThemeChapter(themeId ?? false)
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

	if (props.markTheme) {
		return getThemeClasses(
			chapter.value,
			{border: true}
		).join(' ') + ' border-l-12'
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
			:class="compact ? 'px-2 py-0' : 'px-3 py-1'"
		>
			<slot name="admin" />
		</header>
		<header
			v-if="$slots['header']"
			:class="[
				compact ? 'px-2 py-0' : 'px-3 py-2',
				noInsideBorder ? '': 'border-b border-b-inherit',
				headerClass
			]"
		>
			<slot name="header" />
		</header>
		<main
			:class="[
				'flex-1 w-full',
				compact ? 'px-2 py-0' : 'p-3',
				infoCard ? 'grid place-items-center text-center text-lg' : ''
			]"
		>
			<slot />
		</main>
		<footer
			v-if="$slots['footer']"
			class="px-3 py-1"
			:class="[
				compact ? 'px-2 py-0' : 'px-3 py-1',
				noInsideBorder ? '': 'border-b border-b-inherit',
			]"
		>
			<slot name="footer" />
		</footer>
	</div>
</template>


