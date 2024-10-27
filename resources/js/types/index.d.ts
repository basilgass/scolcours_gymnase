import { ChapterMinInterface, type QuestionMinInterface } from "@/types/modelInterfaces"
import { ComputedRef } from "vue"

export interface User {
	id: number
	name: string
	firstname: string
	fullname: string
	email: string
	email_verified_at: string
	role: string
}

export interface ThemeInterface {
	id: string
	slug: string
	title: string
	color: string
	icon: string
	enabled: boolean
}

export interface ToolInterface {
	id: number
	slug: string
	title: string
	body: string
	parameters: string
	updated_at: string
}

export type PageProps<
	T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
	auth: {
		user: User
		can: {
			admin: boolean
		}
	}
	scolcours: { title: string }
	theme: ThemeInterface
	themes: ThemeInterface[]
	chapter: ChapterMinInterface
}

export interface flashLink {
	url: string
	label: string
	external?: boolean
}

type flashType = "success" | "info" | "error"

interface flashMessageInterface {
	id: number
	message: string
	type: flashType
	config: flashConfig
}

interface flashConfig {
	link?: { label: string, external?: boolean, url: string }
	timeout?: number
}

export interface flashInterface {
	add: (
		message: string,
		link?: flashLink,
		type?: string,
		timeout?: number
	) => void
	success: (message: string, config?: flashConfig) => void
	info: (message: string, config?: flashConfig) => void
	error: (message: string, config?: flashConfig) => void
}

export interface userAnswerInterface {
	value: {
		input: string,
		tex: string,
		raw: string
	},
	validation: {
		index: number,
		result: boolean,
		message: string
	}
}

export interface editModeInterface {
	enabled: ComputedRef<boolean>
	toggle: () => void
}

export interface generatedQuestionInterface {
	question: string
	answer: string
	title?: string
	keyboard?: string
	button?: object
	reset: boolean
}

export interface generatorResultInterface {
	code: string
	question: (value?: generatedQuestionInterface) => QuestionMinInterface
	list: (n: number) => generatedQuestionInterface[]
	random: () => generatedQuestionInterface
}


export interface resultInterface {
	pivot: {
		answer: string
		result: boolean
	}
}

export interface ClipboardKeyboardInterface {
	title: string
	body: string
	css: string
	answer: string
	keyboard: string
}

export interface buttonInterface {
	show: boolean
	icon: string
	text: string
}

export interface buttonsInterface {
	reset?: buttonInterface
	random?: buttonInterface
}

export interface BlockScriptType {
	btn?: buttonsInterface
	reset?: boolean
}

export type SCRIPT_TYPE = Record<string, string> & BlockScriptType
