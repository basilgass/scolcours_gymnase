<template>
	<div>
		<div
			v-if="mathOutput"
			class="grid grid-cols-1 min-h-[50px]"
		>
			<div
				v-katex.ascii.left.nomargin="props.modelValue"
				class="self-center"
			/>
		</div>
		<div
			v-if="textOutput"
			class="grid grid-cols-1 min-h-[40px] italic"
		>
			<div
				
				class="self-center"
				v-text="props.modelValue"
			/>
		</div>
		<div
			ref="root"
			class="grid gap-2 keyboard"
			:class="keyboardData.grid??'grid-cols-4'"
		>
			<button
				v-for="(key, index) of keyboardComputed"
				:key="`key-${key.key}-${index}`"
				class="key"
				:class="`${key.span} ${key.visible?'invisible':''}`"
				@click="ButtonKeyClick(key)"
			>
				<span
					v-if="key.type==='math'"
					v-katex.clear="key.display"
				/>
				<i
					v-else-if="key.type==='icon'"
					:class="key.display"
				/>
			</button>
		</div>
		
		<div v-if="validate">
			<button
				class="btn btn-success"
				@click="$emit('validate')"
			>
				Valider
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { keyboardKeys, keyboards } from '@/keyboards'

const emit = defineEmits(['update:modelValue', 'validate'])
const props = defineProps({
	modelValue: String,
	keyboard: { type: [Object, String], default: () => 'simple' },
	validate: { type: Boolean, default: false },
	mathOutput: { type: Boolean, default: false },
	textOutput: { type: Boolean, default: false },
})

let root = ref(null),
	keyboardGrid = ref('grid-cols-4'),
	keyStrokes = ref([])

let keyboardData = computed(() => {
	if (typeof props.keyboard === 'string' && keyboards[props.keyboard] !== undefined) {
		return keyboards[props.keyboard]
	} else {
		return props.keyboard
	}
})

let keyboardComputed = computed(() => {
	let data = []
	
	// Loop through all keyboard keys in the layout.
	for (let key of keyboardData.value.layout) {
		let kkey = typeof key === 'string' ? key : key[0],
			spankey = typeof key === 'string' ? 0 : key[1],
			kdata = {}
		
		if (spankey === 2) {
			spankey = 'col-span-2'
		} else if (spankey === 3) {
			spankey = 'col-span-3'
		} else if (spankey === 4) {
			spankey = 'col-span-4'
		} else if (spankey === 5) {
			spankey = 'col-span-5'
		}
		
		kdata = {
			key: kkey,
			visible: kkey === '',
			type: keyboardKeys[kkey] === undefined ? false : keyboardKeys[kkey].type,
			display: keyboardKeys[kkey] === undefined ? false : keyboardKeys[kkey].display,
			span: spankey
		}
		
		if (keyboardKeys[kkey] === undefined) {
			kdata.fn = (key) => props.modelValue + ''
		} else {
			if (keyboardKeys[kkey].fn === undefined) {
				kdata.fn = (value) => value + kkey
			} else {
				kdata.fn = keyboardKeys[kkey].fn
			}
		}
		
		// Overrides existing values.
		if (keyboardData.value.keys !== undefined && keyboardData.value.keys[kkey] !== undefined) {
			kdata.type = keyboardData.value.keys[kkey].type === undefined ? kdata.type : keyboardData.value.keys[kkey].type
			kdata.display = keyboardData.value.keys[kkey].display === undefined ? kdata.display : keyboardData.value.keys[kkey].display
			kdata.fn = keyboardData.value.keys[kkey].fn === undefined ? kdata.fn : keyboardData.value.keys[kkey].fn
		}
		
		data.push(kdata)
	}
	return data
})

function resetKeyStrokes () {
	keyStrokes.value = []
	emit('update:modelValue', '')
}

function ButtonKeyClick (key) {
	if (key.key === '@back') {
		keyStrokes.value.pop()
	} else if (key.key === '@reset') {
		resetKeyStrokes()
	} else {
		keyStrokes.value.push(key)
	}
	
	let output = ''
	emit('update:modelValue', keyStrokes.value.map(k => k.fn(output)).join(''))
}

onMounted(() => {
	katexAutoRender(root.value)
})

defineExpose({ resetKeyStrokes })
</script>
<style scoped>

</style>