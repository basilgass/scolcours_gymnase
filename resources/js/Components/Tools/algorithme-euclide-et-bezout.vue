<script lang="ts" setup>
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
/** Tools
 * title: algorithme d'Euclide et théorème de Bézout
 * body: ...
 * parameters: a=nombre, b=nombre
 * tags: arithmetiques,3C
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"
import AlgorithmeEuclide from "@/Components/Widgets/arithmetique/algorithme-euclide.vue"
import AlgorithmeBezout from "@/Components/Widgets/arithmetique/algorithme-bezout.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "a",
		type: "number",
		value: ref(17),
		fromUrl: "a"
	},
	{
		label: "b",
		type: "text",
		value: ref(23),
		fromUrl: "b"
	}
])

const A = computed(() => +forms[0].value.value as number)
const B = computed(() => +forms[1].value.value as number)

const result = computed<boolean>(() => {

	if (A.value <= 1 || B.value <= 1) return false
	if (!Number.isSafeInteger(A.value)) return false
	if (!Number.isSafeInteger(B.value)) return false

	return true
	
})
</script>

<template>
	<article>
		<tool-form
			:forms="forms"
			form-class="grid grid-cols-1 md:grid-cols-3 gap-3"
		/>

		<Card v-if="result">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div>
					<h3 class="font-semibold text-lg">
						algorithme d'Euclide
					</h3>
					<algorithme-euclide
						:illustration="{parameters: '', code: `${A},${B}`}"
					/>
				</div>

				<div>
					<h3 class="font-semibold text-lg">
						algorithme de Bézout
					</h3>
					<algorithme-bezout
						:illustration="{parameters: '', code: `${A},${B}`}"
					/>
				</div>
			</div>
		</Card>
		<tool-error v-else />
	</article>
</template>
