<template>
	<div
		v-if="validation"
		ref="root"
	>
		<table-of-contents
			ref="toc"
			query=".chapter-menu"
			class="space-y-10 katex-boxed"
		>
			<div class=" grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-20">
				<!-- Ensemble de définition -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Fonction
					</h2>
					<div
						v-katex="fraction_rationnelle.tex"
						class="px-10"
					/>
				</div>

				<!-- Ensemble de définition -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Ensemble de définition
					</h2>
					<div
						v-katex="`ED_f=${fraction_rationnelle.domain}`"
						class="px-10"
					/>
				</div>

				<!-- Tableau de signes -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Tableau de signes
					</h2>

					<table-of-signs
						v-if="fraction_rationnelle.tos!==false"
						class="px-10"
						:tos="fraction_rationnelle.tos"
					/>
				</div>

				<!-- Asymptotes verticales et horizontales -->
				<div
					v-if="fraction_rationnelle.av.length>0"
					class="bg-white rounded border-gray-400 p-4"
				>
					<h2 class="chapter-menu text-lg mb-10">
						Asymptotes verticales
					</h2>

					<div
						v-for="(item, index) in fraction_rationnelle.av"
						:key="`limites-${index}`"
						v-katex="`${item.limits} \\implies \\text{ AV: } ${item.tex}`"
						class="px-10"
					/>
				</div>

				<div
					v-if="fraction_rationnelle.ah.length>0"
					class="bg-white rounded border-gray-400 p-4"
				>
					<h2 class="chapter-menu text-lg mb-10">
						Asymptotes horizontales
					</h2>

					<div
						v-for="(item, index) in fraction_rationnelle.ah"
						:key="`limites-${index}`"
						class="px-10"
					>
						<div v-katex="`${item.limits} \\implies \\text{ AH: } ${item.tex}`" />
						<div
							v-if="item.delta!==null"
							v-katex="`\\delta(x)=${item.deltaX.tex}=${item.deltaX.texFactors}`"
						/>
						<table-of-signs
							v-if="item.tableOfSign!==false"
							:tos="item.tableOfSign"
						/>
					</div>
				</div>


				<!-- Asymptotes obliques -->
				<div
					v-if="fraction_rationnelle.ao.length>0"
					class="bg-white rounded border-gray-400 p-4"
				>
					<h2 class="chapter-menu text-lg mb-10">
						Asymptotes obliques
					</h2>

					<div class="px-10">
						<div v-katex.display="fraction_rationnelle.aoTex" />

						<table-of-signs
							v-if="fraction_rationnelle.ao[0].tableOfSign!==false"
							:tos="fraction_rationnelle.ao[0].tableOfSign"
						/>
					</div>
				</div>

				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Variation
					</h2>
					<div
						v-katex="fraction_rationnelle.dxTex"
						class="px-10"
					/>

					<table-of-signs
						v-if="fraction_rationnelle.dxtos!==false"
						class="px-10 mt-10"
						:tos="fraction_rationnelle.dxtos"
					/>

					<div
						v-for="(zero, index) in fraction_rationnelle.extrema"
						:key="`zero-${index}`"
						v-katex="zero"
					/>
				</div>

				<!-- Graphe -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Représentation graphique
					</h2>

					<pi-draw-parser
						v-if="fraction_rationnelle.drawCode!==false"
						class="max-w-3xl mx-auto"
						axis
						:draw="{
							parameters: '-20,20,-20,20',
							code: fraction_rationnelle.drawCode
						}"
					/>
				</div>
			</div>
		</table-of-contents>
	</div>
</template>

<script setup>
/** Chapter
 * title: étude de signe
 * body: étude de signe d'une fonction rationnelle.
 */

import {nextTick, onMounted, reactive, ref, toRef, watch} from "vue"
import {PiMath} from "pimath/esm"
import TableOfSigns from "@/Components/Chapters/analyse/etude-de-signe/table-of-signs"
import PiDrawParser from "@/Components/Pi/PiDrawParser"
import TableOfContents from "@/Components/Ui/TableOfContents"

const props = defineProps({
	fx: {type: String, required: true}
})

let root = ref(null),
	validation = ref(false),
	validationDescription = ref(""),
	fraction_rationnelle = reactive({
		valid: false,
		fxTex: "",
		domain: "",
		tos: {
			signs: [],
			factors: [],
			zeroes: []
		},
		asymptotes: [],
		av: [],
		ah: [],
		ao: [],
		dxTex: "",
		dxtos: {
			signs: [],
			factors: [],
			zeroes: []
		},
		extrema: [],
		drawCode: false
	})

async function validation_fx() {
	validation.value = false

	// Validate the input
	if (props.fx === "") {
		return false
	}
	let numerator, denominator
	const fxSplit = props.fx.split("/")
	try {
		numerator = new PiMath.Polynom(fxSplit[0])
	} catch (e) {
		validationDescription.value = "Le numérateur n'est pas reconnue"
		return false
	}

	try {
		denominator = new PiMath.Polynom(fxSplit[1] ? fxSplit[1] : 1)
	} catch (e) {
		validationDescription.value = "Le dénominateur n'est pas reconnu"
		return false
	}

	let FR = new PiMath.Rational(numerator, denominator),
		study = FR.study()


	// Function name
	fraction_rationnelle.tex = `f(x) = ${study.fx.tex} = ${study.fx.texFactors}`
	// Domain
	fraction_rationnelle.domain = study.fx.domain()
	// Signs
	fraction_rationnelle.tos = study.signs
	// Asymptotes
	fraction_rationnelle.av = study.asymptotes.filter(x => x.type === "av")
	fraction_rationnelle.ah = study.asymptotes.filter(x => x.type === "ah")
	fraction_rationnelle.ao = study.asymptotes.filter(x => x.type === "ao")
	if (fraction_rationnelle.ao.length === 1) {
		let {quotient} = study.fx.euclidian()
		fraction_rationnelle.aoTex = `f(x)=\\underbrace{ ${quotient.tex} }_{\\text{AO}} + \\underbrace{ ${fraction_rationnelle.ao[0].deltaX.texFactors} }_{\\delta(x)}`
	} else {
		fraction_rationnelle.aoTex = ""
	}

	// Variation
	fraction_rationnelle.dxTex = `f'(x)=${study.derivative.fx.tex} = ${study.derivative.fx.texFactors}`
	fraction_rationnelle.dxtos = study.derivative

	// Plots
	fraction_rationnelle.drawCode = study.drawCode()

	await nextTick()
	validation.value = true
}

let fxwatch = toRef(props, "fx")
watch(fxwatch, () => {
	validation_fx()
})

onMounted(() => {
	validation_fx()
})
</script>
