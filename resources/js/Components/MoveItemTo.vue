<script lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import {watchDebounced} from "@vueuse/core"
import axios from "axios"
import {computed, nextTick, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const flash = useStoreFlashMessage()
const props = defineProps<{
	source: 'block' | 'question' | 'post' | 'formula',
	sourceId: number,
	target: 'post' | 'chapter'
}>()

const emits = defineEmits<{
	moved: [target: { id: number, target_type: string, target_id: number }]
}>()


let showMoveTo = ref(false)
const moveToId = ref(null)
const moveInput = ref(null)
const targetName = ref("???")

async function enableMove() {
	showMoveTo.value = !showMoveTo.value
	await nextTick(() => {
		moveInput.value.focus()
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

	if (props.source === 'formula') {
		return route('api.admin.formulas.move', [props.sourceId])
	}

	return null
}

const canMoveTo = computed(() => {
	return targetName.value && targetName.value !== '???'
})

function moveTo() {
	if (targetName.value === "???") {
		flash.error(`Le ${props.target} n'existe pas.`)
		return
	}

	const urlData = {
		id: props.sourceId,
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
					duration: 10000
				}
			)
		})
		.catch((res) => {
			console.warn(res)
		})
}

function getTargetName() {
	axios
		.get(route(`api.${props.target}s.info`, [moveToId.value]))
		.then((res) => {
			targetName.value = res.data.title
		})
		.catch(() => {
			targetName.value = "???"
		})
}

watchDebounced(
	moveToId,
	getTargetName,
	{
		debounce: 500,
		maxWait: 1000
	}
)
</script>
<template>
	<div>
		<div class="flex flex-col gap-3 items-center">
			<sc-button
				outline
				type="edit"
				xs
				@click="enableMove"
			>
				<i class="bi bi-upload" />move
			</sc-button>
		</div>

		<dialog-modal
			v-model="showMoveTo"
			class="max-w-sm h-auto"
		>
			<template #header>
				<h1 class="text-xl p-3">
					déplacer {{ source }} vers {{ target }}
				</h1>
			</template>
			<div class="p-3">
				<div class="flex items-end">
					<form-maker
						ref="moveInput"
						v-model.number="moveToId"
						:label="`${source} vers ${target}`"
						class="rounded-r-none "
						font-code
						type="id"
						with-icon
						@enter="moveTo"
						@input="targetName = '???'"
					/>
				</div>
				<div
					v-if="showMoveTo"
					class="text-gray-400 italic flex gap-3 text-xs"
				>
					<i class="bi bi-chevron-double-right" />
					<div v-katex.auto="targetName" />
				</div>
			</div>
			<template #footer>
				<div class="flex justify-end p-3">
					<sc-button
						:disabled="!canMoveTo"
						type="primary"
						@click="moveTo"
					>
						déplacer
					</sc-button>
				</div>
			</template>
		</dialog-modal>
	</div>
</template>
