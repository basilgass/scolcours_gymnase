<?php

	namespace App\Models;

	use Eloquent;
	use Illuminate\Database\Eloquent\Builder;
	use Illuminate\Database\Eloquent\Model;
	use Illuminate\Support\Carbon;

	/**
 * App\Models\Tool
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $body
 * @property string $parameters
 * @property int|null $theme_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder<static>|Tool newModelQuery()
 * @method static Builder<static>|Tool newQuery()
 * @method static Builder<static>|Tool query()
 * @method static Builder<static>|Tool whereBody($value)
 * @method static Builder<static>|Tool whereCreatedAt($value)
 * @method static Builder<static>|Tool whereId($value)
 * @method static Builder<static>|Tool whereParameters($value)
 * @method static Builder<static>|Tool whereSlug($value)
 * @method static Builder<static>|Tool whereThemeId($value)
 * @method static Builder<static>|Tool whereTitle($value)
 * @method static Builder<static>|Tool whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Tool extends Model
	{
		protected $guarded=[];
	}
