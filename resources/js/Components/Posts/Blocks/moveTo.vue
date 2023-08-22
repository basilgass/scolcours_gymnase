<template>
	<div>
		<button
			class="btn btn-xs self-end"
			@click="enableMove"
		>
			déplacer le {{ props.source }}
		</button>
		<div class="flex">
			<form-input
				v-if="showMoveTo"
				ref="moveInput"
				v-model.number="moveToId"
				name="deplacer_vers"
				label="déplacer vers..."
				inline
				sm
				class="rounded-r-none max-w-[4em]"
				@enter="moveTo"
			/>
			<button
				v-if="showMoveTo"
				class="btn btn-xs rounded-l-none"
				@click="moveTo"
			>
				OK
			</button>
		</div>
	</div>
</template>
<script setup>

import {inject, nextTick, ref} from "vue"
import FormInput from "@/Components/Form/FormInput.vue"

const flash = inject("flash"),
	props = defineProps({
		source: {type: String, required: true},
		sourceId: {type: Number, required: true},
		target: {type: String, required: true}
	})

const emits = defineEmits(["moved"])

let showMoveTo = ref(false),
	moveToId = ref(null),
	moveInput = ref(null),
	enableMove = async function(){
		showMoveTo.value = !showMoveTo.value
		nextTick(()=>{
			moveInput.value.focus()
		})

	},
	moveTo = function(){
		axios.patch(route(`${props.source}s.moveTo.${props.target}`,
			[props.sourceId, moveToId.value]),
			{_method: "PATCH"})
			.then(res=>{
				flash.success(`Le ${props.source} a bien été déplacé.`, {
						url: res.data.url,
						label: res.data.label
					},
					10000)
				// router.visit(res.data)
				emits("moved")

			})
			.catch(res=>{
				console.log(res)
			})
	}
</script>
