<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Formula
 *
 * @property int $id
 * @property int $chapter_id
 * @property int|null $order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Block[] $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Chapter $chapter
 * @method static \Illuminate\Database\Eloquent\Builder|Formula newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Formula newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Formula query()
 * @method static \Illuminate\Database\Eloquent\Builder|Formula whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formula whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formula whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formula whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Formula whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Formula extends Model
{
    use HasFactory;

	protected $guarded=[];
	protected $with = ['blocks'];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable');
	}
}
