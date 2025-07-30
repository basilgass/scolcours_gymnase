<script setup lang="ts">
import FormMaker from "@/Components/Form/FormMaker.vue"
import {flashInterface} from "@/types"
import {watchDebounced} from "@vueuse/core"
import axios from "axios"
import {inject, nextTick, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const flash = inject<flashInterface>("flash")

const props = defineProps<{
	source: 'block' | 'question' | 'post',
	sourceId: number,
	target: 'post' | 'chapter'
}>()

const emits = defineEmits<{
	moved: [target: {target_type: string, target_id: number}]
}>()


let showMoveTo = ref(false)
const moveToId = ref(null)
const moveInput = ref(null)
const targetName = ref("")

async function enableMove() {
	showMoveTo.value = !showMoveTo.value
	await nextTick(() => {
		// moveInput.value.focus()
	})
}

function getUrl() {
	if (props.source === 'question') {
		return route('api.admin.questions.move', [props.sourceId])
	}

	if (props.source === 'block') {
		return route('api.admin.blocks.move', [props.sourceId])
	}

	if (props.source === 'post') {
		return route('api.admin.posts.move', [props.sourceId])
	}

	return null
}

function moveTo() {
	if (targetName.value === "???") {
		flash.error(`Le ${props.target} n'existe pas.`)
		return
	}

	// REFACTOR : route(`${props.source}s.move` - a mettre en explicite.
	const urlData =			{
		target_id: moveToId.value,
		target_type: props.target,
	}
	axios
		.patch(
			getUrl(),
			urlData
		)
		.then((res) => {
			emits('moved', urlData)
			flash.success(
				`Le ${props.source} a bien été déplacé.`,
				{
					link: {
						url: res.data.url,
						label: res.data.label,
					},
					timeout: 10000
				}
			)
		})
		.catch((res) => {
			console.warn(res)
		})
}

function getTargetName() {

	// REFACTOR : route(`${props.source}s.move` - a mettre en explicite.
	axios
		.get(route(`api.${props.target}s.info`, [moveToId.value]))
		.then((res) => {
			targetName.value = res.data.title
		})
		.catch(() => {
			targetName.value = "???"
		})
}

watchDebounced(moveToId, getTargetName, {debounce: 1000, maxWait: 2000})
</script>
<template>
	<div>
		<div class="flex gap-3 items-center">
			<sc-button
				xs
				@click="enableMove"
				type="edit"
				outline
			>
				move
			</sc-button>

			<div
				v-if="showMoveTo"
				class="flex items-end"
			>
				<form-maker
					with-icon
					type="id"
					ref="moveInput"
					v-model.number="moveToId"
					class="rounded-r-none max-w-[6em]"
					:label="`${source} vers ${target}`"
					sm
					font-code
					@enter="moveTo"
				/>
				<sc-button
					type="primary"
					v-if="targetName"
					class="rounded-l-none"
					@click="moveTo"
					xs
				>
					<i class="bi bi-check" />
				</sc-button>
			</div>
		</div>
		<div
			class="text-gray-400 italic flex gap-3"
			v-if="showMoveTo"
		>
			<i class="bi bi-chevron-double-right" />
			<div v-katex.auto="targetName" />
		</div>
	</div>
</template>
