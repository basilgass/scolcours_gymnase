<script setup lang="ts">

import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import GeneratorDisplay from "@/Components/Challenges/GeneratorDisplay.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import GeneratorConfigurator from "@/Components/Challenges/GeneratorConfigurator.vue"
import {ref, useTemplateRef} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {GeneratorParameterRawValue} from "@/Composables/useGeneratorParameters.ts"

const editMode = useStoreEditMode()

defineOptions({layout: LayoutMain})
defineProps<{
	generator: GeneratorInterface
}>()

const params = ref<Record<string, GeneratorParameterRawValue>>({})

const generatorRef = useTemplateRef<InstanceType<typeof GeneratorDisplay>>('generatorRef')

function reload() {
	generatorRef.value?.reload()
}

const showParameters = ref(false)
</script>

<template>
	<section>
		<article-title
			:title="generator.title"
			:return-link="{
				url: route('generators.index'),
				label: 'liste de tous les générateurs'
			}"
		>
			<template
				#right
			>
				<div class="flex gap-3">
					<sc-button
						v-if="generator.parameters_schema"
						type="action"
						xs
						@click="showParameters=!showParameters"
					>
						<i class="bi bi-info-circle" />paramètres
					</sc-button>
					<sc-button
						v-admin="editMode.enable"
						xs
						type="edit"
						icon
						:href="route('admin.generators.edit', {generator: generator.id})"
					>
						éditer
					</sc-button>
				</div>
			</template>
		</article-title>

		<generator-configurator
			v-if="showParameters"
			v-model="params"
			:generator
			@reload="reload"
		/>

		<suspense>
			<generator-display
				ref="generatorRef"
				:generator
				:parameters="params"
			/>
		</suspense>
	</section>
</template>

<style scoped>

</style>
