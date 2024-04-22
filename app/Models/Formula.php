<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Formula
 *
 * @property int $id
 * @property int $chapter_id
 * @property int|null $order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Chapter $chapter
 * @method static Builder|Formula newModelQuery()
 * @method static Builder|Formula newQuery()
 * @method static Builder|Formula query()
 * @method static Builder|Formula whereChapterId($value)
 * @method static Builder|Formula whereCreatedAt($value)
 * @method static Builder|Formula whereId($value)
 * @method static Builder|Formula whereOrder($value)
 * @method static Builder|Formula whereUpdatedAt($value)
 * @mixin Eloquent
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
