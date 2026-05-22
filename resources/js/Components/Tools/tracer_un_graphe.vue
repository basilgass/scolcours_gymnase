<script setup lang="ts">
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"

/** Tools
 * title: graphe
 * body: affichage d'un graphique
 * parameters: fonction à tracer.
 * tags: algebre,1M
 */
import Card from "@/Components/Ui/Card.vue"
import {computed, ref} from "vue"
import PiDrawDisplay from "@/Components/Pi/Parts/PiDrawDisplay.vue"

const {restoreTool} = useToolsStorage()
// const forms: IToolForm[] = restoreTool([])
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

// const params = computed(() => forms[0].value.value as string)
// const code = computed(() => forms[1].value.value as string)
const items = ref<string[]>([])
const code = computed(() => items.value.join('\n'))
const parameters = computed(() => "x=-10:10,y=-10:10,grid,axis")
const asymptotes = ref<{ key: string, type: "ao" | "av" | "ah" }[]>([])

function addAV() {
	const id = asymptotes.value.length + 1

	items.value.push(`V${id}(3,0)->drag=Ox/grid`)
	items.value.push(`v${id}=perp Ox,V${id}->red`)

	asymptotes.value.push({key: `V${id}`, type: 'av'})
}

function addAH() {
	const id = asymptotes.value.length + 1

	items.value.push(`H${id}(0,3)->drag=Oy/grid`)
	items.value.push(`h${id}=perp Oy,H${id}->green`)

	asymptotes.value.push({key: `H${id}`, type: 'ah'})
}

function addAO() {
	const id = asymptotes.value.length + 1

	items.value.push(`Y${id}(4,3)->drag=grid`)
	items.value.push(`T${id}(0,0)->drag=grid`)
	items.value.push(`y${id}=Y${id}T${id}->green`)

	asymptotes.value.push({key: `H${id}`, type: 'ah'})
}
</script>

<template>
	<article class="flex flex-col md:flex-row gap-3">
		<Card>
			<div class="flex flex-col gap-3">
				<button @click="addAV">
					AV
				</button>

				<button @click="addAH">
					AH
				</button>

				<button @click="addAO">
					AO
				</button>
			</div>
		</Card>
		<Card class="flex-1">
			<pi-draw-display
				:code
				:parameters
			/>
		</Card>
	</article>
</template>
