<script lang="ts" setup>
import {onMounted, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {ThemeInterface} from "@/types/modelInterfaces.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"

const theValue = defineModel<string | number>()

defineOptions({
	inheritAttrs: false
})

const props = withDefaults(defineProps<{
	focus?: boolean,
	themeKey?: string
}>(), {
	focus: false,
	themeKey: 'id'
})

const inp = ref(null)

function focusFn(select: boolean) {
	inp.value.focus()
	if (select === true) {
		inp.value.select()
	}
}

defineExpose({focus: focusFn})

const update = () => {
	// emits("update", theValue.value)
}

onMounted(() => {
	if (props.focus) focusFn(false)
})

function buttonClicked(theme: ThemeInterface) {
	if (Object.hasOwn(theme, props.themeKey)) {
		theValue.value = theme[props.themeKey]
		return
	}

	theValue.value = theme.id
}


</script>
<template>
	<form-maker-wrapper
		v-bind="{...$attrs,...props}"
		input-class="bg-none"
	>
		<div
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
