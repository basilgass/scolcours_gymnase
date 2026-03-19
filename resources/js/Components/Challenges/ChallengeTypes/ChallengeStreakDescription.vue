<script setup lang="ts">

import {ChallengeInterface} from "@/types/challengeInterfaces.ts"

defineProps<{
	challenge: ChallengeInterface
}>()
</script>

<template>
	<div>
		<div class="list-inside">
			<li>
				Répondre correctement le plus longtemps possible.
			</li>
			<li>
				1 erreur = fin de partie.
			</li>
			<li>
				Le score correspond au nombre de bonnes réponses consécutives.
			</li>
		</div>
	</div>
</template>

<style scoped>

</style>