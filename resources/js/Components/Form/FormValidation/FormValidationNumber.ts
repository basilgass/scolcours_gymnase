import { unref } from "vue"
import type { FormMakerPropsType } from "@/Components/Form/FormMakerInterface"

export function FormValidationNumber(value: string | number, props: FormMakerPropsType): string {
		if (props.min !== null && +unref(value) < +props.min) {
			return "La valeur doit être supérieure à " + props.min
		}
		if (props.max !== null && +unref(value) > +props.max) {
			return "La valeur doit être inférieure à " + props.max
		}
}
