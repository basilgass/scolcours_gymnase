<template>
	<Link
		v-for="theme of $page.props.themes"
		:key="`anchor-${theme.slug}`"
		:href="route('theme', theme.slug)"
		class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
		@click="emit('ClickNavigationLinks')"
	>
		<i
			:class="`bi-${theme.icon}`"
			class="mr-2"
		/>{{ theme.title }}
	</Link>
</template>
<script setup>

let emit = defineEmits(["ClickNavigationLinks"])

</script>
