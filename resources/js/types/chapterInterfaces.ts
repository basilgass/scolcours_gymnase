import type { BlockInterface } from "@/types/blockInterfaces.ts"

export interface ThemeNameInterface {
	id: number,
	slug: string
}

export interface ThemeInterface {
	color: string
	enabled: boolean
	icon: string
	id: number
	order: number
	slug: string
	title: string
}

export interface ChapterInterface {
	active: boolean;
	block: {
		id: number,
		body: string
	},
	id: number;
	meta_title: string;
	modified: string;
	slug: string;
	theme_id: number;
	title: string;
	updated_at: string;
	url: string;
}

export interface ChapterShowInterface extends ChapterInterface {
	block: BlockInterface;
}
