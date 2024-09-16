import { unref } from "vue"
import  PiMath from "pimath"

export function FormValidationFraction(value: string | number): string {
	if (value) {
		try {
			new PiMath.Fraction(unref(value))
		} catch {
			return "La valeur entrée ne correspond pas à une fraction valide"
		}
	}
	return ""
}
