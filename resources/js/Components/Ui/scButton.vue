<script setup lang="ts">

import {computed} from "vue"
import {getThemeChapter, getThemeClasses} from "@/directives/themeDirectives.ts"

export type buttonTypes = "add" | "edit" | "save" | "admin" | "default" | "confirm" | "delete"

const props = withDefaults(defineProps<{
	active?: boolean
	theme?: boolean | string | number
	type?: buttonTypes
	outline?: boolean
	href?: string | false
	xs?: boolean
	xl?: boolean
}>(), {
	active: false,
	theme: false,
	type: "default",
	outline: false,
	href: false,
	xs: false,
	xl: false,
})

defineEmits<{
	click: () => void
}>()

//TODO: redesign the colors for the buttons
// TODO: The filled button must also have the color.
const btnTheme = computed(() => {
	if (props.outline) {
		return {
			"default": "outline outline-gray-500 text-gray-300",
			"add": "outline outline-green-500 text-green-500",
			"save": "outline outline-blue-500 text-blue-500",
			"edit": "outline outline-purple-500 text-purple-500",
			"admin": "outline outline-sky-500 text-sky-500",
			"active": "outline outline-sky-500 text-sky-500",
			"delete": "outline outline-orange-500 text-orange-500",
			"confirm": "outline outline-red-500 text-red-500",
		}
	}

	return {
		"default": "outline-2 bg-action",
		"add": "bg-green-600 dark:bg-green-800 outline outline-green-600 dark:outline-green-800 text-white",
		"edit": "bg-purple-600 dark:bg-purple-800 outline outline-purple-600 dark:outline-purple-800 text-white",
		"save": "bg-blue-600 dark:bg-blue-800 outline outline-blue-600 dark:outline-blue-800 text-white",
		"admin": "bg-sky-600 dark:bg-sky-800 outline outline-sky-600 dark:outline-sky-800 text-white",
		"active": "bg-sky-400 dark:bg-sky-600 outline outline-sky-400 dark:outline-sky-600 text-white",
		"delete": "bg-orange-400 dark:bg-orange-600 outline outline-orange-400 dark:outline-orange-600 text-white",
		"confirm": "bg-red-400 dark:bg-red-600 outline outline-red-400 dark:outline-red-600 text-white",
	}
})

const themeModifiers = computed(() => {
	if (props.outline) {
		return {border: true, text: true}
	}
	return {bg: true, text: true, outline: true}
})

const btnClass = computed(() => {
	const classes: string[] = ['outline']

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

