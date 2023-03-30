<template>
	<div class="space-y-10 bg-gray-100">
		<ScolCoursLogo class="py-10" />

		<div
			class="
		grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
		gap-6 p-6"
		>
			<Link
				v-for="(theme, index) in themes"
				:key="theme.slug"
				:class="'bg-scolcours-'+theme.slug + ' ' + (index%2===0?'rotate-1':'-rotate-1')"
				:href="'/'+theme.slug"
				class="
				grid grid-cols-1 gap-5 place-items-center
				text-xl font-thin whitespace-nowrap
				rounded border py-20
				text-white
				cursor-pointer
				transform hover:scale-105 hover:rotate-0 duration-300"
			>
				<i :class="`bi bi-${theme.icon} mr-2 text-3xl`" />
				{{ theme.title }}
			</Link>
		</div>

		<div class="space-y-10">
			<h2 class="text-center text-xl">
				Dernières mises à jour
			</h2>
			<div class="space-y-5">
				<div
					v-for="item of newChapters"
					:key="item.id"
					class="bg-white border border-gray-300 rounded py-2 px-3
						hover:shadow hover:translate-x-1 transition-all duration-500"
				>
					<div class="flex justify-between items-center mb-2">
						<h3 class="font-normal">
							<Link
								:href="item.url"
								class="hover:underline"
							>
								{{ item.title }}
							</Link>
						</h3>

						<div class="text-xs">
							{{ item.modified }}
						</div>
					</div>
					<div class="font-extralight">
						{{ item.body }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import LayoutFullpage from "@/Layouts/LayoutFullpage"

export default {
	layout: LayoutFullpage,
}

</script>
<script setup>
import {onMounted} from "vue"
import ScolCoursLogo from "@/Components/ScolcoursLogo"

let props = defineProps({
	canLogin: Boolean,
	canRegister: Boolean,
	themes: Array,
	newChapters: Array
})


</script>
