<script lang="ts" setup>
import { computed, PropType } from "vue"

interface buttonInterface {
	show: boolean
	icon: string
	text: string
}

interface buttonsInterface {
	reset?: buttonInterface
	random?: buttonInterface
}

interface BlockScriptType {
	btn: buttonsInterface
	reset?: boolean
}

const random = defineModel<number>()

const props = defineProps({
	blockData: {
		type: Object as PropType<BlockScriptType>,
		required: true
	}
})

const hasButtons = computed(() => {
	return Object.keys(props.blockData).length > 0
})
const hasCustomButtons = computed(() => {
	return hasButtons.value && Object.hasOwn(props.blockData, "btn")
})
const randomButton = computed<buttonInterface>(() => {
	let btn = {
		icon: "bi bi-shuffle",
		text: "aléatoire",
		show: true
	}

	if (hasCustomButtons.value && props.blockData.btn.random) {
		return {
			...btn,
			...props.blockData.btn.random
		}
	}

	if (hasButtons.value) return btn

	return null
})
const resetButton = computed<buttonInterface>(() => {
	let btn = {
		icon: "bi bi-x-square",
		text: "par défaut",
		show: random.value > 1
	}

	if (hasCustomButtons.value && props.blockData.btn.reset) {
		return {
			...btn,
			...props.blockData.btn.reset
		}
	}

	if (props.blockData.reset) return { ...btn }

	return null
})

function refresh(reset?: boolean) {
	reset ? random.value = 1 : random.value++
}

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
			@click="refresh(true)"
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
			@click="refresh()"
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
