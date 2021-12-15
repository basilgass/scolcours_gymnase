<template>
	<Panel>
		<form-input
				v-model="A"
				label="Point A"
				name="A"
			/>

		<form-input
				v-model="B"
				:label="B[0]==='v'?'Vecteur directeur':'Point B'"
				name="B"
			>
			Utiliser <code class="px-2 bg-gray-200">a,b</code> pour les coordonnées d'un point ou <code class="px-2 bg-gray-200">va,b</code> pour un vecteur directeur
		</form-input>

		<div v-katex="`${affine.tex.mxh}`" />
		<div v-katex="`${affine.tex.canonical}`" />
	</Panel>
</template>

<script setup>
/** Tools
 * title: affine
 * body: calcul d'une fonction affine par deux points
 * parameters: a=Point, b=Point
 * tags: algebre,1M
 */
import Panel from '@/Components/Ui/Panel'
import FormInput from '@/Components/Form/FormInput'
import { computed, ref } from 'vue'
import { Line } from 'pimath/esm/maths/geometry/line'
import { Point } from 'pimath/esm/maths/geometry/point'
import { Vector } from 'pimath/esm/maths/geometry/vector'

let A = ref('3,4'),
	B = ref('1,2')

let affine = computed(()=>{
	return new Line(
		new Point(A.value),
		B.value[0]==='v'?new Vector(B.value.substring(1)):new Point(B.value)
	)
})
</script>
