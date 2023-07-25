<!--
Un bouton pour se déloguer, tout simple, sans mise en forme.
-->
<template>
	<Link
		as="button"
		class="text-left px-3 py-2 whitespace-nowrap"
		href="/logout"
		method="post"
	>
		<i class="bi bi-box-arrow-right mr-2" />se déconnecter
	</Link>
</template>
<script>
export default {
	name: "LogoutButton"
}
</script>
