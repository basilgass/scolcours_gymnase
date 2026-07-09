# Idées et choses à faire

Liste des petites choses à faire.

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
