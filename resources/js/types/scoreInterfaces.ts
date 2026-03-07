/**
 * Score table
 * - user_id		int
 * - score			float
 * - attempts		int
 * - is_resolved	bool
 * - data			custom
 * - scoreable_type	<scoreableClassName>
 * - scoreable_id	int
 */

export type scoreableClassName =
	'Question' |
	'Deck' |
	'Card' |
	'Challenge' |
	'Generator' |
	'Lesson'

/**
 * Question score (QuestionAnswerValidation.vue)
 * - score = 0 ou 1
 * - data: {
 * 		answers: string[]	Liste des réponses
 * 		}
 */

export interface ScoreQuestionDataInterface {
	answers: string[]
}


/**
 * Deck store (DeckDisplay.vue) : is it used ?
 */
export interface ScoreDeckDataInterface {

}

/**
 * Card score (DeckCards.vue)
 * - score = 0 à 1 ??? a quoi sert ce score ?
 * - data: {
 *     current_score: 0 à 1 => poids actuel
 *     current_appearances: int => nombre d'apparitions de la carte
 *     current_time_spent: float => durée en secondes
 *     appearances: int => nombre d'apparition au total
 *     success: int =>
 *     time_spent: float => durée totale passée sur la carte en seconde.
 * }
 */
export interface ScoreCardDataInterface {
	appearances: number
	current_appearances: number
	current_score: number
	current_time_spent: number
	success: number
	time_spent: number
}

export interface ScoreChallengeDataInterface {
	current_level: number,
	current_score: number,
	level: number,
}

/**
 * Generator score (ChallengeTraining.vue)
 * score: max consecutive success
 * data: {
 *     current_score: consecutive success.
 * }
 */
export interface ScoreGeneratorDataInterface {
	current_score: number
}

export interface ScoreLessonDataInterface {

}

export type ScoreDataInterface =
	ScoreQuestionDataInterface |
	ScoreDeckDataInterface |
	ScoreCardDataInterface |
	ScoreChallengeDataInterface |
	ScoreGeneratorDataInterface |
	ScoreLessonDataInterface

export interface ScoreInterface<T extends ScoreDataInterface = ScoreDataInterface> {
	attempts: number,
	data: T,
	id: number,
	is_resolved: boolean,
	score: number,
	scoreable_id: number,
	scoreable_type: scoreableClassName,
	updated_at: string
	user_id: number,
}
