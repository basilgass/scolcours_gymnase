<template>
	<Panel>
		<form-input
			v-model="f"
			:active="activeInput==='fx'"
			focus
			label="fonction"
			name="f"
			@input-focus="activeInput='fx'"
		/>

		<div class="flex gap-3">
			<form-input
				v-model="xMin"
				:active="activeInput==='xMin'"
				label="borne inférieure"
				name="xMin"
				@input-focus="activeInput='xMin'"
			/>
			<form-input
				v-model="xMax"
				:active="activeInput==='xMax'"
				label="borne supérieure"
				name="xMax"
				@input-focus="activeInput='xMax'"
			/>
			<form-input
				v-model="step"
				:active="activeInput==='step'"
				label="pas"
				name="step"
				@input-focus="activeInput='step'"
			/>
			<form-input
				v-model="fixed"
				:active="activeInput==='fixed'"
				label="arrondi"
				name="fixed"
				@input-focus="activeInput='fixed'"
			/>
		</div>

		<div class="mt-2">
			<keyboard-element
				v-show="activeInput==='fx'"
				back
				keyboard="polynom"
				next
				reset
				@change="f=$event.input"
				@next="activeInput='xMin'"
			/>
			<keyboard-element
				v-show="activeInput==='xMin'"
				back
				keyboard="number"
				next
				reset
				@change="xMin=$event.input"
				@next="activeInput='xMax'"
			/>
			<keyboard-element
				v-show="activeInput==='xMax'"
				back
				keyboard="number"
				next
				reset
				@change="xMax=$event.input"
				@next="activeInput='step'"
			/>
			<keyboard-element
				v-show="activeInput==='step'"
				back
				keyboard="number"
				next
				reset
				@change="step=$event.input"
				@next="activeInput='fx'"
			/>
			<keyboard-element
				v-show="activeInput==='fixed'"
				back
				keyboard="number"
				next
				reset
				@change="fixed=$event.input"
				@next="activeInput='fixed'"
			/>
		</div>

		<div class="flex items-center justify-center">
			<div
				v-if="fx"
				class="w-full"
			>
				<div
					v-katex.ascii="`f(x) = ${f}`"
					class="katex-boxed"
				/>

				<div class="overflow-x-auto w-full mt-10 mb-3">
					<table class="mb-3">
						<thead class="border-b border-gray-500 bg-gray-200">
							<tr class="font-semibold">
								<th
									v-katex="`x`"
									class="border-r border-gray-500 min-w-[5em]"
								/>
								<th
									v-for="v of fx"
									:key="`th-${v.x}`"
									v-katex="`${v.x}`"
									class="min-w-[4em] border-r border-gray-500 px-3"
								/>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td
									v-katex="`f(x)`"
									class=" border-r border-gray-500 min-w-[5em]"
								/>
								<td
									v-for="v of fx"
									:key="`td-${v.x}`"
									v-katex="`${v.fx}`"
									class=" border-r border-gray-500 px-3"
								/>
							</tr>
							<tr>
								<td class=" border-r border-gray-500 min-w-[5em]" />
								<td
									v-for="v of fx"
									:key="`td-tex-${v.x}`"
									v-katex="`${v.fxTex}`"
									class=" border-r border-gray-500 px-3"
								/>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div
				v-else
				class="text-red-700 text-sm bg-red-100 w-full py-5 text-center"
			>
				Une erreur s'est produite lors de l'introduction des coordonnées.
			</div>
		</div>
	</Panel>
</template>

<script setup>
/** Tools
 * title: tableau des valeurs d'une fonction
 * body: permet de créer un tableau des valeurs d'une fonction
 * parameters: fx=Fonction (texte), min=Nombre ou Fraction, max=Nombre ou Fraction, pas=Nombre ou Fraction
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import KeyboardElement from "@/Components/Keyboards/KeyboardElement.vue"
import {numberCorrection} from "pidraw/esm/Calculus"
import {Polynom} from "pimath/esm/maths/algebra/polynom"

// TODO: tableau des valeurs doit être restructurer pour fonctionner avec des valeurs trigonométriques.

let f = ref("sin(x)"),
	xMin = ref("0"),
	xMax = ref("6.5"),
	step = ref("0.52359877"),
	activeInput = ref("fx"),
	fixed = ref("2")

let fx = computed(() => {
		try {
			return getTableOfValues()
		} catch (e) {
			console.warn(e)
			return false
		}
	}),
	isTrigonometric = computed(() => {
		return f.value.includes("sin") || f.value.includes("cos") || f.value.includes("tan")
	}),
	getTableOfValues = function () {
		let exp
		if (isTrigonometric.value) {
			exp = new PiMath.NumExp(f.value)
		} else {
			exp = new PiMath.Polynom(f.value)
		}

		let x = new PiMath.Fraction(Math.min(xMin.value, xMax.value)),
			vMax = new PiMath.Fraction(Math.max(xMin.value, xMax.value)),
			vStep = +step.value === 0 ? 1 : +step.value,
			vFixed = Math.max(1, Math.min(5, fixed.value)),
			data = [],
			securityIncrement = 0

		while (x.value <= vMax.value) {
			let v
			if(exp instanceof Polynom){
				v = exp.evaluate(x)
			}else{
				v = {
					value: exp.evaluate({x: x.value}),
					tex: ""
				}
			}

			data.push({
				x: x.value,
				fx: numberCorrection(v.value, null, null, 2),
				fxTex: v.tex
			})
			x.add(vStep)

			securityIncrement++

			if (securityIncrement > 100) {
				break
			}
		}

		return data
	}
</script>
