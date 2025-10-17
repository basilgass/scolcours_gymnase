<script lang="ts" setup>

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
		:class="hasErrors?'border-l-8 border-l-red-600':''"
		:data-withErrors="hasErrors"
		class="bg-content
		rounded-lg
		grid grid-cols-1 md:grid-cols-2 gap-3
		p-5 "
	>
		<div>
			<div class="flex justify-between">
				<h3
					v-katex.auto="generator.title"
					class="font-semibold"
				/>
				<div
					class="flex gap-3"
				>
					<sc-button
						:href="route('admin.generators.edit', [generator.id])"
						icon
						type="edit"
						xs
					>
						Editer
					</sc-button>
					<sc-button
						:href="route('generators.show', [generator.id])"
						type="default"
						xs
					>
						<i class="bi bi-eye" /> Voir
					</sc-button>
				</div>
			</div>
			<markdown-it
				:text="generator.body"
			/>
		</div>
		<div>
			<generators-examples
				v-if="generated"
				:generator="generator"
				generate-on-mounted
				@generated-status="hasErrors = !$event"
			/>
			<div
				v-else
				class="flex justify-center my-8"
			>
				<sc-button
					icon
					type="generate"
					@click="generated=true"
				>
					générer
				</sc-button>
			</div>
		</div>
	</div>
</template>
