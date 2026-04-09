<script setup lang="ts">

import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import {PiDraw} from "pidraw"

const code = ref(``)
const parameters = ref("grid,axis")

const draw = computed(() => {
	return {
		code: code.value,
		parameters: parameters.value
	}
})

function addElement(event: {draw: PiDraw, mouse: MouseEvent}) {
	const {draw, mouse} = event
	console.log(mouse.offsetX, mouse.offsetY)

	console.log(draw.figures)
	console.log(draw.rootSVG.viewbox())

}
</script>

<template>
	<article>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
			<Card>
				<FormInput
					xs
					type="text"
					label="paramètres"
					v-model="parameters"
				/>

				<FormTextarea
					xs
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
					@draw-click="addElement"
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
							<div>{{ doc.parameters.length > 0 ? doc.parameters.join(', ') : '' }}</div>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</article>
</template>

<style scoped>

</style>
