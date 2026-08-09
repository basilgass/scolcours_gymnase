<!--
Génère un modal
Utilisé principalement pour l'édition des blocks
-->
<script lang="ts" setup>

import {useMagicKeys} from "@vueuse/core"

withDefaults(defineProps<{
	title?: string | null
}>(), {
	title: null
})
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
				class="rounded-lg bg-content
				overflow-auto overscroll-contain
				flex flex-col divide-y max-w-[95vw] max-h-[95vh]"
				v-bind="$attrs"
			>
				<slot name="header">
					<h2
						v-if="title"
						v-katex.auto="title"
						class="text-xl lg:text-2xl p-3"
					/>
				</slot>

				<div class="flex-1 overflow-y-auto min-h-0">
					<slot />
				</div>

				<slot
					v-if="$slots.footer"
					name="footer"
				/>
			</div>
		</div>
	</Teleport>
</template>
