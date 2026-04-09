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
}

const props = withDefaults(defineProps<Props>(), {themeKey: 'id'})
const theValue = defineModel<string | number>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

onMounted(() => {
	if (props.focus) inputRef.value?.focus()
})

function buttonClicked(theme: ThemeInterface) {
	theValue.value = Object.hasOwn(theme, props.themeKey) ? theme[props.themeKey] : theme.id
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
				:outline="theValue !== theme[themeKey]"
				xs
				@click="buttonClicked(theme)"
			>
				{{ theme.title }}
			</sc-button>
		</div>
	</form-maker-wrapper>
</template>
