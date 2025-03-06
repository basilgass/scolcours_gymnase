<script lang="ts" setup>

import {fnInterface, fnStyle} from "@/Pages/Singles/GraphPage.vue"
import {computed, nextTick, onMounted, ref, watch} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import DropdownMenu from "@/Components/Ui/DropdownMenu.vue"

const fx = defineModel<fnInterface>()

const availableStyles: fnStyle[] = ['plain', 'dash', 'dot']

const editor = ref(null)

const isEditing = ref(false)

const showAdvanced = ref(false)

// Formatting the output
const fxAsTex = computed(() => {
	return fx.value.fx.replaceAll(/\$([a-z])/g, "$1")
})

watch(isEditing, (newVal) => {
	if (newVal) {
		nextTick(() => {
			editor.value.focus()
		})
	}
})

onMounted(() => {
	isEditing.value = fx.value.isNew ?? false
	fx.value.isNew = false
})

defineEmits<{
	destroy: []
}>()
</script>

<template>
	<div
		class="flex flex-col gap-3 relative pb-3 rounded-sm
		bg-slate-50 dark:bg-slate-800
		border border-slate-300 dark:border-slate-600"
	>
		<div
			class="absolute -top-3 -right-3 w-7 h-7 rounded-full
			bg-slate-50 dark:bg-slate-800
			border-slate-300 dark:border-slate-600
			text-black dark:text-slate-300
			grid place-items-center z-10 border cursor-pointer"
			@click="$emit('destroy')"
		>
			<i class="bi bi-trash" />
		</div>
		<div
			class="absolute -bottom-3 left-0 right-0 m-auto w-5 h-5 rounded-full
			bg-slate-50 dark:bg-slate-800
			border-slate-300 dark:border-slate-600
			text-black dark:text-slate-300
			grid place-items-center z-10 border cursor-pointer"
			@click="showAdvanced = !showAdvanced"
		>
			<i
				class="bi text-xs"
				:class="showAdvanced?'bi-dash-circle':'bi-plus-circle'"
			/>
		</div>
		<div
			:style="`border-color: ${fx.color}`"
			class="border-t-8 rounded-t px-3 pt-3"
		>
			<form-maker
				v-if="isEditing"
				ref="editor"
				v-model="fx.fx"
				:label="`\\(${fx.name}(${fx.type})=\\)`"
				inline-label
				font-code
				@blur="isEditing = false"
				@enter="isEditing = false"
			/>
			<div
				v-else
				v-katex.ascii.inline="`${fx.name}(${fx.type}) = ${fxAsTex}`"
				class="cursor-pointer"
				@click="isEditing = true"
			/>
		</div>
		<div class="grid grid-cols-3 gap-3 px-3 align-top">
			<form-maker
				v-model="fx.color"
				label="couleur"
				type="color"
				list="colors"
			/>

			<dropdown-menu class="pt-1">
				<template
					#button
				>
					<div class="space-y-1">
						<div class="text-xs">
							style
						</div>

						<div
							class="divide-y-2 divide-black border rounded-sm px-3"
							:class="{
								'divide-solid':fx.style==='plain',
								'divide-dashed':fx.style==='dash',
								'divide-dotted':fx.style==='dot',
							}"
						>
							<div class="h-[0.75em]" />
							<div class="h-[0.75em]" />
						</div>
					</div>
				</template>


				<div
					v-for="s in availableStyles"
					:key="s"
					class="cursor-pointer hover:scale-105 divide-y-2 divide-black max-w[3em] px-3"
					:class="{
						'divide-solid':s==='plain',
						'divide-dashed':s==='dash',
						'divide-dotted':s==='dot',
					}"
					@click="fx.style = s"
				>
					<div class="h-[1em]" />
					<div class="h-[1em]" />
				</div>
			</dropdown-menu>
		</div>

		<div
			v-show="showAdvanced"
			class="grid grid-cols-3 gap-3 px-3 align-top"
		>
			<form-maker
				v-model="fx.width"
				label="épaisseur"
				type="number"
				sm
			/>

			<form-maker
				v-model="fx.samples"
				label="qualité"
				max="2000"
				min="1"
				sm
				font-code
				type="number"
			/>

			<form-maker
				v-model="fx.domain"
				label="domaine"
				sm
				font-code
			/>
		</div>
	</div>
</template>
