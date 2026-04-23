<script setup lang="ts">

import {computed, onMounted, ref, watch} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import Card from "@/Components/Ui/Card.vue"
import {
	ChallengeInterface,
	DeckInterface,
	GeneratorInterface,
	LessonInterface,
	PostShowInterface,
	ScoreInterface
} from "@/types/modelInterfaces.ts"
import {lessonableModel, LessonChallengeScoreRules, LessonGeneratorScoreRules} from "@/types/lessonInterfaces.ts"
import {
	ScoreChallengeDataInterface,
	ScoreDataInterface,
	ScoreGeneratorDataInterface,
	ScoreLessonDataInterface
} from "@/types/scoreInterfaces.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = defineProps<{
	lesson: LessonInterface,
	lessonable: lessonableModel
	menuToggle: boolean
}>()

const flash = useStoreFlashMessage()

const storeScore = useStoreScore()
const lessonScore = ref<ScoreInterface<ScoreLessonDataInterface>>()
const refScore = ref<number>(undefined)
const refData = ref<ScoreDataInterface>()

async function post_scores(post: PostShowInterface) {
	const model = 'Question'
	const ids = post.questions.map(question => question.id)

	await storeScore.getScores(model, ids)
		.then(
			(scores) => {
				if (scores.length === 0) {
					// Il n'y a pas de questions
					lessonScore.value.score = 100
				} else {
					lessonScore.value.score = Math.round(scores.filter(s => s.is_resolved).length / scores.length * 100)
				}
				lessonScore.value.is_resolved = lessonScore.value.score === 100

			})
		.catch((err) => {
			console.warn(err)
		})
}

async function challenge_scores(challenge: ChallengeInterface) {
	const score = await storeScore.getScore<ScoreChallengeDataInterface>(
		'Challenge',
		challenge.id
	)

	const rules = props.lesson.scoreRules as LessonChallengeScoreRules

	// Le score d'un challenge est de la forme:
	// niveau.points
	refScore.value = score.data.current_score
	refData.value = score.data

	if (score.data.current_score < rules.target) {
		// score non atteint.
		flash.info(
			`${score.data.current_score} points sur ${rules.target}`,
			{
				title: 'Score non atteint',
				duration: 4000
			})
		return
	}

	if (rules.level &&
		score.data.current_level < rules.level) {
		// niveau non atteint.
		flash.info(
			`niveau demandé non atteint: ${score.data.current_level} sur ${rules.level}`,
			{
				title: 'Niveau non atteint',
			}
		)
		return
	}

	// lessonScore.value.score est de la forme
	lessonScore.value.score++


	if (!rules.occurrences || lessonScore.value.score === rules.occurrences) {
		lessonScore.value.is_resolved = true

		flash.success('Score demandé atteint')
	}
}

async function generator_scores(generator: GeneratorInterface) {
	const score = await storeScore.getScore<ScoreGeneratorDataInterface>(
		'Generator',
		generator.id
	)
	const rules = props.lesson.scoreRules as LessonGeneratorScoreRules

	refScore.value = score.data.current_score

	if (
		score.data.current_score > 0 &&
		score.data.current_score % rules.target === 0
	) {
		lessonScore.value.score++

		if (!rules.occurrences || lessonScore.value.score === rules.occurrences) {
			lessonScore.value.is_resolved = true

			flash.success('Score demandé atteint')
		}
	}
}

async function deck_scores(deck: DeckInterface) {
	const model = 'Deck'
	const id = deck.id

	const score = await storeScore.getScore(model, id)
	lessonScore.value.score = Math.max(lessonScore.value.score, score.score)
	lessonScore.value.is_resolved = score.is_resolved
}

const displayLessonResult = computed(() => {
	if (!lessonScore.value) {
		return 'chargement...'
	}

	switch (props.lesson.lessonable_type) {
		case "Post":
		case "Deck":
			return `${lessonScore.value.score} %`
		case "Generator": {
			const rules = props.lesson.scoreRules as LessonGeneratorScoreRules
			return lessonScore.value.is_resolved ?
				`100 %` :
				`${(refScore.value ?? 0) % rules.target} / ${rules.target} => ${lessonScore.value.score} / ${rules.occurrences ?? 1}`
		}
		case "Challenge": {
			const rules = props.lesson.scoreRules as LessonChallengeScoreRules
			const data = refData.value as ScoreChallengeDataInterface
			return lessonScore.value.is_resolved ?
				`100 %` :
				`${refScore.value} / ${rules.target} & ${data?.current_level ?? 0} / ${rules.level} x ${lessonScore.value.score} / ${rules.occurrences ?? 1}`
		}
		default:
			return "???"
	}

})

async function update_lesson_score(model: lessonableModel, updatedScore?: ScoreInterface) {
	if (props.lesson.lessonable_type === 'Post') {
		await post_scores(model as PostShowInterface)
	} else if (matchingPivotModels(props.lesson, updatedScore)) {
		// Le modèle enfant de Lesson correspond au modèle du score mis à jour.
		if (props.lesson.lessonable_type === 'Challenge') {
			await challenge_scores(model as ChallengeInterface)
		} else if (props.lesson.lessonable_type === 'Generator') {
			await generator_scores(model as GeneratorInterface)
		} else if (props.lesson.lessonable_type === 'Deck') {
			await deck_scores(model as DeckInterface)
		} else {
			return
		}
	} else {
		return
	}

	// Fais la mise à jour de manière silencieuse (pas de bump, donc pas de watch)
	await storeScore.updateScore(lessonScore.value, true)
}

async function resetScore() {
	if (props.lesson.lessonable_type === 'Post') {
		const post = props.lessonable as PostShowInterface

		storeScore
			.getScores('Question', post.questions.map(q => q.id))
			.then(scores => {
				storeScore
					.reset(scores.map(s => s.id))
					.then(() => {
						lessonScore.value.score = 0
						lessonScore.value.is_resolved = false
						storeScore.updateScore(lessonScore.value, true)
					})
			})
		return
	}

	lessonScore.value.score = 0
	lessonScore.value.is_resolved = false
	storeScore.updateScore(lessonScore.value, true)
}

async function init_refScore() {
	refScore.value = 0
	refData.value = {
		level: 0
	}
}

function matchingPivotModels(lesson: LessonInterface, score: ScoreInterface) {
	return (lesson.lessonable_type === score.scoreable_type) &&
		(lesson.lessonable_id === score.scoreable_id)
}

onMounted(() => {
	storeScore.getScore('Lesson', props.lesson.id)
		.then(score => {
			lessonScore.value = score

			// Mise à jour automatique dans le cas des posts.
			if (props.lesson.lessonable_type === 'Post') {
				update_lesson_score(props.lessonable)
			} else {
				init_refScore()
			}
		})
})

watch(() => storeScore.version, () => {
	// Ne mettre à jour la leçon que si elle n'est pas résolue.
	if (!lessonScore.value.is_resolved) {
		update_lesson_score(props.lessonable, storeScore.lastUpdated)
	}
})

</script>

<template>
	<Card
		:class="lessonScore?.is_resolved ? 'bg-green-100 border-green-600 text-green-600':''"
	>
		<div
			class="flex justify-between"
			:title="menuToggle?'':'score'"
		>
			<div v-show="menuToggle">
				score
			</div>
			<div class="whitespace-nowrap">
				{{ displayLessonResult }}
			</div>
		</div>
		<template
			v-if="lessonScore?.is_resolved"
			#footer
		>
			<div
				class="text-xs text-right cursor-pointer"
				@click="resetScore"
			>
				<i class="bi bi-skip-start" /> recommencer
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
