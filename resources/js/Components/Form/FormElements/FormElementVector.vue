<script setup lang="ts">
import {computed, ref, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"
import {Fraction} from "pimath"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {data} from "autoprefixer"

defineOptions({
	inheritAttrs: false
})

const value = defineModel<string>()
const input = useTemplateRef('input')
const errors = ref<string[]>([])

const props = defineProps<FormMakerPropsNewType>()

defineExpose<FormElementExpose>({
	focus: () => input.value?.focus(),
	validate
})

const emits = defineEmits<FormElementEmits>()

function validate(): string[] {

	if (value.value === '') {
		return []
	}

	if (!value.value.startsWith('(')) {
		return ["Un vecteur commence par une parenthèse."]
	}


	// Est de la forme <fraction>,<fraction>,<fraction>,...
	const composants = value.value
		.substring(1) // remove the first parenthesis
		.split(',')

	for (let i = 0; i < composants.length; i++) {
		if (i === composants.length - 1 && composants[i].endsWith(')')) {
			composants[i] = composants[i].slice(0, -1)
		}

		try {
			const F = new Fraction(composants[i])
			if (F.isNaN()) {
				return [`La ${i + 1}ème composante n'est pas reconnue.`]
			}
		} catch {
			return [`La ${i + 1}ème composante n'est pas reconnue.`]
		}
	}

	if (!value.value.endsWith(')')) {
		return ["Un vecteur se termine par une parenthèse."]
	}

	return []
}

function onChange() {
	errors.value = validate()
	emits('errors', errors.value)
	emits('update', value.value)
}

const tex = computed(() => {
	const comps = value.value.split(',').map(x => x.trim())
	if (comps.length === 0) {
		return ''
	}

	if (comps[0].startsWith('(')) {
		comps[0] = comps[0].substring(1)
	}

	if (comps[comps.length - 1].endsWith(')')) {
		comps[comps.length - 1] = comps[comps.length - 1].substring(0, comps[comps.length - 1].length - 1)
	}


	return `\\begin{pmatrix}${
		comps
			.map(comp => {
				if (comp === '') {
					return '?'
				}

				try {
					return new Fraction(comp).tex
				} catch {
					return '?'
				}
			}).join('\\\\')
	}\\end{pmatrix}`
})
</script>

<template>
	<form-maker-wrapper
		v-bind="{...$attrs, ...props}"
		:errors
		:icon="'bi bi-pencil'"
		:prepend="'\\((a,b)=\\)'"
	>
		<input
			ref="input"
			type="text"
			v-model="value"
			class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
			v-bind="$attrs"
			@keyup="onChange"
		>
		<template
			v-if="output"
			#message
		>
			<div
				v-if="output===true"
				v-katex.display="tex"
			/>
			<div
				v-else
				v-katex.auto="output.replaceAll('$VALUE$', tex)"
			/>
		</template>
	</form-maker-wrapper>
</template>
