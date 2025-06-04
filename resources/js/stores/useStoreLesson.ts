import {defineStore} from "pinia"
import {Ref, ref} from "vue"
import {LessonInterface, PostShowInterface, UserDeckInterface} from "@/types/modelInterfaces.ts"


export interface useStoreLessonInterface {
	target: Ref<number>,
	current: Ref<number>,
	init: (lesson: LessonInterface) => void,
	updatePost: (post: PostShowInterface) => void,
	updateChallenge: (score: number) => void,
}

export const useStoreLesson = defineStore(
	"lesson_user_store",
	(): useStoreLessonInterface => {
		const target = ref(0)
		const current = ref(0)

		function init(lesson: LessonInterface) {
			target.value = 0
			current.value = 0
			if (lesson.lessonable_type === 'Post') {
				updatePost(lesson.lessonable as PostShowInterface)
			} else if (lesson.lessonable_type === 'Challenge') {
				target.value = (lesson.parameters?.target as number) ?? 10
			} else if (lesson.lessonable_type === 'Deck') {
				const deck = lesson.lessonable as UserDeckInterface
				target.value = deck.number_of_cards
			}
		}

		function updatePost(post: PostShowInterface) {
			target.value = post.questions.length
			current.value = post.questions.filter(question => question.user.result).length
		}

		function updateChallenge(score: number) {
			current.value = Math.max(current.value, score)

			// Save the score to the DB: LessonUser
		}

		function updateDeck(score: number) {
			current.value = Math.max(current.value, score)
		}

		return {
			target, current,
			init,
			updatePost,
			updateChallenge,
			updateDeck,
		}
	}
)
