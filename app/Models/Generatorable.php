<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\MorphPivot;

/**
 * App\Models\Generatorable
 *
 * Ligne de pivot polymorphique reliant un Generator à un generatorable
 * (ChallengeLevel, Evaluation, ...). Possède une clé primaire propre, ce qui
 * permet d'attacher plusieurs fois le même générateur avec des configurations
 * distinctes et de cibler une ligne précise (route-model-binding + update).
 *
 * @property int $id
 * @property int $generator_id
 * @property int $generatorable_id
 * @property string $generatorable_type
 * @property int $order
 * @property string|null $config
 * @property string|null $parameters
 */
class Generatorable extends MorphPivot
{
    protected $table = 'generatorables';

    public $incrementing = true;

    public $timestamps = true;
}