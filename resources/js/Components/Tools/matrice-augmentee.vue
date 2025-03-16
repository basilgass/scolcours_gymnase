<script setup lang="ts">/** Tools
 * title : matrice augmentée
 * body : échelonnage et réduction de matrice
 * parameters : values...
 * tags : analyse,3MR
 */

import {computed, ref} from "vue"
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import MatriceAugmentee from "@/Components/Widgets/algebre/matrice-augmentee.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "matrice",
		type: "textarea",
		value: ref(`2 1 -1
1 2 1
3 -1 2`),
		fromUrl: "matrix",
	},
	{
		label: "droite",
		type: "textarea",
		value: ref(`1
8
7`),
		fromUrl: "droite"
	}
])


const result = computed(() => {
	try {
		const matrix = (forms[0].value.value as string)
			.split('\n')

		const droite = (forms[1].value.value as string)
			.split('\n')

		const code = matrix.map((line, index) => {
			return (droite[index]!==undefined && droite[index]!=='')?
				`${line}|${droite[index]}`:
				line
		}).join('\n')

		return {
			code,
			parameters: ""
		}
	} catch (e) {
		console.error(e)
		return false
	}
})

</script>

<template>
	<article>
		<tool-form
			:forms="forms"
			form-class="max-w-xl mx-auto grid grid-cols-2 gap-3"
			:rows="6"
		/>

		<div
			v-if="result"
			class="my-10"
		>
			<matrice-augmentee
				:illustration="result"
			/>
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</article>
</template>

<style scoped>

</style>
