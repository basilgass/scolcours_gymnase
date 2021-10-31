<template>
	<transition name="fade">
		<div
				v-show="$parent.showAside"
				class="fixed top-0 left-0 w-full h-full bg-black/60"
				@click="$parent.showAside=false"
			/>
	</transition>
	<transition name="slide-fade">
		<aside
				v-cloak
				v-show="$parent.showAside"
				class="fixed top-0 left-0 w-full z-50 sm:w-60 bg-black min-h-screen text-white"
			>
			<div class="space-y-1 py-2 text-sm">
				<div class="relative">
					<i
							class="absolute top-0 right-4 text-lg  text-gray-500 hover:text-white transition duration-300 bi bi-x-circle cursor-pointer"
							@click="$parent.showAside=false"
						/>
					<h3 class="text-lg mt-5 px-4">
						ScolCours
					</h3>
				</div>

				<a
						:href="route('home')"
						class="block
            transition duration-300
            hover:translate-x-2
            px-4 py-1"
					>accueil</a>
				<hr>
				<a
						v-for="theme of $page.props.themes"
						:key="`anchor-${theme.slug}`"
						:href="route('theme', theme.slug)"
						class="block transition duration-300 hover:translate-x-2 px-4 py-1"
					>
					<i
							:class="`bi-${theme.icon}`"
							class="mr-2"
						/>{{ theme.title }}
				</a>
				<hr>
			</div>
		</aside>
	</transition>
</template>

<script>
	export default {
		name: 'MainAside',
	}
</script>

