<script setup lang="ts">
import FormMaker from "@/Components/Form/FormMaker.vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {Circle} from "pimath"
import {onMounted, ref} from "vue"

defineOptions({layout: LayoutMain})

const root = ref(null),
	code = ref(""),
	intersectionPoints = ref([]),
	tangentPerPoints = ref([]),
	circle = ref("(x-3)^2+(y+1)^2=13")

function updateValue() {
	intersectionPoints.value = []
	tangentPerPoints.value = []

	const C = new Circle(circle.value),
		pts = C.getPointsOnCircle()


	code.value = `C(${C.center.x.value},${C.center.y.value})
	c=circ C,${C.radius.value}`

	const tangents = []
	pts.forEach((pt, index) => {
		const tg = C.tangents(pt)[0]
		tangents.push(tg)
		code.value += `\nT${index + 1}(${pt.x.value},${pt.y.value})->tex:T_${index + 1}=@`
		code.value += `\nt${index + 1}=line ${tg.canonical.tex}`

		tangentPerPoints.value.push(`T_${index + 1}(${pt.x.tex};${pt.y.tex})\\implies ${tg.canonical.tex}`)
	})

	for (let i = 0; i < tangents.length; i++) {
		for (let j = i + 1; j < tangents.length; j++) {
			const intersection = tangents[i].intersection(tangents[j])

			if (intersection.hasIntersection) {
				// if (!intersection.point.isInListOfPoints(pts)) {
				intersection.point.name = `I_{${i + 1}-${j + 1}}`
				intersection.point.asPoint = true
				intersectionPoints.value.push({
					point: `I_{${i + 1}-${j + 1}}${intersection.point.tex}`,
					tangent1: tangents[i].canonical.tex,
					tangent2: tangents[j].canonical.tex
				})
				code.value += `\nI_${i + 1}_${j + 1}(${intersection.point.x.value},${intersection.point.y.value})->tex:I_{${i + 1}-${i + 2}}=@`
			}
			// }
		}
	}
}

onMounted(() => {
	updateValue()
})

</script>
<template>
	<!-- Title -->
	<div ref="root">
		<form-maker
			v-model="circle"
			label="Cercle"
			name="circle"
			@keyup.enter="updateValue"
		/>
		<div class="flex items-start">
			<div>
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
					<div v-katex.left="`${item.tangent1} \\cap ${item.tangent2} \\implies ${item.point}`" />
				</div>
			</div>
			<pi-draw-parser
				:draw="{
					parameters: 'x=-10:10,y=-10:10,axis,grid',
					code: code
				}"
				class="flex-1 max-w-full mx-auto border rounded-sm bg-white"
			/>
		</div>
	</div>
</template>

