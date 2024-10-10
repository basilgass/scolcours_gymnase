import { Vector } from "pimath"
import { unref } from "vue"

export function FormValidationVector(value: string | number): string {
	if (value) {
		try {
			new Vector(unref(value))
		} catch {
			return "La valeur entrée ne correspond pas à un vecteur valide"
		}
	}
	return ""
}
