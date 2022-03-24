<?php

	namespace App\Models;

	use Eloquent;
	use Illuminate\Database\Eloquent\Builder;
	use Illuminate\Database\Eloquent\Model;
	use Illuminate\Support\Carbon;

	/**
 * App\Models\Tools
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $body
 * @property string $parameters
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|Tools newModelQuery()
 * @method static Builder|Tools newQuery()
 * @method static Builder|Tools query()
 * @method static Builder|Tools whereBody($value)
 * @method static Builder|Tools whereCreatedAt($value)
 * @method static Builder|Tools whereId($value)
 * @method static Builder|Tools whereParameters($value)
 * @method static Builder|Tools whereSlug($value)
 * @method static Builder|Tools whereTitle($value)
 * @method static Builder|Tools whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Tools extends Model
	{
		protected $guarded=[];
	}
