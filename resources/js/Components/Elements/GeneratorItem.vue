<script lang="ts" setup>

import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import GeneratorsExamples from "@/Components/Elements/GeneratorsExamples.vue"
import {ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const generator = defineModel<GeneratorInterface>('generator')

const hasErrors = ref<boolean>(false)

const generated = ref<boolean>(false)

const emits = defineEmits<{
	generatorHasErrors: [value: boolean]
}>()

function generate() {
	generated.value = true
}

defineExpose({generate})

function updateStatus(event: boolean) {
	hasErrors.value = event
	emits('generatorHasErrors', event)
}

</script>

<template>
	<div
		v-theme.border="generator.theme_id"
		:class="hasErrors?'border-l-8 border-l-red-600':''"
		:data-withErrors="hasErrors"
		class="bg-content
		rounded-lg
		grid grid-cols-1 md:grid-cols-2 gap-3
		border-l-8
		p-5"
	>
		<div>
			<div class="flex justify-between md:flex-col flex-row ">
				<div class="flex gap-1 items-baseline">
					<div class="font-code text-xs">
						({{ generator.id }})
					</div>
					<h3
						v-katex.auto="generator.title"
						class="font-semibold"
					/>
				</div>
				<div
					class="flex gap-3"
				>
					<sc-button
						:href="route('admin.generators.edit', {generator: generator.id})"
						icon
						type="edit"
						xs
					>
						Editer {{ generator.id }}
					</sc-button>
					<sc-button
						:href="route('generators.show', {generator: generator.id})"
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
				@generator-has-errors="updateStatus"
			/>
			<div
				v-else
				class="flex justify-center my-8"
			>
				<sc-button
					icon
					type="generate"
					@click="generate"
				>
					générer
				</sc-button>
			</div>
		</div>
	</div>
</template>
