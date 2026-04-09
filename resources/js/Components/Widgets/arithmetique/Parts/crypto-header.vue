<script setup lang="ts" generic="T extends string | number">

import {computed} from "vue"
import FormInput from "@/Components/Form/FormInput.vue"

const cipherKey = defineModel<T>()

const props = withDefaults(
	defineProps<{
		keyLabel?: string,
		keyType?: 'number' | 'text'
		keyTex?: boolean
		text: {
			clear: string,
			cipher: string
			expanded?: string
		},
		parameters: Record<string, string | boolean>,
	}>(),
	{
		keyLabel: "clé de cryptage",
		keyType: 'text',
		keyTex: true
	}
)
const emits = defineEmits<{
	hover: [e: { clear: string, cipher: string, key: string, index: number }]
}>()

/* =======================
   Show booleans
======================= */
const showClearText = computed(() => props.parameters.clear || props.parameters.text)
const showCipherText = computed(() => props.parameters.code || props.parameters.text)
const showExpandedKey = computed(() => props.parameters.expanded || props.parameters.text)
const showForm = computed(() => !(props.parameters.key && props.parameters['!form']))
const isInverted = computed(() => props.parameters.inv)
</script>

<template>
	<div>
		<div
			v-if="showForm"
			class="flex gap-3 items-baseline"
		>
			<FormInput
				v-model="cipherKey"
				inline-label
				:label="keyLabel"
				label-class="font-semibold"
				:type="keyType"
				class="max-w-sm "
				icon="bi bi-key"
			/>
		</div>
		<div v-else>
			<span class="font-semibold">{{ keyLabel }}</span> :
			<span
				v-if="keyTex"
				v-katex="cipherKey"
			/>
			<span v-else>{{ cipherKey }}</span>
		</div>

		<div class="overflow-x-auto whitespace-nowrap">
			<div class="flex my-3 cursor-pointer">
				<div class="flex flex-col font-semibold pr-3">
					<span
						v-if="showClearText"
						class="py-1"
					>{{ !isInverted ? 'texte claire' : 'texte crypté' }}</span>
					<span
						v-if="showExpandedKey && text.expanded"
						class="py-1"
					>clé</span>
					<span
						v-if="showCipherText"
						class="py-1"
					>{{ !isInverted ? 'texte crypté' : 'texte clair' }}</span>
				</div>

				<div
					v-for="(c, i) in text.clear"
					:key="i"
					class="flex flex-col items-center group  font-code"
					@mouseenter="emits('hover', {
						index: i,
						clear: text.clear[i],
						cipher: text.cipher[i],
						key: text.expanded?.[i] ?? null
					})"
					@mouseleave="emits('hover', null)"
				>
					<span
						v-if="showClearText"
						class="group-hover:bg-green-100 px-2 py-1 transition-colors"
					>{{ text.clear[i] }}</span>
					<span
						v-if="showExpandedKey && text.expanded"
						class="group-hover:bg-blue-100 px-2 py-1 transition-colors"
					>{{
						text.expanded[i]
					}}</span>
					<span
						v-if="showCipherText"
						class="group-hover:bg-red-300 group-hover:font-bold px-2 py-1 transition-colors"
					>{{ text.cipher[i] }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
