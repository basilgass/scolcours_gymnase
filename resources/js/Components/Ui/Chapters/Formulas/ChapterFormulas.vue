<template>
	<chapter-article
		no-padding
		class="divide-y divide-gray-200"
	>
		<template #title>
			{{ title }}
		</template>

		<!-- Display all formulas -->
		<div
			v-if="formulas.length>0"
		>
			<draggable
				:disabled="!($page.props.auth.can.admin && editMode)"
				v-model="formulas"
				item-key="id"
				@end="updateFormulas"
			>
				<template #item="{ element }">
					<div
						class="grid grid-cols-1 gap-4 odd:bg-gray-50 px-4 py-3"
						:class="element.block.illustrations.length>0?'grid-cols-2':''"
					>
						<div>
							<!-- Admin controls -->
							<div
								v-if="$page.props.auth.can.admin && editMode && editingFormula===false"
								class="flex gap-2 mb-2"
							>
								<button
									class="btn-edit btn-xs px-2"
									@click="editingFormula = element"
								>
									éditer <i class="bi bi-pencil" />
								</button>
								<button
									class="btn-success btn-xs px-2"
									@click="duplicateFormula(element.id)"
								>
									dupliquer <i class="bi bi-clipboard-plus" />
								</button>
								<button
									class="btn-delete btn-xs px-2"
									@click="delFormula(element.id)"
								>
									supprimer <i class="bi bi-trash" />
								</button>
							</div>

							<!-- Text -->
							<div
								v-katex.left.nomargin.auto="element.block.body"
							/>
						</div>

						<!-- Illustration -->
						<illustration-show
							v-if="element.block.illustrations.length>0"
							:illustration="element.block.illustrations[0]"
						/>
					</div>

				</template>
			</draggable>
		</div>

		<!-- Edit form or create button -->
		<div v-if="$page.props.auth.can.admin && editMode">
			<div class="text-center py-3">
				<button
					v-if="editingFormula===false"
					class="btn-primary"
					@click="addFormula"
				>
					Ajouter une formule
				</button>
			</div>

			<div
				v-if="editingFormula"
				class="px-3"
			>
				<block-form
					ref="bForm"
					v-model="editingFormula.block"
					no-switch
					no-data
					no-script
					no-title
					@close="editingFormula = false"
				/>
			</div>
		</div>
	</chapter-article>
</template>
<script setup>
import {inject, onMounted, ref} from "vue"
import ChapterArticle from "@/Components/Ui/Chapters/ChapterArticle"
import BlockForm from "@/Components/Posts/BlockForm"
import IllustrationShow from "@/Components/Posts/IllustrationShow"

let props = defineProps({
	title: {type: String, default: "formulaire"},
	chapter: {type: Object, required: true},
	filter: {type: String, default: ""}
})

let editMode = inject("editmode"),
	editingFormula = ref(false),
	bForm = ref(null)

let formulas = ref([])

// make an ajax request to get all formulas
async function getFormulas() {
	axios.get(
		route("chapters.formulas.index", [props.chapter.slug])
	).then(res => {
		formulas.value = res.data.data
	}).catch(
		err => {
			console.error(err.response)
		}
	)
}

function addFormula() {
	axios.post(route("chapters.formulas.store", [props.chapter.slug])
	).then(res=>{
		formulas.value.push(res.data.data)
		editingFormula.value = formulas.value[formulas.value.length-1]

	}).finally(()=>{
		bForm.value.focus(true)
	})
}

function duplicateFormula(id){
	axios.post(route("formulas.duplicate", [id]), )
		.then(res=>{
			formulas.value.push(res.data.data)
		}).catch(res=>console.log("duplicate error", res.data))
}

function updateFormulas(){
	axios.post(route("formulas.updateOrder"), {
		order: formulas.value.map((x, index)=>{return {id: x.id, order: index}})
	}).then(res=>{
		console.log(res.data)
	}).catch(res=>console.log("update ordering order: ", res.data))

}

function delFormula(id) {
	axios.post(route("formulas.destroy", [id]), {
		_method: "DELETE"
	}).then(res=>{
		formulas.value = formulas.value.filter(item=>item.id!==id)
	})
}

onMounted(()=>{
	formulas.value = getFormulas()
})
</script>
