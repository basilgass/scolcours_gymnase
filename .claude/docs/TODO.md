# Todo

- dans la page `/...theme...`, on charge les challenges. La requête charge également les générateurs, de manière
  inutile.

- la route `tools` peut venir de `tools.index` ou de `themes.show` avec le slug `tools`. A améliorer.

# Liste des petites choses à faire.

## Keyboards

### information

créé un bouton dans les claviers pour afficher une documentation d'utilisation du clavier.

## Score

### score.reset

Les étudiants doivent pouvoir réinitilaiser leur score. Il faut créer l'UI, la route et, dans ScoreApiController, il
faut ajouter

```php
public function reset(Score $score)
	{
		$score->score = 0;
		$score->is_resolved = false;
		$score->attempts = 0;
		$score->data = NULL;
		$score->save();
		$score->refresh();

		return ScoreResource::make($score);
	}
```

# tools

## tracer_un_graphe.vue

Un composant `tools` qui permet de tracer une courbe sans passer par l'expression fonctionnelle.

- ajouter des repères (AV, AH, AO, points, min/max/replat)
- tracer les courbes en utilisant des courbes de bézier.
- 

