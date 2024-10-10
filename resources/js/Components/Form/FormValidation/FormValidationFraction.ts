import { Fraction } from "pimath"
import { unref } from "vue"

export function FormValidationFraction(value: string | number): string {
	if (value) {
		try {
			new Fraction(unref(value))
		} catch {
			return "La valeur entrée ne correspond pas à une fraction valide"
		}
	}
	return ""
}
