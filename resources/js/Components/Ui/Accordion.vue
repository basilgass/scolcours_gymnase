<script setup lang="ts">
import {provide, ref} from 'vue'

const props = defineProps<{
	multiple?: boolean
}>()

const opened = ref<Set<number>>(new Set())

function toggle(id: number) {
	if (props.multiple) {
		if (opened.value.has(id)) {
			opened.value.delete(id)
		} else {
			opened.value.add(id)
		}
	} else {
		opened.value = opened.value.has(id)
			? new Set()
			: new Set([id])
	}
}

function isOpen(id: number) {
	return opened.value.has(id)
}

provide('accordion', {
	toggle,
	isOpen,
})
</script>

<template>
	<div class="divide-y divide-slate-200">
		<slot />
	</div>
</template>
