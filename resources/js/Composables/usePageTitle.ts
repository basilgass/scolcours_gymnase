import {computed} from "vue"
import {usePage} from "@inertiajs/vue3"

export function usePageTitle() {
	const page = usePage()

	const title = computed(() =>
		page.props.meta?.title ?? page.props.theme?.title ?? null
	)

	return {title}
}
