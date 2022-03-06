<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Chapter
 *
 * @property int $id
 * @property int $theme_id
 * @property string $slug
 * @property string $title
 * @property string $body
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Theme $theme
 * @method static \Database\Factories\ChapterFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter query()
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter whereThemeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Chapter whereUpdatedAt($value)
 * @mixin \Eloquent
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
