import {
	ChallengeGameState,
	ChallengeInterface,
	GeneratorInterface,
	QuestionDynamicInterface,
	ScoreInterface
} from "@/types/modelInterfaces.ts"
import {ComputedRef, Reactive, Ref} from "vue"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"

export interface ChallengeAnswerInterface {
	question: string
	answer: string
	result: boolean,
}

export interface ChallengeGameInterface {
	score: number,
	level: number,
	levelScore: number,
	lives: number,
	death: number,
	elapsedTime: number,
	remainingTime: number,
	questionElapsedTime: number,
}

export interface challengeDataProvideType {
	challenge: ChallengeInterface,
	state: Ref<ChallengeGameState>,
	game: Reactive<ChallengeGameInterface>,
	questionId: Ref<number>,
	questions: Ref<QuestionDynamicInterface[]>,
	answers: Ref<ChallengeAnswerInterface[]>,
	generator: ComputedRef<GeneratorInterface>,
	score: ScoreInterface<ScoreChallengeDataInterface>
}
