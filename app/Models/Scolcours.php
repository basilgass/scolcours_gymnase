<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Scolcours
 *
 * @property int $id
 * @property string $title
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Scolcours newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Scolcours newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Scolcours query()
 * @method static \Illuminate\Database\Eloquent\Builder|Scolcours whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scolcours whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scolcours whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scolcours whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Scolcours extends Model
{
    use HasFactory;
}
