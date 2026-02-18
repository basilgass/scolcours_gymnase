<script setup lang="ts">
import {inject, nextTick, onMounted, ref, watch} from 'vue'

const props = defineProps<{
	id: number
}>()

const accordion = inject<{
	toggle: (id: number) => void
	isOpen: (id: number) => boolean
}>('accordion')!

const contentRef = ref<HTMLElement | null>(null)
const height = ref('0px')

function updateHeight() {
	if (!contentRef.value) return

	if (accordion.isOpen(props.id)) {
		height.value = contentRef.value.scrollHeight + 'px'
		setTimeout(() => {
			height.value = 'auto'
		}, 300)
	} else {
		height.value = contentRef.value.scrollHeight + 'px'

		requestAnimationFrame(() => {
			height.value = '0px'
		})
	}
}

watch(
	() => accordion.isOpen(props.id),
	async () => {
		await nextTick()
		updateHeight()
	}
)

onMounted(updateHeight)
</script>

<template>
	<div class="border-b border-slate-200">
		<button
			class="w-full flex justify-between items-center py-5 text-slate-800 cursor-pointer"
			@click="accordion.toggle(id)"
		>
			<span>
				<slot name="title" />
			</span>

			<span
				class="transition-transform duration-300"
				:class="{ 'rotate-45': accordion.isOpen(id) }"
			>
				<i class="bi bi-plus-lg" />
			</span>
		</button>

		<div
			class="overflow-hidden transition-all duration-300 ease-in-out"
			:style="{ height }"
		>
			<div
				ref="contentRef"
				class="pb-5 text-sm text-slate-500"
			>
				<slot />
			</div>
		</div>
	</div>
</template>
