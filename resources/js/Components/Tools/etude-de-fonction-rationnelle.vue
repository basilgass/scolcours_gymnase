<script
	lang="ts"
	setup
>
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import TableOfSigns from "@/Components/Pi/TableOfSigns.vue"

/** Chapter
 * title: étude de fonction rationnelle
 * body: étude de signe d'une fonction rationnelle.
 */
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TableOfContents from "@/Components/Ui/TableOfContents.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { type ETUDE_DE_FONCTION_RATIONNELLE, makeStudyFromPolynoms } from "@/Composables/useTos.ts"
import { Numeric, Random } from "pimath"
import { computed, ref } from "vue"

// TODO: remove replaceAll('*x', 'x') in drawCode when PiDraw will be fixed
const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "Fraction rationnelle",
		type: "text",
		value: ref(""),
		fromUrl: "fx"
	},
	{
		label: "effectuer l'étude de fonction",
		type: "switch",
		value: ref(false),
		fromUrl: "autoUpdate"
	}
])

// Value from the form.
const fx = computed(() => {
	return forms[0].value.value as string
})
const autoUpdate = computed(()=>{
	return forms[1].value.value as boolean
})


const generate_attempts = ref(0)
const study = computed<ETUDE_DE_FONCTION_RATIONNELLE | false>(() => {
	const split: string[] = fx.value.split("/")

	if(!autoUpdate.value){
		return false
	}

	if (split.length > 2) {
		return false
	}

	const [numerator, denominator] = fx.value.split("/")

	return makeStudyFromPolynoms(numerator, denominator)
})

function generate_fx() {
	let n = 1,
		genFx
	while (n <= 500) {
		genFx = getFxWithControls(n < 250 ? 10 : 5)
		if (Math.abs(genFx.control.oao) < 10 &&
			Math.abs(genFx.control.slope) <= 3 &&
			Math.abs(genFx.control.ordonnee) <= 10 &&
			!genFx.control.trou &&
			!genFx.control.reduceable
		) {
			forms[0].value.value = genFx.fx
			generate_attempts.value = n
			return
		}

		n++
	}

	forms[0].value.value = genFx.fx
	alert("Aucune fonction intéressante générée...")
}

function getFxWithControls(maxValue: number) {
	let a: number, b: number, c: number, d: number, e: number, k: number, kd: number, kd2: number

	d = Random.number(1, maxValue)
	k = Random.numberSym(maxValue - d + 1, false)
	kd = d * k
	kd2 = d * d * k

	e = Random.item(
		Numeric.dividers(Math.abs(kd2)).filter(x => x >= Math.sqrt(kd2))
	) * (Random.bool() ? 1 : -1)
	a = kd2 / e

	const kd_divider = Random.item(Numeric.dividers(Math.abs(kd))) * (Random.bool() ? 1 : -1)
	b = Random.numberSym(maxValue, false)
	c = kd_divider - b

	const slope = a / d,
		oao = a * d * (b + c) - a * e / d * d,
		ordonnee = a * b * c / e,
		trou = b === e / d || c === e / d,
		reduceable = d % a === 0 && e % a === 0

	const a2 = a === 1 ? "" : (a === -1 ? "-" : a),
		b2 = (b > 0 ? "+" : "") + b,
		c2 = (c > 0 ? "+" : "") + (c !== 0 ? c : ""),
		d2 = d === 1 ? "" : (d === -1 ? "-" : d),
		e2 = (e > 0 ? "+" : "") + e
	return {
		fx: `${a2}(x${b2})(x${c2})/${d2}x${e2}`,
		control: {
			slope,
			oao,
			ordonnee,
			trou,
			reduceable
		}
	}
}

//
// onMounted(() => {
// 	validation_fx()
// })
</script>

<template>
	<article>
		<!-- Value to modify enter -->
		<tool-form
			:forms="forms"
			form-class="grid grid-cols-1 gap-3"
		>
			<div class="flex gap-3 mt-3 w-full justify-center">
				<button
					class="btn btn-primary"
					@click.prevent="generate_fx"
				>
					générer {{ generate_attempts > 0 ? `(${generate_attempts})` : "" }}
				</button>
			</div>
		</tool-form>

		<!-- Output -->
		<table-of-contents v-if="study!==false">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-20">
				<!-- Ensemble de définition -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Fonction
					</h2>
					<div v-katex.boxed="study.fx" />
				</div>

				<!--				Ensemble de définition-->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Ensemble de définition
					</h2>
					<div v-katex.boxed="`ED_f=${study.domain}`" />
				</div>

				<!-- Tableau de signes -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Tableau de signes
					</h2>

					<table-of-signs
						:roots="study.table_of_signs.roots.map(x=>x.tex)"
						:signs="study.table_of_signs.signs"
						class="px-10"
						mode="signs"
					/>
				</div>

				<!-- Racines -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Racines de la fonction
					</h2>

					<div
						v-katex.boxed="study.roots"
					/>
				</div>

				<!-- Asymptotes verticales et horizontales -->
				<div
					v-if="study.asymptotes.vertical.length > 0"
					class="bg-white rounded border-gray-400 p-4"
				>
					<h2 class="chapter-menu text-lg mb-10">
						Asymptotes verticales ou points limites
					</h2>

					<div
						v-for="(item, index) in study.asymptotes.vertical"
						:key="`etude-av-${index}`"
						v-katex.boxed="item.tex"
					/>
				</div>

				<div
					v-if="study.asymptotes.horizontal.length > 0"
					class="bg-white rounded border-gray-400 p-4"
				>
					<h2 class="chapter-menu text-lg mb-10">
						Asymptotes horizontales
					</h2>

					<div
						v-for="(item, index) in study.asymptotes.horizontal"
						:key="`etude-ah-${index}`"
					>
						<div v-katex.boxed="`${item.tex}`" />
						<div v-katex.boxed="`${item.delta.tex}`" />
						<table-of-signs
							:roots="item.delta.table_of_signs.roots.map(x=>x.tex)"
							:signs="item.delta.table_of_signs.signs"
						/>
					</div>
				</div>


				<!-- Asymptotes obliques -->
				<div
					v-if="study.asymptotes.slope.length > 0"
					class="bg-white rounded border-gray-400 p-4"
				>
					<h2 class="chapter-menu text-lg mb-10">
						Asymptotes obliques
					</h2>

					<div
						v-for="(item, index) in study.asymptotes.slope"
						:key="`etude-ao-${index}`"
					>
						<div v-katex.boxed="`${item.tex}`" />
						<div v-katex.boxed="`${item.delta.tex}`" />
						<table-of-signs
							:roots="item.delta.table_of_signs.roots.map(x=>x.tex)"
							:signs="item.delta.table_of_signs.signs"
						/>
					</div>
				</div>

				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Variation
					</h2>
					<div v-katex.boxed="study.derivative.fx" />

					<table-of-signs
						:extremes="study.extremes"
						:roots="study.derivative.table_of_signs.roots.map(x=>x.tex)"
						:signs="study.derivative.table_of_signs.signs"
						mode="grows"
					/>
					<!--										<div-->
					<!--											v-for="(zero, index) in fraction_rationnelle.extrema"-->
					<!--											:key="`zero-${index}`"-->
					<!--											v-katex.boxed="zero"-->
					<!--										/>-->
				</div>

				<!-- Graphe -->
				<div class="bg-white rounded border-gray-400 p-4 lg:col-span-2">
					<h2 class="chapter-menu text-lg mb-10">
						Représentation graphique
					</h2>

					<div>
						<pi-draw-parser
							:draw="study.draw"
							:height="600"
							:width="800"
							axis
							class="max-w-3xl mx-auto"
						/>

						<tex-code :tex="study.draw.parameters" />
						<tex-code :tex="study.draw.code" />
					</div>
				</div>
			</div>
		</table-of-contents>
	</article>
</template>
