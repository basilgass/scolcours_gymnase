# Instructions du projet SCOLCOURS

Ce document contient les règles et workflows spécifiques à ce projet.

## Project Documentation

Les documentations pour le site sont placés dans `./.claude/docs`. Analyse ces informations avant de faire des
changements structurels.

# workflow-instructions

## Processus de modification du code

Avant toute modification de code, tu DOIS suivre ce processus en 3 étapes :

### Étape 1 : Analyse et questions

- Analyse la demande et identifie tous les points d'ambiguïté ou les choix à faire
- Pose TOUTES les questions nécessaires avant de proposer un plan
- Groupe toutes les questions en une seule fois (ne pose pas les questions une par une)
- Ne passe pas à l'étape suivante tant que toutes les questions n'ont pas été répondues

### Étape 2 : Plan préliminaire des modifications

Une fois toutes les questions répondues, présente un plan détaillé et numéroté comprenant :

- La liste numérotée de TOUS les fichiers qui seront modifiés
- Pour chaque fichier : la nature exacte de la modification (renommage, ajout, suppression, modification de contenu)
- Les changements de code spécifiques (ancienne valeur → nouvelle valeur) pour les modifications importantes
- Les risques potentiels identifiés
- Les tests à exécuter après les modifications

### Étape 3 : Validation et exécution

- Attends ma validation explicite du plan avant de commencer les modifications
- Les réponses acceptées pour validation sont : "oui", "ok", "valide", "go", "procède"
- Si je demande des ajustements, retourne à l'étape 2 avec le plan modifié
- Une fois validé, exécute les modifications et signale chaque étape complétée

## Format du plan

Le plan doit suivre ce format :

```markdown
# Plan de modification : [Titre de la tâche]

## Questions préalables (si applicable)

1. question 1 ?
2. question 2 ?
   [attendre les répons avant de continuer]

## Modifications prévues

### [Catégorie] - [Description]

Fichiers concernés : chemin/vers/fichier.ext Action : [Créer / Modifier / Supprimer / Renommer] Détails :

- Changement 1 : ancienne_valeur → nouvelle_valeur
- Changement 2 : ...

### [Catégorie] - [Description]

...

## Risques identifiés

- Risque 1
- Risque 2

## Résumé

- X fichiers à modifier
- Y classes/fonctions impactées
- Temps estimé : Z minutes
```

## Exceptions

Ce processus ne s'applique PAS dans les cas suivants :

- Questions simples ne nécessitant pas de modification de code
- Demandes explicites de lecture/analyse de code
- Débogage où l'exploration est nécessaire avant de comprendre le problème

## Après complétion d'une tâche de refactoring

Lorsqu'une tâche de refactoring issue du fichier `.claude/docs/refactoring_plan_*.md` est terminée :

- Tu DOIS demander à l'utilisateur : "La tâche [ID] est terminée. Veux-tu que je déplace la tâche dans la section
  terminée du
  refactoring_plan_*.md ?"
- Attendre la réponse de l'utilisateur (oui/non)
- Si oui : supprimer la tâche des 3 sections du document (tableau vue d'ensemble, fiche détaillée, ordre
  recommandé/sprint) et ajouter à la fin du fichier une ligne dans le tableau de la section terminée avec l'ID de la
  tâche, le titre, la date de la fin de la tâche et une brève description de ce qui a été fait.
- Si non : ne rien faire et passer à la suite
