import {defineStore} from "pinia"
import {Ref, ref} from "vue"
import {DeckInterface, LessonInterface, PostShowInterface, ScoreInterface} from "@/types/modelInterfaces.ts"


export interface useStoreLessonInterface {
	target: Ref<number>,
	current: Ref<number>,
	init: (lesson: LessonInterface) => void,
	update: (modelOrScore: PostShowInterface | number) => void,
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
				const deck = lesson.lessonable as DeckInterface
				target.value = deck.cards_count
			}
		}

		function update(model: PostShowInterface | number) {
			if (typeof model === "number") {
				// Basic store update
				current.value = Math.max(current.value, model)
			} else if (model.questions) {
				updatePost(model as PostShowInterface)
			}
		}

		function updatePost(post: PostShowInterface) {
			target.value = post.questions.length
			current.value = post.questions.filter(question => question.user.is_resolved).length
		}

		return {
			target, current,
			init,
			update,
		}
	}
)
