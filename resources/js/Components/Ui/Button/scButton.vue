<script lang="ts" setup>

import {computed} from "vue"
import {
	ButtonAction,
	buttonActionMap,
	ButtonActionValue,
	ButtonColor,
	buttonColorMap,
	ButtonSize,
	ButtonVariant
} from "@/Components/Ui/Button/button.config.ts";
import {getThemeChapter} from "@/directives/themeDirectives.ts";

const props = withDefaults(defineProps<{
	active?: boolean
	theme?: boolean | string | number
	type?: ButtonAction | ButtonColor
	icon?: boolean | string
	variant?: ButtonVariant
	outline?: boolean
	ghost?: boolean
	href?: string | false
	size?: ButtonSize
	xs?: boolean
	sm?: boolean
	lg?: boolean
	xl?: boolean
	p0?: boolean
	noLabel?: boolean,
	append?: boolean,
	prepend?: boolean
}>(), {
	active: false,
	theme: false,
	type: null,
	icon: false,
	variant: 'solid',
	outline: false,
	ghost: false,
	href: false,
	p0: false,
	size: 'md',
	xs: false,
	sm: false,
	lg: false,
	xl: false,
	noLabel: false,
	append: false,
	prepend: false
})

const emit = defineEmits<{
	click: []
}>()

const resolveComponent = computed(() => {
	return props.href ? 'InertiaLink' : 'button'
})
const buttonSizeMap: Record<ButtonSize, string> = {
	'xs': 'px-2 py-1 text-xs',
	'sm': 'px-2 py-1 text-sm',
	'md': 'px-3 py-2 text-base',
	'lg': 'px-5 py-3 text-lg',
	'xl': 'px-8 py-5 text-xl'
}

const resolveAction = computed<ButtonActionValue | null>(() => {
	if (Object.hasOwn(buttonActionMap, props.type)) {
		return buttonActionMap[props.type]
	}

	return null
})

const resolveVariant = computed<ButtonVariant>(() => {
	if (props.outline) return 'outline'
	if (props.ghost) return 'ghost'

	return props.variant
})

const resolveColor = computed<Record<ButtonVariant, string> | null>(() => {
	if (Object.hasOwn(buttonColorMap, props.type)) {
		return buttonColorMap[props.type]
	}

	if (resolveAction.value) {
		return buttonColorMap[resolveAction.value.color]
	}

	if (resolveTheme.value) return resolveTheme.value

	return buttonColorMap["default"]
})

const resolveTheme = computed<Record<ButtonVariant, string> | null>(() => {
	if (!props.theme) return null

	const slug = getThemeChapter(props.theme)


	return slug === 'admin'
		? buttonColorMap['console']
		: buttonColorMap[slug]
})

const resolveSize = computed<ButtonSize>(() => {
	if (props.xs) return 'xs'
	if (props.sm) return 'sm'
	if (props.lg) return 'lg'
	if (props.xs) return 'xs'

	return props.size
})

const resolveLabel = computed(() => {
	return resolveAction.value?.label
})

const resolveIcon = computed(() => {
	return resolveAction.value?.icon
})

function btnClick() {
	// if (props.href) {
	// 	return router.visit(props.href)
	// }

	emit('click')
}
</script>

<template>
	<component
		:is="resolveComponent"
		:href
		class="flex gap-2
			items-center justify-center
			text-center no-underline
			rounded-lg
			cursor-pointer
			disabled:cursor-not-allowed disabled:shadow-none
			relative group
			overflow-hidden"
		:class="[
			buttonSizeMap[resolveSize],
			resolveColor?.[resolveVariant]
		]"
		@click="btnClick"
	>
		<span
			class="absolute inset-0 origin-left
			transition-transform duration-300
			opacity-20
			scale-x-0 group-hover:scale-x-100"
			:class="[
				variant === 'solid' ? 'bg-white' : resolveColor?.solid
			]"
		></span>
		<i v-if="resolveIcon" :class="resolveIcon" />
		<slot>
			<span v-if="!noLabel">{{ resolveLabel }}</span>
		</slot>
	</component>

</template>

