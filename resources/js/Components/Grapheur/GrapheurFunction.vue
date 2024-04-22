<script lang="ts" setup>

import { fnInterface } from "@/Pages/Singles/GraphPage.vue"
import { computed, nextTick, onMounted, ref, watch } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import DropdownMenu from "@/Components/Ui/DropdownMenu.vue"

// TODO: Make a better color selector
const colors = ["blue", "red", "green", "orange", "purple", "magenta", "cyan"]

const fx = defineModel<fnInterface>()

const editor = ref(null)

const isEditing = ref(false)

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

onMounted(()=>{
	isEditing.value = fx.value.isNew??false
	fx.value.isNew = false
})

defineEmits<{
	destroy: []
}>()
</script>

<template>
	<div
		class="bg-white rounded border flex flex-col gap-3 relative"
	>
		<div
			class="absolute -top-3 -right-3 w-7 h-7 rounded-full
			bg-white grid place-items-center z-10 border cursor-pointer"
			@click="$emit('destroy')"
		>
			<i class="bi bi-trash" />
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
				v-katex.inline="`${fx.name}(${fx.type}) = ${fxAsTex}`"
				class="cursor-pointer"
				@click="isEditing = true"
			/>
		</div>
		<div class="grid grid-cols-3 gap-3 px-3 pb-3 align-top">
			<dropdown-menu class="pt-1">
				<template
					#button
				>
					<div class="text-xs">
						couleur
					</div>
					<div
						:style="`background-color:${fx.color}`"
						class="h-[1.5em] w-full mt-1 rounded"
					/>
				</template>

				<div
					v-for="color in colors"
					:key="color"
					:style="`background-color:${color}`"
					class="h-[2em] cursor-pointer hover:scale-105"
					@click="fx.color = color"
				/>
			</dropdown-menu>

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

<style scoped>

</style>
