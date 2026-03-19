
**SCOLCOURS**
Gymnase
Compte rendu complet du projet — Architecture, modules et logiques
Mars 2026

# 1. Vue d'ensemble
Scolcours est un site web d'enseignement des mathématiques destiné aux élèves de gymnase (lycée). Il couvre à la fois la présentation du contenu pédagogique, l'interaction avec les exercices, et le suivi des progressions des élèves.

## 1.1 Stack technique
| Couche | Technologie | Version | Rôle |
| --- | --- | --- | --- |
| Backend | Laravel | v12 | Framework PHP principal, routing, ORM, API |
| Frontend routing | Inertia.js | v2 | SPA sans API JSON classique, pages Vue rendues côté serveur |
| Frontend UI | Vue 3 | ^3.5 | Composants réactifs, Composition API |
| Styling | Tailwind CSS | v4 | Utilitaires CSS, design system |
| Build tool | Vite | v7 | Bundler, HMR, TypeScript |
| ORM | Eloquent | — | Modèles, relations, scopes |
| Auth | Laravel Sanctum | v4 | Tokens API + sessions web |
| Tests | Vitest | v4 | Tests unitaires TypeScript |
| Typage | TypeScript | v5.9 | Typage strict côté frontend |
| État global | Pinia | v3 | Stores Vue 3 |


## 1.2 Librairies métier (outils Pi)
Le projet embarque plusieurs librairies TypeScript développées en interne :
pimath (^0.2.3) — PiMath : fractions, polynômes, équations, expressions mathématiques
pidraw (^0.2.20) — PiDraw : illustrations 2D via commandes texte (SVG.js en dessous)
pithree (^0.1.1) — PiThree : illustrations 3D via commandes texte (Three.js en dessous)
piexpression (^0.1.3) — PiExpression : évaluation et parsing d'expressions
pigames (^0.1.18) — PiGames : logique de jeux mathématiques

## 1.3 Autres dépendances notables
| Package | Usage |
| --- | --- |
| KaTeX | Rendu LaTeX / formules mathématiques |
| markdown-it + plugins | Rendu Markdown avec LaTeX (texmath), attributs, spans |
| Mermaid | Diagrammes (graphes, flowcharts) |
| Chart.js + vue-chartjs | Graphiques statistiques (scores, progression) |
| @svgdotjs/svg.js | Base de PiDraw, manipulation SVG |
| Three.js | Base de PiThree, rendu 3D |
| vuedraggable | Drag & drop (réordonnancement de blocs, cartes...) |
| Ziggy | Génération des routes Laravel côté Vue/TS |
| @vueuse/core | Composables utilitaires (useStorage, useIntersection...) |
| Pinia | Stores globaux (EditMode, FlashMessage, Score) |
| dayjs | Manipulation des dates |
| qrcode.vue | Génération de QR codes |
| PrismJS | Colorisation syntaxique du code |


# 2. Architecture générale
## 2.1 Structure des routes
Les routes sont séparées en plusieurs fichiers thématiques, tous inclus depuis web.php :
| Fichier | Contenu |
| --- | --- |
| web.php | Page d'accueil, recherche, dashboard utilisateur, dico, QR code |
| auth.php | Authentification (login, register, reset password...) |
| admin.php | Administration générale |
| content/chapters.php | Chapitres, thèmes, slides, posts (web + API) |
| content/posts.php | Posts, blocs, questions (web + API) |
| content/blocks.php | Blocs et illustrations (web + API) |
| content/challenges.php | Challenges et générateurs associés (web + API) |
| content/decks.php | Decks et cartes (web + API) |
| content/questions.php | Questions (web + API) |
| content/generators.php | Générateurs d'exercices (web + API) |
| content/formulas.php | Fiches de formules (web + API) |
| content/tools.php | Outils mathématiques (web + API) |
| content/widgets.php | Widgets (API admin uniquement) |
| content/translations.php | Vocabulaire multilingue (commenté / désactivé) |
| gamesRoutes.php | Jeux (routes web) |
| latexRoutes.php | Génération de PDF LaTeX |
| management/ | Cours, leçons, équipes, évaluations, quizz |


Pattern cohérent : chaque fichier expose deux groupes — les routes 'web' (Inertia, retournent des pages Vue) et les routes 'api' (JSON, préfixées /api). Les routes admin sont protégées par le middleware 'admin'.

## 2.2 Structure des contrôleurs
Double couche de contrôleurs par domaine :
| Namespace | Rôle | Exemple |
| --- | --- | --- |
| App\Http\Controllers\web\ | Retourne des pages Inertia (Vue) | ChapterController::show() → Inertia::render('Chapters/ChapterShow') |
| App\Http\Controllers\api\ | Retourne du JSON pour les appels axios | ChapterApiController::store() → ChapterResource |
| App\Http\Controllers\ | Contrôleurs généraux (admin, auth...) | ScolcoursController, AdminController |


## 2.3 Structure des pages Vue (Inertia)
Les pages sont organisées par domaine dans resources/js/Pages/ :
Pages/{Domaine}/{Domaine}Index.vue — liste publique
Pages/{Domaine}/{Domaine}Show.vue — vue détaillée publique
Pages/{Domaine}/{Domaine}Edit.vue — édition admin
Pages/{Domaine}/{Domaine}Admin.vue — dashboard admin du domaine

Les composants réutilisables sont dans resources/js/Components/{Domaine}/.

# 3. Modèles de données et relations
## 3.1 Carte des modèles
| Modèle | Table | Relations clés | Traits |
| --- | --- | --- | --- |
| Theme | themes | hasMany Chapter, Tool, Course | — |
| Chapter | chapters | belongsTo Theme, hasMany Post, Formula, Challenge, Deck, Quizz | — |
| Post | posts | belongsTo Chapter, morphMany Block, morphMany Question, hasScores | HasQuestions, HasScores, HasUrl, BelongsToThrough |
| Block | blocks | morphTo (blockable), hasMany Illustration | — |
| Illustration | illustrations | belongsTo Block, belongsTo Widget | — |
| Widget | widgets | hasMany Illustration | — |
| Question | questions | morphTo (questionable), morphMany Block, hasScores | HasScores, HasUrl |
| Formula | formulas | belongsTo Chapter, belongsTo Block | — |
| Challenge | challenges | belongsTo Chapter, morphToMany Generator, morphMany Block, hasScores | HasScores |
| Generator | generators | morphToMany (generatorable) | — |
| Deck | decks | belongsTo Chapter, hasMany Card, hasScores | HasScores |
| Card | cards | belongsTo Deck, belongsTo Block (recto), belongsTo Block (verso, ref) | — |
| Quizz | quizzs | belongsTo Chapter, hasMany QuizzSession, morphMany Question | HasQuestions |
| QuizzSession | quizz_sessions | belongsTo Quizz, belongsToMany User | — |
| Evaluation | evaluations | morphMany Question, morphToMany Generator, belongsToMany Team | HasQuestions |
| Course | courses | belongsTo Theme, hasMany Lesson, morphMany Block | HasUrl |
| Lesson | lessons | belongsTo Course, morphTo (lessonable), hasScores | HasScores, HasUrl |
| Team | teams | belongsToMany User, belongsToMany Evaluation, belongsToMany Course | — |
| Score | scores | morphTo (scoreable), belongsTo User | — |
| Tool | tools | belongsTo Theme | — |
| User | users | belongsToMany Team | — |


## 3.2 Polymorphisme — le cœur de l'architecture
Deux relations polymorphiques traversent toute l'application :

### Blockable (contenu riche)
Un Block peut appartenir à n'importe quel modèle "porteur de contenu" :
Post → blocks (corps d'un cours)
Chapter → blocks (intro du chapitre)
Challenge → blocks (énoncé du challenge)
Quizz → blocks (intro / outro)
Course → blocks
Lesson → blocks
Question → blocks (énoncé de la question)

### Questionable (exercice interactif)
Une Question peut appartenir à :
Post → questions (exercices intégrés dans un cours)
Quizz → questions
Evaluation → questions

### Scoreable (suivi de progression)
Un Score peut être attaché à :
Question, Post, Deck, Card, Challenge, Generator, Lesson

### Generatorable (générateurs d'exercices)
Un Generator peut être attaché à :
Challenge → generators
Evaluation → generators

### Lessonable (contenu d'une leçon)
Une Lesson peut pointer vers :
Post (lecture d'un cours)
Challenge (exercice interactif)
Deck (révision de flashcards)
Evaluation (contrôle)

# 4. Modules applicatifs
## 4.1 Posts — Le cours
Un Post est l'unité de base du contenu pédagogique. Il représente une "page" ou une "section" d'un chapitre.

### Données
| Champ | Type | Description |
| --- | --- | --- |
| title | string | Titre du post |
| type | string|null | Type de présentation (ex: 'howto', 'exercise'...) |
| order | int | Ordre dans le chapitre |
| questionsGrid | string|null | JSON définissant la mise en page des questions |
| script | string | Script JS/TS exécuté sur la page |
| switch | string|null | Toggle pour afficher/masquer du contenu |
| active | bool | Visibilité publique |
| revise | bool | Marqué pour révision |
| calculator | bool | Calculatrice autorisée |


### Relations
belongsTo Chapter
morphMany Block (le contenu textuel/visuel)
morphMany Question (les exercices interactifs)
morphMany Score (progression par utilisateur)

### Vues
PostController::show() → ChapterShow.vue (le post est affiché dans le contexte du chapitre, pas seul)
PostController::edit() → Pages/Posts/PostEdit.vue (admin)

Un Post est affiché comme une 'slide' dans ChapterShow.vue. La navigation entre posts se fait via l'URL /{theme}/{chapter}/{order}.


## 4.2 Blocks — Le contenu riche
Un Block est le brique atomique du contenu. Il peut contenir du texte, des formules, du code, des illustrations, etc.

### Données
| Champ | Type | Description |
| --- | --- | --- |
| type | string | Type de block (text, definition, theorem, example, proof, exercise...) |
| title | string|null | Titre optionnel |
| body | string|null | Corps Markdown (rendu via markdown-it + KaTeX) |
| template | string|null | Template d'affichage alternatif |
| illustrationsGrid | string|null | JSON pour la mise en page des illustrations |
| script | string|null | Script JS exécuté pour ce bloc |
| json | string|null | Données JSON arbitraires |
| merge | bool | Fusionner ce bloc avec le précédent |
| switch | int|null | Toggle d'affichage |
| order | int | Ordre dans le parent |


Le champ 'body' est du Markdown enrichi : il supporte LaTeX via markdown-it-texmath, des attributs CSS via markdown-it-attrs, et des spans via markdown-it-bracketed-spans.

### Illustrations
Un Block peut contenir plusieurs Illustrations, chacune pointant vers un Widget :
Widget — définit le composant Vue à utiliser (PiDraw, PiThree, grapheur, tableau...)
Illustration — instancie un widget avec des paramètres (code PiDraw, config...)

## 4.3 Questions — Les exercices interactifs
Le module Question est transversal : une même Question peut apparaître dans un Post, un Quizz ou une Evaluation.

### Données
| Champ | Type | Description |
| --- | --- | --- |
| answer | string|null | La réponse attendue |
| equationControl | string|null | Règle de vérification étendue (équations) |
| keyboard | string|null | Clavier virtuel à afficher (math, fraction, etc.) |
| css | string|null | CSS spécifique |
| display_if | string|null | Condition d'affichage (logique conditionnelle) |
| order | int | Ordre d'affichage |


### Logique de validation
La validation d'une réponse est complexe et implique plusieurs couches :
Frontend : composables useQuestion.ts, useQuestionValidation.ts, computeQuestionBlock.ts
Backend : route POST /api/students/questions/{question}/validate
Le champ 'equationControl' permet de définir des règles étendues (ex: accepter les formes équivalentes)

### Clavier virtuel
Les Questions peuvent afficher un clavier virtuel mathématique, défini par le champ 'keyboard'. Les composants sont dans Components/Keyboards/.

### Condition display_if
Une question peut être conditionnellement affichée selon les réponses d'autres questions (champ display_if). Cela permet de créer des exercices adaptatifs.


## 4.4 Challenges — Le jeu mathématique
Un Challenge est un mode de jeu chronométré avec des vies, des niveaux et un scoring. Il repose sur des Générateurs d'exercices.

### Données
| Champ | Type | Description |
| --- | --- | --- |
| title | string | Titre |
| slug | string | Identifiant URL |
| duration | int | Durée d'une question (secondes) |
| lives | int | Nombre de vies |
| nextLevelAfter | int | Bonnes réponses pour passer au niveau suivant |
| generatorsGrouping | int | Nombre de générateurs actifs simultanément |
| bonusLevelLife / bonusLevelTime | int | Bonus niveau pour vie/temps restant |
| bonusScoreLife / bonusScoreTime / bonusScoreTrigger | int | Bonus score |


### Générateurs
Un Challenge est lié à plusieurs Générateurs via une relation polymorphique (generatorable). Chaque générateur contient du code TypeScript/PiMath qui génère dynamiquement une question et sa réponse.

### États du jeu
intro — écran d'accueil du challenge
running — jeu en cours
finished — résultat final

### Score
Le score du challenge est sauvegardé via Score (scoreable). Les meilleurs scores sont conservés.

## 4.5 Decks & Cards — Les flashcards
Un Deck est un jeu de flashcards de révision. Chaque Card a un recto et un verso (deux Blocks), et peut avoir une référence vers un Block source.

### Mécanique
L'élève voit le recto, devine le verso, puis se note
Algorithme de répétition espacée basé sur les scores (Score scoreable)
Vue 'portfolio' pour voir toutes les cartes d'un deck

### Relations
Deck belongsTo Chapter
Deck hasMany Card
Card belongsTo Block (recto), belongsTo Block (verso), optionnel reference Block
Deck morphMany Score, Card morphMany Score


## 4.6 Quizz — La session interactive en classe
Le Quizz est un module de présentation interactive en classe (mode projecteur). L'enseignant pilote la session, les élèves répondent en direct.

### Flux
L'admin crée un Quizz avec des Questions
Il ouvre une QuizzSession (shortcode généré)
Les élèves rejoignent via le shortcode
L'enseignant navigue question par question (QuizzProjection.vue)
Les réponses sont collectées et affichées

### États d'une session
| Statut | Description |
| --- | --- |
| intro | Page d'attente |
| question | Question affichée en cours |
| outro | Session terminée |
| error | Erreur |


### Projection
QuizzProjection.vue est une vue dédiée à l'affichage sur grand écran (projecteur), contrôlée par l'enseignant via QuizzShow.vue.


## 4.7 Evaluations — Le contrôle
Une Evaluation est un ensemble de questions destiné à un ou plusieurs groupes (Teams). Elle peut combiner des Questions statiques et des Générateurs dynamiques.

### Particularités
randomOrder : l'ordre des questions est aléatoire par élève
auto_control : correction automatique activée/désactivée
Assignable à une ou plusieurs Teams
Peut inclure des Générateurs (exercices générés dynamiquement à chaque passage)


## 4.8 Courses & Lessons — Le planning pédagogique
Course et Lesson forment un module de planification structuré, le plus récent du projet (2025).

### Course
Un Course est un ensemble de leçons ordonnées
Il appartient à un Theme et est assigné à des Teams
Il a un Block de description et un statut (not yet started / active / finished)

### Lesson
Une Lesson pointe vers un contenu via la relation polymorphique lessonable
Peut pointer vers : Post, Challenge, Deck ou Evaluation
Contient des scoreRules (règles de validation de la leçon)
Supporte requires (dépendances entre leçons)
Peut être marquée homework (devoir à la maison)
Liée à un calendrier (LessonCalendar avec date, heure, équipe)

C'est le module qui donne une dimension 'planification de cours' à l'application, permettant à l'enseignant de créer un programme structuré avec des deadlines.

## 4.9 Chapitres & Thèmes — L'organisation du contenu

### Theme
Un Thème est la catégorie de plus haut niveau (ex: Algèbre, Géométrie, Analyse...). Il a une couleur, une icône et un ordre.

### Chapter
Un Chapitre regroupe un ensemble de Posts sur un sujet précis. Il a :
Un Block d'introduction
Des Posts ordonnés (les pages du cours)
Des Formulas (fiches de formules)
Des Challenges
Des Decks
Des Quizzs
Des relations avec d'autres chapitres (chapter_relation)
Un meta_title pour le SEO

### Navigation
La navigation suit le pattern : /{theme:slug}/{chapter:slug}/{order} où 'order' est la position du Post dans le chapitre.


## 4.10 Formulas — Les fiches de formules
Une Formula est une fiche de référence mathématique associée à un chapitre. Elle contient essentiellement un Block avec le contenu formaté en Markdown/KaTeX.
Ordonnables dans un chapitre
Dupliables et déplaçables entre chapitres (admin)
Accessibles via /formulaire


## 4.11 Tools — Les outils mathématiques
Un Tool est une page interactive autonome (calculatrice, grapheur, etc.), appartenant à un Theme. Il possède un body et un champ parameters pour la configuration.


## 4.12 Widgets — Les composants visuels
Un Widget définit un type de composant visuel réutilisable (PiDraw, PiThree, tableau, grapheur...). Il est instancié dans les Illustrations avec des paramètres spécifiques.
| Champ | Description |
| --- | --- |
| component | Nom du composant Vue à utiliser |
| slug | Identifiant technique |
| name | Nom affiché |
| description | Description |
| control | Affiche des contrôles interactifs |
| theme_id | Thème associé |


# 5. Système de progression (Scores)
Le Score est un modèle polymorphique central qui enregistre la progression de chaque utilisateur sur chaque entité scoreable.

## 5.1 Modèle Score
| Champ | Type | Description |
| --- | --- | --- |
| user_id | int | L'utilisateur |
| scoreable_type | string | Classe du modèle (Post, Question, Deck, Card, Challenge, Generator, Lesson) |
| scoreable_id | int | ID du modèle |
| score | float | Score numérique |
| is_resolved | bool | L'objectif est-il atteint ? |
| attempts | int | Nombre de tentatives |
| data | json | Données spécifiques au type (réponse donnée, temps passé...) |


## 5.2 Trait HasScoresTrait
Ce trait est utilisé par tous les modèles scoreables. Il fournit :
scores() — morphMany vers Score
scoreForAuth() — morphOne pour l'utilisateur connecté
scoreFor(User) — score pour un utilisateur donné
scoresFromUser(User) — récupère ou crée le score
updateCache(Score) — mise à jour du cache Redis (désactivé en dev)

## 5.3 Store Pinia — useStoreScore
Le store useStoreScore gère l'état des scores côté Vue, avec synchronisation vers l'API.


# 6. Gestion des équipes (Teams)
Une Team est un groupe d'élèves (une classe). Elle est centrale dans le workflow pédagogique.

Une Team appartient à plusieurs Users
Une Team peut être assignée à des Evaluations et des Courses
TeamCalendar définit les créneaux horaires de chaque équipe
LessonCalendar lie une Lesson à une Team avec une date/heure
SchoolTimetable et LessonCalendar permettent la gestion du calendrier scolaire


# 7. Module Games
Le dossier Pages/Games/ et gamesRoutes.php contiennent des jeux mathématiques autonomes (mots croisés mathématiques, jeux de vocabulaire...). Ces jeux utilisent les librairies PiGames et les données de vocabulaire (TranslationLanguage, TranslationBook, TranslationUnit).
Le module de vocabulaire/traduction est actuellement commenté dans les routes (translations.php entièrement commenté). Il est en attente de refactorisation.


# 8. Problèmes identifiés et logiques croisées
## 8.1 Routes — Incohérences
Mélange de préfixes admin : certaines routes admin ont le préfixe 'admin', d'autres non (commentaires // ROUTE: ajout prefix admin dans chapters.php)
Une route de débogage en production : Route::get('chaptersTest/{chapter}/edit', function($chapter) { dd($chapter); })
La route 'chapters.show' est en fait une redirection — elle redirige vers themes.chapters.show
Coexistence de deux patterns de show pour les challenges : q/{slug} (raccourci) et /{theme}/{chapter}/challenges/{slug} (contextualisé)
GeneratorApiController est dans le namespace web (App\Http\Controllers\web\) au lieu de api

## 8.2 Contrôleurs — Responsabilités floues
AdminController::tools() duplique la logique de ToolController::index() (admin)
ScolcoursController concentre trop de responsabilités : page d'accueil, recherche, dashboard, dictionnaire, QR code
QuizzSessionApiController est à la racine du namespace controllers, pas dans api/ ni web/
Les annotations @property des modèles (générées par ide-helper) sont souvent désynchronisées avec les migrations récentes

## 8.3 Modèles — Logiques croisées
Post, Chapter, Quizz, Evaluation, Course utilisent tous HasQuestionsTrait, mais la question est affichée très différemment selon le contexte — la logique de rendu est éparpillée
Block est à la fois un conteneur de contenu (pour Post/Chapter) ET un conteneur d'énoncé (pour Question). La distinction n'est pas toujours claire
Score.data est un champ JSON non typé côté PHP. Côté TS, les interfaces ScoreCardDataInterface, ScoreDeckDataInterface, etc. existent mais ne sont pas enforced côté backend
Lesson.scoreRules est un array JSON dont la structure varie selon le type de lessonable — pas de validation de schéma

## 8.4 Frontend — Couplages
modelInterfaces.ts contient TOUS les types dans un seul fichier (27 interfaces)
ChallengeMinInterface est défini deux fois dans modelInterfaces.ts (doublon)
Le composable useQuestion.ts mélange logique de rendu, logique de validation et appels API
Les stores Pinia sont très peu nombreux (3) par rapport à la complexité — beaucoup d'état local partagé via provide/inject ou props drilling
block.config.ts semble définir la configuration globale des types de blocs, mais son usage n'est pas systématique

## 8.5 Nommage — Inconsistances
| Problème | Exemple |
| --- | --- |
| camelCase vs snake_case dans les champs JSON | questionsGrid, illustrationsGrid, display_if vs displayif |
| Pluriel anglais non standard | La table s'appelle 'quizzs' au lieu de 'quizzes' |
| Mixte FR/EN dans les noms | formulaire (URL) vs formulas (route name), voc (désactivé) |
| Interfaces dupliquées | ChallengeMinInterface défini 2x dans modelInterfaces.ts |


# 9. Recommandations pour la restructuration
## 9.1 Backend — Priorité haute
Créer des Form Requests pour tous les ApiControllers (actuellement la validation est souvent dans le controller)
Créer des API Resources systématiques pour découpler la sérialisation du modèle
Déplacer GeneratorApiController vers app/Http/Controllers/api/
Supprimer la route de débogage chaptersTest
Standardiser les préfixes admin dans toutes les routes
Typer Score.data côté PHP avec des Casts personnalisés par scoreable_type

## 9.2 Frontend — Priorité haute
Éclater modelInterfaces.ts en fichiers par domaine : chapterInterfaces.ts, postInterfaces.ts, scoreInterfaces.ts (déjà fait), etc.
Corriger le doublon ChallengeMinInterface
Extraire les appels API de useQuestion.ts dans un service dédié questionService.ts
Créer des stores Pinia pour les domaines qui en ont besoin (useQuizzStore, useChallengeStore...)

## 9.3 Architecture — Moyen terme
Isoler le module Course/Lesson dans son propre domaine (routes, controllers, pages, types)
Créer une couche Service entre Controller et Model pour les logiques métier complexes
Standardiser la réponse API : envelopper toutes les réponses dans { data, meta }
Documenter les types de Block (block.config.ts) et les rendre la référence unique

La structure polymorphique actuelle (Blockable, Questionable, Scoreable, Generatorable, Lessonable) est bien conçue et doit être conservée. C'est elle qui donne la flexibilité au système. Le travail de refactorisation doit s'appuyer dessus, pas la contourner.

# 10. Annexe — Inventaire complet des fichiers
## Modèles PHP
Theme, Chapter, Post, Block, Illustration, Widget, Question, Formula, Challenge, Generator, Deck, Card, Quizz, QuizzSession, Evaluation, Course, Lesson, LessonCalendar, Score, Team, Tool, User, Scolcours, LatexPdf, SchoolTimetable, Translation, TranslationBook, TranslationLanguage, TranslationUnit

## Contrôleurs API
BlockApiController, CardApiController, ChallengeApiController, ChapterApiController, CourseApiController, DeckApiController, EvaluationApiController, FormulaApiController, IllustrationApiController, LessonApiController, PostApiController, QuestionApiController, QuizzApiController, ScoreApiController, TeamApiController, TeamCalendarApiController, ToolApiController, WidgetApiController, QuizzSessionApiController, GeneratorApiController*
*GeneratorApiController est dans le namespace web/ — à déplacer

## Contrôleurs Web
BlockController, ChallengeController, ChapterController, CourseController, DeckController, EvaluationController, FormulaController, GeneratorController, IllustrationController, LessonController, PostController, QuestionController, QuizzController, TeamController, ToolController, TranslationController, ScolcoursController, AdminController, DevController, LatexController

## Pages Vue
Admin/: AdminDashboard, AdminSettings, AdminUsers
Chapters/: ChapterIndex, ChapterShow (slide view), ChapterEdit, ChapterAdmin
Posts/: PostEdit
Blocks/: BlockEdit
Challenges/: ChallengeIndex, ChallengeShow, ChallengeEdit, ChallengeAdmin
Decks/: DeckIndex, DeckShow, DeckEdit, DeckAdmin
Quizzs/: QuizzAdmin, QuizzDashboard, QuizzEdit, QuizzIndex, QuizzProjection, QuizzShow
Evaluations/: EvaluationEdit, EvaluationIndex, EvaluationShow
Courses/: CourseEdit, CourseIndex, CourseShow, CourseShowDashboard, LessonShow, LessonTeamCalendar
Generators/: GeneratorEdit, GeneratorShow, GeneratorAdmin
Questions/: QuestionShow, QuestionShowAdmin, QuestionsIndex, QuestionsIndexAdmin
Teams/: TeamEdit, TeamIndex, TeamShow, TeamAdmin
Tools/: ToolEdit, ToolIndex, ToolShow, ToolAdmin
Widgets/: WidgetEdit, WidgetAdmin
Formulas/: FormulaIndex, FormulaShow
Singles/: GraduatePage (barème), GraphPage (grapheur)
HomPage, DashboardPage, Error404, QRCode, WidgetFullscreen