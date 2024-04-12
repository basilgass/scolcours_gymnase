<script setup lang="ts">
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { computed, ref } from "vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

interface fnInterface {
	fx: string
	color: string
}

const fonctions = ref<fnInterface[]>([
	{
		fx: "3x+5",
		color: "blue"
	}
])
const fx = ref("")
const letters = "f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,a,b,c,d,e".split(',')
const colors = ["blue","red","green","orange","purple","magenta","cyan"]
const nextColor = computed(()=>{
	const usedColors = fonctions.value.map(f=>f.color)

	return colors.filter(color => !usedColors.includes(color))[0]
})
// Get the parameters from all functions.
const params = computed(()=>{
	let arr = []
	fonctions.value.forEach(f=>{
		arr = arr.concat([...f.fx.matchAll(/\$[a-z]/g)].map(e=>e[0]))
	})
	return arr
})
// Make the sliders
const sliders = computed(()=>{
	return params.value.map(p=>{
		return `${p}=-5,-4,...,5`
	}).join('\n')
})
// Generate the code
const code = computed(()=>{
	return sliders.value + '\n' + fonctions.value.map((f, index)=>{
		return `${letters[index]}(x)=${f.fx}->${f.color}`
	}).join('\n')
})
// Formatting the output
function formatFx(fx:string){
	return fx.replaceAll(/\$([a-z])/g, '$1')
}
// Add the new function
function addFunction(){
	fonctions.value.push({
		fx: fx.value,
		color: colors[fonctions.value.length]
	})
	fx.value = ""
}
</script>
<template>
	<article
		class="py-5 space-y-6"
	>
		<!--		<Head title="Grapheur" />-->
		<h1 class="text-3xl">
			Grapheur
		</h1>

		<div class="flex gap-3 items-start">
			<div class="bg-white py-3 pr-2 rounded border w-[250px]">
				<h2 class="text-lg">
					fonctions
				</h2>
				<div class="flex flex-col gap-2">
					<div
						class="pl-2 flex gap-2 items-center justify-between border-l-8"
						:style="`border-color: ${fx.color}`"
						v-for="(fx, index) in fonctions"
						:key="`fx-${index}`"
					>
						<div
							v-katex.ascii="`${letters[index]}(x)=${formatFx(fx.fx)}`"
						/>
						<i
							class="bi bi-trash cursor-pointer text-red-400/50"
							@click="fonctions.splice(index, 1)"
						/>
					</div>

					<form-maker
						class="pl-5 border-l-8"
						:style="`border-color: ${nextColor}`"
						v-model="fx"
						:label="`\\(${letters[fonctions.length]}(x)=\\)`"
						focus
						inline-label
						@enter="addFunction"
					/>
				</div>
				<button
					class="btn w-full btn-xs mt-5"
					@click="addFunction"
				>
					ajouter
				</button>
			</div>
			<div class="bg-white p-3 rounded-lg flex-1 border">
				<pi-draw-parser
					:draw="{
						parameters: 'axis,grid,x=-10:10,y=-10:10',
						code
					}"
				/>
			</div>
		</div>

		<div>
			<h2 class="text-lg">
				paramètres
			</h2>
		</div>

		<div class="text-xs max-w-md mx-auto">
			<h2>code généré</h2>
			<pre class="font-code bg-white">{{ code }}</pre>

			{{ params }}
		</div>
	</article>
</template>
