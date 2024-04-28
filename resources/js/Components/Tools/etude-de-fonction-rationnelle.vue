<script lang="ts" setup>
/** Chapter
 * title: étude de fonction rationnelle
 * body: étude de signe d'une fonction rationnelle.
 */

// TODO: remove replaceAll('*x', 'x') in drawCode when PiDraw will be fixed
import { nextTick, onMounted, reactive, ref } from "vue"
import { PiMath } from "pimath"
import TableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import Panel from "@/Components/Ui/Panel.vue"
import TableOfContents from "@/Components/Ui/TableOfContents.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

import type { IExtrema, IZero } from "pimath/dist/maths/algebra/study"
import type { Polynom } from "pimath/dist/maths/algebra/polynom"

const root = ref(null),
	fx = ref("(3x-5)(x+7)/(x-3)"),
	generate_attempts = ref(0),
	validation = ref(false),
	validationDescription = ref(""),
	fraction_rationnelle = reactive({
		tex: "",
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
		aoTex: "",
		dxTex: "",
		dxtos: {
			signs: [],
			factors: [],
			zeroes: []
		},
		extrema: [],
		drawCode: null,
		drawParameters: "axis,grid,tex",
		texDev: ""
	})

async function validation_fx() {
	validation.value = false

	// Validate the input
	if (fx.value === "") {
		return false
	}
	let numerator: Polynom, denominator: Polynom

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

	const FR = new PiMath.Rational(numerator, denominator),
		study = FR.study()

	// Function name
	fraction_rationnelle.tex = `f(x) = ${study.fx.tex} = ${study.fx.texFactors}`
	fraction_rationnelle.texDev = `f(x) = ${study.fx.tex}`
	// Domain
	fraction_rationnelle.domain = study.fx.domain()
	// Signs
	fraction_rationnelle.tos = study.signs
	// Asymptotes
	fraction_rationnelle.av = study.asymptotes.filter(x => x.type === "av")
	fraction_rationnelle.ah = study.asymptotes.filter(x => x.type === "ah")
	fraction_rationnelle.ao = study.asymptotes.filter(x => x.type === "ao")
	if (fraction_rationnelle.ao.length === 1) {
		const { quotient } = study.fx.euclidian()
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
	const extremesX = {
			min: -1,
			max: 1
		},
		extremesY = {
			min: -1,
			max: 1
		}
	// Check the zeroes.
	const particularPoints: (IZero | IExtrema)[] = [...study.zeroes, ...Object.values(study.derivative.extremes)]

	// TODO: Check the particular points
	particularPoints.forEach(zero => {
		const valueX = (typeof zero.value === "number") ? zero.value : zero.value.x,
			valueY = (typeof zero.value === "number") ? zero.value : zero.value.y

		extremesX.min = Math.floor(Math.min(valueX - 5, extremesX.min) - 1)
		extremesX.max = Math.floor(Math.max(valueX + 5, extremesX.max) + 2)
		extremesY.min = Math.floor(Math.min(valueY - 5, extremesY.min) - 1)
		extremesY.max = Math.floor(Math.max(valueY + 5, extremesY.max) + 2)
	})

	// Format it to have a 4:3 version.
	const dx = extremesX.max - extremesX.min,
		dy = extremesY.max - extremesY.min

	if (dx / dy > 1.3) {
		// Too wide
		extremesY.min -= Math.floor((dx * 3 / 4 - dy) / 2) - 1
		extremesY.max += Math.floor((dx * 3 / 4 - dy) / 2) + 2
	} else if (dx / dy < 1.2) {
		// Too height
		extremesX.min -= Math.floor((dy * 4 / 3 - dx) / 2) - 1
		extremesX.max += Math.floor((dy * 4 / 3 - dx) / 2) + 2
	}
	fraction_rationnelle.drawParameters = `axis,grid,tex,x=${extremesX.min}:${extremesX.max},y=${extremesY.min}:${extremesY.max}`

	// Draw code
	fraction_rationnelle.drawCode = study.drawCode()

	await nextTick()
	validation.value = true
}


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
			fx.value = genFx.fx
			generate_attempts.value = n
			return
		}

		n++
	}

	fx.value = genFx.fx
	alert("Aucune fonction intéressante générée...")
}

function getFxWithControls(maxValue: number) {
	let a: number, b: number, c: number, d: number, e: number, k: number, kd: number, kd2: number

	d = PiMath.Random.number(1, maxValue)
	k = PiMath.Random.numberSym(maxValue - d + 1, false)
	kd = d * k
	kd2 = d * d * k

	e = PiMath.Random.item(
		PiMath.Numeric.dividers(Math.abs(kd2)).filter(x => x >= Math.sqrt(kd2))
	) * (PiMath.Random.bool() ? 1 : -1)
	a = kd2 / e

	const kd_divider = PiMath.Random.item(PiMath.Numeric.dividers(Math.abs(kd))) * (PiMath.Random.bool() ? 1 : -1)
	b = PiMath.Random.numberSym(maxValue, false)
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

onMounted(() => {
	validation_fx()
})
</script>

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
			<form-maker
				v-model="fx"
				:focus="true"
				:input-class="'font-code'"
				autocomplete="off"
				label="Fraction rationnelle"
			/>

			<div class="flex gap-3 mt-3">
				<button
					class="btn btn-primary btn-xs"
					@click.prevent="validation_fx"
				>
					Valider
				</button>

				<button
					class="btn btn-primary btn-xs"
					@click.prevent="generate_fx"
				>
					générer {{ generate_attempts > 0 ? `(${generate_attempts})` : "" }}
				</button>
			</div>
		</form>

		<hr>

		<!-- Output -->
		<table-of-contents>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-20">
				<!-- Ensemble de définition -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Fonction
					</h2>
					<div
						v-katex.boxed="fraction_rationnelle.tex"
					/>
					<div class="font-code text-gray-300 text-sm text-center">
						{{ fraction_rationnelle.texDev }}
					</div>
				</div>

				<!-- Ensemble de définition -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Ensemble de définition
					</h2>
					<div
						v-katex.boxed="`ED_f=${fraction_rationnelle.domain}`"
					/>
				</div>

				<!-- Tableau de signes -->
				<div class="bg-white rounded border-gray-400 p-4">
					<h2 class="chapter-menu text-lg mb-10">
						Tableau de signes
					</h2>

					<table-of-signs
						v-if="fraction_rationnelle.tos"
						:tos="fraction_rationnelle.tos"
						class="px-10"
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
						v-katex.boxed="`${item.limits} \\implies \\text{ AV: } ${item.tex}`"
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
						<div v-katex.boxed="`${item.limits} \\implies \\text{ AH: } ${item.tex}`" />
						<div
							v-if="item.delta!==null"
							v-katex.boxed="`\\delta(x)=${item.deltaX.tex}=${item.deltaX.texFactors}`"
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
						<div v-katex.boxed.display="fraction_rationnelle.aoTex" />

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
						v-katex.boxed="fraction_rationnelle.dxTex"
					/>

					<table-of-signs
						v-if="fraction_rationnelle.dxtos"
						:tos="fraction_rationnelle.dxtos"
						class="px-10 mt-10"
					/>

					<div
						v-for="(zero, index) in fraction_rationnelle.extrema"
						:key="`zero-${index}`"
						v-katex.boxed="zero"
					/>
				</div>

				<!-- Graphe -->
				<div class="bg-white rounded border-gray-400 p-4 lg:col-span-2">
					<h2 class="chapter-menu text-lg mb-10">
						Représentation graphique
					</h2>

					<div>
						<pi-draw-parser
							v-if="fraction_rationnelle.drawCode!==false"
							:draw="{
								parameters: fraction_rationnelle.drawParameters,
								code: fraction_rationnelle.drawCode
									.replaceAll('*x', 'x')
									.replaceAll(')*', '->*')
							}"
							:height="600"
							:width="800"
							axis
							class="max-w-3xl mx-auto"
						/>

						<pre class="font-code text-xs max-w-lg mx-auto bg-gray-100 border p-2 mt-3 rounded">{{ fraction_rationnelle.drawCode.replaceAll("*x", "x")
							.replaceAll(')*', '->*') }}</pre>
					</div>
				</div>
			</div>
		</table-of-contents>
	</Panel>
</template>
