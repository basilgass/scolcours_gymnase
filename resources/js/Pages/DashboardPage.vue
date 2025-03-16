<script
	setup
	lang="ts"
>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { ChapterInterface } from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/scButton.vue"

interface DashboardInterface extends ChapterInterface {
	maxPost: number,
	currentPost: number,
}
defineOptions({ layout: LayoutMain })

// TODO: amélioer le dashboard
defineProps<{
	courses: DashboardInterface[]
}>()


</script>
<template>
	<section class="">
		<div class="flex flex-col mt-2">
			<div class="font-extralight uppercase -mb-1">
				profil de
			</div>
			<div class="text-3xl">
				{{ $page.props.auth.user.fullname }}
			</div>
		</div>

		<div
			v-admin
			class="flex  my-3"
		>
			<sc-button
				type="admin"
				href="/admin/"
				class="hover:underline"
			>
				Administration
			</sc-button>
		</div>
	</section>
</template>
