<script lang="ts" setup>
import { useScriptLoader } from "@/Composables/useScriptLoader.ts"
import { buttonInterface } from "@/types"
import { computed, inject } from "vue"


const blockScript = inject('blockScript', useScriptLoader(''))

const hasButtons = computed(() => {
	return Object.keys(blockScript.merged.value).length > 0
})

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
	if (blockScript.merged.value.reset) return { ...btn }

	return null
})

</script>
<template>
	<div
		v-if="hasButtons"
		class="flex gap-3"
	>
		<button
			v-if="resetButton"
			v-show="resetButton.show"
			:class="`btn-scolcours-${$page.props.theme.slug} btn-xs tracking-wider d-block`"
			@click="blockScript.reset()"
		>
			<i
				v-if="resetButton.icon"
				:class="resetButton.icon"
				class="mr-2"
			/>
			<span v-katex.auto="resetButton.text" />
		</button>

		<button
			v-if="randomButton"
			v-show="randomButton.show"
			v-theme.btn
			:class="`btn-xs tracking-wider d-block`"
			@click="blockScript.run()"
		>
			<i
				v-if="randomButton.icon"
				:class="randomButton.icon"
				class="mr-2"
			/>
			<span v-katex.auto="randomButton.text" />
		</button>
	</div>
</template>
