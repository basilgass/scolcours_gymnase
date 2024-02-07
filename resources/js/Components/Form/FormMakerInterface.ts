export type FormMakerInputsType =
	"id" |
	"text" |
	"email" |
	"password" |
	"number" |
	"textarea" |
	"select" |
	"checkbox" |
	"code" |
	"keyboard" |
	"switch" |
	"fraction";

export interface FormMakerPropsType {
	fontCode?: boolean;
	message?: string;
	inlineLabel?: boolean;
	inputClass?: string;
	label?: string;
	labelAsPlaceholder?: boolean;
	labelClass?: string;
	max?: number | string;
	min?: number | string;
	modelValue?: string | number | boolean;
	placeholder?: string;
	sm?: boolean;
	step?: number | string;
	type?: FormMakerInputsType;
	withIcon?: boolean | string;
	prepend?: string;
	focus?: boolean;
	language?: "javascript" | "latex" | "json";
	rows?: number | string;
	resizable?: boolean;
	autoSize?: boolean;
}
