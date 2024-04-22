<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

/**
 * App\Models\Block
 *
 * @property int $id
 * @property int|null $order
 * @property bool|null $merge
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
 * @property-read mixed $url
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
 * @method static Builder|Block whereMerge($value)
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
	protected $with = ['illustrations'];

	protected $casts = [
		'merge' => 'boolean'
	];

	public function blockable()
	{
		return $this->morphTo();
	}

	public function duplicate()
	{
		// Duplicate the block
		$clonedBlock = $this->replicate();
		$clonedBlock->push();

		// Duplicate the illustrations.
		foreach ($this->illustrations as $illustration) {
			$clonedBlock->illustrations()->create([
				'title'      => $illustration->title,
				'type'       => $illustration->type,
				'code'       => $illustration->code,
				'parameters' => $illustration->parameters
			]);
		}

		$clonedBlock->save();
		$clonedBlock->refresh();

		return $clonedBlock;
	}

	public function illustrations()
	{
		return $this->hasMany(Illustration::class)->orderBy('order')->orderBy('id');
	}

	protected function url(): Attribute
	{
		return Attribute::make(
			get: fn() => URL::route('blocks.show', [$this->id], false)
//			get: fn() => [$this->chapter->theme->slug, $this->chapter->slug, $this->order]
		);
	}

	/**
	 * Consolidate the blocks order
	 * Take the actual order and modify the "order" to match the index.
	 * @return Collection
	 */
	public function consolidateBlocksOrder(): Collection
	{
		// Get the blocks
		$blocks = $this->blockable->blocks;

		// Update the order to match the index.
		foreach ($blocks as $index => $block) {
			$block->order = $index;
			$block->save();
		}

		return $blocks;
	}
}
