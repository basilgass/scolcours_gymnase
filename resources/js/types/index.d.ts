import {ComputedRef} from "vue";

export interface User {
	id: number
	name: string
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
}

export interface ToolInterface {
    id: number,
    slug: string,
    title: string,
    body: string,
    parameters: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	auth: {
		user: User
        can: {
            admin: boolean
        }
    },
    theme: ThemeInterface,
    themes: ThemeInterface[]
}

export interface flashInterface {
    add: (message:string, link?:string, type?:string, timeout?:number)=>void,
    success:(message:string, link?:string, timeout?:number)=>void,
    info: (message:string, link?:string, timeout?:number)=>void,
    error: (message:string, link?:string, timeout?:number)=>void
}

export interface editModeInterface {
    enabled: ComputedRef<boolean>,
    toggle: ()=>void
}
