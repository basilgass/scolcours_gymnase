import {
	ChapterInterface,
	IllustrationMinInterface,
	type QuestionDynamicInterface,
	ThemeInterface,
	User
} from "@/types/modelInterfaces"
import {AxiosError, AxiosResponse} from "axios"
import {ComputedRef, Ref} from "vue"
import {GeneratorParams} from "@/Composables/useGenerator.ts"

export type ThemesSlug =
	"algebre" |
	"analyse" |
	"geometrie" |
	"statistiques" |
	"jeux" |
	"tools" |
	"arithmetique"


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
	meta: { title: string | null }
}

export interface flashLink {
	external?: boolean
	label: string
	url: string
}

type flashType = "success" | "info" | "error"

export interface flashMessageInterface {
	config: flashConfig
	id: string
	message: string
	type: flashType
}

interface flashConfig {
	duration?: number,
	link?: { label: string, external?: boolean, url: string }
	show?: boolean
	tex?: boolean,
	title?: string
}

export interface flashInterface {
	add: (
		message: string,
		link?: flashLink,
		type?: string,
		duration?: number
	) => void
	error: (message: string, config?: flashConfig) => void
	info: (message: string, config?: flashConfig) => void
	success: (message: string, config?: flashConfig) => void
}

export interface KbrdEvent {
	input: string,
	raw: string
	tex: string,
}

export interface userAnswerInterface {
	validation: {
		index: number,
		result: boolean,
		message: string
	}
	value: keyboardEvent,
}

export interface editModeInterface {
	enabled: ComputedRef<boolean>
	toggle: () => void
}

export interface generatedQuestionInterface {
	question: string
	answer: string
	button?: object
	illustration?: IllustrationMinInterface
	keyboard?: string
	validation?: string
	reset?: boolean
	title?: string
}

export interface generatorResultInterface {
	code: string
	level: Ref<number>
	list: (n: number) => QuestionDynamicInterface[]
	question: (value?: generatedQuestionInterface, params?: GeneratorParams) => QuestionDynamicInterface
	random: () => generatedQuestionInterface,
}


export interface resultInterface {
	pivot: {
		answer: string
		result: boolean
	}
}

export interface ClipboardKeyboardInterface {
	answer: string
	body: string
	css: string
	keyboard: string
	title: string
}

export interface buttonInterface {
	icon: string
	show: boolean
	text: string
}

export interface buttonsInterface {
	random?: buttonInterface
	reset?: buttonInterface
}

export interface BlockScriptType {
	btn?: buttonsInterface
	reset?: boolean
}

export type SCRIPT_TYPE = Record<string, string> & BlockScriptType

export interface AxiosResponseModel<T> extends AxiosResponse {
	data: T
}

export interface AxiosErrorMessage extends AxiosError {
	response: { data: { message: string } }
}
