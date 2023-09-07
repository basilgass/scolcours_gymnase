<template>
	<div class="grid place-items-center w-full h-[400px]">
		<div>
			<h1 class="text-3xl text-gray-600">
				Erreur
			</h1>

			<div>{{ body }}</div>

			<div class="text-center">
				<Link
					class="btn bg-white mt-10"
					href="/"
				>
					Retour à l'accueil
				</Link>
			</div>
		</div>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>

const props = defineProps({
	body: String
})

</script>
