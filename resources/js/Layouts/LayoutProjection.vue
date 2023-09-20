<template>
	<div class="min-h-screen flex flex-col bg-gray-100">
		<header v-admin v-theme.bg.admin.text class="py-2 px-4 flex justify-between">
			<Link class="uppercase" :href="route('admin')">administration</Link>

			<button
					class="btn btn-xs hover:text-black"
					:class="globalEditMode?'bg-white/40':''"
					title="Ctrl+Alt+A"
					@click="globalEditMode=!globalEditMode"
			>
					<span v-show="globalEditMode"> <i class="bi bi-pencil mr-2" /> <span
							class="hidden md:inline"
					>édition activée</span></span>
				<span v-show="!globalEditMode"> <i class="bi bi-pencil mr-2" /> <span>activer l'édition</span></span>
			</button>
		</header>
		<main class="w-full flex-1">
			<slot />
		</main>
	</div>
</template>

<script>

export default {
	name: "LayoutProjection",
}
</script>

<script setup>
import {computed, provide, ref} from "vue"

let globalEditMode = ref(false),
	globalCorrectionMode = ref(false)
provide("editMode", {
	enabled: computed(()=>{return globalEditMode.value}),
	toggle: function(){
		globalEditMode.value = !globalEditMode.value
		localStorage.setItem("scolcours_editMode", globalEditMode.value)
	}
})
provide("correctionMode", {
	enabled: computed(()=>{return globalCorrectionMode.value}),
	toggle: function(){
		globalCorrectionMode.value = !globalCorrectionMode.value
		localStorage.setItem("scolcours_correctionMode", globalCorrectionMode.value)
	}
})
</script>

