<script setup lang="ts">

import {computed} from "vue"
import {getThemeChapter, getThemeClasses} from "@/directives/themeDirectives.ts"

export type buttonTypes = "add" | "edit"

const props = defineProps<{
	active?: boolean
	theme?: boolean | string | number
	type?: buttonTypes
	outline?: boolean
	href?: string | false
	xs?: boolean
	xl?: boolean
}>()

defineEmits<{
	click: () => void
}>()

const btnTheme = computed(() => {
	if (props.outline) {
		return {
			"add": "border border-green-500 text-green-500",
			"edit": "border border-purple-500 text-purple-500",
			"active": "border border-sky-500 text-sky-500",
		}
	}

	return {
		"add": "bg-green-600 dark:bg-green-800 text-white",
		"edit": "bg-purple-600 dark:bg-purple-800 text-white",
		"active": "bg-sky-400 dark:bg-sky-600 text-white",
	}
})

const themeModifiers = computed(() => {
	if (props.outline) {
		return {border: true, text: true}
	}
	return {bg: true, text: true}
})

const btnClass = computed(() => {
	const classes: string[] = []

	if (props.active) {
		classes.push(btnTheme.value.active)

	} else if (props.theme) {
		const chapter = getThemeChapter(props.theme)

		classes.push(
			props.outline ? 'border': '',
			...getThemeClasses(
				chapter,
				themeModifiers.value
			)
		)

	} else if (props.type) {
		classes.push(btnTheme.value[props.type] ?? "")

	}

	// Ajoute les valeurs par défaut
	classes.push("inline-block text-center rounded-lg no-underline cursor-pointer disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300")
	classes.push(props.xs ? "px-2 py-1 text-xs" : props.xl ? "px-6 py-3 text-xl" : "px-5 py-2")

	return classes.filter(x => x !== '').join(' ')
})
</script>

<template>
	<InertiaLink
		v-if="href"
		:class="btnClass"
		:href="href"
	>
		<slot />
	</InertiaLink>

	<button
		v-else
		:class="btnClass"
		@click="$emit('click')"
	>
		<slot />
	</button>
</template>

