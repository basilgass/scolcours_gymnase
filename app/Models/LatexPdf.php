<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\LatexPdf
 *
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string $url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder<static>|LatexPdf newModelQuery()
 * @method static Builder<static>|LatexPdf newQuery()
 * @method static Builder<static>|LatexPdf query()
 * @method static Builder<static>|LatexPdf whereCreatedAt($value)
 * @method static Builder<static>|LatexPdf whereId($value)
 * @method static Builder<static>|LatexPdf whereName($value)
 * @method static Builder<static>|LatexPdf whereSlug($value)
 * @method static Builder<static>|LatexPdf whereUpdatedAt($value)
 * @method static Builder<static>|LatexPdf whereUrl($value)
 * @mixin Eloquent
 */
class LatexPdf extends Model
{
	protected $guarded = [];
	protected $hidden = ['created_at', 'updated_at'];

}

