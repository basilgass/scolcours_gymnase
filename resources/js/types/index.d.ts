import { ChapterInterface, type QuestionDynamicInterface, ThemeInterface, User } from "@/types/modelInterfaces"
import {AxiosError, AxiosResponse} from "axios"
import { ComputedRef } from "vue"


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
	chapter: ChapterInterface
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

export interface KbrdEvent {
	input: string,
	tex: string,
	raw: string
}

export interface userAnswerInterface {
	value: keyboardEvent,
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
	question: (value?: generatedQuestionInterface) => QuestionDynamicInterface
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

export interface AxiosResponseModel<T> extends  AxiosResponse {
	data: T
}
export interface AxiosErrorMessage extends AxiosError {
	response: {data: {message: string}}
}
