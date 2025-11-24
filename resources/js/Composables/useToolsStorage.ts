import {type IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {inject} from "vue"

export function useToolsStorage() {

	const toolSlug = inject('toolSlug')

	// Save or restore the input from sessionstorage
	const storeKey = `ScolCours-Tools-${toolSlug}`

	function storeTool(forms: IToolForm[]) {
		const data = forms.map(x => x.value.value)

		sessionStorage.setItem(storeKey, JSON.stringify(data))
	}

	function restoreTool(forms: IToolForm[]): IToolForm[] {
		const storedData = sessionStorage.getItem(storeKey)
		if (storedData) {
			const data: (string | number | boolean)[] = JSON.parse(storedData)

			if (data.length === forms.length) {
				data.forEach((value, index) => {
					forms[index].value.value = value
				})
			}
		}

		return forms
	}

	function resetTool() {
		sessionStorage.removeItem(storeKey)
	}

	function resetTools() {
		let n = sessionStorage.length
		while (n--) {
			const key = sessionStorage.key(n)
			if (key.startsWith('ScolCours-Tools-')) {
				sessionStorage.removeItem(key)
			}
		}
	}

	return {storeKey, storeTool, restoreTool, resetTool, resetTools}
}
