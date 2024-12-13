<script lang="ts" setup>

import ScolCoursLogo from "@/Components/ScolcoursLogo.vue"
import LayoutFullpage from "@/Layouts/LayoutFullpage.vue"

defineOptions({layout: LayoutFullpage})

</script>


<template>
	<div class="space-y-10 bg-gray-100">
		<!--		<Head title="" />-->

		<ScolCoursLogo class="py-10 scale-150" />

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<InertiaLink
				v-for="(theme) in $page.props.themes"
				:key="theme.slug"
				:class="`bg-scolcours-${theme.slug}`"
				:href="'/' + theme.slug"
				class="aspect-[2] group
					transition-all duration-400 ease-in-out
					text-xl font-thin whitespace-nowrap text-white
					rounded hover:rounded-xl hover:shadow
					border overflow-hidden cursor-pointer
					hover:rotate-[-1deg] hover:scale-105
					grid grid-cols-1 place-items-center"
			>
				<div class="text-center space-y-5">
					<i
						:class="`${theme.icon}`"
						class="text-3xl block
							transition-all duration-400 ease-in-out"
					/>
					<div
						class="group-hover:text-right
								text-md group-hover:text-2xl
								transition-all duration-400 ease-in-out "
					>
						{{ theme.title }}
					</div>
				</div>
			</InertiaLink>
		</div>
	</div>
</template>
