<script setup lang="ts">
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"

/** Tools
 * title: graphe
 * body: affichage d'un graphique
 * parameters: fonction à tracer.
 * tags: algebre,1M
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "paramètres",
		type: "codearea",
		attributes: {language: 'pidraw-params'},
		value: ref("axis,grid,x=-10:10,y=-10:10"),
		fromUrl: "params",
	},
	{
		label: "code",
		type: "codearea",
		attributes: {language: 'pidraw'},
		value: ref(`O(0,0)
A(5,1)
B(3,8)->drag=grid
d=OA.
e=OB.
T1(6,0)
T2(6,5)
t=T1T2
a=arc A,O,B,2->tex=\\theta
X=inter t,d->w=10`),
		fromUrl: "code"
	}
])
/**
 * A(-1,2)
 * B(3,-6)
 * C(6,3)
 * O(3,-1)
 * c=circ O,A
 * p=poly A,B,C
 * K(-5,-5)
 * p1=KB
 * p2=KA
 * b=bis p1,p2
 */

const params = computed(() => forms[0].value.value as string)
const code = computed(() => forms[1].value.value as string)

// REFACTOR: use ToolBody
</script>

<template>
	<article class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
		<tool-form
			form-class="space-y-3"
			:forms
			:rows="15"
		/>

		<Card class="col-span-1 lg:col-span-2">
			<pi-draw-parser
				:width="800"
				:height="800"
				:draw="{
					code: code,
					parameters: params
				}"
			/>
		</Card>
	</article>
</template>
