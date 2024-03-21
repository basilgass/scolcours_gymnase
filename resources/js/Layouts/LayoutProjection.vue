<script setup lang="ts">
import "@/Layouts/LayoutProjection.vue"
import LayoutProjection from "@/Layouts/LayoutProjection.vue"

defineOptions({layout: LayoutProjection})

</script>

<template>
	<div class="min-h-screen flex flex-col bg-gray-100">
		<header
			v-admin
			v-theme.bg.admin.text
			class="py-2 px-4 flex justify-between"
		>
			<Link
				class="uppercase"
				:href="route('admin')"
			>
				administration
			</Link>

			<!--			<button-->
			<!--				class="btn btn-xs hover:text-black"-->
			<!--				:class="globalEditMode?'bg-white/40':''"-->
			<!--				title="Ctrl+Alt+A"-->
			<!--				@click="globalEditMode=!globalEditMode"-->
			<!--			>-->
			<!--				<span v-show="globalEditMode"> <i class="bi bi-pencil mr-2" /> <span-->
			<!--					class="hidden md:inline"-->
			<!--				>édition activée</span></span>-->
			<!--				<span v-show="!globalEditMode"> <i class="bi bi-pencil mr-2" /> <span>activer l'édition</span></span>-->
			<!--			</button>-->
		</header>
		<main class="w-full flex-1">
			<slot />
		</main>
	</div>
</template>

