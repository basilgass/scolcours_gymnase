<script
	setup
	lang="ts"
>
import "@/Layouts/LayoutProjection.vue"
import DarkModeSwitch from "@/Components/Ui/DarkModeSwitch.vue"
</script>

<template>
	<div class="min-h-screen relative">
		<footer
			class="bg-content
			w-full py-1 px-4
			flex justify-between items-baseline
			fixed bottom-0 left-0 "
			v-admin
		>
			<InertiaLink
				class="uppercase"
				:href="route('admin.index')"
			>
				administration
			</InertiaLink>

			<dark-mode-switch />
		</footer>
		<main class="w-[100vw] h-[100vh]">
			<slot />
		</main>
	</div>
</template>
