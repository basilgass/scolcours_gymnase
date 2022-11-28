<template>
	<div>
		<dialog-modal
			v-model="edit"
		>
			<BlockForm
				v-model="theQuestion.block"
				no-script
				no-data
				no-switch
				no-title
				no-type
				no-delete
				@close="edit=false"
				@save="updateQuestion"
			/>
		</dialog-modal>
		<dialog-modal
			v-model="editAnswer"
		>
			<div class="grid grid-cols-1 gap-5">
				<QuestionForm
					v-model="theQuestion"
					@close="editAnswer=false"
					@save="updateQuestion"
				/>
			</div>
		</dialog-modal>
		<div
			v-if="$page.props.auth.can.admin && editMode && !correctionMode"
			class="admin-wrapper"
		>
			<div class="w-full flex justify-between">
				<button
					class="btn-edit btn-xs"
					@click="edit=true"
				>
					donnée <i class="bi bi-pencil" />
				</button>
				<button
					class="btn-edit btn-xs"
					@click="editAnswer=true"
				>
					question <i class="bi bi-pencil" />
				</button>
				<button
					class="btn-xs btn-add"
					@click="duplicateQuestion"
				>
					<i class="bi bi-clipboard mr-2" />Dupliquer
				</button>
				<confirm-button
					class="btn-xs btn-delete"
					@confirm="destroyQuestion"
				>
					<i class="bi bi-trash mr-2" />Supprimer
				</confirm-button>
			</div>
		</div>
	</div>
</template>
<script setup>
import DialogModal from "@/Components/Ui/DialogModal.vue"
import BlockForm from "@/Components/Posts/Blocks/BlockForm.vue"
import QuestionForm from "@/Components/Posts/Questions/QuestionForm.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {inject, reactive, ref} from "vue"


let props = defineProps({
	question: {type: Object, required: true},
	correctionMode: {type: Boolean, default: false}
})
let theQuestion = reactive(props.question)

let emits = defineEmits(["destroy", "duplicate", "updated", "update:question"])
let edit = ref(false),
	editAnswer = ref(false),
	editMode = inject("editpost", false)

function duplicateQuestion() {
	axios.post(route("questions.duplicate", [theQuestion.id]), )
		.then(res=>{
			emits("duplicate", res.data)
		}).catch(res=>console.log("duplicate error", res.data))
}

function destroyQuestion() {
	axios.post(
		route("questions.destroy", [theQuestion.id]),
		{
			_method: "delete"
		}
	).then(res => {
		emits("destroy", theQuestion.id)
	})
}

function updateQuestion(){
	emits("update:question", theQuestion)
}

</script>
