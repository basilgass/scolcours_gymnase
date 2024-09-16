import { unref } from "vue"
import  PiMath from "pimath"

export function FormValidationVector(value: string | number): string {
	if (value) {
		try {
			new PiMath.Geometry.Vector(unref(value))
		} catch {
			return "La valeur entrée ne correspond pas à un vecteur valide"
		}
	}
	return ""
}
