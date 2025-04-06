<script setup lang="ts">
const m = `\\begin{pmatrix}
2 & 3 & 5 \\\\
2 & 3 & 5 \\\\
2 & 3 & 5 \\\\
\\end{pmatrix}`
</script>

<template>
	<div>
		<div
			class="matrix-col-2 matrix-row-2"
			v-katex="m"
		/>
	</div>
</template>

<style scoped>

</style>
