<script setup lang="ts">
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {Fraction, Polynom} from "pimath"
/** Tools
 * title: évaluation d'une fonction polynomiale
 * body: évaluation d'une fonction polynomiale
 * parameters: fx=Fonction (texte), b=Nombre ou Fraction
 * tags: algebre,1M
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
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
])

const f = computed(() => forms[0].value.value),
	x = computed(() => forms[1].value.value)

const activeInput = ref<number>(0)

function onKeyboardChange(value) {
	forms[activeInput.value].value.value = value.input
}

const fx = computed(() => {
	try {
		const FX = new Polynom(f.value as string),
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
			const fB = new Fraction(x.value as string)
			data.x = fB.tex
			data.fx = FX.tex.replace(/x/g, `\\left(${x.value}\\right)`)
			const value: Fraction = FX.evaluate(fB) as Fraction
			data.frac = value.tex
			data.value = value.value
		}

		return data
	} catch (e) {
		console.log(e)
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

		<Card>
			<div class="h-24 flex items-center justify-center">
				<div v-if="fx">
					<div
						v-katex="`f\\left(${fx.x}\\right) = ${fx.fx} ${fx.frac?'='+fx.frac:''} ${fx.value?'='+fx.value:''}`"
					/>
				</div>
				<tool-error v-else />
			</div>

			<div class="mt-2">
				<keyboard-display
					v-show="activeInput===0"
					back
					reset
					next
					keyboard="polynom"
					@change="onKeyboardChange"
					@next="activeInput=1"
				/>
				<keyboard-display
					v-show="activeInput===1"
					back
					reset
					next
					keyboard="fraction"
					@change="onKeyboardChange"
					@next="activeInput=0"
				/>
			</div>
		</Card>
	</article>
</template>
