<script setup>
/** Tools
 * title: évaluation d'une fonction polynomiale
 * body: évaluation d'une fonction polynomiale
 * parameters: fx=Fonction (texte), b=Nombre ou Fraction
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel.vue"
import { computed, ref } from "vue"
import { PiMath } from "pimath/esm"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

let f = ref("3*x+1"),
	x = ref("1"),
	activeInput = ref("fx")

let fx = computed(() => {
	try {
		let FX = new PiMath.Polynom(f.value),
			data = {
				x: "",
				fx: "",
				frac: null,
				value: null
			}
		if (x.value === "") {
			data.x = "x"
			data.fx = FX.tex
			data.frac = null
			data.value = null
		} else {
			let fB = new PiMath.Fraction(x.value)
			data.x = fB.tex
			data.fx = FX.tex.replace(/x/g, `\\left(${x.value}\\right)`)
			const value = FX.evaluate(fB)
			data.frac = value.tex
			data.value = value.value
		}

		return data
	}catch (e) {
		return false
	}
})
</script>

<template>
	<Panel>
		<form-maker
			v-model="f"
			:active="activeInput==='fx'"
			label="fonction"
			name="f"
			focus
			@input-focus="activeInput='fx'"
		/>

		<form-maker
			v-model="x"
			:active="activeInput==='x'"
			label="valeur"
			name="x"
			@input-focus="activeInput='x'"
			message="Utiliser un nombre ou une fraction"
		/>

		<div class="h-24 flex items-center justify-center">
			<div v-if="fx">
				<div v-katex="`f\\left(${fx.x}\\right) = ${fx.fx} ${fx.frac?'='+fx.frac:''} ${fx.value?'='+fx.value:''}`" />
			</div>
			<div
				v-else
				class="text-red-700 text-sm bg-red-100 w-full py-5 text-center"
			>
				Une erreur s'est produite lors de l'introduction des coordonnées.
			</div>
		</div>

		<div class="mt-2">
			<keyboard-display
				v-show="activeInput==='fx'"
				back
				reset
				next
				keyboard="polynom"
				@change="f=$event"
				@next="activeInput='x'"
			/>
			<keyboard-display
				v-show="activeInput==='x'"
				back
				reset
				next
				keyboard="fraction"
				@change="x=$event"
				@next="activeInput='fx'"
			/>
		</div>
	</Panel>
</template>
