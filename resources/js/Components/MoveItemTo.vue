<script setup lang="ts">
import FormMaker from "@/Components/Form/FormMaker.vue"
import { flashInterface } from "@/types"
import { watchDebounced } from "@vueuse/core"
import axios from "axios"
import { inject, nextTick, ref } from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const flash = inject<flashInterface>("flash"),
	props = defineProps({
		source: { type: String, required: true },
		sourceId: { type: Number, required: true },
		target: { type: String, required: true },
	})

let showMoveTo = ref(false),
	moveToId = ref(null),
	moveInput = ref(null),
	targetName = ref(""),
	enableMove = async function () {
		showMoveTo.value = !showMoveTo.value
		await nextTick(() => {
			moveInput.value.focus()
		})
	},
	moveTo = function () {
		if (targetName.value === "???") {
			flash.error(`Le ${props.target} n'existe pas.`)
			return
		}

		axios
			.patch(
				route(`${props.source}s.moveTo.${props.target}`, [
					props.sourceId,
					moveToId.value,
				]),
				{ _method: "PATCH" },
			)
			.then((res) => {
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
	},
	getTargetName = function () {
		axios
			.get(route(`${props.target}s.info`, [moveToId.value]))
			.then((res) => {
				targetName.value = res.data.title
			})
			.catch(() => {
				targetName.value = "???"
			})
	}

watchDebounced(moveToId, getTargetName, { debounce: 1000, maxWait: 2000 })
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
				déplacer le {{ props.source }}
			</sc-button>

			<form-maker
				with-icon
				type="id"
				v-if="showMoveTo"
				ref="moveInput"
				v-model.number="moveToId"
				class="rounded-r-none max-w-[6em]"
				label-as-placeholder
				sm
				font-code
				@enter="moveTo"
			/>
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
