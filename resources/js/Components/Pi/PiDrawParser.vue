<script
	lang="ts"
	setup
>

import type {PiDraw} from "pidraw"
import {computed, inject, onMounted, ref, useTemplateRef, watch} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import VueSlider from "vue-3-slider-component"
import {IDrawStep, type IPiDrawProps, ISlider, PiDraw_Parse_Code} from "@/Components/Pi/PiDrawHelper.ts"
import {useScriptLoader} from "@/Composables/useScriptLoader.ts"
import PiDrawDisplay from "@/Components/Pi/Parts/PiDrawDisplay.vue"
import {dynamicText, replaceDoubleSigns} from "@/Composables/useHelpers.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {usePage} from "@inertiajs/vue3"
import katex from "katex"

const editMode = useStoreEditMode()

const props = withDefaults(defineProps<IPiDrawProps & { theme?: string | number | false }>(),
	{
		width: 400,
		height: 320,
		theme: usePage().props.theme?.slug ?? 'scolcours'
	}
)

const displayRef = useTemplateRef<InstanceType<typeof PiDrawDisplay>>('displayRef')
function getPiDraw(): PiDraw{
	return displayRef.value?.getPiDraw() ?? null
}
defineExpose({getPiDraw})

const emits = defineEmits<{
	drawClick: [{ draw: PiDraw, mouse: MouseEvent }],
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

// List of all sliders
const sliders = ref<ISlider[]>([])

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
	sliders.value = data.sliders
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
		t = t.replaceAll(slider.key, slider.value.toString())
	})

	// Return the tex code (reformatted)
	return replaceDoubleSigns(t)
})

const blockScript = inject('blockScript', useScriptLoader(""))
const drawScript = useScriptLoader("", {parent: blockScript.data})
const dynamicValues = computed<Record<string, string | number>>(() => {
	const dict: Record<string, string | number> = {}
	Object.keys(drawScript.merged.value).forEach(key => {
		dict[`$${key}`] = drawScript.merged.value[key]
	})
	sliders.value.forEach((slider) => {
		dict[slider.key] = slider.value
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
					@click="showCode=!showCode"
					class="cursor-pointer bi bi-code"
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
					theme
					xs
					:class="`w-full tracking-wider d-block`"
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
					class="w-[120px] overflow-hidden"
					v-katex.left.nomargin="`${slider.key.substring(1)}=${slider.value}`"
				/>
				<vue-slider
					class="flex-1"
					v-model="slider.value"
					v-bind="slider.options"
					:label-style="{'margin-top': `3px`}"
					:tooltip="'always'"
					:tooltip-style="{
						backgroundColor: `var(--color-${theme})`
					}"
					:process-style="{
						backgroundColor: `var(--color-${theme})`
					}"
					:rail-style="{
						backgroundColor: `var(--color-${theme}-light)`
					}"
					:dot-style="{
						backgroundColor: `var(--color-${theme})`
					}"
				/>
			</div>

			<div v-katex="texComputed" />
		</div>


		<div
			v-if="editMode.enable && showCode"
			class="grid grid-cols-2 gap-3 mt-3"
		>
			<pre class="border border-slate-200 p-2">{{ dynamicValues }}</pre>
			<pre class="border border-slate-200 p-2">{{ drawCode }}</pre>
		</div>
	</article>
</template>
