<script setup lang="ts">

import { onMounted, onUnmounted, ref } from "vue"
import axios from "axios"

const emit = defineEmits(["file-dropped"])
const active = ref(false)

function onDrop(e) {
	active.value = false

	axios.post(route("api.illustrations.images.upload"),
		{
			image: [...e.dataTransfer.files][0],
		},
		{
			headers: {
				"Content-Type": "multipart/form-data"
			}
		}).then(res=>{
		emit("file-dropped", res.data)
	}).catch(err=>{
		console.warn(err)
	})

}


const events = ["dragenter", "dragover", "dragleave", "drop"]
function preventDefaults(e) {
	e.preventDefault()
}
onMounted(() => {
	events.forEach((eventName) => {
		document.body.addEventListener(eventName, preventDefaults)
	})
})
onUnmounted(() => {
	events.forEach((eventName) => {
		document.body.removeEventListener(eventName, preventDefaults)
	})
})
</script>

<template>
	<div>
		<div
			class="w-full min-h-[8em]
			rounded border-2 border-dashed
			grid place-items-center font-code
			cursor-copy"
			:class="active?'is-active':''"
			@drop.prevent="onDrop"
			@dragenter.prevent="active=true"
			@dragleave.prevent="active=false"
			@dragover.prevent="active=true"
		>
			glisser / déposer une image
		</div>
	</div>
</template>
