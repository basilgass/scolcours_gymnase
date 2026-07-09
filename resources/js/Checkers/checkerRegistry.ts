import type {CheckerAbstract} from "./CheckerAbstract"
import {CHECKERS} from "./checker.config"
import {
	CoordChecker,
	EquationChecker,
	ExactChecker,
	ExpChecker,
	FractionChecker,
	FunctionChecker,
	InputChecker,
	LogChecker,
	NumberChecker,
	PolynomChecker,
	PrimitiveChecker,
	RationalChecker,
	ScientificChecker,
	SolutionChecker,
	StringChecker,
	VectorChecker
} from "./Basic"
import {MatrixChecker, OrderChecker, QcmChecker, StudyChecker, TableofsignChecker, TypeChecker} from "./Custom"
import {TrigoChecker} from "@/Checkers/Basic/TrigoChecker.ts"
import {DrawChecker} from "@/Checkers/Custom/DrawChecker.ts"
import {ZonesChecker} from "@/Checkers/Custom/ZonesChecker.ts"
import {ModuloChecker} from "@/Checkers/Basic/ModuloChecker.ts"
import {AlgebraChecker} from "@/Checkers/Basic/AlgebraChecker.ts"

/**
 * Registre des checkers — SOURCE UNIQUE DE VÉRITÉ du lien `CHECKERS` → classe.
 *
 * Ajouter un checker = ajouter UNE entrée ici (+ le membre d'enum `CHECKERS`
 * dans `checker.config.ts` et la classe elle-même).
 *
 * La couture avec la couche clavier (`Composables/keyboardRegistry.ts`) reste
 * volontairement une STRING (l'enum `CHECKERS`) : le registre clavier ne connaît
 * jamais les classes de validation. Ce découplage est délibéré (cf. spec K5,
 * option A) — il garde le chemin d'affichage clavier léger et évite la classe de
 * cycles de barrel traitée en K1b. Les imports de `TrigoChecker`, `DrawChecker`,
 * `ZonesChecker`, `ModuloChecker`, `AlgebraChecker` restent en chemin direct
 * (hors barrels racine) par prudence face à ce même piège.
 *
 * La table est volontairement PARTIELLE : `FRACTION_PLUS` et `SENTENCE` existent
 * dans l'enum mais n'ont pas de classe dédiée (comportement figé — `fraction+`
 * retombe sur `EXACT` via le repli de `PiChecker`).
 */

export type CheckerClass = (new (...args: any[]) => CheckerAbstract)

export const CHECKER_CLASSES: Partial<Record<CHECKERS, CheckerClass>> = {
	// Basic checkers
	[CHECKERS.COORDINATES]: CoordChecker,
	[CHECKERS.EQUATION]: EquationChecker,
	[CHECKERS.EXACT]: ExactChecker,
	[CHECKERS.EXPONENTIAL]: ExpChecker,
	[CHECKERS.FRACTION]: FractionChecker,
	[CHECKERS.FUNCTION]: FunctionChecker,
	[CHECKERS.INPUT]: InputChecker,
	[CHECKERS.LOGARITHM]: LogChecker,
	[CHECKERS.MODULO]: ModuloChecker,
	[CHECKERS.NUMBER]: NumberChecker,
	[CHECKERS.POLYNOMIAL]: PolynomChecker,
	[CHECKERS.PRIMITIVE]: PrimitiveChecker,
	[CHECKERS.RATIONAL]: RationalChecker,
	[CHECKERS.ALGEBRA]: AlgebraChecker,
	[CHECKERS.SCIENTIFIC]: ScientificChecker,
	[CHECKERS.SOLUTION]: SolutionChecker,
	[CHECKERS.STRING]: StringChecker,
	[CHECKERS.TRIGO]: TrigoChecker,
	[CHECKERS.VECTOR]: VectorChecker,

	// Custom checkers
	[CHECKERS.ORDER]: OrderChecker,
	[CHECKERS.QCM]: QcmChecker,
	[CHECKERS.STUDY]: StudyChecker,
	[CHECKERS.TABLE_OF_SIGNS]: TableofsignChecker,
	[CHECKERS.TYPE]: TypeChecker,
	[CHECKERS.MATRIX]: MatrixChecker,
	[CHECKERS.DRAW]: DrawChecker,
	[CHECKERS.ZONES]: ZonesChecker,
} satisfies Partial<Record<CHECKERS, CheckerClass>>

/**
 * Classe de checker pour un membre d'enum, ou `null` si aucune n'est câblée.
 */
export function getCheckerClass(checker: CHECKERS): CheckerClass | null {
	return CHECKER_CLASSES[checker] ?? null
}