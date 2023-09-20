<!--
Formulaire d'édition d'un post
Utilisé dans PoseShow et PostEditPage (pour l'édition mode développement ?)
-->
<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div class="bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5">
				<h1>
					<span class="text-xl md:text-2xl">édition d'un post</span>
					<span class="text-xs font-code ml-5">(id: {{ props.post.id }})</span>
					<move-item-to
						target="chapter"
						:source-id="props.post.id"
						source="post"
						@moved="emits('update:modelValue', false)"
					/>
				</h1>
				<div class="flex gap-3 justify-end">
					<button
						class="btn-primary btn-xs"
						@click="savePost"
					>
						enregistrer
					</button>
					<button
						class="btn-cancel btn-xs"
						@click="emits('update:modelValue', false)"
					>
						fermer
					</button>
					<confirm-button
						class="btn-delete btn-xs"
						@confirm="deletePost"
					>
						supprimer
					</confirm-button>
				</div>
			</div>
		</template>

		<div class="px-5 pb-5">
			<form-input
				v-model="theTitle"
				label="Titre"
				name="title"
				focus
				@enter="savePost"
			/>

			<div class="flex gap-3 my-3">
				<button
					v-for="(key, name) of typeList"
					:key="'btn-'+ name"
					class="btn-xs"
					:class="theType===key?'btn-primary':'btn'"
					@click="theType = key"
				>
					{{ name }}
				</button>
			</div>

			<div class="flex flex-col">
				<form-textarea
					v-model="theScript"
					label="script"
					name="script"
				/>
				<form-input
					v-model="theSwitch"
					label="switch"
					name="switch"
				/>
			</div>
		</div>
	</dialog-modal>
</template>
<script setup>
// TODO: make the dialog html modal more user friendly and reactive !
import FormInput from "@/Components/Form/FormInput.vue"
import {ref} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import MoveItemTo from "@/Components/Posts/MoveItemTo.vue"

const emits = defineEmits(["update:modelValue", "change", "destroy"])

const props = defineProps({
	modelValue: {type: Boolean, default: false},
	post: {type: Object, required: true},
})

let show = ref(props.modelValue)

let theTitle = ref(props.post.title),
	theScript = ref(props.post.script),
	theSwitch = ref(props.post.switch),
	theType = ref(props.post.type??""),
	typeList = ref({
		"article": "", "exercice": "exercise"
	})

let savePost = function() {
		axios.post(
			route("posts.update", [props.post.id]),
			{
				title: theTitle.value,
				script: theScript.value,
				switch: theSwitch.value,
				type: theType.value,
				_method: "patch"
			}
		).then(res => {
			// TODO: Send flash message ?
			emits("update:modelValue", false)
			emits("change", res.data.data)
		})
	},
	deletePost = function(){
		axios.post(route("posts.destroy", [props.post.id]),
			{_method: "delete"})
			.then(res => {
				emits("update:modelValue", false)
				emits("destroy", props.post.id)
			})
	}
</script>
