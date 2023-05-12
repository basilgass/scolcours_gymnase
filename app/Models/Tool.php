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
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|Tool newModelQuery()
 * @method static Builder|Tool newQuery()
 * @method static Builder|Tool query()
 * @method static Builder|Tool whereBody($value)
 * @method static Builder|Tool whereCreatedAt($value)
 * @method static Builder|Tool whereId($value)
 * @method static Builder|Tool whereParameters($value)
 * @method static Builder|Tool whereSlug($value)
 * @method static Builder|Tool whereTitle($value)
 * @method static Builder|Tool whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Tool extends Model
	{
		protected $guarded=[];
	}
