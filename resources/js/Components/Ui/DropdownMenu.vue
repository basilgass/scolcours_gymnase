<script setup lang="ts">

import { ref } from "vue"

let props = defineProps({
	preventClose: {type: Boolean, default: false}
})
let showMenu = ref(false),
	onMenuClick = function () {
		if (props.preventClose) {
			return
		}

		showMenu.value = !showMenu.value
	}
</script>
<template>
	<div
		class="relative"
	>
		<div
			@click="showMenu = !showMenu"
			class="cursor-pointer"
		>
			<slot name="button" />
		</div>

		<!-- Backdrop to autoclose the menu -->
		<div
			v-if="showMenu"
			class="z-10 fixed inset-0 bg-transparent"
			@click="showMenu = false"
		/>

		<!-- Menu slot -->
		<transition name="fade">
			<div
				v-if="showMenu"
				class="w-40 z-20
						flex flex-col text-left space-y-1 py-2
						absolute top-5 -right-1 bg-white text-gray-800 border-gray-200 rounded shadow-lg"
				@click="onMenuClick"
			>
				<slot />

				<div
					v-if="$slots.footer"
					class="border-t"
				>
					<slot name="footer" />
				</div>
			</div>
		</transition>
	</div>
</template>
