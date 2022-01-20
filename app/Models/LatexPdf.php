<?php
	
	namespace App\Models;
	
	use Illuminate\Database\Eloquent\Model;
	
	/**
 * App\Models\LatexPdf
 *
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string $url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf query()
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LatexPdf whereUrl($value)
 * @mixin \Eloquent
 */
class LatexPdf extends Model
	{
		protected $guarded=[];
	}