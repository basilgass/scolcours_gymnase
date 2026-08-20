# Structure suggérée — `resources/js/`

> **Légende des annotations :**
> - ✅ conserver tel quel
> - 🔀 déplacer / renommer
> - 🗑️ supprimer (fichiers morts)
> - 🆕 créer
> - ⚠️ à discuter

---

## Vue d'ensemble

```
resources/js/
├── app.ts                          ✅
├── bootstrap.ts                    ✅
├── ziggy.js                        ✅ (généré)
│
├── config/                         🆕 (regroupe les fichiers de config épars)
│   ├── block.config.ts             🔀 (était à la racine)
│   ├── checker.config.ts           🔀 (était dans Checkers/)
│   └── keyboard.config.ts          🔀 (était Composables/keyboardConfig.ts)
│
├── types/                          ✅ structure existante, à compléter
│   ├── index.d.ts                  ✅
│   ├── global.d.ts                 ✅
│   ├── vite-env-d.ts               ✅
│   ├── resourseInterfaces.ts       🔀 renommer → resourceInterfaces.ts
│   ├── scoreInterfaces.ts          ✅
│   ├── lessonInterfaces.ts         ✅
│   ├── keyboardInterfaces.ts       ✅
│   ├── challengeInterface.ts       🔀 renommer → challengeInterfaces.ts (pluriel)
│   ├── evaluationInterfaces.ts     ✅
│   │
│   │   — À créer en éclatant modelInterfaces.ts —
│   ├── blockInterfaces.ts          🆕
│   ├── chapterInterfaces.ts        🆕
│   ├── courseInterfaces.ts         🆕
│   ├── deckInterfaces.ts           🆕
│   ├── postInterfaces.ts           🆕
│   ├── quizzInterfaces.ts          🆕
│   ├── userInterfaces.ts           🆕
│   ├── widgetInterfaces.ts         🆕
│   └── modelInterfaces.ts          🗑️ (supprimé après migration)
│
├── stores/                         ✅ structure existante, à étendre
│   ├── useStoreEditMode.ts         ✅
│   ├── useStoreFlashMessage.ts     ✅
│   ├── useStoreScore.ts            ✅
│   ├── useStoreChallenge.ts        🆕 (état jeu : gameState, lives, score, currentGenerator)
│   ├── useStoreQuizz.ts            🆕 (état session : current, status, projection)
│   └── useStoreCourse.ts           🆕 (progression leçons, état lessonable actif)
│
├── directives/                     ✅
│   ├── adminDirectives.ts          ✅
│   ├── katexDirectives.ts          ✅
│   └── themeDirectives.ts          ✅
│
├── helpers/                        ✅ structure existante, à nettoyer
│   ├── makeModel.ts                ✅ (factory d'objets vides)
│   ├── helperFunctions.ts          ✅ (shake, numberCorrection...)
│   ├── routeWithContext.ts         ✅
│   ├── blockTemplate.ts            ✅
│   ├── cipher.ts                   ✅
│   ├── greekLaTeX.ts               ✅
│   ├── mdAutofill.ts               ✅
│   ├── liste-des-mots-francais.js  ✅ (données statiques)
│   ├── liste-des-mots-francais-pli07.js  ✅
│   └── pli07.txt                   ✅
│
├── lib/                            🆕 (librairies internes non-composables)
│   ├── asciimath2tex.ts            🔀 (était à la racine)
│   ├── ProbabilityTree.ts          🔀 (était à la racine)
│   └── PiMathExtended/             🔀 (était à la racine)
│       ├── PiMathExt.ts
│       ├── PiRadian.ts
│       └── RandomExt.ts
│
├── Composables/                    ✅ structure existante, à compléter
│   ├── useChallenge.ts             ✅
│   ├── useDownloadPdf.ts           ✅
│   ├── useGenerator.ts             ✅
│   ├── useGlobalClick.ts           ✅
│   ├── useHelpers.ts               ✅
│   ├── useKeyboard.ts              ✅
│   ├── useMermaidDispatcher.ts     ✅
│   ├── useScriptLoader.ts          ✅
│   ├── useTextEditor.ts            ✅
│   ├── useToolsStorage.ts          ✅
│   ├── useTos.ts                   ✅
│   ├── useCourse.ts                🔀 (était Pages/Courses/useCourse.ts)
│   ├── useQuestion.ts              🔀 (était Components/Questions/)
│   ├── useQuestionAdmin.ts         🔀 (était Components/Questions/)
│   ├── useQuestionHelpers.ts       🔀 (était Components/Questions/)
│   ├── useQuestionValidation.ts    🔀 (était Components/Questions/)
│   ├── useWidget.ts                🔀 (était Components/Widgets/)
│   └── useLanguage.ts              🔀 (était Components/Languages/)
│
├── Checkers/                       ✅ bien structuré — déplacer checker.config.ts
│   ├── index.ts                    ✅
│   ├── CheckerAbstract.ts          ✅
│   ├── PiChecker.ts                ✅
│   ├── checkMathString.ts          ✅
│   ├── checkerCheckFunctions.ts    ✅
│   ├── checkerHelperFunctions.ts   ✅
│   ├── checker.config.ts           🔀 → config/checker.config.ts
│   ├── Basic/                      ✅
│   │   ├── index.ts
│   │   ├── CoordChecker.ts ... (18 fichiers)
│   └── Custom/                     ✅
│       ├── index.ts
│       └── DrawChecker.ts ... (8 fichiers)
│
├── Layouts/                        ✅
│   ├── LayoutAdmin.vue
│   ├── LayoutFullpage.vue
│   ├── LayoutFullscreen.vue
│   ├── LayoutGuest.vue
│   ├── LayoutMain.vue
│   ├── LayoutMainLarge.vue
│   └── LayoutProjection.vue
│
├── Components/
│   │
│   ├── Ui/                         ✅ composants génériques sans logique métier
│   │   ├── Button/
│   │   │   ├── scButton.vue
│   │   │   ├── button.config.ts
│   │   │   └── button.css
│   │   ├── Accordion.vue
│   │   ├── AccordionBody.vue
│   │   ├── AccordionItem.vue
│   │   ├── ArticleSubtitle.vue
│   │   ├── ArticleTitle.vue
│   │   ├── Card.vue
│   │   ├── ConfirmButton.vue
│   │   ├── ContentSeparator.vue
│   │   ├── DarkModeSwitch.vue
│   │   ├── DialogModal.vue
│   │   ├── DropdownMenu.vue
│   │   ├── EditLink.vue
│   │   ├── FilteredList.vue
│   │   ├── FlashContainer.vue
│   │   ├── FlashMessage.vue
│   │   ├── InfoTile.vue
│   │   ├── LogoutButton.vue
│   │   ├── MarkdownIt.vue
│   │   ├── MermaidDiagram.vue      🔀 (était à la racine de Components/)
│   │   ├── PleaseWait.vue
│   │   ├── ScolcoursLogo.vue       🔀 (était à la racine de Components/)
│   │   ├── SplitView.vue           🔀 (était à la racine de Components/)
│   │   ├── StatBar.vue
│   │   ├── TableOfContents.vue
│   │   ├── TexCode.vue
│   │   ├── ThemeLinks.vue
│   │   ├── ThemeSelector.vue
│   │   └── errorBoundary.vue       🔀 (était à la racine de Components/)
│   │
│   ├── Layout/                     🆕 (composants structurels de la page)
│   │   ├── MainHeader.vue          🔀 (était à la racine de Components/)
│   │   ├── MainFooter.vue          🔀 (était à la racine de Components/)
│   │   ├── MainAside.vue           🔀 (était à la racine de Components/)
│   │   └── MoveItemTo.vue          🔀 (était à la racine — utilitaire de déplacement)
│   │
│   ├── Search/                     🆕 (regroupe les composants de recherche)
│   │   ├── ScolcoursSearch.vue     🔀 (était à la racine de Components/)
│   │   └── FormulaSearch.vue       🔀 (était à la racine de Components/)
│   │
│   ├── Form/                       ✅
│   │   ├── FormMaker.vue
│   │   ├── FormMakerWrapper.vue
│   │   ├── FormMakerError.vue
│   │   ├── FormMakeLoader.vue
│   │   ├── FormImageDrop.vue
│   │   ├── FormMakerInterface.ts
│   │   ├── FormElements/           ✅ (12 éléments)
│   │   ├── FormSearchModel/        ✅
│   │   └── FormValidation/         ✅
│   │
│   ├── Admin/                      ✅
│   │   ├── AdminDashboardAside.vue
│   │   ├── AdminHeader.vue
│   │   └── Parts/
│   │       └── AdminTeamManager.vue
│   │
│   ├── Pi/                         ✅ composants de rendu PiDraw/PiThree
│   │   ├── PiDrawParser.vue
│   │   ├── PiThreeParser.vue
│   │   ├── PiEuclidian.vue
│   │   ├── PiProbabilityTree.vue
│   │   ├── PiTableOfSigns.vue
│   │   ├── TableOfSigns.vue
│   │   ├── PiDrawHelper.ts
│   │   ├── Parts/
│   │   └── PiDrawComponents/
│   │
│   ├── Widgets/                    ✅ composants instanciables via Illustration
│   │   ├── block-widget.vue
│   │   ├── draw-parser-widget.vue
│   │   ├── theee-parser-widget.vue  ⚠️ renommer → three-parser-widget.vue
│   │   ├── formula-widget.vue
│   │   ├── generator-widget.vue
│   │   ├── image-widget.vue
│   │   ├── mermaid-widget.vue
│   │   ├── etapes-par-etapes.vue
│   │   ├── Card-widget.vue          ⚠️ renommer → card-widget.vue (minuscule)
│   │   ├── useWidget.ts             🔀 → Composables/useWidget.ts
│   │   ├── algebre/
│   │   ├── analyse/
│   │   ├── arithmetique/
│   │   └── statistiques/
│   │
│   ├── Tools/                      ✅ outils mathématiques interactifs autonomes
│   │   ├── Parts/
│   │   │   ├── ToolForm.vue
│   │   │   ├── ToolError.vue
│   │   │   ├── ToolsSearch.vue
│   │   │   └── matrice-augmentee-instructions.md  🔀 → public/ ou docs/
│   │   ├── affine.vue
│   │   ├── algorithme-euclide-et-bezout.vue
│   │   ├── ... (28 outils)
│   │   └── etude-de-fonction-rationnelle.bak  🗑️
│   │
│   ├── Keyboards/                  ✅
│   │   ├── KeyboardDisplay.vue
│   │   ├── KeyboardInput.vue
│   │   ├── KeyboardBasic.vue
│   │   ├── KeyboardMatrix.vue
│   │   ├── KeyboardQcm.vue
│   │   ├── KeyboardResolution.vue
│   │   ├── KeyboardDraw.vue
│   │   ├── KeyboardDrawZones.vue
│   │   ├── KeyboardOrder.vue
│   │   ├── KeyboardSentence.vue
│   │   ├── KeyboardTableOfSigns.vue
│   │   ├── KeyboardType.vue
│   │   ├── KeyboardStudy.vue
│   │   ├── KeyboardStudy.disabled  🗑️ (ou archiver hors du repo)
│   │   └── KeyboardHelpers/
│   │       ├── KeyboardResolutionMiseEvidence.vue
│   │       ├── KeyboardResolutionTrinome.vue
│   │       ├── KeyboardStudyButton.vue
│   │       ├── KeyboardStudyCreatedList.vue
│   │       └── KeyboardStudyHelpers.ts
│   │
│   ├── Questions/                  ✅ composants d'affichage
│   │   ├── QuestionShow.vue
│   │   ├── QuestionShowAdmin.vue
│   │   ├── QuestionsIndex.vue
│   │   ├── QuestionsIndexAdmin.vue
│   │   ├── QuestionInterface.ts    🔀 → types/questionInterfaces.ts  ⚠️
│   │   ├── computeQuestionBlock.ts
│   │   ├── useQuestion.ts          🔀 → Composables/useQuestion.ts
│   │   ├── useQuestionAdmin.ts     🔀 → Composables/useQuestionAdmin.ts
│   │   ├── useQuestionHelpers.ts   🔀 → Composables/useQuestionHelpers.ts
│   │   ├── useQuestionValidation.ts 🔀 → Composables/useQuestionValidation.ts
│   │   └── Parts/
│   │       ├── QuestionAnswer.vue
│   │       ├── QuestionAnswerSelector.vue
│   │       ├── QuestionAnswerToggleKeyboard.vue
│   │       ├── QuestionAnswerValidation.vue
│   │       ├── QuestionBlock.vue
│   │       ├── QuestionFooter.vue
│   │       └── QuestionHeader.vue
│   │
│   ├── Blocks/                     ✅
│   │   ├── BlockShow.vue
│   │   ├── BlockShowAdmin.vue
│   │   ├── BlocksIndex.vue
│   │   ├── BlockBodyButtons.vue
│   │   └── FormulaShow.vue
│   │
│   ├── Illustrations/              ✅
│   │   ├── IllustrationIndex.vue
│   │   └── IllustrationShow.vue
│   │
│   ├── Charts/                     ✅
│   │   ├── barChart.vue
│   │   ├── boxPlotChart.vue
│   │   └── lineChart.vue
│   │
│   ├── Chapters/                   ✅
│   ├── Challenges/                 ✅
│   ├── Courses/                    ✅
│   ├── Decks/                      ✅
│   ├── Evaluations/                ✅
│   ├── Formulas/                   🆕 (à créer, FormulaShow.vue est dans Blocks/)
│   │   └── FormulaShow.vue         🔀 (était dans Components/Blocks/)
│   ├── Posts/                      ✅
│   ├── Quizzs/                     ✅
│   ├── Teams/                      ✅
│   ├── Languages/                  ✅ (si module réactivé)
│   │   ├── useLanguage.ts          🔀 → Composables/useLanguage.ts
│   │   ├── LanguageDecks_BACKUP.bkp  🗑️
│   │   └── ...
│   ├── Grapheur/                   ⚠️ à intégrer dans Tools/ ou Pi/ ?
│   │   └── GrapheurFunction.vue
│   ├── WidgetForm.vue              🔀 → Components/Widgets/WidgetForm.vue
│   └── Elements/                  🔀 renommer → Shared/ ou dissoudre
│       ├── CardItem.vue            → Components/Decks/
│       ├── GeneratorItem.vue       → Components/Generators/ (à créer)
│       ├── GeneratorsExamples.vue  → Components/Generators/
│       └── ToolEditItem.vue        → Components/Tools/Parts/
│
├── Pages/
│   ├── HomePage.vue                ✅
│   ├── DashboardPage.vue           ✅
│   ├── Error404.vue                ✅
│   ├── QRCode.vue                  ✅
│   ├── WidgetFullscreen.vue        ✅
│   │
│   ├── Auth/                       ✅ (6 pages)
│   ├── Admin/                      ✅ (13 pages de dashboard admin)
│   │
│   ├── Chapters/                   ✅
│   │   ├── ChapterIndex.vue
│   │   ├── ChapterShow.vue
│   │   ├── ChapterPostShow.vue
│   │   └── ChapterEdit.vue
│   │
│   ├── Posts/                      ✅
│   │   └── PostEdit.vue
│   │
│   ├── Blocks/                     ✅
│   │   └── BlockEdit.vue
│   │
│   ├── Illustrations/              ✅
│   │   └── IllustrationEdit.vue
│   │
│   ├── Questions/                  ✅
│   │   └── QuestionEdit.vue
│   │
│   ├── Challenges/                 ✅
│   │   ├── ChallengesIndex.vue
│   │   ├── ChallengeShow.vue
│   │   └── ChallengeEdit.vue
│   │
│   ├── Decks/                      ✅
│   │   ├── DeckIndex.vue
│   │   ├── DeckShow.vue
│   │   ├── DeckDisplay.vue
│   │   ├── DeckPortfolio.vue
│   │   └── DeckEdit.vue
│   │
│   ├── Quizzs/                     ✅
│   │   ├── QuizzIndex.vue
│   │   ├── QuizzShow.vue
│   │   ├── QuizzProjection.vue
│   │   ├── QuizzAdmin.vue
│   │   ├── QuizzDashboard.vue
│   │   └── QuizzEdit.vue
│   │
│   ├── Evaluations/                ✅
│   │   ├── EvaluationIndex.vue
│   │   ├── EvaluationShow.vue
│   │   ├── EvaluationEdit.vue
│   │   └── admin/                  ✅ (sous-dossier cohérent)
│   │       ├── AdminEvaluationPage.vue
│   │       └── AdminEvaluationShow.vue
│   │
│   ├── Courses/                    ✅
│   │   ├── CourseIndex.vue
│   │   ├── CourseShow.vue
│   │   ├── CourseShowDashboard.vue
│   │   ├── CourseEdit.vue
│   │   ├── LessonShow.vue
│   │   ├── LessonTeamCalendar.vue
│   │   └── useCourse.ts            🔀 → Composables/useCourse.ts
│   │
│   ├── Generators/                 ✅
│   │   ├── GeneratorShow.vue
│   │   └── GeneratorEdit.vue
│   │
│   ├── Tools/                      ✅
│   │   ├── ToolsIndex.vue
│   │   ├── ToolsShow.vue
│   │   └── ToolsEdit.vue
│   │
│   ├── Formulas/                   ✅
│   │   └── FormulaIndex.vue
│   │
│   ├── Teams/                      ✅
│   │   ├── TeamChallengeShow.vue
│   │   ├── TeamPostShow.vue
│   │   └── admin/                  ✅
│   │       ├── TeamAdminIndex.vue
│   │       └── TeamAdminShow.vue
│   │
│   ├── Singles/                    ✅
│   │   ├── GraduatePage.vue
│   │   └── GraphPage.vue
│   │
│   ├── Games/                      ✅
│   │   ├── futoshiki.vue
│   │   └── wordle.vue
│   │
│   ├── Languages/                  ✅ (si module réactivé)
│   │   ├── LanguageIndex.vue
│   │   ├── LanguageShow.vue
│   │   └── LanguageImport.vue
│   │   (était Pages/languages/ — minuscule → majuscule)
│   │
│   └── Devs/                       ✅
│       ├── DevsIndex.vue
│       └── DevsShow.vue
│       (les composants Dev* restent dans Components/Devs/)
```

---

## Résumé des changements

### Fichiers à supprimer 🗑️
| Fichier | Raison |
|---|---|
| `ProbabilityTreeDraw_OLD.bak` | Backup dans le repo |
| `Components/Tools/etude-de-fonction-rationnelle.bak` | Backup dans le repo |
| `Components/Keyboards/KeyboardStudy.disabled` | Fichier désactivé |
| `Components/Languages/LanguageDecks_BACKUP.bkp` | Backup dans le repo |
| `types/modelInterfaces.ts` | Après migration vers fichiers domaine |

### Dossiers à créer 🆕
| Dossier | Contenu |
|---|---|
| `config/` | `block.config.ts`, `checker.config.ts`, `keyboard.config.ts` |
| `lib/` | `asciimath2tex.ts`, `ProbabilityTree.ts`, `PiMathExtended/` |
| `Components/Layout/` | `MainHeader`, `MainFooter`, `MainAside`, `MoveItemTo` |
| `Components/Search/` | `ScolcoursSearch`, `FormulaSearch` |
| `Components/Formulas/` | `FormulaShow` (déplacé depuis `Components/Blocks/`) |
| `Components/Generators/` | `GeneratorItem`, `GeneratorsExamples` (depuis `Elements/`) |

### Composables mal placés à déplacer 🔀
| Source | Destination |
|---|---|
| `Pages/Courses/useCourse.ts` | `Composables/useCourse.ts` |
| `Components/Questions/useQuestion*.ts` (4 fichiers) | `Composables/useQuestion*.ts` |
| `Components/Widgets/useWidget.ts` | `Composables/useWidget.ts` |
| `Components/Languages/useLanguage.ts` | `Composables/useLanguage.ts` |
| `Composables/keyboardConfig.ts` | `config/keyboard.config.ts` |

### Renommages à faire ✏️
| Avant | Après | Raison |
|---|---|---|
| `types/resourseInterfaces.ts` | `types/resourceInterfaces.ts` | Faute d'orthographe |
| `types/challengeInterface.ts` | `types/challengeInterfaces.ts` | Cohérence pluriel |
| `Components/Widgets/theee-parser-widget.vue` | `three-parser-widget.vue` | Faute de frappe |
| `Components/Widgets/Card-widget.vue` | `card-widget.vue` | Convention kebab-case |
| `Pages/languages/` | `Pages/Languages/` | Convention PascalCase |

### Points de discussion ⚠️
- **`Components/Elements/`** : son contenu est mieux distribué vers les domaines respectifs (`Decks/`, `Generators/`, `Tools/Parts/`). Le dossier peut disparaître.
- **`Components/Grapheur/`** : un seul composant `GrapheurFunction.vue`. À intégrer dans `Components/Tools/` ou `Components/Pi/` selon sa nature.
- **`WidgetForm.vue`** à la racine de `Components/` : à déplacer dans `Components/Widgets/`.
- **`helpers/liste-des-mots-francais*.js`** : données statiques en JS pur dans un dossier de helpers TS. À déplacer dans `public/data/` si elles sont volumineuses, ou garder si l'import dynamique le justifie.

---

## Conventions API backend

### Pas de wrapping `data` sur les JSON Resources

`JsonResource::withoutWrapping()` est appelé globalement dans `AppServiceProvider::boot()` (`app/Providers/AppServiceProvider.php`). Les réponses des `Resource` ne sont donc **pas** enveloppées dans une clé `data`.

Conséquences :
- **Côté front** : lire directement `res.data.id` (et non `res.data.data.id`) après un appel axios.
- **Côté test** : `assertJsonPath('id', …)` sans préfixe `data.`.
- Certaines Resources re-déclarent en plus `public static $wrap = null;` localement (ceinture + bretelles) — inutile mais inoffensif.

### 201 automatique sur duplication / création

Renvoyer une `Resource` qui enveloppe un modèle fraîchement persisté (`wasRecentlyCreated === true`) fait répondre Laravel en **201 Created** automatiquement (ex. `PostApiController::duplicate`, `store`). Les tests doivent asserter `201`, pas `200`.
