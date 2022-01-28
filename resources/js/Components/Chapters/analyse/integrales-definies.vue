<template>
	<section ref="root">
		<integrales-definies-riemann v-show="false" />
		
		<integrales-definies-aire-borne-racine />
	</section>
</template>

<script setup>
/** Chapter
 * title: intégrales définies
 * body: Le calcul des aires d'un domaine borné.
 */

/** Chapter
 * title: intégrales définies
 * body: Le calcul des aires d'un domaine borné.
 */
/** Chapter
 * title: intégrales définies
 * body: Le calcul des aires d'un domaine borné.
 */
import { onMounted, ref } from 'vue'
import IntegralesDefiniesAireBorneRacine
	from '@/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesAireBorneRacine'
import IntegralesDefiniesRiemann from '@/Components/Chapters/analyse/integrales-definies/IntegralesDefiniesRiemann'

const root = ref(null)

onMounted(() => {
	katexAutoRender(root.value)
})

</script>

