<template>
	<div
		class="bg-white rounded shadow"
		:class="noPadding?'':'px-4 py-2'"
	>
		<!-- Title of the article -->
		<div
			v-show="!hideTitle"
			class="flex justify-between items-center"
		>
			<h2
				class="chapter-menu text-2xl my-4"
				:class="noPadding?'px-4 py-2':''"
			>
				<slot name="title" />
			</h2>
			<div v-if="$slots.options!==undefined">
				<slot name="options" />
			</div>
		</div>
		<slot />
	</div>
</template>
<script setup>
const props = defineProps({
	hideTitle: {type: Boolean, default: false},
	noPadding: {type: Boolean, default: false}
})
</script>
