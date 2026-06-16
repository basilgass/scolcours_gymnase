<!--
Génère un modal
Utilisé principalement pour l'édition des blocks
-->
<script lang="ts" setup>

import {useMagicKeys} from "@vueuse/core"

const showModal = defineModel<boolean>()

const emits = defineEmits<{
	"cancel": []
}>()

useMagicKeys({
	passive: false,
	onEventFired: (e) => {
		// keydown uniquement : useMagicKeys déclenche onEventFired sur keydown ET keyup.
		// Sans ce filtre, doCancel() serait appelé deux fois par Échap, et un composant
		// enfant qui stoppe la propagation du keydown verrait quand même le keyup fermer
		// le dialogue.
		if (e.type === 'keydown' && e.key === 'Escape') {
			doCancel()
		}
	}
})

function doCancel() {
	showModal.value = false
	emits("cancel")
}

</script>

<template>
	<Teleport to="body">
		<div
			v-show="showModal"
			class="fixed inset-0 bg-slate-500/70 dark:bg-slate-950/70 grid place-items-center z-50"
			@mousedown.self="doCancel"
		>
			<div
				class="bg-content rounded-lg
				overflow-auto overscroll-contain"
				v-bind="$attrs"
			>
				<div class="w-full h-full flex flex-col">
					<div v-if="$slots.header">
						<slot name="header" />
					</div>
					<div class="flex-1 overflow-y-auto">
						<slot />
					</div>
					<div
						v-if="$slots.footer"
						class="mt-3"
					>
						<slot name="footer" />
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
