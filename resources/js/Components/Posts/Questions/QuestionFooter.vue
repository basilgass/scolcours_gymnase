<template>
  <div
      v-if="isCorrect.result"
      class="flex flex-col mt-2"
  >
    <div class="my-3 text-green-500 flex">
      <i class="bi bi-check mr-4"/>
      <p>Vous avez déjà répondu à cette question {{ isCorrect.when }}</p>
    </div>
    <div class="flex ">
      <button
          class="cursor-pointer flex items-center gap-5"
          @click="showAnswer=!showAnswer"
      >
        <div>Réponse</div>
        <i
            v-if="!showAnswer"
            class="bi bi-eye"
        />
        <div
            v-else
            v-katex.display.left.nomargin="answer"
        />
      </button>
    </div>
  </div>
  <div v-else>
    <!-- Afficher les réponses précédentes -->
    <div
        v-show="previousAnswers.length>0"
        class="text-xs mt-4 border-t pt-1"
    >
      <div class="flex justify-between">
        <div v-if="previousAnswers.length>1">
          Réponses précédentes
        </div>
        <div v-else>
          Réponse précédente
        </div>
        <Link
            v-if="!$page.props.auth.user"
            :href="route('login')"
        >
          ( se connecter pour mémoriser )
        </Link>
      </div>
      <ul class="flex flex-wrap gap-5">
        <li
            v-for="answer of previousAnswers"
            :key="answer.when"
            :class="{
								'text-green-600 font-bold':answer.result,
								'text-red-600':!answer.result,
							}"
        >
          {{ answer.answer }}
        </li>
      </ul>
    </div>

    <!-- Admin helper -->
    <div
        v-if="$page.props.auth.can.admin && editMode"
        class="text-xs text-gray-600 flex justify-between mt-6 admin-wrapper"
    >
      <div>Résultat attendu</div>
		<div>{{ adminAnswer }}</div>
    </div>
  </div>
</template>
<script setup>

import {inject, ref} from "vue";

let props = defineProps({
	isCorrect: {type: [Object,Boolean], required: true},
	answer: {type: String, required: true},
	previousAnswers: {type: Array, required: true},
	adminAnswer: {type: String, required: true}
})

let editMode = inject('editmode')
let showAnswer = ref(false)
</script>
