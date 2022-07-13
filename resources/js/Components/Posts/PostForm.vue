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
import FormInput from "@/Components/Form/FormInput"
import {ref} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea"

const emits = defineEmits(["validate", "cancel"])

const props = defineProps({
	post: {type: Object, required: true},
})

let theTitle = ref(props.post.title),
	theScript = ref(props.post.script),
	theSwitch = ref(props.post.switch)

function doValidate(){
	// Update the post on the server
	updatePost()
	// Update the post on the current page
	emits("validate", {
		title: theTitle.value,
		switch: theSwitch.value,
		script: theScript.value
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
			_method: "patch"
		}
	).then(res => {
		// TODO: Send flash message ?
	})
}
</script>
