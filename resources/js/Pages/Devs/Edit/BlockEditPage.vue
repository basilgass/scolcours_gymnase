<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import {ref} from "vue"
import BlockFormNoDlg from "@/Components/Posts/Blocks/BlockFormNoDlg.vue"

let props = defineProps({
	block: {type: Object, required: true},
})
let show = ref(true)
</script>

<template>
	<block-form-no-dlg
		v-model="show"
		:block="props.block.data"
	/>
</template>
