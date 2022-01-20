<template>
	<Link
		as="button"
		class="text-left px-3 py-2"
		href="/logout"
		method="post"
	>
		se déconnecter
	</Link>
</template>
<script>
export default {
	name: 'LogoutButton'
}
</script>