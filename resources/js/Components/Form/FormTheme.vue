<script lang="ts" setup>
import {onMounted, useTemplateRef} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {ThemeInterface} from "@/types/modelInterfaces.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	themeKey?: string
	// Reclic sur le thème actif = désélection (utile pour un filtre, pas pour un champ requis).
	deselectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {themeKey: 'id', deselectable: false})
const theValue = defineModel<string | number | undefined>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

onMounted(() => {
	if (props.focus) inputRef.value?.focus()
})

function buttonClicked(theme: ThemeInterface) {
	const value = Object.hasOwn(theme, props.themeKey)
		? theme[props.themeKey as keyof ThemeInterface] as string | number
		: theme.id

	// Reclic sur le thème déjà sélectionné : on l'annule (si le composant est déselectable).
	if (props.deselectable && theValue.value === value) {
		theValue.value = undefined
		return
	}

	theValue.value = value
}
</script>

<template>
	<form-maker-wrapper
		v-bind="{...$attrs,...props}"
		input-class="bg-none"
	>
		<div
			ref="input"
			class="flex gap-2 flex-wrap"
			v-bind="$attrs"
		>
			<sc-button
				v-for="theme in $page.props.themes"
				:key="`theme-${theme.id}`"
				:theme="theme.id"
				:outline="theValue !== theme[themeKey as keyof ThemeInterface]"
				xs
				@click="buttonClicked(theme)"
			>
				{{ theme.title }}
			</sc-button>
		</div>
	</form-maker-wrapper>
</template>
