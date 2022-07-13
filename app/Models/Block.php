<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Block
 *
 * @property int $id
 * @property int|null $order
 * @property string|null $title
 * @property string|null $body
 * @property string|null $script
 * @property int|null $switch
 * @property string|null $json
 * @property string $blockable_type
 * @property int $blockable_id
 * @property int $blur
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Model|\Eloquent $blockable
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Illustration[] $illustrations
 * @property-read int|null $illustrations_count
 * @method static \Illuminate\Database\Eloquent\Builder|Block newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Block newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Block query()
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereBlockableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereBlockableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereBlur($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereJson($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereScript($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereSwitch($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Block whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Block extends Model
{
    use HasFactory;

	protected $guarded = [];
	protected $with=['illustrations'];

	public function illustrations()
	{
		return $this->hasMany(Illustration::class);
	}

	public function blockable()
	{
		return $this->morphTo();
	}

	public function duplicate()
	{
		$clonedBlock = $this->replicate();
		$clonedBlock->push();
		foreach ($this->illustrations as $illustration){
			$clonedBlock->illustrations()->create( [
				'title'=>$illustration->title,
				'type'=>$illustration->type,
				'code'=>$illustration->code,
				'parameters'=>$illustration->parameters
			]);
		}

		return $clonedBlock;
	}
}
