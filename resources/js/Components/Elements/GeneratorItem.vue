<script setup lang="ts">

import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import GeneratorsExamples from "@/Components/Elements/GeneratorsExamples.vue"
import {ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

const generator = defineModel<GeneratorInterface>('generator')

const hasErrors = ref(false)

</script>

<template>
	<div
		class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-5 rounded-lg"
		:class="hasErrors?'border-l-8 border-l-red-600':''"
		:data-withErrors="hasErrors"
	>
		<div>
			<h3
				class="font-semibold"
				v-katex.auto="generator.title"
			/>
			<markdown-it
				:text="generator.body"
			/>

			<div>
				<InertiaLink
					:href="route('generators.edit', [generator.id])"
				>
					Editer <i class="bi bi-pencil" />
				</InertiaLink>
			</div>
		</div>
		<generators-examples
			:generator="generator"
			generate-on-mounted
			@generated-status="hasErrors = !$event"
		/>
	</div>
</template>

<style scoped>

</style>
