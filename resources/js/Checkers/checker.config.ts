export interface CheckerResult {
	message: string,
	result: boolean,
	score: number,
	index?: number
}

export enum CHECKERS {
	// Basic checkers
	// CARTESIAN = "cartesian",
	COORDINATES = "coord",
	EQUATION = "equation",
	EXACT = "exact",
	EXPONENTIAL = "exp",
	FRACTION = "fraction",
	FRACTION_PLUS = "fraction+",
	FUNCTION = "function",
	INPUT = "input",
	LOGARITHM = "log",
	NUMBER = "number",
	MODULO = "mod",
	ALGEBRA = "algebra",
	POLYNOMIAL = "polynom",
	PRIMITIVE = "primitive",
	RATIONAL = "rational",
	SCIENTIFIC = "scientific",
	SOLUTION = "solution",
	ANGLE = "angle",
	STRING = "string",
	VECTOR = "vector",

	// Custom checkers
	ORDER = "order",
	QCM = "qcm",
	SENTENCE = "sentence",
	STUDY = "study",
	TABLE_OF_SIGNS = "tos",
	TYPE = "type",
	MATRIX = "matrix",
	DRAW = "draw",
	ZONES = "zones"
}

/**
 * checkerNameToEnum a été déplacé vers `@/Composables/keyboardRegistry.ts`
 * (source unique de vérité alias → composant / layout / checker).
 *
 * Il n'est volontairement PAS ré-exporté ici : `checker.config.ts` doit rester
 * une feuille sans dépendance pour éviter une dépendance circulaire avec l'enum
 * CHECKERS. Les consommateurs importent `checkerNameToEnum` depuis le registre.
 */
