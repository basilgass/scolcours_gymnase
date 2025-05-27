<script setup lang="ts">

import {defineAsyncComponent, h, ref, shallowRef, useTemplateRef, watch} from "vue"
import FormMakeLoader from "@/Components/Form/FormMakeLoader.vue"
import FormMakerError from "@/Components/Form/FormMakerError.vue"
import {FormElementComponents} from "@/scolcours.ts"
import FormElementDefault from "@/Components/Form/FormElements/FormElementDefault.vue"

const props = withDefaults(defineProps<{
		type?: string
		label: string
		icon?: boolean,
		inlineLabel?: boolean,
		btn?: boolean
		message?: string
		clearable?: boolean
	}>(),
	{
		type: 'text',
		icon: false,
		inlineLabel: false,
		btn: false,
		message: '',
		clearable: false
	})

const value = defineModel<string | boolean | number>()
const error = ref("")
function focus() {
	fieldRef.value?.focus()
}


function loadComponent(type) {
	if (Object.hasOwn(FormElementComponents, type)) {
		return defineAsyncComponent({
			loader: FormElementComponents[type],
			loadingComponent: FormMakeLoader,
			delay: 200,
		})
	}


	return {
		render() {
			return h(FormMakerError, {type})
		}
	}
}

const currentComponent = shallowRef(null)
const fieldRef = useTemplateRef<InstanceType<typeof FormElementDefault>>('fieldRef')
currentComponent.value = loadComponent(props.type)

watch(() => props.type, (newType) => {
	currentComponent.value = loadComponent(newType)
})




</script>

<template>
	<div
		class="w-full flex"
		:class="{
			'mt-[1.5rem]': !inlineLabel
		}"
	>
		<div
			class="pr-3"
			v-show="inlineLabel"
		>
			<label
				class="text-sm"
				v-katex.auto="label"
				@click="focus"
			/>
		</div>
		<div
			class="flex-1 relative"
		>
			<label
				v-show="!inlineLabel"
				class="text-sm absolute top-[-1.5rem] left-0 right-0"
				v-katex.auto="label"
				@click="focus"
			/>
			<div
				class="flex w-full
				appearance-none transition
				focus:outline-hidden focus:ring-0
				bg-slate-50 text-slate-900
				border border-slate-200 rounded
				dark:bg-slate-800 dark:text-slate-200
				dark:border-slate-500
				focus-within:border-slate-400 focus-within:shadow-sm"
			>
				<div
					v-show="icon"
					class="left-0 top-0 b-0 px-2"
					@click="focus"
				>
					<i class="bi bi-card-text" />
				</div>
				<div class="relative flex-1">
					<span
						v-if="clearable"
						class="absolute right-1
						text-slate-400 hover:text-red-600 transition-colors
						cursor-pointer"
						@click="value=''"
					><i class="bi bi-x-lg" />
					</span>
					<component
						:is="currentComponent"
						ref="fieldRef"
						class="w-full focus:outline-hidden focus:ring-0"
						v-bind="$attrs"
						v-model="value"
						@error="error=$event"
					/>
					<!--					<input-->
					<!--						type="text"-->
					<!--						class="w-full focus:outline-hidden focus:ring-0"-->
					<!--						v-bind="$attrs"-->
					<!--						v-model="value"-->
					<!--					>-->
				</div>
				<div v-if="btn">
					<button
						class="h-full px-2
						bg-slate-200 dark:bg-slate-700
					hover:bg-slate-300 dark:bg-slate-600
					rounded-r
					transition-colors
					cursor-pointer"
					>
						<i class="bi bi-pencil" />
					</button>
				</div>
			</div>
			<div
				v-show="message"
				class="text-slate-700 dark:text-slate-200 text-sm"
				v-katex.auto="message"
			/>
			<div
				v-show="error"
				class="text-red-800 dark:text-red-50 bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-600 px-1 text-xs"
				v-katex.auto="error"
			/>
		</div>
	</div>
</template>

<style scoped>

</style>
