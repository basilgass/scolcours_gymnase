<script
	setup
	lang="ts"
>

import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })
defineProps({
	body: String
})

</script>

<template>
	<div class="grid place-items-center w-full h-[400px]">
		<div>
			<h1 class="text-3xl text-gray-600">
				Erreur
			</h1>

			<div>{{ body }}</div>

			<div class="text-center">
				<InertiaLink
					class="btn bg-white mt-10"
					href="/"
				>
					Retour à l'accueil
				</InertiaLink>
			</div>
		</div>
	</div>
</template>
