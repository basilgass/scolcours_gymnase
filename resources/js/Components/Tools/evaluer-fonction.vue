<script setup lang="ts">
/** Tools
 * title: évaluation d'une fonction polynomiale
 * body: évaluation d'une fonction polynomiale
 * parameters: fx=Fonction (texte), b=Nombre ou Fraction
 * tags: algebre,1M
 */
import { computed, ref } from "vue"
import { PiMath } from "pimath"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"

const forms: IToolForm[] = [
	{
		label: "fonction",
		type: "text",
		value: ref("3x+1"),
		fromUrl: "fx"
	},
	{
		label: "valeur",
		type: "text",
		value: ref("1"),
		fromUrl: "x",
		message: "Utiliser un nombre ou une fraction"
	}
]

const f = computed(() => forms[0].value.value),
	x = computed(() => forms[1].value.value)

const activeInput = ref<number>(0)

const fx = computed(() => {
	try {
		const FX = new PiMath.Polynom(f.value),
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
			const fB = new PiMath.Fraction(x.value)
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
	<article>
		<tool-form
			:forms="forms"
			:active="activeInput"
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
				v-show="activeInput===0"
				back
				reset
				next
				keyboard="polynom"
				@change="f=$event"
				@next="activeInput=1"
			/>
			<keyboard-display
				v-show="activeInput===1"
				back
				reset
				next
				keyboard="fraction"
				@change="x=$event"
				@next="activeInput=0"
			/>
		</div>
	</article>
</template>
