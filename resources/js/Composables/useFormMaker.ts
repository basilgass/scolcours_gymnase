import {ref, type Ref} from "vue"
import type {FormElementExpose} from "@/Components/Form/FormMakerInterface.ts"

type Focusable = HTMLElement | { focus: () => void }

export function useFormMaker(inputRef: Ref<Focusable | null>) {
	const errors = ref<string[]>([])

	const expose: FormElementExpose = {
		focus: () => (inputRef.value as Focusable)?.focus?.(),
		validate: () => errors.value
	}

	return {errors, expose}
}
