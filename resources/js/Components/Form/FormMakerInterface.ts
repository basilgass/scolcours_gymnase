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
	"fraction" |
	"vector"
	;

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
	message?: string;
	messageClass?: string;
	placeholder?: string;
	prepend?: string;
	resizable?: boolean;
	sm?: boolean;
	step?: number | string;
	type?: FormMakerInputsType;
	withIcon?: boolean | string;
	axios?: {
		model: "Post" | "Block" | "Question" | "Chapter",
		id: number,
		column: string,
		button?: boolean | string
	},
	fromUrl?: string;
	clearable?: boolean;
}
