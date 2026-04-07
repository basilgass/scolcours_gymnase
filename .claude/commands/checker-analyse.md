# Analyse complète d'un Checker TypeScript

Tu es en train d'analyser un checker du projet SCOLCOURS.

## Argument

Checker cible : **$ARGUMENTS**

Si `$ARGUMENTS` est vide, liste tous les checkers disponibles dans `resources/js/Checkers/` (y compris sous-dossiers `Basic/` et `Custom/`) et demande à l'utilisateur lequel analyser.

## Étapes à suivre dans l'ordre

### Étape 1 — Analyse du fichier source

Lance le skill `file-analyse` sur le fichier checker correspondant à `$ARGUMENTS`. Le fichier se trouve dans `resources/js/Checkers/` ou dans ses sous-dossiers `Basic/` ou `Custom/`. Si `$ARGUMENTS` ne contient pas de chemin complet, cherche le fichier automatiquement.

### Étape 2 — Identification et exécution des tests

1. Trouve le fichier de test correspondant dans `tests/ts/Checkers/` (même logique de sous-dossiers Basic/Custom).
2. Si un fichier de test existe, exécute-le avec la commande appropriée (ex: `npx vitest run tests/ts/Checkers/...`).
3. Affiche le résultat des tests (succès / échecs / couverture si disponible).

### Étape 3 — Vérification de l'intégrité tests ↔ checker

Compare le fichier checker et son fichier de test :

- **Méthodes non couvertes** : méthodes/fonctions du checker sans aucun test
- **Cas limites absents** : valeurs nulles, chaînes vides, types inattendus, etc.
- **Tests obsolètes** : tests qui testent des comportements qui n'existent plus dans le checker
- **Incohérences de nommage** : différences entre les noms dans le checker et dans les tests

Présente ces résultats sous forme de tableau structuré.

### Étape 4 — Améliorations issues de l'analyse (`file-analyse`)

Reprend les points identifiés par le skill `file-analyse` et présente-les comme suggestions concrètes d'amélioration du checker, avec pour chacune :
- La nature du problème
- L'emplacement précis (fichier:ligne)
- La correction proposée

### Étape 4b — Vérification du placement des contrôles

Pour chaque contrôle présent dans `checkFormat` et `checkValue`, détermine s'il est dans la bonne méthode selon cette distinction :

- **`checkFormat`** : valide que la valeur est syntaxiquement correcte et respecte le standard attendu (ex: est-ce un nombre ? une fraction bien formée ? un format reconnu ?). Ne fait aucune comparaison avec la réponse attendue.
- **`checkValue`** : compare la valeur (supposée valide) avec la réponse attendue. Peut donner des scores partiels et des messages pédagogiques.

Présente le résultat sous forme de tableau :

| Contrôle | Emplacement actuel | Emplacement correct | Justification |
|----------|-------------------|---------------------|---------------|
| ...      | `checkFormat`     | `checkFormat`       | ...           |
| ...      | `checkValue`      | `checkFormat`       | ...           |

Si des contrôles sont mal placés, signale-les comme problèmes à corriger (avec ID, ex: P3, P4...) et intègre-les au tableau de l'étape 5.

### Étape 5 — Améliorations et compléments supplémentaires

En te basant sur ta connaissance du contexte du projet (système de checkers mathématiques pour un gymnase), propose :

- Des cas d'usage non gérés qui pourraient survenir
- Des améliorations de robustesse ou de lisibilité
- Des tests manquants à haute valeur ajoutée
- Toute opportunité d'harmonisation avec les autres checkers du projet

---

Présente les étapes 3, 4 et 5 de façon claire et actionnable, en distinguant ce qui est urgent de ce qui est optionnel.

### Étape 6 — Mise à jour du suivi (après modifications)

Une fois toutes les modifications du checker et de ses tests terminées et validées, propose à l'utilisateur :

> "Veux-tu que je mette à jour `.claude/docs/checkers.md` avec la date d'aujourd'hui pour **[NomDuChecker]** ?"

Si l'utilisateur répond oui (ou variante : "oui", "ok", "go", "valide") :
1. Lis le fichier `.claude/docs/checkers.md`
2. Trouve la ligne correspondant au checker analysé (cherche le nom exact du checker dans la colonne Checker)
3. Remplace le `—` (ou la date existante) dans la colonne "Dernier `/checker-analyse`" par la date du jour au format `YYYY-MM-DD`
4. À la fin du fichier, ajoute un tableau pour le checker analysé listant tous les contrôles effectués par le checker. Le tableau doit avoir la structure suivante :

```markdown
### [NomDuChecker] — Tableau des contrôles

| Bonne réponse | Mauvaise réponse | Score | Message renvoyé |
|---------------|-----------------|-------|-----------------|
| ...           | ...             | ...   | ...             |
```

Chaque ligne du tableau correspond à un cas de contrôle identifié dans le checker (et ses tests). Déduis les cas depuis le code source et les tests existants.

Trie les lignes par score croissant : score 0 (ou absent, considéré comme 0) en premier, puis 0.5, 0.7, 1, etc. Les lignes de `checkFormat` (score `—`) sont considérées comme score 0 et placées en tête.

5. Confirme la mise à jour à l'utilisateur