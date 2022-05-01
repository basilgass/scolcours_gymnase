<template>
	<div class="text-center py-10">
		<div class="text-4xl">
			Gymnase
		</div>
		<div class="text-sm">
			powered by Scolcours
		</div>
	</div>


	<div class="mt-10 text-center text-lg">
		<Link href="/challenge">
			Vers les quizz / challenge
		</Link>
	</div>

	<div class="my-10">
		<div
			class="
		grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
		gap-6 p-6"
		>
			<Link
				v-for="(theme, index) in themes"
				:key="theme.slug"
				:class="'scolcours-'+theme.slug + ' ' + (index%2===0?'rotate-1':'-rotate-1')"
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
	</div>
</template>
<script>
import LayoutFullpage from "@/Pages/Shared/LayoutFullpage"

export default {
	layout: LayoutFullpage,
}

</script>
<script setup>
defineProps({
	canLogin: Boolean,
	canRegister: Boolean,
	themes: Array
}
)
</script>
