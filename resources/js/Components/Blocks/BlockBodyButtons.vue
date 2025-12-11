<script lang="ts" setup>
import {useScriptLoader, UseScriptLoaderReturn} from "@/Composables/useScriptLoader.ts"
import {buttonInterface} from "@/types"
import {computed, inject} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

// Récupération des scripts de block
const blockScript = inject<UseScriptLoaderReturn>('blockScript', useScriptLoader(''))

// Détermine si le block a des boutons pour gérer les scripts
const hasButtons = computed(() => {
	return blockScript.hasData.value
})

// Détermine si le block doit afficher des boutons personnalisés
const hasCustomButtons = computed(() => {
	return hasButtons.value && Object.hasOwn(blockScript.merged.value, "btn")
})

const randomButton = computed<buttonInterface>(() => {
	let btn = {
		icon: "bi bi-shuffle",
		text: "aléatoire",
		show: true
	}

	if (hasCustomButtons.value && blockScript.merged.value.btn.random) {
		return {
			...btn,
			...blockScript.merged.value.btn.random
		}
	}

	return btn
})

const resetButton = computed<buttonInterface>(() => {
	let btn = {
		icon: "bi bi-x-square",
		text: "par défaut",
		show: blockScript.iteration.value > 1
	}

	if (hasCustomButtons.value && blockScript.merged.value.btn.reset) {
		return {
			...btn,
			...blockScript.merged.value.btn.reset
		}
	}
	if (blockScript.merged.value.reset) return {...btn}

	return null
})

</script>

<template>
	<div
		v-if="hasButtons"
		class="flex gap-3 items-end"
	>
		<sc-button
			v-if="resetButton"
			v-show="resetButton.show"
			theme
			xs
			class="tracking-wider d-block"
			@click="blockScript.reset()"
		>
			<i
				v-if="resetButton.icon"
				:class="resetButton.icon"
				class="mr-2"
			/>
			<span v-katex.auto="resetButton.text" />
		</sc-button>

		<sc-button
			v-if="randomButton"
			v-show="randomButton.show"
			theme
			xs
			class="tracking-wider d-block"
			@click="blockScript.run()"
		>
			<i
				v-if="randomButton.icon"
				:class="randomButton.icon"
				class="mr-2"
			/>
			<span v-katex.auto="randomButton.text" />
		</sc-button>
	</div>
</template>
