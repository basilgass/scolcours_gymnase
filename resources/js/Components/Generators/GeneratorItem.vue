<script lang="ts" setup>

import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import {ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import Card from "@/Components/Ui/Card.vue"
import ParameterSchemaLabel from "@/Components/Generators/ParameterSchemaLabel.vue"
import GeneratorsExamples from "@/Components/Generators/GeneratorsExamples.vue"

const generator = defineModel<GeneratorInterface>('generator', {required: true})

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
	<Card
		:header-theme="generator.theme_id"
		:class="hasErrors?'border-l-8 border-l-red-600':''"
		:data-withErrors="hasErrors"
	>
		<template #header>
			<div class="flex justify-between">
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
						:href="route('generators.show', {generator: generator.slug})"
						xs
						type="default"
					>
						<i class="bi bi-eye" /> Voir
					</sc-button>
				</div>
			</div>
		</template>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
			<div>
				<markdown-it
					:text="generator.body"
				/>

				<div
					v-if="generator.parameters_schema"
					class="mt-12"
				>
					<h4 class="text-lg pb-3 font-semibold">
						paramètres
					</h4>
					<div class="flex flex-col divide-y border-content">
						<ParameterSchemaLabel
							v-for="(entry, key) in generator.parameters_schema"
							:key="key"
							class="py-1"
							:entry="entry"
							:label="key"
						/>
					</div>
				</div>
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
	</Card>
</template>
