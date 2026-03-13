# Refactorisation des routes

## Suivi

| Statut | Section | Fait / Total |
|--------|---------|-------------|
| ✅ | Web — Public | 6 / 6 |
| ✅ | Web — Students | 2 / 2 |
| ✅ | Web — Admin | 9 / 9 |
| ✅ | API — Public | 4 / 4 |
| ✅ | API — Students | 3 / 3 |
| ✅ | API — Admin | 25 / 25 |

---

## Web — Public

| - | Ancien nom | Nouveau nom | Nouvel URL | Variables |
|---|---|---|---|---|
| ✅ | `api.dico.exists` | `dico.exists` | — | `{language}` `{word}` |
| ✅ | `api.dico.fetch` | `dico.index` | — | `{language}` `{number?}` ... |
| ✅ | `widget.fullscreen` | `widgets.fullscreen` | — | — |
| ✅ | `theme` | `themes.show` | — | `{theme:slug}` |
| ✅ | `challenges.show` | `challenges.quick` | — | `{challenge:slug}` *(redirect, pas une vraie show)* |
| ✅ | `chapters.challenges.show` | `themes.chapters.challenges.show` | — | `{theme:slug}` `{chapter:slug}` `{challenge:slug}` |

---

## Web — Students

| - | Ancien nom | Nouveau nom | Nouvel URL | Variables |
|---|---|---|---|---|
| ✅ | `students.quizzs.sessions.index` | `students.quizzes.sessions.index` | — | — |
| ✅ | `students.quizzs.sessions.show` | `students.quizzes.sessions.show` | — | `{quizzSession:shortcode}` |

---

## Web — Admin

| - | Ancien nom | Nouveau nom | Nouvel URL | Variables |
|---|---|---|---|---|
| ✅ | `admin.config.updateOrder` | `admin.config.order` | — | — |
| ✅ | `admin.users.create` | `admin.users.store` | — | — *(POST nommé `create` = confusion avec page de formulaire)* |
| ✅ | `admin.courses.dashboard` | `admin.courses.teams.dashboard` | — | `{course:slug}` `{team:name}` |
| ✅ | `admin.courses.lessons.show` | `admin.courses.teams.lessons.show` | — | `{course:slug}` `{team:name}` `{lesson}` |
| ✅ | `admin.courses.show-team` | `admin.courses.teams.show` | — | `{course:slug}` `{team:name}` |
| ✅ | `admin.challenges.team` | **SUPPRIMÉ** | — | *Redirection pure vers `admin.teams.challenges.show`* |
| ✅ | `admin.quizzs.index` | `admin.quizzes.index` | — | — |
| ✅ | `admin.quizzs.edit` | `admin.quizzes.edit` | — | — |
| ✅ | `admin.quizzs.sessions.dashboard` | `admin.quizzes.sessions.dashboard` | — | `{quizzSession:shortcode}` |
| ✅ | `admin.quizzs.sessions.projection` | `admin.quizzes.sessions.projection` | — | `{quizzSession:shortcode}` |

> **Note :** `admin.quizzs.sessions.dashboard` et `.projection` comptent comme 1 entrée dans le suivi
> car elles font partie du même groupe `quizzs → quizzes`.

---

## API — Public

| - | Ancien nom | Nouveau nom | Nouvel URL | Variables |
|---|---|---|---|---|
| ✅ | `api.chapters.posts` | `api.chapters.posts.index` | — | `{chapter:slug}` |
| ✅ | `api.school.timetable` | `api.school.timetables.index` | — | — |
| ✅ | `api.school.calendar` | `api.school.calendars.index` | — | — |
| ✅ | `api.teams.calendar` | `api.teams.calendars.index` | — | `{team}` |

---

## API — Students

| - | Ancien nom | Nouveau nom | Nouvel URL | Variables |
|---|---|---|---|---|
| ✅ | `api.students.reset` | `api.students.scores.reset` | — | — *(ressource `scores` manquante dans le nom)* |
| ✅ | `api.students.cards.fetch` | `api.students.cards.show` | — | `{card}` |
| ✅ | `api.teams.course.calendar` | `api.teams.courses.calendars.index` | — | `{team}` `{course}` |

---

## API — Admin

| - | Ancien nom | Nouveau nom | Nouvel URL | Variables |
|---|---|---|---|---|
| ✅ | `api.admin.courses.toggle-team` | `api.admin.courses.teams.toggle` | — | `{course}` `{team}` |
| ✅ | `api.admin.courses.lessons.updateOrder` | `api.admin.courses.lessons.order` | — | `{course}` |
| ✅ | `api.admin.courses.lessonables` | `api.admin.courses.lessonables.index` | — | — |
| ✅ | `api.admin.teams.lessons.update` | `api.admin.teams.lessons.calendars.update` | — | `{team}` `{lesson}` |
| ✅ | `api.admin.evaluations.toggle-team` | `api.admin.evaluations.teams.toggle` | — | `{evaluation}` `{team}` |
| ✅ | `api.admin.teams.toggleUser` | `api.admin.teams.users.toggle` | — | `{team}` `{user}` |
| ✅ | `api.admin.teams.users` | `api.admin.teams.users.index` | — | `{team}` |
| ✅ | `api.admin.chapters.toggleActive` | `api.admin.chapters.active` | — | `{chapter:slug}` |
| ✅ | `api.admin.chapters.currentPost` | `api.admin.chapters.current` | — | `{chapter}` |
| ✅ | `api.admin.chapters.updatePostsOrder` | `api.admin.chapters.posts.order` | — | `{chapter}` |
| ✅ | `api.admin.challenges.generators.updateOrder` | `api.admin.challenges.generators.order` | — | `{challenge}` |
| ✅ | `api.admin.formulas.updateOrder` | `api.admin.formulas.order` | — | — |
| ✅ | `api.admin.decks.updateChapter` | `api.admin.decks.chapter` | — | `{deck}` |
| ✅ | `api.admin.decks.toggleActive` | `api.admin.decks.active` | — | `{deck}` |
| ✅ | `api.admin.blocks.updateIllustrationsGrid` | `api.admin.blocks.illustrations.grid` | — | `{block}` |
| ✅ | `api.admin.illustrations.images.upload` | `api.admin.illustrations.upload` | — | — |
| ✅ | `api.admin.posts.updateQuestionsGrid` | `api.admin.posts.questions.grid` | — | `{post}` |
| ✅ | `api.admin.questions.updateOrder` | `api.admin.questions.order` | — | *(URL contient `{type}/{id}` — à vérifier dans le contrôleur)* |
| ✅ | `api.admin.questions.updateDisplayIf` | `api.admin.questions.displayIf` | — | `{question}` |
| ✅ | `api.admin.questions.batch.updateDisplayIf` | `api.admin.questions.batch.displayIf` | — | — |
| ✅ | `api.admin.scores.destroy.multiple` | `api.admin.scores.bulk` | — | — |
| ✅ | `api.admin.quizzs.store` | `api.admin.quizzes.store` | — | — |
| ✅ | `api.admin.quizzs.update` | `api.admin.quizzes.update` | — | — |
| ✅ | `api.admin.quizzs.destroy` | `api.admin.quizzes.destroy` | — | — |
| ✅ | `api.admin.quizzs.sessions.*` | `api.admin.quizzes.sessions.*` | — | — *(index, show, store, update, destroy)* |
| ✅ | `api.admin.quizzs.sessions.updateCurrent` | `api.admin.quizzes.sessions.current` | — | `{quizzSession}` |
| ✅ | `api.admin.quizzs.sessions.updateShowAnswer` | `api.admin.quizzes.sessions.answer` | — | `{quizzSession}` |
| ✅ | `api.admin.quizzs.sessions.updateEnable` | `api.admin.quizzes.sessions.enable` | — | `{quizzSession}` |

---

## Terminées

| Ancien nom | Nouveau nom | Date |
|---|---|---|
| `api.dico.exists` | `dico.exists` | 2026-03-11 |
| `api.dico.fetch` | `dico.index` | 2026-03-11 |
| `widget.fullscreen` | `widgets.fullscreen` | 2026-03-11 |
| `theme` | `themes.show` | 2026-03-11 |
| `challenges.show` | `challenges.quick` | 2026-03-11 |
| `chapters.challenges.show` | `themes.chapters.challenges.show` | 2026-03-11 |
| `students.quizzs.sessions.index` | `students.quizzes.sessions.index` | 2026-03-12 |
| `students.quizzs.sessions.show` | `students.quizzes.sessions.show` | 2026-03-12 |
| `admin.config.updateOrder` | `admin.config.order` | 2026-03-12 |
| `admin.users.create` | `admin.users.store` | 2026-03-12 |
| `admin.courses.dashboard` | `admin.courses.teams.dashboard` | 2026-03-12 |
| `admin.courses.lessons.show` | `admin.courses.teams.lessons.show` | 2026-03-12 |
| `admin.courses.show-team` | `admin.courses.teams.show` | 2026-03-12 |
| `admin.challenges.team` | **SUPPRIMÉ** | 2026-03-12 |
| `admin.quizzs.index` | `admin.quizzes.index` | 2026-03-12 |
| `admin.quizzs.edit` | `admin.quizzes.edit` | 2026-03-12 |
| `admin.quizzs.sessions.dashboard` | `admin.quizzes.sessions.dashboard` | 2026-03-12 |
| `admin.quizzs.sessions.projection` | `admin.quizzes.sessions.projection` | 2026-03-12 |
| `api.chapters.posts` | `api.chapters.posts.index` | 2026-03-12 |
| `api.school.timetable` | `api.school.timetables.index` | 2026-03-12 |
| `api.school.calendar` | `api.school.calendars.index` | 2026-03-12 |
| `api.teams.calendar` | `api.teams.calendars.index` | 2026-03-12 |
| `api.students.reset` | `api.students.scores.reset` | 2026-03-12 |
| `api.students.cards.fetch` | `api.students.cards.show` | 2026-03-12 |
| `api.teams.course.calendar` | `api.teams.courses.calendars.index` | 2026-03-12 |
| `api.admin.courses.toggle-team` | `api.admin.courses.teams.toggle` | 2026-03-12 |
| `api.admin.courses.lessons.updateOrder` | `api.admin.courses.lessons.order` | 2026-03-12 |
| `api.admin.courses.lessonables` | `api.admin.courses.lessonables.index` | 2026-03-12 |
| `api.admin.teams.lessons.update` | `api.admin.teams.lessons.calendars.update` | 2026-03-12 |
| `api.admin.evaluations.toggle-team` | `api.admin.evaluations.teams.toggle` | 2026-03-12 |
| `api.admin.teams.toggleUser` | `api.admin.teams.users.toggle` | 2026-03-12 |
| `api.admin.teams.users` | `api.admin.teams.users.index` | 2026-03-12 |
| `api.admin.chapters.toggleActive` | `api.admin.chapters.active` | 2026-03-12 |
| `api.admin.chapters.currentPost` | `api.admin.chapters.current` | 2026-03-12 |
| `api.admin.chapters.updatePostsOrder` | `api.admin.chapters.posts.order` | 2026-03-12 |
| `api.admin.challenges.generators.updateOrder` | `api.admin.challenges.generators.order` | 2026-03-12 |
| `api.admin.formulas.updateOrder` | `api.admin.formulas.order` | 2026-03-12 |
| `api.admin.decks.updateChapter` | `api.admin.decks.chapter` | 2026-03-12 |
| `api.admin.decks.toggleActive` | `api.admin.decks.active` | 2026-03-12 |
| `api.admin.blocks.updateIllustrationsGrid` | `api.admin.blocks.illustrations.grid` | 2026-03-12 |
| `api.admin.illustrations.images.upload` | `api.admin.illustrations.upload` | 2026-03-12 |
| `api.admin.posts.updateQuestionsGrid` | `api.admin.posts.questions.grid` | 2026-03-12 |
| `api.admin.questions.updateOrder` | `api.admin.questions.order` | 2026-03-12 |
| `api.admin.questions.updateDisplayIf` | `api.admin.questions.displayIf` | 2026-03-12 |
| `api.admin.questions.batch.updateDisplayIf` | `api.admin.questions.batch.displayIf` | 2026-03-12 |
| `api.admin.scores.destroy.multiple` | `api.admin.scores.bulk` | 2026-03-12 |
| `api.admin.quizzs.store` | `api.admin.quizzes.store` | 2026-03-12 |
| `api.admin.quizzs.update` | `api.admin.quizzes.update` | 2026-03-12 |
| `api.admin.quizzs.destroy` | `api.admin.quizzes.destroy` | 2026-03-12 |
| `api.admin.quizzs.sessions.*` | `api.admin.quizzes.sessions.*` | 2026-03-12 |
| `api.admin.quizzs.sessions.updateCurrent` | `api.admin.quizzes.sessions.current` | 2026-03-12 |
| `api.admin.quizzs.sessions.updateShowAnswer` | `api.admin.quizzes.sessions.answer` | 2026-03-12 |
| `api.admin.quizzs.sessions.updateEnable` | `api.admin.quizzes.sessions.enable` | 2026-03-12 |
