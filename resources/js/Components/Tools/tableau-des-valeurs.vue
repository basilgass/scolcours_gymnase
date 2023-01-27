<template>
	<Panel>
		<form-input
			v-model="f"
			:active="activeInput==='fx'"
			label="fonction"
			name="f"
			focus
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
				reset
				next
				keyboard="polynom"
				@change="f=$event.input;ftex=$event.tex"
				@next="activeInput='xMin'"
			/>
			<keyboard-element
				v-show="activeInput==='xMin'"
				back
				reset
				next
				keyboard="number"
				@change="xMin=$event.input"
				@next="activeInput='xMax'"
			/>
			<keyboard-element
				v-show="activeInput==='xMax'"
				back
				reset
				next
				keyboard="number"
				@change="xMax=$event.input"
				@next="activeInput='step'"
			/>
			<keyboard-element
				v-show="activeInput==='step'"
				back
				reset
				next
				keyboard="number"
				@change="step=$event.input"
				@next="activeInput='fx'"
			/>
			<keyboard-element
				v-show="activeInput==='fixed'"
				back
				reset
				next
				keyboard="number"
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
					v-katex="`f(x) = ${ftex}`"
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

let f = ref("3x+1"),
	ftex = ref("3x+1"),
	xMin = ref("-10"),
	xMax = ref("10"),
	step = ref("1"),
	activeInput = ref("fx"),
	fixed = ref(2)

let fx = computed(() => {
		try {
			return getTableOfValues()
		}catch(e){
			console.warn(e)
			return false
		}
	}),
	getTableOfValues = function(){
		let FX = new PiMath.Polynom(f.value),
			x = new PiMath.Fraction(Math.min(xMin.value, xMax.value)),
			vMax = new PiMath.Fraction(Math.max(xMin.value, xMax.value)),
			vStep = +step.value===0?1:+step.value,
			vFixed = Math.max(1, Math.min(5, fixed.value)),
			data = [],
			securityIncrement = 0


		while(x.value<=vMax.value){
			const v = FX.evaluate(x)

			data.push({
				x: x.value,
				fx: PiMath.Numeric.round(v.value, vFixed),
				fxTex: v.tex
			})
			x.add(vStep)

			securityIncrement++

			if(securityIncrement>100){break}
		}

		return data
	}
</script>
