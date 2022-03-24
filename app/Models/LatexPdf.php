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
 * @method static Builder|LatexPdf newModelQuery()
 * @method static Builder|LatexPdf newQuery()
 * @method static Builder|LatexPdf query()
 * @method static Builder|LatexPdf whereCreatedAt($value)
 * @method static Builder|LatexPdf whereId($value)
 * @method static Builder|LatexPdf whereName($value)
 * @method static Builder|LatexPdf whereSlug($value)
 * @method static Builder|LatexPdf whereUpdatedAt($value)
 * @method static Builder|LatexPdf whereUrl($value)
 * @mixin Eloquent
 */
class LatexPdf extends Model
	{
		protected $guarded=[];
	}
