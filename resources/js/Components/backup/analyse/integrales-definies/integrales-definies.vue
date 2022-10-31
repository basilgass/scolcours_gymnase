<template>
	<section ref="root">
		<integrales-definies-riemann v-show="false" />

		<div class="space-y-10">
			<integrales-definies-aire-parabole />

			<integrales-definies-aire-parabole-neg />

			<integrales-definies-aire-borne-racine />

			<integralles-definies532 />
		</div>
	</section>
</template>

<script setup>
/** Chapter
 * title: intégrales définies
 * body: Le calcul des aires d'un domaine borné.
 */
import {onMounted, ref} from "vue"
import IntegralesDefiniesRiemann
	from "@/Components/Chapters/analyse/integrales-definies/partials/IntegralesDefiniesRiemann"
import IntegralesDefiniesAireParabole
	from "@/Components/Chapters/analyse/integrales-definies/partials/IntegralesDefiniesAireParabole"
import IntegralesDefiniesAireParaboleNeg
	from "@/Components/Chapters/analyse/integrales-definies/partials/IntegralesDefiniesAireParaboleNeg"
import IntegralesDefiniesAireBorneRacine
	from "@/Components/Chapters/analyse/integrales-definies/partials/IntegralesDefiniesAireBorneRacine"
import IntegrallesDefinies532 from "@/Components/Chapters/analyse/integrales-definies/partials/IntegrallesDefinies532"

const root = ref(null)

onMounted(() => {
	katexAutoRender(root.value)
})

</script>

