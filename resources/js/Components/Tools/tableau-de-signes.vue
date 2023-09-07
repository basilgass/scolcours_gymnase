<template>
	<Panel
		v-if="validation"
		ref="root"
	>
		<!-- Value to modify enter -->
		<form
			class="max-w-md mx-auto mb-6"
			@submit.prevent
		>
			<form-input
				v-model="fx"
				:focus="true"
				label="fonction"
				name="fonction"
			/>

			<form-switch
				v-model="mode"
				label="signes,variations"
				name="mode"
			/>

			<div class="flex gap-3">
				<form-button
					@click.prevent="validation_fx"
				>
					Valider
				</form-button>
			</div>
		</form>

		<hr>

		<!-- Tableau de signes -->
		<div
			v-if="mode"
			class="bg-white rounded border-gray-400 p-4"
		>
			<h2 class="chapter-menu text-lg mb-10">
				Tableau de signes
			</h2>

			<table-of-signs
				v-if="fraction_rationnelle.tos!==false"
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
				v-if="fraction_rationnelle.dxtos!==false"
				:tos="fraction_rationnelle.dxtos"
				class="px-10 mt-10"
			/>

			<div
				v-for="(zero, index) in fraction_rationnelle.extrema"
				:key="`zero-${index}`"
				v-katex="zero"
			/>
		</div>
	</Panel>
</template>

<script setup>
/** Chapter
 * title: tableau de signes ou de variations
 * body: tableau de signes ou de variations
 */
import {nextTick, onMounted, reactive, ref} from "vue"
import {PiMath} from "pimath/esm"
import TableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import Panel from "@/Components/Ui/Panel.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormButton from "@/Components/Form/FormButton.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"

let root = ref(null),
	fx = ref("x^2-5x+6"),
	mode = ref(true),
	validation = ref(false),
	fraction_rationnelle = reactive({
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
		},
	})

async function validation_fx() {
	validation.value = false

	// Validate the input
	if (fx.value === "") return false

	// Get numerator and denominator
	let numerator, denominator

	const fxSplit = fx.value.split("/")
	try {
		numerator = new PiMath.Polynom(fxSplit[0])
	} catch (e) {
		validationDescription.value = "Le numérateur n'est pas reconnue"
		return false
	}

	if (fxSplit.length === 2) {
		try {

			denominator = new PiMath.Polynom(fxSplit[1] ? fxSplit[1] : 1)
		} catch (e) {
			validationDescription.value = "Le dénominateur n'est pas reconnu"
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
