export interface WidgetInterface {
	id: number,
	component: string,
	slug: string,
	name: string,
	theme_id: number | null,
	description: string,
	control: boolean
}

export interface WidgetPropsInterface {
	code: string;
	parameters: string;
}
