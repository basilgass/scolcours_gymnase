<script setup lang="ts">

import {useDark, useToggle} from "@vueuse/core"

const isDark = useDark()
// isDark.value = false
const toggleDark = useToggle(isDark)
toggleDark(false)


</script>

<template>
	<div
		class="flex items-baseline cursor-pointer"
		@click="toggleDark()"
	>
		<div

			class="hover:-rotate-[120deg] duration-500 cursor-pointer p-3"
		>
			<i :class="isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill'" />
		</div>
		<div>mode {{ isDark ? "sombre" : "clair" }}</div>
	</div>
</template>

<style scoped lang="postcss">

</style>
