<script
	lang="ts"
	setup
>
import FormMaker from "@/Components/Form/FormMaker.vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import TableOfSigns from "@/Components/Pi/TableOfSigns.vue"

// TODO: reformat code, in particular the generateFX function
// TODO: rework UI to make it more user friendly.
/** Chapter
 * title: étude de fonction rationnelle
 * body: étude de signe d'une fonction rationnelle.
 */
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import TableOfContents from "@/Components/Ui/TableOfContents.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {type ETUDE_DE_FONCTION_RATIONNELLE, makeStudyFromPolynoms} from "@/Composables/useTos.ts"
import {Numeric, Random} from "pimath"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import Card from "@/Components/Ui/Card.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "numérateur",
		type: "text",
		value: ref("6x^3+36x^2-192"),
		fromUrl: "numerateur"
	},
	{
		label: "dénominateur",
		type: "text",
		value: ref("24x^2-96"),
		fromUrl: "denominator"
	}
])

// Value from the form.
const fx = computed(() => {
	if (forms[1].value.value) {
		return `(${forms[0].value.value})/(${forms[1].value.value})`
	} else {
		return forms[0].value.value
	}
})

// const autoUpdate = computed(()=>{
// 	return false // forms[1].value.value as boolean
// })
const autoUpdate = ref(false)

const generate_attempts = ref(0)
const study = computed<ETUDE_DE_FONCTION_RATIONNELLE | false>(() => {
	if (!autoUpdate.value) {
		return false
	}

	return makeStudyFromPolynoms(forms[0].value.value.toString(), forms[1].value.value.toString())
})

const drawParametersOverride = ref("")
const draw = computed<{ parameters: string, code: string }>(() => {
	if (study.value === false) {
		return null
	}

	return {
		parameters: drawParametersOverride.value === '' ? study.value.draw.parameters : drawParametersOverride.value,
		code: study.value.draw.code
	}
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
			forms[0].value.value = genFx.numerator
			forms[1].value.value = genFx.denominator
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
		numerator: `${a2}(x${b2})(x${c2})`,
		denominator: `${d2}x${e2}`,
		control: {
			slope,
			oao,
			ordonnee,
			trou,
			reduceable
		}
	}
}

const keyboardstudyAnswer = computed(() => {
	if (!study.value) {
		return ""
	}

	const arr: string[] = []

	arr.push(study.value.YIntercept.answer)

	study.value.roots.answers
		.forEach(zero => arr.push(zero))

	Object.values(study.value.asymptotes)
		.forEach(asymptotes => {
			asymptotes.map(asymptote => asymptote.answer).forEach(value => arr.push(value))
		})

	study.value.extremes
		.filter(extreme => extreme.answer)
		.forEach(extreme => arr.push(extreme.answer))

	if (study.value.environnement.answer) arr.push(study.value.environnement.answer)

	return [
		'Study',
		'trace',
		study.value.fxKeyboard,
		'',
		arr.join(',')
	].join('\n')
})

</script>

<template>
	<article>
		<!-- Value to modify enter -->
		<tool-form
			class="flex-1"
			:forms="forms"
			form-class="grid grid-cols-1 gap-3"
			generate-button
			@generate="generate_fx"
		>
			<div class="flex gap-3 mt-3 w-full justify-center">
				<sc-button
					type="primary"
					class="flex flex-col gap-3"
					@click="autoUpdate=true"
				>
					<div>
						étudier la fonction
					</div>
					<div v-katex.ascii="`f(x) = ${fx}`" />
				</sc-button>
			</div>
		</tool-form>

		<!-- Output -->
		<Card>
			<table-of-contents v-if="study!==false">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-20">
					<!-- Ensemble de définition -->
					<div class="bg-white rounded-sm border-gray-400 p-4">
						<h2 class="chapter-menu text-lg mb-10">
							Fonction
						</h2>
						<div v-katex.boxed="study.fx" />
					</div>

					<!--				Ensemble de définition-->
					<div class="bg-white rounded-sm border-gray-400 p-4">
						<h2 class="chapter-menu text-lg mb-10">
							Ensemble de définition
						</h2>
						<div v-katex.boxed="`ED_f=${study.domain}`" />
					</div>

					<!-- Tableau de signes -->
					<div class="bg-white rounded-sm border-gray-400 p-4">
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
					<div class="bg-white rounded-sm border-gray-400 p-4">
						<h2 class="chapter-menu text-lg mb-10">
							Racines de la fonction
						</h2>

						<div
							v-katex.boxed="study.roots.ed"
						/>
					</div>

					<!-- Asymptotes verticales et horizontales -->
					<div
						v-if="study.asymptotes.vertical.length > 0"
						class="bg-white rounded-sm border-gray-400 p-4"
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
						class="bg-white rounded-sm border-gray-400 p-4"
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
						class="bg-white rounded-sm border-gray-400 p-4"
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

					<div class="bg-white rounded-sm border-gray-400 p-4">
						<h2 class="chapter-menu text-lg mb-10">
							Variation
						</h2>
						<div v-katex.boxed="study.derivative.fx" />

						<table-of-signs
							:extremes="study.extremes.map(x=>x.tex)"
							:roots="study.derivative.table_of_signs.roots.map(x=>x.tex)"
							:signs="study.derivative.table_of_signs.signs"
							mode="grows"
						/>

						<h3 class="my-5">
							Coordonnées des points à tangentes horizontales
						</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
							<div
								v-for="(zero, index) in study.extremes.filter(x=>x.type!=='undefined')"
								:key="`zero-${index}`"
								v-katex.boxed="`\\text{${zero.type}}: \\left(${zero.x.tex};${zero.tex}\\right)`"
							/>
						</div>
					</div>

					<!-- Graphe -->
					<div class="bg-white rounded-sm border-gray-400 p-4 lg:col-span-2">
						<h2 class="chapter-menu text-lg mb-10">
							Représentation graphique
						</h2>

						<div>
							<pi-draw-parser
								:draw="draw"
								:height="600"
								:width="800"
								axis
								class="max-w-3xl mx-auto"
							/>

							<form-maker
								v-model="drawParametersOverride"
								sm
								code
							/>

							<tex-code :tex="study.draw.parameters" />
							<tex-code :tex="study.draw.code" />
							<div>
								KeyboardStudy answer code
								<pre>{{ keyboardstudyAnswer }}</pre>
							</div>
						</div>
					</div>
				</div>
			</table-of-contents>
		</Card>
	</article>
</template>
