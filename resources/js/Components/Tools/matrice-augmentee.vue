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
import {Matrix, Random, Vector} from "pimath"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import instructions from "./Parts/matrice-augmentee-instructions.md?raw"
import ScButton from "@/Components/Ui/scButton.vue"

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
			return (droite[index] !== undefined && droite[index] !== '') ?
				`${line}|${droite[index]}` :
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

function genererMatrice() {
	const dim = 3
	const answer: number[] = Array(dim).fill(0).map(() => Random.numberSym(5))

	const matrix: number[][] =
		Array(dim)
			.fill(0).map(() =>
			Array(dim).fill(0).map(() => Random.numberSym(9))
		)

	const M = new Matrix(...matrix.map((line) => new Vector(...line)))

	if (M.determinant().value === 0) {
		return genererMatrice()
	}

	// add the answer to the matrix
	matrix.forEach((line) => {
		// calculate the dot product of the line and the answer
		const dot = line.reduce((acc, value, col) => acc + value * answer[col], 0)

		return line.push(dot)
	})

	forms[0].value.value = matrix.map(line => line.slice(0, -1).join(' ')).join('\n')
	forms[1].value.value = matrix.map(line => line.slice(-1)[0]).join('\n')
}

const showInstruction = ref(false)

</script>

<template>
	<article>
		<tool-form
			:forms="forms"
			form-class="max-w-xl mx-auto grid grid-cols-2 gap-3"
			:rows="6"
			generate-button
			@generate="genererMatrice"
		/>

		<div
			v-if="result"
			class="my-10"
		>
			<matrice-augmentee
				:illustration="result"
			/>

			<div>
				<div
					class="flex gap-3 justify-end cursor-pointer"
					@click="showInstruction=!showInstruction"
				>
					<sc-button
						:icon="showInstruction ? 'bi bi-x-lg' : 'bi-eye'"
						:active="showInstruction"
						xs
					>
						instructions
					</sc-button>
				</div>

				<markdown-it
					v-show="showInstruction"
					:text="instructions"
				/>
			</div>
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
