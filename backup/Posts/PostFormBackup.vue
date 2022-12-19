<template>
	<div class="flex justify-between items-end">
		<div class="flex-1">
			<form-input
				v-model="theTitle"
				label="Titre"
				name="title"
				focus
				@enter="doValidate"
				@cancel="doCancel"
			/>
		</div>
		<div class="flex items-end">
			<button
				class="btn-primary"
				@click="doValidate"
			>
				<i class="bi bi-save" />
			</button>
			<button
				class="btn-cancel"
				@click="doCancel"
			>
				<i class="bi bi-x-lg" />
			</button>
		</div>
	</div>

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
</template>
<script setup>
// TODO: make the dialog html modal more user friendly and reactive !
import FormInput from "@/Components/Form/FormInput.vue"
import {ref} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"

const emits = defineEmits(["validate", "cancel"])

const props = defineProps({
	post: {type: Object, required: true},
})

let theTitle = ref(props.post.title),
	theScript = ref(props.post.script),
	theSwitch = ref(props.post.switch),
	theType = ref(props.post.type??""),
	typeList = ref({
		"article": "", "exercice": "exercise"
	})

function doValidate(){
	// Update the post on the server
	updatePost()
	// Update the post on the current page
	emits("validate", {
		title: theTitle.value,
		switch: theSwitch.value,
		script: theScript.value,
		type: theType.value
	})
}

function doCancel(){
	emits("cancel")
}

async function updatePost() {
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
	})
}
</script>
