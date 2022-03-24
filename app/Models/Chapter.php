<?php

namespace App\Models;

use Database\Factories\ChapterFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Chapter
 *
 * @property int $id
 * @property int $theme_id
 * @property string $slug
 * @property string $title
 * @property string $body
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Theme $theme
 * @method static ChapterFactory factory(...$parameters)
 * @method static Builder|Chapter newModelQuery()
 * @method static Builder|Chapter newQuery()
 * @method static Builder|Chapter query()
 * @method static Builder|Chapter whereBody($value)
 * @method static Builder|Chapter whereCreatedAt($value)
 * @method static Builder|Chapter whereId($value)
 * @method static Builder|Chapter whereSlug($value)
 * @method static Builder|Chapter whereThemeId($value)
 * @method static Builder|Chapter whereTitle($value)
 * @method static Builder|Chapter whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Chapter extends Model
{
		use HasFactory;
    protected $guarded = [];

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

	public function posts()
	{
		$this->hasMany(Post::class);
	}
}
