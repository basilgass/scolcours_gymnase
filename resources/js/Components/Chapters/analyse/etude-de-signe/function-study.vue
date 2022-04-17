<template>
	<div
		v-if="fraction_rationnelle.valid"
		ref="root"
		class="bg-white rounded border-gray-400 p-4"
	>
		<table-of-contents
			ref="toc"
			query=".chapter-menu"
			class="space-y-10 katex-boxed"
		>
			<div class=" grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-20">
				<!-- Ensemble de définition -->
				<div>
					<h2 class="chapter-menu text-lg mb-10">
						Fonction
					</h2>
					<div
						v-katex="`f(x)=${fraction_rationnelle.tex}=${fraction_rationnelle.texFactors}`"
						class="px-10"
					/>
				</div>

				<!-- Ensemble de définition -->
				<div>
					<h2 class="chapter-menu text-lg mb-10">
						Ensemble de définition
					</h2>
					<div
						v-katex="`ED_f=${fraction_rationnelle.domain}`"
						class="px-10"
					/>
				</div>

				<!-- Tableau de signes -->
				<div>
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
				<div>
					<h2 class="chapter-menu text-lg mb-10">
						Asymptotes verticales et horizontales
					</h2>

					<div
						v-for="(item, index) in fraction_rationnelle.av"
						:key="`limites-${index}`"
						v-katex="item"
						class="px-10"
					/>
				</div>

				<!-- Asymptotes obliques -->
				<div v-if="fraction_rationnelle.ao!==false">
					<h2 class="chapter-menu text-lg mb-10">
						Asymptotes obliques
					</h2>

					<div class="px-10">
						<div v-katex.display="fraction_rationnelle.ao.tex" />

						<table-of-signs
							v-if="fraction_rationnelle.ao.tos!==false"
							:tos="fraction_rationnelle.ao.tos"
						/>
					</div>
				</div>

				<div>
					<h2 class="chapter-menu text-lg mb-10">
						Variation
					</h2>
					<div
						v-katex="'f\'(x)='+fraction_rationnelle.dx"
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
				<div>
					<h2 class="chapter-menu text-lg mb-10">
						Représentation graphique
					</h2>

					<pi-draw-parser
						v-if="fraction_rationnelle.drawCode!==false"
						class="max-w-3xl mx-auto"
						axis
						:draw="{
							parameters: '-15,15,-15,15',
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
	fraction_rationnelle = reactive({
		valid: false,
		tex: "",
		texFactors: "",
		domain: "",
		tos: {
			tex: "",
			signs: [],
			factors: [],
			zeroes: []
		},
		av: [],
		ao: false,
		dxtos: {
			tex: "",
			signs: [],
			factors: [],
			zeroes: []
		},
		extrema: [],
		drawCode: false
	})

async function validation_fx(){
	fraction_rationnelle.valid = false

	if(props.fx===""){
		return false
	}
	let numerator, denominator
	const fxSplit = props.fx.split("/")
	try {
		numerator = new PiMath.Polynom(fxSplit[0])
	} catch (e) {
		console.log("Le numérateur n'est pas reconnue")
		return false
	}

	try {
		denominator = new PiMath.Polynom(fxSplit[1]?fxSplit[1]:1)
	}catch (e) {
		console.log("Le dénominateur n'est pas reconnu")
		return false
	}

	let FR = new PiMath.Rational(numerator, denominator)
	let FRdx
	if(denominator.isOne()){
		FRdx = new PiMath.Rational(numerator.clone().derivative(), "1")
	}else{
		FRdx = (new PiMath.Rational(numerator, denominator)).derivative()
	}

	fraction_rationnelle.tex = FR.tex
	fraction_rationnelle.texFactors = FR.texFactors
	fraction_rationnelle.domain = FR.domain()
	try {
		fraction_rationnelle.tos = FR.makeTableOfSigns()
	}catch{
		fraction_rationnelle.tos = false
	}

	fraction_rationnelle.av = limites(FR)
	fraction_rationnelle.ao = positionRelative(FR)
	fraction_rationnelle.dx = FRdx.numerator.texFactors
	try {
		fraction_rationnelle.dxtos = FRdx.makeTableOfSigns()

		// Get min and max values for the zeroes.
		fraction_rationnelle.extrema = FRdx.numerator.zeroes.map(x=> {
			if(x.exact===false) {
				return `\\left(${x.value.toFixed(2)}; ${ 0}\\right)`
			}else{
				return `\\left(${x.tex};${0})\\right)`
			}
		})
	}catch{
		fraction_rationnelle.dxtos = false
	}

	fraction_rationnelle.drawCode = generateDrawCode(FR, FRdx)


	await nextTick()
	fraction_rationnelle.valid = true
}


function limites(FR){
	const limits = []

	const zeroes = FR.denominator.getZeroes().filter(x=>!isNaN(x.value))

	// Asymptotes verticales
	if(zeroes.length>0){
		zeroes.forEach(z => {
			let L1, L2, valueToTest = z.exact === false ? z.value : z.exact

			L1 = FR.limits(valueToTest, "above")
			L2 = FR.limits(valueToTest, "below")

			if (L1.isInfinity() && L2.isInfinity()) {
				let pm

				if (L1.isPositive()) {
					if (L2.isPositive()) {
						pm = "+"
					} else {
						pm = "\\pm"
					}
				} else {
					if (L2.isPositive()) {
						pm = "\\mp"
					} else {
						pm = "-"
					}
				}

				limits.push(
					`\\displaystyle \\lim_{x \\to ${z.tex} }\\ f(x) = ${pm}\\infty \\implies \\text{AV: }x=${z.tex}`
				)
			}
			else if(L1.isEqual(L2)){
				limits.push(
					`\\displaystyle \\lim_{x \\to ${z.tex} }\\ f(x) = ${L1.tex} \\implies \\text{trou: }\\left(${z.tex};${L1.tex}\\right)`
				)
			}
			else {
				// Values are different - show both
				limits.push(
					`\\displaystyle \\lim_{x \\underset{>}{\\to} ${z.tex} }\\ f(x) = ${L1.tex} \\implies ${L1.isInfinity() ? "\\text{AV: }x=" + z.tex : "\\text{Trou: }(" + z.tex + ";" + L1.tex + ")"}`
				)

				limits.push(
					`\\displaystyle \\lim_{x\\underset{<}{\\to} ${z.tex} }\\ f(x) = ${L2.tex} \\implies ${L2.isInfinity() ? "\\text{AV: }x=" + z.tex : "\\text{Trou: }(" + z.tex + ";" + L2.tex + ")"}`
				)
			}
		})
	}

	// Asymptotes horizontales
	let Lmax = FR.limits(Infinity),
		Lmin = FR.limits(-Infinity)

	if(Lmax.isFinite()){
		if(Lmax.isEqual(Lmin)){
			limits.push(
				`\\displaystyle \\lim_{x \\to \\infty }\\ f(x) = ${Lmax.tex} \\implies \\text{AH: }y=${Lmax.tex}`
			)
		}else{
			limits.push(
				`\\displaystyle \\lim_{x \\to +\\infty }\\ f(x) = ${Lmax.tex} \\implies \\text{AH: }y=${Lmax.tex}`
			)
		}
	}
	if(Lmin.isFinite() && Lmin.isNotEqual(Lmax)){
		limits.push(
			`\\displaystyle \\lim_{x \\to -\\infty }\\ f(x) = ${Lmax.tex} \\implies \\text{AH: }y=${Lmax.tex}`
		)
	}
	return limits
}

function positionRelative(FR){
	let positionRelative,
		numerator = FR.numerator,
		denominator = FR.denominator


	if(numerator.degree().isEqual(denominator.degree().clone().add(1))) {
		let {quotient, reminder} = FR.numerator.clone().euclidian(FR.denominator),
			deltaX = new PiMath.Rational(reminder, FR.denominator)

		positionRelative = {
			quotient, reminder,
			tex: `f(x) = ${quotient.tex} + \\frac{ ${reminder.tex} }{ ${FR.denominator.tex} }\\implies \\text{AO: } y = ${quotient.tex}`,
			tos: deltaX.makeTableOfSigns()
		}
		return positionRelative
	}else{
		return false
	}
}

function generateDrawCode(FR, FRdx){
	// Function as string
	let code =`f(x)=${FR.plotFunction}`

	// AV
	// TODO: a améliorer (optimisation car répétitions !
	let zeroes = FR.denominator.getZeroes().filter(x=>!isNaN(x.value))
	if(zeroes.length>0){
		let i = 0
		zeroes.forEach(z => {
			let L, valueToTest = z.exact===false?z.value:z.exact

			L = FR.limits(valueToTest, "above")
			if(L.isInfinity){
				code += `\nav_${i}=line x=${z.value}->red,dash`
				i++
			}else{
				L = FR.limits(valueToTest, "below")
				if(L.isInfinity){
					code += `\nav_${i}=line x=${z.value}->red,dash`
					i++
				}
			}
		})
	}

	// AH
	let Lmax = FR.limits(Infinity),
		Lmin = FR.limits(-Infinity)
	if(Lmax.isFinite()){
		code += `\nah=line y=${Lmax.value}->orange,dash`
	}
	if(Lmin.isFinite() && Lmin.isNotEqual(Lmax)){
		code += `\nah=line y=${Lmax.value}->orange,dash`
	}

	// AO
	if(fraction_rationnelle.ao!==false){
		code += `\nao=line y=${fraction_rationnelle.ao.quotient.plotFunction}->red,dash`
	}

	// MIN & MAX
	// TODO: Handle min / max value
	zeroes = FRdx.numerator.getZeroes()
	if(zeroes.length>0){
		let i = 0
		zeroes.forEach(z => {
			let exp = new PiMath.NumExp(FR.plotFunction)

			code += `\nM_${i}(${z.value},${exp.evaluate({x: z.value})})*`
			i++
		})
	}

	// ZEROES
	zeroes = FR.numerator.getZeroes()
	if(zeroes.length>0){
		let i = 0
		zeroes.forEach(z => {
			code += `\nZ_${i}(${z.value},0)*`
			i++
		})
	}

	return code
}

let fxwatch = toRef(props, "fx")
watch(fxwatch, ()=>{
	validation_fx()
})

onMounted(()=>{
	validation_fx()
})
</script>
