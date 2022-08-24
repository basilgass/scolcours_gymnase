<template>
	<h1 class="text-3xl pt-5 mb-10">
		Admin dashboard
	</h1>

	<div class="grid grid-cols-4 gap-3">
		<Panel class="min-h-[10em]">
			<Link href="/admin/pages">
				Gestion des pages
			</Link>
		</Panel>

		<Panel class="min-h-[10em]">
			<Link href="/admin/users">
				Gestion des utilisateurs
			</Link>
		</Panel>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import Panel from "@/Components/Ui/Panel"
</script>
