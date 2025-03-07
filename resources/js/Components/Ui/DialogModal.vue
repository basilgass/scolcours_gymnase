<!--
Génère un modal
Utilisé principalement pour l'édition des blocks
-->
<script setup lang="ts">

const showModal = defineModel()

const emits = defineEmits<{
	"cancel": []
}>()

function doCancel(){
	showModal.value = false
	emits("cancel")
}
</script>

<template>
	<Teleport
		v-if="showModal"
		to="body"
	>
		<div
			class="fixed inset-0 bg-slate-500/70 dark:bg-slate-950/70 grid place-items-center z-50"
			@mousedown.self="doCancel"
		>
			<div
				v-bind="$attrs"
				class="grid bg-content border rounded-lg max-w-[1600px] w-[90%] max-h-[95vh] overflow-auto"
			>
				<div class="flex flex-col">
					<div v-if="$slots.header">
						<slot name="header" />
					</div>
					<div class="flex-1 h-full">
						<slot />
					</div>
					<div v-if="$slots.footer">
						<slot name="footer" />
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
