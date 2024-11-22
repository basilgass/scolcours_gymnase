<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * App\Models\Theme
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property int $order
 * @property string $color
 * @property string|null $icon
 * @property int $enabled
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Chapter> $chapters
 * @property-read int|null $chapters_count
 * @property-read Collection<int, Generator> $generators
 * @property-read int|null $generators_count
 * @property-read Collection<int, Widget> $widgets
 * @property-read int|null $widgets_count
 * @method static Builder|Theme newModelQuery()
 * @method static Builder|Theme newQuery()
 * @method static Builder|Theme query()
 * @method static Builder|Theme whereColor($value)
 * @method static Builder|Theme whereCreatedAt($value)
 * @method static Builder|Theme whereEnabled($value)
 * @method static Builder|Theme whereIcon($value)
 * @method static Builder|Theme whereId($value)
 * @method static Builder|Theme whereOrder($value)
 * @method static Builder|Theme whereSlug($value)
 * @method static Builder|Theme whereTitle($value)
 * @method static Builder|Theme whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Theme extends Model
{
    protected $guarded = [];

    public static function getTheme($id): Theme
    {
        $theme =  Theme::getThemesFromCache()->firstWhere('id', $id);

        // Maybe, the searched theme is inactive.
        return $theme ?? Theme::find($id);
    }

    /**
     * @return Collection|Theme[]
     */
    public static function getThemesFromCache(): Collection
    {
        return Cache::rememberForever('themes', function () {
            return self::where('enabled', 1)->get();
        });
    }

    protected static function boot(): void
    {
        parent::boot();

        // Refresh cache on save or delete
        static::saved(function () {
            self::refreshCache();
        });

        static::deleted(function () {
            self::refreshCache();
        });
    }

    /**
     * @return Collection|Theme[]
     */
    public static function refreshCache(): Collection
    {
        Cache::forget('themes');
        return self::getThemesFromCache();
    }

    public function resolveRouteBinding($value, $field = null)
    {
        // Fetch from cache
        $cachedTheme = self::getThemesFromCache();

        // Find the theme by the given field (id or slug)
        $field = $field ?? $this->getRouteKeyName();

        // Return the model from the cache.
        return $cachedTheme->firstWhere($field, $value);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

    public function widgets()
    {
        return $this->hasMany(Widget::class);
    }

    public function generators()
    {
        return $this->hasMany(Generator::class);
    }

}
