<template>
	<article v-if="theFormular.length>0">
		<div class="px-5 flex justify-between">
			<h3 class="uppercase font-extralight mb-2">
				Formulaires
			</h3>
		</div>

		<div class="columns-1 md:columns-2 lg:columns-3">
			<draggable
				v-model="theFormular"
				class="grid grid-cols-1 gap-3 my-5"
				item-key="id"
				handle=".draggable-handle"
				v-bind="{
					animation: 200,
					disabled: !($page.props.auth.can.admin),
				}"
				@end="updateFormulasOrder"
			>
				<template #item="{ element }">
					<block-show
						v-if="element.block"
						:key="element.id"
						class="break-inside-avoid-column"
						:block="element.block"
						:max-illustration="1"
					/>
				</template>
			</draggable>
		</div>
	</article>
	<div
		v-admin
		class="mb-10"
	>
		<button
			class="btn-new"
			@click="addFormula"
		>
			Ajouter une formule
		</button>
	</div>
</template>

<script setup>

import {inject, onMounted, ref} from "vue"
import BlockShow from "@/Components/Posts/Blocks/BlockShow.vue"

const props = defineProps({
	chapterSlug: {type: String, required: true}
})
const theFormular = ref([])

const flash = inject("flash")
const addFormula = function(){
		axios
			.post(route("chapters.formulas.store", [props.chapterSlug]), {})
			.then(res=>{
				flash.add("formule créée")
				theFormular.value.push(res.data.data)
			})
	},
	updateFormulasOrder = function(){
		axios.post(route("formulas.updateOrder"), {
			order: theFormular.value.map((x, index)=>{return {id: x.id, order: index}})
		}).then(res=>{
			// TODO : flash message !
			flash.add("L'ordre des formules à bien été enregistré !")
		}).catch(res=>console.log("update ordering order: ", res.data))
	}

onMounted(()=>{
	axios
		.get(route("chapters.formulas.index", [props.chapterSlug]))
		.then(res=>theFormular.value = res.data.data)
})

// TODO: ajouter une formule au formulaire !
</script>
