export interface IMacro {
	template: string
	math?: boolean,
	suffix?: boolean,
	space?: boolean
}

export type IMacroRecords = Record<string, IMacro>
