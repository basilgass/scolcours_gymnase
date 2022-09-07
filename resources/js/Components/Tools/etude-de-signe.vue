<template>
	<Panel
		v-if="validation"
		ref="root"
	>
		<!-- Value to modify enter -->
		<form
			class="max-w-md mx-auto mb-6"
			@submit.prevent="validation_fx"
		>
			<form-input
				v-model="fx"
				label="Fraction rationnelle"
				name="fractionrationelle"
				:focus="true"
			/>

			<form-button>
				Valider
			</form-button>
		</form>

		<hr>

		<!-- Output -->
		<table-of-contents>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-20 katex-boxed">
				<!-- Ensemble de définition -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Fonction
					</h2>
					<div
						v-katex="fraction_rationnelle.tex"
					/>
				</div>

				<!-- Ensemble de définition -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Ensemble de définition
					</h2>
					<div
						v-katex="`ED_f=${fraction_rationnelle.domain}`"
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

					<div>
						<div v-katex.display="fraction_rationnelle.aoTex" />

						<table-of-signs
							v-if="fraction_rationnelle.ao[0].tableOfSign!==false"
							:tos="fraction_rationnelle.ao[0].tableOfSign"
							fn="\delta"
						/>
					</div>
				</div>

				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Variation
					</h2>
					<div
						v-katex="fraction_rationnelle.dxTex"
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
				<div class="bg-white rounded border-gray-400 p-4 lg:col-span-2">
					<h2 class="chapter-menu text-lg mb-10">
						Représentation graphique
					</h2>

					<pi-draw-parser
						v-if="fraction_rationnelle.drawCode!==false"
						class="max-w-3xl mx-auto"
						axis
						:width="800"
						:height="600"
						:draw="{
							parameters: fraction_rationnelle.drawParameters,
							code: fraction_rationnelle.drawCode
						}"
					/>
				</div>
			</div>
		</table-of-contents>
	</Panel>
</template>

<script setup>
/** Chapter
 * title: étude de signe
 * body: étude de signe d'une fonction rationnelle.
 */

/** Chapter
 * title: étude de signe
 * body: étude de signe d'une fonction rationnelle.
 */
import {nextTick, onMounted, reactive, ref} from "vue"
import {PiMath} from "pimath/esm"
import TableOfSigns from "@/Components/Pi/PiTableOfSigns"
import PiDrawParser from "@/Components/Pi/PiDrawParser"
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import FormButton from "@/Components/Form/FormButton"
import TableOfContents from "@/Components/Ui/TableOfContents"

let root = ref(null),
	fx = ref("(3x-5)(x+7)/(x-3)"),
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
		drawCode: false,
		drawParameters: "axis,grid"
	})

async function validation_fx() {
	validation.value = false

	// Validate the input
	if (fx.value === "") {
		return false
	}
	let numerator, denominator

	const fxSplit = fx.value.split("/")
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
	// Draw parameters
	// Get the min / max x and the min / max y.
	let extremesX = {
			min: -1,
			max: 1
		},
		extremesY = {
			min: -1,
			max: 1
		}
	// Check the zeroes.
	const particularPoints = [...study.zeroes, ...Object.values(study.derivative.extremes)]
	particularPoints.forEach(zero=>{
		let valueX = zero.value.x!==undefined?zero.value.x:zero.value,
			valueY = zero.value.y!==undefined?zero.value.y:0

		extremesX.min = Math.floor(Math.min(valueX-5, extremesX.min)-1)
		extremesX.max = Math.floor(Math.max(valueX+5, extremesX.max)+2)
		extremesY.min = Math.floor(Math.min(valueY-5, extremesY.min)-1)
		extremesY.max = Math.floor(Math.max(valueY+5, extremesY.max)+2)
	})

	// Format it to have a 4:3 version.
	const dx = extremesX.max - extremesX.min,
		dy =  extremesY.max - extremesY.min

	if(dx/dy>1.3){
		// Too wide
		extremesY.min -= Math.floor((dx*3/4-dy)/2)-1
		extremesY.max += Math.floor((dx*3/4-dy)/2)+2
	}else if(dx/dy<1.2){
		// Too height
		extremesX.min -= Math.floor((dy*4/3-dx)/2)-1
		extremesX.max += Math.floor((dy*4/3-dx)/2)+2
	}
	console.log(extremesX, extremesY)
	fraction_rationnelle.drawParameters = `axis,grid,x=${extremesX.min}:${extremesX.max},y=${extremesY.min}:${extremesY.max}`

	// Draw code
	fraction_rationnelle.drawCode = study.drawCode()

	await nextTick()
	validation.value = true
}

onMounted(() => {
	validation_fx()
})
</script>
