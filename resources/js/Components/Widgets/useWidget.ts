import {computed, ref, toRefs} from "vue"
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {Random} from "pimath"

// TODO: rework all widget to work with useWidget
export function useWidget<T extends number | string>(
	props: { illustration: WidgetPropsInterface },
	keyType: 'number' | 'string' = 'string'
) {

	const {illustration} = toRefs(props)

	function setCipherKey(): T {
		if (Object.hasOwn(parameters.value, 'key')) {
			return keyType === 'string'
				? parameters.value['key'] as T
				: +parameters.value['key'] as T
		}
		return keyType === 'string'
			? 'key' as T
			: Random.number(3, 20) as T
	}


	const parameters = computed(() => {
		const dict: Record<string, string | boolean> = {}
		illustration.value.parameters.split(',').map(x => x.trim()).forEach(param => {
			const [key, ...value] = param.split('=')

			dict[key] = value.join('=')

			if (dict[key] === "") dict[key] = true
		})

		return dict
	})

	const cipherKey = ref<T>(setCipherKey())


	return {parameters, cipherKey}
}
