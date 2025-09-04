<script setup lang="ts">
/** Tools
 * title: vecteurs
 * body: calculs avec des vecteurs
 * parameters: v1, v2
 * tags: geometrie,1M,2M,3M
 */
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {numberCorrection} from "@/helpers/helperFunctions.ts"
import {Matrix, Vector} from "pimath"
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import PiThreeParser from "@/Components/Pi/PiThreeParser.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "Vecteur 1",
		type: "vector",
		value: ref(""),
		fromUrl: "v1"
	},
	{
		label: "Vecteur 2",
		type: "vector",
		value: ref(""),
		fromUrl: "v2"
	},
	{
		label: "Vecteur 3",
		type: "vector",
		value: ref(""),
		fromUrl: "v3"
	}
])

const v1 = computed(() => forms[0].value.value as string)
const v2 = computed(() => forms[1].value.value as string)
const v3 = computed(() => forms[2].value.value as string)

const pV1 = computed<Vector>(() => {
	try {
		return new Vector(v1.value)
	} catch {
		return null
	}
})
const pV2 = computed<Vector>(() => {
	try {
		return new Vector(v2.value)
	} catch {
		return null
	}
})
const pV3 = computed<Vector>(() => {
	try {
		return new Vector(v3.value)
	} catch {
		return null
	}
})

const vectors = computed(() => {
	// Get the list of the vectors, remove the empty ones
	return [pV1.value, pV2.value, pV3.value].filter(v => v !== null && v.isNull === false)
})

let result = computed(() => {
	if (vectors.value.length === 0) return "il faut au moins un vecteur"

	const dim = vectors.value[0].dimension
	if (vectors.value.some(v => v.dimension !== dim)) return "tous les vecteurs doivent être de même dimension"

	return true
})

const matrix = computed(() => {
	if (vectors.value.length === 2 && vectors.value.every(v => v.dimension === 2)) {
		return new Matrix().fromVectors(...vectors.value)
	}

	if (vectors.value.length === 3 && vectors.value.every(v => v.dimension === 3)) {
		return new Matrix().fromVectors(...vectors.value)
	}

	return null
})

const v1TeX = `\\overrightarrow{v_1}`
const v2TeX = `\\overrightarrow{v_2}`
const v3TeX = `\\overrightarrow{v_3}`

const dimension = computed(() => {
	if (vectors.value.length === 0) {
		return 0
	}
	const dim = vectors.value[0].dimension
	if (vectors.value.some(v => v.dimension !== dim)) {
		return 0
	}

	return dim
})
const draw2D = computed<WidgetPropsInterface>(() => {
	if (dimension.value !== 2) {
		return null
	}

	const minX = Math.ceil(Math.min(0, ...vectors.value.map(v => v.x.value))) - 1
	const maxX = Math.ceil(Math.max(5, ...vectors.value.map(v => v.x.value)))
	const minY = Math.ceil(Math.min(0, ...vectors.value.map(v => v.y.value))) - 1
	const maxY = Math.ceil(Math.max(5, ...vectors.value.map(v => v.y.value)))
	const alpha = 'ABC'

	return {
		parameters: `axis,grid,x=${minX}:${maxX},y=${minY}:${maxY}`,
		code: [
			`O(0,0)`,
			...vectors.value.map((v, index) => {
				return `${alpha[index]}(${v.x.value},${v.y.value})->!`
			}),
			...vectors.value.map((v, index) => {
				return `${alpha[index].toLowerCase()}=vO${alpha[index]}`
			}),
		].join('\n')
	}
})

const draw3D = computed<WidgetPropsInterface>(() => {
	if (dimension.value !== 3) {
		return null
	}

	const alpha = 'ABC'
	return {
		parameters: `grid,axis`,
		code: [
			`O(0,0,0)`,
			...vectors.value.map((v, index) => {
				return `${alpha[index]}(${v.x.value},${v.y.value},${v.y.value})->!`
			}),
			...vectors.value.map((v, index) => {
				return `${alpha[index].toLowerCase()}=vO${alpha[index]}`
			}),
		].join('\n')
	}
})


</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card
			v-if="result"
			class="katex-boxed "
		>
			<div
				class="grid gap-3"
				:class="{
					'grid-cols-2': vectors.length<3,
					'grid-cols-3': vectors.length===3
				}"
			>
				<div
					v-if="pV1"
					v-katex="`${v1TeX} = ${pV1.tex}`"
				/>
				<div
					v-if="pV2"
					v-katex="`${v2TeX} = ${pV2.tex}`"
				/>
				<div
					v-if="pV3"
					v-katex="`${v3TeX} = ${pV3.tex}`"
				/>
			</div>

			<h3 class="font-extralight text-xl">
				normes
			</h3>
			<div
				v-if="vectors.length >= 1"
				class="grid gap-3"
				:class="{
					'grid-cols-2': vectors.length<3,
					'grid-cols-3': vectors.length===3
				}"
			>
				<div
					v-if="pV1"
					v-katex="`\\Vert${v1TeX}\\Vert=\\sqrt{${pV1.normSquare.tex}}=${numberCorrection(pV1.norm)}`"
				/>
				<div
					v-if="pV2"
					v-katex="`\\Vert${v2TeX}\\Vert=\\sqrt{${pV2.normSquare.tex}}=${numberCorrection(pV2.norm)}`"
				/>
				<div
					v-if="pV3"
					v-katex="`\\Vert${v3TeX}\\Vert=\\sqrt{${pV3.normSquare.tex}}=${numberCorrection(pV3.norm)}`"
				/>
			</div>


			<h3 class="font-extralight text-xl">
				produit scalaire
			</h3>
			<div
				v-if="vectors.length >= 2"
				class="grid gap-3"
				:class="{
					'grid-cols-2': vectors.length<3,
					'grid-cols-3': vectors.length===3
				}"
			>
				<div
					v-if="pV1 && pV2"
					v-katex="`${v1TeX} \\cdot ${v2TeX} = ${pV1.tex} \\cdot ${pV2.tex} = ${pV1.dot(pV2).tex}`"
				/>
				<div
					v-if="pV1 && pV3"
					v-katex="`${v1TeX} \\cdot ${v3TeX} = ${pV1.tex} \\cdot ${pV3.tex} = ${pV1.dot(pV3).tex}`"
				/>
				<div
					v-if="pV2 && pV3"
					v-katex="`${v2TeX} \\cdot ${v3TeX} = ${pV2.tex} \\cdot ${pV3.tex} = ${pV2.dot(pV3).tex}`"
				/>
			</div>
			<div
				class="py-1 px-3 bg-red-100 border border-red-300 rounded-sm"
				v-else
			>
				il faut deux vecteurs !
			</div>

			<h3 class="font-extralight text-xl">
				déterminant
			</h3>
			<div
				v-if="matrix"
				class="grid grid-cols-2 gap-3"
			>
				<div v-katex="`\\det${matrix.tex} = ${matrix.determinant().tex}`" />
			</div>
			<div
				class="py-1 px-3 bg-red-100 border border-red-300 rounded-sm"
				v-else
			>
				il faut deux vecteurs de dimensions 2 ou 3 vecteurs de dimensions 3
			</div>

			<h3 class="font-extralight text-xl">
				angle
			</h3>
			<div
				v-if="vectors.length >= 2"
				class="grid gap-3"
				:class="{
					'grid-cols-2': vectors.length<3,
					'grid-cols-3': vectors.length===3
				}"
			>
				<div
					v-if="pV1 && pV2"
					v-katex="`\\angle \\left(${v1TeX} ; ${v2TeX} \\right)  = ${+pV1.angle(pV2).toFixed(2)}`"
				/>
				<div
					v-if="pV1 && pV3"
					v-katex="`\\angle \\left(${v1TeX} ; ${v3TeX} \\right)  = ${+pV1.angle(pV3).toFixed(2)}`"
				/>
				<div
					v-if="pV2 && pV3"
					v-katex="`\\angle \\left(${v2TeX} ; ${v3TeX} \\right)  = ${+pV2.angle(pV3).toFixed(2)}`"
				/>
			</div>
			<div
				class="py-1 px-3 bg-red-100 border border-red-300 rounded-sm"
				v-else
			>
				il faut deux vecteurs
			</div>

			<div class="mt-5 max-w-lg mx-auto">
				<pi-draw-parser
					v-if="dimension===2"
					:draw="draw2D"
				/>
				<pi-three-parser
					v-if="dimension===3"
					:draw="draw3D"
				/>
				{{ draw3D }}
			</div>
		</Card>
		<tool-error v-else />
	</article>
</template>
