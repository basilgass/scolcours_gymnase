<?php

	namespace App\Models;

	use Illuminate\Database\Eloquent\Model;

	/**
 * App\Models\Tools
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $description
 * @property string $parameters
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Tools newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tools newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tools query()
 * @method static \Illuminate\Database\Eloquent\Builder|Tools whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tools whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tools whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tools whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tools whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tools whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tools whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Tools extends Model
	{
		protected $guarded=[];
	}
