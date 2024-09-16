<script lang="ts" setup>
/** Chapter
 * title: tableau de signes ou de variations
 * body: tableau de signes ou de variations
 */
import { computed, nextTick, onMounted, reactive, ref } from "vue"
import  PiMath from "pimath"
import TableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import { splitIfOutsideParentheses } from "@/helpers/helperFunctions.js"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"

interface fracRationnelle {
	valid: boolean,
	tos: object | null,
	dxtos: object | null,
	extrema?: object,
	dxTex?: string
}

const forms: IToolForm[] = [
	{
		label: "fonction",
		type: "text",
		value: ref("x^2-5x+6"),
		fromUrl: "fx"
	},
	{
		label: "signes,variations",
		type: "switch",
		value: ref(true),
		fromUrl: "mode"
	}
]

const fx = computed(() => forms[0].value.value as string)
const mode = computed(() => forms[1].value.value as boolean)

const validation = ref(false)
const fraction_rationnelle: fracRationnelle = reactive({
	valid: false,
	tos: {
		signs: [],
		factors: [],
		zeroes: []
	},
	dxtos: {
		signs: [],
		factors: [],
		zeroes: []
	}
})

async function validation_fx() {
	validation.value = false

	// Validate the input
	if (fx.value === "") return false

	// Get numerator and denominator
	const [numeratorStr, denominatorStr] = splitIfOutsideParentheses(fx.value, "/")
	let numerator, denominator
	//  fx.value.split("/")
	try {
		numerator = new PiMath.Polynom(numeratorStr)
	} catch (e) {
		// validationDescription.value = "Le numérateur n'est pas reconnue"
		return false
	}

	if (denominatorStr !== undefined) {
		try {

			denominator = new PiMath.Polynom(denominatorStr ? denominatorStr : 1)
		} catch (e) {
			// validationDescription.value = "Le dénominateur n'est pas reconnu"
			return false
		}
	} else {
		denominator = new PiMath.Polynom(1)
	}

	let FR = new PiMath.Rational(numerator, denominator),
		study = FR.study()

	fraction_rationnelle.tos = study.signs
	fraction_rationnelle.dxtos = study.derivative

	await nextTick()
	validation.value = true
}

onMounted(() => {
	validation_fx()
})
</script>

<template>
	<article
		v-if="validation"
		ref="root"
	>
		<!-- Value to modify enter -->

		<tool-form
			:forms="forms"
			form-class="grid grid-cols-1 gap-3"
		>
			<div class="flex gap-3 justify-center">
				<button
					class="btn btn-primary"
					@click.prevent="validation_fx"
				>
					valider
				</button>
			</div>
		</tool-form>

		<!-- Tableau de signes -->
		<div
			v-if="mode"
			class="bg-white rounded border-gray-400 p-4"
		>
			<h2 class="chapter-menu text-lg mb-10">
				Tableau de signes
			</h2>

			<table-of-signs
				v-if="fraction_rationnelle.tos"
				:tos="fraction_rationnelle.tos"
				class="px-10"
			/>
		</div>

		<!-- Tableau de variation -->
		<div
			v-if="!mode"
			class="bg-white rounded border-gray-400 p-4"
		>
			<h2 class="chapter-menu text-lg mb-10">
				Variation
			</h2>
			<div
				v-katex="fraction_rationnelle.dxTex"
			/>

			<table-of-signs
				v-if="fraction_rationnelle.dxtos"
				:tos="fraction_rationnelle.dxtos"
				class="px-10 mt-10"
			/>

			<div
				v-for="(zero, index) in fraction_rationnelle.extrema"
				:key="`zero-${index}`"
				v-katex="zero"
			/>
		</div>
	</article>
</template>
