import {KeyboardObjectType} from "@/Composables/keyboardConfig.ts"
import {Component} from "vue"
import {PiChecker} from "@/Checkers"

/**
 * Contrat des composants clavier. Deux familles :
 *  - Clavier standard : props {@link KeyboardPropsInterface}, événements
 *    {@link KeyboardEmitsInterface}, API exposée {@link KeyboardExposeInterface}.
 *  - Clavier custom (ex. QCM) : props {@link KeyboardCustomPropsInterface} (pas de
 *    descripteur de registre, seulement paramètres/valeurs via {@link KeyboardCustomInterface}).
 *
 * `KeyboardDisplay` est la feuille d'affichage bas niveau : son contrat est distinct
 * (émet `next`/`change`/`clear`) et n'utilise pas ces interfaces.
 */

export interface KeyboardPropsInterface {
	keyboard: KeyboardInterface,
	reference?: string
}

export interface KeyboardCustomPropsInterface {
	keyboard: KeyboardCustomInterface,
	reference?: string
}

export interface KeyboardEmitsInterface {
	change: [value: KeyboardInputInterface],
	validate: [],
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

export interface KeyboardCustomInterface {
	parameters: string[];
	values: string[];
}

export interface KeyboardCheckerInterface {
	checker: PiChecker;
	checkerOverride?: Record<string, string>;
	name: string,
}
