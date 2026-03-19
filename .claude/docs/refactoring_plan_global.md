
**SCOLCOURS**
Plan de restructuration et d'amélioration
Mars 2026

# Légende des niveaux de difficulté
Chaque tâche est classifiée selon son impact sur la codebase :

| Code | Niveau | Description |
| --- | --- | --- |
| 🟢 | Triviale | Modification isolée, 1-2 fichiers, aucune implication |
| 🟡 | Facile | Quelques fichiers, renommages ou déplacements simples |
| 🟠 | Modérée | Logique à réorganiser, impact sur 5-15 fichiers |
| 🔴 | Complexe | Refactorisation significative, implications cross-domaine |
| 🟣 | Majeure | Changement architectural, impact sur toute la codebase |


# Vue d'ensemble — Toutes les tâches
Les tâches Triviales (🟢) et Faciles (🟡) peuvent être faites indépendamment et sans risque. Les tâches Modérées (🟠) nécessitent une planification. Les Complexes (🔴) et Majeures (🟣) doivent être décidées stratégiquement.

| ID | Zone | Titre | Difficulté | Effort | Fichiers clés |
| --- | --- | --- | --- | --- | --- |
| ~~F-01~~ | ~~Typage TS~~ | ~~Éclater modelInterfaces.ts en fichiers domaine~~ | ~~🟡 Facile~~ | ~~1-2h~~ | ✅ Terminé 2026-03-07 |
| F-02 | PHP Naming | Normaliser les noms de colonnes camelCase → snake_case | 🟡 Facile | 2-3h | Migrations + Models + Resources + TS interfaces... |
| F-03 | PHP | Déplacer GeneratorApiController dans le bon namespace | 🟡 Facile | 30 min | app/Http/Controllers/web/GeneratorApiController.php... |
| F-04 | PHP | Déplacer les méthodes Generator hors de ChallengeApiController | 🟡 Facile | 1h | app/Http/Controllers/api/ChallengeApiController.php → GeneratorApiController.php... |
| F-05 | PHP | Créer un FormRequest pour LatexController | 🟡 Facile | 45 min | app/Http/Controllers/LatexController.php... |
| F-06 | PHP | Compléter les FormRequests manquants sur les ApiControllers | 🟡 Facile | 3-4h | 15 controllers api qui utilisent encore $request->validate() inline... |
| M-01 | PHP Archi | Éclater ScolcoursController en services distincts | 🟠 Modérée | 3-4h | app/Http/Controllers/ScolcoursController.php... |
| M-02 | PHP Archi | Refactoriser AdminController | 🟠 Modérée | 2-3h | app/Http/Controllers/AdminController.php... |
| M-03 | PHP Score | Typer Score.data avec des Casts PHP par scoreable_type | 🟠 Modérée | 3-4h | app/Models/Score.php + HasScoresTrait.php... |
| M-04 | PHP Score | Réactiver le cache des scores (HasScoresTrait) | 🟠 Modérée | 2h | app/Traits/HasScoresTrait.php... |
| M-05 | TS Composables | Séparer useQuestionValidation en couches distinctes | 🟠 Modérée | 3-4h | Components/Questions/useQuestionValidation.ts (305 lignes)... |
| M-06 | TS Types | Typer strictement Lesson.scoreRules selon lessonable_type | 🟠 Modérée | 2-3h | types/lessonInterfaces.ts + LessonResource.php + LessonApiController.php... |
| M-07 | PHP Routes | Normaliser le pattern routes Challenge (double affichage) | 🟠 Modérée | 2h | routes/content/challenges.php + ChallengeController.php... |
| C-01 | Architecture | Créer une couche Service entre Controllers et Models | 🔴 Complexe | 1-2 semaines | Tous les ApiControllers + nouveaux app/Services/... |
| C-02 | Architecture | Isoler le module Course/Lesson en domaine autonome | 🔴 Complexe | 1 semaine | routes/management/... |
| C-03 | TS Archi | Créer des stores Pinia par domaine majeur | 🔴 Complexe | 1 semaine | resources/js/stores/ (3 fichiers actuels) → stores/{domaine}.ts... |
| MA-01 | Architecture | Standardiser la réponse API (enveloppe { data, meta }) | 🟣 Majeure | 2-3 semaines | Tous les ApiControllers + toutes les Resource + côté TS (toutes les interfaces)... |
| MA-02 | Architecture | Séparer la logique web et API des routes en deux fichiers par domaine | 🟣 Majeure | 1-2 semaines | Tous les fichiers routes/content/*.php et routes/management/*.php... |
| MA-03 | BDD | Migration camelCase → snake_case (si décision prise) | 🟣 Majeure | 1 semaine | Migrations + Models + Resources + Controllers + TS interfaces + composants Vue... |


# Fiches détaillées
## 🟢 Triviales — Faire maintenant
Ces tâches ne demandent aucune réflexion architecturale. Elles peuvent être traitées comme un sprint de nettoyage en quelques heures.

## 🟡 Faciles — Court terme
Modifications ciblées sur peu de fichiers. Chacune peut être faite en une session de travail.

**[F-02] ****Normaliser les noms de colonnes camelCase → snake_case**   🟡 Facile   2-3h
Zone : PHP Naming — Effort estimé : 2-3h
**Contexte**
Plusieurs colonnes DB utilisent du camelCase : questionsGrid, illustrationsGrid, randomOrder, scoreRules, generatorsGrouping. C'est contraire aux conventions Laravel.
**Quoi faire**
Créer des migrations de renommage : questionsGrid→questions_grid, illustrationsGrid→illustrations_grid, randomOrder→random_order, scoreRules→score_rules, generatorsGrouping→generators_grouping
Mettre à jour les Models ($fillable, $casts, usages)
Mettre à jour les Resources
Mettre à jour les interfaces TS
**Comment**
Une migration par table (renameColumn)
Chercher/remplacer ensuite dans le code PHP puis TS
**Risques / implications**
Chercher questionsGrid dans les fichiers Vue — le champ est utilisé directement côté frontend
**Fichiers concernés**
database/migrations/
app/Models/Post.php (questionsGrid)
app/Models/Block.php (illustrationsGrid)
app/Models/Evaluation.php (randomOrder)

**[F-03] ****Déplacer GeneratorApiController dans le bon namespace**   🟡 Facile   30 min
Zone : PHP — Effort estimé : 30 min
**Contexte**
GeneratorApiController est dans le namespace web/ alors qu'il gère exclusivement des réponses JSON.
**Quoi faire**
Déplacer le fichier vers app/Http/Controllers/api/
Mettre à jour le namespace interne
Mettre à jour l'import dans routes/content/generators.php
**Comment**
Déplacement physique + mise à jour du namespace + mise à jour du use dans la route
**Fichiers concernés**
app/Http/Controllers/web/GeneratorApiController.php
routes/content/generators.php

**[F-04] ****Déplacer les méthodes Generator hors de ChallengeApiController**   🟡 Facile   1h
Zone : PHP — Effort estimé : 1h
**Contexte**
indexGenerator, updateGeneratorsOrder, storeGenerator, attachGenerator, detachGenerator sont dans ChallengeApiController (commentaires // REFACTOR: move all generator to its controller).
**Quoi faire**
Déplacer ces 5 méthodes dans GeneratorApiController
Mettre à jour les routes correspondantes dans challenges.php
**Comment**
Copier les méthodes, adapter si nécessaire, mettre à jour le use dans les routes
**Fichiers concernés**
app/Http/Controllers/api/ChallengeApiController.php
routes/content/challenges.php

**[F-05] ****Créer un FormRequest pour LatexController**   🟡 Facile   45 min
Zone : PHP — Effort estimé : 45 min
**Contexte**
Le commentaire // TODO: Faire un formrequest existe depuis le début. La validation LaTeX n'est pas faite non plus.
**Quoi faire**
Créer app/Http/Requests/LatexRequest.php avec les règles de validation
Injecter dans LatexController::generate()
**Comment**
Créer la classe FormRequest avec les règles appropriées
Remplacer $request->validate() inline
**Fichiers concernés**
app/Http/Controllers/LatexController.php

**[F-06] ****Compléter les FormRequests manquants sur les ApiControllers**   🟡 Facile   3-4h
Zone : PHP — Effort estimé : 3-4h
**Contexte**
Question, Block, Generator, Illustration ont déjà leurs FormRequests. Les 15 autres controllers font encore de la validation inline.
**Quoi faire**
Créer les FormRequests manquants pour : Chapter, Post, Deck, Card, Challenge, Evaluation, Formula, Illustration update, Course update, Quizz, Team, Widget, Tool
Injecter dans les controllers correspondants
**Comment**
Pattern : créer app/Http/Requests/Store{Model}Request.php et Update{Model}Request.php
Méthode rules() + authorize() = true pour admin
**Fichiers concernés**
app/Http/Controllers/api/*.php

## 🟠 Modérées — Moyen terme
Nécessitent une planification mais restent circonscrites à un domaine.

**[M-01] ****Éclater ScolcoursController en services distincts**   🟠 Modérée   3-4h
Zone : PHP Archi — Effort estimé : 3-4h
**Contexte**
ScolcoursController contient : page d'accueil, dashboard, recherche full-text (3 méthodes), dictionnaire (2 méthodes), QR code, timetable, fullscreen. Ce n'est pas cohérent.
**Quoi faire**
Créer SearchController pour search(), searchChapters(), searchPosts(), searchBlocks()
Créer DicoController pour dico(), wordExistsInDictionary()
Garder ScolcoursController pour index(), dashboard(), fullscreen(), qrcode()
Mettre à jour les routes dans web.php
**Comment**
Déplacer les méthodes en groupes logiques
Créer les routes correspondantes
**Risques / implications**
Ziggy : les noms de routes vont changer si on les renomme — s'assurer de conserver les noms existants avec ->name()
**Fichiers concernés**
app/Http/Controllers/ScolcoursController.php
routes/web.php

**[M-02] ****Refactoriser AdminController**   🟠 Modérée   2-3h
Zone : PHP Archi — Effort estimé : 2-3h
**Contexte**
Commentaire en tête de fichier : // REFACTOR: A retravailler complètement. AdminController agrège des méthodes qui appartiennent aux controllers métier.
**Quoi faire**
Analyser chaque méthode et la déplacer dans le controller approprié
Supprimer AdminController ou le réduire au strict minimum
**Comment**
Lire AdminController entièrement, identifier les méthodes dupliquées avec les controllers web/
**Risques / implications**
Des routes admin pointent directement vers AdminController — les mettre à jour en même temps
**Fichiers concernés**
app/Http/Controllers/AdminController.php
routes/admin.php

**[M-03] ****Typer Score.data avec des Casts PHP par scoreable_type**   🟠 Modérée   3-4h
Zone : PHP Score — Effort estimé : 3-4h
**Contexte**
Score.data est casté en array générique. Les interfaces TS ScoreXxxDataInterface existent mais côté PHP rien ne valide la structure. Des bugs silencieux sont possibles.
**Quoi faire**
Créer des Data Transfer Objects (DTO) ou des Value Objects pour chaque type de score data
Alternativement, créer un Cast Eloquent personnalisé ScoreDataCast qui retourne le bon objet selon scoreable_type
Valider la structure dans les FormRequests de score
**Comment**
Option simple : utiliser des readonly classes PHP 8.2 + un factory dans le Cast
Option pragmatique : ajouter la validation dans updateScoreRequest.php
**Fichiers concernés**
app/Models/Score.php
app/Http/Requests/updateScoreRequest.php
resources/js/types/scoreInterfaces.ts

**[M-04] ****Réactiver le cache des scores (HasScoresTrait)**   🟠 Modérée   2h
Zone : PHP Score — Effort estimé : 2h
**Contexte**
Le cache Redis est complètement désactivé (commenté). Le commentaire dit 'TODO: Cache removed in DEV mode' mais il n'y a aucun guard de prod. Chaque affichage de score fait une requête DB.
**Quoi faire**
Réactiver le cache avec une condition basée sur app()->environment()
Ou utiliser le cache uniquement pour les méthodes les plus sollicitées (scoreForAuth)
**Comment**
Wrapper les appels Cache:: avec config('app.env') !== 'local'
Ou ajouter une variable d'env CACHE_SCORES=true
**Risques / implications**
S'assurer que l'invalidation du cache fonctionne correctement dans updateCache()
**Fichiers concernés**
app/Traits/HasScoresTrait.php

**[M-05] ****Séparer useQuestionValidation en couches distinctes**   🟠 Modérée   3-4h
Zone : TS Composables — Effort estimé : 3-4h
**Contexte**
useQuestionValidation mélange : logique de validation mathématique (PiMath/Checkers), état UI (lock, errorMessages), appel API (storeAnswer), et gestion du score. C'est difficile à tester et à maintenir.
**Quoi faire**
Extraire la logique d'appel API dans un service questionApiService.ts
Garder useQuestionValidation focalisé sur la validation locale (Checkers)
Créer useQuestionScore.ts pour la gestion du score post-validation
**Comment**
Identifier les 3 responsabilités dans le fichier actuel
Extraire par couche en préservant les signatures publiques
**Risques / implications**
QuestionShow.vue consomme useQuestionValidation — s'assurer que l'interface exposée ne change pas
**Fichiers concernés**
resources/js/Components/Questions/useQuestionValidation.ts
resources/js/Components/Questions/useQuestion.ts

**[M-06] ****Typer strictement Lesson.scoreRules selon lessonable_type**   🟠 Modérée   2-3h
Zone : TS Types — Effort estimé : 2-3h
**Contexte**
scoreRules est un array JSON dont la structure varie selon le type de lessonable (Post→LessonPostScoreRules, Challenge→LessonChallengeScoreRules...). Les types TS existent (lessonInterfaces.ts) mais ne sont pas utilisés côté PHP.
**Quoi faire**
Ajouter la validation PHP dans StoreLessonRequest et UpdateLessonRequest selon le type de lessonable
Utiliser le type générique LessonInterface<T> côté TS de façon systématique dans les composants
**Comment**
Conditional validation dans FormRequest (rules() différentes selon lessonable_type)
**Fichiers concernés**
resources/js/types/lessonInterfaces.ts
app/Http/Controllers/api/LessonApiController.php

**[M-07] ****Normaliser le pattern routes Challenge (double affichage)**   🟠 Modérée   2h
Zone : PHP Routes — Effort estimé : 2h
**Contexte**
Un Challenge peut être accédé via q/{slug} (raccourci) ET /{theme}/{chapter}/challenges/{slug} (contextualisé). Les deux routes partagent le même nom 'challenges.show', ce qui est ambigu.
**Quoi faire**
Donner un nom distinct à la route raccourcie : 'challenges.quick'
Décider si les deux vues sont vraiment différentes ou si l'une doit rediriger vers l'autre
Documenter le choix
**Comment**
Changer ->name('challenges.show') en ->name('challenges.quick') sur la route q/{slug}
Mettre à jour les liens dans les vues qui utilisent route('challenges.show')
**Risques / implications**
Ziggy génère challenges.show côté TS — tous les appels route('challenges.show') doivent être vérifiés
**Fichiers concernés**
routes/content/challenges.php
resources/js/

## 🔴 Complexes — Long terme
Refactorisations significatives qui impactent plusieurs domaines. À planifier soigneusement.

**[C-01] ****Créer une couche Service entre Controllers et Models**   🔴 Complexe   1-2 semaines
Zone : Architecture — Effort estimé : 1-2 semaines
**Contexte**
Les controllers API font directement des requêtes Eloquent complexes, de la logique métier et de la sérialisation. À mesure que l'app grandit, ça devient difficile à tester et réutiliser.
**Quoi faire**
Créer app/Services/{Model}Service.php pour les domaines complexes en priorité : PostService, ChallengeService, ScoreService, LessonService
Déplacer la logique métier (non-CRUD) dans ces services
Injecter les services dans les controllers
**Comment**
Commencer par ScoreService (la logique de score est partagée par de nombreux controllers)
Puis PostService (logique de réordonnancement, déplacement entre chapitres)
Utiliser l'injection de dépendance Laravel (binding dans AppServiceProvider)
**Risques / implications**
Changement architectural profond — faire domaine par domaine, ne pas tout refactoriser d'un coup
Risk de régression si les tests unitaires sont absents
**Fichiers concernés**
app/Http/Controllers/api/
app/Traits/HasScoresTrait.php
app/Traits/CanMoveToTarget.php

**[C-02] ****Isoler le module Course/Lesson en domaine autonome**   🔴 Complexe   1 semaine
Zone : Architecture — Effort estimé : 1 semaine
**Contexte**
Course/Lesson est le module le plus récent (2025) et le plus structuré. Il mérite un dossier dédié clair. C'est aussi un bon pilote pour tester un pattern 'domaine' réplicable.
**Quoi faire**
Regrouper toutes les routes dans routes/management/courses_and_lessons.php (déjà partiellement fait)
S'assurer que les Controllers, Resources, FormRequests sont cohérents
Créer un sous-dossier app/Domain/Courses/ si l'on adopte une architecture DDD légère
**Comment**
Audit des fichiers actuels du domaine
Déplacement et renommage progressif
**Risques / implications**
Les relations avec Team, Theme, Lesson→lessonable (Post, Challenge, Deck) touchent tous les autres domaines
**Fichiers concernés**
routes/management/courses_and_lessons.php
app/Http/Controllers/web/CourseController.php
app/Http/Controllers/api/CourseApiController.php
resources/js/Pages/Courses/

**[C-03] ****Créer des stores Pinia par domaine majeur**   🔴 Complexe   1 semaine
Zone : TS Archi — Effort estimé : 1 semaine
**Contexte**
Seuls 3 stores existent (EditMode, FlashMessage, Score). Beaucoup d'état partagé transite par provide/inject ou props drilling. CourseEdit.vue (453 lignes) et ChallengeEdit.vue (383 lignes) en sont les exemples les plus parlants.
**Quoi faire**
Créer useChallengeStore.ts : état du jeu (gameState, score, lives, currentGenerator)
Créer useQuizzStore.ts : état de la session (current question, projection)
Créer useLessonStore.ts : progression dans un cours, état des leçons
**Comment**
Identifier l'état local dans les Pages/*.vue qui est partagé entre composants enfants
Extraire dans un store Pinia
Les composables useChallenge.ts et useCourse.ts peuvent devenir la base des stores
**Risques / implications**
Changement de paradigme : passer de provide/inject à Pinia nécessite de modifier tous les composants enfants consommateurs
**Fichiers concernés**
resources/js/Composables/useChallenge.ts
resources/js/Pages/Courses/useCourse.ts
resources/js/Pages/Challenges/ChallengeEdit.vue
resources/js/stores/

## 🟣 Majeures — Décisions stratégiques
Ces chantiers touchent toute la codebase. Ils nécessitent une décision délibérée et une exécution très progressive.

**[MA-01] ****Standardiser la réponse API (enveloppe { data, meta })**   🟣 Majeure   2-3 semaines
Zone : Architecture — Effort estimé : 2-3 semaines
**Contexte**
Les réponses API sont incohérentes : certains controllers retournent directement un modèle, d'autres une Resource, d'autres un tableau, certains ajoutent des métadonnées à la main. Côté TS, les interfaces ne reflètent pas ce comportement.
**Quoi faire**
Définir un format de réponse unique : { data: T, meta?: {...} } pour les listes, { data: T } pour les items
Créer une classe ApiResponse ou un trait ApiResponds
Migrer tous les controllers vers ce format
Mettre à jour toutes les interfaces TS
**Comment**
Commencer par les nouveaux controllers (Course, Lesson)
Migrer progressivement — les anciens controllers peuvent coexister
Mettre à jour les appels axios côté TS au fur et à mesure
**Risques / implications**
Chaque migration d'un controller nécessite de mettre à jour le composable/page TS correspondant
Risque de régression massif si fait trop vite
Nécessite une stratégie de déploiement progressif
**Fichiers concernés**
app/Http/Controllers/api/
resources/js/types/
resources/js/Composables/

**[MA-02] ****Séparer la logique web et API des routes en deux fichiers par domaine**   🟣 Majeure   1-2 semaines
Zone : Architecture — Effort estimé : 1-2 semaines
**Contexte**
Chaque fichier de routes mélange web (Inertia) et API (JSON) dans le même fichier. Pour les domaines complexes comme chapters.php, c'est difficile à lire. L'idéal serait content/web/chapters.php et content/api/chapters.php.
**Quoi faire**
Séparer chaque fichier en deux : chapters.web.php et chapters.api.php
Mettre à jour web.php et api.php pour inclure les bons fichiers
Ou alternativement : organiser par groupe middleware au lieu de domaine
**Comment**
Faire domaine par domaine en commençant par le plus simple (tools, widgets)
Tester après chaque séparation
**Risques / implications**
37 commentaires TODO/REFACTOR dans les routes — risque d'en manquer un
La séparation ne change pas les URLs mais impacte l'organisation de toute l'équipe
**Fichiers concernés**
routes/content/
routes/management/
routes/web.php

**[MA-03] ****Migration camelCase → snake_case (si décision prise)**   🟣 Majeure   1 semaine
Zone : BDD — Effort estimé : 1 semaine
**Contexte**
Si la tâche F-02 (renommage de colonnes) est étendue à toutes les inconsistances, l'impact est beaucoup plus large. Par exemple questionsGrid apparaît dans les composants Vue, les migrations, les controllers, les resources et les interfaces TS.
**Quoi faire**
Migrations de renommage pour toutes les colonnes camelCase
Mise à jour systématique de tout le code PHP
Mise à jour de toutes les interfaces TS
Mise à jour de tous les composants Vue qui accèdent directement aux champs
**Comment**
Faire colonne par colonne avec un grep exhaustif avant chaque migration
Déployer en transaction (migration + code en même commit)
**Risques / implications**
Risque de régression très élevé
Si la base est partagée avec d'autres outils (exports, imports), les noms de colonnes peuvent être exposés
**Fichiers concernés**
Toute la codebase


# Ordre recommandé
Suggestion : commencer par toutes les tâches Triviales en un sprint de nettoyage, puis traiter F-01 (éclater modelInterfaces.ts) en priorité car c'est le changement TS qui a le plus d'impact positif à court terme.

## Sprint 1 — Typage & nommage (1 semaine)
~~F-01 Éclater modelInterfaces.ts~~ ✅
F-02 Colonnes camelCase → snake_case (les 5 colonnes prioritaires)
F-03 Déplacer GeneratorApiController
F-04 Déplacer méthodes Generator hors de ChallengeApiController

## Sprint 2 — Backend structurel (1-2 semaines)
F-05 FormRequest pour LatexController
F-06 FormRequests manquants sur les ApiControllers
M-01 Éclater ScolcoursController
M-02 Refactoriser AdminController
M-04 Réactiver le cache des scores

## Sprint 3 — Frontend structurel (1-2 semaines)
M-05 Séparer useQuestionValidation
M-06 Typer strictement Lesson.scoreRules
M-07 Normaliser le pattern routes Challenge
M-03 Typer Score.data côté PHP

## Long terme — Architectural (selon priorités)
C-01 Couche Service
C-02 Isoler domaine Course/Lesson
C-03 Stores Pinia par domaine
MA-01 Enveloppe API standard
MA-02 Séparer routes web/api
MA-03 Migration snake_case globale


# Terminé

| ID | Titre | Date | Notes |
| --- | --- | --- | --- |
| F-01 | Éclater modelInterfaces.ts en fichiers domaine | 2026-03-07 | `LessonInterface` conservée dans `modelInterfaces.ts` (dépendance circulaire avec `lessonInterfaces.ts`). `index.d.ts` existant conservé comme barrel. |
| DB-01 | Refactoring table challenges — introduction de challenge_levels | 2026-03-16 | Nouvelle table `challenge_levels` (niveaux avec `points_to_pass`, `bonus JSON`). Colonne `config JSON` ajoutée à `generatorables`. Pivot generators déplacé de `Challenge` vers `ChallengeLevel`. Colonnes `maxLevel`, `nextLevelAfter`, `generatorsGrouping`, `durationByQuestion`, bonus* supprimées. Données migrées : générateurs existants placés en niveau 1. Modèles `Challenge`, `ChallengeLevel`, `Generator` mis à jour. |
| CH-01 | Implémentation des 6 modes de challenge | 2026-03-17 | Modes `classic`, `chrono`, `streak`, `blitz`, `endurance`, `precision` branchés dans `useChallenge.ts`. Timer ascendant (chrono), sans limite (endurance), countdown question (blitz). `ChallengeGameInterface` enrichi (`streak`, `levelDeaths`). `ChallengeInterface.type` typé en union littérale. `ChallengeGame`, `ChallengeGameScore`, `ChallengeIntro`, `ChallengeResults`, `ChallengeEdit` adaptés. |