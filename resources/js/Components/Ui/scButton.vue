<script lang="ts" setup>

import {computed} from "vue"
import {getThemeChapter, getThemeClasses} from "@/directives/themeDirectives.ts"
import {buttonConfig, type buttonTypes} from "@/button.config.ts"

const props = withDefaults(defineProps<{
	active?: boolean
	theme?: boolean | string | number
	type?: buttonTypes
	icon?: boolean | string
	outline?: boolean
	href?: string | false
	xs?: boolean
	xl?: boolean
	p0?: boolean
	noLabel?: boolean,
	append?: boolean,
	prepend?: boolean
}>(), {
	active: false,
	theme: false,
	type: "default",
	icon: false,
	outline: false,
	href: false,
	p0: false,
	xs: false,
	xl: false,
	noLabel: false,
	append: false,
	prepend: false
})

defineEmits<{
	click: []
}>()

const themeModifiers = computed(() => {
	if (props.outline) {
		return {border: true, outline: true, text: true}
	}
	return {bg: true, text: true, border: true, outline: true}
})

const btnClass = computed<string>(() => {
	const classes: string[] = []

	if (props.active) {
		classes.push(buttonConfig['active'][props.outline ? 'outline' : 'fill'])
	} else if (props.theme) {
		const chapter = getThemeChapter(props.theme)

		classes.push(
			props.outline ? 'border' : '',
			...getThemeClasses(
				chapter,
				themeModifiers.value
			)
		)
	} else {
		classes.push(buttonConfig[props.type][props.outline ? 'outline' : 'fill'])
	}

	// Ajoute les valeurs par défaut
	classes.push(
		props.xs ? "text-xs" :
			props.xl ? "text-xl" :
				"")
	classes.push(
		props.xs ? "px-2 py-1" :
			props.xl ? "px-6 py-3" :
				props.p0 ? "p-0" :
					"px-5 py-2")

	if (props.append) {
		classes.push('rounded-l-none rounded-r')
	}
	if (props.prepend) {
		classes.push('rounded-r-none rounded-l')
	}

	return classes.filter(x => x !== '').join(' ')
})

const iconClass = computed<string>(() => {
	if (props.icon === false) {
		return ''
	}

	if (props.icon === true) {
		return buttonConfig[props.type].icon
	}

	return props.icon
})
</script>

<template>
	<InertiaLink
		v-if="href"
		:class="btnClass"
		:href
		class="flex gap-2 items-center justify-center btn cursor-pointer"
	>
		<i
			v-if="iconClass"
			:class="iconClass"
		/>
		<slot>
			<span v-if="!noLabel">{{ buttonConfig[type].label }}</span>
		</slot>
	</InertiaLink>

	<button
		v-else
		:class="btnClass"
		class="flex gap-2 items-center justify-center btn"
		@click="$emit('click')"
	>
		<i
			v-if="iconClass"
			:class="iconClass"
		/>
		<slot>
			<span v-if="!noLabel">{{ buttonConfig[type].label }}</span>
		</slot>
	</button>
</template>

