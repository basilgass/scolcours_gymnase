<script
	lang="ts"
	setup
>

import type {PiDraw} from "pidraw"
import {computed, inject, onMounted, ref, useTemplateRef, watch} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import VueSlider from "vue-3-slider-component"
import {
	IDrawComputedValue,
	IDrawStep,
	type IPiDrawProps,
	ISlider,
	PiDraw_Parse_Code
} from "@/Components/Pi/PiDrawHelper.ts"
import {useScriptLoader, UseScriptLoaderReturn} from "@/Composables/useScriptLoader.ts"
import PiDrawDisplay from "@/Components/Pi/Parts/PiDrawDisplay.vue"
import {dynamicText, replaceDoubleSigns} from "@/Composables/useHelpers.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {usePage} from "@inertiajs/vue3"
import {Fraction} from "pimath"

const editMode = useStoreEditMode()

const props = withDefaults(defineProps<IPiDrawProps & { theme?: string | number | false }>(),
	{
		width: 400,
		height: 320,
		theme: usePage().props?.theme?.slug ?? 'scolcours'
	}
)

const displayRef = useTemplateRef<InstanceType<typeof PiDrawDisplay>>('displayRef')

function getPiDraw(): PiDraw {
	return displayRef.value?.getPiDraw() ?? null
}

defineExpose({getPiDraw})

const emits = defineEmits<{
	drawClick: [{ draw: PiDraw, mouse: MouseEvent | TouchEvent }],
	update: [draw: PiDraw],
	mounted: [draw: PiDraw]
}>()
const showCode = ref(false)
// Set the current step index
const stepIndex = ref(-1)

// Tex display
const tex = ref<string | undefined>(undefined)

// List of all block steps
const steps = ref<IDrawStep[]>([])
const foreground = ref<string[]>([])
const addMode = ref<boolean>(false)

// List of all sliders
const sliders = ref<ISlider[]>([])
const computedValues = ref<IDrawComputedValue[]>([])

// Current block RAW value
const currentStep = computed<IDrawStep>(() => {
	if (steps.value.length === 0) {
		return {
			body: "",
			code: []
		}
	}


	const step = steps.value[Math.max(stepIndex.value, 0)] ?? {
		body: "",
		code: []
	}

	if (addMode.value && stepIndex.value > 0) {
		for (let i = 0; i < stepIndex.value; i++) {
			const prevStep = steps.value[i]
			step.code = [...prevStep.code, ...step.code]
		}
	}

	return {
		body: step.body,
		code: [
			...foreground.value,
			...step.code
		]
	}
})

onMounted(() => {
	updateData()
})

function updateData() {
	// On props.code change, rebuild the ref values.
	const data = PiDraw_Parse_Code(props.draw.code)

	tex.value = data.tex
	steps.value = data.steps
	foreground.value = data.foreground
	addMode.value = data.addMode
	sliders.value = data.sliders
	computedValues.value = data.computedValues
}

watch(() => props.draw.code, () => {
	updateData()
})

// Display text with sliders modifications.
const texComputed = computed(() => {
	// Get the output code: starting with $tex=
	if (tex.value === undefined) {
		return ""
	}

	// Get the raw code
	let t = tex.value

	// Update the raw code with the sliders values.
	sliders.value.forEach((slider) => {
		t = t.replaceAll(
			slider.key,
			sliderValue(slider)
		)
	})

	// Return the tex code (reformatted)
	return replaceDoubleSigns(t)
})

// REFACTOR: optimisation à faire en calculant toutes les valeurs une fois.
function sliderValue(slider: ISlider): string {
	return slider.factor === 'pi'
		? toTexPi(slider.value)
		: slider.value.toString()
}

function toTexPi(value): string {
	const F = new Fraction(value)

	if (F.value === 0) {
		return '0'
	}

	const num = Math.abs(F.numerator) === 1 ? '' : Math.abs(F.numerator)

	if (F.denominator === 1) {
		return `${F.numerator < 0 ? '-' : ''} ${num}\\pi`
	}


	return `${F.numerator < 0 ? '-' : ''}\\frac{ ${num}\\pi }{ ${F.denominator} }`
}


// REFACTOR : est-ce que cette partie est maintenant utile ici aussi, vu que c'est égaleemtn mis dans IllustrationShow ?
const blockScript = inject<UseScriptLoaderReturn>('blockScript', useScriptLoader(""))
const drawScript = useScriptLoader("", {parent: blockScript.data})

const dynamicValues = computed<Record<string, string | number>>(() => {
	const dict: Record<string, string | number> = {}
	Object.keys(drawScript.merged.value).forEach(key => {
		dict[`$${key}`] = drawScript.merged.value[key]
	})

	sliders.value.forEach((slider) => {
		dict[slider.key] = slider.value *
			(slider.factor === 'pi' ? Math.PI : +slider.factor)
	})

	computedValues.value.forEach((item) => {
		if (Object.hasOwn(dict, item.reference)) {
			dict[item.key] = item.expr.evaluate({x: +dict[item.reference]})
			if (item.postProcess) {
				dict[item.key] = item.postProcess(dict[item.key] as number)
			}
		}
	})

	return dict
})
/**
 * DrawCode system
 * 1. apply sliders values
 * 2. apply scripts values
 * 3. apply steppers values.
 */
const drawCode = computed<string>(() => {
	return dynamicText(currentStep.value.code.join('\n'), dynamicValues.value)
})

const drawParameter = computed(() => {
	return props.draw.parameters ?? ""
})

// Grab the data when on mouse up for external modifications
const drawMouseUp = function (evt: { draw: PiDraw, mouse: MouseEvent }) {
	emits("update", evt.draw)
	emits("drawClick", evt)
}


</script>

<template>
	<article
		class="dark:bg-slate-600"
	>
		<!-- draw graph-->
		<div class="relative">
			<pi-draw-display
				ref="displayRef"
				:code="drawCode"
				:parameters="drawParameter"
				@mounted="emits('mounted', $event)"
				@draw-click="drawMouseUp"
			/>
			<div
				v-if="editMode.enable"
				class="absolute bottom-1 right-2"
			>
				<i
					class="cursor-pointer bi bi-code"
					@click="showCode=!showCode"
				/>
			</div>
		</div>

		<!-- stepper -->
		<div
			v-if="steps.length > 1"
			class="my-3"
		>
			<div v-if="stepIndex>=0">
				<div class="flex items-center justify-center gap-10">
					<sc-button
						:disabled="stepIndex < 0"
						class="px-3 py-2"
						xs
						@click="stepIndex--"
					>
						<i class="bi bi-chevron-left" />
					</sc-button>
					<div>{{ stepIndex + 1 }} / {{ steps.length }}</div>
					<sc-button
						:disabled="stepIndex >= steps.length - 1"
						class="px-3 py-2"
						xs
						@click="stepIndex++"
					>
						<i class="bi bi-chevron-right" />
					</sc-button>
				</div>
				<div
					v-katex.auto="currentStep.body"
					class="my-3"
				/>
			</div>
			<div
				v-else
				class="w-full"
			>
				<sc-button
					:class="`w-full tracking-wider d-block`"
					theme
					xs
					@click="stepIndex = 0"
				>
					Marche à suivre
				</sc-button>
			</div>
		</div>

		<!-- slider(s) -->
		<div
			v-if="sliders.length > 0"
			class="space-y-6 mt-6"
		>
			<div
				v-for="(slider, index) of sliders"
				:key="`slider-${index}`"
				class="flex"
			>
				<div
					v-if="slider.label"
					v-katex.left.nomargin="`${slider.key.substring(1)}=${sliderValue(slider)}`"
					class="w-[120px] overflow-hidden"
				/>
				<vue-slider
					v-model="slider.value"
					:dot-style="{
						backgroundColor: `var(--color-${theme})`
					}"
					:label-style="{'margin-top': `3px`}"
					:process-style="{
						backgroundColor: `var(--color-${theme})`
					}"
					:rail-style="{
						backgroundColor: `var(--color-${theme}-light)`
					}"
					:tooltip="'focus'"
					:tooltip-style="{
						backgroundColor: `var(--color-${theme})`
					}"
					class="flex-1"
					v-bind="slider.options"
				>
					<template
						v-if="slider.factor==='pi'"
						#label="{ label }: {label: string}"
					>
						<span
							v-katex="toTexPi(label)"
							class="text-center vue-slider-mark-label custom-label"
						/>
					</template>
				</vue-slider>
			</div>

			<div v-katex="texComputed" />
		</div>


		<div
			v-if="editMode.enable && showCode"
			class="grid grid-cols-2 gap-3 mt-3"
		>
			<pre class="border border-slate-200 p-2">{{ dynamicValues }}</pre>
			<pre class="border border-slate-200 p-2 overflow-scroll">{{ drawCode }}</pre>
		</div>
	</article>
</template>
