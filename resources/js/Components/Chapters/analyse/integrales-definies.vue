<template>
	<section ref="root">
		Texte à remplire...
	</section>
</template>

<script setup>
/** Chapter
 * title: intégrales définies
 * body: Le calcul des aires d'un domaine borné.
 */

import { onMounted, ref } from 'vue'

const root = ref(null)

onMounted(() => {
	katexAutoRender(root.value)
})

</script>

