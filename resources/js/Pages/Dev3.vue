<template>
	<!-- Title -->
	<div ref="root">
		<form-input
			v-model="circle"
			label="Cercle"
			name="circle"
			@keyup.enter="updateValue"
		/>
		<pi-draw-parser
			:draw="{
				parameters: '-18,18,-18,18',
				code: code
			}"
			class="max-w-[800px] mx-auto border rounded bg-white"
		/>
		<div
			v-for="(item, index) in tangentPerPoints"
			:key="'tangent-'+index"
		>
			<div v-katex.left="item" />
		</div>
		<div
			v-for="(item,index) in intersectionPoints"
			:key="'item-'+index"
		>
			<div v-katex.left="`${item.tangent1} \\cap ${item.tangent2} \\implies P${item.point}`" />
		</div>
	</div>
</template>
<script>
import LayoutMain from "@/Pages/Shared/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {onMounted, ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput"

let root = ref(null),
	code = ref(""),
	intersectionPoints = ref([]),
	tangentPerPoints = ref([]),
	circle = ref("(x-3)^2+(y+2)^2=13")

function updateValue(){
	intersectionPoints.value = []
	tangentPerPoints.value = []

	const C = new PiMath.Geometry.Circle(circle.value),
		pts = C.getPointsOnCircle()

	code.value = `C(${C.center.x.value},${C.center.y.value})
	c=circ C,${C.radius.value}`

	let tangents = []
	pts.forEach((pt, index) => {
		let tg = C.tangents(pt)[0]
		tangents.push(tg)
		code.value += `\nT${index + 1}@(${pt.x.value},${pt.y.value})*`
		code.value += `\nt${index + 1}=line ${tg.tex.canonical}`

		tangentPerPoints.value.push(`T(${pt.x.tex};${pt.y.tex})\\implies ${tg.tex.canonical}`)
	})

	for (let i = 0; i < tangents.length; i++) {
		for (let j = i + 1; j < tangents.length; j++) {
			let intersection = tangents[i].intersection(tangents[j])

			if (intersection.hasIntersection) {
				if (!intersection.point.isInListOfPoints(pts)) {
					pts.push(intersection.point)
					intersectionPoints.value.push({
						point: intersection.point.tex,
						tangent1: tangents[i].tex.canonical,
						tangent2: tangents[j].tex.canonical
					})
					code.value += `\nI_${i + 1}_${j + 1}(${intersection.point.x.value},${intersection.point.y.value})*`
				}
			}
		}
	}

}
onMounted(() => {
	updateValue()
	// console.log(root.value)
	// katexAutoRender(root.value)
})

</script>

