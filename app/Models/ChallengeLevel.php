<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * App\Models\ChallengeLevel
 *
 * @property int $id
 * @property int $challenge_id
 * @property int $level_number
 * @property int $points_to_pass
 * @property array<string, int>|null $bonus
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Challenge $challenge
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Generator> $generators
 * @property-read int|null $generators_count
 * @mixin \Eloquent
 */
class ChallengeLevel extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'bonus' => 'array',
        ];
    }

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class);
    }

    public function generators(): MorphToMany
    {
        return $this
            ->morphToMany(Generator::class, 'generatorable')
            ->withPivot('order', 'config')
            ->orderByPivot('order');
    }
}