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
		<a href="/quizz">Vers les quizz</a>
	</div>
	<div class="mt-10">
		<div
				class="bg-white border rounded-3xl
		grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
		gap-6 p-6"
			>
			<a
					v-for="(theme, index) in themes"
					:key="theme.slug"
					:class="'scolcours-'+theme.slug + ' ' + (index%2===0?'rotate-1':'-rotate-1')"
					:href="'/'+theme.slug"
					class="text-center text-lg font-thin whitespace-nowrap
			rounded border py-24
			text-white
			cursor-pointer
			transform hover:scale-105 hover:rotate-0 duration-300"
				>
				<i :class="`bi bi-${theme.icon} mr-2`" />
				{{ theme.title }}
			</a>
		</div>
	</div>
</template>

<script>
	import LayoutFullpage from "@/Pages/LayoutFullpage"

	export default {
		name: "Welcome",
		layout: LayoutFullpage,
		props: {
			canLogin: Boolean,
			canRegister: Boolean,
			themes: Array
		}
	}
</script>
