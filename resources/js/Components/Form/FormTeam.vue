<script lang="ts" setup>
import {onMounted, ref, useTemplateRef} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {TeamInterface} from "@/types/modelInterfaces.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import axios from "axios"
import {AxiosResponseModel} from "@/types"
import {FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

const props = defineProps<FormMakerBaseProps>()
const theValue = defineModel<TeamInterface>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const teams = ref<TeamInterface[]>([])

onMounted(() => {
	if (props.focus) inputRef.value?.focus()
	axios.get(route('api.admin.teams.index'))
		.then((res: AxiosResponseModel<TeamInterface[]>) => {
			teams.value = res.data
		})
})
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
				v-for="team in teams"
				:key="`team-${team.id}`"
				:outline="theValue?.id !== team.id"
				xs
				@click="theValue = team"
			>
				{{ team.name }}
			</sc-button>
		</div>
	</form-maker-wrapper>
</template>
