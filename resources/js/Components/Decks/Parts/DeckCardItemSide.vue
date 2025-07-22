<script setup lang="ts">
import {BlockInterface} from "@/types/modelInterfaces.ts"
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

withDefaults(defineProps<{
	block: BlockInterface
	xs?: boolean
}>(),{
	xs: false
})

</script>
<template>
	<div
		class="grid place-items-center
			overflow-auto
			backface-hidden"
	>
		<div
			class="bg-content
					w-full h-full
					rounded-xl px-5 py-3
					grid place-items-center"
		>
			<!-- body -->
			<markdown-it
				:text="block.body"
				:class="{
					'text-xl md:text-2xl lg:text-3xl xl:text-4xl': !xs,
					'md:text-lg lg:text-xl': xs,
				}"
			/>
			<!-- Illustration -->
			<illustration-show
				v-if="block?.illustrations?.length > 0"
				:illustration="block.illustrations[0]"
				class="h-full w-full max-w-[600px]"
				click-through
			/>
		</div>
	</div>
</template>
