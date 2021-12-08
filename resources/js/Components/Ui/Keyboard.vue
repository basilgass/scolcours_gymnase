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
				:class="keyboards[props.keyboard].grid"
			>
			<button
					v-for="(key, index) of keyboardData"
					:key="`key-${key.key}-${index}`"
					class="key"
					:class="`${key.span} ${key.visible?'invisible':''}`"
					@click="$emit('update:modelValue', key.fn(props.modelValue))"
				>
				<span
						v-if="key.type==='math'"
						v-katex="key.display"
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
import { onMounted, ref } from 'vue'
import { keyboardKeys, keyboards } from '@/keyboards'

defineEmits(['update:modelValue', 'validate'])
const props = defineProps({
	modelValue: String,
	keyboard: String,
	validate: { type: Boolean, default: false },
	mathOutput: { type: Boolean, default: false },
	textOutput: { type: Boolean, default: false },
})

let root = ref(null),
	keyboardData = ref([])

for(let key of keyboards[props.keyboard].keys){
	let kkey = typeof key==='string'?key:key[0],
		spankey = typeof key==='string'?0:key[1],
		kdata = {}
	
	if(spankey===2){
		spankey = 'col-span-2'
	}else if(spankey===3){
		spankey = 'col-span-3'
	}else if(spankey===4){
		spankey = 'col-span-4'
	}else if(spankey===5){
		spankey = 'col-span-5'
	}
	
	kdata = {
		key: kkey,
		visible: kkey==='',
		type: keyboardKeys[kkey]===undefined?false:keyboardKeys[kkey].type,
		display: keyboardKeys[kkey]===undefined?false:keyboardKeys[kkey].display,
		span: spankey
	}
	
	if (keyboardKeys[kkey]===undefined){
		kdata.fn = (key)=>props.modelValue+''
	}else{
		if(keyboardKeys[kkey].fn===undefined){
			kdata.fn = (value)=>value+kkey
		}else {
			kdata.fn = keyboardKeys[kkey].fn
		}
	}
	
	keyboardData.value.push(kdata)
}


onMounted(() => {
	katexAutoRender(root.value)
})
</script>
<style scoped>

</style>