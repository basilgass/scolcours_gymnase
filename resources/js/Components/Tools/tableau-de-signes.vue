<script lang="ts" setup>
import PiTableOfSigns from "@/Components/Pi/PiTableOfSigns.vue"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
/** Chapter
 * title: tableau de signes ou de variations
 * body: tableau de signes ou de variations
 */
import { computed, ref } from "vue"

const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "fonction",
		type: "text",
		value: ref("x^2-5x+6"),
		fromUrl: "fx"
	},
	{
		label: "signes,variations",
		type: "switch",
		value: ref(true),
		fromUrl: "mode",
		emit: true
	}
])

const fx = computed(() => forms[0].value.value as string)
const mode = computed(() => forms[1].value.value as boolean ? "signs" : "grows")

const fxTex = ref('')
const dxTex = ref('')
const ddxTex = ref('')
function TOS_update(value){
	fxTex.value = value.fx
	dxTex.value = value.dx
	ddxTex.value = value.ddx
}
</script>

<template>
	<article
		ref="root"
	>
		<!-- Value to modify enter -->
		<tool-form
			:forms="forms"
			form-class="grid grid-cols-1 gap-3"
		/>

		<!-- Tableau de signes -->
		<div class="bg-white rounded border-gray-400 p-4">
			<h2 class="chapter-menu text-lg mb-10">
				{{ mode==='signs' ? "Tableau de signes" : mode==="grows" ? "Tableau de croissance" : "Tableau de courbure" }}
			</h2>

			<div
				class="grid grid-cols-1 gap-3"
				:class="mode!=='signs'?'md:grid-cols-2':''"
			>
				<div v-katex="`f(x) = ${fxTex}`" />
				<div
					v-if="mode!=='signs'"
					v-katex="`f'(x) = ${dxTex}`"
				/>
			</div>

			<pi-table-of-signs
				:fx="fx"
				:mode="mode"
				:tex-output="true"
				class="px-10"
				@update="TOS_update"
			/>
		</div>
	</article>
</template>
