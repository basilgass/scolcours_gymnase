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
	autoSize?: boolean;
	focus?: boolean;
	fontCode?: boolean;
	inlineLabel?: boolean;
	inputClass?: string;
	label?: string;
	labelAsPlaceholder?: boolean;
	labelClass?: string;
	language?: "javascript" | "latex" | "json";
	max?: number | string;
	message?: string;
	messageClass?: string;
	min?: number | string;
	modelValue?: string | number | boolean;
	placeholder?: string;
	prepend?: string;
	resizable?: boolean;
	rows?: number | string;
	sm?: boolean;
	step?: number | string;
	type?: FormMakerInputsType;
	withIcon?: boolean | string;
	axios?: {
		model: "Post" | "Question" | "Chapter",
		id: number,
		column: string
	};
}
