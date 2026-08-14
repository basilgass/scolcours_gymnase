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
 * @property string $generatorable_type
 * @property int $generatorable_id
 * @property string|null $label
 * @property int $order
 * @property string|null $config
 * @property string|null $parameters
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereGeneratorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereGeneratorableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereGeneratorableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Generatorable whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Generatorable extends MorphPivot
{
    protected $table = 'generatorables';

    public $incrementing = true;

    public $timestamps = true;
}