<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormSelect from "@/Components/Form/FormSelect.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref<string>("")

// Liste volontairement longue : permet de tester le scroll interne du menu,
// le flip automatique (ouverture vers le haut près du bas d'écran) et la
// navigation clavier (le scrollIntoView suit l'option active).
const choices = [
	'rouge', 'vert', 'bleu', 'jaune', 'violet',
	'orange', 'cyan', 'magenta', 'turquoise', 'indigo',
	'corail', 'olive', 'marron', 'bordeaux', 'azur'
]
</script>

<template>
	<FormExampleWrapper title="FormSelect">
		<template #options>
			<p class="text-xs text-gray-500">
				Accepts <code>choices: string[]</code> or <code>Record&lt;string, string&gt;</code>.
				An optional <code>labelMap</code> function transforms the display label.
			</p>
			<p class="text-xs text-gray-500">
				Le menu est téléporté vers <code>&lt;body&gt;</code> (jamais coupé par un conteneur
				scrollable) et se repositionne au scroll. Clavier : <code>↑↓</code> navigue,
				<code>Enter</code> sélectionne, <code>Esc</code> ferme, <code>Space</code>/<code>↓</code> ouvre.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormSelect
				v-bind="bp"
				v-model="value"
				:choices="choices"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
