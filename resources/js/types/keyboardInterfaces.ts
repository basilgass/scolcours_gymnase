import {KeyboardObjectType} from "@/Composables/keyboardConfig.ts"
import {Component} from "vue"
import {PiChecker} from "@/Checkers"


export interface KeyboardPropsInterface {
	keyboard: KeyboardInterface,
	reference?: string
}

export interface KeyboardEmitsInterface {
	change: [value: KeyboardInputInterface]
}

export interface KeyboardInputInterface {
	input: string,
	raw: string
	tex: string,
}

export interface KeyboardExposeInterface {
	parameters: string
	reset: () => void,
	setInput: (value?: string) => Promise<KeyboardInputInterface>,
}

export interface KeyboardInterface {
	component: Component | null;
	config: KeyboardObjectType;
	name: string;
	parameters: string[];
	values: string[];
}

export interface KeyboardCheckerInterface {
	checker: PiChecker;
	checkerOverride?: Record<string, string>;
	name: string,
}
