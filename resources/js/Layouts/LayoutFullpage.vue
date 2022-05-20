<template>
	<div class="min-h-screen flex flex-col bg-gray-100">
		<main class="container mx-auto flex-1">
			<slot />
		</main>

		<MainFooter />
	</div>
</template>

<script>
import MainFooter from "@/Components/MainFooter"

export default {
	name: "LayoutFullpage",
	components: {MainFooter}
}
</script>

