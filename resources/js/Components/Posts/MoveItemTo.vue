<script setup>
	import { inject, nextTick, ref } from "vue"
	import { watchDebounced } from "@vueuse/core"
	import FormWrapper from "@/Components/Form/FormWrapper.vue"

	const flash = inject("flash"),
		props = defineProps({
			source: { type: String, required: true },
			sourceId: { type: Number, required: true },
			target: { type: String, required: true },
		})

	const emits = defineEmits(["moved"])

	let showMoveTo = ref(false),
		moveToId = ref(null),
		moveInput = ref(null),
		targetName = ref(""),
		enableMove = async function () {
			showMoveTo.value = !showMoveTo.value
			nextTick(() => {
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
							url: res.data.url,
							label: res.data.label,
						},
						10000,
					)
					// router.visit(res.data)
					emits("moved", props.sourceId)
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
	<div class="flex gap-3 align-text-bottom">
		<button class="btn btn-xs self-end" @click="enableMove">
			déplacer le {{ props.source }}
		</button>

		<form-wrapper
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
		<div v-if="showMoveTo" v-katex.auto="targetName"></div>
	</div>
</template>
