import {computed, toRefs} from "vue"
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"

// TODO: rework all widget to work with useWidget
export function useWidget(props: { illustration: WidgetPropsInterface }) {

	const {illustration} = toRefs(props)

	const parameters = computed(() => {
		const dict: Record<string, string | boolean> = {}
		illustration.value.parameters.split(',').map(x => x.trim()).forEach(param => {
			const [key, ...value] = param.split('=')

			dict[key] = value.join('=')

			if (dict[key] === "") dict[key] = true
		})

		return dict
	})


	return {parameters}
}
