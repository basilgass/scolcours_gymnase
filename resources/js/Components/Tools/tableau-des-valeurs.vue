<script lang="ts" setup>
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { numberCorrection } from "@/helpers/helperFunctions"
import { Fraction, NumExp, Polynom } from "pimath"
/** Tools
 * title: tableau des valeurs d'une fonction
 * body: permet de créer un tableau des valeurs d'une fonction
 * parameters: fx=Fonction (texte), min=Nombre ou Fraction, max=Nombre ou Fraction, pas=Nombre ou Fraction
 * tags: algebre,1M
 */
import { computed, ref } from "vue"
import Card from "@/Components/Ui/Card.vue"

const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "Fonction",
		type: "text",
		value: ref("2^x"),
		fromUrl: "fx",
		itemClass: 'col-span-2 md:col-span-4'
	},
	{
		label: "Borne inférieure",
		type: "text",
		value: ref("-5"),
		fromUrl: "xMin"
	},
	{
		label: "Borne supérieure",
		type: "text",
		value: ref("5"),
		fromUrl: "xMax"
	},
	{
		label: "Pas",
		type: "text",
		value: ref("0.5"),
		fromUrl: "step"
	},
	{
		label: "Arrondi",
		type: "text",
		value: ref("2"),
		fromUrl: "fixed"
	},
	{
		label: "tableau vertical",
		type: "switch",
		value: ref(true),
		fromUrl: "orientation",
		itemClass: 'col-span-1 md:col-span-2'
	},
	{
		label: "numérique",
		type: "switch",
		value: ref(true),
		fromUrl: "float",
		itemClass: 'col-span-1 md:col-span-2'
	}
])

// TODO: tableau des valeurs doit être restructurer pour fonctionner avec des valeurs trigonométriques.
// TODO: permettre un export TeX ou Excel.
const f = computed(() => forms[0].value.value as string)
const xMin = computed(() => forms[1].value.value as string)
const xMax = computed(() => forms[2].value.value as string)
const step = computed(() => forms[3].value.value as string)
const fixed = computed(() => forms[4].value.value as string)
const verticalTable = computed(()=>forms[5].value.value as boolean)
const numericParse = computed(()=>forms[6].value.value as boolean)

const activeInput = ref<number>(0)

const fx = computed(() => {
		if (f.value === "") return false

		try {
			return getTableOfValues()
		} catch (e) {
			console.log(e)
			return false
		}
	}),
	isNumeric = computed(() => {
		return f.value.includes("sin") || f.value.includes("cos") || f.value.includes("tan")
	}),
	getTableOfValues = function() {
		let exp: NumExp | Polynom

		if (isNumeric.value || numericParse.value) {
			exp = new NumExp(f.value)
		} else {
			try {
				exp = new Polynom(f.value)
			} catch {
				exp = new NumExp(f.value)
			}
		}

		let x = new Fraction(Math.min(+xMin.value, +xMax.value)),
			vMax = new Fraction(Math.max(+xMin.value, +xMax.value)),
			vStep = +step.value === 0 ? 1 : +step.value,
			data = [],
			securityIncrement = 0

		while (x.value <= vMax.value) {
			let v
			if (exp instanceof Polynom) {
				// as fraction
				v = exp.evaluate(x)
			} else {
				// as number
				v = {
					value: exp.evaluate({ x: x.value }),
					tex: ""
				}
			}

			data.push({
				x: x.value,
				fx: numberCorrection(v.value, +fixed.value),
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

function updateKbrd(event, index) {
	forms[index].value.value = event.input
}

</script>

<template>
	<article>
		<tool-form
			:active="activeInput"
			:forms="forms"
			form-class="grid grid-cols-2 md:grid-cols-4 gap-3"
		/>


		<Card class="mb-6">
			<keyboard-display
				v-show="activeInput===0"
				back
				keyboard="polynom"
				next
				reset
				@change="updateKbrd($event, 0)"
				@next="activeInput=1"
			/>
			<keyboard-display
				v-show="activeInput===1"
				back
				keyboard="number"
				next
				reset
				@change="updateKbrd($event, 1)"
				@next="activeInput=2"
			/>
			<keyboard-display
				v-show="activeInput===2"
				back
				keyboard="number"
				next
				reset
				@change="updateKbrd($event, 2)"
				@next="activeInput=3"
			/>
			<keyboard-display
				v-show="activeInput===3"
				back
				keyboard="number"
				next
				reset
				@change="updateKbrd($event, 3)"
				@next="activeInput=4"
			/>
			<keyboard-display
				v-show="activeInput===4"
				back
				keyboard="number"
				next
				reset
				@change="updateKbrd($event, 4)"
				@next="activeInput=0"
			/>
		</Card>

		<Card class="flex items-center justify-center">
			<div
				v-if="fx"
				class="w-full"
			>
				<div
					v-katex.ascii="`f(x) = ${f}`"
					class="katex-boxed"
				/>

				<div
					v-if="verticalTable"
					class="w-full mt-10 mb-3"
				>
					<table class="mb-3">
						<thead class="border border-gray-500 bg-gray-200">
							<tr class="font-semibold">
								<th
									v-katex="`x`"
									class="border-r border-gray-500 min-w-[5em]"
								/>
								<th
									v-katex.ascii="f"
									class="min-w-[4em] px-3"
								/>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="v of fx"
								:key="`td-${v.x}`"
								class=" border border-gray-500 min-w-[5em]"
							>
								<td
									v-katex="`${v.x}`"
									class="border-r border-gray-500 px-3"
								/>
								<td
									v-katex="`${ numericParse ? v.fx : v.fxTex}`"
									class="px-3"
								/>
								<td />
							</tr>
						</tbody>
					</table>
				</div>
				<div
					v-else
					class="overflow-x-auto w-full mt-10 mb-3"
				>
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
		</Card>
	</article>
</template>
