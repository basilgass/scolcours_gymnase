<script lang="ts" setup>
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, ref, watch} from "vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"
import GrapheurFunction from "@/Components/Grapheur/GrapheurFunction.vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutMain})

export type fnStyle = 'plain' | 'dot' | 'dash'

export interface fnInterface {
	name: string
	fx: string
	type: "x" | "t"
	color: string
	style: fnStyle
	width?: number
	samples?: number
	domain?: string
	isNew?: boolean
}

const fonctions = ref<fnInterface[]>([
	{
		name: "f",
		type: "x",
		fx: "3x+5",
		color: "blue",
		style: 'plain'
	}
])

// Current function
const fx = ref("")
const letters = "f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,a,b,c,d,e".split(",")

// const colors = ["blue", "red", "green", "orange", "purple", "magenta", "cyan"]
const colors = ["#0000FF", "#FF0000", "#008000", "#FFA500", "#800080", "#FF00FF", "#00FFFF"]


const drawParams = ref("axis,grid,x=-10:10,y=-10:10")

// Get the parameters from all functions.
const params = computed(() => {
	let arr = []
	fonctions.value.forEach(f => {
		arr = arr.concat([...f.fx.matchAll(/\$[a-z]/g)].map(e => e[0]))
	})
	return arr
})

watch(params, (newParams) => {
	paramsValues.value = newParams.map(p => {
		return {
			key: p,
			value: "-5,-4,...,5/0.1=1"
		}
	})
})
const paramsValues = ref<{ key: string, value: string }[]>([])

// Make the sliders
const sliders = computed(() => {
	if (paramsValues.value.length === 0) return ""

	// Merge the parameters with their corresponding values.
	return paramsValues.value.map(p => {
		return `${p.key}=${p.value}`
	}).join("\n") + "\n"
})

// Generate the code
const code = computed(() => {
	return sliders.value +
		fonctions.value.map((f, index) => {
			let config = [f.fx]

			// Samples if given
			if (f.samples) {
				config.push(`${f.samples}`)
			}

			// Domain if given
			if (f.domain) {
				const [a, b] = f.domain.split(":")
				if (b) {
					config.push(`${a}:${b}`)
				} else {
					config.push(`${a}:`)
				}
			}

			let style: string[] = []

			// Color
			style.push(`color=${f.color}`)

			if (f.style !== 'plain') {
				style.push(`${f.style}`)
			}

			if(f.width){
				style.push(`w=${f.width}`)
			}

			return `${letters[index]}(${f.type})=${config.join(",")}->${style.join(',')}`
		}).join("\n")
})

// Add the new function
function addFunction(type: "x" | "t" = "x") {
	fonctions.value.push({
		name: letters[fonctions.value.length],
		fx: fx.value,
		type,
		color: colors[fonctions.value.length],
		style: 'plain',
		isNew: true
	})
	fx.value = ""
}

</script>
<template>
	<section
		class="scolcours-container"
	>
		<!--		<Head title="Grapheur" />-->
		<h1 class="text-3xl my-4">
			Grapheur
		</h1>

		<div class="flex gap-3 items-start">
			<div>
				<div class="w-[300px] flex flex-col gap-3">
					<GrapheurFunction
						v-for="(fx, index) in fonctions"
						:key="`fx-${index}`"
						v-model="fonctions[index]"
						@destroy="fonctions.splice(index, 1)"
					/>

					<div class="grid grid-cols-2 gap-4 place-items-center">
						<sc-button
							v-katex="`f(x)`"
							class="w-full"
							@click=" addFunction('x')"
						/>
						<sc-button
							v-katex="`f(t)`"
							class="w-full"
							@click=" addFunction('t')"
						/>
					</div>

					<div
						v-if="params.length>0"
						class="bg-white p-3 rounded-sm border w-[350px] flex flex-col gap-3"
					>
						<div>
							<h2 class="font-extralight text-lg">
								variables
							</h2>
							<div class="text-xs font-code">
								a,a+1,...,b/pas=par défaut
							</div>
						</div>
						<form-maker
							v-for="(param, index) in paramsValues"
							:key="`parameter-${index}`"
							v-model="param.value"
							:label="`${param.key} = `"
							inline-label
							label-class="w-10"
						/>
					</div>
				</div>
			</div>
			<div class="flex-1 flex flex-col gap-3">
				<pi-draw-parser
					:draw="{
						parameters: drawParams,
						code
					}"
					class="bg-white dark:bg-slate-600 p-3 rounded-lg border"
				/>

				<form-maker
					v-model="drawParams"
					font-code
					label="paramètres"
				/>

				<div class="text-xs">
					<h2>code généré</h2>
					<pre class="font-code mt-1 border border-slate-300 dark:border-slate-600 rounded-sm p-2">{{ code }}</pre>
				</div>
			</div>
		</div>
	</section>
</template>
