<script setup lang="ts">

import {type FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"
import {computed} from "vue"

interface FormMakerWrapperInterface extends FormMakerPropsNewType {
	errors?: string[]
	labelClass?: string
}

const props = withDefaults(defineProps<FormMakerWrapperInterface>(),
	{
		label: "",
		type: 'text',
		icon: false,
		prepend: false,
		inlineLabel: false,
		labelClass: '',
		btn: false,
		message: '',
		clearable: false,
		xl: false,
		sm: false,
		xs: false,
		inputClass: false
	})

const value = defineModel<string | boolean | number | Record<string, string>>()

const emits = defineEmits<{
	focus: [],
	buttonClick: [e: MouseEvent],
}>()

const inputClassComputed = computed(() => {
	return props.inputClass ?
		props.inputClass :
		'bg-slate-50 text-slate-900 ' +
		'border border-slate-200 rounded ' +
		'dark:bg-slate-800 dark:text-slate-200 ' +
		'dark:border-slate-500 ' +
		'focus-within:border-slate-400 focus-within:shadow-sm'
})

</script>

<template>
	<div
		class="w-full flex"
		:class="{
			'mt-[1.5rem]': !inlineLabel,
			'text-xs': xs,
			'text-sm': sm,
			'text-xl': xl
		}"
	>
		<div
			class="pr-3 py-1"
			:class="labelClass"
			v-show="inlineLabel"
		>
			<label
				:class="xl ? 'text-base': 'text-sm'"
				v-katex.auto="label"
				@click="emits('focus')"
			/>
		</div>
		<div
			class="flex-1 relative"
		>
			<div
				class="absolute left-0 right-0 whitespace-nowrap"
				:class="xs ? 'text-tiny top-[-1rem]': 'text-sm top-[-1.2rem]'"
			>
				<label
					v-show="!inlineLabel"
					:class="labelClass"
					v-katex.auto="label"
					@click="emits('focus')"
				/>
			</div>
			<div
				class="w-full
				flex items-stretch
				appearance-none transition
				focus:outline-hidden focus:ring-0"
				:class="inputClassComputed"
			>
				<div
					v-if="icon || prepend"
					class="px-2
					border-r border-slate-300
					cursor-pointer
					flex items-center"
					@click="emits('focus')"
				>
					<span
						v-if="prepend"
						v-katex.auto="prepend"
					/>
					<i
						v-else
						:class="icon"
					/>
				</div>
				<div class="relative flex-1">
					<span
						v-if="clearable"
						class="absolute right-1 top-1/2 -translate-y-1/2
						text-slate-400 hover:text-red-600 transition-colors
						cursor-pointer"
						@click="value=''"
					><i class="bi bi-x-lg" />
					</span>
					<div class="w-full">
						<slot />
					</div>
				</div>
				<div v-if="btn">
					<button
						class="h-full px-2
						bg-slate-200 dark:bg-slate-700
					hover:bg-slate-300 dark:bg-slate-600
					rounded-r
					transition-colors
					cursor-pointer"
						@click="emits('buttonClick', $event)"
					>
						<slot name="button">
							<i :class="btn===true ? 'bi bi-pencil': btn" />
						</slot>
					</button>
				</div>
			</div>

			<div
				v-show="errors?.length"
				class="text-red-800 dark:text-red-50 bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-600 px-1 text-xs"
			>
				<div
					v-for="(error, index) in errors"
					:key="`error-${index}`"
					v-katex.auto="error"
				/>
			</div>

			<slot name="message">
				<div
					v-show="message"
					class="text-slate-700 dark:text-slate-200 text-sm"
					v-katex.auto="message"
				/>
			</slot>
		</div>
	</div>
</template>

<style scoped>

</style>
