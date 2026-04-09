<script setup lang="ts">
import {provide, reactive, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import ExampleFormInput from "./FormExamples/ExampleFormInput.vue"
import ExampleFormSwitch from "./FormExamples/ExampleFormSwitch.vue"
import ExampleFormTextarea from "./FormExamples/ExampleFormTextarea.vue"
import ExampleFormSelect from "./FormExamples/ExampleFormSelect.vue"
import ExampleFormCodearea from "./FormExamples/ExampleFormCodearea.vue"
import ExampleFormKeyboard from "./FormExamples/ExampleFormKeyboard.vue"
import ExampleFormSearch from "./FormExamples/ExampleFormSearch.vue"
import ExampleFormJson from "./FormExamples/ExampleFormJson.vue"
import ExampleFormFraction from "./FormExamples/ExampleFormFraction.vue"
import ExampleFormVector from "./FormExamples/ExampleFormVector.vue"
import ExampleFormTheme from "./FormExamples/ExampleFormTheme.vue"
import ExampleFormChapter from "./FormExamples/ExampleFormChapter.vue"
import ExampleFormTeam from "./FormExamples/ExampleFormTeam.vue"
import ExampleFormDeck from "./FormExamples/ExampleFormDeck.vue"

const showGlobalOptions = ref(false)

const baseProps = reactive<FormMakerBaseProps>({
	label: 'mon label',
	icon: false,
	prepend: false,
	inlineLabel: false,
	btn: false,
	clearable: false,
	message: '',
	xs: false,
	sm: false,
	xl: false,
})

provide('formBaseProps', baseProps)
</script>

<template>
	<div class="space-y-6">
		<!-- Panneau global des options -->
		<Card>
			<template #header>
				<div class="flex justify-between items-center">
					<span class="font-semibold">Options globales</span>
					<button
						class="text-xs border rounded px-2 py-0.5 hover:bg-gray-100"
						@click="showGlobalOptions = !showGlobalOptions"
					>
						{{ showGlobalOptions ? 'masquer' : 'afficher' }}
					</button>
				</div>
			</template>

			<div
				v-show="showGlobalOptions"
				class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
			>
				<!-- label -->
				<label class="flex items-center gap-2 text-sm">
					<span class="w-24 shrink-0 font-code text-xs">label</span>
					<input
						v-model="baseProps.label"
						class="border rounded px-2 py-1 flex-1 text-sm"
						type="text"
					>
				</label>

				<!-- message -->
				<label class="flex items-center gap-2 text-sm">
					<span class="w-24 shrink-0 font-code text-xs">message</span>
					<input
						v-model="baseProps.message"
						class="border rounded px-2 py-1 flex-1 text-sm"
						type="text"
					>
				</label>

				<!-- icon -->
				<label class="flex items-center gap-2 text-sm">
					<span class="w-24 shrink-0 font-code text-xs">icon</span>
					<input
						v-model="baseProps.icon"
						class="border rounded px-2 py-1 flex-1 text-sm"
						placeholder="bi bi-star (vide = false)"
						type="text"
					>
				</label>

				<!-- prepend -->
				<label class="flex items-center gap-2 text-sm">
					<span class="w-24 shrink-0 font-code text-xs">prepend</span>
					<input
						v-model="baseProps.prepend"
						class="border rounded px-2 py-1 flex-1 text-sm"
						placeholder="texte ou vide"
						type="text"
					>
				</label>

				<!-- btn -->
				<label class="flex items-center gap-2 text-sm">
					<span class="w-24 shrink-0 font-code text-xs">btn</span>
					<input
						v-model="baseProps.btn"
						class="border rounded px-2 py-1 flex-1 text-sm"
						placeholder="bi bi-search ou vide"
						type="text"
					>
				</label>

				<!-- Toggles -->
				<div class="flex flex-wrap gap-4">
					<label
						v-for="flag in ['inlineLabel', 'clearable', 'xs', 'sm', 'xl'] as const"
						:key="flag"
						class="flex items-center gap-2 text-sm cursor-pointer"
					>
						<input
							v-model="baseProps[flag]"
							type="checkbox"
						>
						<span class="font-code text-xs">{{ flag }}</span>
					</label>
				</div>
			</div>
		</Card>

		<!-- Exemples -->
		<div class="grid grid-cols-1 gap-6">
			<ExampleFormInput />
			<ExampleFormSwitch />
			<ExampleFormTextarea />
			<ExampleFormSelect />
			<ExampleFormCodearea />
			<ExampleFormKeyboard />
			<ExampleFormSearch />
			<ExampleFormJson />
			<ExampleFormFraction />
			<ExampleFormVector />
			<ExampleFormTheme />
			<ExampleFormChapter />
			<ExampleFormTeam />
			<ExampleFormDeck />
		</div>
	</div>
</template>
