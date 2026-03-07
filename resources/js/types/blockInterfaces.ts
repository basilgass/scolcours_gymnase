import type { WidgetInterface } from "@/types/widgetInterfaces.ts"

export interface IllustrationMinInterface {
	widget: {
		component: string
	},
	parameters: string
	code: string,
}

export interface IllustrationInterface {
	block_id: number;
	code: string;
	css: string;
	id: number;
	isNew?: boolean;
	order: number;
	parameters: string;
	title: string;
	footer: string;
	widget: WidgetInterface;
	widget_id: number;
}

export interface BlockMinInterface {
	body: string
	id: number
	illustration: IllustrationInterface | null | undefined
	title: string
}

export interface BlockInterface {
	active: boolean;
	body: string;
	id: number;
	illustrations: IllustrationInterface[];
	illustrationsGrid: string;
	json: string;
	merge: boolean;
	order: number;
	script: string;
	switch: string | boolean;
	template: string;
	title: string;
	type: string;
}
