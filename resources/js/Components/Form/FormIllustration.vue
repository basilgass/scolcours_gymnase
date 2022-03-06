<template>
	<form-field>
		<form-label
			:label="label"
			:name="name"
		/>
		<div class="grid grid-cols-3 gap-3">
			<div class="grid grid-flow-row gap-3 content-start">
				<button
					class="btn"
					:class="illustrationMode==='image'?'bg-amber-200':'bg-white'"
					@click.prevent="illustrationMode='image'"
				>
					Image
				</button>
				<button
					class="btn"
					:class="illustrationMode==='draw'?'bg-amber-200':'bg-white'"
					@click.prevent="illustrationMode='draw'"
				>
					Draw
				</button>
				<button
					class="btn"
					:class="illustrationMode==='component'?'bg-amber-200':'bg-white'"
					@click.prevent="illustrationMode='component'"
				>
					Component
				</button>
			</div>
			<div
				v-if="illustrationMode==='image'"
				class="col-span-2 border-dashed border-gray-200 border-2 rounded h-full w-full grid grid-cols-1 text-center items-center"
			>
				Glisser / déposer une image
			</div>
			<div
				v-else-if="illustrationMode==='draw'"
				class="col-span-2 h-full w-full"
			>
				<form-textarea
					:hide-label="true"
					name="drawData"
					rows="10"
				/>
			</div>
			<div v-else>
				Something else ?
			</div>
		</div>
	</form-field>
</template>

<script setup>
import FormField from '@/Components/Form/FormField'
import FormLabel from '@/Components/Form/FormLabel'
import { ref } from 'vue'
import FormTextarea from '@/Components/Form/FormTextarea'

defineEmits(['update:modelValue', 'inputFocus'])
let props = defineProps({
	modelValue: { type: String, default: null },
	active: { type: Boolean, default: false },
	name: { type: String, required: true },
	label: { type: String, default: '' },
	error: { type: String, default: '' },
	focus: { type: Boolean, default: false }
})

let inp = ref(null),
	illustrationMode = ref('image')

</script>
