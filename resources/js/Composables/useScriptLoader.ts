import {SCRIPT_TYPE} from "@/types"
import PiMath from "pimath"
import {computed, isRef, MaybeRef, ref, unref} from "vue"
import {PiMathExt} from "@/PiMathExtended/PiMathExt.ts"


export function useScriptLoader(script: string, config?: {
	parent?: MaybeRef<SCRIPT_TYPE>
}) {
	const iteration = ref(0)
	const data = ref<SCRIPT_TYPE>({})

	const parentData = computed<SCRIPT_TYPE>(() => {
		if (config && config.parent) {
			if (isRef(config.parent)) {
				return config.parent.value as SCRIPT_TYPE
			} else {
				return config.parent as SCRIPT_TYPE
			}
		}

		return {}
	})

	const merged = computed<SCRIPT_TYPE>(() => {
		return {
			...unref(parentData),
			...unref(data)
		}
	})

	const hasData = computed(() => {
		return Object.keys(data.value).length > 0
	})

	function run(): void {
		iteration.value++
		if (script) {
			try {
				const F = new Function("PiMath", "PiMathExt", "iteration", "parentData", script)
				data.value = F(PiMath, PiMathExt, iteration.value, parentData.value)
			} catch (e) {
				console.log("Script loader error", e)
				data.value = {}
			}
		}
	}

	function reset(): void {
		iteration.value = 0
		run()
	}

	return {iteration, run, reset, data, merged, hasData}
}
