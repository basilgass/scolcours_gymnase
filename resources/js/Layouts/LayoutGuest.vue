<script setup lang="ts">
import ScolCoursLogo from "@/Components/ScolcoursLogo.vue"
import Card from "@/Components/Ui/Card.vue"
import {router} from "@inertiajs/vue3"

</script>

<template>
	<div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
		<ScolCoursLogo
			class="cursor-pointer"
			@click="router.visit(route('scolcours.index'))"
		/>

		<Card class="min-w-md max-w-lg mx-auto">
			<slot />
		</Card>
	</div>
</template>
