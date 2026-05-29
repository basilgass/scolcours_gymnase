# Déploiement — scolcours_gymnase

Aide-mémoire pour le déploiement manuel en production sur `g.scolcours.ch`.

## Pré-requis local (avant `git push`)

Sur ta machine de dev, avant de pousser :

```bash
npm run build        # assets Vite — pas de Node.js sur le serveur
git add public/build
git commit -m "build assets"
git push
```

## Procédure de déploiement sur le serveur

À exécuter dans l'ordre, depuis la racine du projet sur le serveur.

### 1. Vérifier / basculer la version PHP

```bash
php -v               # doit afficher PHP 8.5.x
```

Si mauvaise version : ajuster le profil shell pour pointer vers le bon binaire PHP.

### 2. Passer en mode maintenance

```bash
php artisan down
```

Les requêtes HTTP affichent la page de maintenance. Les commandes Artisan continuent de fonctionner normalement.

### 3. Récupérer le code

```bash
git pull --ff-only
```

`--ff-only` refuse de merger automatiquement : signale tout désalignement avec le serveur.

### 4. Mettre à jour les dépendances Composer

```bash
composer install --no-dev --optimize-autoloader --no-interaction
```

`--no-dev` exclut Telescope, Ignition, PHPUnit, etc. (gain de mémoire et de surface d'attaque).

### 5. Vérifier et appliquer les migrations

```bash
php artisan migrate:status
php artisan migrate --force      # uniquement si des migrations sont en attente
```

`--force` est obligatoire en prod pour passer outre le prompt interactif.

### 6. Régénérer les caches

```bash
php artisan optimize
```

Regroupe `config:cache`, `route:cache`, `view:cache`, `event:cache`.

> En cas de souci suspecté avec d'anciens caches : `php artisan optimize:clear` avant `optimize`.

### 7. Régénérer le sitemap

```bash
php artisan sitemap:generate
```

Met à jour `public/sitemap.xml` avec les chapitres, formules, outils, decks, challenges et generators actuellement actifs.

### 8. Remettre le site en ligne

```bash
php artisan up
```

## Checklist post-déploiement

- [ ] Accueil `https://g.scolcours.ch/` charge correctement
- [ ] Un chapitre récent s'ouvre (test rapide d'un cours)
- [ ] `https://g.scolcours.ch/robots.txt` répond HTTP 200
- [ ] `https://g.scolcours.ch/sitemap.xml` répond HTTP 200 et contient les nouvelles URLs

## En cas d'échec en cours de déploiement

Le site reste en mode maintenance jusqu'à ce que `php artisan up` soit exécuté.

1. Corriger le problème.
2. Si nécessaire : `git reset --hard <commit-précédent>` pour revenir en arrière.
3. Reprendre la procédure depuis l'étape qui a échoué.
4. Toujours finir par `php artisan up`.

## Référence rapide (copier-coller)

```bash
php artisan down && \
git pull --ff-only && \
composer install --no-dev --optimize-autoloader --no-interaction && \
php artisan migrate --force && \
php artisan optimize && \
php artisan sitemap:generate && \
php artisan up
```

> ⚠️ Le `&&` interrompt la chaîne au premier échec. Si une étape plante, le site reste en `down` — il faut alors corriger puis relancer `php artisan up` manuellement.

## Dépannage

### `git pull` bloqué : « Your local changes would be overwritten by merge »

**Cause typique :** un `composer update` a été lancé par erreur sur le serveur, ce qui a modifié `composer.lock` localement. Git refuse alors de tirer pour ne pas écraser cette modif.

**Règle d'or :** en prod, **toujours `composer install`**, jamais `composer update`. `composer.lock` doit être figé sur le serveur et provenir uniquement du repo.

**Sortie du blocage :**

```bash
git status                                       # confirmer ce qui est modifié
git stash                                        # mettre la modif de côté
git pull --ff-only                               # passe maintenant
git stash drop                                   # supprimer (on ne veut pas la modif)
composer install --no-dev --optimize-autoloader  # restaurer le bon état
```

> ⚠️ Surtout pas `git stash pop` : on jette la modif fautive, on ne la réapplique pas.

### `git pull` bloqué : « Your branch and 'origin/main' have diverged »

**Cause typique :** un commit a été créé directement sur le serveur (rare, souvent accidentel via un `git commit` au lieu de `git stash`).

**Diagnostic :**

```bash
git log --oneline -5 main           # commits locaux serveur
git log --oneline -5 origin/main    # commits sur le remote
```

**Sortie du blocage (après confirmation que le commit local ne contient rien à sauver) :**

```bash
git reset --hard origin/main
```

> ⚠️ `reset --hard` est destructif : il supprime définitivement les commits locaux du serveur. À n'utiliser qu'après vérification.

### Site bloqué en mode maintenance

Si une étape du déploiement a échoué et que le site reste en `down` après correction :

```bash
php artisan up
```

Si même `up` échoue (cache de config corrompu, par exemple) :

```bash
php artisan optimize:clear
php artisan up
```
