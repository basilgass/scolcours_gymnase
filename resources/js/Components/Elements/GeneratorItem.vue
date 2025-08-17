<script setup lang="ts">

import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import GeneratorsExamples from "@/Components/Elements/GeneratorsExamples.vue"
import {ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import ScButton from "@/Components/Ui/scButton.vue"

const generator = defineModel<GeneratorInterface>('generator')

const hasErrors = ref<boolean>(false)

const generated = ref<boolean>(false)
</script>

<template>
	<div
		class="bg-content
		rounded-lg
		grid grid-cols-1 md:grid-cols-2 gap-3
		p-5 "
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
					:href="route('admin.generators.edit', [generator.id])"
				>
					Editer <i class="bi bi-pencil" />
				</InertiaLink>
				<InertiaLink
					:href="route('generators.show', [generator.id])"
				>
					Voir <i class="bi bi-eye" />
				</InertiaLink>
			</div>
		</div>
		<generators-examples
			v-if="generated"
			:generator="generator"
			generate-on-mounted
			@generated-status="hasErrors = !$event"
		/>
		<div v-else>
			<sc-button
				type="edit"

				@click="generated=true"
			>
				générer
			</sc-button>
		</div>
	</div>
</template>
