<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Block
 *
 * @property int $id
 * @property int|null $order
 * @property string|null $title
 * @property string|null $body
 * @property string $type
 * @property string|null $template
 * @property string|null $illustrationsGrid
 * @property string|null $script
 * @property int|null $switch
 * @property mixed|null $json
 * @property string $blockable_type
 * @property int $blockable_id
 * @property int $blur
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Model|\Eloquent $blockable
 * @property-read Collection<int, \App\Models\Illustration> $illustrations
 * @property-read int|null $illustrations_count
 * @method static Builder|Block newModelQuery()
 * @method static Builder|Block newQuery()
 * @method static Builder|Block query()
 * @method static Builder|Block whereBlockableId($value)
 * @method static Builder|Block whereBlockableType($value)
 * @method static Builder|Block whereBlur($value)
 * @method static Builder|Block whereBody($value)
 * @method static Builder|Block whereCreatedAt($value)
 * @method static Builder|Block whereId($value)
 * @method static Builder|Block whereIllustrationsGrid($value)
 * @method static Builder|Block whereJson($value)
 * @method static Builder|Block whereOrder($value)
 * @method static Builder|Block whereScript($value)
 * @method static Builder|Block whereSwitch($value)
 * @method static Builder|Block whereTemplate($value)
 * @method static Builder|Block whereTitle($value)
 * @method static Builder|Block whereType($value)
 * @method static Builder|Block whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Block extends Model
{
    use HasFactory;

	protected $guarded = [];
	protected $with=['illustrations'];

	public function illustrations()
	{
		return $this->hasMany(Illustration::class)->orderBy('order')->orderBy('id');
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
