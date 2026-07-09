import type {Equation, PolyFactor} from "pimath"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"


export interface equationLineType {
	equation: Equation,
	polyfactor: PolyFactor | null,
	operation: string | null
}

export type operationIdType = 'equivalence' | 'factorisation' | 'solution'

export interface KeyboardResolutionEvent {
	method: operationIdType,
	equation: Equation,
	value: string,
	polyfactor?: PolyFactor | null,
	success: boolean
}

export interface KeyboardResolutionFactorisationEvent {
	polyfactor: PolyFactor | null,
	success: boolean
}

export interface KeyboardResolutionFactorisationEmits {
	update: [event: KeyboardResolutionFactorisationEvent]
}

export interface KeyboardResolutionEmits {
	update: [event: KeyboardResolutionEvent],
	updateSolution: [event: KeyboardInputInterface]
}
