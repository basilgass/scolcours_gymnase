<script setup lang="ts">

import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, provide, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import {PiDraw} from "pidraw"

provide('blockScript', {
	data: {
		b: -1
	}
})


const code = ref(`$a=-5,-4,...,5/0.1=3
%T1
d=AB

%title 4 \\(\\sin(\\alpha)\\)
c=circ A,3

%-FG-
A($a,1)
B(2,$b)->label`)
const parameters = ref("")

const draw = computed(()=>{
	return {
		code: code.value,
		parameters: parameters.value
	}
})
</script>

<template>
	<article>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
			<Card>
				<form-maker
					xs
					type="text"
					label="paramètres"
					v-model="parameters"
				/>

				<form-maker
					xs
					type="textarea"
					label="code"
					v-model="code"
					rows="15"
				/>
			</Card>
			<div class="col-span-2">
				<pi-draw-parser
					:draw="draw"
					class="bg-white w-full"
					theme="geometrie"
				/>
			</div>
		</div>

		<div>
			<pre
				class="font-code text-xs"
				v-html="parameters"
			/>
		</div>
		<div>
			<h2 class="text-xl my-5 font-semibold">
				Données
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
				<Card
					v-for="(doc, key) in PiDraw.documentation()"
					:key="key"
				>
					<template #header>
						<div class="flex justify-between items-baseline">
							<div>{{ doc.name }}</div>
							<div class="font-code text-xs">
								{{ key }}
							</div>
						</div>
					</template>
					<div>{{ doc.description }}</div>
					<template #footer>
						<div class="font-code text-xs pb-2">
							<div>{{ doc.code }}</div>
							<div>{{ doc.parameters.length>0 ? doc.parameters.join(', '): '' }}</div>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</article>
</template>

<style scoped>

</style>
