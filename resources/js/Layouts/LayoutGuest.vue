<template>
	<div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
		<ScolCoursLogo />

		<div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
			<slot />
		</div>
	</div>
</template>

<script>
import BreezeApplicationLogo from "@/Components/Auth/ApplicationLogo.vue"
import {Link} from "@inertiajs/vue3"
import ScolCoursLogo from "@/Components/ScolcoursLogo.vue"

export default {
	components: {
		ScolCoursLogo,
		BreezeApplicationLogo,
		Link,
	}
}
</script>
